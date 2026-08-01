# BeaconTrap - Ground Truth Audit

- ❌ Does `backend/app/llm/gemini.py` make 1 LLM call or N calls per case?
  - **Result:** It makes 1 LLM call (`run_dossier_analysis` uses a single mega-prompt).
- 🟡 Does any file import or configure `neo4j` driver?
  - **Result:** `backend/app/services/graph_service.py` imports and configures the `neo4j` driver, but it is not integrated into `backend/app/api/v1/campaigns.py` (which returns mock JSON).
- ❌ Does any file import `web3`, `solcx`, or reference a Hyperledger SDK?
  - **Result:** No imports for `web3`, `solcx`, or Hyperledger SDK exist in the codebase.
- ✅ What DB does `docker-compose.yml` / `database.py` actually point to (SQLite vs Postgres)?
  - **Result:** It already points to Postgres (`postgres:16-alpine` in docker-compose, and `postgresql+asyncpg` in config).
- 🟡 Is `frida`, `mitmproxy`, or `tcpdump` invoked anywhere in `workers/dynamic_worker/`, or just described?
  - **Result:** `frida` and `tcpdump` are invoked via `subprocess.run` in `workers/dynamic_worker/main.py`, but it appears to be a naive implementation lacking a real hook file like `hooks/bypass_emulator.js` or proper sandbox management. `mitmproxy` is not used.
