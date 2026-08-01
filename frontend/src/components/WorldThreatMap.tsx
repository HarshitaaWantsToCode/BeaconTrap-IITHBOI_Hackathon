"use client";

import React, { useEffect, useRef, useState } from "react";

// ─── Mercator helpers (1000×520 viewbox) ─────────────────────────────────────
const W = 1000, H = 520;
function mx(lon: number) { return ((lon + 180) / 360) * W; }
function my(lat: number) { return ((90 - lat) / 180) * H; }

// ─── Simplified continent SVG paths ──────────────────────────────────────────
const CONTINENTS = [
  // North America
  "M 160,62 L 188,52 L 232,58 L 270,72 L 294,96 L 310,128 L 296,164 L 272,182 L 252,178 L 238,192 L 212,200 L 206,182 L 218,158 L 228,132 L 210,112 L 180,100 L 158,86 Z",
  // South America
  "M 234,218 L 264,212 L 292,222 L 308,254 L 312,292 L 298,334 L 282,358 L 260,352 L 244,328 L 238,294 L 232,262 L 228,238 Z",
  // Europe
  "M 478,80 L 512,72 L 548,78 L 562,98 L 558,118 L 540,124 L 516,120 L 497,128 L 482,118 L 476,102 Z",
  // Africa
  "M 490,142 L 532,136 L 566,148 L 582,176 L 588,218 L 578,262 L 558,302 L 532,322 L 510,312 L 492,282 L 486,242 L 490,192 L 486,166 Z",
  // Asia (combined Russia + Asia)
  "M 558,38 L 652,28 L 752,33 L 824,44 L 862,62 L 866,98 L 858,148 L 832,164 L 800,170 L 762,172 L 718,158 L 678,154 L 640,162 L 602,158 L 564,142 L 553,116 L 556,72 L 554,52 Z",
  // India peninsula
  "M 714,162 L 734,162 L 750,185 L 742,218 L 724,232 L 710,218 L 704,195 Z",
  // SE Asia / Indochina
  "M 780,155 L 808,148 L 820,165 L 816,188 L 800,196 L 782,182 Z",
  // Australia
  "M 832,298 L 880,286 L 922,296 L 938,322 L 924,352 L 886,362 L 854,352 L 834,326 Z",
  // Greenland
  "M 348,28 L 382,22 L 408,36 L 404,62 L 382,70 L 356,60 Z",
  // Japan
  "M 862,110 L 876,102 L 888,116 L 878,132 L 866,128 Z",
  // UK
  "M 468,84 L 478,80 L 482,96 L 472,100 Z",
];

// ─── Threat nodes ─────────────────────────────────────────────────────────────
interface ThreatLocation {
  id: string;
  label: string;
  sublabel: string;
  role: "origin" | "c2" | "victim";
  lon: number;
  lat: number;
  volume: number;       // attack volume 0-100
  confidence: number;   // 0-100
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
}

const LOCATIONS: ThreatLocation[] = [
  { id: "russia",      label: "Russia",       sublabel: "Moscow",          role: "origin",  lon: 37,   lat: 55.7, volume: 87, confidence: 94, severity: "CRITICAL" },
  { id: "netherlands", label: "Netherlands",  sublabel: "Amsterdam",       role: "c2",      lon: 4.9,  lat: 52.4, volume: 62, confidence: 88, severity: "HIGH"     },
  { id: "usa-c2",      label: "USA",          sublabel: "Bulletproof C2",  role: "c2",      lon: -77,  lat: 38.9, volume: 71, confidence: 82, severity: "HIGH"     },
  { id: "china",       label: "China",        sublabel: "Origin Infra",    role: "origin",  lon: 116,  lat: 39.9, volume: 91, confidence: 96, severity: "CRITICAL" },
  { id: "india",       label: "India",        sublabel: "Primary Target",  role: "victim",  lon: 78.9, lat: 20.6, volume: 96, confidence: 97, severity: "CRITICAL" },
  { id: "singapore",   label: "Singapore",    sublabel: "Transit Relay",   role: "c2",      lon: 103.8,lat: 1.3,  volume: 44, confidence: 78, severity: "MEDIUM"   },
];

// ─── Attack routes ────────────────────────────────────────────────────────────
interface AttackRoute {
  from: string;
  to: string;
  label: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
}

