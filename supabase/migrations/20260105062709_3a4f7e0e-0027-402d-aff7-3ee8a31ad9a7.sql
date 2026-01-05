-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create symptom_sessions table to store chat sessions
CREATE TABLE public.symptom_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  urgency_level TEXT CHECK (urgency_level IN ('emergency', 'urgent', 'routine')),
  conditions TEXT[],
  specialist TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on symptom_sessions
ALTER TABLE public.symptom_sessions ENABLE ROW LEVEL SECURITY;

-- Symptom sessions RLS policies
CREATE POLICY "Users can view their own symptom sessions"
ON public.symptom_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own symptom sessions"
ON public.symptom_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own symptom sessions"
ON public.symptom_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Create symptom_messages table to store individual chat messages
CREATE TABLE public.symptom_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.symptom_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on symptom_messages
ALTER TABLE public.symptom_messages ENABLE ROW LEVEL SECURITY;

-- Symptom messages RLS policies (users can access messages from their own sessions)
CREATE POLICY "Users can view messages from their sessions"
ON public.symptom_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.symptom_sessions
    WHERE symptom_sessions.id = symptom_messages.session_id
    AND symptom_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their sessions"
ON public.symptom_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.symptom_sessions
    WHERE symptom_sessions.id = symptom_messages.session_id
    AND symptom_sessions.user_id = auth.uid()
  )
);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();