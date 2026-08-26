import React, { useState, useEffect, useMemo } from "react";
import SidebarNav from "./components/layout/SidebarNav";
import SocCommandCenter from "./components/dashboard/SocCommandCenter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Shield,
  Settings,
  Server,
  Users,
  Cpu,
  Briefcase,
  Globe,
  Network,
  Clock,
  Fingerprint,
  ArrowRight,
  Download
} from "lucide-react";
import ExecutiveReportPrintView from "./components/ExecutiveReportPrintView";
import AICopilot from "./components/copilot/AICopilot";
import { SocDashboardPayload } from "./types/dashboard";
import { LandingPage } from "./components/landing/LandingPage";
import { DemoWalkthroughPage } from "./components/landing/DemoWalkthroughPage";
import { AnalysisProvider, useAnalysis } from "./context/AnalysisContext";
import { ThemeToggleSwitch } from "./components/ThemeToggleSwitch";

import { UserAuthModal } from "./components/auth/UserAuthModal";
import { SystemSettingsModal } from "./components/settings/SystemSettingsModal";
import { ServerTelemetryModal } from "./components/server/ServerTelemetryModal";
import { MultiSpeakerNarrator } from './components/copilot/MultiSpeakerNarrator';
import { useTranslation } from 'react-i18next';

// Modular Lab Components
import SecurityAnalystPanel from "./components/lab/SecurityAnalystPanel";
import GrcCompliancePanel from "./components/lab/GrcCompliancePanel";
import CitizenImpactPanel from "./components/lab/CitizenImpactPanel";
import CampaignDnaPanel from "./components/lab/CampaignDnaPanel";
import TimelinePanel from "./components/lab/TimelinePanel";
import BlockchainEvidencePanel from "./components/lab/BlockchainEvidencePanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const mockDashboardData: SocDashboardPayload = {
  metrics: {
    totalCases: 142,
    criticalThreats: 18,
    highRiskApks: 34,
    avgRisk: 74,
    citizenExposure: "High",
    activeCampaign: "Anubis-X V3",
    activeCampaignConfidence: 94,
    iocCount: 812,
    mitreTechniqueCount: 27
  },
  mitreHeatmap: [
    { tactic: "Initial Access", techniqueId: "T1475", techniqueName: "Malicious APK Link", count: 42, severity: "critical", confidence: 95 },
    { tactic: "Execution", techniqueId: "T1446", techniqueName: "Shared Library Load", count: 18, severity: "high", confidence: 88 },
    { tactic: "Persistence", techniqueId: "T1624", techniqueName: "Receiver Registered", count: 35, severity: "high", confidence: 91 },
    { tactic: "Privilege Escalation", techniqueId: "T1400", techniqueName: "Accessibility Abuse", count: 28, severity: "critical", confidence: 97 },
    { tactic: "Credential Access", techniqueId: "T1417", techniqueName: "Input Interception", count: 15, severity: "high", confidence: 90 },
    { tactic: "Defense Evasion", techniqueId: "T1407", techniqueName: "Obfuscation", count: 56, severity: "critical", confidence: 99 }
  ],
  threatFamilies: [
    { name: "Anubis Banking Trojan", count: 48, avgRisk: 92, trend: "up" },
    { name: "Cerberus Trojan", count: 32, avgRisk: 86, trend: "stable" },
    { name: "TeaBot Spyware", count: 25, avgRisk: 78, trend: "up" },
    { name: "SpyNote RAT", count: 19, avgRisk: 65, trend: "down" }
  ],
  riskTrend: [
    { date: "07/03", score: 85, file: "update.apk", caseId: "c1" },
    { date: "07/04", score: 92, file: "invoice.apk", caseId: "c2" },
    { date: "07/05", score: 64, file: "game.apk", caseId: "c3" },
    { date: "07/06", score: 78, file: "pdf_viewer.apk", caseId: "c4" },
    { date: "07/07", score: 91, file: "boi_safe.apk", caseId: "c5" },
    { date: "07/08", score: 88, file: "delivery_tracking.apk", caseId: "c6" }
  ],
  iocIntel: [
    { id: "ioc-1", type: "IP", value: "185.220.101.5", severity: "CRITICAL", confidence: 98, caseId: "case-01", fileName: "boi_safe.apk", threatFamily: "Anubis", firstSeen: "2026-07-09" },
    { id: "ioc-2", type: "Domain", value: "update-server-v3.net", severity: "HIGH", confidence: 92, caseId: "case-01", fileName: "boi_safe.apk", threatFamily: "Anubis", firstSeen: "2026-07-08" },
    { id: "ioc-3", type: "SHA256", value: "f3a09b...92e10", severity: "MEDIUM", confidence: 85, caseId: "case-02", fileName: "delivery_tracking.apk", threatFamily: "TeaBot", firstSeen: "2026-07-07" }
  ],
  campaigns: [
    { id: "c-1", label: "Anubis-X Campaign", threatFamily: "Anubis", caseCount: 14, avgRisk: 91, sharedInfrastructure: ["update-server-v3.net", "185.220.101.5"], status: "active", lastSeen: "2026-07-09" },
    { id: "c-2", label: "TeaBot Spreader", threatFamily: "TeaBot", caseCount: 8, avgRisk: 82, sharedInfrastructure: ["cdn-node-04.net"], status: "monitoring", lastSeen: "2026-07-08" }
  ],
  correlationGraph: {
    nodes: [
      { id: "apk-1", type: "apk", label: "boi_safe.apk", sublabel: "BC-9201", risk: 91 },
      { id: "domain-1", type: "domain", label: "update-server-v3.net", risk: 85 },
      { id: "ip-1", type: "ip", label: "185.220.101.5", risk: 98 },
      { id: "family-1", type: "family", label: "Anubis Family", risk: 90 }
    ],
    edges: [
      { id: "e1", source: "apk-1", target: "domain-1", label: "CONTACTS" },
      { id: "e2", source: "domain-1", target: "ip-1", label: "RESOLVES_TO" },
      { id: "e3", source: "apk-1", target: "family-1", label: "BELONGS_TO" }
    ]
  }
};

