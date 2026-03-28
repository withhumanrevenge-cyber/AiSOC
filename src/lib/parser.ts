export type ThreatSeverity = "Low" | "Medium" | "High" | "Critical";

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: string;
  target?: string;
  action: string;
  status: string;
  severity: ThreatSeverity;
  location?: string;
  type?: string;
  description: string;
}

export interface ThreatSummary {
  totalEvents: number;
  criticalCount: number;
  highCount: number;
  uniqueSources: number;
  topThreatType: string;
}

export const parseSecurityLogs = (rawData: any): SecurityEvent[] => {
  const logs = Array.isArray(rawData) ? rawData : [rawData];
  
  return logs.map((log, index) => ({
    id: log.id || log.eventID || `evt-${index}`,
    timestamp: log.timestamp || log.eventTime || new Date().toISOString(),
    source: log.source_ip || log.sourceIPAddress || log.source || "Unknown",
    target: log.target_ip || log.destinationIPAddress || log.target || "Internal Network",
    action: log.action || log.eventName || "Access Attempt",
    status: log.status || log.errorCode || "Attempted",
    severity: (log.severity || inferSeverity(log)) as ThreatSeverity,
    location: log.location || log.recipientAccountId || "External",
    type: log.type || log.eventType || "Log Entry",
    description: log.description || log.errorMessage || `Security event from ${log.source_ip || log.source || 'Unknown'}.`,
  }));
};

const inferSeverity = (log: any): ThreatSeverity => {
  const text = JSON.stringify(log).toLowerCase();
  if (text.includes("fail") || text.includes("denied") || text.includes("unauthorized")) {
    return "High";
  }
  if (text.includes("error") || text.includes("warning")) {
    return "Medium";
  }
  if (text.includes("critical") || text.includes("exploit")) {
    return "Critical";
  }
  return "Low";
};

export const getThreatSummary = (events: SecurityEvent[]): ThreatSummary => {
  const criticalCount = events.filter(e => e.severity === "Critical").length;
  const highCount = events.filter(e => e.severity === "High").length;
  const uniqueSources = new Set(events.map(e => e.source)).size;
  
  const types = events.map(e => e.action);
  const topThreatType = types.sort((a, b) => 
    types.filter(v => v === a).length - types.filter(v => v === b).length
  ).pop() || "N/A";

  return {
    totalEvents: events.length,
    criticalCount,
    highCount,
    uniqueSources,
    topThreatType,
  };
};
