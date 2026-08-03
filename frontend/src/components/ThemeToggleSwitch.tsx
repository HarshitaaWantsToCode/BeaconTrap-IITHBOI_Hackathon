import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggleSwitch: React.FC = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    } else {
      setIsLight(false);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsLight(false);
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-300 cursor-pointer focus:outline-none border ${
        isLight
          ? "bg-slate-100 border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.35)]"
          : "bg-slate-900 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
      }`}
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <span className="sr-only">Toggle Dark/Light Mode</span>
      
      {/* Sliding Knob */}
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 transform shadow-md ${
          isLight
            ? "translate-x-8 bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950"
            : "translate-x-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950"
        }`}
      >
        {isLight ? (
          <Sun className="h-3.5 w-3.5 fill-current text-slate-950 animate-spin-slow" />
        ) : (
          <Moon className="h-3.5 w-3.5 fill-current text-slate-950" />
        )}
      </span>
    </button>

  );
};
