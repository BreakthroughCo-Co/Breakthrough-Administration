## 2026-08-16T08:06:01Z
You are Test Writer M4: E2E Testing Track Engineer.
Working directory: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\test_writer_m4\
Authoritative User Request: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\ORIGINAL_REQUEST.md
Project Architecture: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\PROJECT.md
Test Architecture: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\TEST_INFRA.md
Spec Miner Analysis: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\explorer_3\analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission:
1. Build the complete opaque-box E2E and unit testing suite in `tests/` and test runner script `scripts/run-bsp-tests.ts` (executable with `npx tsx` or `node`).
2. Design and implement tests across all 4 tiers:
   - Tier 1: Feature Coverage (≥5 test cases per feature for all 12 indicators, 5 restrictive practices, 3 agents, 1-click remediation, and APO export).
   - Tier 2: Boundary & Corner Cases (empty BSP, maximum restrictive practices, edge dates, missing authorizations, prohibited holds).
   - Tier 3: Cross-Feature Combinations (interaction between FBA hypotheses and replacement skills, interaction between restrictive practices and fade-out schedules, deliberation trace consensus).
   - Tier 4: Real-World Clinical BSP Scenarios (realistic clinical cases matching the 5 scenarios in TEST_INFRA.md).
3. Ensure the test runner executes cleanly, outputs clear diagnostic reports, and exits with code 0 only when all assertions pass.
4. When test suite is completely built and ready to run, create `c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\TEST_READY.md`.
5. Write your handoff report to `c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\test_writer_m4\handoff.md` and notify the orchestrator.
