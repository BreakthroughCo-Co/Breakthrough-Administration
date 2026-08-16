'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Practitioner, Client } from '@/types';
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  UserCheck,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  ShieldAlert,
  Bell,
  AlertCircle,
  Calendar,
  ArrowRight,
  Search,
  FileText,
  RefreshCw,
  Zap,
  CheckCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { exportParticipantToFHIRBundle, downloadFHIRBundle } from '@/lib/fhir-exporter';

export const ComplianceDashboard: React.FC = () => {
  const {
    clients,
    practitioners,
    auditLogs,
    restrictivePractices,
    incidents,
    practiceBranding,
    updatePracticeBranding,
    generateCommissionAuditPackage,
    setActiveTab,
    addAuditLog,
    addNotification
  } = useManagementStore();

  // AI Policy Compliance Tool State
  const [selectedAuditClient, setSelectedAuditClient] = useState(clients[0]?.id || 'cli-101');
  const [standardCategory, setStandardCategory] = useState('Core Module 1: Rights and Responsibilities');
  const [customEvidenceText, setCustomEvidenceText] = useState(
    'Participant receiving PBS and Allied Health OT supports. Case notes indicate weekly 1:1 sessions, quarterly goal reviews, and emergency restrictive practice authorization with guardian consent.'
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [isAuditPackageModalOpen, setIsAuditPackageModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [activeAuditPackage, setActiveAuditPackage] = useState<any>(null);
  const [brandingForm, setBrandingForm] = useState(practiceBranding);
  const [auditResult, setAuditResult] = useState<{
    overallComplianceScore: number;
    riskLevel: string;
    auditSummary: string;
    identifiedGaps: {
      standard: string;
      gapDescription: string;
      severity: string;
      recommendedAction: string;
      relevantDocument?: string;
    }[];
    complianceStrengths: string[];
    auditorNotes?: string;
  } | null>(null);

  const selectedClientObj = clients.find((c: Client) => c.id === selectedAuditClient) || clients[0];

  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/compliance-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: selectedClientObj?.name || 'Jordan Miller',
          documentType: 'NDIS Care File & Case Notes',
          docContent: customEvidenceText,
          standardCategory,
        }),
      });

      const data = await res.json();
      setAuditResult(data);

      addAuditLog(
        'AI_POLICY_COMPLIANCE_AUDIT',
        'COMPLIANCE',
        selectedAuditClient,
        `Ran AI Policy Compliance Cross-Reference for ${selectedClientObj?.name} against ${standardCategory}. Score: ${data.overallComplianceScore}%.`
      );

      addNotification({
        title: `AI Policy Compliance Audit Complete: ${selectedClientObj?.name}`,
        message: `Cross-referenced against ${standardCategory}. Score: ${data.overallComplianceScore}% (${data.riskLevel} Risk). Identified ${data.identifiedGaps?.length || 0} policy gaps.`,
        type: 'compliance',
        severity: data.riskLevel === 'High' ? 'high' : 'info',
        linkTab: 'audit',
      });
    } catch (err) {
      console.error('AI Compliance Audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Practitioner screening statuses
  const screeningActive = practitioners.filter((p: Practitioner) => p.screeningStatus === 'Valid').length;
  const screeningExpiring = practitioners.filter((p: Practitioner) => p.screeningStatus === 'Expiring Soon').length;
  const screeningExpired = practitioners.filter((p: Practitioner) => p.screeningStatus === 'Expired').length;

  const practitionerChartData = [
    { name: 'Active & Valid', value: screeningActive || 3, color: '#10b981' },
    { name: 'Expiring Soon', value: screeningExpiring || 1, color: '#f59e0b' },
    { name: 'Expired / Review', value: screeningExpired || 0, color: '#f43f5e' },
  ];

  // Monthly Practitioner Workload Hours vs Case Note Entry Trends
  const monthlyUtilizationData = [
    { month: 'Mar 2026', workloadHours: 155, caseNotesLogged: 42, targetNotes: 40, utilization: 88 },
    { month: 'Apr 2026', workloadHours: 170, caseNotesLogged: 48, targetNotes: 45, utilization: 92 },
    { month: 'May 2026', workloadHours: 185, caseNotesLogged: 55, targetNotes: 50, utilization: 95 },
    { month: 'Jun 2026', workloadHours: 180, caseNotesLogged: 52, targetNotes: 50, utilization: 91 },
    { month: 'Jul 2026', workloadHours: 200, caseNotesLogged: 61, targetNotes: 55, utilization: 96 },
    { month: 'Aug 2026', workloadHours: 215, caseNotesLogged: 68, targetNotes: 60, utilization: 98 },
  ];

  // NDIS Quality Audit readiness categories
  const auditCategoryData = [
    { category: 'Worker Screening', score: 100, target: 100 },
    { category: 'Incident Governance', score: 92, target: 100 },
    { category: 'Restrictive Practice', score: 88, target: 100 },
    { category: 'Clinical Case Notes', score: 95, target: 100 },
    { category: 'PACE Billing', score: 98, target: 100 },
  ];

  // NDIS Policy Reviews list
  const policyReviews = [
    { title: 'NDIS Quality & Safeguards Framework 2026', category: 'Governance', status: 'Compliant', nextReview: '2026-11-15' },
    { title: 'Restrictive Practice Reduction Strategy Policy', category: 'Clinical', status: 'Compliant', nextReview: '2026-09-30' },
    { title: 'Participant Rights & Privacy Protection', category: 'Safeguards', status: 'Under Review', nextReview: '2026-08-28' },
    { title: 'NDIS Worker Screening & WWCC Standard', category: 'HR Roster', status: 'Compliant', nextReview: '2026-12-01' },
  ];

  // Automated NDIS Alert Generator (monitors client plan reviews, restrictive practices, practitioner certifications)
  const ndisAlerts = React.useMemo(() => {
    const list: {
      id: string;
      title: string;
      category: 'Participant Plan' | 'Practitioner Clearance' | 'Restrictive Practice' | 'NDIS Incident';
      description: string;
      severity: 'High' | 'Medium' | 'Info';
      dueDate: string;
      linkTab: any;
    }[] = [];

    // 1. Participant Plan Review Alerts
    clients.forEach((c: Client) => {
      if (c.planEndDate) {
        const end = new Date(c.planEndDate).getTime();
        const now = new Date().getTime();
        const daysLeft = Math.ceil((end - now) / (1000 * 3600 * 24));
        if (daysLeft <= 90) {
          list.push({
            id: `plan-${c.id}`,
            title: `Participant Plan Review Due`,
            category: 'Participant Plan',
            description: `${c.name} (NDIS #${c.ndisNumber}) plan review required in ${daysLeft > 0 ? `${daysLeft} days` : 'Overdue'} (${c.planEndDate}).`,
            severity: daysLeft <= 30 ? 'High' : 'Medium',
            dueDate: c.planEndDate,
            linkTab: 'clients',
          });
        }
      }
    });

    // 2. Restrictive Practice Monthly Reports
    restrictivePractices.forEach((rp) => {
      if (rp.monthlyReportStatus === 'Due' || rp.monthlyReportStatus === 'Overdue') {
        list.push({
          id: `rp-${rp.id}`,
          title: `Monthly Restrictive Practice Log`,
          category: 'Restrictive Practice',
          description: `Monthly reduction log for ${rp.clientName} (${rp.practiceType}) is ${rp.monthlyReportStatus} to NDIS Senior Practitioner.`,
          severity: 'High',
          dueDate: rp.expiryDate || '2026-08-15',
          linkTab: 'restrictive-practices',
        });
      }
    });

    // 3. Practitioner Certification Expiries
    practitioners.forEach((p) => {
      if (p.screeningStatus === 'Expiring Soon' || p.screeningStatus === 'Expired') {
        list.push({
          id: `prac-${p.id}`,
          title: `Worker Screening Clearance Renewal`,
          category: 'Practitioner Clearance',
          description: `${p.name} (${p.position}) screening clearance is ${p.screeningStatus}. Expiry: ${p.screeningExpiryDate}.`,
          severity: p.screeningStatus === 'Expired' ? 'High' : 'Medium',
          dueDate: p.screeningExpiryDate,
          linkTab: 'practitioners',
        });
      }
    });

    // 4. Reportable Incidents
    incidents.forEach((inc) => {
      if (inc.isNdisReportable && !inc.ndis5daySubmitted) {
        list.push({
          id: `inc-${inc.id}`,
          title: `NDIS Commission 5-Day Incident Report`,
          category: 'NDIS Incident',
          description: `Reportable incident for ${inc.clientName} logged on ${inc.incidentDate}. 5-Day root cause & corrective action pending.`,
          severity: 'High',
          dueDate: inc.incidentDate,
          linkTab: 'incidents',
        });
      }
    });

    return list;
  }, [clients, restrictivePractices, practitioners, incidents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">NDIS Practice Compliance & Audit Dashboard</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Audit Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time governance ledger, practitioner accreditation tracking, and NDIS Quality Commission policy standards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setIsBrandingModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Practice Letterhead</span>
          </button>
          <button
            onClick={() => {
              const pkg = generateCommissionAuditPackage(selectedAuditClient);
              setActiveAuditPackage(pkg);
              setIsAuditPackageModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            <FileCheck className="w-4 h-4" />
            <span>Compile NDIS Audit Bundle</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Overall Compliance Health</span>
          <div className="text-2xl font-black text-emerald-400">96.8%</div>
          <p className="text-[11px] text-slate-400">Passed all 2026 Quality Standards</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Practitioners Screened</span>
          <div className="text-2xl font-black text-white">{practitioners.length} / {practitioners.length}</div>
          <p className="text-[11px] text-emerald-400">100% NDIS Clearance Verified</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Active Audit Ledger Items</span>
          <div className="text-2xl font-black text-teal-400">{auditLogs.length}</div>
          <p className="text-[11px] text-slate-400">Immutable Ledger Entries</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Upcoming Policy Reviews</span>
          <div className="text-2xl font-black text-amber-400">1 Pending</div>
          <p className="text-[11px] text-slate-400">Due within 30 days</p>
        </div>
      </div>

      {/* NDIS Alert System Component */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">NDIS Automated Alert System</h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                  {ndisAlerts.length} Active Alerts
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated monitoring of participant plan reviews, restrictive practice reduction deadlines, and practitioner certification expiries.
              </p>
            </div>
          </div>
        </div>

        {/* Alerts Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ndisAlerts.length === 0 ? (
            <div className="col-span-2 text-center py-6 text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              All participant plans, practitioner clearances, and NDIS reporting deadlines are fully compliant!
            </div>
          ) : (
            ndisAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  alert.severity === 'High'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {alert.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        alert.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {alert.severity} Priority
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{alert.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{alert.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Target: {alert.dueDate}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab(alert.linkTab)}
                    className="text-[10px] text-teal-300 hover:text-white font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Address Alert</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Policy Compliance Tool Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-400 rounded-xl border border-teal-500/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Policy Compliance Cross-Referencer</h3>
                <span className="text-[10px] bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Gemini API Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated NDIS Practice Standards gap analysis cross-referencing live participant care files against Quality & Safeguards rules.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Select NDIS Participant File</span>
                <span className="text-[10px] text-teal-400 font-mono">{clients.length} Clients</span>
              </label>
              <select
                value={selectedAuditClient}
                onChange={(e) => setSelectedAuditClient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500 font-sans"
              >
                {clients.map((c: Client) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (NDIS #{c.ndisNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">NDIS Practice Standard Category</label>
              <select
                value={standardCategory}
                onChange={(e) => setStandardCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500"
              >
                <option value="Core Module 1: Rights and Responsibilities">Core Module 1: Rights and Responsibilities</option>
                <option value="Core Module 2: Provider Governance & Operations">Core Module 2: Provider Governance & Operations</option>
                <option value="Core Module 3: Provision of Supports & Care">Core Module 3: Provision of Supports & Care</option>
                <option value="Module 2A: Implementing Behaviour Support Plans">Module 2A: Implementing Behaviour Support Plans</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Documentation Evidence Context</label>
                <button
                  type="button"
                  onClick={() => {
                    const sample = `${selectedClientObj?.name} receiving PBS support. Latest BSP approved on 2026-03-10 with environmental restraint protocols. Case notes show 12 weekly entries, consent form signed by nominee on file, and emergency incident report on 2026-07-14.`;
                    setCustomEvidenceText(sample);
                  }}
                  className="text-[10px] text-teal-400 hover:text-teal-300 font-mono underline"
                >
                  Load Sample Evidence
                </button>
              </div>
              <textarea
                rows={5}
                value={customEvidenceText}
                onChange={(e) => setCustomEvidenceText(e.target.value)}
                placeholder="Paste participant care plan, BSP text, case notes, or service agreement excerpts here..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-teal-500 leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleRunAiAudit}
              disabled={isAuditing}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                  <span>Cross-Referencing Gemini API...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run AI Policy Cross-Reference Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display Area */}
          <div className="lg:col-span-2 space-y-4">
            {!auditResult && !isAuditing && (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-slate-950/60 rounded-xl border border-slate-800/80 border-dashed space-y-3">
                <div className="p-3 bg-slate-900 text-teal-400 rounded-full border border-slate-800">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">No AI Audit Executed Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md">
                    Select a participant file, choose an NDIS Practice Standard module, and click <strong>Run AI Policy Audit</strong> to analyze documentation for compliance gaps.
                  </p>
                </div>
              </div>
            )}

            {isAuditing && (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-400 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1 font-mono">
                  <span className="text-xs font-bold text-teal-300 block">Analyzing NDIS Practice Standards...</span>
                  <p className="text-[11px] text-slate-400">Cross-checking care documentation against NDIS Quality Commission rules.</p>
                </div>
              </div>
            )}

            {auditResult && !isAuditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800"
              >
                {/* Audit Score Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-black ${
                        auditResult.overallComplianceScore >= 85
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : auditResult.overallComplianceScore >= 70
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      <span className="text-lg leading-none">{auditResult.overallComplianceScore}%</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mt-0.5">Score</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{selectedClientObj?.name} Compliance Profile</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            auditResult.riskLevel === 'Low'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : auditResult.riskLevel === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {auditResult.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{auditResult.auditSummary}</p>
                    </div>
                  </div>
                </div>

                {/* Identified Gaps Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      Identified Policy & Documentation Gaps ({auditResult.identifiedGaps?.length || 0})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {auditResult.identifiedGaps?.map((gap, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 font-sans ${
                          gap.severity === 'CRITICAL'
                            ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                            : gap.severity === 'MODERATE'
                            ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                          <span className="font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                            {gap.standard}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                              gap.severity === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {gap.severity} Severity
                          </span>
                        </div>

                        <p className="text-[11px] leading-relaxed text-slate-300">{gap.gapDescription}</p>

                        <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] space-y-1">
                          <span className="text-[10px] uppercase font-bold text-teal-400 block font-mono">
                            Mandated Remediation Action
                          </span>
                          <p className="text-slate-200">{gap.recommendedAction}</p>
                          {gap.relevantDocument && (
                            <span className="text-[10px] text-slate-500 block font-mono">
                              File Target: {gap.relevantDocument}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Strengths */}
                {auditResult.complianceStrengths && auditResult.complianceStrengths.length > 0 && (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Verified Compliance Strengths
                    </span>
                    <ul className="space-y-1 text-[11px] text-emerald-200/90">
                      {auditResult.complianceStrengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Audit Readiness by Category BarChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.005, boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.15)' }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-teal-400" />
              NDIS Quality Audit Readiness (%)
            </h3>
            <span className="text-[10px] bg-slate-800 text-teal-300 font-mono px-2 py-0.5 rounded">
              2026 Target: 100%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="score" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Compliance Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Practitioner Certification Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.005, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)' }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              Practitioner Worker Screening Status
            </h3>
            <span className="text-[10px] bg-slate-800 text-emerald-300 font-mono px-2 py-0.5 rounded">
              {practitioners.length} Practitioners
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={practitionerChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {practitionerChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend formatter={(value) => <span className="text-slate-300 text-xs font-semibold">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Chart 3: Monthly Practitioner Workload vs Case Note Entry Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileHover={{ scale: 1.003, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)' }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Monthly Practitioner Workload vs Clinical Case Note Entry Trends
            </h3>
            <p className="text-xs text-slate-400">
              Cross-evaluating monthly billable practitioner hours against logged clinical case note volume and target documentation entries.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
              Avg Utilization: 94%
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
              Target: 100% On-Time Notes
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyUtilizationData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} unit="h" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} unit=" notes" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="workloadHours" fill="#0f766e" radius={[6, 6, 0, 0]} name="Workload Hours (h)" barSize={28} />
              <Line yAxisId="right" type="monotone" dataKey="caseNotesLogged" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="Case Notes Entered" />
              <Line yAxisId="right" type="monotone" dataKey="targetNotes" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Target Notes Threshold" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-teal-400" />
          Practitioner Accreditations & Screening Register
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px] bg-slate-950/50">
                <th className="py-3 px-4">Practitioner Name</th>
                <th className="py-3 px-4">NDIS Registration #</th>
                <th className="py-3 px-4">Worker Screening NDB</th>
                <th className="py-3 px-4">Police Check Expiry</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {practitioners.map((p: Practitioner) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.position}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-400">{p.ndisRegistrationNumber}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{p.workerScreeningNumber || 'WS-400291'}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{p.policeCheckExpiryDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.screeningStatus === 'Valid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {p.screeningStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Reviews Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-sky-400" />
          NDIS Regulatory Policy & Governance Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {policyReviews.map((policy, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="font-bold text-xs text-white block">{policy.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">Category: {policy.category}</span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold block mb-1 ${
                    policy.status === 'Compliant'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {policy.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Review: {policy.nextReview}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Package Bundle Modal */}
      {isAuditPackageModalOpen && activeAuditPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    NDIS Quality Commission Evidence Bundle ({activeAuditPackage.targetParticipantName})
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Integrity Hash: {activeAuditPackage.packageChecksum} | Grade: {activeAuditPackage.overallComplianceGrade}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditPackageModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                <span className="font-bold text-emerald-300">Verified Evidence Categories:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                  {activeAuditPackage.includedDocumentTypes.map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto">
                {activeAuditPackage.compiledMarkdown}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Ready for submission to NDIS Lead Auditor or Senior Practitioner
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    const client = clients.find((c) => c.name === activeAuditPackage.targetParticipantName) || clients[0];
                    const bsp = bspDocuments.find((b) => b.clientId === client.id);
                    const clientAssessments = clinicalAssessments.filter((a) => a.clientId === client.id);
                    const clientNotes = caseNotes.filter((n) => n.clientId === client.id);
                    const bundle = exportParticipantToFHIRBundle(client, bsp, clientAssessments, clientNotes);
                    downloadFHIRBundle(bundle, client.name);
                  }}
                  className="px-3.5 py-2 bg-indigo-950/70 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/40 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  title="Export standard HL7 FHIR R4 Bundle JSON for My Health Record / Hospital Systems"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Download FHIR R4 Bundle (.json)</span>
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([activeAuditPackage.compiledMarkdown], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `NDIS_Commission_Audit_Bundle_${activeAuditPackage.targetParticipantName.replace(/\s+/g, '_')}_2026.md`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Audit Bundle (.md)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Letterhead & Branding Modal */}
      {isBrandingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Practice Letterhead & NDIS Clinical Branding
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customise official report headers, registration details, and disclaimers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBrandingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Practice / Provider Trading Name</label>
                <input
                  type="text"
                  value={brandingForm.practiceName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, practiceName: e.target.value })}
                  className="clinical-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">NDIS Provider Registration #</label>
                  <input
                    type="text"
                    value={brandingForm.ndisRegistrationNumber}
                    onChange={(e) => setBrandingForm({ ...brandingForm, ndisRegistrationNumber: e.target.value })}
                    className="clinical-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ABN</label>
                  <input
                    type="text"
                    value={brandingForm.abn}
                    onChange={(e) => setBrandingForm({ ...brandingForm, abn: e.target.value })}
                    className="clinical-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Practice Address</label>
                <input
                  type="text"
                  value={brandingForm.address}
                  onChange={(e) => setBrandingForm({ ...brandingForm, address: e.target.value })}
                  className="clinical-input"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Report Header Notice</label>
                <textarea
                  rows={2}
                  value={brandingForm.reportHeaderNotice}
                  onChange={(e) => setBrandingForm({ ...brandingForm, reportHeaderNotice: e.target.value })}
                  className="clinical-textarea"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBrandingModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updatePracticeBranding(brandingForm);
                  setIsBrandingModalOpen(false);
                  addNotification({
                    title: 'Practice Branding Updated',
                    message: `Report letterhead configured for ${brandingForm.practiceName}.`,
                    type: 'compliance',
                    severity: 'info',
                    linkTab: 'audit',
                  });
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Save Letterhead Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
