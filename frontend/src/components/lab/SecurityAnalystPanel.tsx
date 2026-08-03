import React, { useMemo } from "react";
import { Cpu, AlertTriangle, ShieldCheck, Lock, Eye, PhoneCall, Smartphone, Key, Info } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PermissionCategory {
  title: string;
  count: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: any;
  items: Array<{ name: string; impact: string }>;
}

export default function SecurityAnalystPanel() {
  const { caseData } = useAnalysis();

  if (!caseData) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO CASE DATA LOADED FOR SECURITY ANALYST PANEL
      </div>
    );
  }

  // Safe parse
  const permissions: string[] = useMemo(() => {
    try {
      return JSON.parse(caseData.permissions || "[]");
    } catch {
      return [];
    }
  }, [caseData.permissions]);

  const activities: string[] = useMemo(() => {
    try {
      return JSON.parse(caseData.activities || "[]");
    } catch {
      return [];
    }
  }, [caseData.activities]);

  const services: string[] = useMemo(() => {
    try {
      return JSON.parse(caseData.services || "[]");
    } catch {
      return [];
    }
  }, [caseData.services]);

  const mitreTags: { id: string; name: string }[] = useMemo(() => {
    try {
      return JSON.parse(caseData.mitreTags || "[]");
    } catch {
      return [];
    }
  }, [caseData.mitreTags]);

  const threatNarrative = useMemo(() => {
    try {
      return caseData.threatNarrative ? JSON.parse(caseData.threatNarrative) : {};
    } catch {
      return {};
    }
  }, [caseData.threatNarrative]);

  // Categorize permissions into threat buckets with clear human explanation
  const categories = useMemo(() => {
    const buckets: Record<string, { name: string; impact: string }[]> = {
      sms_otp: [],
      accessibility: [],
      overlay_system: [],
      contacts_privacy: [],
      other: []
    };

    permissions.forEach((perm) => {
      const pUpper = perm.toUpperCase();
      if (pUpper.includes("SMS") || pUpper.includes("RECEIVE_MMS") || pUpper.includes("READ_SMS")) {
        buckets.sms_otp.push({
          name: perm,
          impact: "Intercepts SMS messages containing 2FA OTP codes to automate unauthorized bank transfers."
        });
      } else if (pUpper.includes("ACCESSIBILITY") || pUpper.includes("BIND_ACCESSIBILITY")) {
        buckets.accessibility.push({
          name: perm,
          impact: "Grants full device control, recording user keystrokes & auto-clicking banking approvals."
        });
      } else if (pUpper.includes("SYSTEM_ALERT_WINDOW") || pUpper.includes("OVERLAY") || pUpper.includes("DRAW")) {
        buckets.overlay_system.push({
          name: perm,
          impact: "Displays fake banking login screen overlays on top of legitimate apps to steal PINs."
        });
      } else if (pUpper.includes("CONTACTS") || pUpper.includes("LOCATION") || pUpper.includes("CALL_LOG") || pUpper.includes("RECORD_AUDIO")) {
        buckets.contacts_privacy.push({
          name: perm,
          impact: "Exfiltrates personal contact lists and sensitive device telemetry to remote C2 servers."
        });
      } else {
        buckets.other.push({
          name: perm,
          impact: "Standard or secondary Android application permission requirement."
        });
      }
    });

    const result: PermissionCategory[] = [
      {
        title: "SMS & OTP Interception",
        count: buckets.sms_otp.length,
        color: "#f43f5e", // rose-500
        badgeBg: "bg-rose-500/10",
        badgeBorder: "border-rose-500/30",
        badgeText: "text-rose-400",
        icon: Key,
        items: buckets.sms_otp
      },
      {
        title: "Accessibility Keylogging Abuse",
        count: buckets.accessibility.length,
        color: "#ec4899", // pink-500
        badgeBg: "bg-pink-500/10",
        badgeBorder: "border-pink-500/30",
        badgeText: "text-pink-400",
        icon: Eye,
        items: buckets.accessibility
      },
      {
        title: "Screen Overlay & Hijack",
        count: buckets.overlay_system.length,
        color: "#f59e0b", // amber-500
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
        badgeText: "text-amber-400",
        icon: Smartphone,
        items: buckets.overlay_system
      },
      {
        title: "Privacy & Data Exfiltration",
        count: buckets.contacts_privacy.length,
        color: "#06b6d4", // cyan-500
        badgeBg: "bg-cyan-500/10",
        badgeBorder: "border-cyan-500/30",
        badgeText: "text-cyan-400",
        icon: PhoneCall,
        items: buckets.contacts_privacy
      },
      {
        title: "Standard Operational Permissions",
        count: buckets.other.length,
        color: "#64748b", // slate-500
        badgeBg: "bg-slate-500/10",
        badgeBorder: "border-slate-500/30",
        badgeText: "text-slate-400",
        icon: Info,
        items: buckets.other
      }
    ];

    return result;
  }, [permissions]);

  // Chart data
  const pieData = useMemo(() => {
    return categories
      .filter((cat) => cat.count > 0)
      .map((cat) => ({
        name: cat.title,
        value: cat.count,
        color: cat.color
      }));
  }, [categories]);

  const highRiskCount = permissions.filter((p) => {
    const u = p.toUpperCase();
    return u.includes("SMS") || u.includes("ACCESSIBILITY") || u.includes("OVERLAY") || u.includes("SYSTEM_ALERT_WINDOW");
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
            Security Analyst Forensics & Threat Visualizer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold">
            {highRiskCount} HIGH RISK PERMISSIONS DETECTED
          </span>
        </div>
      </div>

      {/* Visual Analytics Row: Chart + Breakdown Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permission Threat Distribution Pie Chart */}
        <div className="bg-card-secondary border border-card-border p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest mb-1">
              Permission Risk Breakdown Chart
            </h4>
            <p className="text-[11px] text-text-secondary font-mono mb-4">
              Visual proportion of critical banking exploit vectors vs standard app permissions.
            </p>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#f8fafc"
                    }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-[10px] font-mono text-text-secondary">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                <span className="text-2xl font-extrabold font-mono text-text-primary">{permissions.length}</span>
                <span className="text-[9px] font-mono text-text-muted uppercase">Permissions</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-text-muted">
              No permission data available to map visually.
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-card-border flex justify-between text-[11px] font-mono text-text-secondary">
            <span>High Severity Threat Vector:</span>
            <span className="font-bold text-rose-400">
              {permissions.some(p => p.includes("BIND_ACCESSIBILITY_SERVICE")) ? "ACCESSIBILITY ABUSE" : "SMS INTERCEPTION"}
            </span>
          </div>
        </div>

        {/* Component Telemetry Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
            Categorized Permission Risk Analysis & Exploit Vectors
          </h4>

          {/* Cards for each category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 transition-all ${
                    cat.count > 0 ? "bg-card-secondary border-card-border" : "bg-card/40 border-card-border/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${cat.badgeBg} ${cat.badgeText}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-text-primary font-mono">{cat.title}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${cat.badgeBg} ${cat.badgeBorder} ${cat.badgeText}`}>
                      {cat.count} Requested
                    </span>
                  </div>

                  {cat.count > 0 ? (
                    <div className="space-y-2 mt-3">
                      {cat.items.map((item, iIdx) => (
                        <div key={iIdx} className="p-2.5 rounded-lg bg-card border border-card-border space-y-1">
                          <div className="text-[11px] font-mono font-bold text-text-primary truncate flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[9px] text-rose-400 font-mono">DANGER</span>
                          </div>
                          <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
                            💡 <span className="font-semibold text-text-muted font-mono">Impact:</span> {item.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-mono text-text-muted italic pt-2">
                      No permissions requested matching this vector.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Component Registry & MITRE ATT&CK Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="bg-card-secondary border border-card-border p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
              Registered App Services ({services.length})
            </span>
            <span className="text-[10px] font-mono text-primary font-bold">BACKGROUND DAEMONS</span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {services.length > 0 ? (
              services.map((s, idx) => (
                <div key={idx} className="p-2 bg-card border border-card-border rounded flex items-center gap-2 text-text-secondary truncate">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="truncate">{s}</span>
                </div>
              ))
            ) : (
              <span className="text-text-muted text-xs italic">No background services detected.</span>
            )}
          </div>
        </div>

        <div className="bg-card-secondary border border-card-border p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest">
              UI Activities & Entrypoints ({activities.length})
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">EXPOSURE SURFACES</span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={idx} className="p-2 bg-card border border-card-border rounded flex items-center gap-2 text-text-secondary truncate">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">{act}</span>
                </div>
              ))
            ) : (
              <span className="text-text-muted text-xs italic">No activities registered.</span>
            )}
          </div>
        </div>

        <div className="bg-card-secondary border border-card-border p-4 rounded-xl space-y-3">
          <span className="text-xs font-bold uppercase text-text-muted font-mono tracking-widest block">
            MITRE ATT&CK Mobile Technique Mapping
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {mitreTags.length > 0 ? (
              mitreTags.map((tag) => (
                <div key={tag.id} className="p-2 bg-rose-500/10 border border-rose-500/25 rounded-lg flex flex-col gap-0.5 w-full">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">{tag.id}</span>
                  <span className="text-[11px] font-mono text-text-primary font-semibold">{tag.name}</span>
                </div>
              ))
            ) : (
              <span className="text-text-muted text-xs italic">No matching techniques mapped.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
