"use client";

import React from "react";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "motion/react";

const plans = [
  {
    name: "Standard",
    price: "$0",
    description: "Ideal for individual developers and testing.",
    features: ["JSON Log Parsing", "Basic Threat Mapping", "Standard AI Insights"],
    icon: Shield,
    buttonText: "Stay Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$29/mo",
    description: "Elevate your SOC with advanced viz and deeper AI.",
    features: ["Unlimited Files", "Custom Node Mapping", "Unlimited Groq Analysis", "Real-time Streaming"],
    icon: Zap,
    buttonText: "Upgrade Now",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scale your threat visualization to millions of logs.",
    features: ["Multi-Log Support", "Role-Based Access", "Dedicated Infrastructure", "Priority AI Context"],
    icon: Crown,
    buttonText: "Contact Us",
    popular: false
  }
];

export const PricingSection = () => {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);

  const handleUpgrade = async (planName: string) => {
    if (planName !== "Pro") return;
    
    setLoadingPlan(planName);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="relative z-10 py-24 px-4">
      <div className="text-center mb-16">
         <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold uppercase border rounded-full border-blue-500/20 bg-blue-500/5 text-blue-400">
           Pricing Plans
         </div>
         <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Scale Your <span className="text-blue-500">AiSOC</span> Intelligence</h2>
         <p className="text-zinc-500 max-w-lg mx-auto">Choose the tier that fits your threat landscape. No hidden fees, just high-fidelity visuals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className={`relative flex flex-col p-[1px] rounded-2xl ${plan.popular ? "bg-gradient-to-b from-blue-500 to-cyan-400" : "bg-zinc-800"}`}
          >
            <div className="h-full w-full bg-zinc-950 rounded-[15px] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl bg-zinc-900 border ${plan.popular ? "border-blue-500/30" : "border-zinc-800"}`}>
                   <plan.icon className={`w-6 h-6 ${plan.popular ? "text-blue-500" : "text-zinc-500"}`} />
                </div>
                {plan.popular && <span className="bg-blue-600 text-[10px] font-bold text-white px-2 py-1 rounded-full uppercase tracking-tighter shadow-[0_0_10px_rgba(37,99,235,0.4)]">Most Popular</span>}
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-white mb-4">{plan.price}</p>
              <p className="text-sm text-zinc-500 mb-8">{plan.description}</p>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-zinc-400 tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleUpgrade(plan.name)}
                disabled={loadingPlan !== null}
                className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${plan.popular ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)]" : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"}`}
              >
                {loadingPlan === plan.name ? "Redirecting..." : plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
