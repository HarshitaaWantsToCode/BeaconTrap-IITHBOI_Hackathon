import React from "react";
import { Fingerprint, AlertTriangle } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";

export default function BlockchainEvidencePanel() {
  const { caseData } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR EVIDENCE LEDGER
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <Fingerprint className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
          Evidence Ledger & Blockchain Anchoring
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-secondary border border-card-border p-5 rounded-lg space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
            Block Ledger Receipt
          </h4>
          
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-text-muted text-[10px] block">TRANSACTION HASH</span>
              {caseData.blockchainTxHash ? (
                <a 
                  href={`https://sepolia.etherscan.io/tx/${caseData.blockchainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all block"
                >
                  {caseData.blockchainTxHash}
                </a>
              ) : (
                <span className="text-text-primary break-all block">Pending transaction...</span>
              )}
            </div>
            <div>
              <span className="text-text-muted text-[10px] block">BLOCK ANCHOR INDEX</span>
              <span className="text-text-primary block">{caseData.blockchainBlock || "Pending mine..."}</span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] block">ANCHOR TIMESTAMP</span>
              <span className="text-text-primary block">
                {caseData.blockchainTimestamp ? new Date(caseData.blockchainTimestamp).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider">
              Chain-of-Custody Integrity Guarantee
            </h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-mono">
            This malware report has been cryptographically signed and hash-anchored onto the distributed evidence ledger. This prevents retrospective tampering, providing court-admissible evidence that the extracted behaviors, malicious network signatures, and package metadata correspond strictly to the submitted binary.
          </p>
        </div>
      </div>
    </div>
  );
}
