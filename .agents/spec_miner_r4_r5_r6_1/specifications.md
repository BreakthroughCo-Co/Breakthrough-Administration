# Breakthrough OS: Technical Specification for R4, R5 & R6

**Document Version:** 1.0.0  
**Target Milestone:** Full Specification Mining for Capabilities R4, R5, and R6  
**Integrity Mode:** Development / Production-Ready Architecture  
**Author:** Specification Miner (R4-R6)  

---

## 1. Executive Summary & Architectural Overview

Breakthrough OS is a mission-critical NDIS Practice Management and Clinical Governance platform built with Next.js 15 (App Router), React 19, TypeScript, Zustand 5, and Tailwind CSS. The system currently supports 21 feature modules. This specification establishes the authoritative data contracts, mathematical algorithms, event-driven pipelines, state store extensions, UI interactions, and testable acceptance criteria for three core cross-cutting capabilities:

- **R4: Advanced Analytics & Business Intelligence Engine (`AnalyticsDashboardModule.tsx`)**
  A centralized, real-time analytics aggregation layer that reads dynamically from both existing modules (`clients`, `billingClaims`, `caseNotes`, `bspDocuments`, `incidents`, `practitioners`, `restrictivePractices`) and new modules (`outcome-tracking`, `staff-training`, `referral-intake`), computing practice-wide executive KPIs, practitioner productivity metrics, financial intelligence, clinical outcome trends (aggregated GAS T-scores), compliance health scorecards, and exportable A4 printable board reports.

- **R5: Intelligent Notification & Alert System (Header Bell + Notification Center + Escalations)**
  A real-time notification engine operating across all clinical and administrative domains. Surfaces actionable alerts with priority-based filtering (`CRITICAL`, `WARNING`, `INFO`), compliance deadline countdowns (BSP reviews, credential expiries, audit deadlines, plan end dates), multi-tier escalation timeouts (promoting unacknowledged critical alerts to supervisors), automated daily/weekly digest generators, and user/role-based notification preferences.

- **R6: AI-Powered Workflow Automation Engine (`WorkflowAutomationModule.tsx`)**
  An intelligent workflow orchestration layer providing multi-factor weighted matching for smart task assignment, automated event-driven triggers (incident logged $\rightarrow$ 5-day NDIS lodgement task; BSP overdue $\rightarrow$ review task; credential expiring $\rightarrow$ renewal task), configurable multistage clinical workflow templates, predictive capacity-based workload balancing and reallocation suggestions, auto-routing of incoming referrals, and transactional batch operations (bulk approve, assign, update).

---

## 2. Features Discovered & Traceability Matrix

### Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | R4 Analytics | Dynamic Executive KPIs | Computes real-time active clients, MTD revenue, compliance health index (0-100), and average GAS outcome score from store entities. | `clients`, `billingClaims`, `bspDocuments`, `incidents`, `practitioners`, `clientGoals` | `ExecutiveKPIs` object with numerical values, trend percentages, and status indicators. | Gracefully defaults to 0 or baseline if store arrays are empty. | ORIGINAL_REQUEST §R4 |
| 2 | R4 Analytics | Practitioner Productivity Matrix | Aggregates sessions delivered, billable hours, case note completion rates, active caseload vs limit, and utilization percentage per practitioner. | `practitioners`, `caseNotes`, `clients` | Array of `PractitionerProductivity` records with utilization rate %, billable revenue, and note compliance %. | Fallback to 0% utilization if standard hours are undefined; bounds utilization to positive numbers. | ORIGINAL_REQUEST §R4 |
| 3 | R4 Analytics | Financial Intelligence & AR Aging | Computes revenue trends over time, claim success/rejection percentages, outstanding invoice aging buckets (0-30d, 31-60d, 61-90d, 90+d), and budget forecast burn. | `billingClaims`, `prodaBatches`, `clients` | `FinancialAnalytics` structure with monthly revenue series, claim breakdown, and aging receivables. | Flags unlinked claims or negative totals; handles partial payments. | ORIGINAL_REQUEST §R4 |
| 4 | R4 Analytics | Clinical Outcomes & GAS Aggregation | Aggregates Goal Attainment Scaling (GAS) scores across participants, computing practice-wide mean T-scores, domain distributions, and BSP compliance trends. | `clients.goals`, `bspDocuments`, `incidents` | `ClinicalOutcomeAnalytics` containing GAS distribution (-2 to +2), mean T-score, BSP score distribution, incident frequency. | Ignores unrated goals; applies Kiresuk-Sherman formula with $\rho=0.3$. | ORIGINAL_REQUEST §R4 |
| 5 | R4 Analytics | Compliance Health Scorecard | Evaluates overdue BSP reviews, expiring worker screening/credentials, pending 5-day incident submissions, and unauthorized restrictive practices into a weighted score. | `bspDocuments`, `practitioners`, `incidents`, `restrictivePractices` | `ComplianceScorecard` with composite 0-100 score, pillar breakdowns, and red-flag risk indicators. | Caps penalties to prevent negative overall score (min 0, max 100). | ORIGINAL_REQUEST §R4 |
| 6 | R4 Analytics | Printable Board & Management Report | Generates structured, print-optimized A4 report summary with executive KPIs, financial status, clinical outcomes, and governance sign-off blocks. | `AnalyticsReportFilter` (date range, clinic branch, report sections) | Formatted HTML/CSS printable layout + JSON export package. | Displays "No Data in Period" placeholder if filtered range has 0 records. | ORIGINAL_REQUEST §R4 |
| 7 | R5 Notifications | Header Bell & Real-time Badge | Persistent interactive notification bell in `Header.tsx` displaying animated unread badge count with real-time state synchronization. | `notifications` array from `useManagementStore` | Header bell UI with numeric badge (0-99+), popover trigger, and click handlers. | Hides badge when unread count is 0; handles overflow > 99 gracefully (`99+`). | ORIGINAL_REQUEST §R5 |
| 8 | R5 Notifications | Smart Notification Center | Flyout popover / slide-over drawer with priority filtering (`CRITICAL`, `WARNING`, `INFO`), module categories, search, and 1-click deep navigation. | User clicks bell; filter selections; search queries | Categorized notification list, read/unread toggles, dismiss action, direct tab router. | Validates target `linkTab` before dispatching navigation; fallback to `command-center`. | ORIGINAL_REQUEST §R5 |
| 9 | R5 Notifications | Compliance Deadline Evaluator | Evaluates approaching deadlines: BSP reviews (60d/30d/14d), credential expiries (90d/60d/30d), plan end dates (90d/60d/30d/14d), monthly returns (5th of month). | Dates in `clients`, `practitioners`, `bspDocuments`, `restrictivePractices` | Auto-generated notifications in store with calculated urgency and target links. | De-duplicates existing active alerts to avoid spamming notification list. | ORIGINAL_REQUEST §R5 |
| 10 | R5 Notifications | Auto-Escalation Workflow Engine | Promotes unacknowledged `CRITICAL` alerts to supervisor/admin roles after configurable timeout (e.g. 2h for critical incidents, 24h for credential blocks). | `notifications`, `escalationRules`, current system time | Escalated notification with elevated severity, supervisor notification, and escalation audit log. | Prevents circular re-escalation once reaching top admin tier. | ORIGINAL_REQUEST §R5 |
| 11 | R5 Notifications | Daily & Weekly Digest Generator | Synthesizes daily/weekly practice briefing summarizing key metrics, unbilled notes, pending approvals, and upcoming critical deadlines. | `DigestConfig` (frequency, user role, clinic branch) | Structured digest object with printable/exportable summary and email-ready markdown. | Handles zero-event days with positive reassurance ("All compliance tasks up to date"). | ORIGINAL_REQUEST §R5 |
| 12 | R5 Notifications | Role-Based Notification Preferences | Configurable opt-in/opt-out settings per user role and individual user across notification categories and delivery channels. | `NotificationPreference` settings per user | Filtered notification delivery matching user preference matrix. | Mandatory critical alerts (e.g., NDIS reportable incidents) cannot be opted out. | ORIGINAL_REQUEST §R5 |
| 13 | R6 Automation | Smart Task Assignment Engine | Matches tasks or incoming referrals to practitioners using weighted multi-factor scoring (specialty match, available capacity, PBS level, proximity). | `TaskItem` or `Referral`, `practitioners`, `competencies` | Ranked list of practitioner match recommendations with percentage fit and match rationale. | If all practitioners are at 100% capacity, flags task as "Waitlisted / Over-capacity". | ORIGINAL_REQUEST §R6 |
| 14 | R6 Automation | Event-Driven Follow-Up Triggers | Listens to store mutations and automatically creates assigned follow-up tasks with due dates upon trigger events (Incidents, BSP expiries, Screening expiries). | Store event actions (`addIncident`, `updateBSPDocument`, `updatePractitioner`) | Newly created `AutomatedTask` inserted into store with linked entity references. | Prevents duplicate task generation if an open task already exists for the same event. | ORIGINAL_REQUEST §R6 |
| 15 | R6 Automation | Clinical Process Workflow Templates | Configurable multi-stage state machines for clinical lifecycles (Intake $\rightarrow$ Assessment $\rightarrow$ FBA $\rightarrow$ BSP $\rightarrow$ Training $\rightarrow$ Review) with validation gates. | `WorkflowTemplate`, active workflow state, user transition triggers | Current stage, next available actions, completed checklist items, stage SLA timers. | Blocks transition if required validation gates/evidence items are incomplete. | ORIGINAL_REQUEST §R6 |
| 16 | R6 Automation | Predictive Workload Balancing | Computes practitioner capacity load (Overloaded > 90%, Balanced 60-90%, Under-utilized < 60%) and recommends low-friction client reallocations. | `practitioners`, `clients`, `caseNotes` | Workload distribution chart + actionable reallocation suggestions with 1-click reassign. | Respects primary clinical specialization constraints during reallocation. | ORIGINAL_REQUEST §R6 |
| 17 | R6 Automation | Intelligent Referral Auto-Routing | Automatically scores incoming referrals against practitioner clinical profiles, triage urgency, and regional clinic branch to assign the optimal practitioner. | `Referral` entity (complexity, disability, location, funding) | Auto-assignment recommendation with confidence score and intake stage initialization. | Requires supervisor confirmation if match confidence score is below 70%. | ORIGINAL_REQUEST §R6 |
| 18 | R6 Automation | Transactional Batch Action Engine | Enables bulk operations for supervisors: bulk approve (case notes, claims, referrals), bulk assign (tasks, clients), and bulk update status with audit logs. | `selectedIds`, `actionType`, `targetPayload`, `actorProfile` | `BatchActionResult` with success count, failed count, and rollback log entries. | Atomic execution per item; records error details for failed items without aborting entire batch. | ORIGINAL_REQUEST §R6 |

---

### Edge Cases

| # | Feature | Input / Condition | Observed / Required Behavior |
|---|---------|-------------------|-----------------------------|
| 1 | R4 Analytics | Practice with 0 billing claims or 0 clients (fresh install or clean database). | All financial ratios, utilization rates, and KPI cards return valid zero/placeholder values without `NaN`, `Infinity`, or division by zero errors. |
| 2 | R4 Analytics | Participant with goals having equal or baseline GAS scores (-2 baseline only). | Mathematical GAS T-score computation computes exact standard score ($T \approx 21.8$ for all -2s, $T = 50.0$ for all 0s, $T \approx 78.2$ for all +2s) without arithmetic underflow. |
| 3 | R4 Analytics | Board Report Export with wide date filter spanning multi-year leap years. | Aggregator correctly partitions calendar months across years (e.g. "Aug 2025" vs "Aug 2026") and correctly calculates MTD vs YTD totals. |
| 4 | R5 Notifications | User switches role from `PRACTITIONER` to `VIEWER` or switches user account in Header. | Unread badge and notification center immediately filter out role-restricted alerts and re-calculate the accurate unread count for the active user context. |
| 5 | R5 Notifications | Critical incident logged while system is offline or simulated offline mode. | Notification is queued with `CRITICAL` severity locally, escalation timer begins immediately, and is synchronized upon network reconnection. |
| 6 | R5 Notifications | Alert auto-escalation timer fires when assigned supervisor is also the primary practitioner. | Escalation engine detects same-user conflict and skips directly to Practice Admin (`usr-1`) to ensure true supervisory oversight. |
| 7 | R6 Automation | Smart task assignment when two practitioners have identical match scores. | Deterministic tie-breaking rule applies: lowest current active caseload count takes precedence; if equal, highest historical completion rating wins. |
| 8 | R6 Automation | Batch approve triggered on 50 billing claims where 2 claims have missing NDIS support item codes. | 48 valid claims are approved and marked `Claimed`; 2 invalid claims are preserved with status `Draft/Pending` and an itemized failure report is returned. |
| 9 | R6 Automation | Multiple automated triggers fire simultaneously (e.g. bulk CSV import of 10 expiring credentials). | Trigger debounce and idempotency deduplication ensures exactly 1 follow-up task is created per practitioner without race conditions. |
| 10 | R6 Automation | Workflow state transition triggered with missing mandatory checklist item. | Transition action is rejected with explicit descriptive validation error modal listing the specific missing document or approval signature. |

