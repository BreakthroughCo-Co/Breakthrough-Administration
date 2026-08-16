export * from './bsp-audit';

export type TabType =
  | 'command-center'
  | 'clients'
  | 'case-notes'
  | 'incidents'
  | 'restrictive-practices'
  | 'crm'
  | 'abc-analyser'
  | 'bsp-creator'
  | 'bsp-plans'
  | 'billing'
  | 'practitioners'
  | 'hr-roster'
  | 'audit'
  | 'audit-logs'
  | 'practice-tools'
  | 'integrations'
  | 'google-workspace'
  | 'google-maps'
  | 'outcome-tracking'
  | 'staff-training'
  | 'referral-intake'
  | 'analytics'
  | 'workflow-automation';

export type UserRole = 'ADMIN' | 'PRACTITIONER' | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  position: string;
  practitionerId?: string;
  workerScreeningStatus: 'Active' | 'Pending' | 'Expiring Soon' | 'Expired';
  workerScreeningExpiry: string;
  policeCheckExpiry: string;
  ndisOrientationDone: boolean;
  activeCaseload: number;
}

export interface ClientGoal {
  id: string;
  title: string;
  category: 'Core' | 'Capacity Building' | 'Capital' | 'Social & Community';
  targetDate: string;
  progressPercent: number;
  status: 'In Progress' | 'Achieved' | 'Deferred';
  gasScore?: number;
  gasHistory?: { date: string; score: number; note: string }[];
}

