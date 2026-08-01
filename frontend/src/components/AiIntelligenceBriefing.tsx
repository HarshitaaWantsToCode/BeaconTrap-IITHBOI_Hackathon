"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldAlert, AlertCircle, RefreshCw, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BriefingData {
  copilotBriefing: Record<string, string>;
  confidence: number;
  exposure: string;
  priority: string;
  metrics?: {
    totalCases: number;
    criticalCasesCount: number;
    averageRiskScore: number;
    citizenExposure: string;
  };
}

import { useAnalysis } from "@/context/AnalysisContext";

export default function AiIntelligenceBriefing() {
  const { language } = useAnalysis();
  const { t } = useTranslation();
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefing = () => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/executive-summary")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load briefing");
        return res.json();
      })
      .then((data: BriefingData) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load AI briefing:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBriefing();
  }, []);

  const getPriorityStyle = (priority: string) => {
    const text = priority.toLowerCase();
    if (text.includes("immediate") || text.includes("critical")) {
      return "text-[var(--critical-color)] bg-[var(--critical-bg)] border-[var(--critical-border)]";
    }
    if (text.includes("high") || text.includes("warning")) {
      return "text-[var(--high-color)] bg-[var(--high-bg)] border-[var(--high-border)]";
    }
    if (text.includes("watchlist") || text.includes("moderate")) {
      return "text-[var(--medium-color)] bg-[var(--medium-bg)] border-[var(--medium-border)]";
    }
    return "text-[var(--low-color)] bg-[var(--low-bg)] border-[var(--low-border)]";
  };

  return (
    <div 
      className="relative overflow-hidden border rounded-xl p-5 md:p-6 backdrop-blur-md transition-all duration-200"
      style={{ background: "var(--briefing-bg)", borderColor: "var(--card-border)" }}
    >

      {/* Sparkles particle glow overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Decorative top bar border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-rose-500 to-cyan-500"></div>

      {loading ? (
        <div className="flex items-center gap-3 py-4 font-mono">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <span className="text-xs text-cyan-400 uppercase tracking-widest animate-pulse">
            AI Copilot is synthesizing threat matrix briefings...
          </span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <span>AI intelligence offline: {error}</span>
          </div>
          <button
            onClick={fetchBriefing}
            className="flex items-center gap-1 text-cyan-400 border border-cyan-500/20 hover:border-cyan-400 rounded px-2 py-1 bg-cyan-950/20 transition-all uppercase text-[10px]"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            Retry
          </button>
        </div>
      ) : data ? (
        <div className="space-y-4">

          {/* Header */}
          <div 
            className="flex items-center justify-between border-b pb-3"
            style={{ borderColor: "var(--card-border)" }}
          >
            <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[var(--ai-color)]" />
            <h2 className="text-sm font-black font-mono tracking-widest text-text-primary">
              {t('beacontrap_ai')}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-1 bg-[var(--ai-color)]/10 text-[var(--ai-color)] border border-[var(--ai-color)]/20 rounded font-bold tracking-wider">
              {t('copilot_active')}
            </span>
          </div>
          </div>
          
          {/* Briefing Content */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 justify-between">

            {/* Primary message */}
            <div className="flex-1 space-y-2">
              <p 
                className="text-sm md:text-base leading-relaxed font-sans first-letter:text-xl first-letter:font-bold first-letter:text-[var(--primary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {data.copilotBriefing[language] || data.copilotBriefing.en}
              </p>
            </div>

            {/* Structured Telemetry KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:items-center gap-4 shrink-0 font-mono text-xs pt-1.5 md:pt-0">

              {/* Right Side Key Risk Attributes */}
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2 h-fit">
                {/* Confidence Score */}
                <div className="bg-card border border-card-border rounded-lg p-3 flex flex-col justify-center items-center text-center backdrop-blur-sm">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-2">
                    {t('confidence')}
                  </span>
                  <span className="text-xl font-black font-mono text-[var(--primary)]">
                    {data.confidence}%
                  </span>
                </div>

                {/* Exposure */}
                <div className="bg-card border border-card-border rounded-lg p-3 flex flex-col justify-center items-center text-center backdrop-blur-sm">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-2">
                    {t('potential_exposure')}
                  </span>
                  <span className="text-sm font-bold font-mono text-text-primary uppercase">
                    {data.exposure}
                  </span>
                </div>

                {/* Priority Action */}
                <div className="bg-card border border-card-border rounded-lg p-3 flex flex-col justify-center items-center text-center backdrop-blur-sm">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-2">
                    {t('recommended_priority')}
                  </span>
                  <span className={`text-[10px] font-black font-mono uppercase px-3 py-1.5 rounded-md border ${getPriorityStyle(data.priority)}`}>
                    {data.priority}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
