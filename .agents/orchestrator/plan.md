# Master Implementation Plan: NDIS BSP Quality & Safeguards Compliance Auditor

## Overview
Implement an autonomous multi-agent evaluation engine, interactive audit studio UI with real-time consensus deliberation traces and 1-click remediation, and official NDIS APO / Senior Practitioner compliance export for NDIS Behaviour Support Plans.

## Phases & Milestones

### Phase 0: Survey & Exploration
- Dispatch Explorer 1: Codebase architecture, frontend stack, existing BSP data models, types, and state management (Zustand/Redux/Context/etc.).
- Dispatch Explorer 2: Existing UI components, modal patterns, design system/Tailwind classes, BSP editing workflow, and export formats.
- Dispatch Explorer 3 (Spec Miner): 12 NDIS Quality Indicators, Restrictive Practices Rules 2018 requirements, APO submission standards, and evaluation scoring formulas.

### Phase 1: Architecture & Global Design
- Synthesize explorer findings into `PROJECT.md` and `TEST_INFRA.md`.
- Establish interfaces, data contracts, and code layout.

### Phase 2: Milestone 1 — Multi-Agent Clinical & Regulatory Evaluation Engine
- Human Rights & Legal Safeguards Agent
- Clinical PBS Specialist Agent
- Quality Panel Lead Synthesizer
- 12 NDIS Quality Indicators & Restrictive Practices Rules 2018
- Deliberation trace generation, scoring across 4 regulatory pillars, red-flag identification

### Phase 3: Milestone 2 — Interactive BSP Audit Studio UI
- `BSPAuditStudioModal.tsx`
- Multi-agent consensus deliberation trace stream
- Domain score breakdowns with visual compliance gauges and severity badges
- Red-flag compliance alerts with "1-Click Remediate" state injection into active BSP

### Phase 4: Milestone 3 — Official NDIS APO & Senior Practitioner Compliance Export
- Official NDIS Authorised Program Officer (APO) Submission Scorecard
- Machine-readable JSON evaluation package for audit records

### Phase 5: Milestone 4 & 5 — E2E Testing Suite & Adversarial Hardening
- Complete Tiers 1-4 opaque-box testing harness and test suites.
- Tier 5 adversarial testing & hardening.
- Forensic Auditor integrity review.
- Final gate verification.
