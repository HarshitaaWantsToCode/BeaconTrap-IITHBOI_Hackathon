"use client";

import React from "react";
import { motion } from "framer-motion";
import SocPanel from "./SocPanel";
import { MitreHeatmapCell } from "@/types/dashboard";

interface MitreHeatmapProps {
  cells: MitreHeatmapCell[];
}

const SEVERITY_STYLE: Record<MitreHeatmapCell["severity"], { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-[var(--mitre-critical-bg)]", text: "text-[var(--mitre-critical-text)]", border: "border-[var(--mitre-critical-border)]" },
  high: { bg: "bg-[var(--mitre-high-bg)]", text: "text-[var(--mitre-high-text)]", border: "border-[var(--mitre-high-border)]" },
  medium: { bg: "bg-[var(--mitre-medium-bg)]", text: "text-[var(--mitre-medium-text)]", border: "border-[var(--mitre-medium-border)]" },
  low: { bg: "bg-[var(--mitre-low-bg)]", text: "text-[var(--mitre-low-text)]", border: "border-[var(--mitre-low-border)]" },
};

const TACTICS = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Credential Access",
  "Collection",
  "Command & Control",
  "Discovery",
  "Defense Evasion",
];

export default function MitreHeatmap({ cells }: MitreHeatmapProps) {
  const maxCount = Math.max(...cells.map((c) => c.count), 1);

  return (
    <SocPanel
      title="MITRE ATT&CK Heatmap"
      subtitle="Mobile v14 · Detected technique density"
      badge="LIVE MATRIX"
    >
      <div className="space-y-3">
        {/* Legend */}
        <div className="flex items-center gap-4 text-[8px] font-mono uppercase tracking-wider">
          {(["critical", "high", "medium", "low"] as const).map((sev) => (
            <div key={sev} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm border transition-colors duration-200 ${SEVERITY_STYLE[sev].bg} ${SEVERITY_STYLE[sev].border}`} />
              <span className="text-text-secondary">{sev}</span>
            </div>
          ))}
          <span className="ml-auto text-text-muted">{cells.length} techniques mapped</span>
        </div>

        {/* Tactic rows */}
        <div className="space-y-2">
          {TACTICS.map((tactic) => {
            const tacticCells = cells.filter((c) => c.tactic === tactic);
            if (tacticCells.length === 0) return null;

            return (
              <div key={tactic} className="space-y-1">
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest px-1">
                  {tactic}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tacticCells.map((cell) => {
                    const style = SEVERITY_STYLE[cell.severity];
                    const intensity = cell.count / maxCount;

                    return (
                      <motion.div
                        key={cell.techniqueId}
                        whileHover={{ scale: 1.04 }}
                        title={`${cell.techniqueName} — ${cell.count} detections (${cell.confidence}% conf.)`}
                        className={`relative px-2.5 py-2 rounded-lg border cursor-default transition-colors duration-200 ${style.bg} ${style.border}`}
                        style={{ opacity: 0.6 + intensity * 0.4 }}
                      >
                        <div className={`text-[10px] font-mono font-bold transition-colors duration-200 ${style.text}`}>
                          {cell.techniqueId}
                        </div>
                        <div className="text-[8px] font-mono text-text-muted truncate max-w-[120px]">
                          {cell.techniqueName}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-card border border-card-border flex items-center justify-center transition-colors duration-200">
                          <span className="text-[7px] font-mono font-bold text-text-primary">{cell.count}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SocPanel>
  );
}
