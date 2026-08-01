"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";
import { CopilotMessage } from "@/types/copilot";

interface ChatMessageProps {
  message: CopilotMessage;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-card-secondary px-1 py-0.5 rounded text-primary font-mono text-[10px] border border-card-border"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc ml-4 space-y-0.5 my-1">
        {listBuffer.map((item, i) => (
          <li key={i} className="text-text-secondary text-xs leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, idx) => {
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
      return;
    }
    flushList();

    if (line.startsWith("## ")) {
      elements.push(
        <h4 key={idx} className="text-xs font-bold text-primary uppercase tracking-wider font-mono mt-2 mb-1">
          {line.slice(3)}
        </h4>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h3 key={idx} className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono mt-2 mb-1">
          {line.slice(2)}
        </h3>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={idx} className="h-1" />);
    } else {
      elements.push(
        <p key={idx} className="text-xs text-text-secondary leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
          isUser
            ? "bg-card-secondary border-card-border text-text-secondary"
            : "bg-primary/10 border-primary/30 text-primary"
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>

      <div
        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 border ${
          isUser
            ? "bg-card-secondary/60 border-card-border/60"
            : "bg-card/80 border-card-border/80"
        }`}
      >
        {!isUser && (
          <div className="text-[8px] font-mono text-primary uppercase tracking-widest font-bold mb-1.5">
            BeaconTrap Copilot
          </div>
        )}
        <div className="space-y-0.5">{renderContent(message.content)}</div>
        <div className="text-[8px] font-mono text-text-muted mt-1.5 text-right">
          {new Date(message.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
