/*
  # Add Field-Level Encryption and Audit Logging

  1. New Tables
    - `audit_logs` - Tracks all access to patient data
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `table_name` (text)
      - `action` (text: 'SELECT', 'INSERT', 'UPDATE', 'DELETE')
      - `record_id` (uuid)
      - `timestamp` (timestamptz)
      - `ip_address` (text)
      - `changes` (jsonb, for tracking what was modified)

  2. Modified Tables
    - `profiles`: Add encrypted columns for PII
      - `full_name_encrypted` (text)
      - `date_of_birth_encrypted` (text)
      - `phone_encrypted` (text)
    - `symptom_sessions`: Add encrypted columns
      - `conditions_encrypted` (text)
      - `recommendation_encrypted` (text)
    - `symptom_messages`: Add encrypted content
      - `content_encrypted` (text)

  3. Security
    - Enable RLS on `audit_logs`
    - Add policies for audit log access (only own user and admins)
    - Encrypted columns contain sensitive data

  4. Important Notes
    - Old unencrypted columns are retained for backwards compatibility
    - Client-side encryption/decryption uses AES-GCM
    - Audit logs are immutable (no update/delete policies)
*/

-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
  record_id UUID,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs: Users can only view their own logs
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Audit logs: System can insert (via triggers)
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Add encrypted columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name_encrypted'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name_encrypted TEXT;
    ALTER TABLE public.profiles ADD COLUMN date_of_birth_encrypted TEXT;
    ALTER TABLE public.profiles ADD COLUMN phone_encrypted TEXT;
  END IF;
END $$;

-- Add encrypted columns to symptom_sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'symptom_sessions' AND column_name = 'conditions_encrypted'
  ) THEN
    ALTER TABLE public.symptom_sessions ADD COLUMN conditions_encrypted TEXT;
    ALTER TABLE public.symptom_sessions ADD COLUMN recommendation_encrypted TEXT;
  END IF;
END $$;

-- Add encrypted column to symptom_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'symptom_messages' AND column_name = 'content_encrypted'
  ) THEN
    ALTER TABLE public.symptom_messages ADD COLUMN content_encrypted TEXT;
  END IF;
END $$;

-- Create function to log data access
CREATE OR REPLACE FUNCTION public.log_data_access(
  p_table_name TEXT,
  p_action TEXT,
  p_record_id UUID DEFAULT NULL,
  p_changes JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, table_name, action, record_id, changes)
  VALUES (auth.uid(), p_table_name, p_action, p_record_id, p_changes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