---

## 3. Data Models & TypeScript Interface Specifications

Below are the exact TypeScript type definitions to be added to `types.ts`.

```typescript
// ============================================================================
// CAPABILITY R4: ADVANCED ANALYTICS & BUSINESS INTELLIGENCE MODELS
// ============================================================================

export type MetricTrendDirection = 'UP' | 'DOWN' | 'NEUTRAL';

export interface MetricTrend {
  value: number;
  percentageChange: number;
  direction: MetricTrendDirection;
  periodComparisonLabel: string; // e.g. "vs previous 30 days"
}

export interface ExecutiveSummaryKPIs {
  activeClientsCount: number;
  activeClientsTrend: MetricTrend;
  monthlyRevenueTotal: number;
  monthlyRevenueTrend: MetricTrend;
  complianceHealthScore: number; // 0 to 100
  complianceHealthTrend: MetricTrend;
  clinicalOutcomesAvgGasTScore: number; // Standard 50 is expected outcome
  clinicalOutcomesTrend: MetricTrend;
  overallBillableUtilizationRate: number; // 0 to 100%
  activePractitionersCount: number;
  pendingCriticalAlertsCount: number;
}

export interface PractitionerProductivityMetric {
  practitionerId: string;
  practitionerName: string;
  pbsRegistrationLevel: 'Core' | 'Proficient' | 'Advanced' | 'Specialist' | string;
  activeCaseload: number;
  caseloadLimit: number;
  capacityUtilizationPercent: number; // (activeCaseload / caseloadLimit) * 100
  sessionsDeliveredThisMonth: number;
  billableHoursDelivered: number;
  billableRevenueGenerated: number;
  caseNotesCompletedCount: number;
  caseNotesPendingReviewCount: number;
  caseNotesComplianceRate: number; // % completed within 24h
  avgGoalAttainmentScore: number; // mean GAS (-2 to +2)
  clientSatisfactionRating: number; // 1.0 to 5.0
}

export interface RevenueTrendDataPoint {
  periodKey: string; // e.g. "2026-03", "2026-04"
  periodLabel: string; // e.g. "Mar 2026"
  totalBilled: number;
  totalCollected: number;
  improvedRelationshipsBilled: number; // Category 11
  improvedDailyLivingBilled: number; // Category 15
  coreSupportsBilled: number;
  claimSuccessRate: number; // 0 to 100%
}

export interface AccountsReceivableAging {
  bucket0To30Days: number;
  bucket31To60Days: number;
  bucket61To90Days: number;
  bucket90PlusDays: number;
  totalOutstanding: number;
}

export interface FinancialAnalyticsSummary {
  revenueTrends: RevenueTrendDataPoint[];
  currentMonthRevenue: number;
  projectedMonthEndRevenue: number;
  claimSuccessRate: number;
  claimRejectionRate: number;
  totalClaimsCount: number;
  paidClaimsCount: number;
  rejectedClaimsCount: number;
  pendingClaimsCount: number;
  accountsReceivable: AccountsReceivableAging;
  topFundingCategories: { categoryName: string; amountBilled: number; percentageOfTotal: number }[];
}

export interface GasScoreDistribution {
  muchLowerThanExpectedMinus2: number;
  lowerThanExpectedMinus1: number;
  expectedOutcomeZero: number;
  higherThanExpectedPlus1: number;
  muchHigherThanExpectedPlus2: number;
  totalEvaluatedGoals: number;
  practiceMeanTScore: number;
}

export interface ClinicalOutcomeAnalytics {
  gasDistribution: GasScoreDistribution;
  domainOutcomes: {
    domainName: string;
    goalCount: number;
    meanTScore: number;
    progressPercentage: number;
  }[];
  bspComplianceOverview: {
    totalActivePlans: number;
    fullyCompliantPlansCount: number;
    needsRemediationCount: number;
    averageQualityAuditScore: number; // 0 to 100%
  };
  incidentFrequencyTrend: {
    periodLabel: string;
    criticalIncidents: number;
    highIncidents: number;
    mediumLowIncidents: number;
    ndisReportableCount: number;
  }[];
  restrictivePracticeReductionTrend: {
    practiceType: 'Chemical' | 'Mechanical' | 'Physical' | 'Environmental' | 'Seclusion' | string;
    activeAuthorizationsCount: number;
    monthlyUsageDurationMinutes: number;
    usageReductionPercentage: number;
  }[];
}

export interface CompliancePillarHealth {
  pillarName: 'Human Rights' | 'Evidence PBS' | 'Restraint Reduction' | 'Governance & Audits';
  scorePercent: number;
  status: 'COMPLIANT' | 'WARNING' | 'CRITICAL';
  openIssuesCount: number;
}

export interface ComplianceHealthScorecardData {
  overallHealthScore: number; // 0 to 100
  statusGrade: 'A+' | 'A' | 'B' | 'NEEDS_REMEDIATION';
  pillars: CompliancePillarHealth[];
  overdueBspReviewsCount: number;
  expiringWorkerCredentialsCount: number;
  pendingIncident5DayReportsCount: number;
  unauthorizedRestrictivePracticesCount: number;
  pendingMonthlyReturnsCount: number;
  keyRiskIndicators: {
    id: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    title: string;
    description: string;
    affectedEntity: string;
    actionRequired: string;
    linkTab: string;
  }[];
}

export interface BoardReportExportConfig {
  reportTitle: string;
  reportingPeriod: 'MTD' | 'QTD' | 'YTD' | 'LAST_12_MONTHS' | 'CUSTOM';
  startDate: string;
  endDate: string;
  clinicBranchId?: string; // "ALL" or specific branch
  includeSections: {
    executiveSummary: boolean;
    financialOverview: boolean;
    practitionerProductivity: boolean;
    clinicalOutcomes: boolean;
    complianceScorecard: boolean;
    riskMatrix: boolean;
  };
  preparedByName: string;
  preparedByRole: string;
  generatedDate: string;
}

export interface BoardReportExportPackage {
  id: string;
  config: BoardReportExportConfig;
  executiveKPIs: ExecutiveSummaryKPIs;
  financialSummary: FinancialAnalyticsSummary;
  productivityMetrics: PractitionerProductivityMetric[];
  clinicalOutcomes: ClinicalOutcomeAnalytics;
  complianceScorecard: ComplianceHealthScorecardData;
  formattedMarkdownContent: string;
  generatedAt: string;
}

// ============================================================================
// CAPABILITY R5: INTELLIGENT NOTIFICATION & ALERT SYSTEM MODELS
// ============================================================================

export type NotificationCategory =
  | 'COMPLIANCE_DEADLINE'
  | 'CLINICAL_INCIDENT'
  | 'RESTRICTIVE_PRACTICE'
  | 'STAFF_CREDENTIAL'
  | 'PLAN_EXPIRY'
  | 'BILLING_CLAIM'
  | 'WORKFLOW_TASK'
  | 'SYSTEM_ALERT';

export type NotificationSeverityLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export interface EscalationRecord {
  escalatedAt: string;
  escalatedFromRole: UserRole;
  escalatedToRole: UserRole;
  escalatedToUserId?: string;
  reason: string;
  timeoutMinutes: number;
}

export interface EnhancedAppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverityLevel;
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedByUserId?: string;
  linkTab?: string;
  entityType?: 'CLIENT' | 'BSP' | 'INCIDENT' | 'PRACTITIONER' | 'CLAIM' | 'TASK' | 'REFERRAL';
  entityId?: string;
  dueDate?: string;
  isEscalated: boolean;
  escalationDetails?: EscalationRecord;
  requiresAction: boolean;
  actionPayload?: {
    actionType: string;
    params?: any;
  };
}

export interface NotificationEscalationRule {
  id: string;
  category: NotificationCategory;
  triggerSeverity: NotificationSeverityLevel;
  unacknowledgedTimeoutMinutes: number; // e.g. 120 (2h), 1440 (24h)
  escalateToRole: UserRole;
  notificationMessageTemplate: string;
  isActive: boolean;
}

export interface RoleNotificationPreference {
  category: NotificationCategory;
  inAppAlerts: boolean;
  emailDigest: boolean;
  urgentPush: boolean;
  minSeverityLevel: NotificationSeverityLevel;
}

export interface UserNotificationSettings {
  userId: string;
  userRole: UserRole;
  preferences: RoleNotificationPreference[];
  dailyDigestEnabled: boolean;
  weeklyDigestEnabled: boolean;
  digestDeliveryTime: string; // e.g. "08:00"
}

export interface DigestSummaryItem {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: NotificationSeverityLevel;
  linkTab: string;
}

export interface DailyWeeklyDigestSummary {
  id: string;
  generatedDate: string;
  type: 'DAILY' | 'WEEKLY';
  recipientUserId: string;
  recipientName: string;
  recipientRole: UserRole;
  periodLabel: string;
  highlights: {
    newReferralsCount: number;
    unbilledCaseNotesCount: number;
    criticalIncidentsLastPeriod: number;
    credentialsExpiringSoonCount: number;
    plansDueForReviewCount: number;
    pendingTasksCount: number;
  };
  criticalActionItems: DigestSummaryItem[];
  upcomingDeadlines: DigestSummaryItem[];
  practiceHealthSnapshot: {
    monthlyRevenueMTD: number;
    activeClientsCount: number;
    complianceScorePercent: number;
  };
}

// ============================================================================
// CAPABILITY R6: AI-POWERED WORKFLOW AUTOMATION ENGINE MODELS
// ============================================================================

export type AutomatedTaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AutomatedTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ESCALATED';

export interface AutomatedTask {
  id: string;
  title: string;
  description: string;
  category: 'CLINICAL' | 'COMPLIANCE' | 'INCIDENT_FOLLOWUP' | 'CREDENTIAL_RENEWAL' | 'BILLING' | 'INTAKE';
  priority: AutomatedTaskPriority;
  status: AutomatedTaskStatus;
  assignedPractitionerId: string;
  assignedPractitionerName: string;
  assignedByUserId: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  completedByUserId?: string;
  relatedEntityType?: 'CLIENT' | 'INCIDENT' | 'BSP' | 'PRACTITIONER' | 'CLAIM' | 'REFERRAL';
  relatedEntityId?: string;
  triggerEventSource?: string;
  automationRuleId?: string;
  requiredActionsChecklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  notes?: string;
}

export interface TaskAssignmentCriteria {
  requiredSpecialties: string[];
  requiredPbsLevel?: 'Core' | 'Proficient' | 'Advanced' | 'Specialist';
  clientLocationState?: string;
  maxAcceptableCaseloadRatio?: number; // e.g. 0.90 (90%)
  priorityWeighting?: {
    specialtyWeight: number; // e.g. 0.40
    capacityWeight: number; // e.g. 0.30
    pbsLevelWeight: number; // e.g. 0.20
    locationWeight: number; // e.g. 0.10
  };
}

export interface PractitionerMatchEvaluation {
  practitionerId: string;
  practitionerName: string;
  pbsLevel: string;
  currentCaseload: number;
  caseloadLimit: number;
  capacityUtilizationPercent: number;
  specialtyMatchScore: number; // 0 to 100
  capacityMatchScore: number; // 0 to 100
  pbsLevelMatchScore: number; // 0 to 100
  locationMatchScore: number; // 0 to 100
  overallWeightedScore: number; // 0 to 100
  matchedSpecialties: string[];
  recommendationRank: number;
  fitRationale: string;
}

export interface EventTriggerRule {
  id: string;
  ruleName: string;
  triggerEventType:
    | 'INCIDENT_LOGGED'
    | 'BSP_REVIEW_DUE'
    | 'CREDENTIAL_EXPIRING'
    | 'RESTRICTIVE_PRACTICE_DUE'
    | 'CASE_NOTE_UNBILLED'
    | 'REFERRAL_RECEIVED';
  conditionPredicate: string; // e.g. "incident.isNdisReportable == true"
  actionTemplate: {
    taskTitleTemplate: string;
    taskDescriptionTemplate: string;
    taskCategory: AutomatedTask['category'];
    priority: AutomatedTaskPriority;
    dueInDays: number;
    assigneeStrategy: 'PRIMARY_PRACTITIONER' | 'CLINICAL_DIRECTOR' | 'BILLING_OFFICER' | 'SMART_MATCH';
    checklistItems: string[];
  };
  isActive: boolean;
}

export interface WorkflowStage {
  stageId: string;
  stageName: string;
  order: number;
  description: string;
  estimatedDurationDays: number;
  requiredRoles: UserRole[];
  mandatoryChecklist: string[];
  completionGateRules: string[]; // conditions required to advance
  nextPossibleStageIds: string[];
}

export interface WorkflowTemplate {
  templateId: string;
  templateName: string;
  templateType: 'CLINICAL_LIFECYCLE' | 'RESTRICTIVE_PRACTICE_AUTHORIZATION' | 'STAFF_ONBOARDING' | 'INCIDENT_REMEDIATION';
  version: string;
  description: string;
  stages: WorkflowStage[];
  isActive: boolean;
}

export interface ActiveWorkflowInstance {
  instanceId: string;
  templateId: string;
  templateName: string;
  entityType: 'CLIENT' | 'REFERRAL' | 'PRACTITIONER' | 'BSP';
  entityId: string;
  entityName: string;
  currentStageId: string;
  currentStageName: string;
  stageStartedAt: string;
  startedAt: string;
  updatedAt: string;
  assignedPractitionerId: string;
  assignedPractitionerName: string;
  stageHistory: {
    stageId: string;
    stageName: string;
    enteredAt: string;
    completedAt: string;
    completedByUserId: string;
    completedByName: string;
    handoffNotes: string;
  }[];
  completedChecklistItems: string[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'ABORTED';
}

export interface WorkloadBalanceSuggestion {
  id: string;
  fromPractitionerId: string;
  fromPractitionerName: string;
  fromCurrentUtilization: number; // e.g. 110%
  toPractitionerId: string;
  toPractitionerName: string;
  toCurrentUtilization: number; // e.g. 45%
  clientIdToReallocate: string;
  clientName: string;
  clientComplexity: 'Low' | 'Medium' | 'High';
  projectedFromUtilization: number; // e.g. 85%
  projectedToUtilization: number; // e.g. 70%
  clinicalCompatibilityFitScore: number; // 0 to 100
  rationale: string;
  status: 'SUGGESTED' | 'APPLIED' | 'DISMISSED';
}

export interface ReferralAutoRoutingResult {
  referralId: string;
  referralName: string;
  recommendedPractitionerId: string;
  recommendedPractitionerName: string;
  matchScore: number;
  secondaryMatches: {
    practitionerId: string;
    practitionerName: string;
    matchScore: number;
  }[];
  routingConfidence: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  recommendedIntakeWorkflowTemplateId: string;
  routingRationale: string;
}

export interface BatchActionRequest {
  actionType:
    | 'BULK_APPROVE_CASE_NOTES'
    | 'BULK_APPROVE_CLAIMS'
    | 'BULK_SUBMIT_CLAIMS_TO_PRODA'
    | 'BULK_ASSIGN_TASKS'
    | 'BULK_UPDATE_TASK_STATUS'
    | 'BULK_REASSIGN_CLIENTS'
    | 'BULK_RESOLVE_NOTIFICATIONS';
  targetEntityIds: string[];
  targetPayload?: {
    assignedPractitionerId?: string;
    assignedPractitionerName?: string;
    newStatus?: string;
    notes?: string;
  };
}

export interface BatchActionResult {
  batchId: string;
  actionType: BatchActionRequest['actionType'];
  totalRequested: number;
  successfulCount: number;
  failedCount: number;
  processedEntityIds: string[];
  failedEntityDetails: { entityId: string; reason: string }[];
  executedAt: string;
  executedByUserId: string;
  auditLogId: string;
}
```

