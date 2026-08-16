# Comprehensive Codebase Architecture & BSP Data Models Analysis Report
**Explorer**: Explorer 1 (Codebase Architecture & Data Models Explorer)  
**Date**: 2026-08-16  
**Target Repository**: `c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main`  
**Mission**: Investigate project tooling, framework versions, data models, state management, BSP storage/modification flows, and establish architectural blueprints for the autonomous multi-agent NDIS Quality & Safeguards Compliance Auditor.

---

## 1. Executive Summary

Breakthrough OS (`google-workspace-hub`) is a high-grade, client-first NDIS Practice Management & Clinical Behaviour Support platform built on **Next.js 15 (App Router)**, **React 19 RC**, **TypeScript 5**, **Tailwind CSS v4**, and **Zustand 5**.

The application manages participants, clinical case notes, incidents, ABC observation logs, Restrictive Practice registers, NDIS billing claims, and comprehensive 6-section **Positive Behaviour Support Plans (BSPs)**.

The current BSP module (`components/features/BSPModule.tsx`) provides basic authoring across 6 clinical sections and a simplistic static rule score. Implementing the **Autonomous Multi-Agent Quality & Safeguards Compliance Auditor** requires:
1. Formalizing the **12 NDIS Quality & Safeguards Commission Quality Indicators** across 4 regulatory pillars.
2. Building an autonomous **3-perspective Multi-Agent Evaluation Engine** (Human Rights & Legal Safeguards Agent, Clinical PBS Specialist Agent, Quality Panel Lead Synthesizer).
3. Implementing an interactive **`BSPAuditStudioModal.tsx`** with real-time animated deliberation streams, visual gauges, red-flag alerts, and **1-Click Remediation** that directly mutates the active BSP in `useManagementStore`.
4. Providing **Official NDIS APO Submission Scorecard** export (Markdown/Print) and machine-readable JSON evaluation packages.

---

## 2. Tooling, Dependencies & Runtime Environment

### 2.1 Framework & Core Dependencies (`package.json`)
- **Framework**: Next.js `15.0.3` (App Router architecture with standalone output)
- **React Runtime**: React `19.0.0-rc-66855b96-20241106`, React DOM `19.0.0-rc-66855b96-20241106`
- **State Management**: `zustand` `^5.0.1` (`stores/useManagementStore.ts`)
- **Animation & Motion**: `motion` `^11.11.17` (`motion/react` / Framer Motion)
- **Icons**: `lucide-react` `^0.460.0`
- **Styling**: `tailwindcss` `^4.0.0-beta.1`, `@tailwindcss/postcss` `^4.0.0-beta.1`, `postcss` `^8.4.49`, `clsx` `^2.1.1`, `tailwind-merge` `^2.5.5`
- **AI & Cloud SDKs**: `@google/genai` `^0.1.2`, `firebase` `^11.0.2`
- **Date Utilities**: `date-fns` `^4.1.0`
- **TypeScript & Compilers**: `typescript` `^5`, `@types/node` `^20`, `@types/react` `npm:types-react@19.0.0-rc.1`, `@types/react-dom` `npm:types-react-dom@19.0.0-rc.1`
- **Linting**: `eslint` `^8`, `eslint-config-next` `15.0.3`

### 2.2 Path Configuration & Aliases (`tsconfig.json`)
- Target: `ES2017`, Module: `esnext`, Module Resolution: `bundler`, Strict: `true`, `isolatedModules`: `true`.
- Path alias: `"@/*": ["./*"]` allowing `@/types`, `@/stores/*`, `@/components/*`, `@/lib/*`.

### 2.3 Critical Discovery: `types.ts` vs `types/index.ts`
- **`types.ts` (Root, 458 lines)**: Contains the authoritative, superset TypeScript interfaces, including full clinical types: `BSPParticipantProfile`, `BSPFunctionalAssessment`, `BSPSkillTeaching`, `BSPActiveReactiveProtocols`, `RestrictivePracticeUsageLog`, `NDISMonthlyReturnRecord`, `AICopilotMessage`, `GoogleDriveFile`, `GoogleCalendarEvent`, `PRODABatch`, `ClinicalAssessmentRecord`, `PracticeBrandingConfig`, `NDISCommissionAuditPackage`, `ClinicBranch`, `ExtractedClinicalReport`, `OfflineSyncQueueItem`.
- **`types/index.ts` (Folder, 251 lines)**: Contains an older, truncated subset missing the 16 clinical/workspace types.
- **Architectural Action**: `types/index.ts` should re-export everything from `types.ts` (or be kept in perfect parity) to ensure imports from `@/types` resolve without discrepancy across all tooling.

