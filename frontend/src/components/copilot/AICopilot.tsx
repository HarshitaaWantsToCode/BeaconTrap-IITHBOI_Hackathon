"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ChatPanel from "./ChatPanel";
import {
  CopilotAction,
  CopilotCaseContext,
  CopilotMessage,
} from "@/types/copilot";

function createMessage(role: CopilotMessage["role"], content: string): CopilotMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

function detectPage(pathname: string): CopilotCaseContext["page"] {
  if (pathname === "/") return "dashboard";
  if (pathname.startsWith("/upload")) return "upload";
  if (pathname.startsWith("/case/")) return "case";
  return "other";
}

export default function AICopilot() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "What threats are we tracking today?",
    "Explain banking trojan attack patterns",
    "How does BeaconTrap score APK risk?",
  ]);
  const [caseContext, setCaseContext] = useState<CopilotCaseContext>({
    caseId: null,
    page: "dashboard",
  });

  // Load case context when on case page
  useEffect(() => {
    const page = detectPage(pathname);
    const caseMatch = pathname.match(/^\/case\/([^/]+)/);
    const caseId = caseMatch?.[1] ?? null;

    if (!caseId) {
      setCaseContext({ caseId: null, page });
      return;
    }

    let cancelled = false;

    fetch(`/api/cases/${caseId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) {
          setCaseContext({ caseId, page: "case" });
          return;
        }

        setCaseContext({
          caseId: data.id,
          fileName: data.fileName,
          packageName: data.packageName,
          threatFamily: data.threatFamily,
          riskScore: data.riskScore,
          permissionScore: data.permissionScore,
          iocScore: data.iocScore,
          keywordScore: data.keywordScore,
          aiConfidence: data.aiConfidence,
          mitreTags: data.mitreTags ? JSON.parse(data.mitreTags) : [],
          iocs: data.iocs ? JSON.parse(data.iocs) : [],
          permissions: data.permissions ? JSON.parse(data.permissions) : [],
          threatNarrative: data.threatNarrative ? JSON.parse(data.threatNarrative) : undefined,
          page: "case",
        });
      })
      .catch(() => {
        if (!cancelled) setCaseContext({ caseId, page: "case" });
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const sendMessage = useCallback(
    async (text: string, action?: CopilotAction) => {
      if (!text.trim() && !action) return;

      const userMsg = createMessage("user", action ? `[${action.replace(/_/g, " ")}]` : text);
      setMessages((prev: CopilotMessage[]) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/copilot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages,
            context: caseContext,
            action,
          }),
        });

        if (!res.ok) throw new Error("Copilot request failed");

        const data = await res.json();
        const assistantMsg = createMessage("assistant", data.reply);
        setMessages((prev: CopilotMessage[]) => [...prev, assistantMsg]);
        if (data.suggestedPrompts?.length) {
          setSuggestedPrompts(data.suggestedPrompts);
        }
      } catch {
        const fallback = createMessage(
          "assistant",
          "**Copilot temporarily offline.** Please retry. Your case context is preserved."
        );
        setMessages((prev: CopilotMessage[]) => [...prev, fallback]);
      } finally {
        setLoading(false);
      }
    },
    [messages, caseContext]
  );

  const handleSend = () => sendMessage(input);
  const handleAction = (action: CopilotAction) => sendMessage("", action);
  const handleSuggestedPrompt = (prompt: string) => sendMessage(prompt);

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-[var(--btn-copilot-text)] font-bold px-4 py-3 rounded-2xl shadow-[0_0_30px_var(--primary-glow)] transition-all no-print"
          aria-label="Open BeaconTrap AI Copilot"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-mono">AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-[var(--btn-copilot-text)] animate-pulse" />
        </motion.button>
      )}

      <ChatPanel
        isOpen={isOpen}
        isMinimized={isMinimized}
        messages={messages}
        input={input}
        loading={loading}
        context={caseContext}
        suggestedPrompts={suggestedPrompts}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsMinimized((v: boolean) => !v)}
        onInputChange={setInput}
        onSend={handleSend}
        onAction={handleAction}
        onSuggestedPrompt={handleSuggestedPrompt}
      />
    </>
  );
}