---

## 4. Zustand State Store Extension Contracts (`useManagementStore.ts`)

To integrate R4, R5, and R6 seamlessly into the global Zustand state store, the following additions must be made to `ManagementState`:

### Additional State Properties
```typescript
interface ManagementState {
  // ... existing 21 module state properties ...

  // Capability R4: Analytics & BI State
  analyticsFilterDateRange: { startDate: string; endDate: string; periodLabel: string };
  analyticsSelectedClinicBranch: string; // 'ALL' or branchId
  boardReportPackages: BoardReportExportPackage[];
  lastGeneratedBoardReport?: BoardReportExportPackage;

  // Capability R5: Notifications & Escalations State
  enhancedNotifications: EnhancedAppNotification[];
  escalationRules: NotificationEscalationRule[];
  escalationHistory: EscalationRecord[];
  userNotificationSettings: UserNotificationSettings[];
  currentDigestSummary?: DailyWeeklyDigestSummary;

  // Capability R6: Workflow Automation State
  automatedTasks: AutomatedTask[];
  eventTriggerRules: EventTriggerRule[];
  workflowTemplates: WorkflowTemplate[];
  activeWorkflowInstances: ActiveWorkflowInstance[];
  workloadSuggestions: WorkloadBalanceSuggestion[];
  recentBatchActionResults: BatchActionResult[];
}
```

