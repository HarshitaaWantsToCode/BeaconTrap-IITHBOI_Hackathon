# BeaconTrap - Feature Directory and Tech Stack Map

This document lists all active features of the **BeaconTrap SOC Dashboard** & APK Analysis Sandbox, including the technology stack, tools, and the exact files responsible for rendering or processing each feature. This file will be dynamically updated as new features are integrated.

---

## 🛠️ Technology Stack & Tools

### Frontend
* **Core Framework**: React 19, Vite, TypeScript
* **Styling**: TailwindCSS, Vanilla CSS, PostCSS
* **State & Data Fetching**: TanStack React-Query (`@tanstack/react-query`), Context API
* **Data Visualization**: Recharts (charts), React Flow / xyflow (`@xyflow/react` for interactive correlation graphs)
* **Animation**: Framer Motion (`framer-motion`)
* **Icons**: Lucide React (`lucide-react`)

### Backend
* **Core Framework**: Python, FastAPI
* **Database & ORM**: SQLite (development/default) / PostgreSQL, SQLAlchemy ORM
* **Graph Database**: Neo4j (for Campaign DNA analysis)
* **Blockchain Integration**: Web3.py, Solidity (for Evidence Anchoring)
* **Task Queues & Brokers**: Redis, RabbitMQ (pika)
* **Storage**: MinIO (S3 compatible storage for APK files and analysis artifacts)
* **Analysis Libraries**: Androguard (APK extraction and analysis), Semgrep, Jadx, Frida (dynamic instrumentation)
* **AI Orchestration**: LangGraph (for multi-agent DAG), Groq, Google Generative AI, Ollama

---

## 📋 Feature-to-File Mapping

### 1. Security Operations Center (SOC) Command Center Dashboard
* **Goal**: Provides real-time visibility into active threats, campaign activities, and malware metrics.
* **Key Components & Files**:
  * **Main Entry Point**: [App.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/App.tsx) (controls the tab switching and high-level layout).
  * **Dashboard Layout**: [SocCommandCenter.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/dashboard/SocCommandCenter.tsx) (coordinates the dashboard grids and panels, hosting the `dashboardLens` filter pills: "All Analytics", "Global Intel Map", and "Tactical Matrices" to reduce scrolling latency).
  * **Key Metrics Strip**: [SocMetricsStrip.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/dashboard/SocMetricsStrip.tsx) (displays total cases, critical threats, exposure levels).
  * **Interactive Threat Correlation Graph**: [ThreatCorrelationGraph.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/ThreatCorrelationGraph.tsx) & [ThreatCorrelationFlow.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/dashboard/ThreatCorrelationFlow.tsx) (uses `@xyflow/react` to map indicators of compromise (IOCs) to APK files and campaigns).
  * **MITRE ATT&CK Heatmap**: [MitreHeatmap.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/dashboard/MitreHeatmap.tsx) (visualizes tactics such as Credential Access, Defense Evasion, and Privilege Escalation).
  * **Live Threat Feed**: [LiveThreatFeed.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/LiveThreatFeed.tsx) (displays real-time threat detection alerts).
  * **Geographical Mapping**: [WorldThreatMap.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/WorldThreatMap.tsx) (renders global threat heat sources).
  * **Risk Intelligence Wheel**: [RiskIntelligenceWheel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/RiskIntelligenceWheel.tsx) (visualizes confidence levels and dimensions of threats).

### 2. APK Submission & Sandbox Orchestration
* **Goal**: Allows security analysts to upload APKs for decompilation, permission mapping, static analysis, and dynamic environment emulations.
* **Key Files**:
  * **Upload Component**: [App.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/App.tsx) (renders the upload drag-and-drop area and handles initial file selection).
  * **APK Validator**: [apk_validator.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/services/apk_validator.py) (validates file structure and MIME types).
  * **Sandbox Orchestration Queue**: [queue.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/core/queue.py) (manages async task queues via Redis/RabbitMQ).
  * **Backend Upload Routes**: [uploads.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/api/v1/uploads.py) (handles file ingestion and MinIO storage).

### 3. Threat Analysis Pipeline (Static & Dynamic)
* **Goal**: Extract permissions, code signatures, decompiled sources, and monitor behavior.
* **Key Files**:
  * **Manifest Parser**: [manifest_parser.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/services/manifest_parser.py) (reads `AndroidManifest.xml`).
  * **JADX Decompiler**: [jadx_service.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/services/jadx_service.py) (coordinates source code decompilation).
  * **Static Rule Matcher**: [semgrep_service.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/services/semgrep_service.py) (scans sources using Semgrep).
  * **Static Worker**: [main.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/workers/static_worker/main.py) (asynchronously processes static analysis tasks).
  * **Dynamic Worker**: [main.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/workers/dynamic_worker/main.py) (emulates malware execution, intercepts API calls).
  * **Frida Instrumentation**: [frida_service.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/services/frida_service.py) (hooks Android APIs for tracing dynamic behaviors).
  * **Real SMS Hook**: [sms_hooks.js](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/workers/dynamic_worker/hooks/sms_hooks.js) (genuine dynamic hook for intercepting `sendTextMessage` calls).

### 4. AI Copilot & Automated Intelligence Briefings
* **Goal**: Synthesizes complex sandbox logs and outputs summary briefings, answering analyst queries interactively.
* **Key Files**:
  * **Copilot Interactive Panel**: [AICopilot.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/copilot/AICopilot.tsx), [ChatPanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/copilot/ChatPanel.tsx), and [ChatMessage.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/copilot/ChatMessage.tsx).
  * **Intelligence Briefing Panel**: [AiIntelligenceBriefing.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/AiIntelligenceBriefing.tsx).
  * **AI Endpoint Routes**: [ai.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/api/v1/ai.py) (retrieves AI narrative results directly from MinIO artifacts, falling back to database query logs).
  * **LangGraph Multi-Agent Orchestrator**: [graph.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/genai/graph.py) (defines a real directed acyclic graph for sequential and parallel AI processing using nodes for De-Obfuscation, MITRE Mapping, Network Intel, GRC Compliance, Risk Scoring, and Report Generation).

