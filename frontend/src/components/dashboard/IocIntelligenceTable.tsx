"use client";

import React, { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { IocIntelRow } from "@/types/dashboard";

interface IocIntelligenceTableProps {
  iocs: IocIntelRow[];
}

export default function IocIntelligenceTable({ iocs }: IocIntelligenceTableProps) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filtered = iocs.filter((ioc) => {
    const matchSearch =
      !search ||
      ioc.value.toLowerCase().includes(search.toLowerCase()) ||
      ioc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      ioc.threatFamily.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "ALL" || ioc.severity.toUpperCase() === severityFilter.toUpperCase();
    return matchSearch && matchSeverity;
  });

  return (
    <div className="bg-[var(--bg-panel)] backdrop-blur-md border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]/80 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              INDICATOR OF COMPROMISE (IOC) DATABASE
            </h3>
            <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
              Extracted forensic indicators & network signature correlation
            </p>
          </div>
          <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full border bg-indigo-950/60 text-indigo-300 border-indigo-500/40 font-bold uppercase tracking-wider">
            {iocs.length} IOCS
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search IOC or APK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent)]/60 w-full sm:w-48 transition-colors"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/60 transition-colors cursor-pointer"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-panel-alt)]/90 text-[var(--text-muted)] uppercase tracking-widest text-[10px]">
              <th className="py-3 px-4 font-bold">TYPE</th>
              <th className="py-3 px-4 font-bold">INDICATOR</th>
              <th className="py-3 px-4 font-bold">SEVERITY</th>
              <th className="py-3 px-4 font-bold text-right">CONF.</th>
              <th className="py-3 px-4 font-bold">THREAT FAMILY</th>
              <th className="py-3 px-4 font-bold">SOURCE APK</th>
              <th className="py-3 px-4 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-panel)]/70">
            {filtered.map((ioc) => {
              const sevUpper = ioc.severity.toUpperCase();
              let sevTag = (
                <span className="bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-xs font-mono font-semibold">
                  {ioc.severity}
                </span>
              );
              if (sevUpper === "CRITICAL") {
                sevTag = (
                  <span className="bg-rose-950/50 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full text-xs font-mono font-semibold shadow-[0_0_8px_rgba(244,63,94,0.25)]">
                    CRITICAL
                  </span>
                );
              } else if (sevUpper === "HIGH") {
                sevTag = (
                  <span className="bg-amber-950/50 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-xs font-mono font-semibold">
                    HIGH
                  </span>
                );
              } else if (sevUpper === "MEDIUM") {
                sevTag = (
                  <span className="bg-amber-950/40 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-mono font-semibold">
                    MEDIUM
                  </span>
                );
              }

              return (
                <tr key={ioc.id} className="hover:bg-[var(--bg-panel-alt)]/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] bg-[var(--bg-panel-alt)] px-2 py-0.5 rounded-lg border border-[var(--border)]">
                      {ioc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300 break-all">{ioc.value}</td>
                  <td className="py-3 px-4">{sevTag}</td>
                  <td className="py-3 px-4 text-right font-bold text-[var(--text-primary)]">{ioc.confidence}%</td>
                  <td className="py-3 px-4 text-[var(--text-muted)] font-medium">{ioc.threatFamily}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)] truncate max-w-[120px]">{ioc.fileName}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        if (ioc.type === "IP" || ioc.type === "DOMAIN") {
                          window.open(`https://www.virustotal.com/gui/search/${ioc.value}`, "_blank");
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-colors cursor-pointer shadow-sm"
                    >
                      <span>ANALYZE</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[var(--text-muted)] font-mono text-xs">
                  No indicators match active search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

