"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Radio, Map, BarChart3, Database } from "lucide-react";
import { SocDashboardPayload } from "@/types/dashboard";
import AiIntelligenceBriefing from "@/components/AiIntelligenceBriefing";
import WorldThreatMap from "@/components/WorldThreatMap";
import LiveThreatFeed from "@/components/LiveThreatFeed";
import SocMetricsStrip from "./SocMetricsStrip";
import MitreHeatmap from "./MitreHeatmap";
import ThreatCorrelationFlow from "./ThreatCorrelationFlow";
import CampaignActivityPanel from "./CampaignActivityPanel";
import RiskTrendAnalytics from "./RiskTrendAnalytics";
import TopThreatFamilies from "./TopThreatFamilies";
import IocIntelligenceTable from "./IocIntelligenceTable";
import { useTranslation } from "react-i18next";

interface SocCommandCenterProps {
  data: SocDashboardPayload;
  onNavigateToUpload: () => void;
}

type LensType = "ALL" | "GLOBAL" | "TACTICAL";

export default function SocCommandCenter({ data, onNavigateToUpload }: SocCommandCenterProps) {
  const [dashboardLens, setDashboardLens] = useState<LensType>("ALL");
  const { t } = useTranslation();

  const showGlobal = dashboardLens === "ALL" || dashboardLens === "GLOBAL";
  const showTactical = dashboardLens === "ALL" || dashboardLens === "TACTICAL";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Command header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-card-border pb-5"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-[var(--critical-color)] animate-pulse" />
            <span className="text-[9px] font-mono text-[var(--critical-color)] uppercase tracking-widest font-bold">
              {t('cmd_active')}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">
            {t('soc_command_center').toUpperCase()}
          </h2>
          <p className="text-xs text-text-muted font-mono mt-1">
            {t('node_ind')}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Dynamic Grid Filter Pills */}
          <div className="flex gap-1.5 bg-card/60 p-1 rounded-lg border border-card-border backdrop-blur-sm">
            {[
              { id: "ALL", label: t('all_analytics'), icon: Database },
              { id: "GLOBAL", label: t('global_map'), icon: Map },
              { id: "TACTICAL", label: t('tactical'), icon: BarChart3 }
            ].map((lens) => {
              const Icon = lens.icon;
              const isSelected = dashboardLens === lens.id;
              return (
                <button
                  key={lens.id}
                  onClick={() => setDashboardLens(lens.id as LensType)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? "bg-primary text-[var(--btn-copilot-text)] shadow-[0_0_12px_var(--primary-glow)]"
                      : "text-text-secondary hover:text-text-primary hover:bg-card-secondary/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lens.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onNavigateToUpload}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[var(--btn-copilot-text)] font-bold px-4 py-2.5 rounded-lg text-sm transition-colors shadow-[0_0_20px_var(--primary-glow)] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {t('upload_new')}
          </button>
        </div>
      </motion.div>

      {/* AI Briefing strip */}
      <AiIntelligenceBriefing />

      {/* KPI metrics */}
      <SocMetricsStrip metrics={data.metrics} />

      <AnimatePresence mode="wait">
        <motion.div
          key={dashboardLens}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="space-y-6"
        >
          {/* LENS 1: GLOBAL MAP FOCUS */}
          {dashboardLens === "GLOBAL" && (
            <div className="space-y-6">
              <div className="w-full">
                <WorldThreatMap />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <IocIntelligenceTable iocs={data.iocIntel} />
                </div>
                <div>
                  <LiveThreatFeed />
                </div>
              </div>
            </div>
          )}

          {/* LENS 2: TACTICAL MATRICES FOCUS */}
          {dashboardLens === "TACTICAL" && (
            <div className="space-y-6">
              <div className="w-full">
                <ThreatCorrelationFlow
                  nodes={data.correlationGraph.nodes}
                  edges={data.correlationGraph.edges}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MitreHeatmap cells={data.mitreHeatmap} />
                <RiskTrendAnalytics data={data.riskTrend} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopThreatFamilies families={data.threatFamilies} />
                <CampaignActivityPanel campaigns={data.campaigns} />
              </div>
            </div>
          )}

          {/* LENS 3: ALL ANALYTICS (DEFAULT MONOLITHIC FLOW WITH SCROLL REDUCTION) */}
          {dashboardLens === "ALL" && (
            <>
              {/* Row 1: Global map (full width) */}
              <WorldThreatMap />

              {/* Row 2: Correlation graph + Live feed */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8">
                  <ThreatCorrelationFlow
                    nodes={data.correlationGraph.nodes}
                    edges={data.correlationGraph.edges}
                  />
                </div>
                <div className="xl:col-span-4">
                  <div className="sticky top-0">
                    <LiveThreatFeed />
                  </div>
                </div>
              </div>

              {/* Row 3: MITRE Heatmap + Risk Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MitreHeatmap cells={data.mitreHeatmap} />
                <RiskTrendAnalytics data={data.riskTrend} />
              </div>

              {/* Row 4: Threat Families + Campaign Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopThreatFamilies families={data.threatFamilies} />
                <CampaignActivityPanel campaigns={data.campaigns} />
              </div>

              {/* Row 5: IOC Intelligence Table (full width) */}
              <IocIntelligenceTable iocs={data.iocIntel} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
