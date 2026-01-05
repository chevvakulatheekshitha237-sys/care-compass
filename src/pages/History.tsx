import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  ChevronRight,
  MessageSquare,
  Loader2,
  FileX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface SymptomSession {
  id: string;
  urgency_level: string | null;
  conditions: string[] | null;
  specialist: string | null;
  recommendation: string | null;
  created_at: string;
  messages?: { role: string; content: string }[];
}

type UrgencyLevel = "emergency" | "urgent" | "routine";

const urgencyConfig = {
  emergency: {
    icon: AlertTriangle,
    label: "Emergency",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  urgent: {
    icon: Clock,
    label: "Urgent",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  routine: {
    icon: CheckCircle,
    label: "Routine",
    className: "bg-routine/10 text-routine border-routine/20",
  },
};

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SymptomSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("symptom_sessions")
        .select(`
          id,
          urgency_level,
          conditions,
          specialist,
          recommendation,
          created_at,
          symptom_messages (
            role,
            content
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
      } else {
        setSessions(data?.map(session => ({
          ...session,
          messages: session.symptom_messages
        })) || []);
      }
      setLoading(false);
    };

    if (user) {
      fetchSessions();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Symptom History</h1>
          <p className="text-muted-foreground">
            Review your past symptom assessments and recommendations
          </p>
        </motion.div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileX className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No symptom history yet</h3>
            <p className="text-muted-foreground mb-6">
              Start a symptom check to get personalized health assessments
            </p>
            <Button onClick={() => navigate("/")}>
              Check Symptoms Now
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const urgencyLevel = session.urgency_level as UrgencyLevel | null;
              const urgency = urgencyLevel ? urgencyConfig[urgencyLevel] : null;
              const isExpanded = expandedSession === session.id;
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Session Header */}
                  <button
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(session.created_at)}</span>
                      </div>

                      {/* Urgency Badge */}
                      {urgency && (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm ${urgency.className}`}>
                          <urgency.icon className="w-3.5 h-3.5" />
                          <span className="font-medium">{urgency.label}</span>
                        </div>
                      )}

                      {/* Specialist */}
                      {session.specialist && (
                        <span className="text-sm text-foreground font-medium hidden sm:inline">
                          {session.specialist}
                        </span>
                      )}
                    </div>

                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border/50"
                    >
                      <div className="p-4 space-y-4">
                        {/* Conditions */}
                        {session.conditions && session.conditions.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Possible Conditions
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {session.conditions.map((condition, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                                >
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendation */}
                        {session.recommendation && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Recommendation
                            </p>
                            <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">
                              {session.recommendation}
                            </p>
                          </div>
                        )}

                        {/* Messages */}
                        {session.messages && session.messages.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              Conversation
                            </p>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {session.messages.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`text-sm p-2 rounded-lg ${
                                    msg.role === "user"
                                      ? "bg-primary/10 text-foreground ml-8"
                                      : "bg-muted text-muted-foreground mr-8"
                                  }`}
                                >
                                  {msg.content}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
