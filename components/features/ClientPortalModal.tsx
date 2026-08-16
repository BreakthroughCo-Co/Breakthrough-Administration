'use client';

import React, { useState, useEffect } from 'react';
import { Client, ClientGoal } from '@/types';
import { useManagementStore } from '@/stores/useManagementStore';
import {
  Share2,
  Lock,
  Eye,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  Shield,
  Copy,
  Mail,
  Smartphone,
  Printer,
  Download,
  X,
  Target,
  FileText,
  Send,
  MessageSquare,
  Sparkles,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Smile,
  Heart,
  Award,
  Zap,
  Clock,
  Check,
  Flame,
  Volume2
} from 'lucide-react';

interface ClientPortalModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ client, isOpen, onClose }) => {
  const { addAuditLog, addNotification, addCaseNote, currentUser } = useManagementStore();

  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'EASY_READ' | 'TELEHEALTH' | 'SETTINGS' | 'FEEDBACK'>('PREVIEW');
  const [copiedLink, setCopiedLink] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientRole, setRecipientRole] = useState<'Family Member' | 'Support Coordinator' | 'Plan Nominee'>('Family Member');
  const [feedbackNotes, setFeedbackNotes] = useState<string[]>([]);
  const [newFeedbackText, setNewFeedbackText] = useState('');

  // Access permissions
  const [permGoals, setPermGoals] = useState(true);
  const [permProgress, setPermProgress] = useState(true);
  const [permBudget, setPermBudget] = useState(true);
  const [permMaskSensitive, setPermMaskSensitive] = useState(true);

  // Telehealth Consultation Room State
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [telehealthNotes, setTelehealthNotes] = useState('');
  const [telehealthSavedToast, setTelehealthSavedToast] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  if (!isOpen || !client) return null;

  const shareToken = `ndis_sec_${client.id.replace('cli-', '')}_${client.ndisNumber.slice(-4)}`;
  const portalUrl = `https://portal.breakthrough.org.au/participant/${client.id}?token=${shareToken}`;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);

    addAuditLog(
      'CLIENT_PORTAL_LINK_COPIED',
      'CLIENT_PORTAL',
      client.id,
      `Generated and copied secure portal access link for ${client.name} (Role: ${recipientRole}).`
    );
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    addNotification({
      title: `Client Portal Invite Sent: ${client.name}`,
      message: `Secure access link sent to ${recipientEmail} (${recipientRole}) with customized permissions.`,
      type: 'client',
      severity: 'info',
      linkTab: 'clients',
    });

    addAuditLog(
      'CLIENT_PORTAL_INVITE_SENT',
      'CLIENT_PORTAL',
      client.id,
      `Sent portal invite to ${recipientEmail} (${recipientRole}) with permissions [Goals: ${permGoals}, Progress: ${permProgress}, Budget: ${permBudget}].`
    );

    setRecipientEmail('');
    alert(`Secure Portal invitation sent to ${recipientEmail}!`);
  };

  const handleSaveTelehealthNote = () => {
    if (!telehealthNotes.trim()) return;

    addCaseNote({
      clientId: client.id,
      clientName: client.name,
      practitionerId: currentUser.practitionerId || 'prac-1',
      practitionerName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      format: 'SOAP',
      sessionDurationMinutes: Math.max(15, Math.ceil(callDurationSeconds / 60)),
      content: `[TELEHEALTH CLINICAL CONSULTATION — ${formatTimer(callDurationSeconds)}]\n\n${telehealthNotes}`,
      billableStatus: 'Pending',
      isSynced: true,
    });

    setTelehealthSavedToast(`Telehealth consultation note logged for ${client.name} (${Math.max(15, Math.ceil(callDurationSeconds / 60))}m).`);
    setTimeout(() => setTelehealthSavedToast(null), 4000);
    setTelehealthNotes('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  NDIS Participant & Stakeholder Ecosystem Portal
                </h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-500/30 font-bold uppercase">
                  Phase 5 Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Participant: <strong className="text-white">{client.name}</strong> • Easy Read accessibility, family progress transparency & telehealth consultation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'PREVIEW'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Family Portal Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('EASY_READ')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'EASY_READ'
                ? 'border-teal-400 text-teal-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smile className="w-4 h-4 text-amber-400" />
            <span>Easy Read Mode (Participant View)</span>
          </button>

          <button
            onClick={() => setActiveTab('TELEHEALTH')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'TELEHEALTH'
                ? 'border-teal-400 text-teal-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4 text-purple-400" />
            <span>Telehealth Video Room</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'SETTINGS'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Access Link & Permissions</span>
          </button>

          <button
            onClick={() => setActiveTab('FEEDBACK')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'FEEDBACK'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Coordinator Notes ({feedbackNotes.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: STANDARD PREVIEW */}
          {activeTab === 'PREVIEW' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 font-black text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{client.name}</h4>
                    <p className="text-xs text-slate-400">
                      NDIS #{permMaskSensitive ? '•••• ' + client.ndisNumber.slice(-4) : client.ndisNumber} • {client.primaryDisability}
                    </p>
                    <p className="text-[11px] text-teal-400 font-mono mt-0.5">
                      Practitioner: <strong>{client.primaryPractitionerName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('EASY_READ')}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition-all text-xs cursor-pointer"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>Switch to Easy Read</span>
                  </button>
                </div>
              </div>

              {/* Goal Tracking Section */}
              {permGoals && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                      <Target className="w-4 h-4 text-teal-400" />
                      NDIS Goal Attainment Scaling (GAS) Tracking
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {client.goals.filter((g) => g.status === 'Achieved').length} of {client.goals.length} Goals Achieved
                    </span>
                  </div>

                  <div className="space-y-2">
                    {client.goals.map((goal: ClientGoal) => (
                      <div key={goal.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs">{goal.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              goal.status === 'Achieved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                            }`}
                          >
                            {goal.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Category: {goal.category}</span>
                            <span className="text-teal-400 font-bold">{goal.progressPercent}% Achieved</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${goal.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACCESSIBLE EASY READ VIEW (WCAG AAA) */}
          {activeTab === 'EASY_READ' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-2xl">
                    👋
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Hello, {client.name}!</h3>
                    <p className="text-sm text-amber-200/90 font-medium">
                      This is your easy Breakthrough plan. Here is how you are doing with your goals!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
                          Goal Activity
                        </span>
                        <h4 className="text-base font-bold text-white leading-snug">{goal.title}</h4>
                      </div>
                      <span className="text-2xl">🌟</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>How Close You Are:</span>
                        <span className="text-teal-300 text-sm">{goal.progressPercent}% DONE</span>
                      </div>
                      <div className="h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full"
                          style={{ width: `${goal.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Your support worker is helping you achieve this goal!</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TELEHEALTH VIDEO CONSULTATION STUDIO */}
          {activeTab === 'TELEHEALTH' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Video Call Stage */}
                <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between space-y-4 min-h-[380px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white text-xs">
                        Breakthrough Encrypted Telehealth Stream (WebRTC End-to-End)
                      </span>
                    </div>
                    {isCallActive && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold">
                        REC {formatTimer(callDurationSeconds)}
                      </span>
                    )}
                  </div>

                  {/* Video Tile Simulation */}
                  <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative flex items-center justify-center min-h-[220px] overflow-hidden">
                    {isVideoOff ? (
                      <div className="text-center space-y-2">
                        <VideoOff className="w-10 h-10 text-slate-600 mx-auto" />
                        <span className="text-xs text-slate-500 font-bold block">Camera Paused</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg">
                          {client.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-white block">{client.name} (Participant)</span>
                        <span className="text-[11px] text-teal-400 font-mono">
                          Connected via Client Portal Secure Room
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 w-28 h-20 bg-slate-950 rounded-lg border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 shadow-md">
                      <span>Practitioner (You)</span>
                    </div>
                  </div>

                  {/* Call Controls Bar */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-xl border transition-all ${
                        isMuted
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-3 rounded-xl border transition-all ${
                        isVideoOff
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    >
                      {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCallActive(!isCallActive)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                        isCallActive
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      <span>{isCallActive ? 'End Consultation' : 'Start Live Telehealth Session'}</span>
                    </button>
                  </div>
                </div>

                {/* In-Call Case Note Scratchpad */}
                <div className="lg:col-span-4 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1 border-b border-slate-850 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-400" />
                      In-Call Clinical Scratchpad
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Record clinical observations in real-time during the video call.
                    </p>
                  </div>

                  <textarea
                    rows={8}
                    value={telehealthNotes}
                    onChange={(e) => setTelehealthNotes(e.target.value)}
                    placeholder="Participant demonstrated good engagement during today's telehealth session. Practiced calm breathing and visual schedule review..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-mono focus:border-teal-500 focus:outline-none flex-1"
                  />

                  {telehealthSavedToast && (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{telehealthSavedToast}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveTelehealthNote}
                    disabled={!telehealthNotes.trim()}
                    className="w-full py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Log as Signed Case Note</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & PERMISSIONS */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-4 max-w-xl">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-white text-xs block">Permanent Secure Link</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={portalUrl}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs flex-1"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FEEDBACK NOTES */}
          {activeTab === 'FEEDBACK' && (
            <div className="space-y-4 max-w-xl">
              <form onSubmit={handleSendInvite} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="coordinator@ndis-provider.com.au"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Portal Invite</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>NDIS Commission Privacy Act 1988 & Consent Safeguards Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