### Additional Store Actions & Computed Selectors
```typescript
interface ManagementState {
  // ... existing actions ...

  // R4 Actions & Selectors
  setAnalyticsDateRange: (startDate: string, endDate: string, periodLabel: string) => void;
  setAnalyticsClinicBranch: (clinicBranchId: string) => void;
  getExecutiveKPIs: () => ExecutiveSummaryKPIs;
  getPractitionerProductivityMetrics: () => PractitionerProductivityMetric[];
  getFinancialAnalytics: () => FinancialAnalyticsSummary;
  getClinicalOutcomeAnalytics: () => ClinicalOutcomeAnalytics;
  getComplianceHealthScorecard: () => ComplianceHealthScorecardData;
  generateBoardReportPackage: (config: BoardReportExportConfig) => BoardReportExportPackage;

  // R5 Actions
  markNotificationAcknowledged: (notificationId: string) => void;
  markAllNotificationsAcknowledged: () => void;
  updateNotificationPreferences: (userId: string, preferences: RoleNotificationPreference[]) => void;
  evaluateComplianceDeadlines: () => void;
  processNotificationEscalations: () => void;
  generateDigestSummary: (userId: string, type: 'DAILY' | 'WEEKLY') => DailyWeeklyDigestSummary;

  // R6 Actions
  createAutomatedTask: (task: Omit<AutomatedTask, 'id' | 'createdAt' | 'status'>) => AutomatedTask;
  updateAutomatedTask: (taskId: string, updates: Partial<AutomatedTask>) => void;
  completeTaskChecklistItem: (taskId: string, checklistItemId: string) => void;
  evaluateSmartTaskAssignment: (criteria: TaskAssignmentCriteria) => PractitionerMatchEvaluation[];
  triggerAutomatedEvent: (eventType: EventTriggerRule['triggerEventType'], payload: any) => void;
  startWorkflowInstance: (templateId: string, entityType: ActiveWorkflowInstance['entityType'], entityId: string, entityName: string, assignedPractitionerId: string) => ActiveWorkflowInstance;
  advanceWorkflowStage: (instanceId: string, nextStageId: string, handoffNotes: string) => void;
  computeWorkloadBalancingSuggestions: () => WorkloadBalanceSuggestion[];
  applyWorkloadReallocation: (suggestionId: string) => void;
  routeIncomingReferral: (referralId: string) => ReferralAutoRoutingResult;
  executeBatchAction: (request: BatchActionRequest) => BatchActionResult;
}
```

