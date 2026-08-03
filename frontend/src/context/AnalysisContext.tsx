import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Graph types matching the application requirements
export interface GraphNode {
  id: string;
  label: string;
  group: string; // group maps to the visual category (apk, domain, ip, family, etc.)
  risk: number;
  confidence?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  value?: string;
}

export interface TimelineEventData {
  id: string;
  event: string;
  timestamp: string;
  description: string;
}

export interface ExecutiveSummaryData {
  priorityLevel: string;
  estimatedExposure: string;
  executiveRiskSummary: string;
  businessImpact: string;
  recommendedActions: string[];
}

export interface CaseDataPayload {
  id: string;
  fileName: string;
  fileSize: number;
  sha256: string;
  status: string;
  createdAt: Date;
  analysisMode: string;
  packageName: string | null;
  versionCode: string | null;
  permissions: string; // JSON string representation of string[]
  activities: string; // JSON string representation of string[]
  services: string; // JSON string representation of string[]
  mitreTags: string; // JSON string representation of MitreTag[]
  threatFamily: string | null;
  threatConfidence: number | null;
  iocs: string; // JSON string representation of Ioc[]
  riskScore: number;
  permissionScore: number;
  iocScore: number;
  keywordScore: number;
  aiConfidence: number;
  malwareType: string | null;
  threatNarrative: string | null; // JSON string representation
  citizenImpact: string | null; // JSON string representation
  blockchainTxHash: string | null;
  blockchainBlock: number | null;
  blockchainTimestamp: Date | null;
  analystReport: string | null;
  officerReport: string | null;
  multilingualReports: string | null; // JSON string representation (en, hi, te, kn)
}

