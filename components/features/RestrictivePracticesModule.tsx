'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { RestrictivePractice, Client, RestrictivePracticeUsageLog } from '@/types';
import {
  Lock,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Calendar,
  X,
  Download,
  Clock,
  UserCheck,
  FileSpreadsheet,
  CheckCircle2,
  TrendingDown,
  Info,
  Check,
  Filter,
  History
} from 'lucide-react';

export const RestrictivePracticesModule: React.FC = () => {
  const {
    restrictivePractices,
    restrictivePracticeUsageLogs,
    monthlyReturnRecords,
    clients,
    currentUser,
    addRestrictivePractice,
    addRestrictivePracticeUsage,
  } = useManagementStore();

  const [activeTab, setActiveTab] = useState<'authorizations' | 'usage-logs' | 'monthly-returns'>('authorizations');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');

  // Modals
  const [isAddingPractice, setIsAddingPractice] = useState(false);
  const [isLoggingUsage, setIsLoggingUsage] = useState(false);

  // New Authorization Form State
  const [authClient, setAuthClient] = useState(clients[0]?.id || 'cli-101');
  const [practiceType, setPracticeType] = useState<RestrictivePractice['practiceType']>('Environmental');
  const [description, setDescription] = useState('');
  const [authBody, setAuthBody] = useState('VIC Senior Practitioner');
  const [refNum, setRefNum] = useState('');
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [reductionPlan, setReductionPlan] = useState('');

  // New Usage Log Form State
  const [usagePracticeId, setUsagePracticeId] = useState(restrictivePractices[0]?.id || 'rp-1');
  const [usageDuration, setUsageDuration] = useState(60);
  const [usageAntecedent, setUsageAntecedent] = useState('');
  const [usageDeescalation, setUsageDeescalation] = useState('');
  const [usageStaff, setUsageStaff] = useState(currentUser.name);
  const [usageDebrief, setUsageDebrief] = useState(true);
  const [usageNotes, setUsageNotes] = useState('');

  // Filtered lists
  const filteredPractices =
    selectedClientId === 'ALL'
      ? restrictivePractices
      : restrictivePractices.filter((p) => p.clientId === selectedClientId);

  const filteredUsageLogs =
    selectedClientId === 'ALL'
      ? restrictivePracticeUsageLogs
      : restrictivePracticeUsageLogs.filter((u) => u.clientId === selectedClientId);

  const filteredMonthlyReturns =
    selectedClientId === 'ALL'
      ? monthlyReturnRecords
      : monthlyReturnRecords.filter((m) => m.participantId === selectedClientId);

  // Calculate Expiry Days Remaining
  const getDaysRemaining = (expiryDateStr: string) => {
    const diff = new Date(expiryDateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  // Submit New Authorization
  const handleAddPractice = (e: React.FormEvent) => {
    e.preventDefault();
    const clientObj = clients.find((c) => c.id === authClient);
    if (!clientObj) return;

    addRestrictivePractice({
      clientId: clientObj.id,
      clientName: clientObj.name,
      practiceType: practiceType,
      description: description || 'Authorised environmental barrier.',
      status: 'Authorized',
      authorizationBody: authBody,
      authorizationReference:
        refNum || `RPR-2026-VIC-${Math.floor(Math.random() * 90000 + 10000)}`,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiryDate,
      reductionPlanSummary:
        reductionPlan || 'Fading plan monitored by lead practitioner.',
      monthlyReportStatus: 'Submitted',
    });

    setIsAddingPractice(false);
    setDescription('');
    setRefNum('');
    setReductionPlan('');
  };

  // Submit Usage Routine Log
  const handleLogUsage = (e: React.FormEvent) => {
    e.preventDefault();
    const practice = restrictivePractices.find((p) => p.id === usagePracticeId);
    if (!practice) return;

    addRestrictivePracticeUsage({
      practiceId: practice.id,
      clientId: practice.clientId,
      clientName: practice.clientName,
      practiceType: practice.practiceType,
      timestamp: new Date().toISOString(),
      durationMinutes: Number(usageDuration),
      antecedentTrigger:
        usageAntecedent || 'Elevated high-arousal sensory distress requiring safety boundary.',
      priorDeescalationTried:
        usageDeescalation || 'Visual calming cues and quiet corner redirect attempted.',
      staffPresent: usageStaff ? usageStaff.split(',').map((s) => s.trim()) : [currentUser.name],
      authorizedBy: practice.authorizationBody,
      debriefCompleted: usageDebrief,
      notes: usageNotes || 'Maintained as per Authorized BSP Protocol.',
      reportedToCommission: true,
    });

    setIsLoggingUsage(false);
    setUsageAntecedent('');
    setUsageDeescalation('');
    setUsageNotes('');
  };

  // Generate and Download Official NDIS Monthly Return CSV
  const handleDownloadMonthlyReturnCsv = () => {
    const headers = [
      'NDIS_Participant_Name',
      'NDIS_Number',
      'Reporting_Month',
      'Practice_Type',
      'Authorization_Reference',
      'Total_Usage_Count',
      'Total_Duration_Minutes',
      'Reduction_Progress_Summary',
      'Submission_Status',
    ];

    const rows = filteredMonthlyReturns.map((record) => [
      `"${record.participantName}"`,
      `"${record.ndisNumber}"`,
      `"${record.month}"`,
      `"${record.practiceType}"`,
      `"${record.authorizationReference}"`,
      record.totalUsageInstances,
      record.totalDurationMinutes,
      `"${record.reductionProgressNote.replace(/"/g, '""')}"`,
      `"${record.submissionStatus}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NDIS_Restrictive_Practices_Monthly_Return_${new Date().toISOString().slice(0, 7)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-rose-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Regulated Restrictive Practices Register & Governance
              </h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
                State Senior Practitioner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Track state authorizations, record routine usage implementations, monitor elimination & fading schedules, and submit mandatory NDIS Commission monthly returns.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setIsLoggingUsage(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 transition-all shadow-sm active:scale-95"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Log Practice Implementation</span>
          </button>

          <button
            onClick={() => setIsAddingPractice(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Authorization</span>
          </button>
        </div>
      </div>

      {/* Tabs & Client Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('authorizations')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'authorizations'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Authorizations ({filteredPractices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('usage-logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'usage-logs'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Implementation Ledger ({filteredUsageLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly-returns')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'monthly-returns'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>NDIS Monthly Returns ({filteredMonthlyReturns.length})</span>
          </button>
        </div>

        {/* Participant Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Filter Participant:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-bold text-xs"
          >
            <option value="ALL">All Participants</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: Active Authorizations Grid */}
      {activeTab === 'authorizations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPractices.length === 0 ? (
            <div className="col-span-2 py-12 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              No restrictive practice authorizations registered for the selected participant. Click &quot;Register New Authorization&quot; to add one.
            </div>
          ) : filteredPractices.map((practice: RestrictivePractice) => {
            const daysRemaining = getDaysRemaining(practice.expiryDate);
            const clientObj = clients.find((c) => c.id === practice.clientId);

            return (
              <div
                key={practice.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded font-bold border border-amber-500/20 uppercase tracking-wider">
                      {practice.practiceType} Restrictive Practice
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{practice.clientName}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      NDIS #: {clientObj?.ndisNumber || '430891204'}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 block">
                      {practice.status}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold block ${
                        daysRemaining < 60 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {practice.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Authorisation Body</span>
                    <span className="text-slate-200 font-semibold">{practice.authorizationBody}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Reference #</span>
                    <span className="text-teal-400 font-bold">{practice.authorizationReference}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-950/20 rounded-lg border border-amber-500/20 text-[11px] text-amber-200">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase mb-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>Fading & Reduction Protocol</span>
                  </div>
                  <p>{practice.reductionPlanSummary}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-400">
                    Valid To: <span className="text-white font-mono">{practice.expiryDate}</span>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    Monthly Return: {practice.monthlyReportStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Implementation Ledger */}
      {activeTab === 'usage-logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Routine Implementation & Usage Ledger</h3>
              <p className="text-xs text-slate-400">Individual logs of authorised restrictive practice implementations.</p>
            </div>
            <button
              onClick={() => setIsLoggingUsage(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Usage</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Participant</th>
                  <th className="p-3">Practice Type</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Trigger / Antecedent</th>
                  <th className="p-3">De-escalation Tried</th>
                  <th className="p-3">Staff / Debrief</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredUsageLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{log.clientName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded font-mono text-[10px] font-bold border border-amber-500/20">
                        {log.practiceType}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{log.timestamp.slice(0, 16).replace('T', ' ')}</td>
                    <td className="p-3 font-mono text-teal-300 font-bold">{log.durationMinutes} mins</td>
                    <td className="p-3 max-w-xs truncate text-[11px]" title={log.antecedentTrigger}>
                      {log.antecedentTrigger}
                    </td>
                    <td className="p-3 max-w-xs truncate text-[11px] text-teal-200" title={log.priorDeescalationTried}>
                      {log.priorDeescalationTried}
                    </td>
                    <td className="p-3 text-[11px]">
                      <div>{log.staffPresent.join(', ')}</div>
                      {log.debriefCompleted && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <Check className="w-3 h-3" /> Debrief Logged
                        </div>
                      )}
                      {!log.debriefCompleted && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                          <AlertTriangle className="w-3 h-3" /> Debrief Pending
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: NDIS Commission Monthly Returns */}
      {activeTab === 'monthly-returns' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md space-y-4">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                NDIS Quality & Safeguards Commission Monthly Returns
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-formatted submission bundle for the NDIS Commission portal and State Senior Practitioners.
              </p>
            </div>

            <button
              onClick={handleDownloadMonthlyReturnCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Monthly Return CSV</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Reporting Month</th>
                  <th className="p-3">Participant</th>
                  <th className="p-3">Practice & Reference #</th>
                  <th className="p-3">Total Uses</th>
                  <th className="p-3">Total Minutes</th>
                  <th className="p-3">Fading & Elimination Progress</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredMonthlyReturns.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-teal-300">{record.month}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{record.participantName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NDIS: {record.ndisNumber}</div>
                    </td>
                    <td className="p-3">
                      <div>{record.practiceType}</div>
                      <div className="text-[10px] text-teal-400 font-mono font-bold">{record.authorizationReference}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-400">{record.totalUsageInstances} instances</td>
                    <td className="p-3 font-mono text-slate-300">{record.totalDurationMinutes} mins</td>
                    <td className="p-3 text-[11px] max-w-sm">{record.reductionProgressNote}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          record.submissionStatus === 'Submitted'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        }`}
                      >
                        {record.submissionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Register New Restrictive Practice */}
      {isAddingPractice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Register Regulated Restrictive Practice
              </h3>
              <button onClick={() => setIsAddingPractice(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPractice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Participant</label>
                  <select
                    value={authClient}
                    onChange={(e) => setAuthClient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                  >
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.ndisNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Practice Category</label>
                  <select
                    value={practiceType}
                    onChange={(e) => setPracticeType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-400 font-bold"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Physical">Physical</option>
                    <option value="Seclusion">Seclusion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Authorisation Body</label>
                  <input
                    type="text"
                    value={authBody}
                    onChange={(e) => setAuthBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Reference Number</label>
                  <input
                    type="text"
                    value={refNum}
                    onChange={(e) => setRefNum(e.target.value)}
                    placeholder="e.g. RPR-2026-VIC-9912"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Practice Description & Clinical Purpose</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe exact physical barrier, chemical agent, or mechanical apparatus..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-amber-400">
                  Fading & Reduction Milestone Schedule
                </label>
                <textarea
                  rows={2}
                  value={reductionPlan}
                  onChange={(e) => setReductionPlan(e.target.value)}
                  placeholder="e.g. Introduce supervised trials to fade usage by 50% in 6 months..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingPractice(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md"
                >
                  Register Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log Practice Implementation Event */}
      {isLoggingUsage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                Log Restrictive Practice Implementation Event
              </h3>
              <button onClick={() => setIsLoggingUsage(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogUsage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Authorised Practice</label>
                <select
                  value={usagePracticeId}
                  onChange={(e) => setUsagePracticeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                >
                  {restrictivePractices.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientName} — {p.practiceType} ({p.authorizationReference})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Duration (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={720}
                  value={usageDuration}
                  onChange={(e) => setUsageDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-rose-400">
                  Antecedent / Immediate Safety Risk Prompting Usage
                </label>
                <textarea
                  rows={2}
                  required
                  value={usageAntecedent}
                  onChange={(e) => setUsageAntecedent(e.target.value)}
                  placeholder="e.g. Acute ingestion risk during group cooking prep..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-teal-400">
                  Prior De-escalation & Least Restrictive Interventions Attempted
                </label>
                <textarea
                  rows={2}
                  required
                  value={usageDeescalation}
                  onChange={(e) => setUsageDeescalation(e.target.value)}
                  placeholder="e.g. Visual redirect, sensory break, 1-on-1 staff support..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Staff Present (Comma separated)</label>
                <input
                  type="text"
                  value={usageStaff}
                  onChange={(e) => setUsageStaff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="debriefCheck"
                  checked={usageDebrief}
                  onChange={(e) => setUsageDebrief(e.target.checked)}
                  className="w-4 h-4 accent-teal-500 rounded"
                />
                <label htmlFor="debriefCheck" className="text-slate-300 font-semibold cursor-pointer">
                  Post-implementation staff debrief and welfare check completed
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLoggingUsage(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Implementation Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
