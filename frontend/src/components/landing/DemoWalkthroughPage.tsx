import React, { useState } from "react";
import { 
  Activity, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Clock, 
  Globe, 
  Network, 
  CheckCircle2, 
  Share2, 
  Radio
} from "lucide-react";
import { 
  mockCriticalCaseData, 
  mockCampaignGraphData, 
  mockTimelineData, 
  mockExecutiveSummaryData 
} from "../../context/AnalysisContext";

interface DemoWalkthroughProps {
  onGoToLiveLab: () => void;
}

export const DemoWalkthroughPage: React.FC<DemoWalkthroughProps> = ({ onGoToLiveLab }) => {
  const [activeDemoTab, setActiveDemoTab] = useState<"ANALYSIS" | "GRC" | "CITIZEN" | "CAMPAIGN" | "TIMELINE" | "LEDGER">("ANALYSIS");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono">
      {/* Header Banner */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 rounded-sm">
              PRE-COMPILED DEMO GALLERY
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              FULL END-TO-END SYSTEM WALKTHROUGH MOCKUPS
            </span>
          </div>

          <button
            onClick={onGoToLiveLab}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--btn-copilot-text)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>Switch to Live Analysis Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            End-to-End Banking Trojan Forensics Walkthrough
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-4xl leading-relaxed font-sans pt-1">
            This workspace provides a full, unconstrained view of BeaconTrap's investigation features for a pre-analyzed Banking Trojan sample (<code className="text-[var(--accent)]">boi_safe.apk</code>, Risk Index: 92/100). Browse all 6 forensic panels below.
          </p>
        </div>

        {/* Dynamic Demo Navigation Bar */}
        <div className="flex border-b border-[var(--border)] pt-2 gap-1 overflow-x-auto">
          {[
            { id: "ANALYSIS", label: "Forensic Analysis", icon: Cpu },
            { id: "GRC", label: "GRC Compliance", icon: FileText },
            { id: "CITIZEN", label: "Citizen Exposure", icon: Globe },
            { id: "CAMPAIGN", label: "Campaign DNA", icon: Network },
            { id: "TIMELINE", label: "Event Timeline", icon: Clock },
            { id: "LEDGER", label: "Evidence Ledger", icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeDemoTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDemoTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium uppercase tracking-wider border-b-2 transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent)] text-[var(--text-primary)] bg-[var(--bg-panel-alt)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Render */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* TAB 1: FORENSIC ANALYSIS */}
        {activeDemoTab === "ANALYSIS" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black tracking-wide uppercase text-white font-mono">
                  Static & Dynamic Forensic Findings
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-rose-400 bg-rose-950/60 px-3 py-1 border border-rose-500/40 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.25)]">
                TROJAN RISK: 92/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-2.5 shadow-md">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block font-mono">Binary Identity</span>
                <div className="text-base font-black text-white font-mono">{mockCriticalCaseData.fileName}</div>
                <div className="text-xs text-indigo-300 font-mono font-semibold">PKG: {mockCriticalCaseData.packageName}</div>
                <div className="text-[10px] text-slate-300 font-mono break-all pt-2 leading-relaxed">
                  <span className="text-indigo-300 font-bold">SHA256:</span> {mockCriticalCaseData.sha256}
                </div>
              </div>

              <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-3 col-span-2 shadow-md">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block font-mono">
                  Extracted Dangerous Permissions
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {JSON.parse(mockCriticalCaseData.permissions).map((perm: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-rose-950/50 text-rose-300 border border-rose-500/40 rounded-xl shadow-sm"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-2 shadow-md">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block font-mono">
                AI Threat Narrative & De-Obfuscation Analysis
              </span>
              <p className="text-xs leading-relaxed text-white font-sans font-medium">
                {JSON.parse(mockCriticalCaseData.threatNarrative || "{}").behavior}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: GRC COMPLIANCE */}
        {activeDemoTab === "GRC" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black tracking-wide uppercase text-white font-mono">
                  GRC Compliance & Regulatory Directives
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-indigo-300 bg-indigo-950/60 px-3 py-1 border border-indigo-500/40 rounded-full">
                RBI / CERT-In / DPDP Act 2023
              </span>
            </div>

            <div className="p-5 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-2 shadow-md">
              <h4 className="text-sm font-black text-rose-300 uppercase font-mono">
                DPDP Act 2023 — Section 8 Breach Notice
              </h4>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                Direct violation of consumer personal data protections due to unauthorized SMS interception and background overlay injection targeting banking credentials.
              </p>
            </div>

            <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-3 shadow-md">
              <h4 className="text-xs font-black uppercase text-indigo-300 font-mono tracking-wider">
                Mandatory Executive Action Plan
              </h4>
              <ul className="text-xs space-y-2.5 font-sans text-white">
                {mockExecutiveSummaryData.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-white">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: CITIZEN EXPOSURE */}
        {activeDemoTab === "CITIZEN" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black tracking-wide uppercase text-white font-mono">
                  Citizen Impact & Risk Exposure Assessment
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-1.5 shadow-md">
                <span className="text-[10px] text-indigo-300 uppercase block font-bold">Estimated Population Exposure</span>
                <span className="text-base font-black text-rose-400">5,000+ Active Mobile Devices</span>
              </div>
              <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-1.5 shadow-md">
                <span className="text-[10px] text-indigo-300 uppercase block font-bold">Estimated Financial Exposure</span>
                <span className="text-base font-black text-indigo-300">₹1.5Cr - ₹3.0Cr</span>
              </div>
              <div className="p-5 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-1.5 shadow-md">
                <span className="text-[10px] text-indigo-300 uppercase block font-bold">Target Demographic</span>
                <span className="text-sm font-bold text-white">Retail Banking Consumers</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAMPAIGN DNA */}
        {activeDemoTab === "CAMPAIGN" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black tracking-wide uppercase text-white font-mono">
                  Campaign DNA Relationship Graph
                </h3>
              </div>
              <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-3 py-1 border border-indigo-500/40 rounded-full">
                Neo4j Cypher Engine
              </span>
            </div>

            <div className="p-6 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-4 shadow-md">
              <span className="text-xs font-black uppercase text-indigo-300 font-mono tracking-wider">
                Correlated Shared Infrastructure Nodes
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
                {mockCampaignGraphData.nodes.map((node) => (
                  <div key={node.id} className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <div className="font-black text-white">{node.label}</div>
                      <div className="text-[10px] text-indigo-300 mt-0.5">NODE TYPE: {node.group.toUpperCase()}</div>
                    </div>
                    <span className="text-xs font-black text-indigo-300 bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-500/40">
                      {node.risk}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EVENT TIMELINE */}
        {activeDemoTab === "TIMELINE" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black tracking-wide uppercase text-white font-mono">
                  Chronological Investigation Timeline
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              {mockTimelineData.map((ev) => (
                <div key={ev.id} className="p-4 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl flex items-start gap-4 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1.5 shrink-0 shadow-[0_0_8px_#818CF8]" />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white text-sm">{ev.event}</span>
                      <span className="text-[10px] text-indigo-300 font-bold">{ev.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-sans leading-relaxed">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EVIDENCE LEDGER */}
        {activeDemoTab === "LEDGER" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black tracking-wide uppercase text-white font-mono">
                  Blockchain Evidence Anchoring Receipt
                </h3>
              </div>
              <span className="text-xs text-emerald-300 font-black bg-emerald-950/60 px-3 py-1 border border-emerald-500/40 rounded-full">
                Ethereum Sepolia Verified
              </span>
            </div>

            <div className="p-6 bg-[var(--bg-panel-alt)] border border-[var(--border)] rounded-2xl space-y-4 text-xs font-mono shadow-md">
              <div>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">VERIFIED CONTRACT ADDRESS</span>
                <span className="text-indigo-300 text-xs font-mono font-black break-all">0xd9aa91a39248916D946C75Abf875F2b1660a8732</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">SEPOLIA BLOCK INDEX</span>
                <span className="text-white font-black text-sm">Block #1782345</span>
              </div>
              <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-xs text-slate-200 font-sans leading-relaxed">
                  Courtroom Chain-of-Custody Integrity Guaranteed via cryptographic hash anchoring.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
