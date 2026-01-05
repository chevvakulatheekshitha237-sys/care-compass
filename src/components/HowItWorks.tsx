import { motion } from "framer-motion";
import { MessageCircle, Brain, UserCheck, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Describe Symptoms",
    description: "Tell us what you're experiencing through chat or voice. Our AI asks smart follow-up questions to understand your condition better.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analysis",
    description: "Our advanced AI analyzes your symptoms, assesses urgency levels, and identifies possible conditions with confidence scores.",
  },
  {
    icon: UserCheck,
    step: "03",
    title: "Get Recommendations",
    description: "Receive personalized recommendations including urgency level, possible conditions, and the right specialist for your needs.",
  },
  {
    icon: CalendarCheck,
    step: "04",
    title: "Book Appointment",
    description: "Schedule an appointment with the recommended specialist directly through our platform — seamlessly and securely.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From symptom to specialist in minutes. Our streamlined process 
            ensures you get the right care, fast.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="glass-card-elevated p-6 rounded-2xl text-center relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mt-4 mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
