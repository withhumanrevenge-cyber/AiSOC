"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SecurityEvent } from "@/lib/parser";

interface TimelineChartProps {
  events: SecurityEvent[];
}

export const TimelineChart = ({ events }: TimelineChartProps) => {
  const data = events.slice(0, 12).map((e, i) => ({
    time: i + ":00",
    threats: Math.floor(Math.random() * 10) + (e.severity === "Critical" ? 20 : 5),
  }));

  return (
    <div className="w-full h-[300px] border border-zinc-800 rounded-2xl bg-zinc-950/40 p-6">
      <h3 className="text-xs font-mono font-bold text-zinc-500 mb-6 uppercase tracking-widest leading-none">Attack_Frequency_Timeline</h3>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
          <XAxis dataKey="time" stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
          <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
            itemStyle={{ color: "#3b82f6" }}
          />
          <Area type="monotone" dataKey="threats" stroke="#3b82f6" fillOpacity={1} fill="url(#colorThreat)" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
