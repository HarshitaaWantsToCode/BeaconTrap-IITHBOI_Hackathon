"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/50 dark:text-slate-300 dark:hover:text-slate-100 light:border-[#E5E1FF] light:bg-[#FFFFFF] light:hover:bg-[#FAF9FF] light:text-[#4B4869] light:hover:text-[#1E1B2E] transition-all cursor-pointer font-mono text-[10px] tracking-wider font-bold shadow-sm"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card)",
        color: "var(--text-secondary)",
      }}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-3.5 h-3.5 text-cyan-400" />
          <span>LIGHT MODE</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span>DARK MODE</span>
        </>
      )}
    </button>
  );
}
