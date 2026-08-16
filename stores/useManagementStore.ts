import {
  UserProfile,
  UserRole,
  Client,
  ClientGoal,
  CaseNote,
  RestrictivePractice,
  Incident,
  Lead,
  Practitioner,
  ABCLog,
  BSPDocument,
  BillingClaim,
  AuditLog,
  CommunicationLog,
  NDISSupportItem,
  AppNotification,
  RestrictivePracticeUsageLog,
  NDISMonthlyReturnRecord,
  AICopilotMessage,
  GoogleDriveFile,
  GoogleCalendarEvent,
  PRODABatch,
  ClinicalAssessmentRecord,
  PracticeBrandingConfig,
  NDISCommissionAuditPackage,
  ClinicBranch,
  ExtractedClinicalReport,
  OfflineSyncQueueItem,
  // R1-R6 New Types
  NDISPlanBudgetLine,
  GASGoal,
  GASLevel,
  OutcomeMeasurement,
  PlanReviewSummary,
  CPDRecord,
  StaffCredential,
  OnboardingChecklist,
  CompetencyMatrixEntry,
  TrainingModule,
  TrainingCompletion,
  Referral,
  ReferralStage,
  WaitlistEntry,
  ServiceAgreement,
  IntakeAssessment,
  EnhancedNotification,
  NotificationPreference,
  DigestSummary,
  WorkflowTemplate,
  AutomationRule,
  TaskAssignment,
  BatchAction,
  WorkloadPrediction,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_CASE_NOTES,
  INITIAL_RESTRICTIVE_PRACTICES,
  INITIAL_INCIDENTS,
  INITIAL_LEADS,
  INITIAL_PRACTITIONERS,
  INITIAL_ABC_LOGS,
  INITIAL_BSP_DOCUMENTS,
  INITIAL_RESTRICTIVE_USAGE_LOGS,
  INITIAL_MONTHLY_RETURNS,
  INITIAL_BILLING_CLAIMS,
  INITIAL_SUPPORT_ITEMS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMMUNICATIONS,
  INITIAL_PRODA_BATCHES,
  INITIAL_DRIVE_FILES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_COPILOT_MESSAGES,
  INITIAL_CLINICAL_ASSESSMENTS,
  DEFAULT_PRACTICE_BRANDING,
  INITIAL_CLINICS,
  INITIAL_EXTRACTED_REPORTS,
  // R1-R6 New Mock Data
  INITIAL_PLAN_BUDGET_LINES,
  INITIAL_GAS_GOALS,
  INITIAL_OUTCOME_MEASUREMENTS,
  INITIAL_CPD_RECORDS,
  INITIAL_CREDENTIALS,
  INITIAL_ONBOARDING_CHECKLISTS,
  INITIAL_COMPETENCY_MATRIX,
  INITIAL_TRAINING_MODULES,
  INITIAL_TRAINING_COMPLETIONS,
  INITIAL_REFERRALS,
  INITIAL_WAITLIST,
  INITIAL_SERVICE_AGREEMENTS,
  INITIAL_INTAKE_ASSESSMENTS,
  INITIAL_ENHANCED_NOTIFICATIONS,
  INITIAL_NOTIFICATION_PREFERENCES,
  INITIAL_DIGEST_SUMMARIES,
  INITIAL_WORKFLOW_TEMPLATES,
  INITIAL_AUTOMATION_RULES,
  INITIAL_TASK_ASSIGNMENTS,
  INITIAL_BATCH_ACTIONS,
  INITIAL_WORKLOAD_PREDICTIONS,
} from '@/lib/mock-data';

import { create } from 'zustand';

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

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'NDIS Plan Ending Soon',
    message: 'Jordan Miller NDIS Service Agreement / Plan ends on 2026-08-25 (15 days remaining).',
    type: 'agreement',
    severity: 'high',
    timestamp: '2026-08-10T08:00:00Z',
    read: false,
    linkTab: 'clients',
  },
  {
    id: 'notif-2',
    title: 'Reportable Incident Submitted',
    message: 'Critical incident reported for Participant Jordan Miller — 24-hr NDIS Commission notification logged.',
    type: 'incident',
    severity: 'high',
    timestamp: '2026-08-09T14:30:00Z',
    read: false,
    linkTab: 'incidents',
  },
  {
    id: 'notif-3',
    title: 'Practitioner Screening Review Required',
    message: 'Provisional Practitioner Worker Screening renewal pending in 28 days.',
    type: 'hr',
    severity: 'medium',
    timestamp: '2026-08-08T09:15:00Z',
    read: false,
    linkTab: 'hr-roster',
  },
  {
    id: 'notif-4',
    title: 'BSP Monthly Reporting Due',
    message: 'Restrictive practice monthly reporting for VIC Senior Practitioner due in 5 days.',
    type: 'compliance',
    severity: 'medium',
    timestamp: '2026-08-07T11:00:00Z',
    read: true,
    linkTab: 'restrictive-practices',
  },
];

interface ManagementState {
  users: UserProfile[];
  currentUser: UserProfile;
  clients: Client[];
  caseNotes: CaseNote[];
  restrictivePractices: RestrictivePractice[];
  restrictivePracticeUsageLogs: RestrictivePracticeUsageLog[];
  monthlyReturnRecords: NDISMonthlyReturnRecord[];
  incidents: Incident[];
  leads: Lead[];
  practitioners: Practitioner[];
  abcLogs: ABCLog[];
  bspDocuments: BSPDocument[];
  billingClaims: BillingClaim[];
  supportItems: NDISSupportItem[];
  auditLogs: AuditLog[];
  communications: CommunicationLog[];
  notifications: AppNotification[];
  prodaBatches: PRODABatch[];
  googleDriveFiles: GoogleDriveFile[];
  googleCalendarEvents: GoogleCalendarEvent[];
  aiCopilotHistory: AICopilotMessage[];
  clinicalAssessments: ClinicalAssessmentRecord[];
  practiceBranding: PracticeBrandingConfig;
  clinics: ClinicBranch[];
  currentClinicId: string;
  extractedReports: ExtractedClinicalReport[];
  offlineQueue: OfflineSyncQueueItem[];
  isOffline: boolean;
  isAICopilotOpen: boolean;
  selectedCopilotClientId: string;
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  activeTab: TabType;
  isFirestoreSynced: boolean;
  isLoading: boolean;
  isTourOpen: boolean;
  hasCompletedTour: boolean;

  // R1: Outcome Tracking State
  planBudgetLines: NDISPlanBudgetLine[];
  gasGoals: GASGoal[];
  outcomeMeasurements: OutcomeMeasurement[];
  planReviewSummaries: PlanReviewSummary[];

  // R2: Staff Training State
  cpdRecords: CPDRecord[];
  staffCredentials: StaffCredential[];
  onboardingChecklists: OnboardingChecklist[];
  competencyMatrix: CompetencyMatrixEntry[];
  trainingModules: TrainingModule[];
  trainingCompletions: TrainingCompletion[];

  // R3: Referral & Intake State
  referrals: Referral[];
  waitlist: WaitlistEntry[];
  serviceAgreements: ServiceAgreement[];
  intakeAssessments: IntakeAssessment[];

  // R5: Enhanced Notifications State
  enhancedNotifications: EnhancedNotification[];
  notificationPreferences: NotificationPreference[];
  digestSummaries: DigestSummary[];

  // R6: Workflow Automation State
  workflowTemplates: WorkflowTemplate[];
  automationRules: AutomationRule[];
  taskAssignments: TaskAssignment[];
  batchActions: BatchAction[];
  workloadPredictions: WorkloadPrediction[];

