import { supabase } from "./client";
import { encryptData, decryptData } from "@/lib/encryption";

export interface EncryptedProfile {
  id: string;
  user_id: string;
  full_name?: string;
  date_of_birth?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EncryptedSymptomSession {
  id: string;
  user_id: string;
  urgency_level: "emergency" | "urgent" | "routine";
  conditions?: string[];
  specialist?: string;
  recommendation?: string;
  created_at: string;
}

export interface EncryptedMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Profile encryption/decryption
export async function encryptProfile(profile: Partial<EncryptedProfile>) {
  const encrypted: any = { ...profile };

  if (profile.full_name) {
    encrypted.full_name_encrypted = await encryptData(profile.full_name);
  }
  if (profile.date_of_birth) {
    encrypted.date_of_birth_encrypted = await encryptData(profile.date_of_birth);
  }
  if (profile.phone) {
    encrypted.phone_encrypted = await encryptData(profile.phone);
  }

  // Remove plain text versions
  delete encrypted.full_name;
  delete encrypted.date_of_birth;
  delete encrypted.phone;

  return encrypted;
}

export async function decryptProfile(
  encryptedProfile: any
): Promise<EncryptedProfile> {
  const decrypted: any = { ...encryptedProfile };

  try {
    if (encryptedProfile.full_name_encrypted) {
      decrypted.full_name = await decryptData(
        encryptedProfile.full_name_encrypted
      );
    }
    if (encryptedProfile.date_of_birth_encrypted) {
      decrypted.date_of_birth = await decryptData(
        encryptedProfile.date_of_birth_encrypted
      );
    }
    if (encryptedProfile.phone_encrypted) {
      decrypted.phone = await decryptData(encryptedProfile.phone_encrypted);
    }
  } catch (error) {
    console.error("Error decrypting profile:", error);
  }

  return decrypted;
}

// Symptom session encryption/decryption
export async function encryptSymptomSession(
  session: Partial<EncryptedSymptomSession>
) {
  const encrypted: any = { ...session };

  if (session.conditions) {
    encrypted.conditions_encrypted = await encryptData(
      JSON.stringify(session.conditions)
    );
  }
  if (session.recommendation) {
    encrypted.recommendation_encrypted = await encryptData(
      session.recommendation
    );
  }

  delete encrypted.conditions;
  delete encrypted.recommendation;

  return encrypted;
}

export async function decryptSymptomSession(
  encryptedSession: any
): Promise<EncryptedSymptomSession> {
  const decrypted: any = { ...encryptedSession };

  try {
    if (encryptedSession.conditions_encrypted) {
      const conditionsText = await decryptData(
        encryptedSession.conditions_encrypted
      );
      decrypted.conditions = JSON.parse(conditionsText);
    }
    if (encryptedSession.recommendation_encrypted) {
      decrypted.recommendation = await decryptData(
        encryptedSession.recommendation_encrypted
      );
    }
  } catch (error) {
    console.error("Error decrypting session:", error);
  }

  return decrypted;
}

// Message encryption/decryption
export async function encryptMessage(message: Partial<EncryptedMessage>) {
  const encrypted: any = { ...message };

  if (message.content) {
    encrypted.content_encrypted = await encryptData(message.content);
  }

  delete encrypted.content;

  return encrypted;
}

export async function decryptMessage(
  encryptedMessage: any
): Promise<EncryptedMessage> {
  const decrypted: any = { ...encryptedMessage };

  try {
    if (encryptedMessage.content_encrypted) {
      decrypted.content = await decryptData(encryptedMessage.content_encrypted);
    }
  } catch (error) {
    console.error("Error decrypting message:", error);
  }

  return decrypted;
}

// Audit logging
export async function logDataAccess(
  tableName: string,
  action: "SELECT" | "INSERT" | "UPDATE" | "DELETE",
  recordId?: string,
  changes?: Record<string, any>
) {
  try {
    const { error } = await supabase.from("audit_logs").insert({
      table_name: tableName,
      action,
      record_id: recordId,
      changes: changes || null,
    });

    if (error) {
      console.error("Error logging data access:", error);
    }
  } catch (error) {
    console.error("Error in logDataAccess:", error);
  }
}

// Secure data deletion
export async function secureDeleteAllPatientData() {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/secure-delete-patient-data`;

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      throw new Error("No active session");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.session.access_token}`,
      },
      body: JSON.stringify({ action: "delete_all_data" }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting patient data:", error);
    throw error;
  }
}

// Get audit log for current user
export async function getUserAuditLog() {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching audit log:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserAuditLog:", error);
    return [];
  }
}
