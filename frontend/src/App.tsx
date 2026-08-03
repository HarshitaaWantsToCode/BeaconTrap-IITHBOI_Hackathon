import React, { useState, useEffect } from "react";
import SidebarNav from "./components/layout/SidebarNav";
import SocCommandCenter from "./components/dashboard/SocCommandCenter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
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
  Layers,
  FileText,
  AlertTriangle,
  ArrowRight,
  Download
} from "lucide-react";
import ExecutiveReportPrintView from "./components/ExecutiveReportPrintView";
import AICopilot from "./components/copilot/AICopilot";
import { SocDashboardPayload } from "./types/dashboard";
import ThreatCorrelationGraph from "./components/ThreatCorrelationGraph";
import { LandingPage } from "./components/landing/LandingPage";
import { AnalysisProvider, useAnalysis } from "./context/AnalysisContext";
import { ThemeToggleSwitch } from "./components/ThemeToggleSwitch";
import { UserAuthModal } from "./components/auth/UserAuthModal";
import { SystemSettingsModal } from "./components/settings/SystemSettingsModal";
import { ServerTelemetryModal } from "./components/server/ServerTelemetryModal";




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
  const {
    caseData,
    campaignGraph,
    timeline,
    executiveSummary,
    language
  } = useAnalysis();

  const [activeSubTab, setActiveSubTab] = useState<
    "analyst" | "officer" | "citizen" | "campaign" | "timeline" | "ledger"
  >("analyst");

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Shield className="w-16 h-16 text-text-muted opacity-40 animate-pulse" />
        <h3 className="text-lg font-bold font-mono text-text-primary">NO ACTIVE CASE LOADED</h3>
        <p className="text-sm text-text-muted max-w-md">
          Please submit a target binary APK via the sandbox submission gateway to begin telemetry compilation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Target APK Identification Header */}
      <div className="bg-card border border-card-border rounded-xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {t('upload_new') /* reuse or something similar, actually let's just leave CRITICAL RISKS as is, or use t() */}
              CRITICAL RISKS TARGET DETECTED
            </span>
            <span className="text-xs font-mono text-text-muted">
              PKG: {caseData.packageName} v{caseData.versionCode}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">
            {t('lab_metrics')}: {caseData.fileName}
          </h2>
          <p className="text-xs font-mono text-text-secondary truncate max-w-2xl">
            SHA256: {caseData.sha256}
          </p>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <div className="text-right">
            <div className="text-xs font-mono text-text-muted">{t('threat_index')}</div>
            <div className="text-3xl font-extrabold text-rose-500 font-mono tracking-tight">
              {caseData.riskScore}/100
            </div>
          </div>
          <div className="w-[3px] h-12 bg-card-border" />
          <div>
            <div className="text-xs font-mono text-text-muted">{t('malware_type')}</div>
            <div className="text-sm font-extrabold text-primary font-mono uppercase">
              {caseData.threatFamily}
            </div>
            <span className="text-[10px] font-mono text-text-secondary uppercase">
              Confidence {caseData.threatConfidence}%
            </span>
          </div>
          <div className="w-[3px] h-12 bg-card-border md:block hidden no-print" />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-card-secondary hover:bg-primary/10 border border-card-border hover:border-primary/50 text-text-secondary hover:text-text-primary font-bold px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm cursor-pointer no-print"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>{t('export_dossier')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Deck Header */}
      <div className="flex border-b border-card-border pb-3 mb-6 gap-2 overflow-x-auto">
        {[
          { id: "analyst", label: t('security_analyst'), icon: Cpu },
          { id: "officer", label: t('bank_officer'), icon: Briefcase },
          { id: "citizen", label: t('citizen_impact'), icon: Globe },
          { id: "campaign", label: t('campaign_dna'), icon: Network },
          { id: "timeline", label: t('timeline'), icon: Clock },
          { id: "ledger", label: t('evidence_ledger'), icon: Fingerprint }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border rounded-lg transition-all duration-200 shrink-0 ${
                isSelected
                  ? "bg-primary/10 text-primary border-primary/40 shadow-sm"
                  : "bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-primary/10"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-panel Content switches */}
      <div className="bg-card border border-card-border rounded-xl p-6 backdrop-blur-md min-h-[500px]">
        {activeSubTab === "analyst" && <SecurityAnalystPanel />}
        {activeSubTab === "officer" && <GrcCompliancePanel />}
        {activeSubTab === "citizen" && <CitizenImpactPanel />}
        {activeSubTab === "campaign" && <CampaignDnaPanel />}
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

import { MultiSpeakerNarrator } from '@/components/copilot/MultiSpeakerNarrator';
import { useTranslation } from 'react-i18next';

function MainAppShell() {
  const { triggerAnalysis, casesAnalyzed, language, setLanguage } = useAnalysis();

  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<"LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB">("LANDING");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [headerNotify, setHeaderNotify] = useState<string | null>(null);
  
  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServerOpen, setIsServerOpen] = useState(false);

  const [copilotBriefingText, setCopilotBriefingText] = useState<Record<string, string>>({
    en: "Active campaigns detected targeting mobile banking applications via OTP interception and accessibility abuse. Immediate review of high-risk cases recommended.",
    hi: "ओटीपी इंटरसेप्शन और एक्सेसिबिलिटी दुरुपयोग के माध्यम से बैंकिंग अनुप्रयोगों को लक्षित करने वाले सक्रिय अभियानों का पता चला है। उच्च जोखिम वाले मामलों की तत्काल समीक्षा की सिफारिश की जाती है।",
    te: "OTP అంతరాయం మరియు యాక్సెసిబిలిటీ దుర్వినియోగం ద్వారా బ్యాంకింగ్ అప్లికేషన్‌లను లక్ష్యంగా చేసుకునే క్రియాశీల ప్రచారాలు కనుగొనబడ్డాయి. అధిక ప్రమాదం ఉన్న కేసుల తక్షణ సమీక్ష సిఫార్సు చేయబడింది.",
    kn: "OTP ಪ್ರತಿಬಂಧ ಮತ್ತು ಪ್ರವೇಶಿಸುವಿಕೆ ದುರುಪಯೋಗದ ಮೂಲಕ ಬ್ಯಾಂಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಗುರಿಯಾಗಿಸುವ ಸಕ್ರಿಯ ಪ್ರಚಾರಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ. ಹೆಚ್ಚಿನ ಅಪಾಯದ ಪ್ರಕರಣಗಳ ತಕ್ಷಣದ ಪರಿಶೀಲನೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.",
    ta: "OTP இடைமறிப்பு மற்றும் அணுகல் துஷ்பிரயோகம் மூலம் வங்கி பயன்பாடுகளை இலக்காகக் கொண்ட செயலில் உள்ள பிரச்சாரங்கள் கண்டறியப்பட்டுள்ளன. அதிக ஆபத்துள்ள வழக்குகளை உடனடியாக மதிப்பாய்வு செய்ய பரிந்துரைக்கப்படுகிறது."
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

  const showNotification = (msg: string) => {
    setHeaderNotify(msg);
    setTimeout(() => {
      setHeaderNotify(null);
    }, 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const startUpload = async () => {
    if (!uploadFile) return;
    setUploadStatus("Uploading & analyzing target APK with static and AI pipeline...");
    try {
      await triggerAnalysis(uploadFile);
      setUploadStatus(`Analysis complete for ${uploadFile.name}! Redirecting to Analysis Lab...`);
      setTimeout(() => {
        setActiveView("ANALYSIS_LAB");
      }, 800);
    } catch (err: any) {
      setUploadStatus(`Analysis failed: ${err?.message || "Sandbox analysis error"}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-primary">
      {/* Interactive Modals */}
      <UserAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SystemSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ServerTelemetryModal isOpen={isServerOpen} onClose={() => setIsServerOpen(false)} />

      {/* Sidebar Section */}
      <aside className="w-64 bg-card border-r border-card-border flex flex-col">
        <div className="p-6 border-b border-card-border flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="font-extrabold tracking-wider text-sm text-text-primary uppercase">
              BeaconTrap
            </h1>
            <p className="text-[10px] font-mono text-text-muted">
              MALWARE INTEL v1.0
            </p>
          </div>
        </div>
        <SidebarNav activeView={activeView} onViewChange={setActiveView} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background-secondary via-background to-background">
        {/* Header */}
        <header className="h-16 border-b border-card-border px-8 flex items-center justify-between relative">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest bg-card-secondary px-2 py-1 rounded">
                {t('system_connected')}
              </span>
            </div>

          {headerNotify && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-primary/45 px-4 py-2 rounded-lg text-xs font-mono text-primary shadow-[0_0_15px_var(--primary-glow)] z-[200] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              <span>{headerNotify}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-text-muted">
            <MultiSpeakerNarrator 
              langCode={language} 
              textToRead={copilotBriefingText[language] || copilotBriefingText.en || ""} 
            />

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-card border border-card-border text-xs px-2 py-1 rounded text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="en">{t('lang_en')}</option>
              <option value="hi">{t('lang_hi')}</option>
              <option value="kn">{t('lang_kn')}</option>
              <option value="ta">{t('lang_ta')}</option>
              <option value="te">{t('lang_te')}</option>
            </select>

            {/* Sun to Moon Animated Light/Dark Mode Toggle */}
            <ThemeToggleSwitch />

            {/* Interactive Header Action Icons */}
            <button 
              onClick={() => setIsServerOpen(true)}
              className="p-2 rounded-lg hover:bg-card-bg-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              title="Infrastructure & Server Telemetry Node Status"
            >
              <Server className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsAuthOpen(true)}
              className="p-2 rounded-lg hover:bg-card-bg-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              title="User Identity, Clearance & Role Session (IAM)"
            >
              <Users className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg hover:bg-card-bg-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              title="System Heuristics, AI & Web3 Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>


        {/* View Switches & Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeView === "LANDING" && (
            <LandingPage
              onLaunchDashboard={() => setActiveView("DASHBOARD")}
              onUploadApk={() => setActiveView("UPLOAD")}
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


          {activeView === "UPLOAD" && (
            <div className="max-w-2xl mx-auto space-y-8 py-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  APK SUBMISSION SANDBOX
                </h2>
                <p className="text-sm text-text-muted font-mono">
                  SUBMIT ANDROID APPLICATION PACKAGES (APK) FOR FORENSIC DECOMPILATION AND EMULATION
                </p>
              </div>

              <div className="border-2 border-dashed border-card-border hover:border-primary/50 transition-colors rounded-xl p-12 text-center bg-card/30 backdrop-blur-md">
                <input
                  type="file"
                  id="apk-upload"
                  accept=".apk"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="apk-upload" className="cursor-pointer space-y-4 block">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-primary font-bold hover:underline">
                      Click to choose a file
                    </span>{" "}
                    or drag and drop
                  </div>
                  <div className="text-xs text-text-muted">
                    Only Android .apk files up to 200MB
                  </div>
                </label>
              </div>

              {uploadFile && (
                <div className="p-4 bg-card/50 border border-card-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{uploadFile.name}</p>
                    <p className="text-xs text-text-muted">
                      {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={startUpload}
                    className="bg-primary hover:bg-primary-hover text-[var(--btn-copilot-text)] px-4 py-2 rounded-md text-sm font-bold transition-all shadow-[0_0_15px_var(--primary-glow)]"
                  >
                    START ANALYSIS
                  </button>
                </div>
              )}

              {uploadStatus && (
                <div className="p-4 bg-card border border-primary/20 rounded-lg text-sm font-mono text-primary flex items-center justify-between">
                  <span className="animate-pulse">{uploadStatus}</span>
                  <button
                    onClick={() => setActiveView("ANALYSIS_LAB")}
                    className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                  >
                    Go to Lab <ArrowRight className="w-3.5 h-3.5" />
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
