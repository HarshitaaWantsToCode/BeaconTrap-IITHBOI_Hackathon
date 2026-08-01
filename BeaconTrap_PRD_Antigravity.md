# BeaconTrap — PRD & Implementation Plan for Antigravity
**Purpose:** Close the gap between what the PSB Hackathon report claims and what the codebase actually does, before the Aug 17 progress report and Aug 27–28 finale.
**Audience:** Google Antigravity (AI coding agent). This doc is written so each section can be handed to the agent as a standalone task with acceptance criteria.
**Constraint:** No paid LLM API budget. Everything below must run on free tiers (Groq free tier, Gemini free tier, local Ollama) or open-source infra (Neo4j Community, testnet chains, self-hosted Postgres).

---

## 0. Ground truth vs. claims (read this first, Antigravity)

Before touching code, audit the actual repo against `features.md` and the report. Do not trust either document — verify by grep/inspection. Specifically confirm:

- [ ] Does `backend/app/llm/gemini.py` make 1 LLM call or N calls per case?
- [ ] Does any file import or configure `neo4j` driver?
- [ ] Does any file import `web3`, `solcx`, or reference a Hyperledger SDK?
- [ ] What DB does `docker-compose.yml` / `database.py` actually point to (SQLite vs Postgres)?
- [ ] Is `frida`, `mitmproxy`, or `tcpdump` invoked anywhere in `workers/dynamic_worker/`, or just described?

Output this as `AUDIT.md` in repo root before starting any of the tasks below. Every task's "Definition of Done" includes updating `AUDIT.md`'s corresponding line from ❌/🟡 to ✅.

---

## 1. Core Issue: Fake Multi-Agent Claim vs. Single Mega-Prompt

### 1.1 Problem
Report Section 7.3 and 6.5 claim a LangGraph DAG with 6 distinct agent nodes (De-Obfuscation, MITRE Mapping, Network Intel, GRC Compliance, Risk Scoring, Report Generation), each with its own model. Actual code (per `features.md` §9) runs `GeminiPipeline.run_dossier_analysis` — one prompt, one call. This is the single biggest "gotcha" risk in a live Q&A.

### 1.2 Why this is solvable for free
LangGraph doesn't require multiple *paid* models — it requires multiple *distinct, real function calls with real state passed between them*. You already have three free LLM sources:

| Tier | Provider | Free limit (verify current values before demo) | Use for |
|---|---|---|---|
| Primary | Groq (Llama-3.1-70B or similar) | Free tier, generous RPM, no card required | De-obfuscation, MITRE mapping — fast, cheap |
| Secondary | Gemini API free tier | Free quota per day | Network intel (long context for PCAP/mitmproxy JSON) |
| Local | Ollama — CodeLlama-7B / Mistral-7B | Unlimited, runs on your own machine | Fallback when API quota is hit; also your "backup" story stays true |

The point of LangGraph is **not** "more expensive models" — it's a directed graph of typed state transitions with retry/fallback logic. That's free to build. What you're currently missing is architecture, not budget.

### 1.3 Target architecture

```
apps/backend/app/genai/
├── state.py            # TypedDict/Pydantic schema passed between nodes
├── graph.py             # LangGraph StateGraph definition + compile()
├── clients.py            # unified LLM client with fallback chain (Groq -> Gemini -> Ollama)
├── nodes/
│   ├── deobfuscation.py
│   ├── mitre_mapping.py
│   ├── network_intel.py
│   ├── grc_compliance.py
│   ├── risk_scoring.py
│   └── report_generation.py
└── prompts/
    ├── deobfuscation.txt
    ├── mitre_mapping.txt
    ├── grc_compliance.txt
    └── ...
```

### 1.4 Code sketch

**`state.py`** — this is what makes it a real graph, not a chained prompt:

```python
from typing import TypedDict, Optional
from pydantic import BaseModel

class ForensicContext(BaseModel):
    case_id: str
    permissions: list[str]
    decompiled_snippets: list[str]
    pcap_summary: dict
    certificate_info: dict
    obfuscation_score: float

class DeobfuscationOutput(BaseModel):
    renamed_functions: dict[str, str]
    behavioral_summary: str
    confidence: float

class MitreOutput(BaseModel):
    techniques: list[dict]  # [{"id": "T1412", "name": "...", "evidence": "..."}]
    confidence: float

class GraphState(TypedDict):
    forensic_context: ForensicContext
    deobfuscation: Optional[DeobfuscationOutput]
    mitre: Optional[MitreOutput]
    network_intel: Optional[dict]
    grc: Optional[dict]
    risk_score: Optional[dict]
    final_report: Optional[str]
    errors: list[str]  # nodes append here on failure — don't halt the pipeline
```

