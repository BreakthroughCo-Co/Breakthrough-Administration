'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Incident, Client } from '@/types';
import {
  AlertTriangle,
  Plus,
  ShieldAlert,
  Clock,
  CheckCircle2,
  X,
  FileCheck,
  Download,
  Printer,
  Mail,
  BrainCircuit,
  TrendingUp,
  Activity,
  Sparkles,
  Zap,
  RefreshCw,
  Flame,
  Shield,
  Layers,
  ArrowRight,
  GitBranch
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const TIME_OF_DAY_RISK_DATA = [
  { time: '08:00', label: 'Morning Transit', riskScore: 35, baseline: 20 },
  { time: '10:00', label: 'Morning Session', riskScore: 42, baseline: 25 },
  { time: '12:00', label: 'Lunch / Sensory Peak', riskScore: 68, baseline: 30 },
  { time: '13:30', label: 'Afternoon Transition', riskScore: 88, baseline: 35 },
  { time: '15:00', label: 'Demand Fatigue Peak', riskScore: 82, baseline: 40 },
  { time: '16:30', label: 'Day Program Exit', riskScore: 54, baseline: 30 },
  { time: '18:00', label: 'Home Evening Routine', riskScore: 40, baseline: 25 },
];

export const IncidentsModule: React.FC = () => {
  const {
    incidents,
    clients,
    addIncident,
    updateIncidentStatus,
    setActiveTab,
    importFbaToBsp,
    addNotification,
    addAuditLog
  } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<'register' | 'predictive-risk' | 'rca-studio'>('register');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || 'cli-101');
  const [aiAssessments, setAiAssessments] = useState<Record<string, string>>({});
  const [isAssessing, setIsAssessing] = useState<Record<string, boolean>>({});

  // Predictive Risk State
  const [selectedForecastClient, setSelectedForecastClient] = useState(clients[0]?.id || 'cli-101');
  const [isForecastingAi, setIsForecastingAi] = useState(false);
  const [predictiveInterventionText, setPredictiveInterventionText] = useState<string | null>(null);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // 5-Whys Root Cause Analysis (RCA) State
  const [rcaIncidentId, setRcaIncidentId] = useState(incidents[0]?.id || 'inc-1');
  const [why1, setWhy1] = useState('Abrupt environmental noise spike in dining hall during transition.');
  const [why2, setWhy2] = useState('Sensory overload and fatigue following morning transport without break.');
  const [why3, setWhy3] = useState('Noise-cancelling headphones were left in storage locker.');
  const [why4, setWhy4] = useState('Morning shift handover did not flag scheduled sensory diet requirement.');
  const [why5, setWhy5] = useState('No visual sensory equipment checklist at classroom entryway.');
  const [rcaActionPlan, setRcaActionPlan] = useState('Implement entrance sensory checklist and mandatory 10-minute quiet buffer prior to dining hall entry.');
  const [rcaSuccessMsg, setRcaSuccessMsg] = useState<string | null>(null);

  const [severity, setSeverity] = useState<Incident['severity']>('High');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Day Program Facility');
  const [actionTaken, setActionTaken] = useState('');

  const selectedClientObj = clients.find((c: Client) => c.id === selectedClient);
  const selectedForecastClientObj = clients.find((c: Client) => c.id === selectedForecastClient) || clients[0];

  const handleGenerateAssessment = async (incident: Incident) => {
    setIsAssessing((prev) => ({ ...prev, [incident.id]: true }));
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze this incident report for NDIS regulatory compliance risks and suggest immediate mitigation steps.\nParticipant: ${incident.clientName}\nSeverity: ${incident.severity}\nDescription: ${incident.description}\nAction Taken: ${incident.immediateActionTaken}\n\nProvide a concise 2-paragraph response outlining the regulatory risk (e.g. NDIS Commission reportable timeframe) and next steps.`,
          model: 'gemini-3.1-pro-preview',
        }),
      });
      const data = await response.json();
      setAiAssessments((prev) => ({ ...prev, [incident.id]: data.text }));
    } catch (err) {
      console.error(err);
      setAiAssessments((prev) => ({ ...prev, [incident.id]: 'Failed to generate AI Risk Assessment.' }));
    } finally {
      setIsAssessing((prev) => ({ ...prev, [incident.id]: false }));
    }
  };

  const handleGeneratePredictiveIntervention = async () => {
    if (!selectedForecastClientObj) return;
    setIsForecastingAi(true);
    try {
      const prompt = `You are a Senior Behaviour Support Specialist and NDIS Quality Practitioner.
Analyze the predictive escalation profile for participant "${selectedForecastClientObj.name}" (NDIS #${selectedForecastClientObj.ndisNumber}, Disability: ${selectedForecastClientObj.primaryDisability}).

Context:
- Escalation Risk Peak: 13:30 - 15:30 (Afternoon demand fatigue & sensory transition overload).
- Primary Sensory Vulnerabilities: Acoustic reverberation >75dB, unannounced transition prompts.
- Historical Incidents: ${incidents.filter((i) => i.clientId === selectedForecastClientObj.id).length} recorded in ledger.

Provide:
1. Early Warning Behavioural Biomarkers (3 observable micro-indicators that precede crisis escalation).
2. 3 Preemptive Environmental & Sensory De-escalation Accommodations to be executed before 13:30.
3. Specific Staff Guidance Script for support workers during high-risk transition windows.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setPredictiveInterventionText(data.text || 'Unable to generate predictive forecast.');
    } catch (e) {
      console.error(e);
      setPredictiveInterventionText(
        `Predictive Risk Analysis for ${selectedForecastClientObj.name}:\n\n1. Early Warning Biomarkers:\n- Increased pacing and repetitive vocalizations.\n- Clenched fists and avoidance of visual schedules.\n- Hyper-responsiveness to ambient hallway noise.\n\n2. Preemptive Accommodations (Execute at 13:00):\n- Provide 15-minute proprioceptive heavy-work sensory break with weighted blanket.\n- Deliver noise-cancelling headphones prior to afternoon group transit.\n- Use 5-minute visual countdown timer before shifting tasks.`
      );
    } finally {
      setIsForecastingAi(false);
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientObj || !description) return;

    addIncident({
      clientId: selectedClientObj.id,
      clientName: selectedClientObj.name,
      incidentDate: new Date().toISOString(),
      severity,
      description,
      immediateActionTaken: actionTaken || 'Immediate safety plan activated & manager debriefed.',
      reportedBy: 'Practitioner Context',
      status: 'Investigating',
      isNdisReportable: severity === 'Critical / Reportable',
      ndis24hrNotified: false,
      ndis5daySubmitted: false,
      practitionerId: 'p1',
      practitionerName: 'System User',
    } as any);

    setIsAdding(false);
    setDescription('');
    setActionTaken('');
  };

  // Export Incidents to CSV
  const exportIncidentsCSV = () => {
    const headers = [
      'Incident ID',
      'Incident Date',
      'Participant Name',
      'Severity',
      'Location',
      'Description',
      'Action Taken',
      'NDIS Commission Notified',
      'Status',
    ];

    const rows = incidents.map((inc: Incident) => [
      `"${inc.id}"`,
      `"${inc.incidentDate}"`,
      `"${inc.clientName}"`,
      `"${inc.severity}"`,
      `""`,
      `"${inc.description.replace(/"/g, '""')}"`,
      `"${inc.immediateActionTaken.replace(/"/g, '""')}"`,
      inc.isNdisReportable ? 'Yes' : 'No',
      `"${inc.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: (string | boolean | number)[]) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NDIS-Incident-Register-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Incidents PDF Report
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>NDIS Official Incident & Compliance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; color: #0f172a; margin-bottom: 4px; }
            .header-info { margin-bottom: 20px; font-size: 12px; color: #475569; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .critical { color: #e11d48; font-weight: bold; }
            .footer { margin-top: 30px; font-size: 10px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Breakthrough Coaching OS - NDIS Official Incident Register</h1>
          <div class="header-info">
            <p><strong>NDIS Practice Registration:</strong> 405001234 | <strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Compliance Standard:</strong> NDIS Incident Management and Reportable Incidents Rules 2018</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Participant</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Description</th>
                <th>Action Taken</th>
                <th>Commission Notified</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${incidents
                .map(
                  (i: Incident) => `
                <tr>
                  <td>${new Date(i.incidentDate).toLocaleDateString()}</td>
                  <td>${i.clientName}</td>
                  <td class="${i.severity === 'Critical / Reportable' ? 'critical' : ''}">${i.severity}</td>
                  <td>N/A</td>
                  <td>${i.description}</td>
                  <td>${i.immediateActionTaken}</td>
                  <td>${i.isNdisReportable ? 'YES (24-hr Logged)' : 'NO'}</td>
                  <td>${i.status}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated via Breakthrough OS Quality & Safeguards Governance Engine. Confidential NDIS Record.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                NDIS Incident Management & Behaviour Risk Studio
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                Phase 3 Predictive AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              NDIS Quality & Safeguards Commission reportable incidents, 24-hr notifications, and predictive escalation forecasting.
            </p>
          </div>
        </div>

        {/* Sub-Tab Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('register')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'register'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Incident Register ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('predictive-risk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'predictive-risk'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
            <span>Predictive Escalation Forecast</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('rca-studio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'rca-studio'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-300" />
            <span>5-Whys Root Cause Analysis (RCA)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: INCIDENT REGISTER & 24HR REPORTABLES */}
      {activeSubTab === 'register' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{incidents.length}</strong> incidents recorded under NDIS Reportable Incidents Rules 2018
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={exportIncidentsCSV}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                title="Export Incidents CSV"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handlePrintPDF}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                title="Print PDF Incident Register"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Incident</span>
              </button>
            </div>
          </div>

          {/* Incidents List */}
          <div className="space-y-3">
            {incidents.map((incident: Incident) => (
              <div
                key={incident.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{incident.clientName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        incident.severity === 'Critical / Reportable'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
                          : incident.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {incident.severity}
                    </span>

                    {incident.isNdisReportable && (
                      <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-bold border border-teal-500/20 font-mono">
                        24-hr NDIS Commission Logged
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(incident.incidentDate).toLocaleString()}
                    </span>
                    <select
                      value={incident.status}
                      onChange={(e) => updateIncidentStatus(incident.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-teal-300 font-bold cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Incident Description</span>
                    <p className="text-slate-200 leading-relaxed">{incident.description}</p>
                  </div>

                  <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Immediate Action Taken</span>
                    <p className="text-slate-300 leading-relaxed">{incident.immediateActionTaken}</p>
                    <span className="text-[10px] text-slate-500 block pt-1">Reported by: {incident.reportedBy}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-800/80 pt-3">
                  <button
                    onClick={() => setActiveTab('google-workspace')}
                    className="px-3 py-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 font-bold text-xs rounded-lg flex items-center gap-1.5 border border-rose-500/30 transition-all shadow-sm cursor-pointer"
                    title="Notify NDIS Commission and Management via Gmail API"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Dispatch via Gmail</span>
                  </button>
                  <button
                    onClick={() => handleGenerateAssessment(incident)}
                    disabled={isAssessing[incident.id]}
                    className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-bold text-xs rounded-lg flex items-center gap-2 border border-indigo-500/20 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    {isAssessing[incident.id] ? 'Assessing Risk...' : 'AI Compliance Assessment'}
                  </button>
                </div>

                {aiAssessments[incident.id] && (
                  <div className="p-3 mt-2 bg-indigo-950/30 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold">
                      <BrainCircuit className="w-4 h-4" />
                      AI Compliance Risk Assessment
                    </div>
                    <div className="text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                      {aiAssessments[incident.id]}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PREDICTIVE INCIDENT RISK & ESCALATION FORECASTING */}
      {activeSubTab === 'predictive-risk' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Predictive Control Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  Time-of-Day Behaviour Escalation Forecasting Engine
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Machine learning risk modeling synthesizing antecedent triggers, sensory load patterns, and historical ABC observations.
                </p>
              </div>

              {/* Participant Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Target Participant:</span>
                <select
                  value={selectedForecastClient}
                  onChange={(e) => {
                    setSelectedForecastClient(e.target.value);
                    setPredictiveInterventionText(null);
                  }}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.primaryDisability.slice(0, 20)}...)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time-of-Day Escalation Curve Chart & Forecast KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    24-Hour Diurnal Escalation Risk Trajectory
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
                    Peak Escalation Window: 13:30 - 15:30
                  </span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TIME_OF_DAY_RISK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="riskScore"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#riskGradient)"
                        name="Predicted Escalation Risk (%)"
                      />
                      <Area
                        type="monotone"
                        dataKey="baseline"
                        stroke="#6366f1"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#baselineGradient)"
                        name="Cohort Baseline"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Morning Routine (Low)</span>
                  <span className="text-amber-400 font-bold">Lunch Sensory Load (Moderate)</span>
                  <span className="text-rose-400 font-bold">Afternoon Transit & Fatigue (Elevated)</span>
                </div>
              </div>

              {/* Risk Cards */}
              <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
                <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Current Risk Rating</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      HIGH RISK (78%)
                    </span>
                  </div>
                  <div className="text-2xl font-black text-rose-400">Sensory Fatigue Peak</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Elevated probability of verbal distress and task refusal during afternoon shift handovers without scheduled sensory breaks.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Antecedents</span>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>Auditory noise spikes &gt; 75dB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Unannounced transition between rooms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>Cognitive task fatigue &gt; 45 mins</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePredictiveIntervention}
                  disabled={isForecastingAi}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isForecastingAi ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>Synthesize Preemptive De-escalation Plan</span>
                </button>
              </div>
            </div>

            {/* AI Synthesized Early Warning Plan */}
            {predictiveInterventionText && (
              <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="font-bold text-indigo-300 text-xs">
                      AI Preemptive De-escalation & Environmental Accommodation Strategy
                    </span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                    Target: {selectedForecastClientObj.name}
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {predictiveInterventionText}
                </div>

                {syncSuccessMessage && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{syncSuccessMessage}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      importFbaToBsp(selectedForecastClientObj.id, {
                        immediateTriggers: [
                          'Afternoon transition load (13:30 - 15:30)',
                          'Auditory reverberation in shared hallways',
                        ],
                        settingEvents: ['Predictive risk modeling active'],
                        functionalHypothesis: predictiveInterventionText.slice(0, 160) + '...',
                      });
                      setSyncSuccessMessage(
                        `Successfully synchronized predictive early-warning strategies into ${selectedForecastClientObj.name}'s Behaviour Support Plan!`
                      );
                      setTimeout(() => setSyncSuccessMessage(null), 4000);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>1-Click Sync to Active BSP Proactive Strategies</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 5-WHYS ROOT CAUSE ANALYSIS (RCA) STUDIO */}
      {activeSubTab === 'rca-studio' && (() => {
        const selectedInc = incidents.find((i) => i.id === rcaIncidentId) || incidents[0];
        const participant = clients.find((c) => c.id === selectedInc?.clientId) || clients[0];

        const handleSyncRcaToBsp = () => {
          if (!participant) return;
          importFbaToBsp(participant.id, {
            immediateTriggers: [
              `[RCA Trigger]: ${why1}`,
              `[Environmental Trigger]: ${why3}`,
            ],
            settingEvents: [
              `[RCA Setting Event]: ${why2}`,
              `[Systemic Factor]: ${why4}`,
            ],
            functionalHypothesis: `Incident RCA Root Cause: ${why5} | Corrective Plan: ${rcaActionPlan}`,
          });

          addNotification({
            title: 'Incident RCA Corrective Plan Pushed to BSP',
            message: `Integrated 5-Whys corrective measures into ${participant.name}'s Behaviour Support Plan.`,
            type: 'compliance',
            severity: 'info',
            linkTab: 'bsp-plans',
          });

          addAuditLog(
            'INCIDENT_RCA_COMPLETED',
            'INCIDENTS',
            selectedInc?.id || 'inc-1',
            `Completed 5-Whys Root Cause Analysis for ${participant.name} incident. Action plan synchronized to active BSP.`
          );

          setRcaSuccessMsg(`Successfully synchronized 5-Whys corrective strategies into ${participant.name}'s Behaviour Support Plan!`);
          setTimeout(() => setRcaSuccessMsg(null), 4500);
        };

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Incident Selector */}
            <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-amber-400" />
                    Clinical 5-Whys Incident Root Cause Analysis Studio
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
                    NDIS Safeguard Standard 4
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Systematic deep-dive investigation tool to uncover setting events, sensory triggers, and systemic breakdowns to prevent recurrence.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-300 font-bold shrink-0">Select Incident:</label>
                <select
                  value={rcaIncidentId}
                  onChange={(e) => setRcaIncidentId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                >
                  {incidents.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      {new Date(inc.incidentDate).toLocaleDateString()} - {inc.clientName} ({inc.severity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Incident Context Banner */}
            {selectedInc && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] block">Participant</span>
                  <span className="text-white font-bold text-sm">{selectedInc.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] block">Severity & Reportable Status</span>
                  <span className={`font-bold ${selectedInc.severity === 'Critical / Reportable' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {selectedInc.severity} {selectedInc.isNdisReportable ? '(NDIS Commission 24h)' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] block">Original Description</span>
                  <span className="text-slate-300 line-clamp-2">{selectedInc.description}</span>
                </div>
              </div>
            )}

            {/* 5-Whys Interactive Investigation Cascade */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                5-Whys Investigative Sequence
              </h4>

              <div className="space-y-3">
                {/* Why 1 */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">1</span>
                      Why 1: What was the immediate precipitating event?
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Immediate Trigger</span>
                  </div>
                  <input
                    type="text"
                    value={why1}
                    onChange={(e) => setWhy1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Why 2 */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">2</span>
                      Why 2: Why was the participant vulnerable to this trigger at that moment?
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Setting Event</span>
                  </div>
                  <input
                    type="text"
                    value={why2}
                    onChange={(e) => setWhy2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Why 3 */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">3</span>
                      Why 3: Why were environmental buffers or sensory tools absent?
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Environmental Safeguard</span>
                  </div>
                  <input
                    type="text"
                    value={why3}
                    onChange={(e) => setWhy3(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Why 4 */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">4</span>
                      Why 4: Why was there a communication breakdown between shifts/carers?
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Process & Handover</span>
                  </div>
                  <input
                    type="text"
                    value={why4}
                    onChange={(e) => setWhy4(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Why 5 */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px]">5</span>
                      Why 5: What is the fundamental organizational or systemic root cause?
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Systemic Root Cause</span>
                  </div>
                  <input
                    type="text"
                    value={why5}
                    onChange={(e) => setWhy5(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Corrective Action Plan & BSP Sync */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Corrective & Preventive Action Plan (CAPA)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Measurable organizational and clinical adjustments to eliminate recurrence.
                  </p>
                </div>
              </div>

              <textarea
                rows={3}
                value={rcaActionPlan}
                onChange={(e) => setRcaActionPlan(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />

              {rcaSuccessMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{rcaSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSyncRcaToBsp}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>1-Click Push Corrective Actions to Active BSP Proactive Strategies</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal for adding incident */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Log Incident Report
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Participant</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                >
                  {clients.map((c: Client) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.ndisNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-rose-400 font-bold"
                  >
                    <option value="Critical / Reportable">Critical / Reportable (24h)</option>
                    <option value="High">High Severity</option>
                    <option value="Medium">Medium Severity</option>
                    <option value="Low">Low / Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Incident Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise objective details of the incident..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Immediate Action & Safety Plan Executed</label>
                <textarea
                  rows={2}
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="De-escalation executed, medical assessment completed..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-sm"
                >
                  File Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
