import React from "react";
import { Clock } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";

export default function TimelinePanel() {
  const { timeline } = useAnalysis();

  if (!timeline) {
    return (
      <div className="text-center py-10 text-xs font-mono text-text-muted">
        NO TIMELINE DATA LOADED
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
          Malware Sandbox Event Timeline
        </h3>
      </div>

      <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-card-border">
        {timeline.map((evt) => (
          <div key={evt.id} className="relative space-y-1.5">
            <div className="absolute -left-[22px] top-1 h-3.5 w-3.5 rounded-full border border-card-border bg-card flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary font-mono">{evt.event}</span>
              <span className="text-[10px] text-text-muted font-mono">
                {new Date(evt.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-text-secondary font-mono leading-relaxed pl-1">
              {evt.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
