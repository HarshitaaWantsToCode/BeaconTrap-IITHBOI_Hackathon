import React from "react";
import { Globe, CheckCircle2, ShieldX, Smartphone, Eye, MessageSquareCode } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";

export default function CitizenImpactPanel() {
  const { caseData, language, setLanguage } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-[var(--text-muted)]">
        NO CASE DATA LOADED FOR CITIZEN IMPACT PANEL
      </div>
    );
  }

  // Parse JSON safe checks
  const citizenImpact = caseData.citizenImpact ? JSON.parse(caseData.citizenImpact) : {};
  const multilingualReports = caseData.multilingualReports ? JSON.parse(caseData.multilingualReports) : {};

  const isMalicious = caseData.riskScore > 50;

  // Compute dynamic reports if multilingual reports are missing or generic
  const defaultSummary = isMalicious
    ? `Critical security advisory for ${caseData.fileName} (${caseData.packageName}). Risk score ${caseData.riskScore}/100. Intercepts sensitive credentials and OTP authentication codes.`
    : `Security verification complete for ${caseData.fileName} (${caseData.packageName}). Assigned risk index ${caseData.riskScore}/100. Standard application permissions without banking trojan vectors.`;

  const defaultAdvisory = isMalicious
    ? `IMMEDIATE ACTION REQUIRED: Uninstall ${caseData.fileName} immediately. Revoke accessibility and SMS permissions to prevent financial fraud.`
    : `VERDICT: ${caseData.fileName} poses low security exposure to your mobile device. Ensure application is downloaded from verified sources.`;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white font-mono">
            Citizen Safety Center & Public Threat Advisory
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { code: "en", label: "English" },
            { code: "hi", label: "हिंदी" },
            { code: "te", label: "తెలుగు" },
            { code: "kn", label: "ಕನ್ನಡ" },
            { code: "ta", label: "தமிழ்" },
            { code: "ml", label: "മലയാളം" }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-3 py-1 text-xs font-mono rounded-full border transition-all duration-200 cursor-pointer ${
                language === l.code
                  ? "bg-[#6366F1] text-white border-[#6366F1] font-bold shadow-[0_0_10px_rgba(99,102,241,0.35)]"
                  : "bg-[var(--bg-panel-alt)] border-[var(--border)] text-indigo-300 hover:text-white hover:border-indigo-400"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Citizen Safety Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
          isMalicious
            ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
            : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-sm ${isMalicious ? "bg-[var(--severity-critical)]/20 text-[var(--severity-critical)]" : "bg-[var(--severity-low)]/20 text-[var(--severity-low)]"}`}>
            {isMalicious ? <ShieldX className="w-10 h-10 animate-pulse" /> : <CheckCircle2 className="w-10 h-10" />}
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider block opacity-80">
              SAFETY VERDICT FOR {caseData.fileName}
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {isMalicious ? "⚠️ DO NOT INSTALL THIS APPLICATION" : "✅ VERIFIED SAFE APPLICATION"}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-sans">
              {isMalicious
                ? `The application ${caseData.fileName} contains high-risk malware indicators. Do not run on devices with banking apps.`
                : `The application ${caseData.fileName} (${caseData.packageName}) passes security verifications and poses low risk.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase">Public Threat Rating</span>
          <span className={`text-3xl font-bold ${isMalicious ? "text-[var(--severity-critical)]" : "text-[var(--severity-low)]"}`}>
            {isMalicious ? "HIGH RISK" : "LOW RISK"}
          </span>
        </div>
      </div>

      {/* What can this app do to your phone? - Graphical Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase text-indigo-300 font-mono tracking-wider">
          {isMalicious ? "What Can This Fake App Do to Your Smartphone?" : "Application Security & Telemetry Overview"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <div className="p-5 rounded-2xl bg-[var(--bg-panel-alt)] border border-[var(--border)] space-y-2.5 shadow-md">
            <div className={`flex items-center gap-2.5 ${isMalicious ? "text-rose-400" : "text-emerald-400"}`}>
              <MessageSquareCode className="w-5 h-5" />
              <h5 className="text-xs font-black font-mono text-white uppercase">
                {isMalicious ? "Reads Bank OTP SMS" : "SMS & Communication Integrity"}
              </h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {isMalicious
                ? "Silently reads confidential OTP (One Time Passwords) sent by your bank to authorize unauthorized money transfers."
                : "No unauthorized SMS listening or OTP interception privileges requested by this application."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-panel-alt)] border border-[var(--border)] space-y-2.5 shadow-md">
            <div className={`flex items-center gap-2.5 ${isMalicious ? "text-rose-400" : "text-emerald-400"}`}>
              <Eye className="w-5 h-5" />
              <h5 className="text-xs font-black font-mono text-white uppercase">
                {isMalicious ? "Records Keystrokes & Passwords" : "Accessibility Framework"}
              </h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {isMalicious
                ? "Captures your PIN, net banking passwords, and personal information whenever you type on your keyboard."
                : "No accessibility service abuse detected. App cannot monitor or record keyboard entries."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-panel-alt)] border border-[var(--border)] space-y-2.5 shadow-md">
            <div className={`flex items-center gap-2.5 ${isMalicious ? "text-amber-400" : "text-emerald-400"}`}>
              <Smartphone className="w-5 h-5" />
              <h5 className="text-xs font-black font-mono text-white uppercase">
                {isMalicious ? "Shows Fake Bank Screens" : "Window Overlays"}
              </h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {isMalicious
                ? "Puts a fake login window over your real banking apps to trick you into entering your account credentials."
                : "No system alert window privileges detected. App cannot inject overlay windows over banking apps."}
            </p>
          </div>
        </div>
      </div>

      {/* Official Multilingual Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="bg-[var(--bg-panel-alt)] border border-[var(--border)] p-6 rounded-2xl space-y-4 font-mono text-xs shadow-md">
          <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider block">
            Targeted Population Demographics
          </span>

          <div className="space-y-3">
            <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl">
              <span className="text-indigo-300 text-[10px] block font-bold">TARGET BINARY</span>
              <span className="text-sm font-black text-white block mt-0.5">
                {caseData.fileName}
              </span>
            </div>

            <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl">
              <span className="text-indigo-300 text-[10px] block font-bold">AFFECTED EXPOSURE RATING</span>
              <span className={`text-xs font-black block mt-0.5 ${isMalicious ? "text-rose-400" : "text-emerald-400"}`}>
                {citizenImpact.affectedPopulation || (isMalicious ? "High Device Exposure" : "Low Exposure Rating")}
              </span>
            </div>

            <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl">
              <span className="text-indigo-300 text-[10px] block font-bold">FRAUD VECTORS IDENTIFIED</span>
              <span className="text-slate-200 block mt-0.5">
                {citizenImpact.fraudType || (isMalicious ? "Credentials Harvesting & OTP Theft" : "Standard Utility Behavior - No Banking Fraud Detected")}
              </span>
            </div>
          </div>
        </div>

        {/* Multilingual Advisory */}
        <div className="lg:col-span-2 bg-[var(--bg-panel-alt)] border border-[var(--border)] p-6 rounded-2xl space-y-4 shadow-md">
          <h4 className="text-xs font-bold uppercase text-indigo-300 font-mono tracking-wider">
            Official Threat Alert Bulletin ({language.toUpperCase()})
          </h4>

          <div className="space-y-4 font-sans leading-relaxed">
            <div className="p-5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border)] space-y-1.5 shadow-sm">
              <h5 className="text-xs font-bold text-indigo-300 uppercase font-mono">Threat Alert Summary:</h5>
              <p className="text-sm text-white font-normal leading-relaxed">
                {multilingualReports[language]?.summary || defaultSummary}
              </p>
            </div>

            <div className={`p-5 rounded-xl border space-y-1.5 shadow-sm ${isMalicious ? "bg-rose-950/40 border-rose-500/40 text-rose-300" : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"}`}>
              <h5 className={`text-xs font-black uppercase font-mono ${isMalicious ? "text-rose-400" : "text-emerald-400"}`}>
                {isMalicious ? "Immediate Action Required:" : "Safety Advisory:"}
              </h5>
              <p className="text-sm font-semibold leading-relaxed">
                {multilingualReports[language]?.advisory || defaultAdvisory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
