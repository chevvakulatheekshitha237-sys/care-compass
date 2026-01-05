import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action } = await req.json();

    if (action === "delete_all_data") {
      // Delete all symptom messages first (due to FK constraints)
      const { error: messagesError } = await supabase
        .from("symptom_messages")
        .delete()
        .eq("session_id", user.id)
        .using("INNER JOIN", "symptom_sessions", "symptom_sessions.id = symptom_messages.session_id");

      // Delete all symptom sessions
      const { error: sessionsError } = await supabase
        .from("symptom_sessions")
        .delete()
        .eq("user_id", user.id);

      // Delete user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", user.id);

      // Log the deletion
      await supabase
        .from("audit_logs")
        .insert({
          user_id: user.id,
          table_name: "all_patient_data",
          action: "DELETE",
          changes: { action: "complete_data_deletion", timestamp: new Date().toISOString() },
        });

      if (messagesError || sessionsError || profileError) {
        return new Response(
          JSON.stringify({ error: "Failed to delete data", details: { messagesError, sessionsError, profileError } }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "All patient data has been securely deleted",
          deletedAt: new Date().toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
