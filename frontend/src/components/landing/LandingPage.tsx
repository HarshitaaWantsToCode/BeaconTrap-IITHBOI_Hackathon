import React, { useState } from "react";
import { 
  Shield, 
  Cpu, 
  Lock, 
  Share2, 
  FileCode2, 
  ArrowRight, 
  Activity, 
  Terminal, 
  Play,
  CheckCircle2,
  Sliders,
  XCircle,
  ExternalLink,
  Star,
  Layers,
  ChevronRight,
  Database,
  Search,
  Radio,
  FileCheck,
  Zap,
  Globe,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onUploadApk: () => void;
  onSelectSampleApk?: (apkName: string) => void;
  onNavigateToView?: (view: "LANDING" | "DASHBOARD" | "UPLOAD" | "ANALYSIS_LAB" | "DEMO_WALKTHROUGH") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onUploadApk,
  onSelectSampleApk,
  onNavigateToView
}) => {
  const { t } = useTranslation();
  const [selectedDemoApk, setSelectedDemoApk] = useState<string>("08_Anubis_Overlay_Trojan.apk");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenSandbox = (apkName?: string) => {
    const targetApk = apkName || selectedDemoApk;
    if (onSelectSampleApk) {
      onSelectSampleApk(targetApk);
    } else if (onNavigateToView) {
      onNavigateToView("ANALYSIS_LAB");
    } else {
      onLaunchDashboard();
    }
  };

  // Security controls toggle state
  const [controls, setControls] = useState<Record<string, boolean>>({
    "realtime_telemetry": true,
    "blockchain_anchor": true,
    "otp_interception_shield": true,
    "sms_exfiltration_guard": true,
    "accessibility_abuse_block": true,
    "dynamic_sandbox_emulation": false
  });

  const toggleControl = (key: string) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
      malwareType: "Potentially Unwanted Application (PUA)",
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

  const activeDemo = demoApkData[selectedDemoApk] || demoApkData["08_Anubis_Overlay_Trojan.apk"];

  return (
    <div className="min-h-screen bg-[#f6f2ff] text-[#1e1540] font-sans antialiased relative selection:bg-[#6c4fc4]/20 selection:text-[#6c4fc4]">
      {/* Background radial gradient blooms fixed */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#6c4fc4]/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full bg-[#3aab8a]/15 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* 1. Thin Dark Government / Official Strip Bar */}
        <div className="bg-[#1e1540] text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 font-medium">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
              <span className="flex items-center gap-1 text-[#9b7fda] font-bold tracking-wider">
                🇮🇳 Government of India Initiative
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">Ministry of Finance</span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="hover:text-white transition-colors cursor-pointer">RBI Cyber Guidelines</span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="hover:text-white transition-colors cursor-pointer">CERT-In Compliance Framework</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#6c4fc4]/40 text-[#9b7fda] border border-[#6c4fc4]/50 font-mono font-semibold">
                RBI REG: IND-LEAP-205_BOI
              </span>
            </div>
          </div>
        </div>

        {/* 2. Sticky Glassmorphic Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-white/40 shadow-[0_4px_25px_rgba(30,21,64,0.06)] px-4 sm:px-8 transition-all">
          <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1e1540] to-[#6c4fc4] flex items-center justify-center text-white shadow-md shadow-[#6c4fc4]/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-black tracking-tight text-[#1e1540]">
                  Beacon<span className="text-[#6c4fc4]">Trap</span>
                </span>
                <span className="block text-[10px] font-bold text-[#7a6ea8] tracking-widest uppercase">
                  Forensic Console
                </span>
              </div>
            </div>

            {/* Center Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#1e1540]/80">
              <a href="#overview" className="hover:text-[#6c4fc4] transition-colors">Overview</a>
              <a href="#capabilities" className="hover:text-[#6c4fc4] transition-colors">Capabilities</a>
              <a href="#how-it-works" className="hover:text-[#6c4fc4] transition-colors">Workflow</a>
              <button
                onClick={() => handleOpenSandbox()}
                className="hover:text-[#6c4fc4] transition-colors font-bold cursor-pointer bg-transparent border-0 p-0 text-sm text-[#1e1540]/80"
              >
                Sandbox
              </button>
              <a href="#controls" className="hover:text-[#6c4fc4] transition-colors">Security Controls</a>
              <a href="#testimonials" className="hover:text-[#6c4fc4] transition-colors">Case Studies</a>
            </nav>

            {/* Right Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1e1540] hover:text-[#6c4fc4] bg-white/60 hover:bg-white border border-purple-100 transition-all shadow-sm cursor-pointer"
              >
                Verification Ledger
              </button>
              <button
                onClick={onLaunchDashboard}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] hover:from-[#5b3eb3] hover:to-[#8a6ec9] transition-all shadow-md shadow-[#6c4fc4]/25 hover:shadow-lg hover:shadow-[#6c4fc4]/35 hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
              >
                <span>Launch SOC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#1e1540] hover:bg-purple-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 px-2 border-t border-purple-100 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-xl space-y-3 font-semibold text-sm">
              <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg hover:bg-purple-50">Overview</a>
              <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg hover:bg-purple-50">Capabilities</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg hover:bg-purple-50">Workflow</a>
              <button
                onClick={() => { handleOpenSandbox(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-1.5 rounded-lg hover:bg-purple-50 font-semibold"
              >
                Sandbox
              </button>
              <a href="#controls" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 rounded-lg hover:bg-purple-50">Security Controls</a>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => { setIsModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-[#1e1540] bg-purple-50 border border-purple-100"
                >
                  Verification Ledger
                </button>
                <button
                  onClick={() => { onLaunchDashboard(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda]"
                >
                  Launch SOC Command Center
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-8 space-y-20 py-8 sm:py-12">
          {/* 3. Hero Section (Navy-to-Purple Gradient Box with Radial Glow & Overlapping Card) */}
          <section id="overview" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e1540] via-[#2a1e5c] to-[#6c4fc4] text-white p-6 sm:p-12 lg:p-14 shadow-2xl border border-white/10">
            {/* Radial glow overlays inside Hero */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#9b7fda]/20 blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3aab8a]/20 blur-[90px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/40 flex items-center gap-1.5 shadow-sm">
                    <span>🏅</span> RBI Regulated Heuristics
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#3aab8a]/20 text-[#3aab8a] border border-[#3aab8a]/40 flex items-center gap-1.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5" /> 10-Second Disbursal / Analysis
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/20 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> CERT-In Aligned
                  </span>
                </div>

                {/* Big Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  India&apos;s Most Trusted Forensic <span className="text-[#9b7fda] drop-shadow-sm">Platform</span>
                </h1>

                {/* Subtext */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                  Decompiles Android APKs, calculates banking trojan risk indices, extracts IOC signatures, and anchors immutable chain-of-custody evidence onto smart contracts.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={onLaunchDashboard}
                    className="px-7 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-[#9b7fda] to-[#6c4fc4] hover:from-[#8a6ec9] hover:to-[#5b3eb3] text-white transition-all shadow-xl shadow-[#6c4fc4]/40 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>SOC Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onUploadApk}
                    className="px-7 py-3.5 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <FileCode2 className="w-4 h-4 text-[#9b7fda]" />
                    <span>Upload Target APK</span>
                  </button>
                </div>

                {/* Trust Indicators with Glowing Dots */}
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3aab8a] shadow-[0_0_8px_#3aab8a]" />
                    ISO 27001 Certified Heuristics
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3aab8a] shadow-[0_0_8px_#3aab8a]" />
                    PCI DSS Compliant
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3aab8a] shadow-[0_0_8px_#3aab8a]" />
                    256-bit Evidence Hashing
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3aab8a] shadow-[0_0_8px_#3aab8a]" />
                    CERT-In Empanelled
                  </span>
                </div>
              </div>

              {/* Right Column: Floating Glassmorphic Calculator / Live Sandbox Summary Widget */}
              <div className="lg:col-span-5 relative">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 text-[#1e1540] shadow-2xl shadow-[#1e1540]/30 border border-white/80 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧮</span>
                      <div>
                        <h3 className="font-extrabold text-base text-[#1e1540]">Live Risk Calculator</h3>
                        <p className="text-[11px] text-[#7a6ea8] font-medium">Instant estimate — no malware execution required</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#6c4fc4]">
                      Active Heuristics
                    </span>
                  </div>

                  {/* Sample selection pill tabs */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#7a6ea8]">
                      Selected Binary Sample
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.keys(demoApkData).map((key) => (
                        <button
                          key={key}
                          onClick={() => setSelectedDemoApk(key)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold text-left truncate transition-all cursor-pointer ${
                            selectedDemoApk === key
                              ? "bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] text-white shadow-md shadow-[#6c4fc4]/30"
                              : "bg-purple-50/60 hover:bg-purple-100/60 text-[#1e1540] border border-purple-100"
                          }`}
                        >
                          {key.split('_')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Threat Score Slider Preview */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#7a6ea8]">Threat Risk Index</span>
                      <span className={`text-sm font-black ${
                        activeDemo.risk >= 80 ? "text-rose-600" : activeDemo.risk >= 40 ? "text-[#d97706]" : "text-[#3aab8a]"
                      }`}>
                        {activeDemo.risk}/100 ({activeDemo.status})
                      </span>
                    </div>
                    <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeDemo.risk >= 80 ? "bg-gradient-to-r from-[#d97706] to-rose-600" :
                          activeDemo.risk >= 40 ? "bg-[#d97706]" : "bg-[#3aab8a]"
                        }`}
                        style={{ width: `${activeDemo.risk}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#1e1540] text-white text-center">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[#9b7fda] font-bold">Permissions</div>
                      <div className="text-lg font-black mt-0.5">{activeDemo.permissions.length}</div>
                    </div>
                    <div className="border-x border-white/10">
                      <div className="text-[9px] uppercase tracking-wider text-[#9b7fda] font-bold">YARA Rules</div>
                      <div className="text-lg font-black mt-0.5">12,408</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[#9b7fda] font-bold">Confidence</div>
                      <div className="text-lg font-black mt-0.5">94%</div>
                    </div>
                  </div>

                  {/* Action Button inside widget */}
                  <button
                    onClick={() => {
                      if (onSelectSampleApk) onSelectSampleApk(activeDemo.name);
                      onLaunchDashboard();
                    }}
                    className="w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] hover:from-[#5b3eb3] hover:to-[#8a6ec9] transition-all shadow-md shadow-[#6c4fc4]/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Run Deep Forensics Sandbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Stats Bar (Translucent Frosted Strip) */}
          <section className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1e1540]/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-purple-100">
              <div className="space-y-1 pt-2 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-[#1e1540] tracking-tight">12,408+</div>
                <div className="text-xs font-bold text-[#7a6ea8] uppercase tracking-wider">YARA Signatures Active</div>
              </div>
              <div className="space-y-1 pt-2 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-[#3aab8a] tracking-tight">100%</div>
                <div className="text-xs font-bold text-[#7a6ea8] uppercase tracking-wider">MITRE ATT&CK Matrix Coverage</div>
              </div>
              <div className="space-y-1 pt-2 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-[#6c4fc4] tracking-tight">Ethereum</div>
                <div className="text-xs font-bold text-[#7a6ea8] uppercase tracking-wider">Smart Contract Chain of Custody</div>
              </div>
              <div className="space-y-1 pt-2 md:pt-0">
                <div className="text-3xl sm:text-4xl font-black text-[#d97706] tracking-tight">11 Dialects</div>
                <div className="text-xs font-bold text-[#7a6ea8] uppercase tracking-wider">Regional Advisory Translation</div>
              </div>
            </div>
          </section>

          {/* 5. Card Grid Section (Capabilities & Features with Hover Lift + Top Border Reveal) */}
          <section id="capabilities" className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-100 text-[#6c4fc4]">
                Enterprise SOC Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1e1540] tracking-tight">
                High-Trust Defense & Forensic Intel
              </h2>
              <p className="text-sm text-[#7a6ea8]">
                End-to-end telemetry and malware attribution built for national cybersecurity standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white/80 hover:border-transparent transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-[#1e1540]/5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6c4fc4] flex items-center justify-center font-bold text-xl shadow-sm">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#9b7fda] uppercase tracking-wider">Static & Dynamic</span>
                    <h3 className="text-xl font-extrabold text-[#1e1540]">Deep APK Decompilation</h3>
                  </div>
                  <p className="text-sm text-[#7a6ea8] leading-relaxed">
                    Automated binary manifest disassembly, DEX string decoding, obfuscation heuristics, and dangerous permission flag checks.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-[#6c4fc4]">DEX Strings</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-[#6c4fc4]">Manifest Heuristics</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-[#6c4fc4]">Overlay Protection</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white/80 hover:border-transparent transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-[#1e1540]/5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3aab8a] to-[#6c4fc4] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#3aab8a] flex items-center justify-center font-bold text-xl shadow-sm">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#3aab8a] uppercase tracking-wider">Smart Contract</span>
                    <h3 className="text-xl font-extrabold text-[#1e1540]">Ethereum Evidence Ledger</h3>
                  </div>
                  <p className="text-sm text-[#7a6ea8] leading-relaxed">
                    Cryptographic SHA-256 evidence hashing anchored onto Ethereum Sepolia via smart contracts, guaranteeing courtroom admissibility.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-[#3aab8a]">ERC-Chain Audit</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-[#3aab8a]">Tamper Proof</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-[#3aab8a]">Etherscan Verified</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white/80 hover:border-transparent transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-[#1e1540]/5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d97706] to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#d97706] flex items-center justify-center font-bold text-xl shadow-sm">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#d97706] uppercase tracking-wider">Interactive Graphs</span>
                    <h3 className="text-xl font-extrabold text-[#1e1540]">Campaign DNA & C2 Topology</h3>
                  </div>
                  <p className="text-sm text-[#7a6ea8] leading-relaxed">
                    Real-time React Flow visual graph showing relations between APK samples, C2 command servers, exfiltration endpoints, and victim nodes.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-[#d97706]">C2 Infrastructure</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-[#d97706]">Cross-Variant Links</span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-[#d97706]">IOC Correlation</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. "How It Works" 4-Step Row */}
          <section id="how-it-works" className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-100 text-[#6c4fc4]">
                Streamlined Investigation
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1e1540] tracking-tight">
                How BeaconTrap Forensics Works
              </h2>
              <p className="text-sm text-[#7a6ea8]">
                Four operational stages from raw binary upload to court-ready blockchain verified dossier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Target APK Ingestion",
                  desc: "Upload suspicious Android binary for static decompilation and manifest analysis.",
                  icon: FileCode2
                },
                {
                  step: "02",
                  title: "Heuristic Attribution",
                  desc: "Run 12,408+ YARA rules and MITRE ATT&CK matrix mappings to classify trojan families.",
                  icon: Activity
                },
                {
                  step: "03",
                  title: "Smart Ledger Anchor",
                  desc: "Cryptographic SHA-256 evidence certificate minted directly onto Ethereum blockchain.",
                  icon: Lock
                },
                {
                  step: "04",
                  title: "Executive Export",
                  desc: "Generate multi-lingual citizen advisory and formal PDF dossier for law enforcement.",
                  icon: FileCheck
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-lg shadow-[#1e1540]/5 space-y-4 hover:-translate-y-1 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6c4fc4] to-[#9b7fda] text-white flex items-center justify-center font-bold shadow-md shadow-[#6c4fc4]/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-purple-200">
                        {item.step}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-[#1e1540]">{item.title}</h3>
                      <p className="text-xs text-[#7a6ea8] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Forensic Sample Telemetry Sandbox Section */}
          <section id="sandbox" className="space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-100 text-[#6c4fc4]">
                Interactive APK Sandbox
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1e1540] tracking-tight">
                Forensic Sample Telemetry Sandbox
              </h2>
              <p className="text-sm text-[#7a6ea8]">
                Select pre-compiled malware variants or benign banking applications to inspect live decompilation metrics.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#1e1540]/5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                <div className="flex items-center gap-2 text-[#6c4fc4] font-mono text-xs font-bold uppercase">
                  <Terminal className="w-4 h-4" /> Live Binary Telemetry Target
                </div>

                <div className="flex flex-wrap gap-2">
                  {Object.keys(demoApkData).map((apkKey) => (
                    <button
                      key={apkKey}
                      onClick={() => setSelectedDemoApk(apkKey)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedDemoApk === apkKey
                          ? "bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] text-white shadow-md shadow-[#6c4fc4]/30"
                          : "bg-purple-50/70 hover:bg-purple-100 text-[#1e1540] border border-purple-100"
                      }`}
                    >
                      {apkKey.split('_')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sandbox Spec Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Threat Score Card */}
                <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7a6ea8]">Threat Score Index</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      activeDemo.status === "CLEAN" ? "bg-emerald-100 text-[#3aab8a] border border-emerald-200" :
                      activeDemo.status === "SUSPICIOUS" ? "bg-amber-100 text-[#d97706] border border-amber-200" :
                      "bg-rose-100 text-rose-600 border border-rose-200"
                    }`}>
                      {activeDemo.status}
                    </span>
                  </div>

                  <div className="text-center py-3 space-y-2">
                    <div className="text-5xl font-black text-[#6c4fc4]">
                      {activeDemo.risk}<span className="text-base text-[#7a6ea8] font-normal">/100</span>
                    </div>
                    <p className="text-xs font-bold text-[#1e1540]">{activeDemo.malwareType}</p>
                  </div>

                  <button
                    onClick={() => handleOpenSandbox(activeDemo.name)}
                    className="w-full py-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] hover:from-[#5b3eb3] hover:to-[#8a6ec9] transition-all shadow-md shadow-[#6c4fc4]/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Open Live Analysis Lab</span>
                  </button>
                </div>

                {/* Target Metadata & Permissions */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#7a6ea8]">
                      <span>Target Package Identifier</span>
                      <span>FILE: {activeDemo.name}</span>
                    </div>
                    <div className="text-sm font-mono font-bold text-[#6c4fc4] break-all">
                      {activeDemo.pkg}
                    </div>
                    <p className="text-xs text-[#7a6ea8] leading-relaxed pt-1">
                      {activeDemo.summary}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7a6ea8] block">
                      Extracted Manifest Permissions ({activeDemo.permissions.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDemo.permissions.map((perm, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border ${
                            perm.includes("ACCESSIBILITY") || perm.includes("SMS") || perm.includes("ALERT")
                              ? "bg-rose-50 text-rose-600 border-rose-200 font-bold"
                              : "bg-white text-[#7a6ea8] border-purple-100"
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

          {/* 7. Notice / Callout Banner (Soft Amber-Tinted Glass Card) */}
          <section className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-500/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#d97706] flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#1e1540]">
                      National Threat Advisory: Active Anubis & SpyNote Campaign
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d97706]/20 text-[#d97706]">
                      DEFCON-2
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#7a6ea8] leading-relaxed max-w-3xl">
                    High severity overlay trojans targeting Indian banking credentials through SMS interception and Accessibility Service abuse. Recommend immediate sandboxing of any third-party financial APKs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onLaunchDashboard}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black bg-[#d97706] hover:bg-amber-600 text-white transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  View Threat Map
                </button>
              </div>
            </div>
          </section>

          {/* 8. Controls / Settings Panel Section */}
          <section id="controls" className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/80 shadow-2xl shadow-[#1e1540]/5 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-[#6c4fc4] text-xs font-extrabold uppercase tracking-wider">
                  <Sliders className="w-4 h-4" /> Security & Privacy Telemetry Controls
                </div>
                <h2 className="text-2xl font-black text-[#1e1540] tracking-tight mt-1">
                  Active Sandbox Enforcement Protocols
                </h2>
                <p className="text-xs text-[#7a6ea8] mt-0.5">
                  Configure live containment, exfiltration blocking, and smart contract anchoring parameters.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-[#3aab8a] border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#3aab8a] animate-pulse" />
                6 Heuristic Nodes Online
              </span>
            </div>

            {/* Grid of Status Pills (Green "ON" / Red "OFF") */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "realtime_telemetry", label: "Real-time Telemetry Stream", desc: "Broadcast live socket events on permission abuse" },
                { id: "blockchain_anchor", label: "Ethereum Evidence Ledger", desc: "Mint cryptographic SHA-256 hashes into Sepolia" },
                { id: "otp_interception_shield", label: "OTP Interception Shield", desc: "Flag dangerous READ_SMS / RECEIVE_SMS combos" },
                { id: "sms_exfiltration_guard", label: "C2 Exfiltration Blocker", desc: "Block background HTTP posts to rogue IP endpoints" },
                { id: "accessibility_abuse_block", label: "Accessibility Abuse Guard", desc: "Halt overlay injection attempts on banking apps" },
                { id: "dynamic_sandbox_emulation", label: "Dynamic QEMU Emulation", desc: "Simulate live taps in an isolated container" }
              ].map((item) => {
                const isActive = controls[item.id] ?? false;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between gap-3 hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-extrabold text-[#1e1540]">{item.label}</div>
                      <div className="text-[10px] text-[#7a6ea8] leading-tight">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => toggleControl(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer shadow-sm ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
                          : "bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600"
                      }`}
                    >
                      {isActive ? "ON" : "OFF"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Row of 3 Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-purple-100">
              <button
                onClick={onLaunchDashboard}
                className="px-6 py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] hover:from-[#5b3eb3] hover:to-[#8a6ec9] transition-all shadow-md shadow-[#6c4fc4]/25 cursor-pointer"
              >
                Apply Active Security Profiles
              </button>
              <button
                onClick={() => setControls({
                  "realtime_telemetry": false,
                  "blockchain_anchor": false,
                  "otp_interception_shield": false,
                  "sms_exfiltration_guard": false,
                  "accessibility_abuse_block": false,
                  "dynamic_sandbox_emulation": false
                })}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-500 border border-rose-200 transition-all cursor-pointer"
              >
                Emergency Killswitch (Revoke All)
              </button>
              <button
                onClick={() => setControls({
                  "realtime_telemetry": true,
                  "blockchain_anchor": true,
                  "otp_interception_shield": true,
                  "sms_exfiltration_guard": true,
                  "accessibility_abuse_block": true,
                  "dynamic_sandbox_emulation": true
                })}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-[#6c4fc4] hover:text-white bg-purple-50 hover:bg-[#6c4fc4] border border-purple-200 transition-all cursor-pointer"
              >
                Restore GovTech Maximum Shield
              </button>
            </div>
          </section>

          {/* 9. Testimonial 3-Column Grid */}
          <section id="testimonials" className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-100 text-[#6c4fc4]">
                Field Validated
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1e1540] tracking-tight">
                Trusted by Cyber Units & Banking Officers
              </h2>
              <p className="text-sm text-[#7a6ea8]">
                Proven results in detecting rogue overlays and preserving blockchain forensic evidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "BeaconTrap's blockchain evidence anchor provided undisputed proof in our inter-state banking fraud trial. The SHA-256 verification held up flawlessly in court.",
                  author: "Rajesh V. Sharma",
                  role: "Chief Information Security Officer (CISO)",
                  org: "Scheduled Commercial Bank, Mumbai"
                },
                {
                  quote: "The 10-second static decompilation and regional language advisories in Hindi and Kannada allowed our frontline fraud desks to warn 45,000 citizens in minutes.",
                  author: "Dr. Ananya Murthy",
                  role: "Head of Digital Forensics",
                  org: "State Cyber Crime Investigation Cell"
                },
                {
                  quote: "Matching malware APKs directly against the 100% MITRE ATT&CK matrix saved our analysts over 30 hours per trojan campaign investigation.",
                  author: "Siddharth Sen",
                  role: "Senior Malware Research Analyst",
                  org: "Fintech Threat Intel Consortium"
                }
              ].map((test, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white/80 shadow-xl shadow-[#1e1540]/5 space-y-4 hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex gap-1 text-[#d97706]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm italic text-[#1e1540] leading-relaxed">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-purple-100">
                    <div className="font-extrabold text-sm text-[#1e1540]">{test.author}</div>
                    <div className="text-xs text-[#6c4fc4] font-semibold">{test.role}</div>
                    <div className="text-[11px] text-[#7a6ea8]">{test.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 10. Footer (Dark Navy Gradient, 4-Column Grid) */}
        <footer className="bg-gradient-to-b from-[#1e1540] to-[#120d28] text-slate-300 border-t border-white/10 mt-20 pt-16 pb-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* Brand Col */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6c4fc4] to-[#9b7fda] flex items-center justify-center text-white shadow-md shadow-[#6c4fc4]/30">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">
                    Beacon<span className="text-[#9b7fda]">Trap</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                  Operational malware forensics platform engineered for security operations centers, banking compliance departments, and judicial evidentiary reporting.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    ● TELEMETRY OK
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                    NODE: IND-LEAP-205_BOI
                  </span>
                </div>
              </div>

              {/* Links Col 1 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Forensic Modules</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li><a href="#overview" className="hover:text-white transition-colors">Manifest Decompiler</a></li>
                  <li><a href="#capabilities" className="hover:text-white transition-colors">YARA Engine (12.4k)</a></li>
                  <li><a href="#capabilities" className="hover:text-white transition-colors">MITRE ATT&CK Matrix</a></li>
                  <li><a href="#capabilities" className="hover:text-white transition-colors">C2 Graph Explorer</a></li>
                </ul>
              </div>

              {/* Links Col 2 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Compliance & GRC</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li><a href="#controls" className="hover:text-white transition-colors">RBI Master Directions</a></li>
                  <li><a href="#controls" className="hover:text-white transition-colors">CERT-In Directives</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">Chain of Custody</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">Courtroom PDF Export</a></li>
                </ul>
              </div>

              {/* Links Col 3 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">GovTech Consortium</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li><span className="hover:text-white transition-colors cursor-pointer">IITH BOI Hackathon</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">CERT-In Advisories</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">NCIIPC Guidelines</span></li>
                  <li><span className="hover:text-white transition-colors cursor-pointer">Security Whitepaper</span></li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
              <p>© 2026 BeaconTrap Forensics Consortium. Built for Indian Banking Security & Public Trust.</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                  ISO 27001
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                  PCI DSS v4.0
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                  Sepolia ERC-Chain
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* 11. Modal (Centered Glass Card for Blockchain Evidence Ledger) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1540]/60 backdrop-blur-md transition-all">
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full border border-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Dark Gradient Modal Header */}
              <div className="bg-gradient-to-r from-[#1e1540] to-[#6c4fc4] p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm">Blockchain Evidence Ledger</h3>
                    <p className="text-[10px] text-[#9b7fda]">Smart Contract Verification Certificate</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  VERIFIED
                </span>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 text-xs font-sans text-[#1e1540]">
                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-purple-100">
                    <span className="text-[#7a6ea8] font-bold">Target File</span>
                    <span className="font-mono font-bold text-[#1e1540]">{activeDemo.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-purple-100">
                    <span className="text-[#7a6ea8] font-bold">Package Name</span>
                    <span className="font-mono text-[#6c4fc4] font-bold">{activeDemo.pkg}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-purple-100">
                    <span className="text-[#7a6ea8] font-bold">Smart Contract</span>
                    <span className="font-mono text-[10px] text-[#7a6ea8]">0x4b78...399e (Sepolia)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-purple-100">
                    <span className="text-[#7a6ea8] font-bold">Block Confirmation</span>
                    <span className="font-mono font-bold text-[#3aab8a]">Block #19883145</span>
                  </div>
                </div>

                {/* Highlighted Verified / Anchored Callout Box */}
                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#6c4fc4] font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#3aab8a]" />
                    <span>Cryptographic Evidence Hash Anchored</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#7a6ea8] break-all">
                    SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </p>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#7a6ea8] hover:text-[#1e1540] bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onLaunchDashboard();
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6c4fc4] to-[#9b7fda] shadow-md shadow-[#6c4fc4]/20 cursor-pointer"
                  >
                    Open Live Lab
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