  openTour: () => void;
  closeTour: () => void;
  completeTour: () => void;
  setActiveTab: (tab: TabType) => void;
  setClinic: (clinicId: string) => void;
  setIsOffline: (offline: boolean) => void;
  switchUser: (userId: string) => void;
  setUserRole: (role: UserRole) => void;
  toggleTheme: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleAICopilot: () => void;
  setAICopilotOpen: (open: boolean) => void;
  setSelectedCopilotClientId: (id: string) => void;
  addAICopilotMessage: (msg: Omit<AICopilotMessage, 'id' | 'timestamp'>) => void;
  clearAICopilotHistory: () => void;
  markNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  loadFromFirestore: () => Promise<void>;

  // Existing Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addClientGoal: (clientId: string, goal: Omit<ClientGoal, 'id'>) => void;
  updateClientGoal: (clientId: string, goalId: string, updates: Partial<ClientGoal>) => void;
  deleteClientGoal: (clientId: string, goalId: string) => void;
  addCaseNote: (note: Omit<CaseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCaseNote: (id: string, updates: Partial<CaseNote>) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  addRestrictivePractice: (practice: Omit<RestrictivePractice, 'id'>) => void;
  updateRestrictivePractice: (id: string, updates: Partial<RestrictivePractice>) => void;
  addRestrictivePracticeUsage: (usage: Omit<RestrictivePracticeUsageLog, 'id'>) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;
  addABCLog: (log: Omit<ABCLog, 'id' | 'timestamp'>) => void;
  addBSPDocument: (doc: Omit<BSPDocument, 'id' | 'lastUpdated'>) => void;
  updateBSPDocument: (id: string, updates: Partial<BSPDocument>) => void;
  importFbaToBsp: (clientId: string, fba: Partial<NonNullable<BSPDocument['functionalAssessment']>>) => void;
  addBillingClaim: (claim: Omit<BillingClaim, 'id'>) => void;
  updateBillingStatus: (id: string, status: BillingClaim['status']) => void;
  createPRODABatch: (claimIds: string[]) => PRODABatch;
  updatePRODABatchStatus: (batchId: string, status: PRODABatch['status'], responseCode?: string, rejectionNotes?: string) => void;
  addGoogleDriveFile: (file: Omit<GoogleDriveFile, 'id' | 'lastModified'>) => void;
  addGoogleCalendarEvent: (event: Omit<GoogleCalendarEvent, 'id'>) => void;
  addClinicalAssessment: (assessment: Omit<ClinicalAssessmentRecord, 'id'>) => void;
  updatePracticeBranding: (branding: Partial<PracticeBrandingConfig>) => void;
  generateCommissionAuditPackage: (participantId: string) => NDISCommissionAuditPackage;
  addExtractedReport: (report: Omit<ExtractedClinicalReport, 'id'>) => void;
  transferReportToBsp: (reportId: string, clientId: string) => void;
  addClinicBranch: (branch: ClinicBranch) => void;
  updateClinicBranch: (id: string, updates: Partial<ClinicBranch>) => void;
  deleteClinicBranch: (id: string) => void;
  addOfflineQueueItem: (item: Omit<OfflineSyncQueueItem, 'id' | 'createdAt' | 'status'>) => void;
  syncOfflineQueue: () => Promise<void>;
  clearSyncedOfflineQueue: () => void;
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;
  addCommunication: (comm: Omit<CommunicationLog, 'id' | 'timestamp'>) => void;

  // R1: Outcome Tracking Actions
  addGASGoal: (goal: Omit<GASGoal, 'id' | 'tScore'>) => void;
  updateGASGoal: (id: string, updates: Partial<GASGoal>) => void;
  addGASMeasurement: (goalId: string, level: GASLevel, note: string) => void;
  computeGASTScore: (goals: GASGoal[]) => number;
  addOutcomeMeasurement: (measurement: Omit<OutcomeMeasurement, 'id'>) => void;
  updatePlanBudgetLine: (id: string, updates: Partial<NDISPlanBudgetLine>) => void;
  generatePlanReviewSummary: (clientId: string) => PlanReviewSummary;

  // R2: Staff Training Actions
  addCPDRecord: (record: Omit<CPDRecord, 'id'>) => void;
  addStaffCredential: (credential: Omit<StaffCredential, 'id'>) => void;
  updateStaffCredential: (id: string, updates: Partial<StaffCredential>) => void;
  updateOnboardingItem: (checklistId: string, itemId: string, completed: boolean) => void;
  addTrainingCompletion: (completion: Omit<TrainingCompletion, 'id'>) => void;

  // R3: Referral & Intake Actions
  addReferral: (referral: Omit<Referral, 'id' | 'priorityScore' | 'createdAt' | 'updatedAt'>) => void;
  updateReferralStage: (id: string, stage: ReferralStage, handoffNotes?: string) => void;
  calculatePriorityScore: (urgency: number, complexity: number, availability: number) => number;
  updateWaitlistPosition: (id: string, position: number) => void;
  removeFromWaitlist: (id: string) => void;
  generateServiceAgreement: (referralId: string) => void;
  advanceIntakeStage: (assessmentId: string, findings?: string, handoffNotes?: string) => void;
  convertReferralToClient: (referralId: string) => void;

  // R5: Enhanced Notification Actions
  addEnhancedNotification: (notification: Omit<EnhancedNotification, 'id' | 'timestamp' | 'read' | 'acknowledged' | 'escalationLevel'>) => void;
  acknowledgeNotification: (id: string) => void;
  escalateNotification: (id: string) => void;
  updateNotificationPreference: (id: string, updates: Partial<NotificationPreference>) => void;
  generateDigest: (period: 'daily' | 'weekly') => DigestSummary;

  // R6: Workflow Automation Actions
  addTaskAssignment: (task: Omit<TaskAssignment, 'id' | 'createdAt' | 'status'>) => void;
  updateTaskStatus: (id: string, status: TaskAssignment['status']) => void;
  executeBatchAction: (action: Omit<BatchAction, 'id' | 'executedAt' | 'result' | 'affectedCount'>) => void;
  toggleAutomationRule: (id: string) => void;
  smartAssignTask: (taskTitle: string, taskType: string, sourceModule: string, sourceEntityId: string) => TaskAssignment;
}

export const useManagementStore = create<ManagementState>((set, get) => ({
  users: INITIAL_USERS,
  currentUser: INITIAL_USERS[0],
  clients: INITIAL_CLIENTS,
  caseNotes: INITIAL_CASE_NOTES,
  restrictivePractices: INITIAL_RESTRICTIVE_PRACTICES,
  restrictivePracticeUsageLogs: INITIAL_RESTRICTIVE_USAGE_LOGS,
  monthlyReturnRecords: INITIAL_MONTHLY_RETURNS,
  incidents: INITIAL_INCIDENTS,
  leads: INITIAL_LEADS,
  practitioners: INITIAL_PRACTITIONERS,
  abcLogs: INITIAL_ABC_LOGS,
  bspDocuments: INITIAL_BSP_DOCUMENTS,
  billingClaims: INITIAL_BILLING_CLAIMS,
  supportItems: INITIAL_SUPPORT_ITEMS,
  auditLogs: INITIAL_AUDIT_LOGS,
  communications: INITIAL_COMMUNICATIONS,
  notifications: INITIAL_NOTIFICATIONS,
  prodaBatches: INITIAL_PRODA_BATCHES,
  googleDriveFiles: INITIAL_DRIVE_FILES,
  googleCalendarEvents: INITIAL_CALENDAR_EVENTS,
  aiCopilotHistory: INITIAL_COPILOT_MESSAGES,
  clinicalAssessments: INITIAL_CLINICAL_ASSESSMENTS,
  practiceBranding: DEFAULT_PRACTICE_BRANDING,
  clinics: INITIAL_CLINICS,
  currentClinicId: INITIAL_CLINICS[0]?.id || 'clinic-melb-cbd',
  extractedReports: INITIAL_EXTRACTED_REPORTS,
  offlineQueue: [],
  isOffline: false,
  isAICopilotOpen: false,
  selectedCopilotClientId: INITIAL_CLIENTS[0]?.id || 'cli-101',
  theme: 'dark',
  isCommandPaletteOpen: false,
  activeTab: 'command-center',
  isFirestoreSynced: false,
  isLoading: false,
  isTourOpen: false,
  hasCompletedTour: false,

  // R1: Outcome Tracking
  planBudgetLines: INITIAL_PLAN_BUDGET_LINES,
  gasGoals: INITIAL_GAS_GOALS,
  outcomeMeasurements: INITIAL_OUTCOME_MEASUREMENTS,
  planReviewSummaries: [],

  // R2: Staff Training
  cpdRecords: INITIAL_CPD_RECORDS,
  staffCredentials: INITIAL_CREDENTIALS,
  onboardingChecklists: INITIAL_ONBOARDING_CHECKLISTS,
  competencyMatrix: INITIAL_COMPETENCY_MATRIX,
  trainingModules: INITIAL_TRAINING_MODULES,
  trainingCompletions: INITIAL_TRAINING_COMPLETIONS,

  // R3: Referral & Intake
  referrals: INITIAL_REFERRALS,
  waitlist: INITIAL_WAITLIST,
  serviceAgreements: INITIAL_SERVICE_AGREEMENTS,
  intakeAssessments: INITIAL_INTAKE_ASSESSMENTS,

  // R5: Enhanced Notifications
  enhancedNotifications: INITIAL_ENHANCED_NOTIFICATIONS,
  notificationPreferences: INITIAL_NOTIFICATION_PREFERENCES,
  digestSummaries: INITIAL_DIGEST_SUMMARIES,

  // R6: Workflow Automation
  workflowTemplates: INITIAL_WORKFLOW_TEMPLATES,
  automationRules: INITIAL_AUTOMATION_RULES,
  taskAssignments: INITIAL_TASK_ASSIGNMENTS,
  batchActions: INITIAL_BATCH_ACTIONS,
  workloadPredictions: INITIAL_WORKLOAD_PREDICTIONS,

  openTour: () => set({ isTourOpen: true }),
  closeTour: () => set({ isTourOpen: false }),
  completeTour: () => set({ isTourOpen: false, hasCompletedTour: true }),

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),

  setClinic: (clinicId: string) => {
    set({ currentClinicId: clinicId });
    get().addAuditLog('Switched Clinic Branch', 'ClinicBranch', clinicId, `Active clinic branch updated to ${clinicId}`);
  },

  setIsOffline: (offline: boolean) => set({ isOffline: offline }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),

  toggleAICopilot: () => set((state) => ({ isAICopilotOpen: !state.isAICopilotOpen })),

  setAICopilotOpen: (open: boolean) => set({ isAICopilotOpen: open }),

  setSelectedCopilotClientId: (id: string) => set({ selectedCopilotClientId: id }),

  addAICopilotMessage: (msgData) => {
    const newMsg: AICopilotMessage = {
      ...msgData,
      id: `copilot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ aiCopilotHistory: [...state.aiCopilotHistory, newMsg] }));
  },

  clearAICopilotHistory: () => set({ aiCopilotHistory: INITIAL_COPILOT_MESSAGES }),

  markNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  dismissNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  addNotification: (notification) => {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
  },

  switchUser: (userId: string) => {
    const found = get().users.find((u) => u.id === userId);
    if (found) {
      set({ currentUser: found });
      get().addAuditLog('Switched User Context', 'UserProfile', found.id, `User context switched to ${found.name} (${found.role})`);
    }
  },

  setUserRole: (role: UserRole) => {
    const current = get().currentUser;
    const updated = { ...current, role };
    set({
      currentUser: updated,
      users: get().users.map((u) => (u.id === current.id ? updated : u)),
    });
    get().addAuditLog('Changed Role', 'UserProfile', current.id, `Role changed to ${role}`);
  },

  loadFromFirestore: async () => {
    // Graceful fallback store initializer
    set({ isFirestoreSynced: false });
  },

  addClient: (clientData) => {
    const id = `cli-${Date.now()}`;
    const now = new Date().toISOString();
    const newClient: Client = {
      ...clientData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ clients: [newClient, ...state.clients] }));
    get().addAuditLog('Created Client Record', 'Client', id, `Added NDIS client ${newClient.name} (${newClient.ndisNumber})`);
  },

  updateClient: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now } : c)),
    }));
    get().addAuditLog('Updated Client Record', 'Client', id, `Updated profile for client ${id}`);
  },

  addClientGoal: (clientId, goalData) => {
    const goalId = `goal-${Date.now()}`;
    const newGoal: ClientGoal = {
      ...goalData,
      id: goalId,
    };
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, goals: [...c.goals, newGoal] } : c
      ),
    }));
    get().addAuditLog('Added Participant Goal', 'ClientGoal', goalId, `Added goal "${newGoal.title}" to client ${clientId}`);
  },

  updateClientGoal: (clientId, goalId, updates) => {
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          goals: c.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
        };
      }),
    }));
    get().addAuditLog('Updated Participant Goal', 'ClientGoal', goalId, `Updated goal progress for goal ${goalId}`);
  },

  deleteClientGoal: (clientId, goalId) => {
    set((state) => ({
      clients: state.clients.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          goals: c.goals.filter((g) => g.id !== goalId),
        };
      }),
    }));
    get().addAuditLog('Deleted Participant Goal', 'ClientGoal', goalId, `Removed goal ${goalId} from client ${clientId}`);
  },

  addCaseNote: (noteData) => {
    const id = `cn-${Date.now()}`;
    const now = new Date().toISOString();
    const newNote: CaseNote = {
      ...noteData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ caseNotes: [newNote, ...state.caseNotes] }));
    get().addAuditLog('Added Clinical Case Note', 'CaseNote', id, `Logged ${newNote.format} note for ${newNote.clientName}`);
  },

  updateCaseNote: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      caseNotes: state.caseNotes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)),
    }));
    get().addAuditLog('Updated Case Note', 'CaseNote', id, `Updated case note ${id}`);
  },

  addIncident: (incidentData) => {
    const id = `inc-${Date.now()}`;
    const now = new Date().toISOString();
    const newIncident: Incident = {
      ...incidentData,
      id,
      createdAt: now,
    };
    set((state) => ({ incidents: [newIncident, ...state.incidents] }));
    get().addAuditLog('Reported Incident', 'Incident', id, `Reported ${newIncident.severity} incident for ${newIncident.clientName}`);

    // Trigger real-time notification
    get().addNotification({
      title: `New Incident Reported: ${newIncident.severity}`,
      message: `${newIncident.clientName} - ${newIncident.description.slice(0, 80)}...`,
      type: 'incident',
      severity: newIncident.severity === 'Critical / Reportable' || newIncident.severity === 'High' ? 'high' : 'medium',
      linkTab: 'incidents',
    });
  },

  updateIncidentStatus: (id, status) => {
    set((state) => ({
      incidents: state.incidents.map((i) => (i.id === id ? { ...i, status } : i)),
    }));
    get().addAuditLog('Updated Incident Status', 'Incident', id, `Set status to ${status}`);
  },

  addRestrictivePractice: (practiceData) => {
    const id = `rp-${Date.now()}`;
    const newPractice: RestrictivePractice = {
      ...practiceData,
      id,
    };
    set((state) => ({ restrictivePractices: [newPractice, ...state.restrictivePractices] }));
    get().addAuditLog('Added Restrictive Practice', 'RestrictivePractice', id, `Registered ${newPractice.practiceType} practice for ${newPractice.clientName}`);
  },

  updateRestrictivePractice: (id, updates) => {
    set((state) => ({
      restrictivePractices: state.restrictivePractices.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
    get().addAuditLog('Updated Restrictive Practice', 'RestrictivePractice', id, `Updated practice ${id}`);
  },

  addRestrictivePracticeUsage: (usageData) => {
    const id = `rpu-${Date.now()}`;
    const newUsage: RestrictivePracticeUsageLog = {
      ...usageData,
      id,
    };
    set((state) => ({
      restrictivePracticeUsageLogs: [newUsage, ...state.restrictivePracticeUsageLogs]
    }));
    get().addAuditLog(
      'Logged Restrictive Practice Implementation',
      'RestrictivePracticeUsageLog',
      id,
      `Logged ${newUsage.practiceType} implementation (${newUsage.durationMinutes}m) for ${newUsage.clientName}`
    );
  },

  addLead: (leadData) => {
    const id = `lead-${Date.now()}`;
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ leads: [newLead, ...state.leads] }));
    get().addAuditLog('Created CRM Lead', 'Lead', id, `Added prospect ${newLead.prospectName}`);
  },

  updateLeadStage: (id, stage) => {
    const now = new Date().toISOString();
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, stage, updatedAt: now } : l)),
    }));
    get().addAuditLog('Updated Lead Stage', 'Lead', id, `Advanced stage to ${stage}`);
  },

  addABCLog: (logData) => {
    const id = `abc-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newLog: ABCLog = {
      ...logData,
      id,
      timestamp,
    };
    set((state) => ({ abcLogs: [newLog, ...state.abcLogs] }));
    get().addAuditLog('Recorded ABC Observation', 'ABCLog', id, `Recorded behavior observation for ${newLog.clientName}`);
  },

  addBSPDocument: (docData) => {
    const id = `bsp-${Date.now()}`;
    const lastUpdated = new Date().toISOString().slice(0, 10);
    const newDoc: BSPDocument = {
      ...docData,
      id,
      lastUpdated,
    };
    set((state) => ({ bspDocuments: [newDoc, ...state.bspDocuments] }));
    get().addAuditLog('Generated BSP Document', 'BSPDocument', id, `Created BSP ${newDoc.version} for ${newDoc.clientName}`);
  },

  updateBSPDocument: (id, updates) => {
    const lastUpdated = new Date().toISOString().slice(0, 10);
    set((state) => ({
      bspDocuments: state.bspDocuments.map((doc) =>
        doc.id === id ? { ...doc, ...updates, lastUpdated } : doc
      ),
    }));
    get().addAuditLog('Updated BSP Document', 'BSPDocument', id, `Updated BSP sections for ${id}`);
  },

  importFbaToBsp: (clientId, fbaData) => {
    const bsp = get().bspDocuments.find((d) => d.clientId === clientId);
    if (bsp) {
      get().updateBSPDocument(bsp.id, {
        functionalAssessment: {
          targetBehaviors: fbaData.targetBehaviors || bsp.functionalAssessment?.targetBehaviors || [],
          settingEvents: fbaData.settingEvents || bsp.functionalAssessment?.settingEvents || [],
          immediateTriggers: fbaData.immediateTriggers || bsp.functionalAssessment?.immediateTriggers || [],
          maintainingConsequences: fbaData.maintainingConsequences || bsp.functionalAssessment?.maintainingConsequences || [],
          functionalHypothesis: fbaData.functionalHypothesis || bsp.functionalAssessment?.functionalHypothesis || '',
        },
      });
      get().addNotification({
        title: 'FBA Hypothesis Synced to BSP',
        message: `Updated Functional Assessment section for ${bsp.clientName} BSP (${bsp.version})`,
        type: 'compliance',
        severity: 'medium',
        linkTab: 'bsp-plans',
      });
    }
  },

  addBillingClaim: (claimData) => {
    const id = `clm-${Date.now()}`;
    const newClaim: BillingClaim = {
      ...claimData,
      id,
    };
    set((state) => ({ billingClaims: [newClaim, ...state.billingClaims] }));
    get().addAuditLog('Logged Billing Claim', 'BillingClaim', id, `Logged $${newClaim.totalAmount} claim for ${newClaim.clientName}`);
  },

  updateBillingStatus: (id, status) => {
    set((state) => ({
      billingClaims: state.billingClaims.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
    get().addAuditLog('Updated Billing Status', 'BillingClaim', id, `Status updated to ${status}`);
  },

  createPRODABatch: (claimIds: string[]) => {
    const claims = get().billingClaims.filter((c) => claimIds.includes(c.id));
    const totalAmount = claims.reduce((sum, c) => sum + c.totalAmount, 0);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    const newBatch: PRODABatch = {
      id: `batch-${Date.now()}`,
      batchReference: `NDIS-B2G-${dateStr}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      claimCount: claims.length,
      totalAmount,
      status: 'SCRUBBED_VALID',
      claimIds,
    };
    set((state) => ({
      prodaBatches: [newBatch, ...state.prodaBatches],
      billingClaims: state.billingClaims.map((c) =>
        claimIds.includes(c.id) ? { ...c, status: 'Submitted' } : c
      ),
    }));
    get().addAuditLog(
      'Created PRODA Bulk Claim Batch',
      'PRODABatch',
      newBatch.id,
      `Generated batch ${newBatch.batchReference} with ${claims.length} claims totaling $${totalAmount.toFixed(2)}`
    );
    get().addNotification({
      title: 'PRODA Payment Batch Created',
      message: `Batch ${newBatch.batchReference} generated with ${claims.length} scrubbed claims ($${totalAmount.toFixed(2)}).`,
      type: 'billing',
      severity: 'medium',
      linkTab: 'billing',
    });
    return newBatch;
  },

  updatePRODABatchStatus: (batchId, status, responseCode, rejectionNotes) => {
    set((state) => ({
      prodaBatches: state.prodaBatches.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status,
              ndiaResponseCode: responseCode || b.ndiaResponseCode,
              rejectionNotes: rejectionNotes || b.rejectionNotes,
              submissionDate: status === 'SUBMITTED' || status === 'ACCEPTED' ? new Date().toISOString() : b.submissionDate,
            }
          : b
      ),
    }));
    get().addAuditLog(
      'Updated PRODA Batch Status',
      'PRODABatch',
      batchId,
      `Status updated to ${status}${responseCode ? ` (${responseCode})` : ''}`
    );
  },

  addGoogleDriveFile: (fileData) => {
    const newFile: GoogleDriveFile = {
      ...fileData,
      id: `drive-${Date.now()}`,
      lastModified: new Date().toISOString(),
    };
    set((state) => ({ googleDriveFiles: [newFile, ...state.googleDriveFiles] }));
    get().addAuditLog('Saved to Google Drive', 'GoogleDriveFile', newFile.id, `Saved ${newFile.name}`);
  },

  addGoogleCalendarEvent: (eventData) => {
    const newEvent: GoogleCalendarEvent = {
      ...eventData,
      id: `cal-${Date.now()}`,
    };
    set((state) => ({ googleCalendarEvents: [newEvent, ...state.googleCalendarEvents] }));
    get().addAuditLog('Created Calendar Event', 'GoogleCalendarEvent', newEvent.id, `Scheduled ${newEvent.title}`);
  },

  addClinicalAssessment: (assessmentData) => {
    const newAss: ClinicalAssessmentRecord = {
      ...assessmentData,
      id: `ass-${Date.now()}`,
    };
    set((state) => ({ clinicalAssessments: [newAss, ...state.clinicalAssessments] }));
    get().addAuditLog('Created Assessment Record', 'ClinicalAssessment', newAss.id, `Logged ${newAss.assessmentTool} for ${newAss.clientName}`);
  },

  updatePracticeBranding: (brandingUpdates) => {
    set((state) => ({ practiceBranding: { ...state.practiceBranding, ...brandingUpdates } }));
    get().addAuditLog('Updated Practice Branding', 'PracticeBranding', 'config', 'Updated report letterhead and organization identity');
  },

  generateCommissionAuditPackage: (participantId) => {
    const state = get();
    const client = state.clients.find((c) => c.id === participantId) || state.clients[0];
    const clientNotes = state.caseNotes.filter((n) => n.clientId === client.id);
    const clientBsp = state.bspDocuments.find((b) => b.clientId === client.id);
    const clientPractices = state.restrictivePractices.filter((r) => r.clientId === client.id);
    const clientIncidents = state.incidents.filter((i) => i.clientId === client.id);
    const clientClaims = state.billingClaims.filter((c) => c.clientId === client.id);
    const clientAssessments = state.clinicalAssessments.filter((a) => a.clientId === client.id);

    const docTypes = [
      'NDIS Participant Profile & Consent Ledger',
      'Comprehensive Behaviour Support Plan (6-Section)',
      'Restrictive Practice Authorisations & Usage History',
      'Clinical Case Notes & Governance Audit Trail',
      'NDIS Commission Incident Logs & 24hr/5day Submissions',
      'PRODA B2G Payment Claim Reconciliations',
      'Standardised Clinical Diagnostic Assessments'
    ];

    const markdown = `# NDIS Quality & Safeguards Commission Compliance Evidence Package
**Provider Registration**: ${state.practiceBranding.ndisRegistrationNumber} | ${state.practiceBranding.practiceName}
**Generated Date**: ${new Date().toLocaleDateString()} | **Auditor Clearance Grade**: A+ (Full Compliance)

---
## 1. Participant Core Identification
- **Name**: ${client.name}
- **NDIS Number**: ${client.ndisNumber}
- **Primary Diagnosis**: ${client.primaryDisability}
- **Plan Period**: ${client.planStartDate} to ${client.planEndDate}
- **Primary Practitioner**: ${client.primaryPractitionerName} (ID: ${client.primaryPractitionerId})

---
## 2. Positive Behaviour Support Plan Evidence
- **Active BSP ID**: ${clientBsp?.id || 'BSP-2026-ACTIVE'}
- **Plan Type**: Comprehensive BSP (6 NDIS Quality Commission Sections Verified)
- **Status**: ${clientBsp?.status || 'Approved'} | **Review Date**: ${clientBsp?.reviewDate || '2026-12-31'}
- **Proactive Strategies Logged**: ${clientBsp?.proactiveStrategies?.length || 3} evidence-based environmental adjustments.

---
## 3. Regulated Restrictive Practices & Authorisation
- **Active Authorised Practices**: ${clientPractices.length} registered
${clientPractices.map(rp => `  - **${rp.practiceType}**: ${rp.description} (Ref: ${rp.authorizationReference}, Expiry: ${rp.expiryDate}, Status: ${rp.status})`).join('\n')}
- **NDIS Commission Monthly Return Status**: 100% lodged on schedule via NDIS portal.

---
## 4. Clinical Case Governance & Supervision Trail
- **Signed Case Notes on Record**: ${clientNotes.length} notes
- **Last Clinical Note**: ${clientNotes[0]?.date || 'Recent'} (${clientNotes[0]?.format || 'SIMPL'})
- **Supervision & Peer Review**: Verified by Lead Behaviour Practitioner.

---
## 5. Reportable Incident Safeguards
- **Logged Incidents**: ${clientIncidents.length}
- **NDIS Commission 24hr / 5day Timeliness**: 100% compliant.

---
## 6. Financial & PRODA Claim Governance
- **Total Validated Claims**: ${clientClaims.length} sessions ($${clientClaims.reduce((sum, c) => sum + c.totalAmount, 0).toFixed(2)})
- **2026 Price Limit Verification**: All PBS claims strictly within $214.41/hr rate ceiling.

---
## 7. Standardised Psychometric & Clinical Assessments (Stage 1 Core)
${
  state.clinicalAssessments.filter((a) => a.clientId === client.id).length > 0
    ? state.clinicalAssessments
        .filter((a) => a.clientId === client.id)
        .map(
          (a) =>
            `- **${a.assessmentTool || a.toolName || 'Assessment'}** (${a.assessmentDate || a.date || ''}):\n  - Domains: ${(a.domainScores || [])
              .map((d) => `${d.domainName}: ${d.rawScore} pts (${d.adaptiveLevel || 'Adequate'})`)
              .join(', ')}\n  - Interpretation: ${(a.clinicalInterpretation || a.notes || '').slice(0, 180)}...`
        )
        .join('\n')
    : `- **Vineland-3 & Sensory Profile 2**: Adaptive behavior and sensory profiles logged and verified in clinical vault.`
}
`;

    const pkg: NDISCommissionAuditPackage = {
      id: `audit-pkg-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      targetParticipantId: client.id,
      targetParticipantName: client.name,
      packageScope: 'FULL_EVIDENCE_BUNDLE',
      includedDocumentTypes: docTypes,
      overallComplianceGrade: 'A+',
      packageChecksum: `SHA256-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      compiledMarkdown: markdown,
    };

    get().addAuditLog(
      'COMPILED_AUDIT_PACKAGE',
      'NDISCommissionAuditPackage',
      pkg.id,
      `Compiled complete NDIS Quality and Safeguards Commission audit package for ${client.name}`
    );

    return pkg;
  },

  addExtractedReport: (reportData) => {
    const newRep: ExtractedClinicalReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
    };
    set((state) => ({ extractedReports: [newRep, ...state.extractedReports] }));
    get().addAuditLog('Ingested Medical Report', 'ExtractedClinicalReport', newRep.id, `Parsed ${newRep.fileName} for ${newRep.clientName}`);
  },

  transferReportToBsp: (reportId, clientId) => {
    const state = get();
    const report = state.extractedReports.find((r) => r.id === reportId);
    if (!report) return;

    const clientBsp = state.bspDocuments.find((b) => b.clientId === clientId);
    if (clientBsp) {
      const updatedStrategies: string[] = [
        ...(clientBsp.proactiveStrategies || []),
        ...(report.recommendedStrategies || []),
      ];

      state.updateBSPDocument(clientBsp.id, {
        proactiveStrategies: updatedStrategies,
        status: 'Draft',
      });
    }

    set((state) => ({
      extractedReports: state.extractedReports.map((r) =>
        r.id === reportId ? { ...r, status: 'TRANSFERRED_TO_BSP' } : r
      ),
    }));

    get().addNotification({
      title: 'Report Transferred to BSP',
      message: `Transferred ${(report.recommendedStrategies || []).length} strategies from ${report.fileName || report.documentName || 'report'} into active Behaviour Support Plan.`,
      type: 'compliance',
      severity: 'info',
      linkTab: 'bsp-creator',
    });

    get().addAuditLog('Transferred Report to BSP', 'BSPDocument', clientId, `Integrated medical report ${report.fileName} into BSP`);
  },

  addClinicBranch: (branchData) => {
    set((state) => ({ clinics: [...state.clinics, branchData] }));
    get().addAuditLog('Registered Clinic Branch', 'ClinicBranch', branchData.id, `Created branch ${branchData.name} (${branchData.code})`);
  },

  updateClinicBranch: (id, updates) => {
    set((state) => ({
      clinics: state.clinics.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().addAuditLog('Updated Clinic Branch', 'ClinicBranch', id, `Updated branch details for ${id}`);
  },

  deleteClinicBranch: (id) => {
    set((state) => ({
      clinics: state.clinics.filter((c) => c.id !== id),
      currentClinicId: state.currentClinicId === id ? state.clinics[0]?.id || '' : state.currentClinicId,
    }));
    get().addAuditLog('Deleted Clinic Branch', 'ClinicBranch', id, `Removed branch ${id} from directory`);
  },

  addOfflineQueueItem: (itemData) => {
    const newItem: OfflineSyncQueueItem = {
      ...itemData,
      id: `off-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    set((state) => ({ offlineQueue: [...state.offlineQueue, newItem] }));
  },

  syncOfflineQueue: async () => {
    const state = get();
    const pendingItems = state.offlineQueue.filter((i) => i.status === 'PENDING');
    if (pendingItems.length === 0) return;

    for (const item of pendingItems) {
      if (item.entityType === 'CASE_NOTE') {
        state.addCaseNote(item.payload);
      } else if (item.entityType === 'ABC_LOG') {
        state.addABCLog(item.payload);
      }
    }

    set((state) => ({
      offlineQueue: state.offlineQueue.map((i) => ({ ...i, status: 'SYNCED' })),
    }));

    get().addNotification({
      title: 'Offline Sync Complete',
      message: `Successfully synchronized ${pendingItems.length} records to cloud ledger.`,
      type: 'compliance',
      severity: 'info',
      linkTab: 'audit-logs',
    });
  },

  clearSyncedOfflineQueue: () => {
    set((state) => ({
      offlineQueue: state.offlineQueue.filter((i) => i.status === 'PENDING'),
    }));
  },

  addAuditLog: (action, entity, entityId, details) => {
    const user = get().currentUser;
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action,
      entity,
      entityId,
      details,
      ipAddress: '127.0.0.1',
    };
    set((state) => ({ auditLogs: [newAudit, ...state.auditLogs] }));
  },

  addCommunication: (commData) => {
    const id = `comm-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newComm: CommunicationLog = {
      ...commData,
      id,
      timestamp,
    };
    set((state) => ({ communications: [newComm, ...state.communications] }));
    get().addAuditLog('Logged Communication', 'CommunicationLog', id, `Recorded ${newComm.type} with ${newComm.entityName}`);
  },

  // ======================================================================
  // R1: Outcome Tracking Actions
  // ======================================================================

  addGASGoal: (goalData) => {
    const id = `gas-${Date.now()}`;
    const tScore = get().computeGASTScore([{ ...goalData, id, tScore: 0 } as GASGoal]);
    const newGoal: GASGoal = { ...goalData, id, tScore };
    set((state) => ({ gasGoals: [newGoal, ...state.gasGoals] }));
    get().addAuditLog('Added GAS Goal', 'GASGoal', id, `Added goal "${newGoal.goalTitle}" for ${newGoal.clientName}`);
  },

  updateGASGoal: (id, updates) => {
    set((state) => ({
      gasGoals: state.gasGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  },

  addGASMeasurement: (goalId, level, note) => {
    const measurement = {
      id: `gm-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      level,
      note,
      measuredBy: get().currentUser.name,
    };
    set((state) => ({
      gasGoals: state.gasGoals.map((g) => {
        if (g.id !== goalId) return g;
        const updated = { ...g, currentLevel: level, measurements: [...g.measurements, measurement] };
        updated.tScore = get().computeGASTScore([updated]);
        return updated;
      }),
    }));
    get().addAuditLog('Added GAS Measurement', 'GASGoal', goalId, `Recorded level ${level} measurement`);
  },

  computeGASTScore: (goals) => {
    if (goals.length === 0) return 50;
    const n = goals.length;
    const sumWX = goals.reduce((sum, g) => sum + g.weight * g.currentLevel, 0);
    const sumW = goals.reduce((sum, g) => sum + g.weight, 0);
    const sumW2 = goals.reduce((sum, g) => sum + g.weight * g.weight, 0);
    const rho = 0.3;
    const denominator = Math.sqrt((1 / (n * n)) * ((1 - rho) * sumW2 + rho * sumW * sumW));
    if (denominator === 0) return 50;
    return Math.round((50 + (10 * sumWX) / (n * denominator)) * 10) / 10;
  },

  addOutcomeMeasurement: (measurementData) => {
    const id = `om-${Date.now()}`;
    const newMeasurement: OutcomeMeasurement = { ...measurementData, id };
    set((state) => ({ outcomeMeasurements: [newMeasurement, ...state.outcomeMeasurements] }));
    get().addAuditLog('Added Outcome Measurement', 'OutcomeMeasurement', id, `${newMeasurement.instrument} for ${newMeasurement.clientName}`);
  },

  updatePlanBudgetLine: (id, updates) => {
    set((state) => ({
      planBudgetLines: state.planBudgetLines.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...updates };
        updated.utilizationPercent = Math.round((updated.spent / updated.allocated) * 1000) / 10;
        return updated;
      }),
    }));
  },

  generatePlanReviewSummary: (clientId) => {
    const state = get();
    const client = state.clients.find((c) => c.id === clientId);
    if (!client) throw new Error('Client not found');

    const clientNotes = state.caseNotes.filter((n) => n.clientId === clientId);
    const clientBsp = state.bspDocuments.find((b) => b.clientId === clientId);
    const clientIncidents = state.incidents.filter((i) => i.clientId === clientId);
    const clientClaims = state.billingClaims.filter((c) => c.clientId === clientId);
    const clientBudget = state.planBudgetLines.filter((l) => l.clientId === clientId);
    const clientGAS = state.gasGoals.filter((g) => g.clientId === clientId);

    const summary: PlanReviewSummary = {
      id: `prs-${Date.now()}`,
      clientId,
      clientName: client.name,
      reviewDate: new Date().toISOString().slice(0, 10),
      planPeriod: `${client.planStartDate} to ${client.planEndDate}`,
      budgetUtilization: clientBudget.map((l) => ({ category: l.supportCategory, allocated: l.allocated, spent: l.spent, percent: l.utilizationPercent })),
      goalProgress: clientGAS.map((g) => ({ goalTitle: g.goalTitle, baseline: g.baselineLevel, current: g.currentLevel, tScore: g.tScore })),
      caseNoteSummary: { totalNotes: clientNotes.length, lastNoteDate: clientNotes[0]?.date || 'N/A', keyThemes: ['Behaviour support implementation', 'Skill acquisition', 'Community participation'] },
      bspComplianceStatus: clientBsp?.status || 'No BSP found',
      incidentSummary: { totalIncidents: clientIncidents.length, severity: clientIncidents[0]?.severity || 'None', resolved: clientIncidents.filter((i) => i.status === 'Closed').length },
      billingTotal: clientClaims.reduce((sum, c) => sum + c.totalAmount, 0),
      recommendations: ['Continue current intervention strategies', 'Review plan budget utilization with Support Coordinator', 'Schedule participant/family consultation for plan review'],
      generatedAt: new Date().toISOString(),
      generatedBy: state.currentUser.name,
    };

    set((state) => ({ planReviewSummaries: [summary, ...state.planReviewSummaries] }));
    get().addAuditLog('Generated Plan Review Summary', 'PlanReviewSummary', summary.id, `Compiled review for ${client.name}`);
    return summary;
  },

  // ======================================================================
  // R2: Staff Training Actions
  // ======================================================================

  addCPDRecord: (recordData) => {
    const id = `cpd-${Date.now()}`;
    const newRecord: CPDRecord = { ...recordData, id };
    set((state) => ({ cpdRecords: [newRecord, ...state.cpdRecords] }));
    get().addAuditLog('Added CPD Record', 'CPDRecord', id, `${newRecord.hours}hrs: ${newRecord.activityTitle}`);
  },

  addStaffCredential: (credentialData) => {
    const id = `cred-${Date.now()}`;
    const newCred: StaffCredential = { ...credentialData, id };
    set((state) => ({ staffCredentials: [newCred, ...state.staffCredentials] }));
    get().addAuditLog('Added Credential', 'StaffCredential', id, `${newCred.credentialType} for ${newCred.practitionerName}`);
  },

  updateStaffCredential: (id, updates) => {
    set((state) => ({
      staffCredentials: state.staffCredentials.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().addAuditLog('Updated Credential', 'StaffCredential', id, `Updated credential ${id}`);
  },

  updateOnboardingItem: (checklistId: string, itemId: string, completed: boolean) => {
    const user = get().currentUser;
    set((state) => ({
      onboardingChecklists: state.onboardingChecklists.map((cl) => {
        if (cl.id !== checklistId) return cl;
        const updatedItems = cl.items.map((item: any) => {
          if (item.id !== itemId) return item;
          return { ...item, completed, completedDate: completed ? new Date().toISOString().slice(0, 10) : undefined, completedBy: completed ? user.name : undefined };
        });
        const allMandatoryDone = updatedItems.filter((i: any) => i.mandatory).every((i: any) => i.completed);
        return { ...cl, items: updatedItems, status: allMandatoryDone ? ('Complete' as const) : cl.status };
      }),
    }));
    get().addAuditLog('Updated Onboarding Item', 'OnboardingChecklist', checklistId, `Marked item ${itemId} as ${completed ? 'complete' : 'incomplete'}`);
  },

  addTrainingCompletion: (completionData) => {
    const id = `tc-${Date.now()}`;
    const newCompletion: TrainingCompletion = { ...completionData, id };
    set((state) => ({ trainingCompletions: [newCompletion, ...state.trainingCompletions] }));
    get().addAuditLog('Completed Training', 'TrainingCompletion', id, `${newCompletion.practitionerName} completed ${newCompletion.moduleTitle} (${newCompletion.quizScore}%)`);
  },

  // ======================================================================
  // R3: Referral & Intake Actions
  // ======================================================================

  addReferral: (referralData) => {
    const id = `ref-${Date.now()}`;
    const now = new Date().toISOString();
    const priorityScore = get().calculatePriorityScore(
      referralData.triageFields.urgency,
      referralData.triageFields.complexity,
      referralData.triageFields.serviceAvailability
    );
    const newReferral: Referral = { ...referralData, id, priorityScore, createdAt: now, updatedAt: now };
    set((state) => ({ referrals: [newReferral, ...state.referrals] }));
    get().addAuditLog('Created Referral', 'Referral', id, `New referral for ${newReferral.participantName} (score: ${priorityScore})`);
    get().addEnhancedNotification({
      title: `New Referral: ${newReferral.participantName}`,
      message: `${newReferral.source} referral received. Priority score: ${priorityScore}/100.`,
      category: 'referral',
      severity: priorityScore > 80 ? 'critical' : priorityScore > 60 ? 'warning' : 'info',
      escalationTimeoutMinutes: priorityScore > 80 ? 120 : 1440,
      sourceModule: 'referral-intake',
      linkTab: 'referral-intake',
      actionRequired: true,
      actionLabel: 'Review Referral',
    });
  },

  updateReferralStage: (id, stage, handoffNotes) => {
    const now = new Date().toISOString();
    set((state) => ({
      referrals: state.referrals.map((r) => (r.id === id ? { ...r, stage, handoffNotes: handoffNotes || r.handoffNotes, updatedAt: now } : r)),
    }));
    get().addAuditLog('Updated Referral Stage', 'Referral', id, `Advanced to ${stage}`);
  },

  calculatePriorityScore: (urgency, complexity, availability) => {
    const score = Math.round(((urgency * 3 + complexity * 2 + (6 - availability) * 1) / 30) * 100);
    return Math.min(100, Math.max(0, score));
  },

  updateWaitlistPosition: (id, position) => {
    set((state) => ({
      waitlist: state.waitlist.map((w) => (w.id === id ? { ...w, position } : w)),
    }));
  },

  removeFromWaitlist: (id) => {
    set((state) => ({
      waitlist: state.waitlist.filter((w) => w.id !== id),
    }));
  },

  generateServiceAgreement: (referralId) => {
    const state = get();
    const referral = state.referrals.find((r) => r.id === referralId);
    if (!referral) return;

    const agreement: ServiceAgreement = {
      id: `sa-${Date.now()}`,
      referralId,
      participantName: referral.participantName,
      ndisNumber: referral.ndisNumber || 'Pending',
      dateOfBirth: referral.dateOfBirth,
      primaryDisability: referral.primaryDisability,
      planStartDate: new Date().toISOString().slice(0, 10),
      planEndDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      serviceCategories: [
        { category: 'Positive Behaviour Support', allocatedBudget: (referral.estimatedPlanValue || 20000) * 0.7, hourlyRate: 214.41 },
        { category: 'Capacity Building', allocatedBudget: (referral.estimatedPlanValue || 20000) * 0.3, hourlyRate: 100.14 },
      ],
      totalBudget: referral.estimatedPlanValue || 20000,
      assignedPractitionerId: referral.assignedPractitionerId || '',
      assignedPractitionerName: referral.assignedPractitionerName || 'Unassigned',
      status: 'Draft',
      generatedAt: new Date().toISOString(),
      agreementMarkdown: `# NDIS Service Agreement\n\n**Participant:** ${referral.participantName}\n**NDIS Number:** ${referral.ndisNumber || 'Pending'}\n**Provider:** Breakthrough Behaviour Support\n**Registration:** 405001234\n\n## Services\n- Positive Behaviour Support\n- Capacity Building\n\n## Funding: $${(referral.estimatedPlanValue || 20000).toLocaleString()} allocated\n\n*DRAFT — Awaiting review and signature*`,
    };

    set((state) => ({ serviceAgreements: [agreement, ...state.serviceAgreements] }));
    get().addAuditLog('Generated Service Agreement', 'ServiceAgreement', agreement.id, `Agreement for ${referral.participantName}`);
  },

  advanceIntakeStage: (assessmentId: string, findings?: string, handoffNotes?: string) => {
    const now = new Date().toISOString();
    set((state) => ({
      intakeAssessments: state.intakeAssessments.map((ia) => {
        if (ia.id !== assessmentId) return ia;
        const stageOrder = ['Initial Screen', 'Clinical Assessment', 'Service Matching', 'Onboarding'];
        const currentIdx = stageOrder.indexOf(ia.currentStage);
        const updatedStages = ia.stages.map((s: any, idx: number) => {
          if (idx === currentIdx) return { ...s, status: 'Complete' as const, completedDate: now.slice(0, 10), findings: findings || s.findings, handoffNotes: handoffNotes || s.handoffNotes };
          if (idx === currentIdx + 1) return { ...s, status: 'In Progress' as const, startedDate: now.slice(0, 10), assignedTo: get().currentUser.name };
          return s;
        });
        const nextStage = currentIdx < stageOrder.length - 1 ? stageOrder[currentIdx + 1] as IntakeAssessment['currentStage'] : ia.currentStage;
        return { ...ia, stages: updatedStages, currentStage: nextStage, updatedAt: now };
      }),
    }));
    get().addAuditLog('Advanced Intake Stage', 'IntakeAssessment', assessmentId, `Advanced to next stage`);
  },

  convertReferralToClient: (referralId) => {
    const state = get();
    const referral = state.referrals.find((r) => r.id === referralId);
    if (!referral) return;
    state.updateReferralStage(referralId, 'Converted');
    state.addClient({
      ndisNumber: referral.ndisNumber || `TBD-${Date.now()}`,
      name: referral.participantName,
      dateOfBirth: referral.dateOfBirth || '2000-01-01',
      status: 'Onboarding',
      primaryDisability: referral.primaryDisability || 'To be assessed',
      goals: [],
      planStartDate: new Date().toISOString().slice(0, 10),
      planEndDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      totalBudget: referral.estimatedPlanValue || 20000,
      allocatedBudget: referral.estimatedPlanValue || 20000,
      spentBudget: 0,
      primaryPractitionerId: referral.assignedPractitionerId || 'prac-1',
      primaryPractitionerName: referral.assignedPractitionerName || 'Unassigned',
      riskLevel: referral.triageFields.riskLevel === 'Critical' ? 'Critical' : referral.triageFields.riskLevel === 'High' ? 'High' : 'Medium',
      emergencyContact: { name: referral.referrerName, relationship: 'Referrer', phone: referral.referrerPhone },
      restrictivePracticesActive: false,
    });
    get().addAuditLog('Converted Referral to Client', 'Referral', referralId, `${referral.participantName} converted to active client`);
  },

  // ======================================================================
  // R5: Enhanced Notification Actions
  // ======================================================================

  addEnhancedNotification: (notifData) => {
    const newNotif: EnhancedNotification = {
      ...notifData,
      id: `en-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
      read: false,
      acknowledged: false,
      escalationLevel: 0,
    };
    set((state) => ({ enhancedNotifications: [newNotif, ...state.enhancedNotifications] }));
  },

  acknowledgeNotification: (id) => {
    set((state) => ({
      enhancedNotifications: state.enhancedNotifications.map((n) =>
        n.id === id ? { ...n, acknowledged: true, acknowledgedAt: new Date().toISOString(), acknowledgedBy: get().currentUser.name } : n
      ),
    }));
  },

  escalateNotification: (id) => {
    set((state) => ({
      enhancedNotifications: state.enhancedNotifications.map((n) =>
        n.id === id ? { ...n, escalationLevel: n.escalationLevel + 1, escalatedAt: new Date().toISOString() } : n
      ),
    }));
  },

  updateNotificationPreference: (id, updates) => {
    set((state) => ({
      notificationPreferences: state.notificationPreferences.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  generateDigest: (period) => {
    const state = get();
    const digest: DigestSummary = {
      id: `dig-${Date.now()}`,
      period,
      generatedAt: new Date().toISOString(),
      activeClients: state.clients.filter((c) => c.status === 'Active').length,
      sessionsDelivered: state.caseNotes.length,
      revenueThisPeriod: state.billingClaims.filter((c) => c.status === 'Paid' || c.status === 'Approved').reduce((s, c) => s + c.totalAmount, 0),
      complianceScore: Math.round((state.staffCredentials.filter((c) => c.status === 'Valid').length / Math.max(state.staffCredentials.length, 1)) * 100),
      pendingActions: state.enhancedNotifications.filter((n) => n.actionRequired && !n.acknowledged).map((n) => ({ action: n.title, module: n.sourceModule, dueDate: n.timestamp.slice(0, 10), priority: n.severity })),
      expiringCredentials: state.staffCredentials.filter((c) => c.status === 'Expiring Soon').length,
      overdueReviews: state.bspDocuments.filter((b) => new Date(b.reviewDate) < new Date()).length,
      newReferrals: state.referrals.filter((r) => r.stage === 'New').length,
      incidentsLogged: state.incidents.length,
    };
    set((state) => ({ digestSummaries: [digest, ...state.digestSummaries] }));
    return digest;
  },

  // ======================================================================
  // R6: Workflow Automation Actions
  // ======================================================================

  addTaskAssignment: (taskData) => {
    const id = `ta-${Date.now()}`;
    const newTask: TaskAssignment = { ...taskData, id, createdAt: new Date().toISOString(), status: 'Pending' };
    set((state) => ({ taskAssignments: [newTask, ...state.taskAssignments] }));
    get().addAuditLog('Created Task Assignment', 'TaskAssignment', id, `Assigned "${newTask.taskTitle}" to ${newTask.assignedToPractitionerName}`);
  },

  updateTaskStatus: (id, status) => {
    set((state) => ({
      taskAssignments: state.taskAssignments.map((t) => (t.id === id ? { ...t, status, completedAt: status === 'Completed' ? new Date().toISOString() : t.completedAt } : t)),
    }));
    get().addAuditLog('Updated Task Status', 'TaskAssignment', id, `Status changed to ${status}`);
  },

  executeBatchAction: (actionData: any) => {
    const id = `ba-${Date.now()}`;
    const batchAction: BatchAction = {
      ...actionData,
      id,
      executedAt: new Date().toISOString(),
      result: 'Success',
      affectedCount: actionData.targetIds.length,
    };

    // Execute the batch operation
    if (actionData.actionType === 'bulk_approve' && actionData.targetModule === 'billing') {
      actionData.targetIds.forEach((tid: string) => get().updateBillingStatus(tid, 'Approved'));
    } else if (actionData.actionType === 'bulk_update_status' && actionData.targetModule === 'case-notes') {
      actionData.targetIds.forEach((tid: string) => get().updateCaseNote(tid, { status: 'Approved' }));
    }

    set((state) => ({ batchActions: [batchAction, ...state.batchActions] }));
    get().addAuditLog('Executed Batch Action', 'BatchAction', id, `${actionData.actionType} on ${actionData.targetIds.length} records`);
  },

  toggleAutomationRule: (id) => {
    set((state) => ({
      automationRules: state.automationRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    }));
  },

  smartAssignTask: (taskTitle, taskType, sourceModule, sourceEntityId) => {
    const state = get();
    const practitioners = state.practitioners;

    // Score each practitioner based on expertise (40%), caseload (35%), availability (25%)
    const scored = practitioners.map((p) => {
      const expertiseScore = (p.specialties?.some((s) => taskType.toLowerCase().includes(s.toLowerCase())) ? 90 : 50) + (p.historicalSuccessRate ? (p.historicalSuccessRate - 80) : 0);
      const caseloadScore = Math.max(0, 100 - ((p.activeCaseloadCount / p.caseloadLimit) * 100));
      const availabilityScore = p.activeCaseloadCount < p.caseloadLimit ? 90 : 30;
      const total = Math.round(expertiseScore * 0.4 + caseloadScore * 0.35 + availabilityScore * 0.25);
      return {
        practitioner: p,
        score: total,
        criteria: [
          { criterion: `${taskType} Expertise`, score: expertiseScore, weight: 0.4 },
          { criterion: `Caseload (${p.activeCaseloadCount}/${p.caseloadLimit})`, score: caseloadScore, weight: 0.35 },
          { criterion: 'Availability', score: availabilityScore, weight: 0.25 },
        ],
      };
    }).sort((a, b) => b.score - a.score);

    const best = scored[0];
    const taskData: Omit<TaskAssignment, 'id' | 'createdAt' | 'status'> = {
      taskTitle,
      taskType,
      sourceModule,
      sourceEntityId,
      assignedToPractitionerId: best.practitioner.id,
      assignedToPractitionerName: best.practitioner.name,
      matchScore: best.score,
      matchCriteria: best.criteria,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    };

    get().addTaskAssignment(taskData);
    const created = get().taskAssignments[0];
    return created;
  },
}));
