"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, Shield } from "lucide-react";
import SocPanel from "./SocPanel";
import { CampaignActivity } from "@/types/dashboard";

interface CampaignActivityPanelProps {
  campaigns: CampaignActivity[];
}

const STATUS_STYLE: Record<CampaignActivity["status"], { color: string; bg: string; border: string; icon: React.ElementType }> = {
  active: { color: "text-[var(--critical-color)]", bg: "bg-[var(--critical-bg)]", border: "border-[var(--critical-border)]", icon: AlertTriangle },
  monitoring: { color: "text-[var(--medium-color)]", bg: "bg-[var(--medium-bg)]", border: "border-[var(--medium-border)]", icon: Activity },
  contained: { color: "text-[var(--low-color)]", bg: "bg-[var(--low-bg)]", border: "border-[var(--low-border)]", icon: Shield },
};

export default function CampaignActivityPanel({ campaigns }: CampaignActivityPanelProps) {
  return (
    <SocPanel
      title="Campaign Activity"
      subtitle="Active threat operations · Infrastructure overlap"
      badge={`${campaigns.filter((c) => c.status === "active").length} ACTIVE`}
      badgeColor="text-[var(--critical-color)] bg-[var(--critical-bg)] border-[var(--critical-border)]"
    >
      <div className="space-y-3">
        {campaigns.map((camp, idx) => {
          const style = STATUS_STYLE[camp.status];
          const Icon = style.icon;

          return (
            <motion.div
              key={camp.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-xl border p-4 ${style.bg} ${style.border} hover:border-opacity-60 transition-colors`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.color}`} />
                  <div>
                    <div className="text-xs font-extrabold text-text-primary font-mono">{camp.label}</div>
                    <div className="text-[10px] font-mono text-text-secondary mt-0.5">{camp.threatFamily}</div>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border ${style.color} ${style.border}`}>
                  {camp.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 text-[9px] font-mono">
                <div>
                  <span className="text-text-muted block uppercase font-bold">Cases</span>
                  <span className="text-text-primary font-extrabold text-sm">{camp.caseCount}</span>
                </div>
                <div>
                  <span className="text-text-muted block uppercase font-bold">Avg Risk</span>
                  <span className={`font-extrabold text-sm ${camp.avgRisk >= 80 ? "text-[var(--critical-color)]" : "text-[var(--medium-color)]"}`}>
                    {camp.avgRisk}/100
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block uppercase font-bold">Last Seen</span>
                  <span className="text-text-secondary text-[9px] font-bold">
                    {new Date(camp.lastSeen).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {camp.sharedInfrastructure.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {camp.sharedInfrastructure.map((infra) => (
                    <span
                      key={infra}
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-card-secondary border border-card-border text-text-secondary font-semibold truncate max-w-[160px]"
                    >
                      {infra}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </SocPanel>
  );
}