function AnalysisLabWorkspace() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    caseData,
    campaignGraph,
    timeline,
    executiveSummary,
    language,
    setLanguage
  } = useAnalysis();

  const currentRole = user?.role || "ANALYST";

  const defaultSubTab = useMemo(() => {
    if (currentRole === "BANK_OFFICER") return "officer";
    if (currentRole === "CITIZEN") return "citizen";
    return "analyst";
  }, [currentRole]);

  const [activeSubTab, setActiveSubTab] = useState<
    "analyst" | "officer" | "citizen" | "campaign" | "timeline" | "ledger"
  >(defaultSubTab);

  useEffect(() => {
    if (currentRole === "BANK_OFFICER" && activeSubTab === "analyst") {
      setActiveSubTab("officer");
    } else if (currentRole === "CITIZEN" && (activeSubTab === "analyst" || activeSubTab === "officer")) {
      setActiveSubTab("citizen");
    }
  }, [currentRole]);

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm p-12">
        <Shield className="w-12 h-12 text-[var(--text-muted)] opacity-40" />
        <h3 className="text-base font-mono font-bold text-[var(--text-primary)]">NO ACTIVE CASE LOADED</h3>
        <p className="text-xs font-mono text-[var(--text-muted)] max-w-md">
          Submit a target Android binary (.apk) via the submission gateway to compile static and dynamic forensics telemetry.
        </p>
      </div>
    );
  }

  const allTabs = [
    { id: "analyst", label: t('security_analyst') || "Forensic Analysis", icon: Cpu, roles: ["ANALYST", "ADMIN"] },
    { id: "officer", label: t('bank_officer') || "GRC Compliance", icon: Briefcase, roles: ["ANALYST", "BANK_OFFICER", "ADMIN"] },
    { id: "citizen", label: t('citizen_impact') || "Citizen Exposure", icon: Globe, roles: ["ANALYST", "BANK_OFFICER", "CITIZEN", "AUDITOR", "ADMIN"] },
    { id: "campaign", label: t('campaign_dna') || "Campaign DNA", icon: Network, roles: ["ANALYST", "BANK_OFFICER", "ADMIN"] },
    { id: "timeline", label: t('timeline') || "Event Timeline", icon: Clock, roles: ["ANALYST", "BANK_OFFICER", "CITIZEN", "AUDITOR", "ADMIN"] },
    { id: "ledger", label: t('evidence_ledger') || "Evidence Ledger", icon: Fingerprint, roles: ["ANALYST", "BANK_OFFICER", "CITIZEN", "AUDITOR", "ADMIN"] }
  ];

  const allowedTabs = allTabs.filter(tab => tab.roles.includes(currentRole));

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto font-mono">
      {/* Target APK Identification Header */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-2xl p-5 flex flex-col lg:flex-row justify-between gap-6 shadow-xl backdrop-blur-md">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border shadow-sm ${
              caseData.riskScore > 50
                ? "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
            }`}>
              {caseData.riskScore > 50 ? "CRITICAL RISK TARGET DETECTED" : "VERIFIED LOW RISK TARGET"}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-panel-alt)] px-2.5 py-0.5 rounded-lg border border-[var(--border)]">
              PKG: <code className="text-indigo-300 font-mono font-semibold">{caseData.packageName} v{caseData.versionCode}</code>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[var(--bg-panel-alt)] text-[var(--text-muted)] border border-[var(--border)]">
              ROLE: {currentRole}
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-[var(--accent)]">LAB METRICS:</span> {caseData.fileName || "boi_safe.apk"}
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] truncate max-w-2xl bg-[var(--bg-panel-alt)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
            <span className="opacity-60 font-semibold">SHA-256:</span> {caseData.sha256}
          </p>
        </div>

        <div className="flex gap-4 items-center flex-wrap justify-between lg:justify-end">
          {/* Concentric SVG Risk Dial */}
          <div className="flex items-center gap-3 bg-[var(--bg-panel-alt)] border border-[var(--border)] px-4 py-2.5 rounded-2xl shadow-inner">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-800/60"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={caseData.riskScore > 50 ? "text-rose-500" : "text-emerald-400"}
                  strokeDasharray={`${caseData.riskScore || 92}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{caseData.riskScore || 92}</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">COMPOSITE RISK</div>
              <div className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                {caseData.riskScore > 80 ? "92/100 CRITICAL" : `${caseData.riskScore}/100 ELEVATED`}
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-panel-alt)] border border-[var(--border)] px-4 py-2.5 rounded-2xl shadow-inner">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">MALWARE TYPE</div>
            <div className="text-sm font-bold text-[var(--accent)] font-mono uppercase tracking-wide">
              {caseData.threatFamily ? caseData.threatFamily.toUpperCase() : "BANKING TROJAN"}
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              CONFIDENCE {caseData.threatConfidence || 94}%
            </span>
          </div>

          <div className="flex items-center gap-2.5 no-print">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[var(--bg-panel-alt)] border border-[var(--border)] text-xs font-mono px-3 py-2 rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/60 cursor-pointer shadow-sm"
              title="Select Dossier Export Language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
            </select>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT DOSSIER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Deck Tabs */}
      <div className="flex border-b border-[var(--border)] pb-1 gap-1.5 overflow-x-auto">
        {allowedTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all duration-200 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[var(--bg-panel)] text-[var(--text-primary)] border-b-2 border-[#6366F1] shadow-md"
                  : "bg-[var(--bg-panel)]/50 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] border-b-2 border-transparent"
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
              <span>{tab.label}</span>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366F1] shadow-[0_0_10px_#6366F1]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Workspace Panel */}
      <div className="bg-[var(--bg-panel)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5 min-h-[500px] shadow-xl">
        {activeSubTab === "analyst" && currentRole !== "BANK_OFFICER" && currentRole !== "CITIZEN" && <SecurityAnalystPanel />}
        {activeSubTab === "officer" && currentRole !== "CITIZEN" && <GrcCompliancePanel />}
        {activeSubTab === "citizen" && <CitizenImpactPanel />}
        {activeSubTab === "campaign" && currentRole !== "CITIZEN" && <CampaignDnaPanel />}
        {activeSubTab === "timeline" && <TimelinePanel />}
        {activeSubTab === "ledger" && <BlockchainEvidencePanel />}
      </div>

      <ExecutiveReportPrintView
        caseData={caseData}
        execSummaryData={executiveSummary}
        graphData={campaignGraph}
        timelineData={timeline}
        permissions={JSON.parse(caseData.permissions || "[]")}
        activities={JSON.parse(caseData.activities || "[]")}
        services={JSON.parse(caseData.services || "[]")}
        mitreTags={JSON.parse(caseData.mitreTags || "[]")}
        iocs={JSON.parse(caseData.iocs || "[]")}
        threatNarrative={caseData.threatNarrative ? JSON.parse(caseData.threatNarrative) : {}}
        citizenImpact={caseData.citizenImpact ? JSON.parse(caseData.citizenImpact) : {}}
        langCode={language}
        regionalAdvisory={caseData.multilingualReports ? JSON.parse(caseData.multilingualReports) : {}}
      />
    </div>
  );
}

