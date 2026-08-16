# E2E Test Infra: NDIS BSP Quality & Safeguards Compliance Auditor

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on internal implementation details.
- Systematic 4-tier + adversarial tier methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Workload Testing + Adversarial Hardening.

---

## Feature Inventory & Test Mapping
| # | Feature | Requirement | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|-------------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | 12 NDIS Quality Indicators Evaluation | ORIGINAL_REQUEST §R1 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 2 | Human Rights & Legal Safeguards Agent | ORIGINAL_REQUEST §R1.1 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 3 | Clinical PBS Specialist Agent | ORIGINAL_REQUEST §R1.2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 4 | Quality Panel Lead Synthesizer | ORIGINAL_REQUEST §R1.3 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 5 | Restrictive Practices Rules 2018 (5 Types) | ORIGINAL_REQUEST §R1 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 6 | 1-Click State Store Remediation | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 7 | Deliberation Stream & Consensus Traces | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 8 | Domain Scorecard Gauges & Badges | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 9 | Red-Flag Warning Prioritization | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 10 | Official NDIS APO Submission Scorecard | ORIGINAL_REQUEST §R3 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 11 | Machine-Readable JSON Export Package | ORIGINAL_REQUEST §R3 | ≥5 cases | ≥5 cases | ✓ | ✓ |

---

## Test Architecture
- **Test Runner**: Node / TypeScript test script executable via `node` or `ts-node` / `tsx` (e.g. `scripts/run-bsp-tests.ts` or `tests/e2e/bsp-audit-e2e.test.ts`).
- **Pass/Fail Semantics**: Process exit code `0` on 100% pass, non-zero on failure.
- **Assertion Framework**: Strict invariant assertions testing:
  1. Complete scoring across all 12 indicators (0–100 scale).
  2. Critical penalty multipliers applied whenever unauthorized restrictive practices, missing fade plans, or incomplete functional hypotheses exist.
  3. Deliberation traces containing contributions from all 3 agents (Human Rights, Clinical PBS, Synthesizer).
  4. 1-Click remediation state mutations properly updating `BSPDocument` fields and resolving red flags.
  5. JSON package validation against Draft-07 schema and SHA-256 integrity verification.

---

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Expected Outcome |
|---|----------|--------------------|------------------|
| 1 | Full Clinical BSP with Authorized Chemical & Environmental Restraints | All 12 Indicators, 3 Agents, Restrictive Rules, APO Export | Score ≥ 85%, Audit-Ready rating, all gauges green/amber, APO endorsement ready. |
| 2 | High-Risk BSP with Unauthorized Physical Restraint (Prone/Pinning) | Human Rights Agent, Prohibited Hold Detector, Red-Flag Hub | Critical Safety Red-Flag, Score capped at 0%, APO endorsement blocked. |
| 3 | Behavioral Plan with Incomplete Functional Hypothesis & No Antecedents | Clinical PBS Agent, Formulation Pillar, 1-Click Remediation | High Red-Flag warning, 1-click remediation injects sensory/escape hypothesis and proactive antecedents into active BSP. |
| 4 | Restrictive Practice with Missing Fade-Out & Reduction Schedule | Restrictive Practices Rules 2018, Quality Panel Synthesizer | Multiplier penalty ($0.75$), missing fade-out alert, 1-click generates quantifiable step-down criteria. |
| 5 | Full APO Submission & JSON Audit Package Generation | APO Exporter, JSON Schema Validator, SHA-256 Checksum | Generated JSON satisfies schema, checksum matches raw payload, APO printable scorecard formatted. |

---

## Coverage Thresholds
- Tier 1: Feature Coverage (≥55 test cases across 11 features)
- Tier 2: Boundary & Corner Cases (≥55 test cases)
- Tier 3: Pairwise Combinations (≥15 interaction cases)
- Tier 4: Real-World Scenarios (≥5 end-to-end clinical cases)
- Tier 5: Adversarial Hardening (≥15 adversarial & malformed cases)
- **Total Minimum Test Cases**: ≥ 145 test assertions / cases.
