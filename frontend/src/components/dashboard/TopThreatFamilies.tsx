"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import SocPanel from "./SocPanel";
import { ThreatFamilyStat } from "@/types/dashboard";

interface TopThreatFamiliesProps {
  families: ThreatFamilyStat[];
}

const BAR_COLORS = ["#f43f5e", "#f97316", "#eab308", "#a855f7", "#06b6d4", "#10b981"];

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const TREND_COLOR = {
  up: "text-rose-400",
  down: "text-emerald-400",
  stable: "text-slate-500",
};

export default function TopThreatFamilies({ families }: TopThreatFamiliesProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = families.slice(0, 6).map((f) => ({
    name: f.name.length > 16 ? f.name.slice(0, 14) + "…" : f.name,
    fullName: f.name,
    count: f.count,
    avgRisk: f.avgRisk,
  }));

  return (
    <SocPanel
      title="Top Threat Families"
      subtitle="Malware classification distribution · Campaign density"
      badge={`${families.length} FAMILIES`}
    >
      <div className="space-y-4">
        <div className="h-44">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={9} tickLine={false} fontFamily="monospace" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={8}
                  tickLine={false}
                  width={100}
                  fontFamily="monospace"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-card border border-card-border rounded-lg p-2.5 shadow-xl">
                        <p className="text-xs font-bold text-text-primary font-mono">{d.fullName}</p>
                        <p className="text-[10px] text-text-secondary font-mono mt-1">
                          {d.count} cases · Avg risk {d.avgRisk}/100
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted bg-card-secondary/20 rounded-lg animate-pulse">
              Loading threat spectrum...
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-card-border/60 pt-3">
          {families.slice(0, 5).map((f, idx) => {
            const TrendIcon = TREND_ICON[f.trend];
            return (
              <motion.div
                key={f.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center justify-between text-[10px] font-mono"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: BAR_COLORS[idx % BAR_COLORS.length] }}
                  />
                  <span className="text-text-primary font-bold truncate max-w-[140px]">{f.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-secondary">{f.count} cases</span>
                  <span className={f.avgRisk >= 80 ? "text-[var(--critical-color)] font-extrabold" : "text-[var(--medium-color)] font-bold"}>
                    {f.avgRisk}
                  </span>
                  <TrendIcon className={`w-3 h-3 ${f.trend === "up" ? "text-[var(--critical-color)]" : f.trend === "down" ? "text-[var(--low-color)]" : "text-text-muted"}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SocPanel>
  );
}
