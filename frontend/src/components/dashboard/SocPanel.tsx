"use client";

import React from "react";
import { motion } from "framer-motion";

interface SocPanelProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

export default function SocPanel({
  title,
  subtitle,
  badge,
  badgeColor = "text-[var(--primary)] bg-[var(--primary-glow)] border-[var(--primary-glow)]",
  children,
  className = "",
  headerRight,
  noPadding = false,
}: SocPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card border rounded-[var(--radius-card)] backdrop-blur-md overflow-hidden ${className}`}
      style={{ 
        borderColor: "var(--card-border)",
        boxShadow: "var(--shadow-card)"
      }}
    >
      <div 
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ 
          backgroundColor: "var(--card-bg-secondary)",
          borderColor: "var(--card-border)"
        }}
      >
        <div className="flex items-center gap-3">
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: "var(--card-dot-color)",
              boxShadow: "0 0 6px var(--card-dot-color)"
            }}
          />
          <div>
            <h3 
              className="text-xs font-bold uppercase tracking-widest font-mono"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p 
                className="text-[9px] font-mono mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className={`text-[8px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${badgeColor}`} style={{ borderColor: "var(--primary-glow)" }}>
              {badge}
            </span>
          )}
        </div>
        {headerRight}
      </div>
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </motion.div>
  );
}
