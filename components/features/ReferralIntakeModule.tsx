'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Referral, ReferralStage, WaitlistEntry, ServiceAgreement, IntakeAssessment } from '@/types';
import {
  UserPlus,
  Layers,
  Clock,
  FileCheck,
  BarChart3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  UserCheck,
  DollarSign,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Zap,
  ArrowUpRight,
  FileText
} from 'lucide-react';

export const ReferralIntakeModule: React.FC = () => {
  const {
    referrals,
    waitlist,
    serviceAgreements,
    intakeAssessments,
    practitioners,
    addReferral,
    updateReferralStage,
    calculatePriorityScore,
    updateWaitlistPosition,
    removeFromWaitlist,
    generateServiceAgreement,
    advanceIntakeStage,
    convertReferralToClient,
    currentUser,
  } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'intake' | 'pipeline' | 'waitlist' | 'agreements' | 'workflow' | 'analytics'
  >('pipeline');

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Intake Form State
  const [participantName, setParticipantName] = useState('');
  const [ndisNumber, setNdisNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2012-05-15');
  const [primaryDisability, setPrimaryDisability] = useState('Autism Spectrum Disorder (Level 2)');
  const [source, setSource] = useState<Referral['source']>('Support Coordinator');
  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [urgency, setUrgency] = useState(3);
  const [complexity, setComplexity] = useState(3);
  const [availability, setAvailability] = useState(3);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [primaryNeed, setPrimaryNeed] = useState('');
  const [estimatedPlanValue, setEstimatedPlanValue] = useState(25000);
  const [notes, setNotes] = useState('');

  // Selected Service Agreement for Markdown Preview
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(
    serviceAgreements[0]?.id || null
  );

  const calculatedPriority = calculatePriorityScore(urgency, complexity, availability);

  const STAGES: ReferralStage[] = [
    'New',
    'Triage',
    'Clinical Assessment',
    'Service Matching',
    'Onboarding',
    'Converted',
  ];

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName) return;

    addReferral({
      participantName,
      ndisNumber: ndisNumber || undefined,
      dateOfBirth,
      primaryDisability,
      referralDate: new Date().toISOString().slice(0, 10),
      source,
      referrerName: referrerName || 'Self / Family',
      referrerEmail: referrerEmail || 'referrer@contact.com',
      referrerPhone: referrerPhone || '0400 000 000',
      stage: 'New',
      triageFields: {
        urgency: urgency as 1 | 2 | 3 | 4 | 5,
        complexity: complexity as 1 | 2 | 3 | 4 | 5,
        serviceAvailability: availability as 1 | 2 | 3 | 4 | 5,
        riskLevel,
        primaryNeed: primaryNeed || 'Behaviour Support Plan development',
        previousProvider: false,
        interpreterRequired: false,
      },
      estimatedPlanValue: Number(estimatedPlanValue),
      notes: notes || 'New intake record received.',
    });

    // Reset Form & Switch to pipeline
    setParticipantName('');
    setNdisNumber('');
    setReferrerName('');
    setPrimaryNeed('');
    setActiveSubTab('pipeline');
  };

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      r.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.ndisNumber && r.ndisNumber.includes(searchQuery)) ||
      (r.primaryDisability || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || r.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg text-white">
              <UserPlus className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  NDIS Referral & Intake Pipeline Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R3 Capability
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-criteria triage scoring, Kanban pipeline, waitlist positioning, Service Agreement generator, and one-click participant conversion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSubTab('intake')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Referral Intake</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-800/80 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'pipeline', label: 'Pipeline Board', icon: Layers, count: referrals.length },
            { id: 'intake', label: 'Intake Triage Form', icon: Plus },
            { id: 'waitlist', label: 'Waitlist Management', icon: Clock, count: waitlist.length },
            { id: 'agreements', label: 'Service Agreements', icon: FileCheck, count: serviceAgreements.length },
            { id: 'workflow', label: 'Intake Assessment Flow', icon: Zap, count: intakeAssessments.length },
            { id: 'analytics', label: 'Conversion Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    active ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 1. PIPELINE BOARD SUB-TAB (KANBAN) */}
      {/* ====================================================================== */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search referrals by participant, NDIS, disability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter Stage:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Stages</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
            {STAGES.map((stage) => {
              const stageReferrals = filteredReferrals.filter((r) => r.stage === stage);
              return (
                <div key={stage} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col space-y-3 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs truncate">{stage}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {stageReferrals.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[600px]">
                    {stageReferrals.map((r) => {
                      const isCritical = r.priorityScore >= 80;
                      const isHigh = r.priorityScore >= 65 && r.priorityScore < 80;

                      return (
                        <div
                          key={r.id}
                          className={`p-3 rounded-xl border transition-all space-y-2.5 bg-slate-950/80 ${
                            isCritical
                              ? 'border-rose-500/40 shadow-sm shadow-rose-950'
                              : isHigh
                              ? 'border-amber-500/30'
                              : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="font-bold text-white text-xs leading-snug">{r.participantName}</h5>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                                isCritical
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : isHigh
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-teal-500/20 text-teal-300'
                              }`}
                            >
                              {r.priorityScore} pts
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 leading-tight">{r.primaryDisability}</p>

                          <div className="space-y-1 text-[10px] bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                            <div className="flex justify-between text-slate-500">
                              <span>Source:</span>
                              <span className="text-slate-300 font-medium truncate max-w-[90px]">{r.source}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Value:</span>
                              <strong className="text-emerald-400 font-mono font-bold">
                                ${r.estimatedPlanValue?.toLocaleString()}
                              </strong>
                            </div>
                          </div>

                          {/* Stage Transition Selector */}
                          <div className="pt-1 flex items-center justify-between border-t border-slate-800/80">
                            <select
                              value={r.stage}
                              onChange={(e) => updateReferralStage(r.id, e.target.value as ReferralStage)}
                              className="bg-transparent text-[10px] font-bold text-teal-400 focus:outline-none cursor-pointer"
                            >
                              {STAGES.map((s) => (
                                <option key={s} value={s} className="bg-slate-900 text-white">
                                  → {s}
                                </option>
                              ))}
                            </select>

                            {r.stage === 'Onboarding' && (
                              <button
                                onClick={() => convertReferralToClient(r.id)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold rounded shadow cursor-pointer flex items-center gap-1"
                                title="Convert to Active NDIS Client"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Convert
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. REFERRAL INTAKE TRIAGE FORM SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'intake' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">Comprehensive NDIS Referral Intake Form</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Capture participant details and execute automated triage algorithm
              </p>
            </div>
            {/* Live Priority Score Badge */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-emerald-500/30">
              <span className="text-xs font-bold text-slate-400">Real-time Priority Score:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{calculatedPriority} / 100</span>
            </div>
          </div>

          <form onSubmit={handleCreateReferral} className="space-y-6 text-xs">
            {/* Participant Demographics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Participant Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Participant Full Name *</label>
                  <input
                    type="text"
                    required
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="e.g., Ethan Wright"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">NDIS Participant Number</label>
                  <input
                    type="text"
                    value={ndisNumber}
                    onChange={(e) => setNdisNumber(e.target.value)}
                    placeholder="430XXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Primary Disability Diagnosis</label>
                <input
                  type="text"
                  value={primaryDisability}
                  onChange={(e) => setPrimaryDisability(e.target.value)}
                  placeholder="e.g., Autism Spectrum Disorder (Level 2)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Referrer Details */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Referrer & Source Channel
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Referral Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Support Coordinator">Support Coordinator</option>
                    <option value="Hospital / Allied Health">Hospital / Allied Health</option>
                    <option value="NDIS Portal">NDIS Portal</option>
                    <option value="GP Referral">GP Referral</option>
                    <option value="Self-Referral">Self-Referral</option>
                    <option value="Community Organisation">Community Organisation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Referrer Name</label>
                  <input
                    type="text"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                    placeholder="e.g., Lisa Thompson"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Referrer Email</label>
                  <input
                    type="email"
                    value={referrerEmail}
                    onChange={(e) => setReferrerEmail(e.target.value)}
                    placeholder="lisa@scagency.com.au"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Referrer Phone</label>
                  <input
                    type="tel"
                    value={referrerPhone}
                    onChange={(e) => setReferrerPhone(e.target.value)}
                    placeholder="0412 345 678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Triage Scoring Sliders */}
            <div className="space-y-4 pt-3 border-t border-slate-800 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>3. Automated Triage & Priority Scoring Parameters</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-300">Clinical Urgency (1-5)</span>
                    <span className="font-mono font-bold text-emerald-400">{urgency} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={urgency}
                    onChange={(e) => setUrgency(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">1: Elective • 5: Crisis / Hospital Discharge</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-300">Case Complexity (1-5)</span>
                    <span className="font-mono font-bold text-teal-400">{complexity} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={complexity}
                    onChange={(e) => setComplexity(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">1: Mild • 5: Dual Diagnosis / Severe Behaviours</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-300">Service Availability Match (1-5)</span>
                    <span className="font-mono font-bold text-indigo-400">{availability} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={availability}
                    onChange={(e) => setAvailability(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">1: No Slots • 5: Immediate Practitioner Match</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Safety Risk Classification</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Low">Low Risk (Standard Care)</option>
                    <option value="Medium">Medium Risk (Escalating Behaviours)</option>
                    <option value="High">High Risk (Physical Aggression / SIB)</option>
                    <option value="Critical">Critical Risk (Active Restrictive Practices / Hospitalization)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Estimated NDIS Funding Value ($)</label>
                  <input
                    type="number"
                    step="1000"
                    value={estimatedPlanValue}
                    onChange={(e) => setEstimatedPlanValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveSubTab('pipeline')}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Submit Referral Intake & Calculate Route
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. WAITLIST MANAGEMENT SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'waitlist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">Active Clinical Service Waitlist</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Prioritized queue based on clinical urgency, safety risk levels, and specialist capacity
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {waitlist.length} Queued Participants
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Participant Name</th>
                  <th className="py-3 px-4">Service Type Requested</th>
                  <th className="py-3 px-4">Priority Level</th>
                  <th className="py-3 px-4">Target Start Date</th>
                  <th className="py-3 px-4">Assigned Specialist</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {waitlist
                  .sort((a, b) => a.position - b.position)
                  .map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400 text-sm">
                        #{entry.position}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{entry.participantName}</td>
                      <td className="py-3 px-4 text-slate-200">{entry.serviceType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.priority === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : entry.priority === 'Urgent'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {entry.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{entry.estimatedStartDate}</td>
                      <td className="py-3 px-4 text-slate-300">{entry.assignedPractitionerName || 'Pending Allocation'}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => updateWaitlistPosition(entry.id, Math.max(1, entry.position - 1))}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => updateWaitlistPosition(entry.id, entry.position + 1)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => removeFromWaitlist(entry.id)}
                          className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[10px] font-bold border border-rose-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. SERVICE AGREEMENTS GENERATOR SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'agreements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agreement List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">NDIS Service Agreements</h4>
              <span className="text-xs text-slate-400">{serviceAgreements.length} Created</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {serviceAgreements.map((sa) => (
                <div
                  key={sa.id}
                  onClick={() => setSelectedAgreementId(sa.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    selectedAgreementId === sa.id
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <strong className="text-white text-xs">{sa.participantName}</strong>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sa.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : sa.status === 'Sent'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sa.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">NDIS: {sa.ndisNumber}</p>
                  <p className="text-[11px] text-emerald-400 font-mono font-bold">${sa.totalBudget.toLocaleString()} Total Funding</p>
                </div>
              ))}
            </div>

            {/* Quick Generator from Referral */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Generate New Agreement</span>
              <button
                onClick={() => {
                  const unagreed = referrals.find((r) => !serviceAgreements.some((sa) => sa.referralId === r.id));
                  if (unagreed) {
                    generateServiceAgreement(unagreed.id);
                  }
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Auto-Generate from Next Referral</span>
              </button>
            </div>
          </div>

          {/* Agreement Preview Viewer */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            {selectedAgreementId ? (
              (() => {
                const agreement = serviceAgreements.find((s) => s.id === selectedAgreementId);
                if (!agreement) return null;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-extrabold text-white text-base">{agreement.participantName} — NDIS Service Agreement</h4>
                        <p className="text-xs text-slate-400 font-mono">Plan Window: {agreement.planStartDate} → {agreement.planEndDate}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                        {agreement.status} Status
                      </span>
                    </div>

                    {/* Markdown / Agreement Content View */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {agreement.agreementMarkdown}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      {agreement.serviceCategories.map((cat, i) => (
                        <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block truncate">{cat.category}</span>
                          <strong className="text-emerald-400 font-mono text-sm">${cat.allocatedBudget.toLocaleString()}</strong>
                          <span className="text-[10px] text-slate-400 ml-2">(@ ${cat.hourlyRate}/hr)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-center text-slate-500 py-12 text-xs">Select a service agreement to view details.</p>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 5. INTAKE ASSESSMENT WORKFLOW TRACKER SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'workflow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {intakeAssessments.map((ia) => {
              const currentStageName = ia.currentStage;

              return (
                <div key={ia.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{ia.participantName}</h4>
                      <span className="text-xs text-slate-400">Current Phase: <strong className="text-emerald-400">{currentStageName}</strong></span>
                    </div>
                    <button
                      onClick={() => advanceIntakeStage(ia.id, 'Clinical assessment requirements verified.')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <span>Advance to Next Stage</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 4-Stage Horizontal Pipeline */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {ia.stages.map((stage, sIdx) => {
                      const isDone = stage.status === 'Complete';
                      const isCurrent = stage.status === 'In Progress';

                      return (
                        <div
                          key={sIdx}
                          className={`p-4 rounded-xl border text-xs space-y-2 ${
                            isDone
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                              : isCurrent
                              ? 'bg-teal-950/30 border-teal-400 text-white ring-2 ring-teal-500/20'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{sIdx + 1}. {stage.name}</span>
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isCurrent ? (
                              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                            ) : null}
                          </div>

                          {stage.findings && (
                            <p className="text-[11px] text-slate-300 leading-snug bg-slate-900/60 p-2 rounded border border-slate-800">
                              {stage.findings}
                            </p>
                          )}

                          {stage.handoffNotes && (
                            <p className="text-[10px] text-amber-300/90 italic">
                              Handoff: {stage.handoffNotes}
                            </p>
                          )}

                          <span className="text-[9px] font-mono text-slate-500 block">
                            {isDone ? `Completed: ${stage.completedDate}` : isCurrent ? `Started: ${stage.startedDate}` : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 6. REFERRAL ANALYTICS SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Total Pipeline Referrals</span>
              <p className="text-3xl font-extrabold text-white mt-1">{referrals.length}</p>
              <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                {referrals.filter((r) => r.stage === 'Converted').length} Converted to Active Clients
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Average Priority Score</span>
              <p className="text-3xl font-extrabold text-teal-400 mt-1 font-mono">
                {Math.round(referrals.reduce((acc, r) => acc + r.priorityScore, 0) / Math.max(referrals.length, 1))} / 100
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Triage severity index</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 font-medium">Total Pipeline Value</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
                ${referrals.reduce((acc, r) => acc + (r.estimatedPlanValue || 0), 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Potential annual NDIS revenue</span>
            </div>
          </div>

          {/* Referral Source Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base">Referral Intake Source Breakdown</h3>

            <div className="space-y-3">
              {['Support Coordinator', 'Hospital / Allied Health', 'NDIS Portal', 'GP Referral', 'Self-Referral', 'Community Organisation'].map((src) => {
                const count = referrals.filter((r) => r.source === src).length;
                const pct = Math.round((count / Math.max(referrals.length, 1)) * 100);

                return (
                  <div key={src} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-300">{src}</span>
                      <span className="font-mono text-emerald-400 font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
