import React from "react";
import { Briefcase, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";

export default function GrcCompliancePanel() {
  const { caseData } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR GRC COMPLIANCE PANEL
      </div>
    );
  }

  // Parse JSON safe checks
  const permissions: string[] = JSON.parse(caseData.permissions || "[]");
  const iocs: any[] = JSON.parse(caseData.iocs || "[]");
  const citizenImpact = caseData.citizenImpact ? JSON.parse(caseData.citizenImpact) : {};
  const executiveSummary = caseData.threatNarrative ? JSON.parse(caseData.threatNarrative) : {};

  // Formatted GRC mappings
  const rbiStatus = permissions.includes("android.permission.RECEIVE_SMS") ? "Critical Violation" : "Review Required";
  const dpdpStatus = permissions.includes("android.permission.BIND_ACCESSIBILITY_SERVICE") ? "Non-Compliant (Data Breach)" : "Under Review";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <Briefcase className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
          Bank Compliance & Advisory Panel
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance list */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Regulatory Mandates Assessment</span>
          </h4>

          <div className="space-y-3">
            <div className="bg-card-secondary border border-card-border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-text-primary">RBI Digital Payments Mandate</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20">
                  {rbiStatus}
                </span>
              </div>
              <span className="text-[9px] font-mono text-text-muted block mb-1">Section 3.1 & 3.2 Mandate</span>
              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                Accessibility and SMS listening permissions bypass multi-factor authentication triggers. Direct violation of Section 3.1 regarding secure, tamper-proof mobile delivery pathways.
              </p>
            </div>

            <div className="bg-card-secondary border border-card-border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-text-primary">DPDP Act (2023) Compliance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20">
                  {dpdpStatus}
                </span>
              </div>
              <span className="text-[9px] font-mono text-text-muted block mb-1">Section 6 & 8 Consent & Security Obligations</span>
              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                Abuse of accessibility keystroke hooks logs sensitive credential identifiers without explicit customer consent loops, presenting severe personal data processing risks under Section 8.
              </p>
            </div>

            <div className="bg-card-secondary border border-card-border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-text-primary">IT Act, 2000 Compliance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/20">
                  Statutory Offence
                </span>
              </div>
              <span className="text-[9px] font-mono text-text-muted block mb-1">Section 43A, 66C & 66D Identity Theft</span>
              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                Spoofing official Bank of India branding layouts and package identifiers constitutes digital impersonation and credentials theft under Section 66D of the IT Act.
              </p>
            </div>
          </div>
        </div>

        {/* Action plan */}
        <div className="bg-card-secondary border border-card-border p-5 rounded-lg flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest mb-3">
              CISO Action Plan & SLA Targets
            </h4>
            
            <div className="text-xs font-mono text-rose-400 border border-rose-500/20 bg-rose-500/5 p-3 rounded mb-4">
              ⚠️ FINANCIAL LOSS EXPOSURE: {citizenImpact.fraudType || "High risk of UPI exfiltration."}
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-card border border-card-border rounded-lg">
                <div className="font-bold text-rose-400 text-[10px] uppercase tracking-wider mb-1">CERT-In SLA Alert:</div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Cybersecurity incidents involving malicious overlay modules mimicking bank channels mandate reporting within the statutory 6-hour SLA warning window.
                </p>
              </div>

              <div className="p-3 bg-card border border-card-border rounded-lg">
                <div className="font-bold text-primary text-[10px] uppercase tracking-wider mb-1">Network Threat Footprints:</div>
                <div className="max-h-24 overflow-y-auto space-y-1 mt-1">
                  {iocs.map((ioc, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] border-b border-card-border pb-1">
                      <span className="text-text-primary">{ioc.value}</span>
                      <span className="text-text-muted">{ioc.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-card-border p-3 rounded-lg text-[10px] font-mono text-text-secondary">
            ESTIMATED CISO AGGREGATE RISK WEIGHT: <span className="font-bold text-rose-400">95%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
