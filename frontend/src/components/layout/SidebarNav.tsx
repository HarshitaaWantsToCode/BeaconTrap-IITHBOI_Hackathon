"use client";

import React from "react";
import { LayoutDashboard, Upload, FlaskConical, Terminal, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarNavProps {
  activeView: "LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB" | "DEMO_WALKTHROUGH";
  onViewChange: (view: "LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB" | "DEMO_WALKTHROUGH") => void;
}

export default function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  const { t } = useTranslation();

  const navItems = [
    {
      id: "LANDING" as const,
      label: "Platform Overview",
      icon: Terminal,
    },
    {
      id: "DASHBOARD" as const,
      label: t('soc_dashboard') || "SOC Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "DEMO_WALKTHROUGH" as const,
      label: "Demo Walkthrough",
      icon: Activity,
      badge: "MOCK",
    },
    {
      id: "UPLOAD" as const,
      label: t('upload_apk') || "Upload APK",
      icon: Upload,
    },
    {
      id: "ANALYSIS_LAB" as const,
      label: t('analysis_lab') || "Analysis Lab",
      icon: FlaskConical,
      badge: "LIVE",
    },
  ];


  return (
    <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto bg-[var(--bg-base)]">
      <div>
        <div className="px-2 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          OPERATIONS
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors border-l-2 text-left rounded-r-sm ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--bg-panel)] text-[var(--text-primary)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border)]">
        <div className="px-2 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          THREAT INTEL STATUS
        </div>
        <div className="space-y-2 px-2 py-1 text-xs">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
            <span className="text-[var(--text-muted)]">MITRE Coverage</span>
            <span className="text-[var(--text-primary)] font-mono font-semibold">100%</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
            <span className="text-[var(--text-muted)]">C2 Engine</span>
            <span className="text-[var(--accent-cool)] font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cool)]"></span> ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-[var(--text-muted)]">YARA Signatures</span>
            <span className="text-[var(--text-primary)] font-mono font-semibold">12,408</span>
          </div>
        </div>
      </div>

      {/* Forensic Log Stream Ticker */}
      <div className="pt-2 border-t border-[var(--border)]">
        <div className="px-2 mb-1.5 flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[var(--accent)]" /> TELEMETRY STREAM
          </span>
        </div>
        <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm p-2 font-mono text-[10px] text-[var(--text-muted)] space-y-1 overflow-hidden h-28">
          <div className="text-[var(--accent)] truncate">&gt; DETECTED: READ_SMS</div>
          <div className="truncate">&gt; IOC: 185.220.101.5</div>
          <div className="truncate">&gt; C2: /api/v1/exfil</div>
          <div className="text-[var(--accent-cool)] truncate">&gt; STACK: BankingTrojan</div>
          <div className="truncate">&gt; SHA: a4f8e2190...</div>
          <div className="truncate">&gt; EV: RECEIVE_SMS</div>
        </div>
      </div>
    </nav>
  );
}
