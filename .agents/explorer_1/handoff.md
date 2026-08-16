# Handoff Report: Codebase Architecture & BSP Data Models Explorer
**Agent**: Explorer 1  
**Working Directory**: `c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\.agents\explorer_1`  
**Date**: 2026-08-16  
**Type**: Hard (Task Complete)

---

## 1. Observation

1. **Framework & Dependencies (`package.json:1-36`)**:
   - Next.js `15.0.3` with App Router (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`).
   - React `19.0.0-rc-66855b96-20241106` and React DOM `19.0.0-rc-66855b96-20241106`.
   - `zustand` `^5.0.1` for global state management.
   - `motion` `^11.11.17` (`motion/react` / Framer Motion) for animations.
   - `lucide-react` `^0.460.0` for icons.
   - `tailwindcss` `^4.0.0-beta.1` and `@tailwindcss/postcss` `^4.0.0-beta.1`.
   - `@google/genai` `^0.1.2` and `firebase` `^11.0.2`.

2. **TypeScript & Aliases (`tsconfig.json:1-28`)**:
   - Path alias `"@/*": ["./*"]`.
   - `types.ts` in root contains the full superset (458 lines) with 16 advanced clinical types (`BSPParticipantProfile`, `BSPFunctionalAssessment`, `BSPSkillTeaching`, `BSPActiveReactiveProtocols`, `RestrictivePracticeUsageLog`, `NDISMonthlyReturnRecord`, `AICopilotMessage`, `GoogleDriveFile`, `GoogleCalendarEvent`, `PRODABatch`, `ClinicalAssessmentRecord`, `PracticeBrandingConfig`, `NDISCommissionAuditPackage`, `ClinicBranch`, `ExtractedClinicalReport`, `OfflineSyncQueueItem`), while `types/index.ts` contains a truncated 251-line subset.

3. **BSP Document Model (`types.ts:205-225`)**:
   - `BSPDocument` contains `id`, `clientId`, `clientName`, `version`, `status`, `summary`, `primaryBehaviorsOfConcern`, `proactiveStrategies`, `reactiveStrategies`, `restrictivePractices`, `reviewDate`, `authorName`, `lastUpdated`, `participantProfile`, `functionalAssessment`, `skillTeaching`, `activeReactive`, `complianceScore`, `missingComplianceItems`.

4. **State Store Actions (`stores/useManagementStore.ts:514-556`)**:
   - `addBSPDocument`: creates ID `bsp-${Date.now()}`, sets `lastUpdated`, prepends to `bspDocuments`, writes to `auditLogs`.
   - `updateBSPDocument`: updates matching document in `bspDocuments`, updates `lastUpdated`, writes to `auditLogs`.
   - `importFbaToBsp`: updates functional assessment for a participant's BSP.
   - `transferReportToBsp`: appends strategies from extracted medical reports into BSP proactive strategies.

5. **Existing BSP Authoring UI (`components/features/BSPModule.tsx:1-1431`)**:
   - Manages local `formData` representing the 6 BSP sections.
   - Saves via `handleSaveBsp()` calling `updateBSPDocument(activeBsp.id, docPayload)`.
   - Contains a rudimentary heuristic `calculateAuditScore()` (lines 243-273) that merely subtracts points for short string lengths.
   - Lacks the autonomous 3-agent deliberation pipeline, 12 NDIS Quality Indicator scorecard, red-flag alert dashboard, and 1-click remediation.

---

## 2. Logic Chain

1. **Premise 1 (From Obs 1 & 2)**: The project is a Next.js 15 + React 19 + TypeScript app using Zustand for all data mutations and Framer Motion (`motion/react`) for animated interfaces.
2. **Premise 2 (From Obs 3 & 4)**: The canonical clinical data model is `BSPDocument` in `types.ts`, and state mutations are already centralized in `useManagementStore.ts` via `updateBSPDocument` and `addBSPDocument`.
3. **Premise 3 (From Obs 5)**: The existing `BSPModule.tsx` provides full 6-section BSP authoring, but its compliance scoring is basic and non-standardized.
4. **Inference**: To satisfy User Request R1, R2, and R3 without destabilizing existing features:
   - Synchronize `types/index.ts` with `types.ts` and add `types/bsp-audit.ts` to type the 12 NDIS Quality Indicators, 4 Pillars, 3 Agent perspectives, Deliberation Traces, Red Flags, and Scorecards.
   - Implement a modular multi-agent evaluation engine in `lib/bsp-auditor/` (`indicators.ts`, `agent-evaluator.ts`, `remediation-engine.ts`, `apo-exporter.ts`) that runs deterministic clinical rubric checks + optional Gemini enhancement, producing instant deliberation streams and red-flag alerts.
   - Build `components/features/BSPAuditStudioModal.tsx` displaying animated deliberation streams, 4 pillar gauges, 12 indicator cards, red-flag banners with "1-Click Remediate" buttons that call `updateBSPDocument()`, and export tools for NDIS APO reports.
   - Wire the audit trigger button into `BSPModule.tsx` header and compliance scoreboard.

---

## 3. Caveats

1. **No active package manager / local node_modules in sandbox**: Development and build commands should adhere to standard Next.js / TypeScript rules; all imports must align with packages declared in `package.json` (`motion/react`, `lucide-react`, `zustand`, `clsx`, `tailwind-merge`, `@google/genai`).
2. **API Key Fallback**: If `GEMINI_API_KEY` is not present in `.env`, the multi-agent engine in `lib/bsp-auditor/agent-evaluator.ts` must execute fully offline using comprehensive deterministic clinical heuristic rules and simulated streaming traces so all 12 indicators evaluate accurately.

---

## 4. Conclusion

The codebase architecture is clean, highly structured, and well-suited for the autonomous multi-agent auditor. The state management in `stores/useManagementStore.ts` is robust, and `BSPDocument` contains all 6 required clinical sections.

The recommended architectural target locations are:
1. `types/bsp-audit.ts` (Multi-Agent types & NDIS Quality Indicators schema)
2. `lib/bsp-auditor/` (Indicators rubric, Agent evaluator, Remediation engine, APO exporter)
3. `components/features/BSPAuditStudioModal.tsx` (Interactive deliberation studio & scorecard UI)
4. `components/features/BSPModule.tsx` (Trigger button & synchronization)

Detailed architectural breakdown is documented in `.agents/explorer_1/analysis.md`.

---

## 5. Verification Method

To independently verify this exploration:
1. View `package.json` to verify Next.js 15, React 19, Zustand 5, Tailwind 4, Lucide icons, and Motion dependencies.
2. View `types.ts:205-225` to inspect `BSPDocument` and its sub-interfaces (`BSPParticipantProfile`, `BSPFunctionalAssessment`, `BSPSkillTeaching`, `BSPActiveReactiveProtocols`).
3. View `stores/useManagementStore.ts:514-556` to inspect `addBSPDocument`, `updateBSPDocument`, and `importFbaToBsp`.
4. View `components/features/BSPModule.tsx:243-273` to inspect existing heuristic scoring and authoring canvas.
5. Inspect `.agents/explorer_1/analysis.md` for full implementation blueprints.