const ROUTES: AttackRoute[] = [
  { from: "russia",      to: "india",     label: "SMS Intercept Campaign", severity: "CRITICAL" },
  { from: "netherlands", to: "india",     label: "C2 Command Relay",       severity: "HIGH"     },
  { from: "usa-c2",      to: "india",     label: "Phishing Infrastructure",severity: "HIGH"     },
  { from: "china",       to: "india",     label: "Banking Trojan Payload", severity: "CRITICAL" },
  { from: "china",       to: "singapore", label: "Transit Routing",        severity: "MEDIUM"   },
  { from: "singapore",   to: "india",     label: "Relay Forward",          severity: "MEDIUM"   },
];

const SEVERITY_COLORS = {
  CRITICAL: { stroke: "var(--critical)", glow: "var(--critical-glow)", text: "var(--critical)" },
  HIGH:     { stroke: "var(--high)", glow: "rgba(249,115,22,0.3)", text: "var(--high)" },
  MEDIUM:   { stroke: "var(--medium)", glow: "rgba(234,179,8,0.3)", text: "var(--medium)" },
};

const ROLE_COLORS = {
  origin:  { fill: "var(--critical)", label: "Origin Infra",  icon: "⚠" },
  c2:      { fill: "var(--high)", label: "C2 Server",     icon: "⚡" },
  victim:  { fill: "var(--primary)", label: "Victim Region", icon: "🎯" },
};

// ─── Quadratic bezier midpoint arc helper ────────────────────────────────────
function arcPath(x1: number, y1: number, x2: number, y2: number, bulge = 0.35): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  // control point offset perpendicular to the line, scaled by bulge
  const cx = mx - dy * bulge;
  const cy = my + dx * bulge - len * 0.08;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function pathLength(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.4;
}

