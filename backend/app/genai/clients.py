import os
import time
from groq import Groq
import google.generativeai as genai
import ollama

class LLMRouter:
    def __init__(self):
        self.groq = Groq(api_key=os.environ.get("GROQ_API_KEY", "dummy"))
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "dummy"))
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