---

## 5. Business Logic & Mathematical Calculation Specifications

### 5.1 R4: Advanced Analytics Calculations

#### A. Goal Attainment Scaling (GAS) Practice-Wide T-Score Formula
For any set of $k$ evaluated client goals with outcome scores $x_i \in \{-2, -1, 0, +1, +2\}$ and relative weights $w_i \ge 1$ (default $w_i = 1$), the standardized GAS T-score is computed via the authoritative Kiresuk & Sherman (1968) formulation:

$$T = 50 + \frac{10 \sum_{i=1}^k w_i x_i}{\sqrt{(1 - \rho)\sum_{i=1}^k w_i^2 + \rho \left(\sum_{i=1}^k w_i\right)^2}}$$

Where:
- $\rho = 0.3$ is the empirical inter-goal correlation coefficient standard in NDIS clinical outcome research.
- For equal goal weights ($w_i = 1$):
  $$T = 50 + \frac{10 \sum_{i=1}^k x_i}{\sqrt{0.7 k + 0.3 k^2}}$$
- **Clinical Interpretation**:
  * $T = 50$: Client attained exactly the expected clinical outcome level across all goals.
  * $T \ge 60$: Client attained significantly higher than expected clinical progress.
  * $T \le 40$: Goal progression is moderately to severely behind clinical trajectory.

#### B. Composite Compliance Health Score Formula (0 to 100%)
The overall practice compliance health score is a penalized weighted composite evaluated across 4 regulatory pillars:

$$\text{HealthScore} = \max\left(0, \min\left(100, \sum_{p=1}^4 W_p \cdot S_p - \sum_{r=1}^m \text{Penalty}_r\right)\right)$$

Where:
- **Pillar 1: Human Rights & Restrictive Practice Governance ($W_1 = 0.30$)**
  $$S_1 = 100 - 25 \times (\text{Unauthorized Practices}) - 15 \times (\text{Overdue Monthly Returns})$$
- **Pillar 2: Evidence-Based BSP Quality ($W_2 = 0.25$)**
  $$S_2 = \text{Mean of Active BSP Audit Scores (0-100)}$$
- **Pillar 3: Staff Compliance & Credentials ($W_3 = 0.25$)**
  $$S_3 = 100 \times \left(1 - \frac{\text{Expired/Expiring Screening Count}}{\text{Total Active Practitioners}}\right)$$
- **Pillar 4: Incident Governance & Statutory Lodgements ($W_4 = 0.20$)**
  $$S_4 = 100 - 30 \times (\text{Unsubmitted 5-day NDIS Incident Reports}) - 50 \times (\text{Late 24-hr Reportable Notifications})$$

#### C. Practitioner Billable Capacity Utilization Rate
For practitioner $p$ in month $m$:
$$\text{Utilization}_p = \left(\frac{\text{Total Billable Hours Delivered in Month}}{\text{Standard Monthly Contracted Capacity Hours}}\right) \times 100\%$$
- Standard full-time clinical target: 120 billable hours / month (30 billable hrs/week).
- Target Utilization Zone: $80\% \le \text{Utilization} \le 90\%$. Overload warning $> 95\%$.

#### D. Claim Success Rate & Financial Accounts Receivable
$$\text{Claim Success Rate} = \left(\frac{\text{Count of Claims with status } \texttt{'Paid'}}{\text{Count of Submitted Claims } (\texttt{'Paid'} + \texttt{'Rejected'} + \texttt{'Claimed'})}\right) \times 100\%$$

Receivables Aging Buckets:
- $0-30\text{ Days}: \sum \text{Claim Amount where } 0 \le (\text{CurrentDate} - \text{ServiceDate}) \le 30 \text{ and status} \ne \texttt{'Paid'}$
- $31-60\text{ Days}: \sum \text{Claim Amount where } 31 \le (\text{CurrentDate} - \text{ServiceDate}) \le 60 \text{ and status} \ne \texttt{'Paid'}$
- $61-90\text{ Days}: \sum \text{Claim Amount where } 61 \le (\text{CurrentDate} - \text{ServiceDate}) \le 90 \text{ and status} \ne \texttt{'Paid'}$
- $90+\text{ Days}: \sum \text{Claim Amount where } (\text{CurrentDate} - \text{ServiceDate}) > 90 \text{ and status} \ne \texttt{'Paid'}$

---

### 5.2 R5: Notification & Escalation Logic

#### A. Dynamic Lifecycle Alert Generation Pipeline
On store initialization and entity mutations, the evaluator scans all active records:
1. **BSP Plan Review Expiry Alerts**:
   - If $(\text{reviewDate} - \text{Today}) \le 0$: Generate `CRITICAL` alert ("BSP Annual Review Overdue for [Client]").
   - If $0 < (\text{reviewDate} - \text{Today}) \le 14 \text{ days}$: Generate `WARNING` alert ("BSP Review Due in X Days").
   - If $14 < (\text{reviewDate} - \text{Today}) \le 30 \text{ days}$: Generate `INFO` alert ("BSP Review Approaching").
2. **Worker Screening & Police Check Expiries**:
   - If $(\text{expiryDate} - \text{Today}) \le 0$: Generate `CRITICAL` alert ("Worker Screening Expired for [Practitioner]").
   - If $0 < (\text{expiryDate} - \text{Today}) \le 30 \text{ days}$: Generate `WARNING` alert ("Screening Renewal Required").
3. **NDIS 24-hr & 5-Day Incident Tracking**:
   - If `incident.isNdisReportable` and not `ndis24hrNotified`: Immediate `CRITICAL` alert ("NDIS 24-Hour Notification Mandatory").
   - If `incident.isNdisReportable` and not `ndis5daySubmitted` and $(\text{Today} - \text{incidentDate}) \ge 3 \text{ days}$: `CRITICAL` alert ("NDIS 5-Day Written Report Due in <48 Hours").

#### B. Auto-Escalation State Machine
```
[New Critical Alert Created]
         │
         ▼
[Unacknowledged in User Inbox]
         │
         ├──── User Acknowledges ───► [Marked Acknowledged / Resolved]
         │
         ▼ (Timeout elapsed: e.g. 2 hours for Critical Incidents, 24h for Expiries)
[Escalation Triggered]
         │
         ├──── Promote Severity: High/Critical
         ├──── Update Assignee: Re-route to Supervisor / Clinical Director (usr-1)
         ├──── Append Escalation Record to escalationHistory
         └──── Create Urgent In-App Bell Notification for Supervisor
```

