"use client";

import React from "react";
import { LayoutDashboard, Upload, FlaskConical, Terminal, Activity, Shield } from "lucide-react";
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
    <div className="flex-1 flex flex-col justify-between overflow-y-auto bg-[var(--bg-base)] text-[var(--text-muted)]">
      <nav className="px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-bold tracking-widest text-[var(--text-muted)] opacity-60 uppercase">
            OPERATIONS
          </div>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 text-left ${
                    isActive
                      ? "bg-[var(--accent)]/15 text-[var(--text-primary)] border border-[var(--accent)]/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                      : "border border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] hover:border-[var(--border)]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  )}
                  <div className="flex items-center gap-3 pl-1">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                      isActive 
                        ? "bg-[var(--accent)]/20 text-[var(--text-primary)] border-[var(--accent)]/40" 
                        : "bg-[var(--bg-panel)] text-[var(--text-muted)] border-[var(--border)]"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border)]">
          <div className="px-3 mb-2.5 text-[10px] font-mono font-bold tracking-widest text-[var(--text-muted)] opacity-60 uppercase">
            THREAT INTEL
          </div>
          <div className="space-y-2 px-2 text-xs font-mono">
            <div className="flex items-center justify-between bg-[var(--bg-panel)] border border-[var(--border)] px-2.5 py-1.5 rounded-md">
              <span className="text-[var(--text-muted)] text-[11px]">MITRE Coverage</span>
              <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded">100%</span>
            </div>
            <div className="flex items-center justify-between bg-[var(--bg-panel)] border border-[var(--border)] px-2.5 py-1.5 rounded-md">
              <span className="text-[var(--text-muted)] text-[11px]">C2 Database</span>
              <span className="text-[var(--accent)] font-bold text-[11px] bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-1.5 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span> Active
              </span>
            </div>
            <div className="flex items-center justify-between bg-[var(--bg-panel)] border border-[var(--border)] px-2.5 py-1.5 rounded-md">
              <span className="text-[var(--text-muted)] text-[11px]">Signatures</span>
              <span className="text-[var(--text-primary)] font-bold text-[11px] bg-[var(--bg-panel-alt)] border border-[var(--border)] px-1.5 py-0.5 rounded">12,408</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Forensic Log Stream Ticker */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-base)]">
        <div className="mb-2 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase">
          <span className="flex items-center gap-1.5 text-[var(--accent)]">
            <Activity className="w-3 h-3 text-[var(--accent)] animate-pulse" /> TELEMETRY STREAM
          </span>
          <span className="text-[9px] text-emerald-400">LIVE</span>
        </div>
        <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-lg p-2.5 font-mono text-[10px] text-[var(--text-muted)] space-y-1 overflow-hidden h-24 shadow-inner">
          <div className="text-[var(--accent)] truncate">&gt; DETECTED: READ_SMS</div>
          <div className="text-[var(--text-muted)] truncate">&gt; IOC: 185.220.101.5</div>
          <div className="text-amber-400 truncate">&gt; C2: /api/v1/exfil</div>
          <div className="text-red-400 truncate">&gt; STACK: BankingTrojan</div>
          <div className="text-[var(--text-muted)] opacity-60 truncate">&gt; SHA: a4f8e2190...</div>
        </div>
      </div>
    </div>
  );
}

