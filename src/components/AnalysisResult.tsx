"use client";

import { AnalysisResult, SEVERITY_COLORS } from "@/hooks/useAnalyze";

interface Props {
  result: AnalysisResult;
}

const SEV_BG: Record<string, string> = {
  CRITICAL: "bg-red-950 border-red-500 text-red-400",
  HIGH:     "bg-orange-950 border-orange-500 text-orange-400",
  MEDIUM:   "bg-yellow-950 border-yellow-500 text-yellow-400",
  LOW:      "bg-green-950 border-green-500 text-green-400",
};

const SEV_BADGE: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  HIGH:     "bg-orange-500 text-white",
  MEDIUM:   "bg-yellow-500 text-black",
  LOW:      "bg-green-500 text-white",
};

export function AnalysisResultCard({ result }: Props) {
  const sev = result.overall_severity;

  return (
    <div className="space-y-6 font-mono text-sm">

      <div className={`rounded-lg border p-4 ${SEV_BG[sev]}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${SEV_BADGE[sev]}`}>
            {sev}
          </span>
          <span className="text-xs opacity-60">{result.status}</span>
        </div>
        <h2 className="text-lg font-bold text-white">{result.title}</h2>
        <p className="mt-1 text-xs opacity-80">{result.threat_summary}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Object.entries(result.event_count)
          .filter(([key]) => key !== "total")
          .map(([key, val]) => (
            <div
              key={key}
              className="rounded border border-zinc-700 bg-zinc-900 p-3 text-center"
            >
              <div
                className="text-xl font-bold"
                style={{ color: SEVERITY_COLORS[key.toUpperCase()] }}
              >
                {val as number}
              </div>
              <div className="text-xs text-zinc-500 uppercase">{key}</div>
            </div>
          ))}
      </div>

      <div>
        <h3 className="text-xs uppercase text-zinc-500 mb-2 tracking-widest">Events</h3>
        <div className="space-y-2">
          {result.events.map((event) => (
            <div
              key={event.event_id}
              className="rounded border border-zinc-700 bg-zinc-900 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold ${SEV_BADGE[event.severity]}`}
                >
                  {event.severity}
                </span>
                <span className="text-zinc-300 font-bold">{event.event_id}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400">{event.event_type}</span>
              </div>
              <p className="text-zinc-300 text-xs mb-1">{event.description}</p>
              <div className="flex gap-4 text-xs text-zinc-500">
                {event.source_ip && <span>SRC: {event.source_ip}</span>}
                {event.destination_ip && <span>DST: {event.destination_ip}</span>}
                <span className="text-blue-400">{event.mitre_technique}</span>
                <span className={`ml-auto ${event.status === "open" ? "text-red-400" : "text-zinc-500"}`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.iocs.length > 0 && (
        <div>
          <h3 className="text-xs uppercase text-zinc-500 mb-2 tracking-widest">IOCs</h3>
          <div className="flex flex-wrap gap-2">
            {result.iocs.map((ioc) => (
              <span
                key={ioc}
                className="rounded bg-red-950 border border-red-800 text-red-300 text-xs px-2 py-1"
              >
                {ioc}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.mitre_techniques.length > 0 && (
        <div>
          <h3 className="text-xs uppercase text-zinc-500 mb-2 tracking-widest">
            MITRE ATT&CK
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.mitre_techniques.map((t) => (
              <span
                key={t}
                className="rounded bg-blue-950 border border-blue-700 text-blue-300 text-xs px-2 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs uppercase text-zinc-500 mb-2 tracking-widest">
          Remediation Steps
        </h3>
        <ol className="space-y-1 list-decimal list-inside">
          {result.remediation.map((step, i) => (
            <li key={i} className="text-zinc-300 text-xs">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded border border-zinc-700 bg-zinc-900 p-3 text-zinc-400 text-xs italic">
        &ldquo;{result.analyst_vibe}&rdquo;
      </div>

    </div>
  );
}
