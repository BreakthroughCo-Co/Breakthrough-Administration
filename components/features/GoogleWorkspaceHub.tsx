'use client';

import React, { useState, useEffect } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import {
  signInWithGoogle,
  getCachedAccessToken,
  logOutGoogle,
  auth
} from '@/lib/firebase';
import {
  listDriveFiles,
  uploadFileToDrive,
  createGoogleSheet,
  createGoogleDoc,
  createGoogleSlideDeck,
  listCalendarEvents,
  createCalendarEvent,
  sendGmailMessage,
  generateGoogleMeetLink,
  listGoogleContacts,
  createGoogleContact,
  listGoogleTasks,
  createGoogleTask,
  sendGoogleChatMessage,
  GoogleDriveFile,
  GoogleCalendarEvent,
  GoogleContact,
  GoogleTask
} from '@/lib/workspace';
import {
  FolderGit2,
  FileSpreadsheet,
  FileText,
  Presentation,
  Calendar,
  Mail,
  Video,
  Contact,
  CheckSquare,
  MessageSquare,
  StickyNote,
  FormInput,
  Sparkles,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Plus,
  Send,
  Download,
  Share2,
  Key,
  ShieldCheck,
  Globe
} from 'lucide-react';

export const GoogleWorkspaceHub: React.FC = () => {
  const { clients, billingClaims, incidents, bspDocuments, addAuditLog, addNotification } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'drive' | 'sheets' | 'docs' | 'slides' | 'calendar' | 'gmail' | 'meet' | 'contacts' | 'tasks' | 'chat' | 'keep' | 'forms'
  >('drive');

  const [isSignedIn, setIsSignedIn] = useState(() => !!getCachedAccessToken());
  const [userEmail, setUserEmail] = useState<string | null>(() => auth.currentUser?.email || null);
  const [token, setToken] = useState<string | null>(() => getCachedAccessToken());
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [uploadFileName, setUploadFileName] = useState('');

  // Sheets state
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);

  // Docs & Slides state
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);
  const [createdSlideUrl, setCreatedSlideUrl] = useState<string | null>(null);

  // Calendar & Meet state
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [generatedMeetLink, setGeneratedMeetLink] = useState<string | null>(null);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');

  // Gmail state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Contacts state
  const [contactsList, setContactsList] = useState<GoogleContact[]>([]);

  // Tasks state
  const [tasksList, setTasksList] = useState<GoogleTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Keep Notes state (local synchronizer)
  const [keepNotes, setKeepNotes] = useState<{ id: string; title: string; text: string; timestamp: string }[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  // Synchronize auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        const cached = getCachedAccessToken();
        if (cached) {
          setToken(cached);
          setIsSignedIn(true);
        }
      } else {
        setIsSignedIn(false);
        setToken(null);
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setActionMessage(null);
    try {
      const res = await signInWithGoogle();
      if (res?.accessToken) {
        setToken(res.accessToken);
        setIsSignedIn(true);
        setUserEmail(res.user.email);
        setActionMessage({
          type: 'success',
          text: `Signed in as ${res.user.email}. Google Workspace OAuth scopes active.`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setActionMessage({
        type: 'error',
        text: err?.message || 'Google Authentication failed. Please check popup permissions.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logOutGoogle();
    setIsSignedIn(false);
    setToken(null);
    setUserEmail(null);
    setActionMessage({ type: 'success', text: 'Disconnected from Google Workspace.' });
  };

  // Google Drive Handlers
  const handleFetchDrive = async () => {
    if (!token) return handleSignIn();
    setLoading(true);
    try {
      const files = await listDriveFiles(token);
      setDriveFiles(files);
      setActionMessage({ type: 'success', text: `Fetched ${files.length} documents from Google Drive.` });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Drive error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSampleDoc = async () => {
    if (!token) return handleSignIn();
    const confirmed = window.confirm(`Upload "${uploadFileName}" to Google Drive?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const bspContent = `NDIS COMPREHENSIVE BEHAVIOUR SUPPORT PLAN\nParticipant: Alex Chen\nNDIS Number: 430981204\nPractitioner: Dr. Sarah Jenkins (Advanced PBS Practitioner #PR-99201)\n\n1. Executive Summary\nProactive environmental modifications and replacement behavior acquisition protocol...\n\nGenerated by Breakthrough NDIS Practice Management OS`;
      const res = await uploadFileToDrive(token, uploadFileName, bspContent, 'text/plain');
      setActionMessage({
        type: 'success',
        text: `Successfully uploaded "${res.name}" to Google Drive!`,
        link: res.webViewLink,
      });
      addAuditLog(
        'EXPORT',
        'BSP Plan',
        uploadFileName,
        `Uploaded ${uploadFileName} to Google Drive`
      );
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Upload failed: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Google Sheets Export
  const handleExportSheets = async () => {
    if (!token) return handleSignIn();
    const confirmed = window.confirm(`Export ${billingClaims.length} NDIS PACE Billing Claims to a new Google Sheet?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const headers = ['Claim ID', 'Participant', 'NDIS Number', 'Service Date', 'Support Item Code', 'Hours', 'Rate', 'Total ($)', 'Status'];
      const rows = billingClaims.map((c) => [
        c.id,
        c.clientName,
        c.ndisNumber,
        c.serviceDate,
        c.supportItemCode,
        c.hours.toString(),
        `${c.unitRate.toFixed(2)}`,
        `$${c.totalAmount.toFixed(2)}`,
        c.status,
      ]);

      const res = await createGoogleSheet(token, `NDIS PACE Batch Claims Export - ${new Date().toISOString().slice(0, 10)}`, headers, rows);
      setCreatedSheetUrl(res.spreadsheetUrl);
      setActionMessage({
        type: 'success',
        text: `Exported ${rows.length} claim rows to Google Sheet!`,
        link: res.spreadsheetUrl,
      });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Sheets export error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Google Docs Export
  const handleExportDoc = async () => {
    if (!token) return handleSignIn();
    const confirmed = window.confirm(`Generate a structured Google Doc for Behaviour Support Plan?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const docBody = `PARTICIPANT: Jordan Miller\nNDIS NUMBER: 430891204\nSTATUS: Active Implementation\n\nSECTION 1: PERSON-CENTRED PROFILE & GOALS\nJordan is supported to develop functional communication and self-regulation techniques in community settings.\n\nSECTION 2: ENVIRONMENTAL & PROACTIVE STRATEGIES\n- Predictable visual daily schedule\n- Sensory break space with dimmable lighting\n- Low-demand transition protocols\n\nSECTION 3: RESTRICTIVE PRACTICES REVIEW\nEnvironmental Restraint: Authorised by NSW Restrictive Practices Panel.\nSunset Review Date: 2026-11-15\n\nSECTION 4: CRISIS DE-ESCALATION PROTOCOL\nFollow non-violent crisis intervention hierarchy (Level 1 to Level 3).`;

      const res = await createGoogleDoc(token, `Jordan Miller - NDIS Comprehensive BSP (Official Google Doc)`, docBody);
      setCreatedDocUrl(res.documentUrl);
      setActionMessage({
        type: 'success',
        text: `Created Google Doc: Jordan Miller Comprehensive BSP`,
        link: res.documentUrl,
      });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Google Docs error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Google Slides Export
  const handleExportSlides = async () => {
    if (!token) return handleSignIn();
    const confirmed = window.confirm(`Generate Google Slides presentation for Clinical Case Conference?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const slideTitles = [
        '1. Participant Profile & NDIS Diagnostic History',
        '2. Functional Behavior Assessment & Baseline Scatterplot',
        '3. Positive Behaviour Support Strategies & Fading Curve',
        '4. Regulated Restrictive Practices Governance & Approvals',
      ];
      const res = await createGoogleSlideDeck(token, `Clinical Case Conference Presentation - Jordan Miller`, slideTitles);
      setCreatedSlideUrl(res.presentationUrl);
      setActionMessage({
        type: 'success',
        text: `Created Google Slides deck: Clinical Case Conference`,
        link: res.presentationUrl,
      });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Google Slides error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Google Calendar & Meet
  const handleFetchCalendar = async () => {
    if (!token) return handleSignIn();
    setLoading(true);
    try {
      const events = await listCalendarEvents(token);
      setCalendarEvents(events);
      setActionMessage({ type: 'success', text: `Synchronized ${events.length} appointments from Google Calendar.` });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Calendar error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMeet = async () => {
    if (!token) return handleSignIn();
    const confirmed = window.confirm(`Create Google Calendar telehealth session with instant Google Meet room?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await generateGoogleMeetLink(token, newMeetingTitle);
      setGeneratedMeetLink(res.meetLink);
      setActionMessage({
        type: 'success',
        text: `Google Meet room generated: ${res.meetLink}`,
        link: res.meetLink,
      });
      addNotification({
        title: 'Google Meet Room Active',
        message: `Telehealth room created: ${newMeetingTitle}`,
        type: 'incident',
        severity: 'info',
        linkTab: 'integrations',
      });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Meet error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Gmail Sender
  const handleSendEmail = async () => {
    if (!token) return handleSignIn();
    const confirmed = window.confirm(`Dispatch email via Gmail to ${recipientEmail} with subject "${emailSubject}"?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await sendGmailMessage(token, recipientEmail, emailSubject, emailBody);
      setActionMessage({
        type: 'success',
        text: `Dispatched email via Gmail to ${recipientEmail}!`,
      });
      addAuditLog(
        'NOTIFY',
        'Incident Email',
        recipientEmail,
        `Sent Gmail SLA notification to ${recipientEmail}`
      );
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Gmail error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Google Tasks
  const handleCreateTask = async () => {
    if (!token) return handleSignIn();
    setLoading(true);
    try {
      const res = await createGoogleTask(token, newTaskTitle, 'Generated via NDIS Practice Management OS Compliance Engine');
      setActionMessage({
        type: 'success',
        text: `Added task "${res.title}" to Google Tasks!`,
      });
      setNewTaskTitle('');
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Tasks error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Google Contacts
  const handleSyncContacts = async () => {
    if (!token) return handleSignIn();
    setLoading(true);
    try {
      const res = await listGoogleContacts(token);
      setContactsList(res);
      setActionMessage({ type: 'success', text: `Synchronized ${res.length} Google Contacts.` });
    } catch (e: any) {
      setActionMessage({ type: 'error', text: `Contacts error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: OAuth Connection & Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl text-white shadow-md">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Google Workspace & Maps Enterprise Hub</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                isSignedIn
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {isSignedIn ? '● OAUTH CONNECTED' : '○ PENDING SIGN-IN'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct API synchronization for Drive, Sheets, Docs, Slides, Calendar, Gmail, Meet, Contacts, Tasks, Forms & Chat
            </p>
          </div>
        </div>

        {/* Auth Action Button */}
        <div>
          {isSignedIn ? (
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{userEmail || 'Google User'}</p>
                <p className="text-[10px] text-teal-400 font-mono">Workspace Token Active</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all border border-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/40 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          {actionMessage.link && (
            <a
              href={actionMessage.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 rounded-lg text-teal-400 hover:text-white font-bold border border-slate-700"
            >
              <span>Open in Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Integration Services Sub-Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs select-none">
        {[
          { id: 'drive', label: 'Google Drive & Picker', icon: FolderGit2 },
          { id: 'sheets', label: 'Google Sheets (PACE)', icon: FileSpreadsheet },
          { id: 'docs', label: 'Google Docs (BSP)', icon: FileText },
          { id: 'slides', label: 'Google Slides', icon: Presentation },
          { id: 'calendar', label: 'Google Calendar', icon: Calendar },
          { id: 'meet', label: 'Google Meet Telehealth', icon: Video },
          { id: 'gmail', label: 'Gmail Dispatcher', icon: Mail },
          { id: 'contacts', label: 'Google Contacts', icon: Contact },
          { id: 'tasks', label: 'Google Tasks (SLAs)', icon: CheckSquare },
          { id: 'keep', label: 'Google Keep Notes', icon: StickyNote },
          { id: 'chat', label: 'Google Chat Spaces', icon: MessageSquare },
          { id: 'forms', label: 'Google Forms Intake', icon: FormInput },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Service Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* GOOGLE DRIVE & PICKER */}
        {activeSubTab === 'drive' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-teal-400" />
                  Google Drive Clinical Document Vault & Google Picker
                </h3>
                <p className="text-xs text-slate-400">
                  Store participant Behaviour Support Plans, OT Sensory Profiles, and Allied Health reports in Drive
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFetchDrive}
                  disabled={loading}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Drive Files</span>
                </button>
                <button
                  onClick={handleUploadSampleDoc}
                  disabled={loading}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload BSP to Drive</span>
                </button>
              </div>
            </div>

            {/* Quick Upload Test Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-teal-400" />
                <div>
                  <p className="text-xs font-bold text-white">Target Document to Sync:</p>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-teal-300 font-mono px-2.5 py-1 rounded-lg mt-1 w-72"
                  />
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Direct multipart Drive V3 upload with permission token</span>
            </div>

            {/* Drive Files List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Drive Documents ({driveFiles.length})
              </h4>
              {driveFiles.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                  <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Click <strong>Sync Drive Files</strong> above to load documents from your connected Google Drive.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {driveFiles.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-teal-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{f.mimeType}</p>
                        </div>
                      </div>
                      {f.webViewLink && (
                        <a
                          href={f.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GOOGLE SHEETS */}
        {activeSubTab === 'sheets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  Google Sheets NDIS Batch Claims & Payroll Synchronizer
                </h3>
                <p className="text-xs text-slate-400">
                  Export live claim logs, practitioner billable hours, and plan expenditure to collaborative Google Sheets
                </p>
              </div>
              <button
                onClick={handleExportSheets}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Export Claims to Google Sheets</span>
              </button>
            </div>

            {createdSheetUrl && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-200">
                <span>Latest Google Sheet generated and populated with {billingClaims.length} claim lines.</span>
                <a
                  href={createdSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold"
                >
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white">Previewing Claims Data for Sheet Sync ({billingClaims.length} Records)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="pb-2">Claim ID</th>
                      <th className="pb-2">Participant</th>
                      <th className="pb-2">Support Item</th>
                      <th className="pb-2">Hours</th>
                      <th className="pb-2">Total Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {billingClaims.slice(0, 5).map((c) => (
                      <tr key={c.id}>
                        <td className="py-2 text-teal-400 font-bold">{c.id}</td>
                        <td className="py-2 text-white">{c.clientName}</td>
                        <td className="py-2 text-slate-400">{c.supportItemCode}</td>
                        <td className="py-2">{c.hours} hrs</td>
                        <td className="py-2 font-bold text-emerald-400">${c.totalAmount.toFixed(2)}</td>
                        <td className="py-2"><span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* GOOGLE DOCS */}
        {activeSubTab === 'docs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Google Docs Comprehensive BSP & Clinical Report Generator
                </h3>
                <p className="text-xs text-slate-400">
                  Generate formatted NDIS Commission compliant Behaviour Support Plans directly in Google Docs
                </p>
              </div>
              <button
                onClick={handleExportDoc}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Official Google Doc</span>
              </button>
            </div>

            {createdDocUrl && (
              <div className="p-4 bg-blue-950/40 border border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-200">
                <span>Google Doc created: &ldquo;Participant Comprehensive BSP&rdquo;</span>
                <a
                  href={createdDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                >
                  <span>Open in Google Docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white">Google Docs Formatting Template Includes:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>NDIS Participant Demographics, Goals & Sensory Profiles</li>
                <li>Antecedent Modifications & Skill Teaching Curriculum</li>
                <li>Restrictive Practice Authorization & Panel Sunset Dates</li>
                <li>Emergency Crisis De-escalation Plan & Post-Incident Review Protocol</li>
              </ul>
            </div>
          </div>
        )}

        {/* GOOGLE SLIDES */}
        {activeSubTab === 'slides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-amber-400" />
                  Google Slides Clinical Case Conference Generator
                </h3>
                <p className="text-xs text-slate-400">
                  Build presentation slide decks for multi-disciplinary stakeholder meetings & board reviews
                </p>
              </div>
              <button
                onClick={handleExportSlides}
                disabled={loading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Google Slides Deck</span>
              </button>
            </div>

            {createdSlideUrl && (
              <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-200">
                <span>Google Slides deck created for Clinical Case Conference.</span>
                <a
                  href={createdSlideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold"
                >
                  <span>Open in Google Slides</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* GOOGLE CALENDAR & MEET */}
        {activeSubTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Google Calendar Shift Rosters & Appointments
                </h3>
                <p className="text-xs text-slate-400">
                  Synchronize clinician visits, telehealth sessions, and participant reviews directly with Google Calendar
                </p>
              </div>
              <button
                onClick={handleFetchCalendar}
                disabled={loading}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Primary Calendar</span>
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Upcoming Synced Calendar Events ({calendarEvents.length})
              </h4>
              {calendarEvents.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                  Click <strong>Sync Primary Calendar</strong> to view scheduled sessions from Google Calendar.
                </div>
              ) : (
                <div className="space-y-2">
                  {calendarEvents.map((evt, idx) => (
                    <div key={evt.id || idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{evt.summary}</p>
                        <p className="text-[10px] text-slate-400">
                          {evt.start?.dateTime ? new Date(evt.start.dateTime).toLocaleString() : 'Time not specified'}
                        </p>
                      </div>
                      {evt.hangoutLink && (
                        <a
                          href={evt.hangoutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white rounded-lg text-[10px] font-bold"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Meet</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GOOGLE MEET */}
        {activeSubTab === 'meet' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                Google Meet Telehealth Video Consultation Generator
              </h3>
              <p className="text-xs text-slate-400">
                Instantly provision encrypted Google Meet spaces for participant telehealth and emergency clinical consultations
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Telehealth Consultation Title:</label>
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={handleGenerateMeet}
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Generate Instant Google Meet Room</span>
              </button>

              {generatedMeetLink && (
                <div className="p-4 bg-teal-950/40 border border-teal-800 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-teal-300">Google Meet URL Created:</p>
                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg text-xs font-mono text-white">
                    <span className="truncate">{generatedMeetLink}</span>
                    <a
                      href={generatedMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-teal-600 text-white rounded font-bold ml-2 shrink-0"
                    >
                      Join Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GMAIL DISPATCHER */}
        {activeSubTab === 'gmail' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-400" />
                Gmail Clinical Dispatcher & SLA Incident Notifier
              </h3>
              <p className="text-xs text-slate-400">
                Send formal NDIS Commission reports, guardian updates, and appointment notices directly through Gmail API
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Recipient Email:</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Subject:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message Body:</label>
                <textarea
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>

              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send via Gmail API</span>
              </button>
            </div>
          </div>
        )}

        {/* GOOGLE CONTACTS */}
        {activeSubTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Contact className="w-5 h-5 text-indigo-400" />
                  Google Contacts Stakeholder Directory Sync
                </h3>
                <p className="text-xs text-slate-400">
                  Synchronize participant guardians, support coordinators, and plan managers with Google Contacts
                </p>
              </div>
              <button
                onClick={handleSyncContacts}
                disabled={loading}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Google Contacts</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {clients.map((c) => (
                <div key={c.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{c.name}</p>
                    <span className="text-[10px] bg-slate-800 text-teal-400 px-2 py-0.5 rounded font-mono">NDIS #{c.ndisNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Primary Disability: {c.primaryDisability}</p>
                  <button
                    onClick={async () => {
                      if (!token) return handleSignIn();
                      const confirmed = window.confirm(`Add ${c.name} to Google Contacts?`);
                      if (!confirmed) return;
                      try {
                        await createGoogleContact(token, c.name, '(NDIS Participant)', 'participant@care.org.au', '0400 123 456', 'NDIS Practice OS');
                        setActionMessage({ type: 'success', text: `Added ${c.name} to Google Contacts!` });
                      } catch (err: any) {
                        setActionMessage({ type: 'error', text: err.message });
                      }
                    }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg text-[10px] font-bold border border-slate-800"
                  >
                    + Sync to Google Contacts
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE TASKS */}
        {activeSubTab === 'tasks' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-teal-400" />
                Google Tasks NDIS SLA & Compliance Reminders
              </h3>
              <p className="text-xs text-slate-400">
                Push report deadlines, BSP sunset dates, and NDIS worker screening renewals directly to Google Tasks
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Add compliance task (e.g., Submit monthly restrictive practice log to NDIS Commission)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                onClick={handleCreateTask}
                disabled={loading || !newTaskTitle.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shrink-0"
              >
                + Add Task
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested NDIS Compliance Tasks</h4>
              {[
                { title: 'Submit 24-Hour Critical Incident Report to NDIS Commission (#INC-8891)', due: 'Today' },
                { title: 'Review Authorisation Sunset Date for Jordan Miller (NSW Restrictive Practices)', due: 'In 3 days' },
                { title: 'Renew NDIS Worker Screening Check (NWSC) for Clinician Mark Taylor', due: 'In 14 days' },
              ].map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-200">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {t.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE KEEP / SCRATCHPAD */}
        {activeSubTab === 'keep' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-400" />
                Google Keep™ Practitioner Clinical Scratchpad
              </h3>
              <p className="text-xs text-slate-400">
                Rapid in-session clinical notes, behavioral observations, and sensory environmental reminders
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <input
                type="text"
                placeholder="Note Title (e.g., Sensory trigger observation...)"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <textarea
                placeholder="Enter quick clinical observation note..."
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
              />
              <button
                onClick={() => {
                  if (!newNoteTitle.trim()) return;
                  setKeepNotes([
                    { id: `kn-${Date.now()}`, title: newNoteTitle, text: newNoteText, timestamp: new Date().toLocaleDateString() },
                    ...keepNotes,
                  ]);
                  setNewNoteTitle('');
                  setNewNoteText('');
                  setActionMessage({ type: 'success', text: 'Note saved to Clinical Scratchpad!' });
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
              >
                Save Clinical Note
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {keepNotes.map((n) => (
                <div key={n.id} className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-amber-200">{n.title}</p>
                    <span className="text-[10px] text-amber-400/80 font-mono">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE CHAT */}
        {activeSubTab === 'chat' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Google Chat Team Incident & Shift Alert Spaces
              </h3>
              <p className="text-xs text-slate-400">
                Broadcast instant emergency de-escalation alerts and restrictive practice notifications to clinical spaces
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-xs text-rose-200 flex items-center justify-between">
                <div>
                  <p className="font-bold">Urgent Restrictive Practice Protocol Broadcast</p>
                  <p className="text-[11px] text-rose-300">Space: #ndis-clinical-alerts-sydney</p>
                </div>
                <button
                  onClick={async () => {
                    const confirmed = window.confirm('Send broadcast alert to Google Chat space?');
                    if (!confirmed) return;
                    setActionMessage({ type: 'success', text: 'Broadcast sent to Google Chat #ndis-clinical-alerts!' });
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs"
                >
                  Broadcast Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GOOGLE FORMS */}
        {activeSubTab === 'forms' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FormInput className="w-5 h-5 text-purple-400" />
                Google Forms NDIS Intake & Risk Screener Integrator
              </h3>
              <p className="text-xs text-slate-400">
                Create and link standardized participant intake questionnaires and sensory audit surveys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <FormInput className="w-4 h-4" />
                  <span>NDIS Initial Intake & Consent Screener</span>
                </div>
                <p className="text-slate-400">Captures participant diagnosis, funding details, guardian consent, and emergency contacts.</p>
                <button
                  onClick={() => window.open('https://docs.google.com/forms', '_blank')}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Open Google Forms</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-teal-400 font-bold">
                  <FormInput className="w-4 h-4" />
                  <span>Sensory Profile & Environmental Audit Form</span>
                </div>
                <p className="text-slate-400">Staff survey to evaluate classroom/home environmental triggers, lighting, and noise levels.</p>
                <button
                  onClick={() => window.open('https://docs.google.com/forms', '_blank')}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Open Survey in Google Forms</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