---

## 3. BSP Data Models, Types & Schema Breakdown

### 3.1 `BSPDocument` Interface (`types.ts:205–225`)
```typescript
export interface BSPDocument {
  id: string;
  clientId: string;
  clientName: string;
  version: string; // e.g. "v2.1"
  status: string;  // "Draft" | "Panel Review" | "Submitted to NDIS" | "Active" | "Superseded" | "Published"
  summary: string;
  primaryBehaviorsOfConcern: string[];
  proactiveStrategies: string[];
  reactiveStrategies: string[];
  restrictivePractices: RestrictivePractice[];
  reviewDate: string;
  authorName: string;
  lastUpdated: string;
  participantProfile?: BSPParticipantProfile;
  functionalAssessment?: BSPFunctionalAssessment;
  skillTeaching?: BSPSkillTeaching;
  activeReactive?: BSPActiveReactiveProtocols;
  complianceScore?: number;
  missingComplianceItems?: string[];
}
```

### 3.2 6-Section Clinical Sub-Structures
1. **Participant Profile (`BSPParticipantProfile`)** (`types.ts:176–182`):
   - `communicationMode: string` (e.g., Multimodal AAC tablet, visual cards)
   - `sensoryPreferences: string[]` (e.g., Deep pressure, noise-cancelling headphones)
   - `strengthsAndInterests: string[]` (e.g., Lego engineering, train timetables)
   - `medicalHealthFactors: string` (e.g., Lactose intolerance, sleep cycle)
   - `decisionMakingPreferences: string` (e.g., Visual 2-choice forced choice)

2. **Functional Behaviour Assessment (`BSPFunctionalAssessment`)** (`types.ts:184–190`):
   - `targetBehaviors: { behavior: string; operationalDefinition: string; severity: number; frequency: string }[]`
   - `settingEvents: string[]` (e.g., Disrupted nighttime sleep <6h)
   - `immediateTriggers: string[]` (e.g., Sudden acoustic spike >75dB, unannounced transition)
   - `maintainingConsequences: string[]` (e.g., Temporary escape from noise)
   - `functionalHypothesis: string` (Synthesized clinical hypothesis detailing the function)

3. **Skill Teaching & FCT (`BSPSkillTeaching`)** (`types.ts:192–196`):
   - `replacementBehaviors: { target: string; replacement: string; teachingMethod: string }[]`
   - `functionalCommunicationTraining: string` (Core PECS / AAC symbols instruction)
   - `reinforcementSchedule: string` (e.g., Continuous FR1 during acquisition)

4. **Active & Reactive De-escalation (`BSPActiveReactiveProtocols`)** (`types.ts:198–203`):
   - `earlyWarningSigns: string[]` (e.g., Knuckle tapping, rapid breathing)
   - `activeDeescalationStrategies: string[]` (e.g., Low-pitch whisper, choice card)
   - `reactiveProtocols: string[]` (Phase 1 agitation, Phase 2 escalation, Phase 3 recovery)
   - `postIncidentDebrief: string` (Trauma-informed review within 24h)

5. **Regulated Restrictive Practices (`RestrictivePractice`)** (`types.ts:75–89`):
   - `id: string`, `clientId: string`, `clientName: string`
   - `practiceType: 'Chemical' | 'Mechanical' | 'Physical' | 'Environmental' | 'Seclusion'`
   - `description: string`
   - `status: 'Proposed' | 'Authorized' | 'Active' | 'Superseded' | 'Expired'`
   - `authorizationBody: string` (e.g., "VIC Senior Practitioner & NDIS Quality Commission")
   - `authorizationReference: string` (e.g., "RPR-2025-VIC-88102")
   - `startDate: string`, `expiryDate: string`
   - `reductionPlanSummary: string` (Mandatory fading schedule)
   - `monthlyReportStatus: 'Submitted' | 'Due' | 'Overdue'`

6. **Participant Context (`Client`)** (`types.ts:28–53`):
   - `id: string` (`cli-101`, `cli-102`, `cli-103`), `name: string`, `ndisNumber: string`, `primaryDisability: string`, `riskLevel: string`, `emergencyContact: { name, relationship, phone }`.

---

## 4. State Management & Data Flow Architecture