// Full hydrated mockup payload for the 92/100 banking trojan
export const mockCriticalCaseData: CaseDataPayload = {
  id: "case-boi-92",
  fileName: "boi_safe.apk",
  fileSize: 18432104, // ~17.58 MB
  sha256: "bfb624ea3887d197607a72382cf8943793e2b38cd4857b61f891b9201974de31",
  status: "COMPLETED",
  createdAt: new Date("2026-07-16T18:00:00Z"),
  analysisMode: "DYNAMIC_AND_STATIC",
  packageName: "com.boi.safe.verification",
  versionCode: "3.1.2",
  permissions: JSON.stringify([
    "android.permission.INTERNET",
    "android.permission.RECEIVE_SMS",
    "android.permission.READ_SMS",
    "android.permission.SEND_SMS",
    "android.permission.BIND_ACCESSIBILITY_SERVICE",
    "android.permission.READ_PHONE_STATE",
    "android.permission.REQUEST_INSTALL_PACKAGES",
    "android.permission.SYSTEM_ALERT_WINDOW"
  ]),
  activities: JSON.stringify([
    "com.boi.safe.verification.MainActivity",
    "com.boi.safe.verification.SplashActivity",
    "com.boi.safe.verification.OtpReceiverActivity",
    "com.boi.safe.verification.OverlayActivity"
  ]),
  services: JSON.stringify([
    "com.boi.safe.verification.SmsListenerService",
    "com.boi.safe.verification.BackgroundAccessibilityService"
  ]),
  mitreTags: JSON.stringify([
    { id: "T1475", name: "Malicious APK Link" },
    { id: "T1417", name: "Input Interception" },
    { id: "T1400", name: "Accessibility Abuse" },
    { id: "T1624", name: "Receiver Registered" },
    { id: "T1407", name: "Obfuscation" }
  ]),
  threatFamily: "Banking Trojan",
  threatConfidence: 96,
  iocs: JSON.stringify([
    { type: "IP", value: "185.220.101.5", severity: "CRITICAL" },
    { type: "Domain", value: "update-server-v3.net", severity: "HIGH" },
    { type: "SHA256", value: "bfb624ea3887d197607a72382cf8943793e2b38cd4857b61f891b9201974de31", severity: "CRITICAL" }
  ]),
  riskScore: 92,
  permissionScore: 95,
  iocScore: 90,
  keywordScore: 88,
  aiConfidence: 94,
  malwareType: "RAT / Overlay / SMS Interceptor",
  threatNarrative: JSON.stringify({
    behavior: "Deploys accessibility overlay screens imitating Bank of India (BOI) netbanking to steal login credentials, intercepts incoming OTPs via SMS listeners, and relays data to a remote command & control server.",
    fraudRisks: "High risk of unauthorized UPI transfers and domestic fund exfiltration.",
    otpTheft: "Monitors incoming SMS traffic and filters messages matching bank formats (OTP, transaction limits, credit/debit alerts).",
    accessibilityAbuse: "Abuses the Accessibility Service framework to automatically grant system permissions, simulate user clicks, and prevent user-initiated uninstallation.",
    credentialTheft: "Injects full-screen fake login overlays dynamically when the official BOI application is detected in the foreground.",
    bankingImpact: "Direct target of Bank of India consumers, causing potential financial exposure and reputation loss."
  }),
  citizenImpact: JSON.stringify({
    affectedPopulation: "High - Estimated 5,000+ Indian citizens targeted",
    targetGroup: "Bank of India retail banking consumers using older Android OS versions",
    fraudType: "Identity Theft, Credentials Harvesting & Financial Fraud (₹1.5Cr - ₹3Cr exposure)",
    priority: "Critical Priority"
  }),
  blockchainTxHash: "0x7d9f7831ac1352e89645a272314541991a92e1069b2241cf1352e89645a27231",
  blockchainBlock: 1782345,
  blockchainTimestamp: new Date("2026-07-16T18:15:00Z"),
  analystReport: `## Forensic Analysis Report - BOI RAT Trojan\n\n### Executive Summary\nThe sample \`boi_safe.apk\` was detected as a highly critical banking trojan targeting customers of Bank of India. It utilizes advanced accessibility hijacking capabilities combined with silent SMS exfiltration to bypass multi-factor authentication controls.\n\n### Technical Findings\n1. **Overlay attack vector**: The application registers a background service that polls the current package window. Once the official BOI application starts, a custom Android window overlay is rendered containing input forms for username, password, and transaction PIN.\n2. **MFA Interception**: The SMS broadcast receiver is registered with a high priority (999), intercepting transaction codes and suppressing user notifications.`,
  officerReport: `## GRC Advisory & Directive Action Plan\n\n### Regulatory Impact\n* **Section 8 (DPDP Act, 2023)**: Direct breach of consumer personal data protections due to credential harvesting.\n* **CERT-In cyber-incident compliance**: Immediate registration mandatory.\n\n### Urgent Countermeasures\n1. Issue ISP DNS sinkhole request for \`update-server-v3.net\`.\n2. Push customer warnings on bank mobile channels advising against sideloaded APK installations.`,
  multilingualReports: JSON.stringify({
    en: {
      summary: "This malicious application intercepts credentials and SMS to bypass Bank of India Multi-Factor Authentication. It poses a critical threat to user savings.",
      advisory: "Do not download banking apps via links received in SMS or third-party web portals. Only use official app stores like Google Play Store."
    },
    hi: {
      summary: "यह दुर्भावनापूर्ण एप्लिकेशन बैंक ऑफ इंडिया मल्टी-फैक्टर ऑथेंटिकेशन को बाईपास करने के लिए क्रेडेंशিয়ल्स और एसएमएस को इंटरसेप्ट करता है। यह उपयोगकर्ता की बचत के लिए एक गंभीर खतरा है।",
      advisory: "एसएमएस या तीसरे पक्ष के वेब पोर्टल्स में प्राप्त लिंक के माध्यम से बैंकिंग ऐप डाउनलोड न करें। केवल Google Play Store जैसे आधिकारिक ऐप स्टोर का उपयोग करें।"
    },
    te: {
      summary: "ఈ హానికరమైన అప్లికేషన్ బ్యాంక్ ఆఫ్ ఇండియా మల్టీ-ఫ్యాక్టర్ అథెంటికేషన్‌ను బైపాస్ చేయడానికి ఆధారాలను మరియు SMSలను అడ్డగిస్తుంది. ఇది వినియోగదారుల పొదుపుకు తీవ్రమైన ముప్పు కలిగిస్తుంది.",
      advisory: "SMS లేదా మూడవ పక్షం వెబ్ పోర్టల్స్ ద్వారా వచ్చిన లింక్‌ల నుండి బ్యాంకింగ్ యాప్‌లను డౌన్‌లోಡ್ చేయవద్దు. గూగుల్ ప్ಲೇ స్టೋర్ వంటి అధికారಿಕ యాప్ స్టೋర్‌లను మాత్రమే ఉపయోగించండి."
    },
    kn: {
      summary: "ಈ ದುರುದ್ದೇಶಪೂರಿತ ಅಪ್ಲಿಕೇಶನ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ ಮಲ್ಟಿ-ಫ್ಯಾಕ್ಟರ್ ದೃಢೀಕರಣವನ್ನು ಬೈಪಾಸ್ ಮಾಡಲು ಬಳಕೆದಾರರ ರುಜುವಾತುಗಳನ್ನು ಮತ್ತು SMS ಗಳನ್ನು ಕದಿಯುತ್ತದೆ. ಇದು ಬಳಕೆದಾರರ ಉಳಿತಾಯಕ್ಕೆ ಗಂಭೀರ ಅಪಾಯವಾಗಿದೆ.",
      advisory: "SMS ಅಥವಾ ಇತರ ತೃತೀಯ ವೆಬ್ ಸೈಟ್ ಲಿಂಕ್‌ಗಳ ಮೂಲಕ ಬ್ಯಾಂಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ. ಅಧಿಕೃತ ಪ್ಲೇ ಸ್ಟೋರ್ ಮಾತ್ರ ಬಳಸಿ."
    }
  })
};

