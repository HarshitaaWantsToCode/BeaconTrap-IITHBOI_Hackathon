"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldAlert, Terminal, AlertTriangle, Info, Eye } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";

interface AlertItem {
  id: string;
  caseId: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  resolved: boolean;
  createdAt: string;
  fileName?: string;
  riskScore?: number;
}

const MOCK_THREATS: AlertItem[] = [
  {
    id: "mock-1",
    caseId: "SBI-TROJAN-01",
    title: "Banking Trojan detected",
    severity: "CRITICAL",
    description: "SBI Secure Token binary matched heuristic signature for Anubis Banking Trojan family.",
    createdAt: new Date().toISOString(),
    fileName: "sbi_secure_token.apk",
    riskScore: 92,
    resolved: false
  },
  {
    id: "mock-2",
    caseId: "ACC-ABUSE-02",
    title: "Accessibility abuse identified",
    severity: "HIGH",
    description: "Request for BIND_ACCESSIBILITY_SERVICE permission detected in app manifest.",
    createdAt: new Date(Date.now() - 60000).toISOString(),
    fileName: "helper_service.apk",
    riskScore: 78,
    resolved: false
  },
  {
    id: "mock-3",
    caseId: "DOM-CORR-03",
    title: "Suspicious domain correlation found",
    severity: "MEDIUM",
    description: "Active threat intelligence match for connection to host blacklisted C2 proxy.",
    createdAt: new Date(Date.now() - 120000).toISOString(),
    fileName: "payment_update.apk",
    riskScore: 54,
    resolved: false
  },
  {
    id: "mock-4",
    caseId: "SMS-INT-04",
    title: "SMS interception indicators detected",
    severity: "CRITICAL",
    description: "Dangerous permission READ_SMS and RECEIVE_SMS abuse signature identified.",
    createdAt: new Date(Date.now() - 180000).toISOString(),
    fileName: "bank_advisor.apk",
    riskScore: 88,
    resolved: false
  }
];

