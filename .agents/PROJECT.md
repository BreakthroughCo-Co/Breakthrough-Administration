# Project: NDIS Behaviour Support Plan (BSP) Quality & Safeguards Compliance Auditor

## Architecture & System Overview
Breakthrough OS is a Next.js 15 (App Router), React 19, TypeScript, Zustand 5, and Tailwind CSS v4 clinical management platform for NDIS behaviour support practitioners.

The NDIS BSP Quality & Safeguards Compliance Auditor introduces an autonomous multi-agent clinical and regulatory evaluation engine that evaluates any Behaviour Support Plan against the 12 NDIS Quality Indicators and Authorised Restrictive Practices Rules 2018, visualizing multi-agent consensus deliberation, domain scorecards, prioritized red flags with 1-click state remediation, and official APO submission export.

### Core Modules
1. **Types & Data Contracts** (`types/bsp-audit.ts`, `types/index.ts`): Type definitions for the 12 NDIS Quality Indicators (QI-01..QI-12), 4 Regulatory Pillars, 5 Restrictive Practice categories (Chemical, Mechanical, Physical, Environmental, Seclusion), 3 Agent perspectives, Deliberation Traces, Red Flags, 1-Click Remediation payloads, and APO Scorecard models.
2. **Multi-Agent Evaluation Engine** (`lib/bsp-auditor/`):
   - `indicators.ts`: 12 NDIS Quality Indicators evaluation logic, weights, criteria, and gap triggers.
   - `agent-evaluator.ts`: Multi-agent pipeline coordinating the *Human Rights & Legal Safeguards Agent*, *Clinical PBS Specialist Agent*, and *Quality Panel Lead Synthesizer*, generating live deliberation traces and calculating weighted pillar scores with critical penalty multipliers.
   - `remediation-engine.ts`: Generates actionable patch payloads that fix identified compliance gaps (unauthorized restrictive practices, missing fade-out schedules, incomplete functional hypotheses) directly into `BSPDocument` fields.
   - `apo-exporter.ts`: Formats official NDIS APO submission scorecards and validates machine-readable JSON packages with SHA-256 integrity checksums.
3. **Interactive BSP Audit Studio & Scorecard UI** (`components/features/BSPAuditStudioModal.tsx`):
   - Real-time animated 3-agent deliberation streaming feed (`components/features/bsp-audit/AgentDeliberationStream.tsx`).
   - Authoritative 0–100% radial gauge, 4 Regulatory Pillar meters, and 12-indicator matrix (`components/features/bsp-audit/DomainScorecardGauges.tsx`, `components/features/bsp-audit/QualityIndicatorsMatrix.tsx`).
   - Red-Flag Alert Hub with "1-Click Remediate" buttons triggering immediate Zustand store updates (`updateBSPDocument`) (`components/features/bsp-audit/RedFlagRemediationHub.tsx`).
   - Official NDIS APO Submission Scorecard view with clinical A4 printable styling and JSON package export (`components/features/bsp-audit/APOSubmissionExportView.tsx`).
4. **Integration Hooks** (`components/features/BSPModule.tsx`):
   - Launch button in BSP Module header action bar and compliance scorecard.
   - Real-time synchronization with `activeBsp` in `useManagementStore`.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | NDIS 12 Quality Indicators Rubric | Mathematical and heuristic evaluation rules for QI-01 to QI-12 across 4 regulatory pillars. | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 2 | Human Rights & Legal Safeguards Agent | Evaluates participant consent, dignity of risk, restrictive practices classification (5 types), and legislative authorization status. | M1 | ORIGINAL_REQUEST §R1.1 | DONE |