// ─── Minibar ─────────────────────────────────────────────────────────────────
function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WorldThreatMap() {
  const [tick, setTick] = useState(0);
  const [hoveredLoc, setHoveredLoc] = useState<ThreatLocation | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<AttackRoute | null>(null);
  const [activeEvents, setActiveEvents] = useState<string[]>([]);

  // Animation clock
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  // Randomly fire "event" alerts for blinking route highlights
  useEffect(() => {
    const id = setInterval(() => {
      const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
      const key = `${route.from}-${route.to}`;
      setActiveEvents(prev => [...prev.filter(k => k !== key), key]);
      setTimeout(() => setActiveEvents(prev => prev.filter(k => k !== key)), 1800);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const locCoords = Object.fromEntries(
    LOCATIONS.map(l => [l.id, { x: mx(l.lon), y: my(l.lat) }])
  );

  // Live stats
  const criticalCount = LOCATIONS.filter(l => l.severity === "CRITICAL").length;
  const totalVolume = LOCATIONS.reduce((a, l) => a + l.volume, 0);
  const avgConf = Math.round(LOCATIONS.reduce((a, l) => a + l.confidence, 0) / LOCATIONS.length);

  return (
    <div 
      className="w-full border rounded-2xl overflow-hidden transition-all duration-200"
      style={{ backgroundColor: "var(--map-bg)", borderColor: "var(--card-border)", boxShadow: "var(--shadow-card)" }}
    >

      {/* ── Header ── */}
      <div 
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ backgroundColor: "var(--card-bg-secondary)", borderColor: "var(--card-border)" }}
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
            Global Threat Intelligence Map
          </span>
          <span 
            className="text-[9px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ color: "var(--text-muted)", borderColor: "var(--card-border)" }}
          >
            LIVE · NODE IND LEAP-205
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: ROLE_COLORS.origin.fill, boxShadow: `0 0 6px ${ROLE_COLORS.origin.fill}` }} />
            <span className="text-[8px] font-mono uppercase" style={{ color: "var(--text-muted)" }}>Origin Infra</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: ROLE_COLORS.c2.fill, boxShadow: `0 0 6px ${ROLE_COLORS.c2.fill}` }} />
            <span className="text-[8px] font-mono uppercase" style={{ color: "var(--text-muted)" }}>C2 Server</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: ROLE_COLORS.victim.fill, boxShadow: `0 0 6px ${ROLE_COLORS.victim.fill}` }} />
            <span className="text-[8px] font-mono uppercase" style={{ color: "var(--text-muted)" }}>Victim Region</span>
          </div>
        </div>
      </div>

      {/* ── Map + Sidebar layout ── */}
      <div className="flex flex-col lg:flex-row">

        {/* Map Canvas */}
        <div className="relative flex-1 min-h-[440px]">

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(6,182,212,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.025) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-200"
            style={{ background: "var(--map-vignette)" }} />

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full"
            style={{ display: "block" }}>
            <defs>
              {/* Glow filter for arcs */}
              <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Arrowhead markers */}
              {(["CRITICAL","HIGH","MEDIUM"] as const).map(sev => (
                <marker key={sev} id={`arrow-${sev}`}
                  markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 Z" fill={SEVERITY_COLORS[sev].stroke} opacity="0.9" />
                </marker>
              ))}
              {/* Animated pulse for victims */}
              <radialGradient id="victim-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ── Continents ── */}
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d}
                fill="var(--map-continent-fill)"
                stroke="var(--map-continent-stroke)"
                strokeWidth="0.8"
                className="transition-all duration-200"
              />
            ))}

            {/* ── Latitude / Longitude graticule lines ── */}
            {[-60,-30,0,30,60].map(lat => (
              <line key={`lat${lat}`}
                x1={0} y1={my(lat)} x2={W} y2={my(lat)}
                stroke="var(--map-grid-line)" strokeWidth="0.5" strokeDasharray="4 8" className="transition-all duration-200" />
            ))}
            {[-120,-60,0,60,120].map(lon => (
              <line key={`lon${lon}`}
                x1={mx(lon)} y1={0} x2={mx(lon)} y2={H}
                stroke="var(--map-grid-line)" strokeWidth="0.5" strokeDasharray="4 8" className="transition-all duration-200" />
            ))}

            {/* ── Attack arcs ── */}
            {ROUTES.map((route) => {
              const src = locCoords[route.from];
              const dst = locCoords[route.to];
              if (!src || !dst) return null;

              const sc = SEVERITY_COLORS[route.severity];
              const key = `${route.from}-${route.to}`;
              const isActive = activeEvents.includes(key);
              const isHov = hoveredRoute?.from === route.from && hoveredRoute?.to === route.to;
              const pLen = pathLength(src.x, src.y, dst.x, dst.y);
              // animated dash offset cycling
              const dashLen = 20, gapLen = pLen - dashLen;
              const offset = -((tick * 2.5) % pLen);

              const d = arcPath(src.x, src.y, dst.x, dst.y);

              return (
                <g key={key} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredRoute(route)}
                  onMouseLeave={() => setHoveredRoute(null)}>
                  {/* Glow backing */}
                  <path d={d} fill="none"
                    stroke={sc.stroke} strokeWidth={isActive || isHov ? 6 : 3}
                    strokeOpacity={isActive ? 0.35 : isHov ? 0.25 : 0.1}
                    filter="url(#arc-glow)" />
                  {/* Animated dash */}
                  <path d={d} fill="none"
                    stroke={sc.stroke}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeOpacity={isActive ? 1 : isHov ? 0.85 : 0.55}
                    strokeDasharray={`${dashLen} ${gapLen}`}
                    strokeDashoffset={offset}
                    markerEnd={`url(#arrow-${route.severity})`}
                  />
                  {/* Pulse dot at src on active */}
                  {isActive && (
                    <circle cx={src.x} cy={src.y} r={6}
                      fill={sc.stroke} opacity={0.8}
                      filter="url(#arc-glow)" />
                  )}
                </g>
              );
            })}

            {/* ── Victim region pulse rings ── */}
            {LOCATIONS.filter(l => l.role === "victim").map(l => {
              const c = locCoords[l.id];
              const pulseR = 28 + (tick % 40) * 0.7;
              return (
                <circle key={`pulse-${l.id}`}
                  cx={c.x} cy={c.y} r={pulseR}
                  fill="url(#victim-glow)"
                  opacity={1 - (tick % 40) / 40}
                />
              );
            })}

            {/* ── Threat nodes ── */}
            {LOCATIONS.map(loc => {
              const c = locCoords[loc.id];
              const rc = ROLE_COLORS[loc.role];
              const sc = SEVERITY_COLORS[loc.severity];
              const isHov = hoveredLoc?.id === loc.id;
              const r = loc.role === "victim" ? 10 : 7;
              // blinking frequency for origin/c2
              const blink = loc.role !== "victim" && (tick % 30) < 8;

              return (
                <g key={loc.id} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredLoc(loc)}
                  onMouseLeave={() => setHoveredLoc(null)}>
                  {/* Outer ring */}
                  {isHov && (
                    <circle cx={c.x} cy={c.y} r={r + 14}
                      fill="none" stroke={rc.fill}
                      strokeWidth="1" strokeOpacity="0.4"
                      strokeDasharray="3 4" />
                  )}
                  {/* Glow backing */}
                  <circle cx={c.x} cy={c.y} r={r + 4}
                     fill={rc.fill} opacity={blink ? 0.25 : isHov ? 0.2 : 0.1}
                    filter="url(#node-glow)" />
                  {/* Node body */}
                  <circle cx={c.x} cy={c.y} r={r}
                    fill="var(--map-bg)" stroke={rc.fill}
                    strokeWidth={isHov ? 2.5 : 1.8}
                    filter={isHov ? "url(#node-glow)" : undefined}
                    opacity={blink ? 1 : 0.85}
                    className="transition-all duration-200"
                  />
                  {/* Inner dot */}
                  <circle cx={c.x} cy={c.y} r={r * 0.4}
                    fill={rc.fill} opacity={blink ? 1 : 0.7} />
                  {/* Label */}
                  <text x={c.x} y={c.y + r + 11}
                    textAnchor="middle"
                    fill={rc.fill} fontSize="7.5" fontFamily="monospace" fontWeight="bold"
                    style={{ userSelect: "none" }}>
                    {loc.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip for hovered location */}
          {hoveredLoc && (() => {
            const c = locCoords[hoveredLoc.id];
            const rc = ROLE_COLORS[hoveredLoc.role];
            const sc = SEVERITY_COLORS[hoveredLoc.severity];
            // rough screen position
            const px = (c.x / W) * 100;
            const py = (c.y / H) * 100;
            return (
              <div className="absolute z-30 pointer-events-none w-48 rounded-xl border p-3 space-y-2"
                style={{
                  left: `${Math.min(px, 70)}%`,
                  top: `${Math.min(py + 4, 75)}%`,
                  borderColor: rc.fill + "55",
                  background: "var(--card)",
                  boxShadow: `0 4px 20px rgba(124,58,237,.12)`,
                }}>
                <div className="flex items-center justify-between border-b pb-1.5"
                  style={{ borderColor: "var(--card-border)" }}>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest"
                    style={{ color: rc.fill }}>{rc.label}</span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase"
                    style={{ color: sc.text, borderColor: sc.stroke + "50", background: sc.stroke + "15" }}>
                    {hoveredLoc.severity}
                  </span>
                </div>
                <div className="space-y-1.5 text-[9px] font-mono" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location</span>
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{hoveredLoc.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Node</span>
                    <span>{hoveredLoc.sublabel}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500">Volume</span>
                    <Bar value={hoveredLoc.volume} color={rc.fill} />
                    <span style={{ color: rc.fill }} className="font-bold">{hoveredLoc.volume}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500">Conf.</span>
                    <Bar value={hoveredLoc.confidence} color={sc.stroke} />
                    <span style={{ color: sc.stroke }} className="font-bold">{hoveredLoc.confidence}%</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Tooltip for hovered route */}
          {hoveredRoute && !hoveredLoc && (() => {
            const sc = SEVERITY_COLORS[hoveredRoute.severity];
            return (
              <div className="absolute bottom-4 left-4 z-30 pointer-events-none rounded-lg border px-3 py-2 text-[9px] font-mono"
                style={{ borderColor: "var(--card-border)", background: "var(--card)", boxShadow: `0 4px 20px rgba(124,58,237,.12)` }}>
                <span style={{ color: sc.stroke }} className="font-bold uppercase">{hoveredRoute.severity}</span>
                <span className="text-slate-400 mx-2">·</span>
                <span style={{ color: "var(--text-primary)" }}>{hoveredRoute.label}</span>
              </div>
            );
          })()}
        </div>

        {/* ── Side panel ── */}
        <div 
          className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l flex flex-col shrink-0 transition-all duration-200"
          style={{ backgroundColor: "var(--map-side-bg)", borderColor: "var(--map-side-border)" }}
        >

          {/* Live KPIs */}
          <div className="p-4 border-b space-y-3" style={{ borderColor: "var(--map-side-border)" }}>
            <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Global Threat Status</div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg p-2 text-center border" style={{ backgroundColor: "var(--map-cell-bg)", borderColor: "var(--map-cell-border)" }}>
                <div className="text-[var(--critical-color)] text-lg font-black font-mono">{criticalCount}</div>
                <div className="text-[8px] font-mono uppercase font-bold" style={{ color: "var(--text-muted)" }}>Critical</div>
              </div>
              <div className="rounded-lg p-2 text-center border" style={{ backgroundColor: "var(--map-cell-bg)", borderColor: "var(--map-cell-border)" }}>
                <div className="text-[var(--high-color)] text-lg font-black font-mono">{ROUTES.length}</div>
                <div className="text-[8px] font-mono uppercase font-bold" style={{ color: "var(--text-muted)" }}>Routes</div>
              </div>
              <div className="rounded-lg p-2 text-center border" style={{ backgroundColor: "var(--map-cell-bg)", borderColor: "var(--map-cell-border)" }}>
                <div className="text-[var(--primary)] text-lg font-black font-mono">{avgConf}%</div>
                <div className="text-[8px] font-mono uppercase font-bold" style={{ color: "var(--text-muted)" }}>Conf.</div>
              </div>
            </div>
          </div>

          {/* Threat node list */}
          <div className="p-3 border-b space-y-2" style={{ borderColor: "var(--map-side-border)" }}>
            <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Node Directory</div>
            {LOCATIONS.map(loc => {
              const rc = ROLE_COLORS[loc.role];
              const sc = SEVERITY_COLORS[loc.severity];
              const blink = (tick % 30) < 8;
              return (
                <div key={loc.id}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 border cursor-pointer transition-colors"
                  style={{ backgroundColor: "var(--map-cell-bg)", borderColor: "var(--map-cell-border)" }}
                  onMouseEnter={() => setHoveredLoc(loc)}
                  onMouseLeave={() => setHoveredLoc(null)}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: rc.fill, boxShadow: (loc.role !== "victim" && blink) ? `0 0 6px ${rc.fill}` : "none" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-mono font-semibold truncate" style={{ color: "var(--text-primary)" }}>{loc.label}</div>
                    <div className="text-[8px] font-mono truncate" style={{ color: "var(--text-muted)" }}>{loc.sublabel}</div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[8px] font-mono font-bold" style={{ color: sc.text }}>{loc.severity}</span>
                    <span className="text-[7px] font-mono" style={{ color: "var(--text-muted)" }}>VOL {loc.volume}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active attack routes */}
          <div className="p-3 flex-1 overflow-auto space-y-2">
            <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Active Campaigns</div>
            {ROUTES.map((route, i) => {
              const sc = SEVERITY_COLORS[route.severity];
              const key = `${route.from}-${route.to}`;
              const isActive = activeEvents.includes(key);
              return (
                <div key={i}
                  className="rounded-lg px-2.5 py-1.5 border transition-all duration-200"
                  style={{
                    borderColor: isActive ? sc.stroke + "60" : "var(--map-cell-border)",
                    background: isActive ? sc.stroke + "0d" : "var(--map-cell-bg)",
                    boxShadow: isActive ? `0 0 10px ${sc.glow}` : "none",
                  }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {isActive && <span className="w-1 h-1 rounded-full animate-ping" style={{ background: sc.stroke }} />}
                    <span className="text-[8px] font-mono font-bold uppercase" style={{ color: sc.text }}>
                      {route.severity}
                    </span>
                  </div>
                  <div className="text-[8px] font-mono leading-tight" style={{ color: "var(--text-secondary)" }}>{route.label}</div>
                  <div className="text-[7px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {route.from.toUpperCase()} → {route.to.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t" style={{ borderColor: "var(--map-side-border)" }}>
            <div className="text-[8px] font-mono text-center uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              BeaconTrap · Global Intel Layer · Live
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
