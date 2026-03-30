import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileSearch, ShieldCheck, ClipboardList } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SchemesTicker from "@/components/SchemesTicker";

const steps = [
  { icon: ClipboardList, title: "Provide Farmer Details", desc: "Enter your basic information or use voice input" },
  { icon: FileSearch, title: "AI Checks Documents", desc: "Our AI analyzes scheme documents instantly" },
  { icon: ShieldCheck, title: "Get Eligibility + Proof", desc: "Receive results with document citations" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SchemesTicker />
      <Navbar />
      
      {/* Hero */}
      <section className="container py-16 md:py-28">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight"
          >
            AgriVani{" "}
            <span className="text-gradient">AI Scheme Eligibility</span>{" "}
            Assistant
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            Check government scheme eligibility in seconds using voice or simple input
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-6"
          >
            <VoiceInput
              onResult={(text) => {
                const lowerText = text.toLowerCase();
                if (lowerText.includes("start") || lowerText.includes("check")) {
                  navigate("/check");
                }
              }}
              size="lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="pt-4"
          >
            <button
              onClick={() => navigate("/check")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl hero-gradient text-primary-foreground font-display font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Eligibility Check
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-elevated rounded-xl p-6 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-xl hero-gradient flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary/10 text-primary font-display font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