export interface Client {
  id: string;
  ndisNumber: string;
  name: string;
  dateOfBirth: string;
  status: 'Active' | 'Onboarding' | 'Archived' | 'Pending Plan';
  primaryDisability: string;
  secondaryDisabilities?: string[];
  goals: ClientGoal[];
  planStartDate: string;
  planEndDate: string;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  primaryPractitionerId: string;
  primaryPractitionerName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  restrictivePracticesActive: boolean;
  address?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseNote {
  id: string;
  clientId: string;
  clientName: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  sessionDurationMinutes: number;
  format: 'SIMPL' | 'BIRP' | 'Standard' | 'SOAP' | 'DAP' | 'GIRP' | string;
  subjective: string; // Situation / Subjective
  objective: string;  // Intervention / Objective
  assessment: string; // Measurement / Assessment
  plan: string;       // Next steps / Plan
  summary?: string;
  content?: string;
  billableStatus?: string;
  isSynced?: boolean;
  linkedGoalIds?: string[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Archived';
  flaggedForReview?: boolean;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestrictivePractice {
  id: string;
  clientId: string;
  clientName: string;
  practiceType: 'Chemical' | 'Mechanical' | 'Physical' | 'Environmental' | 'Seclusion';
  description: string;
  status: 'Proposed' | 'Authorized' | 'Active' | 'Superseded' | 'Expired';
  authorizationBody?: string; // e.g. "VIC Senior Practitioner"
  authorizationReference?: string;
  startDate?: string;
  expiryDate?: string;
  reductionPlanSummary?: string;
  monthlyReportStatus?: 'Submitted' | 'Due' | 'Overdue';
  lastReportedDate?: string;
  clinicalRationale?: string;
  leastRestrictiveAlternativesTried?: string[];
  prohibitedRiskAssessment?: string;
  prescribingPractitionerName?: string;
  reviewCadenceMonths?: number;
}

export interface Incident {
  id: string;
  clientId: string;
  clientName: string;
  practitionerId: string;
  practitionerName: string;
  incidentDate: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical / Reportable';
  status: 'Investigating' | 'Reported to NDIS Commission' | 'Closed' | 'Corrective Action Required';
  isNdisReportable: boolean;
  ndis24hrNotified: boolean;
  ndis5daySubmitted: boolean;
  description: string;
  immediateActionTaken: string;
  rootCauseAnalysis?: string;
  correctiveActions?: string;
  reportedBy: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  prospectName: string;
  ndisNumber?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: 'New Intake' | 'Screening & Qualification' | 'Service Agreement Pending' | 'Converted to Client' | 'Disqualified';
  source: 'NDIS Portal' | 'Support Coordinator Referral' | 'Direct Website' | 'Hospital / Allied Health';
  estimatedPlanValue: number;
  assignedPractitionerId?: string;
  assignedPractitionerName?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Practitioner {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  position: 'Senior Behaviour Support Practitioner' | 'Core Behaviour Specialist' | 'Provisional Practitioner' | 'Speech Pathologist' | 'Occupational Therapist';
  qualification: string;
  ndisRegistrationNumber: string;
  pbsRegistrationLevel?: 'Core Practitioner' | 'Proficient Practitioner' | 'Advanced Practitioner' | 'Specialist Practitioner';
  specialties?: string[];
  status?: string;
  workerScreeningNumber?: string;
  workerScreeningExpiry?: string;
  wwccNumber?: string;
  wwccExpiry?: string;
  screeningStatus: 'Valid' | 'Expiring Soon' | 'Expired';
  screeningExpiryDate: string;
  policeCheckExpiryDate: string;
  ndisOrientationCompleted: boolean;
  cpdHoursThisYear: number;
  caseloadLimit: number;
  activeCaseloadCount: number;
  historicalSuccessRate?: number; // e.g. 98 (%)
  completedSessionsCount?: number; // e.g. 420
  rating?: number; // e.g. 4.9
}

export interface ABCLog {
  id: string;
  clientId: string;
  clientName: string;
  timestamp: string;
  timeOfDay: string; // HH:mm
  hourOfDay?: number;
  dayOfWeek: string;
  antecedent: string;
  behavior: string;
  consequence: string;
  intensity: number; // 1-5
  durationMinutes: number;
  location: string;
  perceivedFunction: 'Escape/Avoidance' | 'Attention/Social' | 'Tangible/Access' | 'Sensory/Automatic';
  settingEvent?: string;
  sensoryTriggers?: string[];
  deescalationAttempted?: string;
  recordedBy: string;
}

export interface NDISSupportItem {
  code: string;
  name: string;
  category: string;
  pricePerUnit: number;
  unitOfMeasure: 'Hour' | 'Each' | 'Day';
}

export interface BillingClaim {
  id: string;
  clientId: string;
  clientName: string;
  ndisNumber: string;
  serviceDate: string;
  ndisSupportItem: string;
  supportItemCode: string;
  practitionerId?: string;
  practitionerName?: string;
  hours: number;
  unitRate: number;
  totalAmount: number;
  status: 'Pending' | 'Draft' | 'Approved' | 'Submitted PACE' | 'Paid' | 'Rejected' | string;
  invoiceNumber: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CommunicationLog {
  id: string;
  entityType: 'Client' | 'Lead';
  entityId: string;
  entityName: string;
  type: 'Phone Call' | 'Email' | 'In-Person Meeting' | 'NDIS Portal Note';
  timestamp: string;
  authorName: string;
  summary: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'incident' | 'agreement' | 'hr' | 'compliance' | 'client' | 'billing';
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface RestrictivePracticeUsageLog {
  id: string;
  practiceId: string;
  clientId: string;
  clientName: string;
  practiceType: 'Chemical' | 'Mechanical' | 'Physical' | 'Environmental' | 'Seclusion';
  timestamp: string;
  durationMinutes: number;
  antecedentTrigger: string;
  priorDeescalationTried: string;
  staffPresent: string[];
  authorizedBy: string;
  debriefCompleted: boolean;
  notes: string;
  reportedToCommission: boolean;
}

export interface NDISMonthlyReturnRecord {
  id: string;
  month: string; // YYYY-MM
  clientId?: string;
  clientName?: string;
  participantId?: string;
  participantName?: string;
  ndisNumber: string;
  practiceType?: string;
  authorizationReference?: string;
  practiceCount?: number;
  totalUsageInstances?: number;
  totalDurationMinutes: number;
  reductionProgressNote?: string;
  status?: 'Draft' | 'Submitted' | 'Late' | 'Ready' | string;
  submissionStatus?: 'Ready' | 'Submitted' | 'Draft' | string;
  submittedDate?: string;
  submissionDate?: string;
}

export interface PRODABatch {
  id: string;
  batchNumber?: string;
  batchReference?: string;
  createdAt?: string;
  createdDate?: string;
  claimCount: number;
  totalAmount: number;
  status: 'Ready' | 'Submitted' | 'Processed' | 'Errors' | 'DRAFT' | 'SCRUBBED_VALID' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED_PARTIAL' | string;
  submissionDate?: string;
  ndiaResponseCode?: string;
  claimIds?: string[];
  claims?: BillingClaim[];
  rejectionNotes?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: 'folder' | 'application/vnd.google-apps.document' | 'application/vnd.google-apps.spreadsheet' | 'application/pdf' | string;
  parentId?: string | null;
  webViewLink?: string;
  modifiedTime?: string;
  lastModified?: string;
  author?: string;
  tags?: string[];
  sizeBytes?: number;
  size?: string;
  docContent?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  title?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string } | string;
  end?: { dateTime?: string; date?: string } | string;
  type?: 'SESSION' | 'ASSESSMENT' | 'SUPERVISION' | 'STAKEHOLDER_MEETING' | string;
  participantId?: string;
  participantName?: string;
  practitionerId?: string;
  practitionerName?: string;
  location?: string;
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED' | string;
  description?: string;
}

export interface AICopilotMessage {
  id: string;
  sender?: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system';
  text?: string;
  content?: string;
  timestamp: string;
  contextModule?: string;
  contextClientId?: string;
  suggestedActions?: {
    label: string;
    actionType: 'INSERT_NOTE' | 'NAVIGATE' | 'TRIGGER_AUDIT' | 'EXPORT_PRODA' | 'SYNC_DOC';
    payload?: any;
  }[];
  metadata?: any;
}

export interface ClinicalAssessmentRecord {
  id: string;
  clientId: string;
  clientName?: string;
  practitionerId?: string;
  practitionerName?: string;
  assessmentTool?: 'Vineland-3' | 'Sensory Profile 2' | 'VB-MAPP' | 'ABLLS-R' | 'PEDI-CAT' | 'WHODAS 2.0' | string;
  assessmentDate?: string;
  toolName?: string;
  date?: string;
  administeredBy?: string;
  domainScores?: {
    domainName: string;
    rawScore: number;
    standardScore?: number;
    percentileRank?: number;
    adaptiveLevel?: 'Extremely Low' | 'Low' | 'Moderately Low' | 'Adequate' | 'High' | 'High Adaptive' | string;
  }[];
  scores?: Record<string, any>;
  primaryFunctionIdentified?: string;
  clinicalInterpretation?: string;
  recommendations?: string[];
  status?: 'DRAFT' | 'COMPLETED' | 'PEER_REVIEWED' | string;
  notes?: string;
}

export interface PracticeBrandingConfig {
  practiceName: string;
  ndisRegistrationNumber: string;
  abn?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  primaryColor?: string;
  primaryColorHex?: string;
  accentColorHex?: string;
  reportHeaderNotice?: string;
  reportFooterDisclaimer?: string;
}

export interface NDISCommissionAuditPackage {
  id: string;
  bspId?: string;
  clientId?: string;
  clientName?: string;
  generatedDate?: string;
  generatedAt?: string;
  targetParticipantId?: string;
  targetParticipantName?: string;
  packageScope?: string;
  includedDocumentTypes?: string[];
  overallComplianceGrade?: string;
  packageChecksum?: string;
  compiledMarkdown?: string;
  status?: 'Ready for Review' | 'Submitted' | 'Approved' | string;
  complianceScore?: number;
  flags?: string[];
}

export interface ClinicBranch {
  id: string;
  name: string;
  code: string;
  state: 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  address: string;
  phone: string;
  email: string;
  leadPractitionerName: string;
  activeCaseloadCount: number;
}

export interface ExtractedClinicalReport {
  id: string;
  clientId?: string;
  clientName?: string;
  fileName?: string;
  documentName?: string;
  uploadDate: string;
  reportType?: 'Paediatric Assessment' | 'OT Sensory Profile' | 'Psychiatric Evaluation' | 'Hospital Discharge' | 'Speech Pathology' | string;
  extractedDiagnoses?: string[];
  sensorySensitivities?: string[];
  antecedentTriggers?: string[];
  recommendedStrategies?: string[];
  summaryNarrative?: string;
  extractedSections?: Record<string, string>;
  confidenceScore?: number;
  status?: 'PENDING_REVIEW' | 'TRANSFERRED_TO_BSP' | 'ARCHIVED' | string;
}

export interface OfflineSyncQueueItem {
  id: string;
  timestamp?: string;
  createdAt?: string;
  entity?: string;
  entityType?: 'CASE_NOTE' | 'ABC_LOG' | 'INCIDENT' | 'ASSESSMENT' | string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | string;
  payload: any;
  status: 'Pending' | 'Syncing' | 'Failed' | 'PENDING' | 'SYNCED' | 'FAILED' | string;
}

// ============================================================================
// R1: Participant Outcome Tracking & NDIS Plan Management
// ============================================================================

export interface NDISPlanBudgetLine {
  id: string;
  clientId: string;
  clientName: string;
  supportCategory: string;
  supportItemCode: string;
  allocated: number;
  spent: number;
  utilizationPercent: number;
  planStartDate: string;
  planEndDate: string;
  lastClaimDate?: string;
}

export type GASLevel = -2 | -1 | 0 | 1 | 2;

export interface GASMeasurement {
  id: string;
  date: string;
  level: GASLevel;
  note: string;
  measuredBy: string;
}

export interface GASGoal {
  id: string;
  clientId: string;
  clientName: string;
  goalTitle: string;
  domain: string;
  expectedLevel: GASLevel;
  baselineLevel: GASLevel;
  currentLevel: GASLevel;
  weight: number;
  measurements: GASMeasurement[];
  tScore: number;
  startDate: string;
  targetDate: string;
  status: 'Active' | 'Achieved' | 'Discontinued';
}

export interface OutcomeMeasurement {
  id: string;
  clientId: string;
  clientName: string;
  domain: string;
  instrument: string;
  baselineValue: number;
  currentValue: number;
  maxValue: number;
  measurementDate: string;
  assessedBy: string;
  trend: 'Improving' | 'Stable' | 'Declining';
}

export interface PlanReviewSummary {
  id: string;
  clientId: string;
  clientName: string;
  reviewDate: string;
  planPeriod: string;
  budgetUtilization: { category: string; allocated: number; spent: number; percent: number }[];
  goalProgress: { goalTitle: string; baseline: GASLevel; current: GASLevel; tScore: number }[];
  caseNoteSummary: { totalNotes: number; lastNoteDate: string; keyThemes: string[] };
  bspComplianceStatus: string;
  incidentSummary: { totalIncidents: number; severity: string; resolved: number };
  billingTotal: number;
  recommendations: string[];
  generatedAt: string;
  generatedBy: string;
}

// ============================================================================
// R2: Staff Training & Credential Management
// ============================================================================

export interface CPDRecord {
  id: string;
  practitionerId: string;
  practitionerName: string;
  activityTitle: string;
  category: 'Workshop' | 'Conference' | 'Supervision' | 'Online Course' | 'Peer Review' | 'Research';
  hours: number;
  date: string;
  provider: string;
  evidenceUrl?: string;
  verified: boolean;
}

export interface StaffCredential {
  id: string;
  practitionerId: string;
  practitionerName: string;
  credentialType: 'NDIS Worker Screening' | 'WWCC' | 'AHPRA Registration' | 'First Aid' | 'Police Check' | 'Professional Indemnity' | 'Drivers Licence' | 'PBS Registration';
  issuer: string;
  credentialNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Renewal';
  reminderSentDays?: number[];
}

export interface OnboardingChecklistItem {
  id: string;
  title: string;
  category: 'Orientation' | 'Training' | 'Documentation' | 'Supervision' | 'System Access';
  mandatory: boolean;
  completed: boolean;
  completedDate?: string;
  completedBy?: string;
  notes?: string;
}

export interface OnboardingChecklist {
  id: string;
  practitionerId: string;
  practitionerName: string;
  startDate: string;
  targetCompletionDate: string;
  status: 'In Progress' | 'Complete' | 'Overdue';
  items: OnboardingChecklistItem[];
  supervisorId: string;
  supervisorName: string;
}

export interface CompetencyMatrixEntry {
  id: string;
  practitionerId: string;
  practitionerName: string;
  serviceArea: string;
  skillLevel: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  assessedDate: string;
  assessedBy: string;
  nextReviewDate: string;
  notes?: string;
}

export interface TrainingQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: 'Compliance' | 'Clinical Skills' | 'Safety' | 'Professional Development' | 'NDIS Framework';
  description: string;
  durationMinutes: number;
  content: string;
  quizQuestions: TrainingQuizQuestion[];
  passingScore: number;
  mandatory: boolean;
  createdBy: string;
}

export interface TrainingCompletion {
  id: string;
  practitionerId: string;
  practitionerName: string;
  moduleId: string;
  moduleTitle: string;
  completedDate: string;
  quizScore: number;
  passed: boolean;
  attempts: number;
  certificateUrl?: string;
}

// ============================================================================
// R3: Referral & Intake Pipeline
// ============================================================================

export type ReferralStage =
  | 'New'
  | 'Triage'
  | 'Clinical Assessment'
  | 'Service Matching'
  | 'Onboarding'
  | 'Converted'
  | 'Declined'
  | 'Withdrawn';

export interface ReferralTriageFields {
  urgency: 1 | 2 | 3 | 4 | 5;
  complexity: 1 | 2 | 3 | 4 | 5;
  serviceAvailability: 1 | 2 | 3 | 4 | 5;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  primaryNeed: string;
  previousProvider: boolean;
  interpreterRequired: boolean;
}

export interface Referral {
  id: string;
  participantName: string;
  ndisNumber?: string;
  dateOfBirth?: string;
  primaryDisability?: string;
  referralDate: string;
  source: 'NDIS Portal' | 'Support Coordinator' | 'Hospital / Allied Health' | 'Self-Referral' | 'GP Referral' | 'Community Organisation';
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  stage: ReferralStage;
  triageFields: ReferralTriageFields;
  priorityScore: number;
  assignedPractitionerId?: string;
  assignedPractitionerName?: string;
  estimatedPlanValue?: number;
  notes: string;
  handoffNotes?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  referralId: string;
  participantName: string;
  position: number;
  estimatedStartDate: string;
  serviceType: string;
  assignedPractitionerId?: string;
  assignedPractitionerName?: string;
  addedDate: string;
  priority: 'Standard' | 'Urgent' | 'Critical';
  notes?: string;
}

export interface ServiceAgreement {
  id: string;
  referralId: string;
  participantName: string;
  ndisNumber: string;
  participantAddress?: string;
  dateOfBirth?: string;
  primaryDisability?: string;
  planStartDate: string;
  planEndDate: string;
  serviceCategories: { category: string; allocatedBudget: number; hourlyRate: number }[];
  totalBudget: number;
  assignedPractitionerId: string;
  assignedPractitionerName: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Active' | 'Expired';
  generatedAt: string;
  signedAt?: string;
  agreementMarkdown: string;
}

export interface IntakeAssessment {
  id: string;
  referralId: string;
  participantName: string;
  currentStage: 'Initial Screen' | 'Clinical Assessment' | 'Service Matching' | 'Onboarding';
  stages: {
    name: string;
    status: 'Pending' | 'In Progress' | 'Complete' | 'Skipped';
    startedDate?: string;
    completedDate?: string;
    assignedTo?: string;
    handoffNotes?: string;
    findings?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// R5: Intelligent Notification & Alert System (Enhanced)
// ============================================================================

export type NotificationCategory =
  | 'incident'
  | 'agreement'
  | 'hr'
  | 'compliance'
  | 'client'
  | 'billing'
  | 'referral'
  | 'credential'
  | 'workflow'
  | 'training'
  | 'outcome';

export interface EnhancedNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  escalationLevel: number;
  escalatedAt?: string;
  escalationTimeoutMinutes: number;
  sourceModule: string;
  sourceEntityId?: string;
  linkTab?: string;
  actionRequired: boolean;
  actionLabel?: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  userRole: UserRole;
  category: NotificationCategory;
  enabled: boolean;
  emailEnabled: boolean;
  escalationEnabled: boolean;
}

export interface DigestSummary {
  id: string;
  period: 'daily' | 'weekly';
  generatedAt: string;
  activeClients: number;
  sessionsDelivered: number;
  revenueThisPeriod: number;
  complianceScore: number;
  pendingActions: { action: string; module: string; dueDate: string; priority: string }[];
  expiringCredentials: number;
  overdueReviews: number;
  newReferrals: number;
  incidentsLogged: number;
}

// ============================================================================
// R6: AI-Powered Workflow Automation Engine
// ============================================================================

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  autoTransition: boolean;
  transitionCondition?: string;
  assignedRole?: string;
  estimatedDurationDays: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Referral Intake' | 'BSP Review' | 'Credential Renewal' | 'Plan Review' | 'Incident Response' | 'Custom';
  stages: WorkflowStage[];
  triggerEvent?: string;
  autoAssign: boolean;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  conditions: { field: string; operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains' | 'daysBefore'; value: string | number }[];
  action: {
    type: 'create_task' | 'send_notification' | 'assign_practitioner' | 'update_status' | 'escalate';
    targetModule: string;
    details: string;
  };
  enabled: boolean;
  triggerCount: number;
  lastTriggered?: string;
  createdBy: string;
}

export interface TaskAssignment {
  id: string;
  taskTitle: string;
  taskType: string;
  sourceModule: string;
  sourceEntityId: string;
  assignedToPractitionerId: string;
  assignedToPractitionerName: string;
  matchScore: number;
  matchCriteria: { criterion: string; score: number; weight: number }[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Reassigned';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface BatchAction {
  id: string;
  actionType: 'bulk_approve' | 'bulk_assign' | 'bulk_update_status' | 'bulk_archive' | 'bulk_export';
  targetModule: string;
  targetIds: string[];
  executedBy: string;
  executedByName: string;
  executedAt: string;
  result: 'Success' | 'Partial' | 'Failed';
  affectedCount: number;
  details: string;
}

export interface WorkloadPrediction {
  practitionerId: string;
  practitionerName: string;
  currentCaseload: number;
  maxCaseload: number;
  utilizationPercent: number;
  predictedNextWeek: number;
  recommendation: 'Balanced' | 'Under-utilized' | 'At Capacity' | 'Overloaded';
  suggestedReallocation?: string;
}