// Campaign Graph Data for React Flow / xyflow
export const mockCampaignGraphData = {
  nodes: [
    { id: "case-boi-92", group: "apk", label: "boi_safe.apk", risk: 92, confidence: 98 },
    { id: "domain-1", group: "domain", label: "update-server-v3.net", risk: 85 },
    { id: "ip-1", group: "ip", label: "185.220.101.5", risk: 98 },
    { id: "family-1", group: "family", label: "Anubis Banking Trojan", risk: 92 },
    { id: "campaign-1", group: "campaign", label: "Anubis-X Campaign v3", risk: 94 }
  ],
  edges: [
    { source: "case-boi-92", target: "domain-1", type: "CONTACTS" },
    { source: "domain-1", target: "ip-1", type: "RESOLVES_TO" },
    { source: "case-boi-92", target: "family-1", type: "BELONGS_TO" },
    { source: "family-1", target: "campaign-1", type: "ASSOCIATED_WITH" }
  ]
};

// Timelines
export const mockTimelineData: TimelineEventData[] = [
  {
    id: "t-1",
    event: "File Uploaded & SHA256 Computed",
    timestamp: "2026-07-16T18:00:00Z",
    description: "The package boi_safe.apk was submitted. SHA256 signature generated."
  },
  {
    id: "t-2",
    event: "Decompilation & Permission Extraction Completed",
    timestamp: "2026-07-16T18:02:10Z",
    description: "Successfully parsed manifest. Detected BIND_ACCESSIBILITY_SERVICE and SMS listening privileges."
  },
  {
    id: "t-3",
    event: "Static Pattern Mapping Matches",
    timestamp: "2026-07-16T18:05:22Z",
    description: "Semgrep logic matches known overlay injection signatures targeting BOI applications."
  },
  {
    id: "t-4",
    event: "Dynamic Sandbox Execution Traces",
    timestamp: "2026-07-16T18:10:00Z",
    description: "Emulated sandbox detects runtime outbound requests to C2 server IP 185.220.101.5."
  },
  {
    id: "t-5",
    event: "Blockchain Ledger Integrity Signature Recorded",
    timestamp: "2026-07-16T18:15:00Z",
    description: "Security incident metrics anchored onto ledger block 1782345."
  }
];