### 5. Risk Assessment Engine
* **Goal**: Computes risk scores and yields actionable recommendations based on static/dynamic findings.
* **Key Files**:
  * **Engine Logic**: [engine.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/risk_engine/engine.py).
  * **Weight Configurations**: [weights.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/risk_engine/weights.py).
  * **Confidence Estimator**: [confidence.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/risk_engine/confidence.py).
  * **Recommendations Builder**: [recommendations.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/risk_engine/recommendations.py).

### 6. Case & Incident Management
* **Goal**: Supports full lifecycle tracking, auditing, and report printing for security incidents.
* **Key Files**:
  * **Case Details Workspace**: [CaseDetailsClient.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/CaseDetailsClient.tsx).
  * **Executive Report PDF/HTML Generation**: [builder.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/report_engine/builder.py), [pdf.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/report_engine/pdf.py), and [ExecutiveReportPrintView.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/ExecutiveReportPrintView.tsx) (holds the formal 15-page print dossier template compiled by the CISO audit actions).
  * **Export Audit Dossier Button**: Mounted in [App.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/App.tsx) header (triggers `window.print()` to output this print view).
  * **Case Models**: [models.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/models/models.py).
  * **Case Database Access**: [case_repo.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/repositories/case_repo.py).
  * **RBAC Role Enforcement**: [security.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/core/security.py) (server-side JWT validation strictly gating Analyst vs. Officer endpoints).

### 7. Global State & Selection Routing (Context Brokers)
* **Goal**: Manages the selection lifecycle of the inspected APK cases, active tabs, analyst/officer personas, and language properties. Provides a static fallback dataset (92/100 banking trojan metrics) for offline operational UI stability.
* **Key Files**:
  * **Primary State Broker**: [AnalysisContext.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/context/AnalysisContext.tsx) (provides current case selection, loading states, offline telemetry, and the `appendNewCase(filePayload)` updater that increments cases analyzed and streams immediate threat notifications).

### 8. Segmented View Architecture & Routing
* **Goal**: Drop the monolithic grid scrolling templates in favor of a clean three-view switch (`DASHBOARD`, `UPLOAD`, and `ANALYSIS_LAB`) controlled by a dedicated sidebar.
* **Key Files**:
  * **Main App Entry & Router**: [App.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/App.tsx) (handles active string tracker state `activeView` and conditions view rendering).
  * **Sidebar Navigation**: [SidebarNav.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/layout/SidebarNav.tsx) (triggers view modification on click).
  * **Analysis Lab Horizontal Workspace Deck**: Embedded inside [App.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/App.tsx) (switches sub-panels for Security Analyst, Bank Officer, Citizen Impact, Campaign DNA, Timeline, and Evidence Ledger).
  * **Security Analyst Panel**: [SecurityAnalystPanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/lab/SecurityAnalystPanel.tsx) (maps permissions, activities, background services, and forensic descriptions).
  * **GRC Compliance Panel**: [GrcCompliancePanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/lab/GrcCompliancePanel.tsx) (visualizes RBI regulatory compliance violations, DPDP Act obligations, IT act, and CISO risk index).
  * **Citizen Impact Panel**: [CitizenImpactPanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/lab/CitizenImpactPanel.tsx) (renders population exposure profiles and dynamic multilingual translation selections).
  * **Campaign DNA Panel**: [CampaignDnaPanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/lab/CampaignDnaPanel.tsx) (maps React Flow campaign indicator graph nodes, backed by real Neo4j Cypher queries).
  * **Timeline Panel**: [TimelinePanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/lab/TimelinePanel.tsx) (draws sequential analysis execution events).
  * **Evidence Ledger Panel**: [BlockchainEvidencePanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K S Harshitaa/Projects/BeaconTrap- IITH BOI/frontend/src/components/lab/BlockchainEvidencePanel.tsx) (presents cryptographic blockchain anchoring details, connected to real Web3 smart contracts on Sepolia).

### 9. Token Optimization & Architecture
* **Goal**: Minimize LLM API token consumption for free-tier compatibility by compressing payloads deterministically and using a single unified batch generation schema.
* **Key Files**:
  * **Gemini LLM Orchestrator**: [gemini.py](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/backend/app/llm/gemini.py) (uses `GeminiPipeline.run_dossier_analysis` to process everything in a single prompt rather than making multiple disparate network calls).

### 10. Accessibility & Regional Localization
* **Goal**: Provide native text-to-speech for visually impaired analysts and robust multilingual capabilities for diverse user demographics.
* **Key Components & Files**:
  * **Multi-Speaker TTS Narrator**: [MultiSpeakerNarrator.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/frontend/src/components/MultiSpeakerNarrator.tsx) (implements `window.speechSynthesis` to provide zero-cost Text-to-Speech with multiple voice persona options, mounted in `AiIntelligenceBriefing.tsx`).
  * **Multilingual UI Toggle**: [CitizenImpactPanel.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/frontend/src/components/lab/CitizenImpactPanel.tsx) (provides language context switching for translated summaries).
  * **Multilingual Print View**: [ExecutiveReportPrintView.tsx](file:///c:/Users/harsh/OneDrive/Desktop/K%20S%20Harshitaa/Projects/BeaconTrap-%20IITH%20BOI/frontend/src/components/ExecutiveReportPrintView.tsx) (receives `langCode` to natively generate translated PDFs).
