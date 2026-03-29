"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X, Terminal, Loader2, ShieldCheck } from "lucide-react";
import { SecurityEvent, ThreatSummary } from "@/lib/parser";

interface AnalystTerminalProps {
  summary: ThreatSummary;
  events: SecurityEvent[];
  onClose: () => void;
}

import { useAnalyze } from "@/hooks/useAnalyze";
import { AnalysisResultCard } from "@/components/AnalysisResult";

export const AnalystTerminal = ({ summary, events, onClose }: AnalystTerminalProps) => {
  const { analyze, result, loading, error } = useAnalyze();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    analyze({ summary, events });
  }, [analyze, summary, events]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result, error, loading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-mono font-bold text-zinc-400 tracking-tighter">THREAT_ANALYSIS_STREAM</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="p-6 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 shrink-0">{">>"}</span>
              <p className="text-zinc-500">Initializing proprietary threat analysis core...</p>
            </div>
            
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <p className="text-zinc-500">Querying threat intelligence database...</p>
              </div>
            ) : error ? (
              <div className="flex items-start gap-3">
                 <span className="text-red-500 shrink-0">{">>"}</span>
                 <div className="whitespace-pre-wrap text-red-500">
                    ERROR: {error}
                 </div>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 w-full">
                   <span className="text-blue-500 shrink-0">{">>"}</span>
                   <div className="w-full flex-1">
                     <AnalysisResultCard result={result} />
                   </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                >
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Analysis Status: Verified by Secure Kernel</p>
                </motion.div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-3 text-xs font-mono">
           <span className="text-green-500">SYS_READY</span>
           <span className="text-zinc-600">|</span>
           <span className="text-zinc-500 animate-pulse">_</span>
        </div>
      </motion.div>
    </div>
  );
};
