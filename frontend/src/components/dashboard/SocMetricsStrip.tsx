"use client";

import React from "react";
import { SocMetrics } from "@/types/dashboard";

interface SocMetricsStripProps {
  metrics: SocMetrics;
}

const METRICS_CONFIG = [
  { key: "totalCases", label: "CASES ANALYZED", tag: "TELEMETRY OK", tagType: "ok", color: "text-[var(--text-primary)]" },
  { key: "criticalThreats", label: "CRITICAL THREATS", tag: "IMMEDIATE ACTION", tagType: "critical", color: "text-[#F43F5E]" },
  { key: "highRiskApks", label: "HIGH RISK APKS", tag: "WATCHLIST", tagType: "warning", color: "text-[#FB923C]" },
  { key: "avgRisk", label: "AVG RISK SCORE", tag: "ELEVATED", tagType: "warning", suffix: "/100", color: "text-[var(--accent)]" },
  { key: "iocCount", label: "ACTIVE IOCS", tag: "LIVE FEED", tagType: "purple", color: "text-indigo-400" },
  { key: "citizenExposure", label: "CITIZEN RISK", tag: "CRITICAL", tagType: "critical", color: "text-[#F43F5E]" },
] as const;

export default function SocMetricsStrip({ metrics }: SocMetricsStripProps) {
  const getTagStyle = (tagType: string) => {
    switch (tagType) {
      case "critical":
        return "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]";
      case "warning":
        return "bg-amber-950/60 text-amber-300 border-amber-500/40";
      case "purple":
        return "bg-indigo-950/60 text-indigo-300 border-indigo-500/40";
      case "ok":
      default:
        return "bg-emerald-950/60 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 font-mono">
      {METRICS_CONFIG.map((card) => {
        const rawValue = metrics[card.key as keyof SocMetrics];
        const displayValue = card.key === "citizenExposure" 
          ? (typeof rawValue === "string" ? rawValue.toUpperCase() : "HIGH") 
          : String(rawValue ?? 0);

        return (
          <div
            key={card.key}
            className="bg-[var(--bg-panel)] backdrop-blur-sm border border-[var(--border)] hover:border-[var(--accent)]/50 rounded-2xl p-4 flex flex-col justify-between space-y-2.5 transition-all duration-200 shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] group"
          >
            <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
              {card.label}
            </div>
            
            <div className={`text-2xl font-bold font-mono tracking-tight flex items-baseline gap-1 ${card.color}`}>
              {displayValue}
              {"suffix" in card && card.suffix && (
                <span className="text-xs font-mono text-[var(--text-muted)] opacity-60 font-normal">{card.suffix}</span>
              )}
            </div>

            <div className="pt-1 border-t border-[var(--border)]/60 flex items-center justify-between">
              <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTagStyle(card.tagType)}`}>
                {card.tag}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60 animate-pulse"></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

