# Original User Request

## Initial Request — 2026-08-16T10:02:42Z

Build 6 major capabilities for Breakthrough OS, an existing production-grade NDIS practice management platform built with Next.js, TypeScript, Zustand, and Tailwind CSS. The platform already has 21 feature modules across clinical, compliance, billing, HR, and interoperability domains. These 6 new capabilities add participant outcome tracking, staff credential management, a referral intake pipeline, cross-module analytics, an intelligent notification system, and AI-powered workflow automation.

Working directory: c:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main
Integrity mode: development

## Requirements

### R1. Participant Outcome Tracking & NDIS Plan Management Module

Build a new full-featured module (`OutcomeTrackingModule.tsx`) integrated into the existing tab navigation system via `useManagementStore`. This module provides:

- NDIS plan budget tracking with line-item utilization percentages showing spend against allocated funding per support category.
- Goal Attainment Scaling (GAS) measurement with T-score computation, allowing practitioners to set expected levels (-2 to +2) and track participant progress over time.
- Visual progress timelines showing goal trajectories over reporting periods using interactive charts.
- Outcome comparison dashboards displaying baseline vs. current measurements across multiple clinical domains.
- A plan review preparation wizard that compiles evidence from case notes, BSP progress, incident records, and billing data into a structured review summary.
- Automated plan expiry warnings and renewal workflow triggers that surface upcoming plan end dates and prompt action.

All data models must be added to `useManagementStore.ts` with realistic NDIS-contextual mock data in `lib/mock-data.ts`.

### R2. Staff Training & Credential Management Module

Build a new module (`StaffTrainingModule.tsx`) for managing practitioner professional development and compliance credentials:

- CPD (Continuing Professional Development) hours tracker with configurable annual targets per registration type.
- Certification and registration expiry calendar with visual timeline and automated alerts for upcoming expirations.
- Staff onboarding checklist workflows covering orientation, mandatory training modules, and supervision requirements.
- Clinical competency matrix mapping each practitioner to their service delivery areas and skill levels.
- NDIS Worker Screening Check status tracking with renewal reminders.
- Training module library with completion tracking and quiz-based assessment for verifying knowledge retention.

### R3. Referral & Intake Pipeline Module

Build a new module (`ReferralIntakeModule.tsx`) managing the complete referral-to-client conversion lifecycle:

- Referral intake form with configurable triage fields and automated priority scoring based on urgency, complexity, and service availability.
- Waitlist management with estimated service commencement dates and position tracking.
- Automated service agreement generation from approved referrals, pulling participant details into a structured agreement template.
- Multi-stage intake assessment workflow (initial screen → clinical assessment → service matching → onboarding) with stage tracking and handoff notes.
- Integration with the existing CRM leads pipeline (`CRMModule.tsx`) for seamless referral-to-client conversion.
- Referral source tracking and conversion analytics showing referral volume, conversion rates, and average time-to-service by source.

### R4. Advanced Analytics & Business Intelligence Engine

Build a cross-cutting analytics layer (`AnalyticsDashboardModule.tsx`) that aggregates data from all existing and new modules:

- Executive summary dashboard with KPIs across all modules: active clients, monthly revenue, compliance health, clinical outcomes.
- Practitioner productivity analytics: sessions delivered, case notes completed, utilization rates, and caseload distribution.
- Financial analytics: revenue trends over time, claim success/rejection rates, outstanding invoices, and budget forecasts.
- Clinical outcome analytics: aggregated GAS scores across the practice, BSP compliance trends, and incident pattern analysis.
- Compliance health scorecard: overdue tasks, expiring credentials, pending audits, and risk indicators.
- Exportable board/management reports rendered as printable formatted summaries.

This module must read from existing store data (clients, billing claims, case notes, BSP documents, incidents, practitioners) and from the new R1/R2/R3 data models.

### R5. Intelligent Notification & Alert System