---

### 5.3 R6: AI Workflow Automation Logic

#### A. Smart Task Assignment Multi-Criteria Weighted Bipartite Matching
When matching an incoming work item or referral to practitioner $p$:

$$\text{MatchScore}(p) = 0.40 \cdot S_{\text{specialty}}(p) + 0.30 \cdot S_{\text{capacity}}(p) + 0.20 \cdot S_{\text{pbs}}(p) + 0.10 \cdot S_{\text{loc}}(p)$$

Where:
1. **Specialty Match Score ($S_{\text{specialty}}$)**:
   $$S_{\text{specialty}}(p) = \left(\frac{|\text{RequiredSpecialties} \cap \text{PractitionerSpecialties}|}{|\text{RequiredSpecialties}|}\right) \times 100$$
2. **Capacity Availability Score ($S_{\text{capacity}}$)**:
   $$S_{\text{capacity}}(p) = \max\left(0, 100 \times \left(1 - \frac{\text{ActiveCaseload}_p}{\text{CaseloadLimit}_p}\right)\right)$$
3. **PBS Registration Level Match Score ($S_{\text{pbs}}$)**:
   - If `PractitionerLevel` $\ge$ `RequiredLevel`: $100\%$
   - If `PractitionerLevel` is one tier below (e.g. Core when Proficient requested): $50\%$
   - Otherwise: $0\%$
4. **Geographic Proximity Score ($S_{\text{loc}}$)**:
   - Same primary clinic branch: $100\%$
   - Same state/region: $70\%$
   - Out of state: $30\%$

#### B. Event-Driven Follow-Up Trigger Dispatch Table

| Event Source | Trigger Predicate | Generated Task Title | Assignee Strategy | Priority | Due In |
|--------------|-------------------|----------------------|-------------------|----------|--------|
| `addIncident` | `isNdisReportable == true` | "Lodge Formal NDIS 5-Day Incident Investigation Report" | Primary Practitioner | `URGENT` | 5 Days |
| `addIncident` | `severity == 'Critical'` | "Conduct Clinical Post-Incident Debrief & Risk Assessment" | Clinical Director | `URGENT` | 2 Days |
| `updateBSPDocument` / Check | `reviewDate <= Today + 30d` | "Initiate Annual BSP Functional Re-assessment & Review" | Primary Practitioner | `HIGH` | 30 Days |
| `updatePractitioner` / Check | `screeningExpiry <= Today + 30d` | "Submit NDIS Worker Screening Renewal Application" | Target Practitioner | `HIGH` | 14 Days |
| Restrictive Practice | `monthlyReportStatus == 'Due'` | "Submit VIC Senior Practitioner Monthly Reduction Return" | Clinical Director | `HIGH` | 5th of Month |
| `addCaseNote` | `flaggedForReview == true` | "Supervisory Clinical Review for Flagged Case Note" | Clinical Director | `MEDIUM` | 3 Days |

#### C. Batch Execution Engine
1. **Input Validation**: Verifies that user role has supervisory permissions (`ADMIN` or `PRACTITIONER` for own caseload).
2. **Atomic Entity Mutation**: Iterates over `targetEntityIds`, executing respective store update per item.
3. **Transaction Safety**: Catches individual item errors without rolling back successfully updated peer items.
4. **Audit Trail Logging**: Dispatches a single consolidated `AuditLog` entry detailing actor, batch ID, total executed items, and outcome summary.

---

## 6. UI Component Contracts & User Interactions

### 6.1 `AnalyticsDashboardModule.tsx` Layout & Hierarchy
1. **Top Control Bar**:
   - Time Period Switcher (MTD, QTD, YTD, Last 12 Months, Custom).
   - Clinic Branch Filter Dropdown (All Clinics, Melbourne CBD, Richmond PBS Hub, Geelong Regional).
   - Primary Action Button: "Export Board / Management Report (A4 Printable)".
2. **Executive KPI Metric Card Grid**:
   - 4 primary cards: Active Participants, Monthly Revenue MTD, Compliance Health Score, Clinical Outcomes Average GAS T-score.
   - Each card displays large typography, trend arrow with %, historical mini sparkline, and color-coded status indicator.
3. **Interactive Visualizations (Tabbed / Modular Grid)**:
   - **Tab 1: Financial & Billing Intelligence**: Monthly Revenue Trend (Stacked Area), Claim Status Breakdown (Donut), AR Aging Buckets (Horizontal Bar).
   - **Tab 2: Practitioner Productivity & Capacity**: Practitioner Caseload & Utilization (Grouped Bar), Billable Hours Leaderboard, Note Completion Compliance Rate.
   - **Tab 3: Clinical Outcomes & GAS Progress**: GAS Goal Attainment Distribution Histogram (-2 to +2), Domain Mean T-Scores (Radar / Bar), Incident Trend by Severity.
   - **Tab 4: Compliance Health Scorecard**: 4 Pillar radial meters, Red-Flag Risk Radar, Expiring Credentials Matrix.
4. **Board Report Modal / Printable View**:
   - Rendered using print-ready styling (`@media print` clean typography, corporate header with practice branding, page breaks, table layouts, and sign-off signature blocks).

### 6.2 `Header.tsx` Notification Bell & Center
1. **Notification Bell Button**:
   - Icon with animated pulsing red badge showing `unreadCount`.
   - Accessible keyboard shortcut (`Ctrl+Shift+N` or direct click).
2. **Notification Popover / Drawer Component**:
   - Filter Tabs: All, Critical, Warnings, Compliance, Tasks.
   - Action Bar: "Mark All Read", "Open Notification Settings".
   - Notification Cards:
     * Severity badge (Critical Red, Warning Amber, Info Sky).
     * Time elapsed (e.g. "12m ago", "Yesterday").
     * Escalation indicator pill if escalated.
     * Click card $\rightarrow$ auto-navigates to relevant tab (`setActiveTab(linkTab)`) and dismisses popover.
3. **Daily Digest Summary Modal**:
   - Modal accessible from Header/Settings rendering the day's compiled practice health briefing.

