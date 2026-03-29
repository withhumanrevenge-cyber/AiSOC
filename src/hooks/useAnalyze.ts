import { useState } from "react";

export interface AnalysisEvent {
  event_id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  event_type: string;
  source_ip: string | null;
  destination_ip: string | null;
  description: string;
  status: string;
  mitre_technique: string;
}

export interface EventCount {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AnalysisResult {
  title: string;
  overall_severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  event_count: EventCount;
  log_sources: string[];
  threat_summary: string;
  events: AnalysisEvent[];
  iocs: string[];
  mitre_techniques: string[];
  remediation: string[];
  analyst_vibe: string;
}

interface UseAnalyzeReturn {
  analyze: (logs: unknown) => Promise<void>;
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#ff2d55",
  HIGH:     "#ff9500",
  MEDIUM:   "#ffcc00",
  LOW:      "#34c759",
};

export function useAnalyze(): UseAnalyzeReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (logs: unknown) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        return;
      }

      if (!data.analysis) {
        setError("No analysis returned from server.");
        return;
      }

      setResult(data.analysis as AnalysisResult);
    } catch (err) {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return { analyze, result, loading, error, reset };
}
