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
  PRODABatch
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
  INITIAL_COPILOT_MESSAGES
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
  | 'google-maps';

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
  isAICopilotOpen: boolean;
  selectedCopilotClientId: string;
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  activeTab: TabType;
  isFirestoreSynced: boolean;
  isLoading: boolean;

  setActiveTab: (tab: TabType) => void;
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

  // Actions
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
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;
  addCommunication: (comm: Omit<CommunicationLog, 'id' | 'timestamp'>) => void;
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
  isAICopilotOpen: false,
  selectedCopilotClientId: INITIAL_CLIENTS[0]?.id || 'cli-101',
  theme: 'dark',
  isCommandPaletteOpen: false,
  activeTab: 'command-center',
  isFirestoreSynced: false,
  isLoading: false,

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),

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
}));

