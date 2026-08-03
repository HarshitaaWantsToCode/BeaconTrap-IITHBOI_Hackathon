import React, { useState } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Lock, 
  Share2, 
  Users, 
  FileCode2, 
  ArrowRight, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Terminal, 
  Globe,
  Radio,
  FileText,
  ShieldAlert,
  Play
} from "lucide-react";
import { CursorHaloGlow } from "./CursorHaloGlow";
import { useTranslation } from "react-i18next";

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onUploadApk: () => void;
  onSelectSampleApk?: (apkName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onUploadApk,
  onSelectSampleApk
}) => {
  const { t } = useTranslation();
  const [selectedDemoApk, setSelectedDemoApk] = useState<string>("01_Official_BOI_Mobile.apk");

  // Sample data specs for the interactive playground on landing page
  const demoApkData: Record<string, {
    name: string;
    pkg: string;
    risk: number;
    malwareType: string;
    permissions: string[];
    summary: string;
    status: "CLEAN" | "SUSPICIOUS" | "CRITICAL";
  }> = {
    "01_Official_BOI_Mobile.apk": {
      name: "01_Official_BOI_Mobile.apk",
      pkg: "com.bankofindia.mobile.official",
      risk: 18,
      malwareType: "Clean Mobile Application",
      permissions: ["android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE", "android.permission.VIBRATE"],
      summary: "Verified Bank of India application. Clean heuristic score with standard mobile banking permissions.",
      status: "CLEAN"
    },
    "04_Game_Mod_Booster.apk": {
      name: "04_Game_Mod_Booster.apk",
      pkg: "com.speed.gamebooster.mod",
      risk: 48,
      malwareType: "Potentially Unwanted Program (PUA) / Adware",
      permissions: ["android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE", "android.permission.WAKE_LOCK", "android.permission.RECEIVE_BOOT_COMPLETED"],
      summary: "Adware and performance mod requesting persistent background wake locks and boot receivers.",
      status: "SUSPICIOUS"
    },
    "08_Anubis_Overlay_Trojan.apk": {
      name: "08_Anubis_Overlay_Trojan.apk",
      pkg: "com.sbi.secure.token.anubis",
      risk: 88,
      malwareType: "Banking Trojan / Overlay Hijacker",
      permissions: ["android.permission.INTERNET", "android.permission.READ_SMS", "android.permission.RECEIVE_SMS", "android.permission.BIND_ACCESSIBILITY_SERVICE", "android.permission.SYSTEM_ALERT_WINDOW"],
      summary: "Anubis variant requesting accessibility abuse and SMS interception to steal OTP tokens.",
      status: "CRITICAL"
    },
    "10_SpyNote_RAT_Injector.apk": {
      name: "10_SpyNote_RAT_Injector.apk",
      pkg: "com.spynote.rat.remote.access",
      risk: 98,
      malwareType: "Remote Access Trojan (RAT)",
      permissions: ["android.permission.INTERNET", "android.permission.READ_SMS", "android.permission.RECEIVE_SMS", "android.permission.BIND_ACCESSIBILITY_SERVICE", "android.permission.RECORD_AUDIO", "android.permission.CAMERA", "android.permission.ACCESS_FINE_LOCATION"],
      summary: "Full Remote Access Trojan with keylogger, audio recording, camera hijacking, and SMS exfiltration.",
      status: "CRITICAL"
    }
  };

  const activeDemo = demoApkData[selectedDemoApk] || demoApkData["01_Official_BOI_Mobile.apk"];

  return (
    <div className="relative min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-300 font-sans transition-colors duration-300">
      {/* Interactive Cursor Halo Glow Backdrop */}
      <CursorHaloGlow />

      {/* Decorative Grid & Vignette Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-lime-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-300">
              IITH BOI Cyber Security Hackathon 2026 // Production Release v3.8.26
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-mono tracking-tight text-text-primary max-w-5xl mx-auto leading-tight">
            BEACONTRAP <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Autonomous AI & Blockchain
            </span> <br />
            Mobile Malware Intelligence
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-[var(--text-secondary)] font-sans leading-relaxed">
            Next-generation automated static & dynamic Android APK decompilation, real-time Gemini AI threat dossier generation, multilingual voice narration, and Ethereum smart contract evidence anchoring.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-xl font-mono text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              Launch SOC Command Center
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onUploadApk}
              className="px-8 py-4 rounded-xl font-mono text-sm font-bold bg-card border border-card-border hover:border-cyan-500/50 text-[var(--text-primary)] hover:bg-card-bg-secondary transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <FileCode2 className="w-5 h-5 text-cyan-400" />
              Upload APK for Analysis
            </button>
          </div>

          {/* Real-time Telemetry Metrics Pill */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono text-xs">
            <div className="p-4 rounded-xl bg-card border border-card-border backdrop-blur-md flex flex-col items-center">
              <span className="text-text-muted uppercase text-[10px] tracking-wider mb-1">Threat Database</span>
              <span className="text-xl font-black text-cyan-400">12,408 Signatures</span>
            </div>
            <div className="p-4 rounded-xl bg-card border border-card-border backdrop-blur-md flex flex-col items-center">
              <span className="text-text-muted uppercase text-[10px] tracking-wider mb-1">MITRE ATT&CK</span>
              <span className="text-xl font-black text-emerald-400">100% Coverage</span>
            </div>
            <div className="p-4 rounded-xl bg-card border border-card-border backdrop-blur-md flex flex-col items-center">
              <span className="text-text-muted uppercase text-[10px] tracking-wider mb-1">Evidence Ledger</span>
              <span className="text-xl font-black text-indigo-400">Ethereum Anchored</span>
            </div>
            <div className="p-4 rounded-xl bg-card border border-card-border backdrop-blur-md flex flex-col items-center">
              <span className="text-text-muted uppercase text-[10px] tracking-wider mb-1">Multilingual Voice</span>
              <span className="text-xl font-black text-rose-400">5 Languages</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Telemetry Playground Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative border border-card-border bg-card/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-card-border pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
                <Terminal className="w-4 h-4" /> Live Interactive Threat Matrix Sandbox
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">
                Instant Telemetry Preview
              </h2>
              <p className="text-sm text-[var(--text-secondary)] font-sans mt-1">
                Select a sample APK to inspect how BeaconTrap extracts permissions, calculates threat scores, and generates AI dossiers in real time.
              </p>
            </div>

            {/* Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(demoApkData).map((apkKey) => (
                <button
                  key={apkKey}
                  onClick={() => setSelectedDemoApk(apkKey)}
                  className={`px-3 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                    selectedDemoApk === apkKey
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "bg-card-bg-secondary text-text-muted border border-card-border hover:border-cyan-500/40"
                  }`}
                >
                  {apkKey.split('_')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Preview Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
            {/* Left: Score Card */}
            <div className="p-6 rounded-xl border border-card-border bg-card-bg-secondary flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">Threat Index Score</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeDemo.status === "CLEAN" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                  activeDemo.status === "SUSPICIOUS" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                  "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                }`}>
                  {activeDemo.status}
                </span>
              </div>

              <div className="text-center py-4">
                <span className={`text-6xl font-black font-mono ${
                  activeDemo.risk < 35 ? "text-emerald-400" :
                  activeDemo.risk < 70 ? "text-amber-400" : "text-rose-500"
                }`}>
                  {activeDemo.risk}
                </span>
                <span className="text-sm font-bold text-text-muted"> / 100</span>
                <p className="text-xs text-text-secondary font-sans mt-2 font-semibold">
                  {activeDemo.malwareType}
                </p>
              </div>

              <button
                onClick={() => {
                  if (onSelectSampleApk) onSelectSampleApk(activeDemo.name);
                  onLaunchDashboard();
                }}
                className="w-full py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all font-bold uppercase text-[11px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Analyze Deep Technical Lab
              </button>
            </div>

            {/* Middle & Right: Telemetry & Permissions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl border border-card-border bg-card-bg-secondary space-y-2">
                <div className="flex justify-between items-center text-text-muted text-[10px] uppercase">
                  <span>Target Package</span>
                  <span>Extracted Binary Attributes</span>
                </div>
                <div className="text-sm font-bold text-cyan-300 font-mono break-all">
                  {activeDemo.pkg}
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed pt-1">
                  {activeDemo.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-card-border bg-card-bg-secondary space-y-2">
                <span className="text-[10px] text-text-muted uppercase tracking-widest block">
                  Extracted Android Manifest Permissions ({activeDemo.permissions.length})
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeDemo.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-[10px] font-mono border ${
                        perm.includes("ACCESSIBILITY") || perm.includes("SMS") || perm.includes("ALERT")
                          ? "bg-rose-500/10 text-rose-300 border-rose-500/30 font-bold"
                          : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                      }`}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
            Comprehensive Cyber Defense Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)]">
            Core Threat Intelligence Engine Features
          </h2>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-sans">
            Engineered specifically for the Indian banking ecosystem and law enforcement agencies to counter mobile Trojans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group relative border border-card-border hover:border-cyan-500/50 bg-card rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-2">
              Static & Dynamic Decompilation
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Automated binary XML manifest parsing, DEX string extraction, obfuscation index calculation, and malicious package detection without needing emulation overhead.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative border border-card-border hover:border-cyan-500/50 bg-card rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-2">
              Multilingual AI Copilot & Voice Narrator
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Powered by Google Gemini models with native 5-language voice narration (English, Hindi, Telugu, Kannada, Tamil) for instant executive briefings and field advisories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative border border-card-border hover:border-cyan-500/50 bg-card rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-2">
              Ethereum Smart Contract Evidence Ledger
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Immutable SHA-256 evidence anchoring on Ethereum blockchain smart contracts (`EvidenceAnchor.sol`), ensuring cryptographic chain of custody for legal prosecution.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group relative border border-card-border hover:border-cyan-500/50 bg-card rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-2">
              Graph DNA Malware Network Topology
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Interactive force-directed graph mapping relationships between malware hashes, command-and-control IP addresses, malicious domains, and Trojan family clusters.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group relative border border-card-border hover:border-cyan-500/50 bg-card rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-2">
              Role-Tailored Intelligence Views
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Dedicated operational dashboards designed specifically for Security Analysts (technical forensics), Bank Executive Officers (GRC compliance), and Citizen Impact alerts.
            </p>
          </div>

          {/* Card 6 */}
          <div className="group relative border border-card-border hover:border-cyan-500/50 bg-card rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-2">
              Automated MITRE ATT&CK Mapping
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Instant alignment with MITRE Mobile framework techniques (T1400 Accessibility Abuse, T1417 Input Interception, T1624 Overlay Injection, T1475 Malicious APK Delivery).
            </p>
          </div>

        </div>
      </section>

      {/* Architecture Breakdown Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-card-border">
        <div className="text-center space-y-3 mb-12">
          <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
            End-to-End Execution Flow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)]">
            Intelligence Ingestion Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
          
          <div className="p-5 rounded-xl bg-card border border-card-border flex flex-col items-center text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">1</div>
            <span className="font-bold text-text-primary uppercase text-[11px]">APK Ingestion</span>
            <span className="text-[10px] text-text-muted font-sans">Multi-part client drag & drop upload with client SHA-256 calculation.</span>
          </div>

          <div className="p-5 rounded-xl bg-card border border-card-border flex flex-col items-center text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">2</div>
            <span className="font-bold text-text-primary uppercase text-[11px]">Static Parser</span>
            <span className="text-[10px] text-text-muted font-sans">Extract permissions, activities, receivers, and DEX strings via zip engine.</span>
          </div>

          <div className="p-5 rounded-xl bg-card border border-card-border flex flex-col items-center text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">3</div>
            <span className="font-bold text-text-primary uppercase text-[11px]">Heuristic Rules</span>
            <span className="text-[10px] text-text-muted font-sans">Calculate risk score, malware family, and IOC severity ratings.</span>
          </div>

          <div className="p-5 rounded-xl bg-card border border-card-border flex flex-col items-center text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">4</div>
            <span className="font-bold text-text-primary uppercase text-[11px]">AI Copilot Dossier</span>
            <span className="text-[10px] text-text-muted font-sans">Gemini LLM synthesizes multilingual reports and TTS audio scripts.</span>
          </div>

          <div className="p-5 rounded-xl bg-card border border-card-border flex flex-col items-center text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">5</div>
            <span className="font-bold text-text-primary uppercase text-[11px]">Blockchain Ledger</span>
            <span className="text-[10px] text-text-muted font-sans">Anchor forensic digest hash into Ethereum smart contract block.</span>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border bg-card/60 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div>
              <span className="font-bold text-text-primary uppercase text-sm block">BeaconTrap Cyber Intel</span>
              <span className="text-text-muted text-[10px]">Built for IITH & Bank of India Cyber Security Hackathon 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all font-bold cursor-pointer uppercase text-[11px]"
            >
              Open Dashboard
            </button>
            <button
              onClick={onUploadApk}
              className="px-4 py-2 rounded-lg bg-card-bg-secondary hover:bg-card border border-card-border text-[var(--text-primary)] transition-all font-bold cursor-pointer uppercase text-[11px]"
            >
              Upload APK
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
