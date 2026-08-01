"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import SocPanel from "./SocPanel";
import { IocIntelRow } from "@/types/dashboard";

interface IocIntelligenceTableProps {
  iocs: IocIntelRow[];
}

const SEVERITY_COLOR: Record<string, string> = {
  Critical: "text-[var(--critical-color)] bg-[var(--critical-bg)] border-[var(--critical-border)]",
  High: "text-[var(--high-color)] bg-[var(--high-bg)] border-[var(--high-border)]",
  Medium: "text-[var(--medium-color)] bg-[var(--medium-bg)] border-[var(--medium-border)]",
  Low: "text-[var(--low-color)] bg-[var(--low-bg)] border-[var(--low-border)]",
};

export default function IocIntelligenceTable({ iocs }: IocIntelligenceTableProps) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const filtered = iocs.filter((ioc) => {
    const matchSearch =
      !search ||
      ioc.value.toLowerCase().includes(search.toLowerCase()) ||
      ioc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      ioc.threatFamily.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "ALL" || ioc.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <SocPanel
      title="IOC Intelligence Table"
      subtitle="Indicators of compromise · Threat feed correlation"
      badge={`${iocs.length} IOCS`}
      headerRight={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search IOCs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card-secondary border border-card-border rounded-lg pl-7 pr-2 py-1 text-[10px] font-mono text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/40 w-36 transition-colors duration-200"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-card-secondary border border-card-border rounded-lg px-2 py-1 text-[10px] font-mono text-text-secondary focus:outline-none focus:border-primary/40 transition-colors duration-200"
          >
            <option value="ALL" className="bg-card text-text-primary">ALL</option>
            <option value="Critical" className="bg-card text-text-primary">CRITICAL</option>
            <option value="High" className="bg-card text-text-primary">HIGH</option>
            <option value="Medium" className="bg-card text-text-primary">MEDIUM</option>
          </select>
        </div>
      }
      noPadding
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px] font-mono">
          <thead>
            <tr className="border-b border-card-border text-text-muted uppercase tracking-wider">
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Indicator</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Conf.</th>
              <th className="py-3 px-4">Threat Family</th>
              <th className="py-3 px-4">Source APK</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/40">
            {filtered.map((ioc, idx) => (
              <motion.tr
                key={ioc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="hover:bg-primary/5 transition-colors"
              >
                <td className="py-2.5 px-4 text-primary font-bold">{ioc.type}</td>
                <td className="py-2.5 px-4 text-text-primary max-w-[200px] truncate" title={ioc.value}>
                  {ioc.value}
                </td>
                <td className="py-2.5 px-4">
                  <span className={`inline-flex border rounded px-1.5 py-0.5 text-[9px] font-bold uppercase transition-colors duration-200 ${SEVERITY_COLOR[ioc.severity] ?? SEVERITY_COLOR.Medium}`}>
                    {ioc.severity}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-text-secondary">{ioc.confidence}%</td>
                <td className="py-2.5 px-4 text-text-primary">{ioc.threatFamily}</td>
                <td className="py-2.5 px-4 text-text-muted truncate max-w-[120px]">{ioc.fileName}</td>
                <td className="py-2.5 px-4 text-right">
                  {ioc.caseId !== "SIM" ? (
                    <a
                      href={`/case/${ioc.caseId}`}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-hover text-[9px] font-bold uppercase transition-colors"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      Investigate
                    </a>
                  ) : (
                    <span className="text-text-muted text-[9px] italic">Simulated</span>
                  )}
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-muted italic">
                  No IOCs match current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SocPanel>
  );
}
