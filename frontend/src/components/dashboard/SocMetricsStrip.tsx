"use client";

import React from "react";
import { motion } from "framer-motion";
import { SocMetrics } from "@/types/dashboard";
import { useTranslation } from "react-i18next";

interface SocMetricsStripProps {
  metrics: SocMetrics;
}

const METRIC_KEYS = [
  { key: "totalCases", labelKey: "cases_analyzed", color: "text-slate-100", subKey: "telemetry_ok", subColor: "text-cyan-400" },
  { key: "criticalThreats", labelKey: "critical_threats", color: "text-rose-400", subKey: "immediate_action", subColor: "text-rose-500", glow: "rose" },
  { key: "highRiskApks", labelKey: "high_risk_apks", color: "text-orange-400", subKey: "watchlist", subColor: "text-orange-500" },
  { key: "avgRisk", labelKey: "avg_risk_score", color: "text-slate-100", subKey: "critical_80", subColor: "text-slate-400", suffix: "/100" },
  { key: "iocCount", labelKey: "active_iocs", color: "text-amber-400", subKey: "intel_feed", subColor: "text-amber-500" },
  { key: "citizenExposure", labelKey: "citizen_risk", color: "", subKey: "vulnerability", subColor: "text-slate-400", isExposure: true },
] as const;

const getColorStyle = (colorClass: string) => {
  if (colorClass === "text-slate-100") return "var(--text-primary)";
  if (colorClass === "text-rose-400" || colorClass === "text-rose-500") return "var(--critical)";
  if (colorClass === "text-orange-400" || colorClass === "text-orange-500") return "var(--high)";
  if (colorClass === "text-amber-400" || colorClass === "text-amber-500") return "var(--medium)";
  if (colorClass === "text-emerald-400" || colorClass === "text-emerald-500") return "var(--low)";
  if (colorClass === "text-cyan-400" || colorClass === "text-cyan-500") return "var(--primary)";
  if (colorClass === "text-slate-400") return "var(--text-secondary)";
  return "var(--text-primary)";
};

export default function SocMetricsStrip({ metrics }: SocMetricsStripProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {METRIC_KEYS.map((card, idx) => {
        const value = metrics[card.key as keyof SocMetrics];
        const displayValue = String(value);
        const isExposure = "isExposure" in card && card.isExposure;
        const colorVar = isExposure
          ? metrics.citizenExposure === "High"
            ? "var(--critical)"
            : metrics.citizenExposure === "Medium"
            ? "var(--high)"
            : "var(--low)"
          : getColorStyle(card.color);

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.35 }}
            className={`relative bg-card border rounded-[var(--radius-card)] p-4 backdrop-blur-md overflow-hidden group hover:border-[var(--primary)] transition-all ${
              "glow" in card && card.glow === "rose" ? "" : ""
            }`}
            style={{ 
              borderColor: "var(--card-border)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            {/* Colored top-accent KPI line indicator (3px in Light mode, 0px in Dark mode) */}
            <div 
              className="absolute top-0 left-0 right-0 h-[var(--kpi-indicator-height)]"
              style={{ backgroundColor: `var(--kpi-${idx + 1}-color)` }}
            />

            {"glow" in card && card.glow === "rose" && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all" />
            )}
            <div 
              className="text-[9px] font-mono tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              {t(card.labelKey)}
            </div>
            <div 
              className={`text-2xl font-black font-mono mt-1.5 flex items-baseline gap-0.5 ${
                isExposure && metrics.citizenExposure === "High" ? "animate-pulse" : ""
              }`}
              style={{ color: colorVar }}
            >
              {displayValue}
              {"suffix" in card && card.suffix && (
                <span className="text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>{card.suffix}</span>
              )}
            </div>
            <div 
              className="text-[9px] font-mono mt-1 uppercase font-bold"
              style={{ color: getColorStyle(card.subColor) }}
            >
              {t(card.subKey)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
