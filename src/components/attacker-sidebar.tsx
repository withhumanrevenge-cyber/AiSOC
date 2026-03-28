"use client";

import React from "react";
import { X, ShieldAlert, Terminal, Activity, Zap, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SecurityEvent } from "@/lib/parser";

interface AttackerSidebarProps {
  attacker: string | null;
  events: SecurityEvent[];
  onClose: () => void;
}

export const AttackerSidebar = ({ attacker, events, onClose }: AttackerSidebarProps) => {
  const [selectedAttacker, setAttacker] = React.useState<string | null>(attacker);
  
  React.useEffect(() => {
    setAttacker(attacker);
  }, [attacker]);

  if (!selectedAttacker) return null;

  const attackerEvents = events.filter(e => e.source === selectedAttacker);
  const maxSeverity = attackerEvents.reduce((prev, curr) => {
     const levels: Record<string, number> = { "Low": 0, "Medium": 1, "High": 2, "Critical": 3 };
     return levels[curr.severity] > levels[prev] ? curr.severity : prev;
  }, "Low");

  const colors: Record<string, string> = {
    Low: "text-emerald-500",
    Medium: "text-amber-500",
    High: "text-orange-500",
    Critical: "text-red-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 z-[60] h-full w-full max-w-sm border-l border-zinc-800 bg-zinc-950 px-6 py-8 shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800`}>
                 <Terminal className="w-4 h-4 text-zinc-400" />
              </div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-tighter">Attacker_Detail_V1</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
           </button>
        </div>

        <div className="flex flex-col gap-6 flex-grow overflow-y-auto">
           <div>
              <p className="text-[10px] text-zinc-600 font-mono uppercase font-bold tracking-widest mb-1.5 leading-none">Source Address</p>
              <h2 className="text-2xl font-bold text-white tracking-tighter">{selectedAttacker}</h2>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                 <ShieldAlert className={`w-4 h-4 mb-2 ${colors[maxSeverity]}`} />
                 <p className="text-[10px] text-zinc-600 font-medium tracking-tight uppercase mb-0.5">Threat Level</p>
                 <p className={`text-lg font-bold ${colors[maxSeverity]}`}>{maxSeverity}</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                 <Activity className="w-4 h-4 text-blue-500 mb-2" />
                 <p className="text-[10px] text-zinc-600 font-medium tracking-tight uppercase mb-0.5">Event Count</p>
                 <p className="text-lg font-bold text-white tracking-tighter">{attackerEvents.length}</p>
              </div>
           </div>

           <div>
              <p className="text-[10px] text-zinc-600 font-mono uppercase font-bold tracking-widest mb-4 leading-none">Attack Vectors</p>
              <div className="space-y-3">
                 {Array.from(new Set(attackerEvents.map(e => e.type))).map((type, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-zinc-300 font-medium tracking-tight">{type}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div>
              <p className="text-[10px] text-zinc-600 font-mono uppercase font-bold tracking-widest mb-4 leading-none">Raw Discovery Logs</p>
              <div className="space-y-4">
                 {attackerEvents.slice(0, 5).map((e, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="flex items-start justify-between mb-1.5">
                           <p className="text-[10px] text-zinc-500 font-mono">{new Date().toLocaleTimeString()}</p>
                           <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-sm text-zinc-300 font-medium line-clamp-1 leading-snug tracking-tight">{e.description}</p>
                        <div className="w-full h-[1px] bg-zinc-900 mt-4 group-hover:bg-zinc-800 transition-colors" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="mt-8">
           <button 
             onClick={() => {
               alert(`[FIREWALL_UPDATE]: IP ${selectedAttacker} has been successfully null-routed and isolated from the network.`);
               onClose();
             }}
             className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2"
           >
              <Zap className="w-4 h-4" />
              Automated Kill-Switch
           </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
