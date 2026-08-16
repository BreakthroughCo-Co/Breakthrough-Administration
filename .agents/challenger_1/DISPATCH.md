## 2026-08-16T08:26:00Z

<USER_REQUEST>
You are Challenger 1: Empirical Adversarial Verifier (Engine & Regulatory Rules).
Working directory: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\challenger_1\
Authoritative User Request: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\ORIGINAL_REQUEST.md
Project Architecture: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\PROJECT.md
Test Infrastructure: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\TEST_READY.md

Your mission:
1. Adversarially stress-test the Multi-Agent Evaluation Engine (`lib/bsp-auditor/`):
   - Prohibited restraint holds (e.g. prone hold, supine hold, neck hold, pressure on chest) -> verify score immediately drops to 0% with critical safety alert.
   - Unauthorized restrictive practices -> verify $M_{unauth}=0.60$ caps score below audit-ready threshold.
   - Missing fade-out schedules -> verify $M_{nofade}=0.75$ and red flag alert.
   - Incomplete FBA hypotheses -> verify $M_{nohypo}=0.80$ and clinical formulation red flag.
   - Malformed, empty, or huge BSP payloads (50k+ characters, XSS strings, SQLi strings) -> verify engine handles gracefully without crash.
2. Run the test suite and execute any custom adversarial verification scripts.
3. Formulate your verdict: APPROVE or REQUEST_CHANGES.
4. Write your handoff to `c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\challenger_1\handoff.md`.
5. Send a message to the orchestrator with your verdict.
</USER_REQUEST>