export default function LiveThreatFeed() {
  const { feedList, setFeedList } = useAnalysis();
  const [dbAlerts, setDbAlerts] = useState<AlertItem[]>([]);
  const nextAlertIndex = useRef(0);
  const queueRef = useRef<AlertItem[]>([]);

  // 1. Fetch live alerts from API endpoint
  const fetchAlerts = () => {
    fetch("/api/alerts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch alerts");
        return res.json();
      })
      .then((data: AlertItem[]) => {
        // Sort alerts chronologically so we can stream them from oldest to newest or cycle them
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setDbAlerts(sorted);
      })
      .catch((err) => {
        console.error("Error fetching live alerts:", err);
      });
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 8000);
    return () => clearInterval(interval);
  }, []);

  // 2. Prepare queue of alerts to stream (combine db alerts and mock alerts)
  useEffect(() => {
    // Merge db alerts with mock threats. Ensure all mock threat types requested by user are present.
    // If the database has alerts, we prepend them so they stream first, otherwise we default to mocks.
    const allAlerts = [...dbAlerts];
    
    // Always append mock threats to ensure we never have an empty list and cover all requested events.
    MOCK_THREATS.forEach(mock => {
      if (!allAlerts.some(a => a.title === mock.title)) {
        allAlerts.push(mock);
      }
    });

    queueRef.current = allAlerts;
    
    // Initialize feed with first 3 items if empty
    if (feedList.length === 0 && allAlerts.length > 0) {
      const initial = allAlerts.slice(0, 3).reverse();
      setFeedList(initial);
      nextAlertIndex.current = Math.min(3, allAlerts.length) % allAlerts.length;
    }
  }, [dbAlerts, feedList.length]);

  // 3. Periodic streaming tick: pushes the next alert to the top of the feed list
  useEffect(() => {
    const tick = setInterval(() => {
      const queue = queueRef.current;
      if (queue.length === 0) return;

      const nextAlert = queue[nextAlertIndex.current];
      
      // Update next index index
      nextAlertIndex.current = (nextAlertIndex.current + 1) % queue.length;

      // Assign a fresh dynamic ID to trigger CSS animation on re-insertion
      const alertWithNewId = {
        ...nextAlert,
        id: `${nextAlert.id}-t-${Date.now()}`,
        createdAt: new Date().toISOString() // Show as fresh event
      };

      setFeedList((prev) => {
        // Filter out duplicate active titles to keep feed diverse, and slice to max 5 items
        const filtered = prev.filter((item) => item.title !== nextAlert.title);
        return [alertWithNewId, ...filtered].slice(0, 5);
      });
    }, 4000);

    return () => clearInterval(tick);
  }, []);

  // Helpers for styling severity levels
  // Helpers for styling severity levels
  const getSeverityStyle = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return {
          bg: "bg-[var(--critical-bg)] border-[var(--critical-border)]",
          text: "text-[var(--critical-color)]",
          badge: "bg-[var(--critical-color)] text-slate-950 font-black",
          icon: ShieldAlert
        };
      case "HIGH":
        return {
          bg: "bg-[var(--high-bg)] border-[var(--high-border)]",
          text: "text-[var(--high-color)]",
          badge: "bg-[var(--high-color)] text-slate-950 font-black",
          icon: AlertTriangle
        };
      case "MEDIUM":
        return {
          bg: "bg-[var(--medium-bg)] border-[var(--medium-border)]",
          text: "text-[var(--medium-color)]",
          badge: "bg-[var(--medium-color)] text-slate-950 font-black",
          icon: AlertTriangle
        };
      default:
        return {
          bg: "bg-[var(--low-bg)] border-[var(--low-border)]",
          text: "text-[var(--low-color)]",
          badge: "bg-[var(--low-color)] text-slate-950 font-black",
          icon: Info
        };
    }
  };

  return (
    <div className="bg-card/60 border border-card-border rounded-xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col h-[400px] transition-all duration-200">
      
      {/* Dynamic Keyframe Animation Styles injection */}
      <style>{`
        @keyframes alertSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-15px) scale(0.96);
            filter: brightness(1.8) drop-shadow(0 0 10px rgba(124, 58, 237, 0.4));
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(1) drop-shadow(0 0 0px transparent);
          }
        }
        .animate-threat-alert {
          animation: alertSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Cyber overlay elements */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>

      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4.5 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--critical-color)]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary font-mono">
            Live Threat Stream
          </h3>
        </div>
        
        {/* Blinking indicator */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[var(--critical-color)] uppercase tracking-widest font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--critical-color)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--critical-color)]"></span>
          </span>
          <span>Live Feed</span>
        </div>
      </div>

      {/* Events scrolling feed list container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 z-10 min-h-0 select-none scrollbar-thin">
        {feedList.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          const Icon = style.icon;
          const isMock = alert.id.startsWith("mock");

          return (
            <div
              key={alert.id}
              className={`p-3 bg-card border border-card-border rounded-lg flex flex-col gap-1.5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 animate-threat-alert`}
            >
              {/* Severity & Timestamp Row */}
              <div className="flex items-center justify-between font-mono text-[9px]">
                <span className={`inline-flex items-center gap-1 font-bold border rounded px-1.5 py-0.2 uppercase transition-colors duration-200 ${style.text} ${style.bg}`}>
                  <Icon className="w-2.5 h-2.5" />
                  {alert.severity}
                </span>
                
                <span className="text-text-muted">
                  {new Date(alert.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}
                </span>
              </div>

              {/* Event Content Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-text-primary">
                  {alert.title}
                </h4>
                <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Targets & Actions row */}
              <div className="flex items-center justify-between border-t border-card-border/60 pt-2 mt-1 font-mono text-[9px]">
                <div className="text-text-muted truncate max-w-[160px]" title={alert.fileName}>
                  Target: <span className="text-text-secondary font-semibold">{alert.fileName || "Unknown APK"}</span>
                </div>
                
                {!isMock ? (
                  <a
                    href={`/case/${alert.caseId}`}
                    className="text-primary hover:text-primary-hover font-bold flex items-center gap-1 transition-colors uppercase"
                  >
                    <Eye className="w-2.5 h-2.5" />
                    <span>Investigate</span>
                  </a>
                ) : (
                  <span className="text-text-muted italic uppercase">
                    Demo telemetry
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
