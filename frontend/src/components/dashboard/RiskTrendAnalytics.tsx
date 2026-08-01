"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import SocPanel from "./SocPanel";
import { RiskTrendPoint } from "@/types/dashboard";

interface RiskTrendAnalyticsProps {
  data: RiskTrendPoint[];
}

export default function RiskTrendAnalytics({ data }: RiskTrendAnalyticsProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SocPanel
      title="Risk Trend Analytics"
      subtitle="Chronological risk scoring · Investigation timeline"
      badge="ANALYTICS"
    >
      <div className="h-56">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--critical)" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={9} tickLine={false} fontFamily="monospace" />
              <YAxis stroke="var(--text-muted)" fontSize={9} domain={[0, 100]} tickLine={false} fontFamily="monospace" />
              <ReferenceLine y={80} stroke="var(--critical)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "CRITICAL", position: "right", fill: "var(--critical)", fontSize: 8 }} />
              <ReferenceLine y={60} stroke="var(--high)" strokeDasharray="4 4" strokeOpacity={0.3} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as RiskTrendPoint;
                  return (
                    <div className="bg-card border border-card-border rounded-lg p-3 shadow-xl">
                      <p className="text-[10px] text-text-muted font-mono">{d.date}</p>
                      <p className="text-xs font-semibold text-primary mt-1 font-mono">{d.file}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Risk: <span className="font-bold text-[var(--critical-color)]">{d.score}/100</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#riskTrendGrad)"
                dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--critical)", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted bg-card-secondary/20 rounded-lg animate-pulse">
            Loading chart telemetry...
          </div>
        )}
      </div>
    </SocPanel>
  );
}