**`clients.py`** — the fallback chain that makes "free tier" survivable in a live demo (API rate limits during judging are a real risk):

```python
import os, time
from groq import Groq
import google.generativeai as genai
import ollama

class LLMRouter:
    def __init__(self):
        self.groq = Groq(api_key=os.environ["GROQ_API_KEY"])
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        self.gemini = genai.GenerativeModel("gemini-1.5-flash")

    def complete(self, prompt: str, prefer: str = "groq") -> tuple[str, str]:
        """Returns (response_text, model_used). Falls back on failure/rate-limit."""
        chain = {
            "groq": [self._groq, self._gemini, self._ollama],
            "gemini": [self._gemini, self._groq, self._ollama],
        }.get(prefer, [self._groq, self._gemini, self._ollama])

        last_err = None
        for fn in chain:
            try:
                return fn(prompt)
            except Exception as e:
                last_err = e
                time.sleep(0.5)
                continue
        raise RuntimeError(f"All LLM providers failed: {last_err}")

    def _groq(self, prompt):
        r = self.groq.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
        )
        return r.choices[0].message.content, "groq/llama-3.1-70b"

    def _gemini(self, prompt):
        r = self.gemini.generate_content(prompt)
        return r.text, "gemini-1.5-flash"

    def _ollama(self, prompt):
        r = ollama.generate(model="codellama:7b", prompt=prompt)
        return r["response"], "ollama/codellama-7b"
```

**`graph.py`** — the actual LangGraph wiring (this is the artifact you show a judge who asks "walk me through the DAG"):

```python
from langgraph.graph import StateGraph, END
from .state import GraphState
from .nodes import (
    deobfuscation, mitre_mapping, network_intel,
    grc_compliance, risk_scoring, report_generation,
)

def build_graph():
    g = StateGraph(GraphState)
    g.add_node("deobfuscation", deobfuscation.run)
    g.add_node("network_intel", network_intel.run)
    g.add_node("mitre_mapping", mitre_mapping.run)
    g.add_node("grc_compliance", grc_compliance.run)
    g.add_node("risk_scoring", risk_scoring.run)
    g.add_node("report_generation", report_generation.run)

    g.set_entry_point("deobfuscation")
    g.add_edge("deobfuscation", "network_intel")   # parallelizable later
    g.add_edge("network_intel", "mitre_mapping")
    g.add_edge("mitre_mapping", "grc_compliance")
    g.add_edge("grc_compliance", "risk_scoring")
    g.add_edge("risk_scoring", "report_generation")
    g.add_edge("report_generation", END)
    return g.compile()

compiled_graph = build_graph()
```

