"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SocPanel from "./SocPanel";
import { CorrelationFlowNode, CorrelationFlowEdge } from "@/types/dashboard";

interface ThreatCorrelationFlowProps {
  nodes: CorrelationFlowNode[];
  edges: CorrelationFlowEdge[];
}

const NODE_COLORS: Record<CorrelationFlowNode["type"], { border: string; bg: string; text: string }> = {
  apk: { border: "var(--node-center-stroke)", bg: "var(--node-center-fill)", text: "var(--node-center-stroke)" },
  domain: { border: "var(--node-domain-stroke)", bg: "var(--node-domain-fill)", text: "var(--node-domain-stroke)" },
  ip: { border: "var(--node-ip-stroke)", bg: "var(--node-ip-fill)", text: "var(--node-ip-stroke)" },
  family: { border: "var(--node-family-stroke)", bg: "var(--node-family-fill)", text: "var(--node-family-stroke)" },
  mitre: { border: "var(--node-mitre-stroke)", bg: "var(--node-mitre-fill)", text: "var(--node-mitre-stroke)" },
  campaign: { border: "var(--node-sample-stroke)", bg: "var(--node-sample-fill)", text: "var(--node-sample-stroke)" },
};

function IntelNode({ data }: { data: { label: string; sublabel?: string; type: CorrelationFlowNode["type"]; risk: number } }) {
  const colors = NODE_COLORS[data.type] ?? NODE_COLORS.apk;

  return (
    <div
      className="rounded-xl border-2 px-3 py-2 min-w-[120px] max-w-[160px] shadow-lg transition-colors duration-200"
      style={{
        borderColor: colors.border,
        background: colors.bg,
        boxShadow: `0 0 20px ${colors.border}33`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-[var(--card-border)] !w-2 !h-2 !border-0" />
      <div className="text-[8px] font-mono uppercase tracking-widest text-text-muted mb-0.5">
        {data.type.replace("_", " ")}
      </div>
      <div className="text-[10px] font-mono font-bold truncate" style={{ color: colors.text }}>
        {data.label}
      </div>
      {data.sublabel && (
        <div className="text-[8px] font-mono text-text-muted truncate">{data.sublabel}</div>
      )}
      <div className="text-[8px] font-mono mt-1" style={{ color: colors.text }}>
        Risk: {data.risk}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[var(--card-border)] !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { intel: IntelNode };

export default function ThreatCorrelationFlow({ nodes: rawNodes, edges: rawEdges }: ThreatCorrelationFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const radius = 180;
    const others = rawNodes.slice(1);

    const flowNodes: Node[] = rawNodes.map((n, i) => {
      let x = 250;
      let y = 200;

      if (i > 0) {
        const angle = ((i - 1) / Math.max(others.length, 1)) * 2 * Math.PI - Math.PI / 2;
        x = 250 + radius * Math.cos(angle);
        y = 200 + radius * Math.sin(angle);
      }

      return {
        id: n.id,
        type: "intel",
        position: { x, y },
        data: { label: n.label, sublabel: n.sublabel, type: n.type, risk: n.risk },
      };
    });

    const flowEdges: Edge[] = rawEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: "var(--primary)", strokeWidth: 1.5 },
      labelStyle: { fill: "var(--text-muted)", fontSize: 8, fontFamily: "monospace" },
      labelBgStyle: { fill: "var(--card)", fillOpacity: 0.85 },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [rawNodes, rawEdges]);

  return (
    <SocPanel
      title="Threat Correlation Graph"
      subtitle="IBM X-Force · Campaign infrastructure linkage"
      badge="CORRELATION ENGINE"
      noPadding
    >
      <div className="h-[380px] transition-colors duration-200" style={{ backgroundColor: "var(--graph-bg)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={1.8}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--reactflow-dot-color)" />
          <Controls className="!bg-card/85 !border-card-border !rounded-lg [&>button]:!bg-card [&>button]:!border-card-border [&>button]:!text-text-secondary [&>button:hover]:!text-primary transition-all duration-200" />
          <MiniMap
            nodeColor={(n) => NODE_COLORS[(n.data as { type: CorrelationFlowNode["type"] }).type]?.border ?? "var(--text-muted)"}
            maskColor="rgba(2, 6, 23, 0.7)"
            bgColor="rgba(11, 17, 30, 0.9)"
            className="!border-card-border !rounded-lg transition-all duration-200"
          />
        </ReactFlow>
      </div>
    </SocPanel>
  );
}