### 6.3 `WorkflowAutomationModule.tsx` Layout & Hierarchy
1. **Workflow Tabs**:
   - `Smart Task Board`: Kanban / list view of automated tasks grouped by status (`Pending`, `In Progress`, `Completed`, `Escalated`) with quick filter by practitioner.
   - `Smart Assignment & Routing`: Interactive simulator matching work items/referrals to practitioners with live score breakdowns.
   - `Clinical Workflow State Machines`: Visual step-by-step pipeline tracker showing active participants in each clinical stage with checklist items.
   - `Workload Balancing Engine`: Capacity utilization bars per practitioner with 1-click "Apply Suggested Reallocation" cards.
   - `Batch Operations Manager`: Multi-select data tables for case notes, claims, and referrals with bulk approve, bulk assign, and bulk update actions.

---

## 7. NDIS Compliance & Regulatory Safeguards Alignment

Breakthrough OS operates under strict Australian statutory requirements:
1. **NDIS Quality and Safeguards Commission (Rules 2018)**:
   - All restrictive practice usage must be tracked with least restrictive justification and submitted monthly to the NDIS Commission portal.
   - Reportable incidents must be recorded with 24-hr initial notice and 5-day formal investigation lodgement.
2. **NDIS PACE (Participant Advanced Care Engine)**:
   - Support item coding aligns with PACE line item taxonomy (Category 11, Category 15).
   - Plan budget utilization tracking prevents overclaiming beyond authorized participant funding envelopes.
3. **NDIS Worker Screening Database (NWSD)**:
   - Continuous verification of Worker Screening clearance, WWCC, and Police Checks preventing non-cleared practitioners from delivering billable supports.

---

## 8. Mock Data Specifications (`lib/mock-data.ts`)

To ensure realistic, comprehensive testing and rich visual presentations, the mock datasets must include:

### 8.1 Automated Tasks (`INITIAL_AUTOMATED_TASKS`)
At least 6 representative automated tasks:
1. `task-101`: "Lodge Formal NDIS 5-Day Incident Investigation Report" (Client: Jordan Miller, Assigned: Marcus Vance, Priority: `URGENT`, Status: `PENDING`, Due: 2026-08-14).
2. `task-102`: "Conduct Clinical Post-Incident Debrief" (Client: Jordan Miller, Assigned: Dr. Sarah Jenkins, Priority: `URGENT`, Status: `IN_PROGRESS`, Due: 2026-08-12).
3. `task-103`: "Initiate Annual BSP Functional Re-assessment & Review" (Client: Jordan Miller, Assigned: Marcus Vance, Priority: `HIGH`, Status: `PENDING`, Due: 2026-08-25).
4. `task-104`: "Submit NDIS Worker Screening Renewal Application" (Staff: Marcus Vance, Assigned: Marcus Vance, Priority: `HIGH`, Status: `PENDING`, Due: 2026-08-30).
5. `task-105`: "Submit VIC Senior Practitioner Monthly Reduction Return" (Entity: Restrictive Practice, Assigned: Dr. Sarah Jenkins, Priority: `HIGH`, Status: `COMPLETED`, Due: 2026-08-05).
6. `task-106`: "Supervisory Clinical Review for Flagged Case Note" (Client: Tyler Hayes, Assigned: Dr. Sarah Jenkins, Priority: `MEDIUM`, Status: `PENDING`, Due: 2026-08-18).

### 8.2 Workflow Templates & Active Instances (`INITIAL_WORKFLOW_TEMPLATES`, `INITIAL_ACTIVE_WORKFLOWS`)
1. `template-clinical-bsp`: Standard NDIS Behaviour Support Plan Lifecycle (6 stages: Triage Screen $\rightarrow$ Clinical FBA Assessment $\rightarrow$ BSP Formulation $\rightarrow$ Panel Review & Authorization $\rightarrow$ Staff Training $\rightarrow$ Periodic Review).
2. `template-rp-auth`: Restrictive Practice Authorization Workflow (4 stages: Clinical Justification $\rightarrow$ Independent Panel Submission $\rightarrow$ Consent & Authorization $\rightarrow$ Monthly Fade-Out Tracking).
3. Active instances tracking participants currently at various stages (e.g. Jordan Miller at Stage 4 Panel Review, Chloe Zhang at Stage 5 Staff Training).

### 8.3 Workload Balancing Suggestions (`INITIAL_WORKLOAD_SUGGESTIONS`)
1. `sugg-1`: Reallocate Client Tyler Hayes from Marcus Vance (108% utilization) to Dr. Sarah Jenkins (67% utilization) — Projected utilization: Marcus 88%, Dr. Sarah 82%, Fit Score 94%.
2. `sugg-2`: Reallocate Client Liam O'Connor from Senior Practitioner to Intake Pool — Projected utilization adjustment.

### 8.4 Enhanced Notifications & Escalation Rules (`INITIAL_ENHANCED_NOTIFICATIONS`, `INITIAL_ESCALATION_RULES`)
1. Multi-tier alerts spanning Critical Incidents, Overdue BSP Reviews, Expiring Worker Screenings, Unbilled Claims > $5,000, and Escalated Task Milestones.

---

## 9. Verification & Acceptance Testing Protocol

| Verification Target | Test Strategy | Acceptance Benchmark |
|---------------------|---------------|----------------------|
| **Executive KPIs Calculation** | Unit test dynamic computation using synthetic store states with known values. | 100% mathematical accuracy; zero hardcoded strings or division by zero. |
| **GAS T-Score Aggregation** | Evaluate Kiresuk-Sherman formula with single-goal and multi-goal arrays. | Produces $T = 50.0$ for all 0s, $T \approx 21.8$ for all -2s, $T \approx 78.2$ for all +2s with $\rho = 0.3$. |
| **Header Notification Bell & Unread Counter** | Trigger read/unread toggles, dismissals, and new notifications in store. | Bell badge updates immediately; accurately mirrors unread count. |
| **Escalation Timeout Engine** | Simulate time progression on unacknowledged critical alert. | Alert severity elevates, supervisor assignment occurs, escalation log records event. |
| **Smart Task Assignment Scoring** | Run matcher with controlled practitioner competencies and caseload capacities. | Practitioner with highest matching score ranked #1 with clear mathematical justification. |
| **Event-Driven Task Triggers** | Execute `addIncident` with `isNdisReportable: true`. | Verifies new `AutomatedTask` is automatically appended to `automatedTasks` with 5-day due date. |
| **Batch Action Processing** | Execute bulk approve on 10 claims with 1 deliberately invalid record. | 9 records update to `Claimed`, 1 records failure reason, batch result summary logged. |
| **Printable Board Report Export** | Trigger report generator and inspect HTML/CSS print layout and JSON export package. | Clean A4 layout with branding header, KPI table, financial trends, and clinical outcome summary. |

---
*End of Technical Specification for Capabilities R4, R5, and R6.*
