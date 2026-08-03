"use client";

import React from "react";
import { LayoutDashboard, Upload, FlaskConical, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarNavProps {
  activeView: "LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB";
  onViewChange: (view: "LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB") => void;
}

export default function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  const { t } = useTranslation();
  const isLandingActive = activeView === "LANDING";
  const isDashboardActive = activeView === "DASHBOARD";
  const isUploadActive = activeView === "UPLOAD";
  const isLabActive = activeView === "ANALYSIS_LAB";

  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--sidebar-text)]" style={{ opacity: 0.7 }}>
        {t('operations')}
      </div>

      <button
        onClick={() => onViewChange("LANDING")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border text-left ${
          isLandingActive
            ? "text-[var(--sidebar-text-active)] bg-[var(--sidebar-active-bg)] border-[var(--sidebar-border)] shadow-[var(--sidebar-active-shadow)] font-bold"
            : "text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-[var(--sidebar-item-hover)] border-transparent hover:border-[var(--sidebar-border)]"
        }`}
      >
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Platform Overview</span>
      </button>

      <button
        onClick={() => onViewChange("DASHBOARD")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border text-left ${
          isDashboardActive
            ? "text-[var(--sidebar-text-active)] bg-[var(--sidebar-active-bg)] border-[var(--sidebar-border)] shadow-[var(--sidebar-active-shadow)]"
            : "text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-[var(--sidebar-item-hover)] border-transparent hover:border-[var(--sidebar-border)]"
        }`}
        style={
          isDashboardActive
            ? {
                backgroundColor: "var(--sidebar-active-bg)",
                borderColor: "var(--sidebar-active-border)",
              }
            : undefined
        }
      >
        <LayoutDashboard className="w-4 h-4 text-primary" />
        <span>{t('soc_dashboard')}</span>
      </button>


      <button
        onClick={() => onViewChange("UPLOAD")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border text-left ${
          isUploadActive
            ? "text-[var(--sidebar-text-active)] bg-[var(--sidebar-active-bg)] border-[var(--sidebar-border)] shadow-[var(--sidebar-active-shadow)]"
            : "text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-[var(--sidebar-item-hover)] border-transparent hover:border-[var(--sidebar-border)]"
        }`}
        style={
          isUploadActive
            ? {
                backgroundColor: "var(--sidebar-active-bg)",
                borderColor: "var(--sidebar-active-border)",
              }
            : undefined
        }
      >
        <Upload className="w-4 h-4 text-primary" />
        <span>{t('upload_apk')}</span>
      </button>

      <button
        onClick={() => onViewChange("ANALYSIS_LAB")}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border text-left ${
          isLabActive
            ? "text-[var(--sidebar-text-active)] bg-[var(--sidebar-active-bg)] border-[var(--sidebar-border)] shadow-[var(--sidebar-active-shadow)]"
            : "text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] hover:bg-[var(--sidebar-item-hover)] border-transparent hover:border-[var(--sidebar-border)]"
        }`}
        style={
          isLabActive
            ? {
                backgroundColor: "var(--sidebar-active-bg)",
                borderColor: "var(--sidebar-active-border)",
              }
            : undefined
        }
      >
        <FlaskConical className="w-4 h-4 text-primary animate-pulse" />
        <span className="flex items-center gap-1.5">
          {t('analysis_lab')}
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
        </span>
      </button>
      
      <div className="px-3 pt-6 mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--sidebar-text)]" style={{ opacity: 0.7 }}>
        {t('threat_intel')}
      </div>
      <div className="space-y-1.5 px-3 py-2 text-xs text-[var(--sidebar-text)]">
        <div className="flex items-center justify-between border-b border-[var(--sidebar-border)] pb-1.5" style={{ borderColor: "var(--sidebar-border)" }}>
          <span>{t('mitre_coverage')}</span>
          <span className="text-[var(--sidebar-text-active)] font-semibold font-mono">100%</span>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--sidebar-border)] pb-1.5" style={{ borderColor: "var(--sidebar-border)" }}>
          <span>{t('c2_database')}</span>
          <span className="text-[var(--sidebar-text-active)] font-semibold font-mono">{t('active')}</span>
        </div>
        <div className="flex items-center justify-between pb-1.5">
          <span>{t('signatures')}</span>
          <span className="text-[var(--sidebar-text-active)] font-semibold font-mono">12,408</span>
        </div>
      </div>
    </nav>
  );
}