### 4.1 Zustand Management Store (`stores/useManagementStore.ts`)
- The store is created using `create<ManagementState>((set, get) => ({ ... }))`.
- **Core BSP State**:
  - `bspDocuments: BSPDocument[]` (seeded from `INITIAL_BSP_DOCUMENTS` in `lib/mock-data.ts`)
  - `clients: Client[]` (seeded from `INITIAL_CLIENTS`)
  - `restrictivePractices: RestrictivePractice[]` (seeded from `INITIAL_RESTRICTIVE_PRACTICES`)
  - `abcLogs: ABCLog[]` (seeded from `INITIAL_ABC_LOGS`)
- **Key Store Actions**:
  - `addBSPDocument(docData)`: Creates unique `bsp-${Date.now()}`, timestamps `lastUpdated`, logs audit trail.
  - `updateBSPDocument(id, updates)`: Updates matching document in `bspDocuments` state array, updates `lastUpdated`, logs audit trail.
  - `importFbaToBsp(clientId, fbaData)`: Merges functional assessment fields into participant's BSP.
  - `transferReportToBsp(reportId, clientId)`: Appends clinical report recommendations into proactive strategies.
  - `addAuditLog(action, entity, entityId, details)`: Appends to immutable governance audit trail.
  - `addNotification(notification)`: Dispatches real-time UI notification badge.

### 4.2 How BSP Data is Read and Modified in the UI (`BSPModule.tsx`)
- In `components/features/BSPModule.tsx`:
  - `selectedClientId` selects active participant (defaults to `cli-101` Jordan Miller).
  - `activeBsp` is resolved via `bspDocuments.find((d) => d.clientId === selectedClientId)`.
  - Local `formData` is initialized from `activeBsp` and updated on input changes.
  - `handleSaveBsp()` maps `formData` back into `BSPDocument` payload and calls `updateBSPDocument(activeBsp.id, docPayload)`.
  - `calculateAuditScore()` currently runs a trivial local check subtracting arbitrary points for short strings.
- **Remediation Hook**: When a 1-Click Remediation is triggered, the store's `updateBSPDocument` action must be invoked with the patched fields, and local component states (`formData` in `BSPModule`) must synchronize seamlessly.

---

## 5. Regulatory Alignment: 12 NDIS Quality Indicators & 4 Pillars

The evaluation engine must assess BSP documents against the **NDIS Quality and Safeguards Commission Positive Behaviour Support Capability Framework** and the **National Disability Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018**.

| Regulatory Pillar | Indicator ID | NDIS Quality Indicator Name | Regulatory Standard Reference | Evaluation Focus |
|---|---|---|---|---|
| **Pillar 1: Rights, Dignity & Consent** | **QI-01** | Participant Consultation & Informed Consent | Rules 2018 s.19, Core Module 1.2 | Evidence of participant & guardian consultation, communication accommodation, and informed consent. |
| | **QI-02** | Dignity of Risk & Least Restrictive Principle | Act 2013 s.4, PBS Framework 1.1 | Confirmation that interventions are least restrictive and preserve dignity of risk. |
| | **QI-03** | Regulated Restrictive Practice Classification & Legal Authorisation | Rules 2018 s.6-11, s.18 | Exact classification (Chemical/Mechanical/Physical/Environmental/Seclusion) with state authorization ref and valid expiry. |
| **Pillar 2: Evidence-Based Assessment** | **QI-04** | Operational Target Behavior Definitions | PBS Framework 2.1 | Clear, measurable operational definitions with intensity, frequency, and severity ratings. |
| | **QI-05** | Multi-Factor Functional Hypothesis | PBS Framework 2.2 | Multi-variable functional hypotheses identifying behavioral function (Escape, Tangible, Sensory, Attention). |
| | **QI-06** | Ecological & Antecedent Setting Event Analysis | PBS Framework 2.3 | Analysis of physiological setting events (sleep, diet, pain), environmental noise, and immediate triggers. |
| **Pillar 3: Positive PBS & Skill Teaching** | **QI-07** | Proactive Environmental & Ecological Accommodations | PBS Framework 3.1 | Measurable antecedent adaptations (visual schedules, sensory tools, lighting, transition warnings). |
| | **QI-08** | Functional Communication Training (FCT) & Replacement Skills | PBS Framework 3.2 | Explicit replacement skill protocols (DRA/FCT), AAC symbol training, and errorless teaching methods. |
| | **QI-09** | Positive Reinforcement & Motivational Schedules | PBS Framework 3.3 | Systematic differential reinforcement schedules (e.g., FR1, intermittent praise) for replacement behaviors. |
| **Pillar 4: Crisis, Reduction & Governance** | **QI-10** | Tiered Low-Arousal De-escalation & Reactive Protocols | PBS Framework 4.1 | Step-by-step tiered response protocols (agitation, escalation, recovery) and trauma-informed post-incident debriefing. |
| | **QI-11** | Restrictive Practice Fading & Elimination Schedule | Rules 2018 s.21(3) | Concrete, time-bound measurable reduction benchmarks, fading criteria, and environmental desensitization plans. |
| | **QI-12** | Clinical Review Timelines & Authorised Practitioner Governance | Rules 2018 s.20, PBS Framework 4.2 | Mandated review date (<12 months), registered PBS practitioner sign-off, and NDIS Commission monthly return compliance. |

