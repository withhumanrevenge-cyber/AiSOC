"use client";

import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ShieldAlert, Zap, Lock, BarChart3, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PricingSection } from "@/components/pricing-section";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden selection:bg-blue-500/30 bg-zinc-950 font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      {/* Persistent Auth Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
         <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer z-50 relative pointer-events-auto">
           <ShieldAlert className="w-6 h-6 text-blue-500" />
           <span className="font-bold tracking-tighter text-lg text-white">AiSOC // INTEL</span>
         </Link>
         <div className="flex items-center gap-4 z-50 relative pointer-events-auto">
           <SignedOut>
             <SignInButton mode="modal">
               <button className="px-5 py-2 rounded-full border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors text-xs font-bold tracking-widest uppercase text-white">
                 Operator_Login
               </button>
             </SignInButton>
           </SignedOut>
           <SignedIn>
             <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-blue-500/30" } }} />
           </SignedIn>
         </div>
      </div>

      <AnimatePresence mode="wait">
          <motion.div 
            key="hero"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 flex flex-col items-center px-4 text-center max-w-5xl mt-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium tracking-wider uppercase border rounded-full border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Zap className="w-3 h-3" />
              Neural Threat Detection Engine // v3.3
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              AiSOC <span className="text-blue-500 font-mono tracking-tighter">Threat</span> Visualizer
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-sans">
              Transform raw JSON security logs into high-fidelity threat maps. 
              Identify attack vectors and receive instant remediation steps with AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-20">
              <Link 
                href="/analyze"
                className="group h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
              >
                Analyze JSON Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/analyze"
                className="h-12 px-8 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 font-semibold transition-all flex items-center justify-center"
              >
                View Live Demo
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left z-20">
              {[
                { icon: ShieldAlert, color: "blue", title: "Real-time Analysis", desc: "Visualize threats as they happen with low-latency JSON processing." },
                { icon: BarChart3, color: "purple", title: "Interactive Graphs", desc: "Explore attack paths with dynamic node-based visualizations via React Flow." },
                { icon: Lock, color: "green", title: "AI Remediation", desc: "Get instant suggestions to patch vulnerabilities using advanced AI insights." }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm group hover:border-zinc-700 transition-colors">
                  <div className={`w-10 h-10 rounded-lg bg-${f.color === 'blue' ? 'blue' : f.color === 'purple' ? 'purple' : 'emerald'}-500/10 flex items-center justify-center mb-4 border border-zinc-800 group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-32 w-full z-20 relative bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
              <PricingSection />
            </div>

            {/* Footer */}
            <footer className="w-full mt-24 mb-12 border-t border-zinc-800/50 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm z-20 relative">
              <p>&copy; {new Date().getFullYear()} AiSOC Security. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </footer>
          </motion.div>
      </AnimatePresence>
    </main>
  );
}
