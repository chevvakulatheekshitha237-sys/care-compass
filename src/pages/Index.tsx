import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Specialists from "@/components/Specialists";
import Footer from "@/components/Footer";
import SymptomChat from "@/components/SymptomChat";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onStartChat={() => setIsChatOpen(true)} />
      <Features />
      <HowItWorks />
      <Specialists />
      <Footer />
      <SymptomChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
