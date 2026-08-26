import React, { useState } from "react";
import { Shield, Key, LogOut, CheckCircle2, UserCheck, Lock, X, RefreshCw, BadgeCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose }) => {
  const { user, updateRole, logout, login, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToken = () => {
    navigator.clipboard.writeText(user.jwtToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = (role: "ANALYST" | "BANK_OFFICER" | "AUDITOR" | "ADMIN") => {
    updateRole(role);
    setAuthStatus(`Operational Persona switched to ${role}!`);
    setTimeout(() => setAuthStatus(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-panel)] p-6 sm:p-7 shadow-2xl space-y-6 font-sans text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white">
                User Authentication & Session
              </h3>
              <p className="text-xs text-indigo-300 font-mono">
                BeaconTrap Identity & Access Management (IAM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-panel-alt)] text-indigo-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Status Notification Toast */}
        {authStatus && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{authStatus}</span>
          </div>
        )}

        {/* User Identity Card */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-panel-alt)] space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/40 text-indigo-300 font-bold flex items-center justify-center font-mono text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  {user.name}
                  <BadgeCheck className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                </h4>
                <p className="text-xs text-slate-300 font-sans">{user.organization}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
              isAuthenticated ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40" : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
            }`}>
              {isAuthenticated ? "Session Active" : "Guest Mode"}
            </span>
          </div>

          <div className="pt-2 border-t border-[var(--border)] text-xs font-mono space-y-1">
            <div className="flex justify-between text-indigo-300 text-[11px]">
              <span>Security Clearance:</span>
              <span className="text-white font-bold">{user.clearanceLevel}</span>
            </div>
            <div className="flex justify-between text-indigo-300 text-[11px]">
              <span>Session Logged At:</span>
              <span className="text-slate-300">{user.lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Operational Persona / Role Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold block">
            Select Active Security Persona (RBAC Scope)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "ANALYST", label: "SOC Analyst", desc: "Technical APK Decompilation & Forensics" },
              { id: "BANK_OFFICER", label: "Bank Officer", desc: "GRC Compliance & Risk Management" },
              { id: "CITIZEN", label: "Citizen / Public", desc: "Threat Advisory & Safety Summary" },
              { id: "AUDITOR", label: "Legal Auditor", desc: "Blockchain Chain of Custody Proofs" },
              { id: "ADMIN", label: "Sys Administrator", desc: "Heuristics & C2 System Config" }
            ].map((roleSpec) => {
              const isSelected = user.role === roleSpec.id;
              return (
                <button
                  key={roleSpec.id}
                  onClick={() => handleRoleChange(roleSpec.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#6366F1] border-[#818CF8] text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] font-bold"
                      : "bg-[var(--bg-panel-alt)] border-[var(--border)] hover:border-[#818CF8]/40 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase font-bold">{roleSpec.label}</span>
                    {isSelected && <UserCheck className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <p className="text-[10px] text-indigo-200 font-sans leading-tight">
                    {roleSpec.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* JWT Token Hash Display */}
        <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-panel-alt)] space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-indigo-300 font-bold">
            <span className="flex items-center gap-1"><Key className="w-3 h-3 text-indigo-400" /> JWT Session Token Digest</span>
            <button 
              onClick={copyToken}
              className="text-indigo-300 hover:text-white uppercase text-[10px] font-bold cursor-pointer"
            >
              {copied ? "Copied!" : "Copy JWT"}
            </button>
          </div>
          <p className="text-[10px] font-mono text-slate-300 break-all line-clamp-2 bg-[var(--bg-panel)] p-2.5 rounded-xl border border-[var(--border)]">
            {user.jwtToken}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setAuthStatus("Signed out. Switched to Guest Investigator mode.");
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out Session
            </button>
          ) : (
            <button
              onClick={() => {
                login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoYXJzaGl0YWEiLCJyb2xlIjoiQU5BTFlTVCIsImlhdCI6MTc4MjM5MH0.signature", "ANALYST", "Officer Harshitaa");

                setAuthStatus("Authenticated successfully as Lead Analyst!");
              }}
              className="px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white border border-transparent text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            >
              <RefreshCw className="w-4 h-4" /> Re-authenticate Session
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-panel-alt)] hover:bg-[var(--border)] text-white text-xs font-mono font-bold border border-[var(--border)] cursor-pointer transition-all"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
