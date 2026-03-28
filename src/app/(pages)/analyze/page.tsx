"use client";

import React, { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ShieldAlert, Zap, Lock, BarChart3, ArrowRight, Activity, Terminal, AlertTriangle } from "lucide-react";
import { LogUploader } from "@/components/LogUploader";
import { SecurityEvent, ThreatSummary } from "@/lib/parser";
import { motion, AnimatePresence } from "motion/react";
import { ThreatGraph } from "@/components/ThreatGraph";
import { AnalystTerminal } from "@/components/analyst-terminal";
import { TimelineChart } from "@/components/timeline-chart";
import { GeoMap } from "@/components/GeoMap";
import { Globe, LayoutDashboard, History, Download } from "lucide-react";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [view, setView] = useState<"scan" | "summary" | "graph">("scan");
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [summary, setSummary] = useState<ThreatSummary | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [activeTab, setActiveTab] = useState<"topology" | "geo">("topology");
  const [isExporting, setIsExporting] = useState(false);

  const onScanComplete = (events: SecurityEvent[], summary: ThreatSummary) => {
    setEvents(events);
    setSummary(summary);
    setView("summary");
    setShowTerminal(true);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("SUCCESS: Threat_Intelligence_Report_v3.pdf has been generated and encrypted.");
    }, 1500);
  };

  const handleConfigureThresholds = () => {
    alert("SYSTEM_RE-CONFIG: Autonomous Kill-Switch thresholds are now being synchronized with the global threat database.");
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-x-hidden overflow-y-auto selection:bg-blue-500/30 bg-zinc-950 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      {/* Persistent Auth Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
         <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer z-50 relative pointer-events-auto">
           <ShieldAlert className="w-6 h-6 text-blue-500" />
           <span className="font-bold tracking-tighter text-lg text-white">AiSOC // INTEL</span>
         </Link>
         <div className="flex items-center gap-4 z-50 relative pointer-events-auto">
           <Show when="signed-out">
             <SignInButton mode="modal">
               <button className="px-5 py-2 rounded-full border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors text-xs font-bold tracking-widest uppercase text-white">
                 Operator_Login
               </button>
             </SignInButton>
           </Show>
           <Show when="signed-in">
             <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-blue-500/30" } }} />
           </Show>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "scan" && (
          <motion.div 
            key="scan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative z-10 w-full"
          >
            <LogUploader onScanComplete={onScanComplete} />
          </motion.div>
        )}

        {view === "summary" && summary && (
          <motion.div 
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-5xl px-4 py-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Vibe Check <span className="text-blue-500 font-mono tracking-tighter">Complete</span></h2>
                <p className="text-zinc-500 font-mono text-xs uppercase">Scan Report // Build: AI-SOC-V1</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Detected Events", value: summary.totalEvents, icon: Activity, color: "blue" },
                { label: "Critical Threats", value: summary.criticalCount, icon: ShieldAlert, color: "red" },
                { label: "High Sensitivity", value: summary.highCount, icon: AlertTriangle, color: "orange" },
                { label: "Unique Attackers", value: summary.uniqueSources, icon: Terminal, color: "purple" }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl group">
                  <div className={`p-2 rounded-lg bg-zinc-800/50 border border-zinc-700 w-fit mb-4`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-zinc-500 text-xs font-medium uppercase mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-white font-medium">Top Vector Identified: <span className="text-blue-400 font-bold font-mono">{summary.topThreatType}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className="h-10 px-6 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold transition-all flex items-center gap-2"
                  onClick={() => {
                    setView("scan");
                    setSummary(null);
                    setEvents([]);
                    setShowTerminal(false);
                  }}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  New Scan
                </button>
                <button 
                  className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center gap-2"
                  onClick={() => setView("graph")}
                >
                  Go to Threat Map
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === "graph" && (
          <motion.div 
            key="graph"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative z-10 w-full max-w-7xl px-4 pt-28 pb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <div className="flex items-center gap-6">
                <button onClick={() => setView("summary")} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:border-zinc-700">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Threat <span className="text-blue-500 font-mono tracking-tighter">Command</span></h2>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-widest">Active_Session // ID: LOG-SEC-2024</p>
                </div>
              </div>
              
              <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                 <button 
                  onClick={() => setActiveTab("topology")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "topology" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                 >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Topology
                 </button>
                 <button 
                  onClick={() => setActiveTab("geo")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "geo" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                 >
                    <Globe className="w-3.5 h-3.5" />
                    Geo_Map
                 </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  className="h-10 px-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isExporting ? "Encrypting..." : "Export"}
                </button>
                <button 
                  onClick={() => setShowTerminal(true)}
                  className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                   <Zap className="w-4 h-4" />
                   AI Analysis
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  {activeTab === "topology" ? (
                    <ThreatGraph events={events} />
                  ) : (
                    <GeoMap events={events} />
                  )}
                  <TimelineChart events={events} />
               </div>
               
               <div className="space-y-8">
                  <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
                     <div className="flex items-center gap-3 mb-6">
                        <History className="w-4 h-4 text-zinc-500" />
                        <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Recent_Activity_Stream</h3>
                     </div>
                     <div className="space-y-6">
                        {events.slice(0, 6).map((e, i) => (
                           <div key={i} className="flex gap-4 group">
                              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${e.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-blue-500'}`} />
                              <div>
                                 <p className="text-xs text-zinc-300 font-bold mb-0.5 tracking-tight group-hover:text-white transition-colors capitalize">{e.action}</p>
                                 <p className="text-[10px] text-zinc-600 font-mono">{e.source} → {e.type}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 relative overflow-hidden group">
                     <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                     <Zap className="w-8 h-8 text-blue-500 mb-4 animate-pulse" />
                     <h3 className="text-xl font-bold text-white mb-2 leading-tight">Autonomous Kill-Switch <span className="text-blue-500 font-mono tracking-tighter">Enabled</span></h3>
                     <p className="text-xs text-zinc-500 leading-relaxed mb-6">Our AI is monitoring all source IPs. One click to sever all high-risk connections.</p>
                     <button 
                      onClick={handleConfigureThresholds}
                      className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold transition-all"
                     >
                        Configure Thresholds
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTerminal && summary && (
        <AnalystTerminal 
          summary={summary} 
          events={events}
          onClose={() => setShowTerminal(false)} 
        />
      )}
    </main>
  );
}
