"use client";

import React, { useMemo, useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "motion/react";
import { SecurityEvent } from "@/lib/parser";

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world-110m.json";

interface GeoPoint {
  ip: string;
  coordinates: [number, number];
  severity: string;
}

interface GeoMapProps {
  events: SecurityEvent[];
}

const ipCache: Record<string, [number, number]> = {};

export const GeoMap = ({ events }: GeoMapProps) => {
  const [points, setPoints] = useState<GeoPoint[]>([]);

  useEffect(() => {
    const fetchCoords = async () => {
      const uniqueSources = Array.from(new Set(events.map(e => e.source)));
      
      const newPoints = await Promise.all(uniqueSources.map(async (source) => {
        const severity = events.find(e => e.source === source)?.severity || "Low";
        
        const isInternal = source.startsWith("192.") || source.startsWith("10.") || source.startsWith("127.") || source === "localhost" || source === "Unknown";

        if (isInternal) {
           return {
             ip: source,
             coordinates: [Math.random() * 20 - 100, Math.random() * 20 + 30] as [number, number], // Simulating US region
             severity,
           };
        }

        if (ipCache[source]) {
          return { ip: source, coordinates: ipCache[source], severity };
        }

        try {
           const res = await fetch(`http://ip-api.com/json/${source}`);
           const data = await res.json();
           
           if (data.status === "success" && typeof data.lat === 'number' && typeof data.lon === 'number') {
             const coords: [number, number] = [data.lon, data.lat];
             ipCache[source] = coords;
             return { ip: source, coordinates: coords, severity };
           }
        } catch (e) {
           console.error("Geo-IP Fetch failed for", source, e);
        }

        return {
           ip: source,
           coordinates: [Math.random() * 360 - 180, Math.random() * 120 - 60] as [number, number],
           severity,
        };
      }));

      setPoints(newPoints);
    };

    fetchCoords();
  }, [events]);

  const colorMap: Record<string, string> = {
    Low: "#10b981",
    Medium: "#f59e0b",
    High: "#f97316",
    Critical: "#ef4444",
  };

  return (
    <div className="w-full h-[400px] border border-zinc-800 rounded-2xl bg-zinc-950/40 p-6 overflow-hidden flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none">Global_Threat_Intelligence</h3>
          <div className="flex gap-4">
             {Object.entries(colorMap).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v }} />
                   <span className="text-[10px] text-zinc-600 font-mono uppercase">{k}</span>
                </div>
             ))}
          </div>
       </div>
       <div className="flex-grow flex items-center justify-center">
        <ComposableMap projectionConfig={{ scale: 160 }} className="w-full h-full">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#09090b"
                  stroke="#18181b"
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>
          {points.map((src, i) => (
            <Marker key={i} coordinates={src.coordinates}>
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 4, opacity: [0, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                fill={colorMap[src.severity]}
              />
              <circle r={2} fill={colorMap[src.severity]} />
            </Marker>
          ))}
        </ComposableMap>
       </div>
    </div>
  );
};
