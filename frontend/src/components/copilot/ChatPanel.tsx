"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minimize2,
  Send,
  Loader2,
  FileText,
  Shield,
  Target,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import { CopilotAction, CopilotCaseContext, CopilotMessage } from "@/types/copilot";

interface ChatPanelProps {
  isOpen: boolean;
  isMinimized: boolean;
  messages: CopilotMessage[];
  input: string;
  loading: boolean;
  context: CopilotCaseContext;
  suggestedPrompts: string[];
  onClose: () => void;
  onMinimize: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onAction: (action: CopilotAction) => void;
  onSuggestedPrompt: (prompt: string) => void;
}

const QUICK_ACTIONS: { action: CopilotAction; label: string; icon: React.ElementType }[] = [
  { action: "executive_summary", label: "Executive Summary", icon: FileText },
  { action: "analyst_summary", label: "Analyst Report", icon: Shield },
  { action: "explain_mitre", label: "Explain MITRE", icon: Target },
  { action: "explain_iocs", label: "Explain IOCs", icon: AlertTriangle },
  { action: "explain_risk", label: "Risk Score", icon: Sparkles },
  { action: "mitigation", label: "Mitigation", icon: Shield },
];

export default function ChatPanel({
  isOpen,
  isMinimized,
  messages,
  input,
  loading,
  context,
  suggestedPrompts,
  onClose,
  onMinimize,
  onInputChange,
  onSend,
  onAction,
  onSuggestedPrompt,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          height: isMinimized ? 52 : 560,
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="fixed bottom-6 right-6 z-[100] w-[400px] max-w-[calc(100vw-2rem)] flex flex-col bg-card/95 border border-card-border rounded-2xl backdrop-blur-xl shadow-[0_0_60px_var(--primary-glow),var(--shadow-card)] overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="h-[2px] bg-gradient-to-r from-primary via-critical to-primary shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-card-border bg-card-secondary/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
                BeaconTrap AI Copilot
              </h3>
              <p className="text-[9px] font-mono text-text-muted">
                {context.caseId ? `Case: ${context.caseId}` : "SOC Intelligence Layer"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase mr-1">
              Live
            </span>
            <button
              onClick={onMinimize}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-secondary transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-secondary transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick actions */}
            <div className="px-3 py-2 border-b border-card-border/40 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-thin">
              {QUICK_ACTIONS.map(({ action, label, icon: Icon }) => (
                <button
                  key={action}
                  onClick={() => onAction(action)}
                  disabled={loading}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-card-border bg-card-secondary/40 text-[9px] font-mono text-text-secondary hover:text-primary hover:border-primary/30 transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  <Icon className="w-2.5 h-2.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <Sparkles className="w-8 h-8 text-primary/40 mx-auto" />
                  <p className="text-xs text-text-secondary font-sans leading-relaxed px-4">
                    Ask me about threat findings, risk scores, MITRE techniques, or request executive reports.
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center px-2">
                    {suggestedPrompts.slice(0, 3).map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => onSuggestedPrompt(prompt)}
                        className="text-[9px] font-mono px-2.5 py-1 rounded-full border border-card-border text-text-secondary hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-primary text-xs font-mono animate-pulse px-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Synthesizing intelligence...
                </div>
              )}
            </div>

            {/* Suggested prompts */}
            {messages.length > 0 && suggestedPrompts.length > 0 && !loading && (
              <div className="px-3 py-1.5 border-t border-card-border/40 flex gap-1 overflow-x-auto shrink-0">
                {suggestedPrompts.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => onSuggestedPrompt(prompt)}
                    className="text-[8px] font-mono px-2 py-0.5 rounded border border-card-border text-text-muted hover:text-primary hover:border-primary/30 transition-colors whitespace-nowrap shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-card-border bg-card-secondary/40 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this investigation..."
                  disabled={loading}
                  className="flex-1 bg-card border border-card-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 font-sans disabled:opacity-50"
                />
                <button
                  onClick={onSend}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-lg bg-primary hover:bg-primary-hover text-[var(--btn-copilot-text)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
