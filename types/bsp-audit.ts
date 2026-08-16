/**
 * Breakthrough OS - NDIS Behaviour Support Plan (BSP) Quality & Safeguards Compliance Types
 * Governing Standards:
 * - NDIS Quality and Safeguards Commission (Australia)
 * - National Disability Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018
 * - Positive Behaviour Support Capability Framework
 * - State/Territory Senior Practitioner Requirements
 */

export type NDISQualityIndicatorId =
  | 'QI-01'
  | 'QI-02'
  | 'QI-03'
  | 'QI-04'
  | 'QI-05'
  | 'QI-06'
  | 'QI-07'
  | 'QI-08'
  | 'QI-09'
  | 'QI-10'
  | 'QI-11'
  | 'QI-12';

export type RegulatoryPillar =
  | 'human_rights_legal'
  | 'clinical_pbs_formulation'
  | 'proactive_skill_building'
  | 'crisis_reduction_safeguards';

export type RestrictivePracticeCategory =
  | 'Chemical'
  | 'Mechanical'
  | 'Physical'
  | 'Environmental'
  | 'Seclusion';

export type RestrictivePracticeAuthorizationStatus =
  | 'Fully Authorized'
  | 'Pending Review'
  | 'Unauthorized Breach';

export type RestrictivePracticeOperationalStatus =
  | 'Proposed'
  | 'Authorized'
  | 'Active'
  | 'Superseded'
  | 'Expired';

export type AgentRole =
  | 'human_rights_legal_safeguards'
  | 'clinical_pbs_specialist'
  | 'quality_panel_lead_synthesizer';

export type DeliberationStage =
  | 'initial_screening'
  | 'specialist_analysis'
  | 'consensus_debate'
  | 'final_synthesis';

export type DeliberationSentiment =
  | 'support'
  | 'concern'
  | 'critical_dissent'
  | 'remediated'
  | 'compliant'
  | 'warning'
  | 'critical_breach'
  | 'consensus_reached';

export interface AgentDeliberationTrace {
  id: string;
  timestamp: string;
  agentRole: AgentRole;
  agentName: string;
  agentAvatar?: string;
  stage: DeliberationStage;
  phase?: 'initial_review' | 'deep_scrutiny' | 'consensus_debate' | 'final_synthesis';
  sentiment: DeliberationSentiment;
  message: string;
  reasoning?: string;
  focusIndicator?: string;
  scoreAwarded?: number; // 0 - 100
  citedRules: string[];
  indicatorId?: NDISQualityIndicatorId;
  proposedRemediation?: {
    fieldToUpdate: string;
    suggestedText: string;
    remediationLabel: string;
  };
}

export type IndicatorComplianceStatus = 'compliant' | 'warning' | 'non_compliant';

export interface NDISQualityIndicatorResult {
  id: NDISQualityIndicatorId;
  name: string;
  pillar: RegulatoryPillar;
  weight: number; // e.g. 0.08, 0.10, etc.
  pillarWeight: number; // weight within the pillar (e.g. 0.25, 0.45)
  score: number; // 0 - 100
  passed: boolean;
  status: IndicatorComplianceStatus;
  evidenceFound: string[];
  gapsIdentified: string[];
  remediationSuggestion?: string;
  citedRegulations: string[];
  evaluationDetails?: string;
}

export type RedFlagSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface RemediationPayload {
  field: string;
  section: 'profile' | 'fba' | 'proactive' | 'skillTeaching' | 'activeReactive' | 'restrictivePractices' | 'governance';
  action: 'append' | 'replace' | 'patch';
  value: any;
  targetId?: string;
  description?: string;
}

export interface ComplianceRedFlag {
  id: string;
  severity: RedFlagSeverity;
  title: string;
  description: string;
  affectedPillar: RegulatoryPillar;
  affectedIndicator: NDISQualityIndicatorId;
  recommendedRemediation?: string;
  remediationPayload?: RemediationPayload;
}

export interface RestrictivePracticeAuditItem {
  practiceId?: string;
  practiceType: RestrictivePracticeCategory;
  description: string;
  status: RestrictivePracticeOperationalStatus;
  authorizationStatus: RestrictivePracticeAuthorizationStatus;
  authorizationReference?: string;
  authorizationExpiry?: string;
  leastRestrictiveJustified: boolean;
  fadingPlanPresent: boolean;
  reductionTarget?: string;
  prohibitedRestraintDetected?: boolean;
  prohibitedRestraintType?: 'prone' | 'supine' | 'neck_hold' | 'diaphragm_hold' | 'unauthorized_mechanical' | null;
  clinicalNotes?: string;
}

export interface PenaltyMultiplierResult {
  type: string;
  factor: number; // e.g. 0.60, 0.75, 0.80, 0.00
  description: string;
  applied: boolean;
  reason: string;
}

