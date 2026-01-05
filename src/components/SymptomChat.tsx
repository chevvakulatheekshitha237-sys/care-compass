import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, X, AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UrgencyResult {
  level: "emergency" | "urgent" | "routine";
  conditions: string[];
  specialist: string;
  recommendation: string;
}

interface SymptomChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI health assistant. I'll help assess your symptoms and guide you to the right care. Please describe what symptoms you're experiencing.",
    timestamp: new Date(),
  },
];

const urgencyConfig = {
  emergency: {
    icon: AlertTriangle,
    label: "Emergency",
    className: "urgency-emergency",
    description: "Seek immediate medical attention",
  },
  urgent: {
    icon: Clock,
    label: "Urgent",
    className: "urgency-urgent",
    description: "See a doctor within 24 hours",
  },
  routine: {
    icon: CheckCircle,
    label: "Routine",
    className: "urgency-routine",
    description: "Schedule an appointment",
  },
};

const SymptomChat = ({ isOpen, onClose }: SymptomChatProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [urgencyResult, setUrgencyResult] = useState<UrgencyResult | null>(null);
  const [conversationStage, setConversationStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let aiResponse = "";
      let newUrgency: UrgencyResult | null = null;
      
      if (conversationStage === 0) {
        // First response - ask follow-up
        aiResponse = "I understand. Can you tell me:\n\n1. How long have you been experiencing this?\n2. On a scale of 1-10, how severe is the discomfort?\n3. Are there any other symptoms like fever, nausea, or dizziness?";
        setConversationStage(1);
      } else if (conversationStage === 1) {
        // Check for emergency keywords
        const lowerMessage = userMessage.toLowerCase();
        const emergencyKeywords = ["chest pain", "can't breathe", "unconscious", "severe bleeding", "heart"];
        const urgentKeywords = ["high fever", "severe", "10", "9", "intense pain"];
        
        if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
          newUrgency = {
            level: "emergency",
            conditions: ["Possible cardiac event", "Respiratory distress"],
            specialist: "Emergency Medicine",
            recommendation: "Please call emergency services (911) immediately or go to the nearest emergency room.",
          };
          aiResponse = "⚠️ Based on your symptoms, this requires immediate medical attention. Please call 911 or go to the nearest emergency room right away.";
        } else if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
          newUrgency = {
            level: "urgent",
            conditions: ["Possible infection", "Inflammatory condition"],
            specialist: "General Practitioner / Internist",
            recommendation: "You should see a doctor within the next 24 hours. Would you like to schedule an appointment?",
          };
          aiResponse = "Based on your symptoms, I recommend seeing a doctor within 24 hours. This could indicate an infection or inflammatory condition. Would you like me to show you available specialists?";
        } else {
          newUrgency = {
            level: "routine",
            conditions: ["Minor discomfort", "Common ailment"],
            specialist: "General Practitioner",
            recommendation: "Your symptoms appear manageable. Rest and monitor for changes. Consider scheduling a routine appointment.",
          };
          aiResponse = "Your symptoms appear to be manageable. I recommend rest, staying hydrated, and monitoring for any changes. If symptoms persist or worsen, consider scheduling an appointment with a general practitioner.";
        }
        
        setUrgencyResult(newUrgency);
        setConversationStage(2);
      } else {
        aiResponse = "Is there anything else I can help you with regarding your health concerns?";
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    simulateAIResponse(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl h-[80vh] glass-card-elevated rounded-3xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-routine animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Health Assistant</h3>
                <p className="text-xs text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 ${
                    message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="chat-bubble-ai px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Analyzing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Urgency Result Card */}
            {urgencyResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <div className="glass-card p-4 rounded-2xl space-y-4">
                  {/* Urgency Level */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${urgencyConfig[urgencyResult.level].className}`}>
                      {(() => {
                        const Icon = urgencyConfig[urgencyResult.level].icon;
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {urgencyConfig[urgencyResult.level].label} Care
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {urgencyConfig[urgencyResult.level].description}
                      </p>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Possible Conditions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {urgencyResult.conditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Specialist */}
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Recommended Specialist
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {urgencyResult.specialist}
                    </p>
                  </div>

                  {/* Action Button */}
                  {urgencyResult.level !== "emergency" && (
                    <Button variant="default" className="w-full">
                      Book Appointment
                    </Button>
                  )}
                  {urgencyResult.level === "emergency" && (
                    <Button variant="emergency" className="w-full">
                      Call Emergency Services
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 bg-muted/50 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              ⚕️ This is not a medical diagnosis. Always consult a healthcare professional.
            </p>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-muted rounded-full transition-colors">
                <Mic className="w-5 h-5 text-muted-foreground" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                className="flex-1 bg-muted rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SymptomChat;