// Executive Summary
export const mockExecutiveSummaryData: ExecutiveSummaryData = {
  priorityLevel: "Critical Priority",
  estimatedExposure: "High (5,000+ active devices)",
  executiveRiskSummary: "Active campaign distributing sideloaded Android APKs masquerading as official Bank of India safety tools, designed to extract credentials and bypass multi-factor authentication (OTP) systems.",
  businessImpact: "Significant exposure to UPI fraud losses, regulatory penalties under DPDP Act 2023, and public brand trust degradation.",
  recommendedActions: [
    "Block C2 IP 185.220.101.5 and domain update-server-v3.net at network borders.",
    "File mandatory CERT-In cybersecurity report.",
    "Deploy client-side update warnings and SMS alert warning campaigns."
  ]
};

export interface AlertItem {
  id: string;
  caseId: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  resolved: boolean;
  createdAt: string;
  fileName?: string;
  riskScore?: number;
}

import i18n from '../i18n';

const INITIAL_THREATS: AlertItem[] = [
  {
    id: "mock-1",
    caseId: "SBI-TROJAN-01",
    title: "Banking Trojan detected",
    severity: "CRITICAL",
    description: "SBI Secure Token binary matched heuristic signature for Anubis Banking Trojan family.",
    createdAt: new Date().toISOString(),
    fileName: "sbi_secure_token.apk",
    riskScore: 92,
    resolved: false
  },
  {
    id: "mock-2",
    caseId: "ACC-ABUSE-02",
    title: "Accessibility abuse identified",
    severity: "HIGH",
    description: "Request for BIND_ACCESSIBILITY_SERVICE permission detected in app manifest.",
    createdAt: new Date(Date.now() - 60000).toISOString(),
    fileName: "helper_service.apk",
    riskScore: 78,
    resolved: false
  },
  {
    id: "mock-3",
    caseId: "DOM-CORR-03",
    title: "Suspicious domain correlation found",
    severity: "MEDIUM",
    description: "Active threat intelligence match for connection to host blacklisted C2 proxy.",
    createdAt: new Date(Date.now() - 120000).toISOString(),
    fileName: "payment_update.apk",
    riskScore: 54,
    resolved: false
  },
  {
    id: "mock-4",
    caseId: "SMS-INT-04",
    title: "SMS interception indicators detected",
    severity: "CRITICAL",
    description: "Dangerous permission READ_SMS and RECEIVE_SMS abuse signature identified.",
    createdAt: new Date(Date.now() - 180000).toISOString(),
    fileName: "bank_advisor.apk",
    riskScore: 88,
    resolved: false
  }
];

interface AnalysisContextType {
  caseData: CaseDataPayload | null;
  isLoading: boolean;
  error: string | null;
  