---

## 6. Architecture & Implementation Plan for Multi-Agent Auditor

```
c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\
├── types/
│   ├── index.ts                     # Synchronized barrel export
│   └── bsp-audit.ts                 # Multi-agent audit types, rubric interfaces & scores
├── lib/
│   ├── bsp-auditor/
│   │   ├── indicators.ts            # 12 NDIS Quality Indicators definitions & scoring logic
│   │   ├── agent-evaluator.ts       # 3 Specialized Agent perspectives & deliberation pipeline
│   │   ├── remediation-engine.ts    # 1-Click remediation patch generator & store updater
│   │   └── apo-exporter.ts          # NDIS APO Submission Scorecard (Markdown & JSON)
├── components/
│   └── features/
│       ├── BSPAuditStudioModal.tsx  # Interactive Multi-Agent Studio & Scorecard UI Modal
│       └── BSPModule.tsx            # Integrated button & real-time badge updates
└── stores/
    └── useManagementStore.ts        # Extended with audit actions if required
```

### 6.1 The 3 Specialized Agent Perspectives
1. **Human Rights & Legal Safeguards Agent**:
   - Focus: Participant consent, dignity of risk, restrictive practice classification (Chemical, Mechanical, Physical, Environmental, Seclusion), legislative authorization status (State Senior Practitioner / NDIS Commission rules 2018).
   - Generates: Specific deliberation trace entries, rights compliance score (0-100), red-flag alerts for missing authorization references or expired dates.
2. **Clinical PBS Specialist Agent**:
   - Focus: Functional behavioral hypotheses (escape, tangible, sensory, attention), antecedent modifications, proactive environmental accommodations, replacement behavior skill training (FCT, reinforcement schedule).
   - Generates: Clinical quality score (0-100), operational definition audits, red flags for missing FCT protocols or generic hypotheses.
3. **Quality Panel Lead Synthesizer**:
   - Focus: Cross-perspective aggregation, computes authoritative 0-100% Quality Scorecard across 4 regulatory pillars, isolates red-flag compliance risks, synthesizes consensus narrative and APO endorsement recommendation.

### 6.2 1-Click Remediation Engine
When a high-severity red flag is isolated (e.g., missing FCT protocol, incomplete functional hypothesis, missing restrictive practice fading schedule, or unreferenced authorization), the remediation engine generates a targeted clinical patch. Clicking **"Apply 1-Click Remediation"**:
1. Injects the synthesized, compliant content directly into the participant's `BSPDocument` via `useManagementStore.getState().updateBSPDocument(bspId, patch)`.
2. Updates `useManagementStore` audit log (`addAuditLog`).
3. Dispatches a confirmation notification (`addNotification`).
4. Re-runs the multi-agent evaluator to immediately reflect the improved compliance score and clear the red flag.

### 6.3 Official NDIS APO Export
- **Markdown / Printable Format**: Formatted with Provider Registration Number, Participant NDIS ID, 4 Pillar Scores, 12 Quality Indicator Breakdown, Agent Deliberations, Remediation Ledger, and Lead Practitioner Signature Block.
- **Machine-Readable JSON Package**: Contains full audit metadata, timestamps, indicator scorecards, red flags, agent traces, and checksum for NDIS Quality Commission record keeping.

---

## 7. Next Steps for Implementation Team

1. **Synchronize `types/index.ts` and create `types/bsp-audit.ts`**.
2. **Implement `lib/bsp-auditor/indicators.ts` and `lib/bsp-auditor/agent-evaluator.ts`**.
3. **Implement `lib/bsp-auditor/remediation-engine.ts` and `lib/bsp-auditor/apo-exporter.ts`**.
4. **Implement `components/features/BSPAuditStudioModal.tsx`**.
5. **Integrate the Audit Studio into `BSPModule.tsx`, `Header.tsx`, and `ComplianceDashboard.tsx`**.
6. **Verify build, TypeScript compliance, and end-to-end user workflows**.
