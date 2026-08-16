export type UserRole = 'ADMIN' | 'PRACTITIONER' | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position: string;
  practitionerId?: string;
  workerScreeningStatus: string;
  workerScreeningExpiry: string;
  policeCheckExpiry: string;
  ndisOrientationDone: boolean;
  activeCaseload: number;
}

export interface ClientGoal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  progressPercent: number;
  status: string;
  gasScore?: number;
  gasHistory?: { date: string; score: number; note: string }[];
}

export interface Client {
  id: string;
  ndisNumber: string;
  name: string;
  dateOfBirth: string;
  status: string;
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
  riskLevel: string;
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
  format: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  linkedGoalIds: string[];
  status: string;
  flaggedForReview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestrictivePractice {
  id: string;
  clientId: string;
  clientName: string;
  practiceType: string;
  description: string;
  status: string;
  authorizationBody: string;
  authorizationReference: string;
  startDate: string;
  expiryDate: string;
  reductionPlanSummary: string;
  monthlyReportStatus: string;
  lastReportedDate?: string;
}

export interface Incident {
  id: string;
  clientId: string;
  clientName: string;
  practitionerId: string;
  practitionerName: string;
  incidentDate: string;
  severity: string;
  status: string;
  isNdisReportable: boolean;
  ndis24hrNotified: boolean;
  ndis5daySubmitted: boolean;
  description: string;
  immediateActionTaken: string;
  rootCauseAnalysis: string;
  correctiveActions: string;
  reportedBy: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  prospectName: string;
  ndisNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: string;
  source: string;
  estimatedPlanValue: number;
  assignedPractitionerId: string;
  assignedPractitionerName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Practitioner {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  qualification: string;
  ndisRegistrationNumber: string;
  pbsRegistrationLevel: string;
  specialties: string[];
  status: string;
  workerScreeningNumber: string;
  workerScreeningExpiry: string;
  wwccNumber: string;
  wwccExpiry: string;
  screeningStatus: string;
  screeningExpiryDate: string;
  policeCheckExpiryDate: string;
  ndisOrientationCompleted: boolean;
  cpdHoursThisYear: number;
  caseloadLimit: number;
  activeCaseloadCount: number;
  historicalSuccessRate: number;
  completedSessionsCount: number;
  rating: number;
}

export interface ABCLog {
  id: string;
  clientId: string;
  clientName: string;
  timestamp: string;
  timeOfDay: string;
  hourOfDay?: number;
  dayOfWeek: string;
  antecedent: string;
  behavior: string;
  consequence: string;
  intensity: number;
  durationMinutes: number;
  location: string;
  perceivedFunction: 'Escape/Avoidance' | 'Attention/Social' | 'Tangible/Access' | 'Sensory/Automatic' | string;
  settingEvent?: string;
  sensoryTriggers?: string[];
  deescalationAttempted?: string;
  recordedBy: string;
}

export interface BSPParticipantProfile {
  communicationMode: string;
  sensoryPreferences: string[];
  strengthsAndInterests: string[];
  medicalHealthFactors: string;
  decisionMakingPreferences: string;
}

export interface BSPFunctionalAssessment {
  targetBehaviors: { behavior: string; operationalDefinition: string; severity: number; frequency: string }[];
  settingEvents: string[];
  immediateTriggers: string[];
  maintainingConsequences: string[];
  functionalHypothesis: string;
}

export interface BSPSkillTeaching {
  replacementBehaviors: { target: string; replacement: string; teachingMethod: string }[];
  functionalCommunicationTraining: string;
  reinforcementSchedule: string;
}

export interface BSPActiveReactiveProtocols {
  earlyWarningSigns: string[];
  activeDeescalationStrategies: string[];
  reactiveProtocols: string[];
  postIncidentDebrief: string;
}

export interface BSPDocument {
  id: string;
  clientId: string;
  clientName: string;
  version: string;
  status: string;
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

export interface RestrictivePracticeUsageLog {
  id: string;
  practiceId: string;
  clientId: string;
  clientName: string;
  practiceType: string;
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
  month: string;
  participantId: string;
  participantName: string;
  ndisNumber: string;
  practiceType: string;
  authorizationReference: string;
  totalUsageInstances: number;
  totalDurationMinutes: number;
  reductionProgressNote: string;
  submissionStatus: 'Ready' | 'Submitted' | 'Draft' | string;
  submissionDate?: string;
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
  status: string;
  invoiceNumber: string;
}

export interface NDISSupportItem {
  code: string;
  name: string;
  category: string;
  pricePerUnit: number;
  unitOfMeasure: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface CommunicationLog {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  type: string;
  timestamp: string;
  authorName: string;
  summary: string;
  followUpRequired: boolean;
  followUpDate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
