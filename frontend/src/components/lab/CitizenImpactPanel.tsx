import React from "react";
import { Globe, ShieldAlert, AlertOctagon, CheckCircle2, XCircle, Info, ShieldX, Smartphone, Eye, MessageSquareCode } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";

export default function CitizenImpactPanel() {
  const { caseData, language, setLanguage } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR CITIZEN IMPACT PANEL
      </div>
    );
  }

  // Parse JSON safe checks
  const citizenImpact = caseData.citizenImpact ? JSON.parse(caseData.citizenImpact) : {};
  const multilingualReports = caseData.multilingualReports ? JSON.parse(caseData.multilingualReports) : {};

  const isMalicious = caseData.riskScore > 50;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
            Citizen Safety Center & Public Threat Advisory
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {[
            { code: "en", label: "English" },
            { code: "hi", label: "हिंदी" },
            { code: "te", label: "తెలుగు" },
            { code: "kn", label: "ಕನ್ನಡ" }
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-3 py-1 text-xs font-mono border rounded-lg transition-all duration-200 cursor-pointer ${
                language === l.code
                  ? "bg-primary/20 text-primary border-primary/50 font-bold"
                  : "bg-card border-card-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Citizen Safety Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
          isMalicious
            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isMalicious ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            {isMalicious ? <ShieldX className="w-10 h-10 animate-pulse" /> : <CheckCircle2 className="w-10 h-10" />}
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest block opacity-80">
              SAFETY VERDICT FOR CITIZENS
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-text-primary">
              {isMalicious ? "⚠️ DO NOT INSTALL THIS APPLICATION" : "✅ VERIFIED SAFE APPLICATION"}
            </h2>
            <p className="text-xs text-text-secondary mt-1 font-sans">
              {isMalicious
                ? "This application is a fake banking app that steals your money, reads OTP passwords, and controls your phone."
                : "This app passes security verifications and poses no threat to your mobile device."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 font-mono">
          <span className="text-[10px] text-text-muted uppercase">Public Threat Rating</span>
          <span className={`text-3xl font-extrabold ${isMalicious ? "text-rose-400" : "text-emerald-400"}`}>
            {isMalicious ? "HIGH RISK" : "LOW RISK"}
          </span>
        </div>
      </div>

      {/* What can this app do to your phone? - Graphical Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
          What Can This Fake App Do to Your Smartphone?
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <div className="p-4 rounded-xl bg-card-secondary border border-card-border space-y-2">
            <div className="flex items-center gap-2.5 text-rose-400">
              <MessageSquareCode className="w-5 h-5" />
              <h5 className="text-xs font-bold font-mono text-text-primary uppercase">Reads Bank OTP SMS</h5>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Silently reads confidential OTP (One Time Passwords) sent by your bank to authorize unauthorized money transfers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card-secondary border border-card-border space-y-2">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Eye className="w-5 h-5" />
              <h5 className="text-xs font-bold font-mono text-text-primary uppercase">Records Keystrokes & Passwords</h5>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Captures your PIN, net banking passwords, and personal information whenever you type on your keyboard.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card-secondary border border-card-border space-y-2">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Smartphone className="w-5 h-5" />
              <h5 className="text-xs font-bold font-mono text-text-primary uppercase">Shows Fake Bank Screens</h5>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Puts a fake login window over your real banking apps to trick you into entering your account credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Official Multilingual Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="bg-card-secondary border border-card-border p-5 rounded-xl space-y-4 font-mono text-xs">
          <span className="text-[10px] text-text-muted uppercase font-bold block">
            Targeted Population Demographics
          </span>

          <div className="space-y-3">
            <div className="p-3 bg-card border border-card-border rounded-lg">
              <span className="text-text-muted text-[10px] block">AFFECTED POPULATION</span>
              <span className="text-sm font-bold text-rose-400 block mt-0.5">
                {citizenImpact.affectedPopulation || "Retail Banking Customers"}
              </span>
            </div>

            <div className="p-3 bg-card border border-card-border rounded-lg">
              <span className="text-text-muted text-[10px] block">TARGET CUSTOMER GROUP</span>
              <span className="text-text-primary block mt-0.5">
                {citizenImpact.targetGroup || "Mobile UPI & Netbanking Users"}
              </span>
            </div>

            <div className="p-3 bg-card border border-card-border rounded-lg">
              <span className="text-text-muted text-[10px] block">FRAUD VECTORS IDENTIFIED</span>
              <span className="text-text-secondary block mt-0.5">
                {citizenImpact.fraudType || "Phishing APK via WhatsApp / SMS links"}
              </span>
            </div>
          </div>
        </div>

        {/* Multilingual Advisory */}
        <div className="lg:col-span-2 bg-card-secondary border border-card-border p-5 rounded-xl space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
            Official Threat Alert Bulletin ({language.toUpperCase()})
          </h4>

          <div className="space-y-4 font-sans leading-relaxed">
            <div className="p-4 rounded-xl bg-card border border-card-border space-y-1">
              <h5 className="text-xs font-bold text-primary uppercase font-mono">Threat Alert Summary:</h5>
              <p className="text-sm text-text-primary leading-relaxed">
                {multilingualReports[language]?.summary || multilingualReports["en"]?.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <h5 className="text-xs font-bold text-rose-400 uppercase font-mono">Immediate Action Required:</h5>
              <p className="text-sm text-rose-300 font-semibold leading-relaxed">
                {multilingualReports[language]?.advisory || multilingualReports["en"]?.advisory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
