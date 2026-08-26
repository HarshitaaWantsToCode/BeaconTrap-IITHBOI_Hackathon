"use client";

import React from "react";
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
import { ThreatFamilyStat } from "@/types/dashboard";

interface TopThreatFamiliesProps {
  families: ThreatFamilyStat[];
}

const BAR_COLORS = ["#EF4444", "#F59E0B", "#00E5FF", "#10B981", "#8B5CF6"];

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
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
    <div className="bg-[var(--bg-panel)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              TOP THREAT FAMILIES
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Malware classification distribution & campaign density
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full border bg-indigo-950/60 text-indigo-300 border-indigo-500/40 font-bold uppercase tracking-wider">
          {families.length} FAMILIES
        </span>
      </div>

      <div className="h-44">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(199, 210, 254, 0.15)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={10} tickLine={false} fontFamily="monospace" />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--text-muted)"
                fontSize={9}
                tickLine={false}
                width={110}
                fontFamily="monospace"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-xl p-2.5 text-xs font-mono shadow-xl text-[var(--text-primary)]">
                      <p className="font-bold">{d.fullName}</p>
                      <p className="text-[var(--text-muted)] text-[10px] mt-1">
                        {d.count} cases · Avg risk <span className="text-indigo-400 font-bold">{d.avgRisk}/100</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
            Loading threat distribution spectrum...
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-[var(--border)] space-y-2">
        {families.slice(0, 4).map((f, i) => {
          const Icon = TREND_ICON[f.trend];
          return (
            <div
              key={f.name}
              className="flex items-center justify-between text-xs font-mono p-2 bg-[var(--bg-panel-alt)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                <span className="text-[var(--text-primary)] font-semibold">{f.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-muted)]">{f.count} cases</span>
                <span className="font-bold text-[var(--text-primary)]">{f.avgRisk}</span>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    f.trend === "up"
                      ? "text-rose-400"
                      : f.trend === "down"
                      ? "text-emerald-400"
                      : "text-[var(--text-muted)]"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