export type ComplianceGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Grade F';
export type ComplianceRating = 'Audit-Ready' | 'Conditional Pass' | 'Non-Compliant - Red Flags Detected';
export type ComplianceStatusText = 'Fully Compliant' | 'Substantially Compliant' | 'Non-Compliant' | 'Critical Risk';

export interface PillarScoreBreakdown {
  score: number; // 0 - 100
  weight: number; // 0.30, 0.20, etc.
  status: 'Compliant' | 'Minor Gaps' | 'Critical Breach';
  summary: string;
  indicatorScores: Record<NDISQualityIndicatorId, number>;
}

export interface APOEndorsementData {
  recommendation: 'APPROVED_FOR_COMMISSION_SUBMISSION' | 'CONDITIONALLY_APPROVED_PENDING_REMEDIATION' | 'REJECTED_MANDATORY_REVISION_REQUIRED';
  authorizedProgramOfficerName: string;
  apoRegistrationNumber: string;
  decisionDate: string;
  conditionsOrMandatedChanges?: string[];
  endorsementNotes: string;
}

export interface AuditMetadata {
  auditId: string;
  auditTimestamp: string;
  auditorEngineVersion: string;
  bspVersion: string;
  integrityHash: string;
}

export interface ParticipantAuditProfile {
  participantId: string;
  ndisNumber: string;
  fullName: string;
  dateOfBirth?: string;
  primaryDisability: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface PractitionerAuditProfile {
  practitionerName: string;
  ndisRegistrationNumber: string;
  pbsRegistrationLevel: 'Core Practitioner' | 'Proficient Practitioner' | 'Advanced Practitioner' | 'Specialist Practitioner';
}

export interface BSPAuditPackage {
  bspId: string;
  clientId: string;
  clientName: string;
  planVersion: string;
  auditTimestamp: string;
  overallScore: number;
  rawWeightedScore: number;
  rating: ComplianceRating;
  complianceGrade: ComplianceGrade;
  complianceStatus: ComplianceStatusText;
  passedIndicatorsCount: number;
  totalIndicatorsCount: number;
  pillarScores: Record<RegulatoryPillar, number>;
  pillarBreakdown: Record<RegulatoryPillar, PillarScoreBreakdown>;
  indicatorResults: NDISQualityIndicatorResult[];
  redFlags: ComplianceRedFlag[];
  deliberationTraces: AgentDeliberationTrace[];
  activePenaltyMultipliers: PenaltyMultiplierResult[];
  restrictivePracticesSummary: {
    totalReported: number;
    authorizedCount: number;
    unauthorizedCount: number;
    prohibitedDetected: boolean;
    missingFadePlanCount: number;
  };
  restrictivePracticesAudit: RestrictivePracticeAuditItem[];
  apoEndorsementReady: boolean;
  apoEndorsement?: APOEndorsementData;
  checksumSha256: string;
  auditMetadata?: AuditMetadata;
  participantProfile?: ParticipantAuditProfile;
  practitionerProfile?: PractitionerAuditProfile;
}

export interface RemediationPatchResult {
  updatedBsp: any;
  summary: string;
  affectedSection: string;
  patchApplied: boolean;
}

export interface RestrictivePractice {
  id: string;
  clientId?: string;
  clientName?: string;
  practiceType: 'Chemical' | 'Mechanical' | 'Physical' | 'Environmental' | 'Seclusion';
  description: string;
  status: 'Proposed' | 'Authorized' | 'Active' | 'Superseded' | 'Expired';
  authorizationBody?: string;
  authorizationReference?: string;
  startDate?: string;
  expiryDate?: string;
  reductionPlanSummary?: string;
  monthlyReportStatus?: 'Submitted' | 'Due' | 'Overdue';
  lastReportedDate?: string;
  clinicalRationale?: string;
  leastRestrictiveRationale?: string;
  leastRestrictiveAlternativesTried?: string[];
  prohibitedRiskAssessment?: string;
  prescribingPractitionerName?: string;
  fadingReviewDate?: string;
  eliminationTargetDate?: string;
  reviewCadenceMonths?: number;
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
  severity: number;
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
  date?: string;
  consultationDate?: string;
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
  version: string;
  status: 'Draft' | 'Panel Review' | 'Submitted to NDIS' | 'Active' | 'Superseded' | 'Published';
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
  fba?: BSPFunctionalAssessment;
  skillTeaching?: BSPSkillTeaching;
  activeReactive?: BSPActiveReactive;
  consultationRecords?: BSPConsultationRecord[];
  staffTrainingAndGovernance?: BSPStaffGovernance;
  complianceScore?: number;
  missingComplianceItems?: string[];
}
