import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Brain, 
  Clock, 
  Shield, 
  Stethoscope, 
  Calendar,
  Mic,
  Globe
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Natural language chat interface that understands your symptoms in plain English.",
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Speak your symptoms naturally — our AI transcribes and analyzes in real-time.",
  },
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "Advanced AI assesses urgency and suggests possible conditions with confidence scores.",
  },
  {
    icon: Clock,
    title: "Urgency Triage",
    description: "Instant classification into Emergency, Urgent, or Routine care categories.",
  },
  {
    icon: Stethoscope,
    title: "Specialist Matching",
    description: "Get connected to the right specialist based on your specific symptoms.",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book appointments directly with available doctors in just a few clicks.",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your health data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description: "Support for multiple languages to serve diverse patient populations.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for
            <span className="gradient-text"> Smart Healthcare</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with medical expertise 
            to deliver accurate, timely, and accessible healthcare guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card p-6 rounded-2xl group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
