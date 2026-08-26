"use client";

import React from "react";
import { CampaignActivity } from "@/types/dashboard";

interface CampaignActivityPanelProps {
  campaigns: CampaignActivity[];
}

export default function CampaignActivityPanel({ campaigns }: CampaignActivityPanelProps) {
  return (
    <div className="bg-[var(--bg-panel)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#F43F5E]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              CAMPAIGN INTEL OPERATIONS
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Tracked trojan campaigns & shared infrastructure overlap
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full border bg-rose-950/60 text-rose-300 border-rose-500/40 font-bold uppercase tracking-wider">
          {campaigns.filter((c) => c.status === "active").length} ACTIVE
        </span>
      </div>

      <div className="space-y-3">
        {campaigns.map((camp) => {
          let statusBadge = "bg-emerald-950/50 text-emerald-300 border-emerald-500/40";
          if (camp.status === "active") statusBadge = "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
          else if (camp.status === "monitoring") statusBadge = "bg-amber-950/60 text-amber-300 border-amber-500/40";

          return (
            <div
              key={camp.id}
              className="bg-[var(--bg-panel-alt)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors rounded-xl p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--text-primary)] text-xs font-mono">{camp.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{camp.threatFamily}</div>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                  {camp.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-[var(--border)] text-[10px]">
                <div>
                  <span className="text-[var(--text-muted)] uppercase block font-semibold">CASES</span>
                  <span className="text-[var(--text-primary)] font-bold text-xs">{camp.caseCount}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] uppercase block font-semibold">AVG RISK</span>
                  <span className={`font-bold text-xs ${camp.avgRisk >= 80 ? "text-rose-400" : "text-amber-400"}`}>
                    {camp.avgRisk}/100
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[var(--text-muted)] uppercase block font-semibold">LAST SEEN</span>
                  <span className="text-[var(--text-primary)]">
                    {new Date(camp.lastSeen).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {camp.sharedInfrastructure.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase self-center mr-1 font-semibold">INFRA:</span>
                  {camp.sharedInfrastructure.map((infra) => (
                    <span
                      key={infra}
                      className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border)] text-indigo-300"
                    >
                      {infra}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

