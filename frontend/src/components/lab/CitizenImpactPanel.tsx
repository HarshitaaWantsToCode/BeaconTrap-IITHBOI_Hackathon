import React from "react";
import { Globe } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
          Citizen Advisory & Translations
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Exposure */}
        <div className="bg-card-secondary border border-card-border p-5 rounded-lg space-y-4 font-mono text-xs">
          <span className="text-[10px] text-text-muted uppercase font-bold block">
            Targeted Population Demographics
          </span>
          
          <div className="space-y-3">
            <div>
              <span className="text-text-muted text-[10px] block">AFFECTED POPULATION</span>
              <span className="text-base font-bold text-rose-400 block mt-0.5">
                {citizenImpact.affectedPopulation}
              </span>
            </div>

            <div>
              <span className="text-text-muted text-[10px] block">TARGET CUSTOMER GROUP</span>
              <span className="text-text-primary block mt-0.5">
                {citizenImpact.targetGroup}
              </span>
            </div>

            <div>
              <span className="text-text-muted text-[10px] block">FRAUD VECTORS IDENTIFIED</span>
              <span className="text-text-secondary block mt-0.5">
                {citizenImpact.fraudType}
              </span>
            </div>

            <div>
              <span className="text-text-muted text-[10px] block">ALERT URGENCY LEVEL</span>
              <span className="text-rose-400 font-bold block mt-0.5 uppercase">
                {citizenImpact.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Language selection and translations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
              Multilingual Bulletins
            </span>
            <div className="flex gap-2">
              {[
                { code: "en", label: "English" },
                { code: "hi", label: "हिंदी" },
                { code: "te", label: "తెలుగు" },
                { code: "kn", label: "ಕನ್ನಡ" }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 text-[10px] font-mono border rounded transition-all duration-200 ${
                    language === l.code
                      ? "bg-primary/20 text-primary border-primary/40 font-bold"
                      : "bg-transparent border-card-border text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card-secondary border border-card-border p-5 rounded-lg space-y-4 font-sans leading-relaxed">
            <div>
              <h5 className="text-xs font-bold text-text-primary uppercase font-mono mb-1.5">Official Threat Alert Summary:</h5>
              <p className="text-sm text-text-secondary leading-relaxed">
                {multilingualReports[language]?.summary || multilingualReports["en"]?.summary}
              </p>
            </div>
            
            <div className="h-[1px] bg-card-border" />

            <div>
              <h5 className="text-xs font-bold text-text-primary uppercase font-mono mb-1.5">Citizen Action Advisory:</h5>
              <p className="text-sm text-rose-400 font-medium leading-relaxed">
                {multilingualReports[language]?.advisory || multilingualReports["en"]?.advisory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