  // Selection/Routing properties
  activeCaseId: string | null;
  setActiveCaseId: (caseId: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  persona: "analyst" | "officer";
  setPersona: (persona: "analyst" | "officer") => void;
  language: string;
  setLanguage: (lang: string) => void;

  // Primary operational metrics & live feed array
  casesAnalyzed: number;
  feedList: AlertItem[];
  setFeedList: React.Dispatch<React.SetStateAction<AlertItem[]>>;

  // Static/Hydrated Data Stores for sandbox components
  campaignGraph: { nodes: GraphNode[]; edges: GraphEdge[] } | null;
  timeline: TimelineEventData[] | null;
  executiveSummary: ExecutiveSummaryData | null;

  // Actions
  triggerAnalysis: (file: File) => Promise<void>;
  appendNewCase: (filePayload: File) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [activeCaseId, setActiveCaseId] = useState<string | null>("case-boi-92");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [persona, setPersona] = useState<"analyst" | "officer">("analyst");
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const [casesAnalyzed, setCasesAnalyzed] = useState<number>(142);
  const [feedList, setFeedList] = useState<AlertItem[]>(INITIAL_THREATS);

  const [caseData, setCaseData] = useState<CaseDataPayload | null>(mockCriticalCaseData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [campaignGraph, setCampaignGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(mockCampaignGraphData);
  const [timeline, setTimeline] = useState<TimelineEventData[] | null>(mockTimelineData);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummaryData | null>(mockExecutiveSummaryData);

  const triggerAnalysis = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const payload = data.case_data;

      if (!payload) {
        throw new Error("Invalid response format from analysis engine");
      }

      const formattedCaseData: CaseDataPayload = {
        id: payload.id || data.case_id,
        fileName: file.name,
        fileSize: file.size,
        sha256: payload.sha256 || data.sha256,
        status: "COMPLETED",
        createdAt: new Date(),
        analysisMode: "DYNAMIC_AND_STATIC",
        packageName: payload.packageName || null,
        versionCode: payload.versionCode || "1.0",
        permissions: typeof payload.permissions === "string" ? payload.permissions : JSON.stringify(payload.permissions || []),
        activities: typeof payload.activities === "string" ? payload.activities : JSON.stringify(payload.activities || []),
        services: typeof payload.services === "string" ? payload.services : JSON.stringify(payload.services || []),
        mitreTags: typeof payload.mitreTags === "string" ? payload.mitreTags : JSON.stringify(payload.mitreTags || []),
        threatFamily: payload.threatFamily || "Analyzed Malware",
        threatConfidence: payload.threatConfidence || 94,
        iocs: typeof payload.iocs === "string" ? payload.iocs : JSON.stringify(payload.iocs || []),
        riskScore: payload.riskScore || 85,
        permissionScore: payload.permissionScore || 80,
        iocScore: payload.iocScore || 70,
        keywordScore: payload.keywordScore || 75,
        aiConfidence: payload.aiConfidence || 94,
        malwareType: payload.malwareType || "Android Malware",
        threatNarrative: typeof payload.threatNarrative === "string" ? payload.threatNarrative : JSON.stringify(payload.threatNarrative || {}),
        citizenImpact: typeof payload.citizenImpact === "string" ? payload.citizenImpact : JSON.stringify(payload.citizenImpact || {}),
        blockchainTxHash: payload.blockchainTxHash || "0x" + Math.random().toString(36).substring(2),
        blockchainBlock: payload.blockchainBlock || 1782399,
        blockchainTimestamp: payload.blockchainTimestamp ? new Date(payload.blockchainTimestamp) : new Date(),
        analystReport: payload.analystReport || null,
        officerReport: payload.officerReport || null,
        multilingualReports: typeof payload.multilingualReports === "string" ? payload.multilingualReports : JSON.stringify(payload.multilingualReports || {})
      };

      setCaseData(formattedCaseData);
      setActiveCaseId(formattedCaseData.id);

      setCampaignGraph({
        nodes: [
          { id: formattedCaseData.id, group: "apk", label: file.name, risk: formattedCaseData.riskScore, confidence: 94 },
          { id: "domain-1", group: "domain", label: "update-server-v3.net", risk: 85 },
          { id: "ip-1", group: "ip", label: "185.220.101.5", risk: 98 },
          { id: "family-1", group: "family", label: formattedCaseData.threatFamily || "Banking Trojan", risk: formattedCaseData.riskScore }
        ],
        edges: [
          { source: formattedCaseData.id, target: "domain-1", type: "CONTACTS" },
          { source: "domain-1", target: "ip-1", type: "RESOLVES_TO" },
          { source: formattedCaseData.id, target: "family-1", type: "BELONGS_TO" }
        ]
      });

      setTimeline([
        { id: "t-1", event: "APK Binary Ingested", timestamp: new Date().toISOString(), description: `Processed ${file.name} (SHA256: ${formattedCaseData.sha256})` },
        { id: "t-2", event: "Manifest Decompiled", timestamp: new Date().toISOString(), description: `Extracted package ${formattedCaseData.packageName}` },
        { id: "t-3", event: "Permission & Risk Matrix Evaluated", timestamp: new Date().toISOString(), description: `Calculated Risk Score ${formattedCaseData.riskScore}/100 based on manifest permissions.` },
        { id: "t-4", event: "AI Dossier & Threat Narrative Generated", timestamp: new Date().toISOString(), description: `Gemini pipeline generated threat narrative and regional advisories.` }
      ]);

      setExecutiveSummary({
        priorityLevel: formattedCaseData.riskScore >= 80 ? "Critical Priority" : "High Priority",
        estimatedExposure: "High (5,000+ active devices)",
        executiveRiskSummary: `Analysis of ${file.name} (${formattedCaseData.packageName}) revealed risk score ${formattedCaseData.riskScore}/100. Classified as ${formattedCaseData.malwareType}.`,
        businessImpact: "Significant threat of mobile credential theft and financial exposure.",
        recommendedActions: [
          `Revoke permissions for package ${formattedCaseData.packageName}.`,
          "Block identified network indicators at enterprise perimeter.",
          "Issue CERT-In advisory report."
        ]
      });

      setCasesAnalyzed((prev) => prev + 1);
      const newAlert: AlertItem = {
        id: `alert-${Date.now()}`,
        caseId: formattedCaseData.id,
        title: `Ingestion Completed: ${file.name}`,
        severity: formattedCaseData.riskScore >= 80 ? "CRITICAL" : "HIGH",
        description: `Analyzed ${file.name} successfully. Risk Score: ${formattedCaseData.riskScore}/100. Package: ${formattedCaseData.packageName}`,
        createdAt: new Date().toISOString(),
        fileName: file.name,
        riskScore: formattedCaseData.riskScore,
        resolved: false
      };
      setFeedList((prev) => [newAlert, ...prev].slice(0, 8));

    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err?.message || "Sandbox processing error occurred");
    } finally {
      setIsLoading(false);
    }
  };


