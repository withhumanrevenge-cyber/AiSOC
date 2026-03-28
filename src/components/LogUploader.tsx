"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileUpload } from "@/components/ui/file-upload";
import { parseSecurityLogs, getThreatSummary, SecurityEvent, ThreatSummary } from "@/lib/parser";
import { ShieldAlert, CheckCircle2, Loader2, AlertTriangle, Activity } from "lucide-react";

import { useUser } from "@clerk/nextjs";

interface LogUploaderProps {
  onScanComplete: (events: SecurityEvent[], summary: ThreatSummary) => void;
}

export const LogUploader = ({ onScanComplete }: LogUploaderProps) => {
  const { user } = useUser();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const userTier = (user?.publicMetadata?.tier as string) || "standard";

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      alert("Please upload a JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);
        
        startScanning(json);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const startScanning = async (data: any) => {
    setIsScanning(true);
    
    const stages = [
      "Decrypting JSON payload...",
      "Mapping security event schemas...",
      "Cross-referencing IP blacklists...",
      "Calculating threat severity vectors...",
      "Generating remediation map..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setStatusText(stages[i]);
      setScanProgress((i + 1) * 20);
      await new Promise(r => setTimeout(r, 800));
    }

    const events = parseSecurityLogs(data);

    // Gating Logic: Unlimited Files (Standard limited to 40 events)
    if (userTier === "standard" && events.length > 40) {
      alert(`[SYSTEM_LIMIT_REACHED]: Your current Standard tier supports a maximum of 40 events per scan. Detected: ${events.length}. Please upgrade to PRO for unlimited log analysis.`);
      setIsScanning(false);
      return;
    }

    const summary = getThreatSummary(events);
    
    onScanComplete(events, summary);
    setIsScanning(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
      <AnimatePresence mode="wait">
        {!isScanning ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative border border-zinc-800 bg-zinc-950 rounded-2xl p-2">
              <FileUpload onChange={handleFileUpload} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scanning-zone"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-xl"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Activity className="w-12 h-12 text-blue-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-zinc-800"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={276}
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (276 * scanProgress) / 100 }}
                    className="text-blue-500"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 font-mono tracking-tighter">
              SYSTEM_SCANNING...
            </h2>
            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest animate-pulse">
              {statusText}
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-[10px] text-zinc-500 font-mono">ENCRYPT_CHECK</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-[10px] text-zinc-500 font-mono">VECTOR_MAP</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