function MainAppShell() {
  const { triggerAnalysis, casesAnalyzed, language, setLanguage } = useAnalysis();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<"LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB" | "DEMO_WALKTHROUGH">("LANDING");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [headerNotify, setHeaderNotify] = useState<string | null>(null);

  
  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServerOpen, setIsServerOpen] = useState(false);

  const [copilotBriefingText, setCopilotBriefingText] = useState<Record<string, string>>({
    en: "Active campaigns detected targeting mobile banking applications via OTP interception and accessibility abuse. Immediate review of high-risk cases recommended.",
    hi: "ओटीपी इंटरसेप्शन और एक्सेसिबिलिटी दुरुपयोग के माध्यम से बैंकिंग अनुप्रयोगों को लक्षित करने वाले सक्रिय अभियानों का पता चला है।",
    te: "OTP అంతరాయం మరియు యాక్సెసిబిలిటీ దుర్వినియోగం ద్వారా బ్యాంకింగ్ అప్లికేషన్‌లను లక్ష్యంగా చేసుకునే ప్రచారాలు కనుగొనబడ్డాయి.",
    kn: "OTP ಪ್ರತಿಬಂಧ ಮತ್ತು ಪ್ರವೇಶಿಸುವಿಕೆ ದುರುಪಯೋಗದ ಮೂಲಕ ಬ್ಯಾಂಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಗುರಿಯಾಗಿಸುವ ಸಕ್ರಿಯ ಪ್ರಚಾರಗಳು ಪತ್ತೆಯಾಗಿವೆ.",
    ta: "OTP இடைமறிப்பு மற்றும் அணுகல் துஷ்பிரயோகம் மூலம் வங்கி பயன்பாடுகளை இலக்காகக் கொண்ட பிரச்சாரங்கள் கண்டறியப்பட்டுள்ளன."
  });

  useEffect(() => {
    fetch("/api/admin/executive-summary")
      .then(res => res.json())
      .then(data => {
        if (data && data.copilotBriefing) {
          setCopilotBriefingText(data.copilotBriefing);
        }
      })
      .catch(err => console.error("Failed to load briefing for narrator", err));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const startUpload = async () => {
    if (!uploadFile) return;
    setUploadStatus("Uploading target APK binary & compiling static/dynamic heuristics...");
    try {
      await triggerAnalysis(uploadFile);
      setUploadStatus(`Forensic compilation complete for ${uploadFile.name}. Opening Analysis Lab...`);
      setTimeout(() => {
        setActiveView("ANALYSIS_LAB");
      }, 800);
    } catch (err: any) {
      setUploadStatus(`Analysis error: ${err?.message || "Sandbox processing failed"}`);
    }
  };

  const handleSelectSampleApk = async (apkName: string) => {
    try {
      // Create synthetic File object for sample APK
      const sampleFile = new File(["dummy-sample-apk-content"], apkName, { type: "application/vnd.android.package-archive" });
      await triggerAnalysis(sampleFile);
      setActiveView("ANALYSIS_LAB");
    } catch (e) {
      console.error("Failed to load sample APK", e);
      setActiveView("ANALYSIS_LAB");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] font-sans antialiased bg-soc-grid">
      {/* Modals */}
      <UserAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SystemSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ServerTelemetryModal isOpen={isServerOpen} onClose={() => setIsServerOpen(false)} />

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[var(--bg-base)] border-r border-[var(--border)] flex flex-col shrink-0">
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-panel-alt)] border border-[var(--accent)]/40 flex items-center justify-center text-[var(--accent)] shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-widest text-sm text-[var(--text-primary)] font-mono">
              BEACONTRAP
            </h1>
          </div>
        </div>
        <SidebarNav activeView={activeView} onViewChange={setActiveView} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-base)] backdrop-blur-sm">
        {/* Top Telemetry Ribbon Header */}
        <header className="h-12 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-header)] backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--text-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[var(--text-primary)] font-semibold tracking-wider">
              SYSTEM CONNECTED — NODE: IND-LEAP-205_BOI
            </span>
            <span className="opacity-40">|</span>
            <span className="text-[var(--text-muted)]">SYSTEM LATENCY: <span className="text-emerald-400 font-bold">45ms</span></span>
            <span className="opacity-40">|</span>
            <span className="text-[var(--text-muted)]">REFRESH INTERVAL: <span className="text-[var(--accent)] font-bold">REAL-TIME</span></span>
          </div>

          {headerNotify && (
            <div className="bg-[var(--bg-panel)] border border-[var(--accent)]/40 px-3 py-1 text-xs font-mono text-[var(--accent)] flex items-center gap-2 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              <span>{headerNotify}</span>
            </div>
          )}

          {/* Top Right Utility Dock */}
          <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
            <MultiSpeakerNarrator 
              langCode={language} 
              textToRead={copilotBriefingText[language] || copilotBriefingText.en || ""} 
            />

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[var(--bg-panel)] border border-[var(--border)] text-xs font-mono px-2.5 py-1.5 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/60 cursor-pointer"
              title="Select Console Language"
            >
              <option value="en">{t('lang_en') || "English"}</option>
              <option value="hi">{t('lang_hi') || "हिंदी (Hindi)"}</option>
              <option value="kn">{t('lang_kn') || "ಕನ್ನಡ (Kannada)"}</option>
              <option value="ta">{t('lang_ta') || "தமிழ் (Tamil)"}</option>
              <option value="te">{t('lang_te') || "తెలుగు (Telugu)"}</option>
              <option value="bn">{t('lang_bn') || "বাংলা (Bengali)"}</option>
              <option value="mr">{t('lang_mr') || "मराठी (Marathi)"}</option>
              <option value="gu">{t('lang_gu') || "ગુજરાતી (Gujarati)"}</option>
              <option value="ml">{t('lang_ml') || "മലയാളം (Malayalam)"}</option>
              <option value="pa">{t('lang_pa') || "ਪੰਜਾਬੀ (Punjabi)"}</option>
              <option value="or">{t('lang_or') || "ଓଡ଼ିଆ (Odia)"}</option>
            </select>

            <ThemeToggleSwitch />

            <button 
              onClick={() => setIsServerOpen(true)}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] hover:border-[var(--accent)]/50 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all cursor-pointer shadow-sm"
              title="System Topology & Infrastructure"
            >
              <Server className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsAuthOpen(true)}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] hover:border-[var(--accent)]/50 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all cursor-pointer shadow-sm"
              title="Global Database Sync & Identities"
            >
              <Users className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] hover:border-[var(--accent)]/50 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all cursor-pointer shadow-sm"
              title="CISO Notification Hub & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic View Panels */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeView === "LANDING" && (
            <LandingPage
              onLaunchDashboard={() => setActiveView("DASHBOARD")}
              onUploadApk={() => setActiveView("UPLOAD")}
              onSelectSampleApk={handleSelectSampleApk}
              onNavigateToView={(v) => setActiveView(v)}
            />
          )}

          {activeView === "DASHBOARD" && (
            <SocCommandCenter
              data={{
                ...mockDashboardData,
                metrics: {
                  ...mockDashboardData.metrics,
                  totalCases: casesAnalyzed
                }
              }}
              onNavigateToUpload={() => setActiveView("UPLOAD")}
            />
          )}

          {activeView === "DEMO_WALKTHROUGH" && (
            <DemoWalkthroughPage
              onGoToLiveLab={() => setActiveView("ANALYSIS_LAB")}
            />
          )}


          {activeView === "UPLOAD" && (
            <div className="max-w-2xl mx-auto space-y-6 py-8">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  APK Forensic Sandbox Gateway
                </h2>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  Upload target Android binaries (.apk) for static decompilation, YARA matching, and dynamic behavior emulation.
                </p>
              </div>

              <div className="border border-dashed border-[var(--border)] hover:border-[var(--accent)]/60 transition-colors rounded-sm p-8 text-center bg-[var(--bg-panel)]">
                <input
                  type="file"
                  id="apk-upload"
                  accept=".apk"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="apk-upload" className="cursor-pointer space-y-3 block">
                  <div className="mx-auto w-10 h-10 rounded-sm bg-[var(--bg-panel-alt)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[var(--text-primary)] font-mono text-xs font-bold hover:underline">
                      Select Android APK binary file
                    </span>{" "}
                    <span className="text-[var(--text-muted)] text-xs">or drag and drop</span>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">
                    Maximum file size: 200MB (.apk format)
                  </div>
                </label>
              </div>

              {uploadFile && (
                <div className="p-3 bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono font-bold text-[var(--text-primary)]">{uploadFile.name}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      Size: {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={startUpload}
                    className="bg-[var(--accent)] hover:bg-[var(--primary-hover)] text-[var(--btn-copilot-text)] px-3.5 py-1.5 rounded-sm text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    START ANALYSIS
                  </button>
                </div>
              )}

              {uploadStatus && (
                <div className="p-3 bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm text-xs font-mono text-[var(--accent)] flex items-center justify-between">
                  <span>{uploadStatus}</span>
                  <button
                    onClick={() => setActiveView("ANALYSIS_LAB")}
                    className="flex items-center gap-1 text-xs font-mono text-[var(--text-primary)] hover:underline"
                  >
                    View Lab <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeView === "ANALYSIS_LAB" && (
            <AnalysisLabWorkspace />
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WebSocketProvider>
            <AnalysisProvider>
              <MainAppShell />
              <AICopilot />
            </AnalysisProvider>
          </WebSocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
