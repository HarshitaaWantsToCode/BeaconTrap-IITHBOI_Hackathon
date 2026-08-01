import React from "react";
import { Cpu, Layers } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";

export default function SecurityAnalystPanel() {
  const { caseData } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR SECURITY ANALYST PANEL
      </div>
    );
  }

  // Parse JSON safe checks
  const permissions: string[] = JSON.parse(caseData.permissions || "[]");
  const activities: string[] = JSON.parse(caseData.activities || "[]");
  const services: string[] = JSON.parse(caseData.services || "[]");
  const mitreTags: { id: string; name: string }[] = JSON.parse(caseData.mitreTags || "[]");
  const threatNarrative = caseData.threatNarrative ? JSON.parse(caseData.threatNarrative) : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <Cpu className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
          Static Analysis & Code Telemetry
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manifest Intel */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
            Extracted Android Components
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card-secondary border border-card-border p-4 rounded-lg space-y-2">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                Target Permissions ({permissions.length})
              </span>
              <div className="max-h-60 overflow-y-auto space-y-1 font-mono text-[10px] text-text-secondary pr-2">
                {permissions.length > 0 ? (
                  permissions.map((p, idx) => (
                    <div key={idx} className="p-1.5 bg-card border border-card-border rounded truncate hover:text-rose-400">
                      {p}
                    </div>
                  ))
                ) : (
                  <span className="text-text-muted text-[10px] italic">No permissions requested.</span>
                )}
              </div>
            </div>

            <div className="bg-card-secondary border border-card-border p-4 rounded-lg space-y-2">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                Background Services ({services.length})
              </span>
              <div className="max-h-60 overflow-y-auto space-y-1 font-mono text-[10px] text-text-secondary pr-2">
                {services.length > 0 ? (
                  services.map((s, idx) => (
                    <div key={idx} className="p-1.5 bg-card border border-card-border rounded truncate">
                      {s}
                    </div>
                  ))
                ) : (
                  <span className="text-text-muted text-[10px] italic">No services registered.</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card-secondary border border-card-border p-4 rounded-lg space-y-2 mt-4">
            <span className="text-[10px] text-text-muted uppercase font-bold block">
              Registered App Activities ({activities.length})
            </span>
            <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-[10px] text-text-secondary pr-2">
              {activities.length > 0 ? (
                activities.map((act, idx) => (
                  <div key={idx} className="p-1.5 bg-card border border-card-border rounded truncate">
                    {act}
                  </div>
                ))
              ) : (
                <span className="text-text-muted text-[10px] italic">No activities registered.</span>
              )}
            </div>
          </div>
        </div>

        {/* MITRE Tags & Analyst report */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
            MITRE ATT&CK Mapping
          </h4>
          <div className="flex flex-wrap gap-2">
            {mitreTags.length > 0 ? (
              mitreTags.map((tag) => (
                <span key={tag.id} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] font-bold px-2 py-1 rounded">
                  {tag.id} : {tag.name}
                </span>
              ))
            ) : (
              <span className="text-text-muted text-xs italic">No matching techniques mapped.</span>
            )}
          </div>

          <div className="bg-card-secondary border border-card-border p-4 rounded-lg space-y-3 mt-4">
            <span className="text-[10px] text-text-muted uppercase font-bold block">
              Forensic Case Narrative
            </span>
            <p className="text-xs text-text-secondary leading-relaxed font-mono">
              {threatNarrative.behavior || "Telemetry data description pending sandbox evaluation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