Build a cross-cutting notification system that surfaces actionable alerts across all modules:

- Smart notification center component accessible from the Header with priority-based filtering (critical, warning, info) and categorization by module.
- Compliance deadline alerts for BSP review dates, credential expiry dates, audit submission deadlines, and plan end dates.
- Escalation workflows that auto-escalate unacknowledged critical alerts to supervisor-level users after a configurable timeout.
- Daily/weekly digest summary generation compiling key practice metrics and pending actions.
- In-app notification bell icon in the Header with real-time unread badge count.
- Configurable notification preferences per user role allowing users to opt in/out of specific alert categories.

The notification data model and store must be added to `useManagementStore.ts`. The notification bell must be added to the existing `Header.tsx`.

### R6. AI-Powered Workflow Automation Engine

Build an intelligent workflow automation layer that operates across all modules:

- Smart task assignment engine that matches incoming work items to practitioners based on their expertise areas, current caseload, and availability.
- Automated follow-up triggers: when certain events occur (e.g., incident logged, BSP review overdue, credential expiring), automatically create corresponding follow-up tasks assigned to the responsible practitioner.
- Workflow templates for common clinical processes (referral intake → assessment → plan creation → service delivery → review) with configurable stages and automated transitions.
- Predictive workload balancing that visualizes practitioner capacity and suggests reallocation when imbalances are detected.
- Auto-routing of new referrals to the most appropriate available practitioner based on specialization match and capacity.
- Batch action capabilities allowing supervisors to bulk approve, bulk assign, or bulk update multiple records simultaneously.

## Acceptance Criteria

### Module Integration & Architecture
- [ ] All 3 new modules (R1, R2, R3) are accessible via the existing tab navigation in `useManagementStore` and render correctly within the application layout.
- [ ] All new data models are properly typed in TypeScript and integrated into `useManagementStore.ts` with appropriate CRUD operations.
- [ ] Realistic NDIS-contextual mock data is provided in `lib/mock-data.ts` for all new data models, with at least 5 representative records per entity type.
- [ ] All cross-cutting features (R4, R5, R6) read from and interact with both existing and new module data without introducing circular dependencies.

### Participant Outcome Tracking (R1)
- [ ] GAS T-score computation produces mathematically correct scores given a set of goals with expected levels and actual outcomes.
- [ ] Plan budget utilization correctly calculates percentage spent per support category from billing claim data.
- [ ] The plan review wizard compiles data from at least 3 different source modules (case notes, BSP, billing) into a structured summary.

### Staff Training & Credentials (R2)
- [ ] CPD tracker correctly computes remaining hours against annual targets and displays progress.
- [ ] Credential expiry alerts correctly identify credentials expiring within configurable warning periods (30, 60, 90 days).
- [ ] Onboarding workflow tracks completion status across all checklist items and prevents skipping mandatory steps.

### Referral & Intake (R3)
- [ ] Priority scoring algorithm produces consistent, deterministic scores given the same input triage fields.
- [ ] Waitlist position updates correctly when referrals are approved, declined, or reordered.
- [ ] Service agreement generation produces a complete, formatted agreement document from referral and participant data.

### Analytics (R4)
- [ ] Executive dashboard KPIs are computed from actual store data, not hardcoded values.
- [ ] All charts and visualizations render correctly with the provided mock data.
- [ ] Board report export produces a clean, formatted document suitable for management review.

### Notifications (R5)
- [ ] Notification bell appears in the Header with an accurate unread count badge.
- [ ] At least 5 different event types across different modules generate appropriate notifications.
- [ ] Escalation workflow correctly promotes unacknowledged critical alerts after the configured timeout period.

### Workflow Automation (R6)
- [ ] Smart task assignment selects an appropriate practitioner based on at least 2 matching criteria (expertise and caseload).
- [ ] At least 3 different event types correctly trigger automated follow-up task creation.
- [ ] Batch actions successfully process multiple selected records in a single operation.
