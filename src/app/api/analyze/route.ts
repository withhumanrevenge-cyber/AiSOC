import { Groq } from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// ─────────────────────────────────────────────
// STRICT SOC SYSTEM PROMPT
// ─────────────────────────────────────────────
const SOC_SYSTEM_PROMPT = `
You are a senior SOC (Security Operations Center) analyst with 10+ years of experience
in threat detection, incident response, and malware analysis.

You will be given raw JSON security logs from one or more sources (SIEM, EDR, Firewall,
Windows Events, Authentication logs, etc.).

YOUR RULES — FOLLOW ALL OF THEM WITHOUT EXCEPTION:

1. RESPOND ONLY WITH VALID JSON. No markdown. No prose. No backticks. No preamble.
   Your entire response must be parseable by JSON.parse().

2. SEVERITY MAPPING — NEVER DOWNGRADE:
   - If ANY event has severity "critical" → overall_severity = "CRITICAL"
   - If highest is "high"               → overall_severity = "HIGH"
   - If highest is "medium"             → overall_severity = "MEDIUM"
   - If all are "low" or "info"         → overall_severity = "LOW"

3. COUNT EVENTS CORRECTLY. Do not say "a single event" if there are multiple.
   Report the exact number of total events and how many per severity level.

4. NEVER INVENT DATA. Only analyze what is in the logs provided.
   Do not fabricate IP addresses, usernames, event types, or timestamps.

5. MITRE ATT&CK MAPPING. For each event type, map to the correct technique ID.
   Examples:
   - brute_force / multiple_failed_logins → T1110
   - powershell encoded command           → T1059.001
   - c2_traffic / beaconing              → T1071.001
   - data exfiltration                   → T1048
   - credential dumping / lsass access   → T1003.001
   - scheduled task persistence          → T1053.005
   - log clearing                        → T1070.001
   - usb exfil                           → T1052.001

6. STATUS OPEN/INVESTIGATING events MUST appear in remediation steps.

7. analyst_vibe must be 1 sentence, professional, and accurate to the actual severity.
   Do NOT write cyberpunk fiction. Do NOT write "neon dreams" or similar.

8. iocs must list actual IPs, hashes, domains, or process names found in the logs.

Return ONLY this JSON schema, with no extra fields and no missing fields:

{
  "title": "string — concise incident title based on the most severe event",
  "overall_severity": "CRITICAL | HIGH | MEDIUM | LOW",
  "status": "IMMEDIATE_ACTION_REQUIRED | ACTIVE_INVESTIGATION | MONITORING | RESOLVED",
  "event_count": {
    "total": number,
    "critical": number,
    "high": number,
    "medium": number,
    "low": number
  },
  "log_sources": ["string array of sources found e.g. SIEM, EDR, Firewall"],
  "threat_summary": "string — 3-4 sentences covering ALL events, starting with the most severe",
  "events": [
    {
      "event_id": "string",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "event_type": "string",
      "source_ip": "string or null",
      "destination_ip": "string or null",
      "description": "string — what happened in plain English",
      "status": "string — open/contained/investigating/resolved",
      "mitre_technique": "string — e.g. T1110 - Brute Force"
    }
  ],
  "iocs": ["string array — IPs, domains, hashes, process names that are suspicious"],
  "mitre_techniques": ["string array — all unique MITRE techniques across all events"],
  "remediation": [
    "string — specific actionable step, referencing actual IPs/hosts/users from the log"
  ],
  "analyst_vibe": "string — one professional sentence summarizing the threat posture"
}
`;

// ─────────────────────────────────────────────
// OUTPUT VALIDATOR
// ─────────────────────────────────────────────
function validateAnalysis(data: unknown): { valid: boolean; error?: string } {
  if (typeof data !== "object" || data === null) {
    return { valid: false, error: "Response is not a JSON object" };
  }

  const required = [
    "title",
    "overall_severity",
    "status",
    "event_count",
    "log_sources",
    "threat_summary",
    "events",
    "iocs",
    "mitre_techniques",
    "remediation",
    "analyst_vibe",
  ];

  const obj = data as Record<string, unknown>;

  for (const field of required) {
    if (!(field in obj)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  const validSeverities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  if (!validSeverities.includes(obj.overall_severity as string)) {
    return { valid: false, error: `Invalid overall_severity: ${obj.overall_severity}` };
  }

  if (!Array.isArray(obj.events) || obj.events.length === 0) {
    return { valid: false, error: "events array is empty or missing" };
  }

  // Guard against downgraded severity
  const events = obj.events as Array<Record<string, unknown>>;
  const hasCritical = events.some(
    (e) => (e.severity as string)?.toUpperCase() === "CRITICAL"
  );
  if (hasCritical && obj.overall_severity !== "CRITICAL") {
    return {
      valid: false,
      error: "overall_severity must be CRITICAL when a CRITICAL event exists",
    };
  }

  return { valid: true };
}

// ─────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // Check Clerk Session
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ 
        error: "UNAUTHORIZED_ACCESS",
        details: "A valid secure session is required to access the intelligence stream." 
      }, { status: 401 });
    }

    const body = await req.json();
    const { logs } = body;

    if (!logs) {
      return NextResponse.json(
        { error: "No logs provided in request body" },
        { status: 400 }
      );
    }

    // Stringify logs cleanly for the prompt
    const logsString =
      typeof logs === "string" ? logs : JSON.stringify(logs, null, 2);

    // Cap input size to avoid runaway token usage (~50KB limit)
    if (logsString.length > 50000) {
      return NextResponse.json(
        { error: "Log payload too large. Please upload logs under 50KB." },
        { status: 413 }
      );
    }

    let rawContent: string | null = null;
    let attempts = 0;
    const MAX_RETRIES = 2;

    while (attempts <= MAX_RETRIES) {
      attempts++;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SOC_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze the following security logs and return your analysis as JSON:\n\n${logsString}`,
          },
        ],
      });

      rawContent = response.choices[0]?.message?.content ?? null;

      if (!rawContent) {
        if (attempts > MAX_RETRIES) {
          return NextResponse.json(
            { error: "AI returned empty response after retries." },
            { status: 502 }
          );
        }
        continue;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        if (attempts > MAX_RETRIES) {
          return NextResponse.json(
            { error: "AI returned malformed JSON after retries." },
            { status: 502 }
          );
        }
        continue;
      }

      const validation = validateAnalysis(parsed);
      if (!validation.valid) {
        if (attempts > MAX_RETRIES) {
          return NextResponse.json(
            {
              error: `AI analysis failed validation: ${validation.error}`,
              details: "The intelligence engine returned malformed data.",
              raw: parsed,
            },
            { status: 502 }
          );
        }
        continue;
      }

      // Return parsed data encapsulating it in { analysis: parsed } for useAnalyze compatibility
      return NextResponse.json({ analysis: parsed }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Analysis failed after retries." },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("[AiSOC Analyze Error]", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again.", details: err.message },
      { status: 500 }
    );
  }
}
