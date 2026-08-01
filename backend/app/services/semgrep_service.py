import subprocess
import shutil
import json

class SemgrepService:
    @staticmethod
    def run_scan(target_dir: str) -> dict:
        if not shutil.which("semgrep"):
            return {"runs": [], "error": "Semgrep binary not found in path"}
            
        try:
            cmd = ["semgrep", "--config=auto", "--json", target_dir]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                return json.loads(result.stdout)
            return {"runs": [], "error": f"Semgrep scan exited with error {result.returncode}"}
        except Exception as e:
            return {"runs": [], "error": f"Semgrep execution failed: {str(e)}"}