| 3 | Clinical PBS Specialist Agent | Audits functional behavioral hypotheses (escape, tangible, sensory, attention), antecedent modifications, proactive environmental accommodations, and skill training. | M1 | ORIGINAL_REQUEST §R1.2 | DONE |
| 4 | Quality Panel Lead Synthesizer | Aggregates findings, computes authoritative 0-100% scorecard, applies critical penalties, and generates multi-agent deliberation traces. | M1 | ORIGINAL_REQUEST §R1.3 | DONE |
| 5 | Restrictive Practices Rules 2018 Validation | Validates Chemical, Mechanical, Physical, Environmental, and Seclusion practices for authorization, least restrictive justification, fade-out plan, and prohibited hold detection. | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 6 | 1-Click Remediation Engine | Computes structured remediation patches for missing safeguards and injects them into the active BSP. | M1 | ORIGINAL_REQUEST §R2 | DONE |
| 7 | Deliberation Stream UI | Interactive real-time animated streaming view of multi-agent debate and reasoning traces with sentiment and rule citations. | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 8 | Domain Scorecard Gauges & Badges | Authoritative 0-100% score gauge, 4 Pillar meters, 12 Quality Indicator cards with status badges (compliant/warning/critical). | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 9 | Red-Flag Compliance Warning Hub | Prioritized alert cards for critical compliance risks with "1-Click Remediate" action buttons. | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 10 | Zustand State Store Remediation Wiring | 1-Click remediation modifies `activeBsp` via `updateBSPDocument` in `useManagementStore`, updating the live plan. | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 11 | BSPModule Launch Integration | Audit trigger buttons in `BSPModule.tsx` header action bar and compliance summary widget. | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 12 | Official NDIS APO Submission Scorecard | Clinical-grade A4 printable APO compliance scorecard layout with endorsement sections and evidence breakdown. | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 13 | Machine-Readable JSON Export Package | Export full audit package matching JSON Schema Draft-07 specification with SHA-256 integrity checksum. | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 14 | Opaque-Box E2E Testing Suite (Tiers 1-4) | Comprehensive test suite covering feature isolation, boundary cases, cross-feature combinations, and real-world clinical BSP scenarios. | M4 | ORIGINAL_REQUEST Acceptance Criteria | DONE |
| 15 | Adversarial Hardening (Tier 5) | Adversarial test suite stress-testing corner cases, malformed BSPs, prohibited practices, and forensic integrity audit. | M5 | Project Pattern Final Milestone | DONE |

---

## Milestones
| # | Name | Scope | Dependencies | Status | Key Outputs |
|---|------|-------|-------------|--------|-------------|
| M1 | Multi-Agent Clinical & Regulatory Evaluation Engine | `types/bsp-audit.ts`, `lib/bsp-auditor/indicators.ts`, `lib/bsp-auditor/agent-evaluator.ts`, `lib/bsp-auditor/remediation-engine.ts`, `lib/bsp-auditor/apo-exporter.ts`, `app/api/bsp-audit/route.ts` | none | **DONE** | Complete multi-agent pipeline, 12 indicators, 4 pillars, penalty multipliers, 100% unit verified |
| M2 | Interactive BSP Quality Audit Studio UI & State Store Remediation | `components/features/BSPAuditStudioModal.tsx`, `components/features/bsp-audit/*`, `components/features/BSPModule.tsx` integration | M1 | **DONE** | High-fidelity dark mode clinical studio, deliberation stream controls, radial gauges, 1-click state store remediation |
| M3 | Official NDIS APO & Senior Practitioner Compliance Export | APO Submission Scorecard view, printable layout, JSON download with SHA-256 checksum | M1, M2 | **DONE** | A4 printable APO scorecard, Draft-07 schema compliance, cryptographic SHA-256 hash generator & verifier |
| M4 | E2E Testing Track & Opaque-Box Test Suite (Tiers 1-4) | `tests/e2e/bsp-audit-e2e.test.ts`, `scripts/run-bsp-tests.ts`, test runners, all 12 indicators, 5 practice categories, 1-click remediation, and export validation | M1, M2, M3 | **DONE** | `TEST_READY.md`, 164/164 test cases passing cleanly across 7 suites |
| M5 | Adversarial Hardening (Tier 5) & Forensic Audit | White-box stress-testing, malformed inputs, prohibited restraint safety, forensic integrity audit | M4 | **DONE** | Gate passed: 2 Reviewers (APPROVE), 2 Challengers (APPROVE, 523 stress assertions), Forensic Auditor (CLEAN) |
