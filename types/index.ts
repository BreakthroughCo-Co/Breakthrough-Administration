export * from './bsp-audit';

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
  gasScore?: -2 | -1 | 0 | 1 | 2;
  gasHistory?: { date: string; score: -2 | -1 | 0 | 1 | 2; note: string }[];
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
  format: 'SIMPL' | 'BIRP' | 'Standard';
  subjective: string; // Situation / Subjective
  objective: string;  // Intervention / Objective
  assessment: string; // Measurement / Assessment
  plan: string;       // Next steps / Plan
  linkedGoalIds: string[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Archived';
  flaggedForReview: boolean;
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

export interface BSPParticipantProfile {
  communicationMode?: string;
  sensoryPreferences?: string[];
  strengthsAndInterests?: string[];
  medicalHealthFactors?: string;
  decisionMakingPreferences?: string;
  traumaHistorySummary?: string;
  ndisPlanGoalsAlignment?: string;
}

export interface BSPTargetBehavior {
  behavior: string;
  operationalDefinition: string;
  severity: number; // 1-5
  frequency?: string;
  duration?: string;
  baselineIntensity?: string;
}

export interface BSPFunctionalAssessment {
  targetBehaviors?: BSPTargetBehavior[];
  settingEvents?: string[];
  immediateTriggers?: string[];
  maintainingConsequences?: string[];
  functionalHypothesis?: string;
  hypothesizedFunctions?: Array<'Escape/Avoidance' | 'Attention/Social' | 'Tangible/Access' | 'Sensory/Automatic'>;
}

export interface BSPReplacementBehavior {
  target: string;
  replacement: string;
  teachingMethod: string;
  functionalEquivalence?: string;
}

export interface BSPSkillTeaching {
  replacementBehaviors?: BSPReplacementBehavior[];
  functionalCommunicationTraining?: string;
  reinforcementSchedule?: string;
  generalizationStrategies?: string[];
}

export interface BSPActiveReactive {
  earlyWarningSigns?: string[];
  activeDeescalationStrategies?: string[];
  reactiveProtocols?: string[];
  postIncidentDebrief?: string;
  postCrisisRecoveryPeriodMinutes?: number;
}

export interface BSPConsultationRecord {
  date: string;
  attendeeRoles: string[];
  participantInvolvementModality: string;
  nomineeConsentVerified: boolean;
  notes?: string;
}

export interface BSPStaffGovernance {
  curriculumSummary?: string;
  apoSubmissionDate?: string;
  annualReviewDueDate?: string;
  leadPractitionerName?: string;
  monitoringFrequency?: string;
  authorisationReferences?: string[];
}

export interface BSPDocument {
  id: string;
  clientId: string;
  clientName: string;
  version: string; // e.g. "v1.2", "v2.1"
  status: 'Draft' | 'Panel Review' | 'Submitted to NDIS' | 'Active' | 'Superseded' | 'Published';
  summary: string;
  primaryBehaviorsOfConcern: string[];
  proactiveStrategies: string[];
  reactiveStrategies: string[];
  restrictivePractices: RestrictivePractice[];
  reviewDate: string;
  authorName: string;
  lastUpdated: string;
  // Enhanced clinical modules
  participantProfile?: BSPParticipantProfile;
  functionalAssessment?: BSPFunctionalAssessment;
  fba?: BSPFunctionalAssessment;
  skillTeaching?: BSPSkillTeaching;
  activeReactive?: BSPActiveReactive;
  consultationRecords?: BSPConsultationRecord[];
  staffTrainingAndGovernance?: BSPStaffGovernance;
  complianceScore?: number;
  missingComplianceItems?: string[];
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
  hours: number;
  unitRate: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Submitted PACE' | 'Paid' | 'Rejected';
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
  clientId: string;
  clientName: string;
  ndisNumber: string;
  practiceCount: number;
  totalDurationMinutes: number;
  status: 'Draft' | 'Submitted' | 'Late';
  submittedDate?: string;
}

export interface PRODABatch {
  id: string;
  batchNumber: string;
  createdDate: string;
  claimCount: number;
  totalAmount: number;
  status: 'Ready' | 'Submitted' | 'Processed' | 'Errors';
  claims: BillingClaim[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime: string;
  size?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
}

export interface AICopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  metadata?: any;
}

export interface ClinicalAssessmentRecord {
  id: string;
  clientId: string;
  toolName: string; // e.g. "QABF", "MAS", "FAST", "VINELAND-3"
  date: string;
  administeredBy: string;
  scores: Record<string, any>;
  primaryFunctionIdentified?: string;
  notes: string;
}

export interface PracticeBrandingConfig {
  practiceName: string;
  logoUrl?: string;
  primaryColor?: string;
  ndisRegistrationNumber: string;
  address: string;
  phone: string;
  email: string;
}

export interface NDISCommissionAuditPackage {
  id: string;
  bspId: string;
  clientId: string;
  generatedDate: string;
  status: 'Ready for Review' | 'Submitted' | 'Approved';
  complianceScore: number;
  flags: string[];
}

export interface ClinicBranch {
  id: string;
  name: string;
  state: string;
  address: string;
  phone: string;
}

export interface ExtractedClinicalReport {
  id: string;
  documentName: string;
  uploadDate: string;
  extractedSections: Record<string, string>;
  confidenceScore: number;
}

export interface OfflineSyncQueueItem {
  id: string;
  timestamp: string;
  entity: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  status: 'Pending' | 'Syncing' | 'Failed';
}
