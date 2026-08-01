
# PROJECT_HANDOVER.md

# BeaconTrap — Project Handover

Version: 1.0

This document is the primary technical handover for new developers and AI coding agents.
It explains **what BeaconTrap is**, **why it exists**, **how it is built**, **how the modules interact**, and **how future work should be implemented**.

---

# 1. Vision

BeaconTrap is an AI-powered malware investigation and fraud intelligence platform designed for
Android banking malware.

Unlike traditional antivirus systems that simply classify an APK as malicious or benign,
BeaconTrap performs a complete forensic investigation and produces explainable intelligence.

Primary goals:

- Detect fraudulent APKs
- Reverse engineer malware automatically
- Correlate static and dynamic evidence
- Explain findings with AI
- Generate investigation reports
- Produce explainable risk scores
- Discover malware campaigns
- Preserve forensic integrity

---

# 2. End-to-End Workflow

```
APK Upload
    │
    ▼
Validation
    │
    ▼
Case Creation
    │
    ▼
Static Analysis
    │
    ▼
Dynamic Sandbox
    │
    ▼
Artifact Storage
    │
    ▼
LangGraph Multi-Agent Pipeline
    │
    ├── Deobfuscation
    ├── MITRE Mapping
    ├── Network Intelligence
    ├── Compliance
    ├── Risk Scoring
    ├── Campaign Intelligence
    └── Report Generation
    │
    ▼
Final Investigation Report
```

---

# 3. Functional Modules

## Module 1 — APK Ingestion

Responsibilities

- Upload APK
- Verify MIME type
- Compute SHA-256
- Generate Case ID
- VirusTotal lookup
- Store APK
- Queue analysis

Inputs

- APK File
- Upload URL
- Metadata

Outputs

- Case ID
- Stored artifact
- Analysis Job

---

## Module 2 — Static Analysis

Responsibilities

- AndroidManifest parsing
- Permission extraction
- JADX decompilation
- IOC extraction
- Certificate analysis
- Semgrep scanning
- Obfuscation scoring

Output

```
StaticReport
Permissions
IOCs
Manifest
Certificate
CallGraph
RiskSignals
```

---

## Module 3 — Dynamic Analysis

Responsibilities

- Android Emulator
- Frida instrumentation
- SSL bypass
- HTTPS interception
- Runtime monitoring
- DNS capture
- Filesystem monitoring

Output

```
RuntimeEvents
NetworkEvents
BehaviourTimeline
CapturedTraffic
```

---

## Module 4 — AI Intelligence

The AI layer never replaces deterministic analysis.

Instead it interprets deterministic outputs.

Agents

- Deobfuscation Agent
- MITRE Agent
- Network Agent
- Compliance Agent
- Risk Agent
- Campaign Agent
- Report Agent

Every agent receives structured JSON and returns structured JSON.

---

## Module 5 — Risk Engine

Inputs

- Permissions
- Runtime Behaviour
- IOCs
- Certificates
- MITRE Techniques
- AI Interpretation

Output

```
Threat Score

Risk Category

Confidence

Evidence

Recommendations
```

---

## Module 6 — Reporting

Outputs

- Analyst Report
- Executive Report
- Compliance Report
- Customer Advisory
- IOC Export
- STIX Export (future)

---

# 4. Repository Layout

```
frontend/
backend/
workers/
agents/
sandbox/
risk_engine/
reports/
database/
schemas/
blockchain/
docs/
tests/
```

Every directory owns one responsibility.

Cross-module coupling should remain minimal.

---

# 5. Technology Stack

Frontend

- React
- TypeScript
- Tailwind
- shadcn/ui

Backend

- FastAPI
- Python
- RabbitMQ
- Redis

Storage

- PostgreSQL
- Neo4j
- MinIO

Sandbox

- Android Emulator
- Frida
- JADX
- mitmproxy
- tcpdump

AI

- LangGraph
- Gemini
- GPT-4o-mini
- CodeLlama
- Mistral

Infrastructure

- Docker
- Docker Compose
- gVisor
- Prometheus
- Grafana

---

# 6. Engineering Principles

1. Security before convenience.
2. Every analysis stage should be independently testable.
3. Prefer composition over inheritance.
4. Avoid global state.
5. Preserve API contracts.
6. Keep AI prompts version controlled.
7. Log every important state transition.
8. Every analysis artifact must be reproducible.

---

# 7. Development Workflow

1. Create feature branch.
2. Implement one module.
3. Add tests.
4. Update documentation.
5. Verify linting.
6. Run integration pipeline.
7. Merge after review.

---

# 8. Immediate Roadmap

Phase 1

- Complete ingestion
- Static analysis
- Dynamic analysis

Phase 2

- AI orchestration
- Explainable reports
- Risk scoring

Phase 3

- Campaign DNA
- Threat hunting
- Blockchain anchoring

Phase 4

- SIEM
- SOAR
- YARA generation
- Batch analysis
- Cloud deployment

---

# 9. Handover Notes

Future contributors should never treat BeaconTrap as "just an APK scanner."

The competitive advantage of the platform is the orchestration of multiple deterministic analysis
engines with specialized AI agents that transform forensic artifacts into explainable,
actionable fraud intelligence.

Every new feature should strengthen one of these pillars:

- Detection
- Investigation
- Explainability
- Automation
- Intelligence
- Compliance
