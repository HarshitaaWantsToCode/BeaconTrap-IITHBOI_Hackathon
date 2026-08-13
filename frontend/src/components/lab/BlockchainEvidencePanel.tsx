import React, { useState } from "react";
import { Fingerprint, AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";
import { useBlockchainAnchor } from "../../hooks/useBlockchainAnchor";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://beacontrap-backend.onrender.com";

export default function BlockchainEvidencePanel() {
  const { caseData, updateBlockchainAnchor } = useAnalysis();
  const { anchorEvidence, status, error } = useBlockchainAnchor();
  const [localError, setLocalError] = useState<string | null>(null);

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR EVIDENCE LEDGER
      </div>
    );
  }

  const handleAnchor = async () => {
    setLocalError(null);
    try {
      // Anchor a hash of the case's own report content — this is the exact
      // evidence being committed to the chain, not a placeholder.
      const reportPayload = caseData.analystReport || JSON.stringify(caseData);
      const reportBytes = new TextEncoder().encode(reportPayload);

      const result = await anchorEvidence(caseData.id, reportBytes);
      if (result) {
        // Ask the backend to independently verify this tx against Sepolia
        // before trusting it — never just take the frontend's word for it.
        try {
          const verifyRes = await fetch(`${API_BASE_URL}/api/v1/cases/${caseData.id}/verify-anchor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tx_hash: result.txHash }),
          });
          if (verifyRes.ok) {
            const verified = await verifyRes.json();
            updateBlockchainAnchor(
              verified.tx_hash,
              verified.block_number,
              new Date()
            );
          } else {
            const errBody = await verifyRes.json().catch(() => null);
            setLocalError(errBody?.detail || "Backend could not verify the anchor on-chain.");
          }
        } catch (verifyErr) {
          setLocalError("Anchored on-chain, but backend verification failed to run.");
        }
      }
    } catch (err: any) {
      setLocalError(err?.message || "Anchoring failed");
    }
  };

  const isBusy = status === "connecting" || status === "anchoring";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
            Evidence Ledger & Blockchain Anchoring
          </h3>
        </div>

        {!caseData.blockchainTxHash && (
          <button
            onClick={handleAnchor}
            disabled={isBusy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {status === "connecting" ? "Connecting MetaMask..." : "Anchoring..."}
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                Anchor to Sepolia
              </>
            )}
          </button>
        )}
      </div>

      {(error || localError) && (
        <div className="text-xs font-mono text-rose-400 bg-rose-500/5 border border-rose-500/20 rounded-md p-3">
          {error || localError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-secondary border border-card-border p-5 rounded-lg space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
            Block Ledger Receipt
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-text-muted text-[10px] block">TRANSACTION HASH</span>
              {caseData.blockchainTxHash ? (
                
                  href={`https://sepolia.etherscan.io/tx/${caseData.blockchainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all block"
                >
                  {caseData.blockchainTxHash}
                </a>
              ) : (
                <span className="text-text-primary break-all block">
                  {isBusy ? "Awaiting MetaMask confirmation..." : "Not yet anchored"}
                </span>
              )}
            </div>
            <div>
              <span className="text-text-muted text-[10px] block">BLOCK ANCHOR INDEX</span>
              <span className="text-text-primary block">{caseData.blockchainBlock ?? "Pending mine..."}</span>
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
            This malware report has been cryptographically signed and hash-anchored onto the distributed evidence ledger. This