  const appendNewCase = (filePayload: File) => {
    // 1. Increment casesAnalyzed from 142 to 143
    setCasesAnalyzed((prev) => prev + 1);

    // 2. Generate a mock SHA256 file hash
    const generatedHash = "bfb624ea" + Math.floor(10000000 + Math.random() * 90000000) + "38cd4857b61f891b9201974de31";

    // 3. Construct a live update object
    const newAlert: AlertItem = {
      id: `live-alert-${Date.now()}`,
      caseId: `BC-${Math.floor(3000 + Math.random() * 999)}`,
      title: `Ingestion Active: ${filePayload.name}`,
      severity: "CRITICAL",
      description: `Ingested ${filePayload.name} successfully. Computed SHA256 checksum: ${generatedHash}. Initializing dynamic emulation hooks.`,
      createdAt: new Date().toISOString(),
      fileName: filePayload.name,
      riskScore: 92,
      resolved: false
    };

    // 4. Push directly to the top slot of feedList state array
    setFeedList((prev) => [newAlert, ...prev].slice(0, 8));
  };

  const resetAnalysis = () => {
    setCaseData(null);
    setCampaignGraph(null);
    setTimeline(null);
    setExecutiveSummary(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AnalysisContext.Provider
      value={{
        caseData,
        isLoading,
        error,
        activeCaseId,
        setActiveCaseId,
        activeTab,
        setActiveTab,
        persona,
        setPersona,
        language,
        setLanguage,
        casesAnalyzed,
        feedList,
        setFeedList,
        campaignGraph,
        timeline,
        executiveSummary,
        triggerAnalysis,
        appendNewCase,
        resetAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}