**`nodes/mitre_mapping.py`** — pattern every node follows (typed in, typed out, evidence-grounded, errors don't crash the pipeline):

```python
from ..state import GraphState, MitreOutput
from ..clients import LLMRouter
import json

router = LLMRouter()

MITRE_PROMPT = """You are a MITRE ATT&CK Mobile mapping agent.
Given this behavioral summary and permission list, map ONLY to techniques
explicitly supported by the evidence below. Do not infer techniques not
supported by the evidence. Return JSON: {{"techniques": [{{"id","name","evidence"}}]}}

Behavioral summary: {summary}
Permissions: {permissions}
"""

def run(state: GraphState) -> GraphState:
    try:
        prompt = MITRE_PROMPT.format(
            summary=state["deobfuscation"].behavioral_summary,
            permissions=state["forensic_context"].permissions,
        )
        text, model_used = router.complete(prompt, prefer="groq")
        parsed = json.loads(text)
        state["mitre"] = MitreOutput(techniques=parsed["techniques"], confidence=0.8)
    except Exception as e:
        state["errors"].append(f"mitre_mapping failed: {e}")
        state["mitre"] = MitreOutput(techniques=[], confidence=0.0)
    return state
```

### 1.5 What to say in Q&A once this is live
"Each node is a typed state transition — not a chained prompt. We route to Groq's free tier first for speed, fall back to Gemini, and fall back further to a locally-hosted CodeLlama if both are rate-limited, which also gives us zero-cost, zero-data-leaving-the-server resilience during judging." This is defensible because it will now be *true*.

### 1.6 Definition of Done
- `graph.py` compiles and runs end-to-end on one real APK
- Each node logs its `model_used` so you can show provenance live
- Killing your Groq key mid-demo still produces a report (fallback works) — test this explicitly
- Report Section 7.3 diagram matches `graph.py` exactly, node for node

---

## 2. Issue: Neo4j Campaign DNA is frontend-only

### 2.1 Problem
`CampaignDnaPanel.tsx` renders a graph but nothing in `features.md` backend writes to Neo4j. This is your #9 USP — it needs to be real, even minimally.

### 2.2 Minimum viable real implementation (not the full vision — just real)

```python
# backend/app/graph_db/neo4j_client.py
from neo4j import GraphDatabase
import os

class CampaignGraph:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            os.environ["NEO4J_URI"],
            auth=(os.environ["NEO4J_USER"], os.environ["NEO4J_PASSWORD"]),
        )

    def upsert_apk_case(self, case_id: str, cert_fingerprint: str,
                         c2_domains: list[str], ips: list[str]):
        with self.driver.session() as session:
            session.execute_write(self._write_case, case_id, cert_fingerprint, c2_domains, ips)

    @staticmethod
    def _write_case(tx, case_id, cert_fp, domains, ips):
        tx.run("""
            MERGE (a:APK {case_id: $case_id})
            MERGE (c:SigningCert {fingerprint: $cert_fp})
            MERGE (a)-[:SIGNED_WITH]->(c)
            WITH a
            UNWIND $domains AS d
              MERGE (dom:Domain {name: d})
              MERGE (a)-[:COMMUNICATES_WITH]->(dom)
            WITH a
            UNWIND $ips AS ip
              MERGE (i:IP {addr: ip})
              MERGE (a)-[:COMMUNICATES_WITH]->(i)
        """, case_id=case_id, cert_fp=cert_fp, domains=domains, ips=ips)

    def find_related_campaigns(self, case_id: str) -> list[dict]:
        """Real campaign attribution: shared cert or shared C2 = same campaign."""
        with self.driver.session() as session:
            return session.execute_read(self._query_related, case_id)

    @staticmethod
    def _query_related(tx, case_id):
        result = tx.run("""
            MATCH (a:APK {case_id: $case_id})-[:SIGNED_WITH|COMMUNICATES_WITH]->(shared)
                  <-[:SIGNED_WITH|COMMUNICATES_WITH]-(other:APK)
            WHERE other.case_id <> $case_id
            RETURN DISTINCT other.case_id AS related_case, labels(shared) AS link_type
        """, case_id=case_id)
        return [dict(r) for r in result]
```

Wire this into Stage 4 of the pipeline (`docker-compose.yml` gets a `neo4j:5-community` service — trivial to add, zero cost).

### 2.3 Definition of Done
- Seed the graph with 3–4 synthetic prior cases sharing a certificate or C2 domain with your live demo APK
- `find_related_campaigns` returns a real, non-empty result during the live demo
- `CampaignDnaPanel.tsx` fetches from a real `/api/v1/graph/{apk_id}` endpoint, not mock JSON

---

## 3. Issue: Blockchain panel presents, doesn't generate

### 3.1 Problem
`BlockchainEvidencePanel.tsx` shows anchoring details with no backing service. Full Hyperledger Fabric is heavy for a hackathon timeline — don't attempt it. Use a real testnet instead (you already listed Solidity/Sepolia in the BOI hackathon report for a different project — reuse that pattern).

### 3.2 Minimum viable real implementation

```solidity
// contracts/EvidenceAnchor.sol
pragma solidity ^0.8.20;

contract EvidenceAnchor {
    event Anchored(string caseId, bytes32 hash, uint256 timestamp);
    mapping(string => bytes32) public caseHashes;

    function anchor(string calldata caseId, bytes32 evidenceHash) external {
        caseHashes[caseId] = evidenceHash;
        emit Anchored(caseId, evidenceHash, block.timestamp);
    }

    function verify(string calldata caseId, bytes32 hashToCheck) external view returns (bool) {
        return caseHashes[caseId] == hashToCheck;
    }
}
```

```python
# backend/app/blockchain/anchor_service.py
from web3 import Web3
import hashlib, json, os

class BlockchainAnchor:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.environ["SEPOLIA_RPC_URL"]))  # free via Infura/Alchemy
        self.contract = self.w3.eth.contract(
            address=os.environ["CONTRACT_ADDRESS"],
            abi=json.load(open("contracts/EvidenceAnchor.abi.json")),
        )
        self.account = self.w3.eth.account.from_key(os.environ["WALLET_PRIVATE_KEY"])

    def anchor_report(self, case_id: str, report_bytes: bytes) -> dict:
        evidence_hash = hashlib.sha256(report_bytes).digest()
        tx = self.contract.functions.anchor(case_id, evidence_hash).build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "gas": 100000,
            "gasPrice": self.w3.eth.gas_price,
        })
        signed = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        return {
            "tx_hash": tx_hash.hex(),
            "evidence_hash": evidence_hash.hex(),
            "explorer_url": f"https://sepolia.etherscan.io/tx/{tx_hash.hex()}",
        }
```

Free faucet Sepolia ETH covers this entirely — zero cost. This gives you a **real, clickable, publicly-verifiable Etherscan link** in the demo, which is a strong visual moment: "here is the actual on-chain transaction anchoring this report's hash."

### 3.3 Definition of Done
- Deployed contract address exists on Sepolia (verify on Etherscan)
- One real anchoring transaction exists for your demo case before the finale — don't do it live (RPC latency risk); anchor it beforehand and just *display* the real tx hash/link live
- `BlockchainEvidencePanel.tsx` links out to the real Etherscan URL, not a fabricated hash string

---

## 4. Issue: DB claim mismatch (SQLite vs Postgres)

### 4.1 Fix
Trivial but do it — mismatches here are the kind of small thing that erodes trust once a judge catches one. Either:
- **(a)** Spin up Postgres in `docker-compose.yml` and point `DATABASE_URL` at it (few hours of work, low risk), or
- **(b)** Correct the report to say SQLite for prototype / Postgres for production roadmap.

Prefer (a) — "PostgreSQL 16" is stated as fact five separate times in the report; fixing the report in five places is more error-prone than fixing one `.env` line.

```python
# backend/app/core/database.py
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://beacontrap:beacontrap@postgres:5432/beacontrap"
)
```

### 4.2 Definition of Done
- `docker-compose up` brings up Postgres, not SQLite, by default
- Existing SQLite dev data migrated or regenerated

---

## 5. Issue: Dynamic analysis instrumentation not evidenced (Frida/mitmproxy/tcpdump)

### 5.1 Reality check
Full Frida + AVD + mitmproxy dynamic sandboxing is genuinely heavy infra to stand up correctly in weeks, and getting it flaky/broken live is worse than not having it. Two honest paths:

**Path A (if you have time): minimum real dynamic run.**
```python
# workers/dynamic_worker/frida_runner.py
import frida, subprocess, time, json

def run_dynamic_analysis(apk_path: str, package_name: str, timeout_s: int = 60) -> dict:
    subprocess.run(["adb", "install", "-r", apk_path], check=True)
    device = frida.get_usb_device(timeout=10)
    pid = device.spawn([package_name])
    session = device.attach(pid)

    script = session.create_script(open("workers/dynamic_worker/hooks/sms_hooks.js").read())
    events = []
    script.on("message", lambda msg, data: events.append(msg))
    script.load()
    device.resume(pid)

    time.sleep(timeout_s)
    session.detach()
    return {"events": events, "duration_s": timeout_s}
```

```javascript
// workers/dynamic_worker/hooks/sms_hooks.js — a REAL, small, honest hook
// (start with exactly one capability, don't fake the full suite)
Java.perform(function () {
    var SmsManager = Java.use("android.telephony.SmsManager");
    SmsManager.sendTextMessage.overload(
        'java.lang.String', 'java.lang.String', 'java.lang.String',
        'android.app.PendingIntent', 'android.app.PendingIntent'
    ).implementation = function (dest, sc, text, sentIntent, deliveryIntent) {
        send({type: "sms_send_intercepted", destination: dest, body: text});
        return this.sendTextMessage(dest, sc, text, sentIntent, deliveryIntent);
    };
});
```

Run this against a deliberately-built **benign test APK you write yourself** that calls `sendTextMessage` — do NOT run live against real malware samples on your own devices/network for a demo; that's an actual safety and legal risk, not just a technical one.

**Path B (if time-constrained): be honest about it.**
Relabel the dynamic worker as "prototype: static-only pipeline with dynamic analysis architecture defined but partially stubbed for hackathon timeline" in both the report and the live pitch. Judges respect an accurate "here's what's real, here's the roadmap" far more than a claim that collapses under one follow-up question. This is consistent with your own past lesson from the CoachIn OA: never dress up a partial solution as a complete one under time pressure — say what's real.

### 5.2 Recommendation given your timeline
Given prototype development runs to Aug 17 and finale is Aug 27–28, **do Path A but scope it to exactly one real hook (SMS) against one self-built test APK.** That gives you one genuinely real, demoable dynamic capability rather than zero, without the risk of standing up a full Frida+AVD+mitmproxy+tcpdump stack in weeks.

---

## 6. Issue: RBAC is frontend-only (real security gap in a security product)

### 6.1 Problem
Analyst vs. Officer view is described as JWT-role-driven, but nothing confirms server-side enforcement — likely just conditional rendering in `App.tsx`. In a cybersecurity product, this is the single worst thing for a judge to discover live.

### 6.2 Fix

```python
# backend/app/core/auth.py
from fastapi import Depends, HTTPException
from jose import jwt, JWTError

def require_role(*allowed_roles: str):
    def dependency(token: str = Depends(oauth2_scheme)) -> dict:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except JWTError:
            raise HTTPException(401, "Invalid token")
        if payload.get("role") not in allowed_roles:
            raise HTTPException(403, f"Requires role: {allowed_roles}")
        return payload
    return dependency
```

```python
# backend/app/api/v1/ai.py
@router.get("/report/{case_id}/technical")
def get_technical_report(case_id: str, user=Depends(require_role("analyst", "admin"))):
    ...

@router.get("/report/{case_id}/executive")
def get_executive_report(case_id: str, user=Depends(require_role("officer", "admin"))):
    ...
```

### 6.3 Definition of Done
- Write one test: officer JWT hitting the analyst-only technical report endpoint returns 403
- Show this test passing live if asked — it's a 30-second, high-credibility answer to "is this actually enforced?"

---

## 7. Issue: Simulated case data presented as live telemetry

### 7.1 Problem
Screenshots show `SIMULATED CASE` / `SIMULATED TELEMETRY` labels baked into the UI. This is actually a *good* sign of honesty in the current build — don't remove the labels, but don't demo exclusively on simulated data either.

### 7.2 Fix
Keep the simulated fallback (per `AnalysisContext.tsx`) for offline resilience — that's a legitimate, defensible engineering decision (own it explicitly: "we have graceful degradation to a cached baseline if live analysis fails during judging network conditions"). But ensure **at least one full pipeline run in the live demo is real end-to-end**, clearly distinguishable from the simulated fallback via that same UI label.

### 7.3 Definition of Done
- One demo APK runs through real ingestion → static → (Path A dynamic) → GenAI graph → real risk score → real report, with the UI showing "LIVE ANALYSIS" not "SIMULATED CASE"
- Simulated fallback remains as a deliberate, explained resilience feature, not a hidden default

---

## 8. Execution order for Antigravity (respect dependency order)

| Order | Task | Depends on | Est. effort |
|---|---|---|---|
| 1 | `AUDIT.md` ground-truth pass | — | 2–3 hrs |
| 2 | Postgres migration | — | 3–4 hrs |
| 3 | LangGraph refactor (§1) | Postgres (for state persistence, optional) | 2–3 days |
| 4 | RBAC server-side enforcement (§6) | — | 1 day |
| 5 | Neo4j Campaign DNA (§2) | Postgres, docker-compose | 1–2 days |
| 6 | Blockchain anchoring (§3) | — | 1 day (mostly wallet/RPC setup) |
| 7 | One real Frida SMS hook (§5, Path A) | — | 2–3 days, do this early in case it fails and you need to fall back to §5 Path B |
| 8 | End-to-end live demo run + report rewrite pass to match reality | all above | 1–2 days |

Do #7 early and in parallel — it's the highest-risk, most time-uncertain item, and you need enough runway to fall back to "honest roadmap" framing (§5 Path B) if it doesn't work in time.

---

## 9. Non-negotiable pre-finale checklist

- [ ] `graph.py` LangGraph diagram matches report Section 7.3 exactly
- [ ] One real Etherscan tx link works when clicked live
- [ ] Neo4j returns a real related-campaign result for the demo case
- [ ] RBAC 403 test passes and can be shown on request
- [ ] Report's Tech Stack section (6.d) says Postgres and it's actually running Postgres
- [ ] At least one full live/non-simulated pipeline run rehearsed twice before the finale
- [ ] Team has agreed on one honest sentence for every gap that remains unfixed — "X is architected and stubbed, here's the roadmap" beats silence or overclaiming every time
