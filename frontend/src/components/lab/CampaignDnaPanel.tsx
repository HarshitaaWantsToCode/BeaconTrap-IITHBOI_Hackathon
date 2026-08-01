import React from "react";
import { Network } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";
import ThreatCorrelationGraph from "../ThreatCorrelationGraph";

export default function CampaignDnaPanel() {
  const { caseData } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR CAMPAIGN DNA PANEL
      </div>
    );
  }

  const mitreTags = JSON.parse(caseData.mitreTags || "[]");
  const iocs = JSON.parse(caseData.iocs || "[]");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <Network className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
          Campaign Infrastructure DNA
        </h3>
      </div>

      <div className="h-[450px] bg-card-secondary/50 border border-card-border rounded-xl relative overflow-hidden">
        <ThreatCorrelationGraph
          fileName={caseData.fileName}
          threatFamily={caseData.threatFamily}
          riskScore={caseData.riskScore}
          mitreTags={mitreTags}
          iocs={iocs}
        />
      </div>
      
      <div className="p-3.5 bg-card border border-card-border rounded-lg text-xs font-mono text-text-secondary flex justify-between">
        <span>ACTIVE CORRELATED NODES: 5</span>
        <span>MALICIOUS ENDPOINT MATCHES: 185.220.101.5 / update-server-v3.net</span>
      </div>
    </div>
  );
}
