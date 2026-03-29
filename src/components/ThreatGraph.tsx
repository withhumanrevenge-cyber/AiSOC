"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SecurityEvent } from "@/lib/parser";
import { ShieldAlert, Terminal, HelpCircle, Activity } from "lucide-react";
import { AttackerSidebar } from "./attacker-sidebar";

interface ThreatGraphProps {
  events: SecurityEvent[];
}

interface ThreatNodeData {
  icon?: React.ElementType;
  borderColor?: string;
  bgColor?: string;
  iconBorderColor?: string;
  iconColor?: string;
  label: string;
  value: string;
  isLive?: boolean;
}

const ThreatNode = ({ data }: { data: ThreatNodeData }) => {
  const Icon = data.icon || HelpCircle;
  return (
    <div className={`p-4 rounded-xl border-2 backdrop-blur-xl bg-zinc-950/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-3 min-w-[200px] hover:border-blue-500/50 transition-colors group ${data.borderColor || "border-zinc-800"}`}>
      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <div className={`p-2 rounded-lg ${data.bgColor || "bg-zinc-900"} border ${data.iconBorderColor || "border-zinc-800"} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${data.iconColor || "text-zinc-500"}`} />
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold mb-0.5 leading-none">{data.label}</p>
        <p className="text-sm font-bold text-white truncate max-w-[140px] tracking-tight">{data.value}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
      
      {data.isLive && (
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  threat: ThreatNode,
};

import { useUser } from "@clerk/nextjs";

export const ThreatGraph = ({ events }: ThreatGraphProps) => {
  const { user } = useUser();
  const [isLive, setIsLive] = React.useState(false);
  const [selectedAttacker, setSelectedAttacker] = React.useState<string | null>(null);

  const userTier = (user?.publicMetadata?.tier as string) || "standard";

  const handleLiveToggle = () => {
    if (userTier !== "pro") {
      alert("[AUTH_RESTRICTION]: Real-time Threat Streaming is an exclusive PRO_CORE feature. Please upgrade your tactical command license.");
      return;
    }
    setIsLive(!isLive);
  };

  const initialNodes: Node[] = React.useMemo(() => {
    const nodes: Node[] = [];
    const sources = Array.from(new Set(events.map(e => e.source)));
    
    nodes.push({
      id: "target",
      type: "threat",
      position: { x: 400, y: 300 },
      data: { 
        label: "TARGET_SYSTEM", 
        value: events[0]?.target || "Protected Network",
        icon: ShieldAlert,
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
        borderColor: "border-blue-500/30",
        iconBorderColor: "border-blue-500/20"
      },
    });

    sources.forEach((source, idx) => {
      const sourceEvents = events.filter(e => e.source === source);
      const maxSeverity = sourceEvents.reduce((prev, curr) => {
        const levels: Record<string, number> = { "Low": 0, "Medium": 1, "High": 2, "Critical": 3 };
        return levels[curr.severity] > levels[prev] ? curr.severity : prev;
      }, "Low");

      const colorMap: Record<string, { border: string; icon: string; bg: string }> = {
        Low: { border: "border-emerald-500/30", icon: "text-emerald-500", bg: "bg-emerald-500/10" },
        Medium: { border: "border-amber-500/30", icon: "text-amber-500", bg: "bg-amber-500/10" },
        High: { border: "border-orange-500/30", icon: "text-orange-500", bg: "bg-orange-500/10" },
        Critical: { border: "border-red-500/30", icon: "text-red-500", bg: "bg-red-500/10" },
      };

      const colors = colorMap[maxSeverity];
      const angle = (idx / sources.length) * 2 * Math.PI;
      const radius = 350;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      nodes.push({
        id: source,
        type: "threat",
        position: { x, y },
        data: { 
          label: `SOURCE_IP [${sourceEvents.length}]`, 
          value: source,
          icon: Terminal,
          bgColor: colors.bg,
          iconColor: colors.icon,
          borderColor: colors.border,
          iconBorderColor: colors.border,
          isLive: isLive && idx % 2 === 0
        },
      });
    });
    return nodes;
  }, [events, isLive]);

  const initialEdges: Edge[] = React.useMemo(() => {
    const edges: Edge[] = [];
    const sources = Array.from(new Set(events.map(e => e.source)));
    
    sources.forEach((source, idx) => {
      const sourceEvents = events.filter(e => e.source === source);
      const maxSeverity = sourceEvents.reduce((prev, curr) => {
         const levels: Record<string, number> = { "Low": 0, "Medium": 1, "High": 2, "Critical": 3 };
         return (levels[curr.severity] || 0) > (levels[prev] || 0) ? curr.severity : prev;
      }, "Low");
      
      edges.push({
        id: `edge-${idx}`,
        source: source,
        target: "target",
        animated: ["High", "Critical"].includes(maxSeverity) || isLive,
        style: { stroke: ["High", "Critical"].includes(maxSeverity) ? "#ef4444" : "#3b82f6", strokeWidth: 1.5, opacity: 0.4 },
      });
    });
    return edges;
  }, [events, isLive]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.id !== "target") {
      setSelectedAttacker(node.id);
    }
  }, []);

  return (
    <div className="w-full h-[700px] border border-zinc-800 rounded-3xl bg-zinc-950/60 overflow-hidden relative group backdrop-blur-sm">
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 pointer-events-none">
        <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none">THREAT_TOPOLOGY_V1</h3>
        <p className="text-[10px] text-zinc-600 font-medium">LIVE VECTOR ANALYSIS ENABLED</p>
      </div>

      <div className="absolute top-6 right-6 z-20 flex gap-4">
        <button 
          onClick={handleLiveToggle}
          className={`h-9 px-4 rounded-xl border border-zinc-800 flex items-center gap-2 text-xs font-bold transition-all ${isLive ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-zinc-900/50 text-zinc-400 hover:text-white"}`}
        >
          <Activity className={`w-3.5 h-3.5 ${isLive ? "animate-pulse" : ""}`} />
          {isLive ? "LIVE_MODE_ACTIVE" : "GO_LIVE"}
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#18181b" gap={20} />
        <Controls className="bg-zinc-900 border-zinc-800 fill-white" />
      </ReactFlow>

      <AttackerSidebar 
        attacker={selectedAttacker} 
        events={events} 
        onClose={() => setSelectedAttacker(null)} 
      />
      
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none opacity-40">
        <div className="flex flex-col items-start gap-1">
          <p className="text-[8px] font-mono text-zinc-600 uppercase font-bold tracking-widest">Topology_Sync</p>
          <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-6 h-1 rounded-full ${i < 4 ? "bg-blue-500" : "bg-zinc-800"}`} />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
