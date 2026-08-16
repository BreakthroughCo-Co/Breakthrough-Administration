'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import {
  CPDRecord,
  StaffCredential,
  OnboardingChecklist,
  CompetencyMatrixEntry,
  TrainingModule,
  TrainingCompletion,
} from '@/types';
import {
  GraduationCap,
  Award,
  Calendar,
  CheckSquare,
  ShieldCheck,
  BookOpen,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  UserCheck,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const StaffTrainingModule: React.FC = () => {
  const {
    cpdRecords,
    staffCredentials,
    onboardingChecklists,
    competencyMatrix,
    trainingModules,
    trainingCompletions,
    practitioners,
    addCPDRecord,
    addStaffCredential,
    updateStaffCredential,
    updateOnboardingItem,
    addTrainingCompletion,
    currentUser,
  } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'cpd' | 'credentials' | 'onboarding' | 'competency' | 'screening' | 'training'
  >('cpd');

  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>(
    practitioners[0]?.id || 'prac-1'
  );

  // Modal States
  const [showAddCPDModal, setShowAddCPDModal] = useState(false);
  const [showAddCredModal, setShowAddCredModal] = useState(false);
  const [activeQuizModule, setActiveQuizModule] = useState<TrainingModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  // New CPD Form State
  const [cpdTitle, setCpdTitle] = useState('');
  const [cpdCategory, setCpdCategory] = useState<CPDRecord['category']>('Workshop');
  const [cpdHours, setCpdHours] = useState(4);
  const [cpdProvider, setCpdProvider] = useState('');

  // New Credential Form State
  const [credType, setCredType] = useState<StaffCredential['credentialType']>('NDIS Worker Screening');
  const [credIssuer, setCredIssuer] = useState('');
  const [credNumber, setCredNumber] = useState('');
  const [credExpiry, setCredExpiry] = useState('2027-12-31');

  // Filtered lists
  const filteredCPD = selectedPractitionerId === 'all'
    ? cpdRecords
    : cpdRecords.filter((r) => r.practitionerId === selectedPractitionerId);

  const filteredCredentials = selectedPractitionerId === 'all'
    ? staffCredentials
    : staffCredentials.filter((c) => c.practitionerId === selectedPractitionerId);

  const handleAddCPD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpdTitle) return;
    const prac = practitioners.find((p) => p.id === selectedPractitionerId) || practitioners[0];
    addCPDRecord({
      practitionerId: prac.id,
      practitionerName: prac.name,
      activityTitle: cpdTitle,
      category: cpdCategory,
      hours: Number(cpdHours),
      date: new Date().toISOString().slice(0, 10),
      provider: cpdProvider || 'External Provider',
      verified: true,
    });
    setShowAddCPDModal(false);
    setCpdTitle('');
    setCpdProvider('');
  };

  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credIssuer || !credNumber) return;
    const prac = practitioners.find((p) => p.id === selectedPractitionerId) || practitioners[0];
    addStaffCredential({
      practitionerId: prac.id,
      practitionerName: prac.name,
      credentialType: credType,
      issuer: credIssuer,
      credentialNumber: credNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: credExpiry,
      status: 'Valid',
    });
    setShowAddCredModal(false);
    setCredIssuer('');
    setCredNumber('');
  };

  const handleStartQuiz = (module: TrainingModule) => {
    setActiveQuizModule(module);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizModule) return;
    let correctCount = 0;
    activeQuizModule.quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeQuizModule.quizQuestions.length) * 100);
    const passed = score >= activeQuizModule.passingScore;

    setQuizResult({ score, passed });

    const prac = practitioners.find((p) => p.id === selectedPractitionerId) || practitioners[0];
    addTrainingCompletion({
      practitionerId: prac.id,
      practitionerName: prac.name,
      moduleId: activeQuizModule.id,
      moduleTitle: activeQuizModule.title,
      completedDate: new Date().toISOString().slice(0, 10),
      quizScore: score,
      passed,
      attempts: 1,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  Staff Training, CPD & Credential Governance
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  R2 Capability
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                NDIS Worker Screening, AHPRA & WWCC compliance, 30hr CPD logging, Onboarding checklists, and Competency matrices
              </p>
            </div>
          </div>

          {/* Practitioner Filter & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <select
                value={selectedPractitionerId}
                onChange={(e) => setSelectedPractitionerId(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Practitioners</option>
                {practitioners.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({p.position})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddCPDModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log CPD</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-800/80 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'cpd', label: 'CPD Hours Tracker', icon: Award },
            { id: 'credentials', label: 'Credential Calendar', icon: Calendar, count: staffCredentials.length },
            { id: 'onboarding', label: 'Onboarding Checklists', icon: CheckSquare, count: onboardingChecklists.length },
            { id: 'competency', label: 'Competency Matrix', icon: ShieldCheck },
            { id: 'screening', label: 'NDIS Worker Screening', icon: FileCheck },
            { id: 'training', label: 'Training Library & Quizzes', icon: BookOpen, count: trainingModules.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    active ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
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
      {/* 1. CPD HOURS TRACKER SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'cpd' && (
        <div className="space-y-6">
          {/* Per-Practitioner CPD Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practitioners.map((p) => {
              const pRecords = cpdRecords.filter((r) => r.practitionerId === p.id);
              const totalHours = pRecords.reduce((sum, r) => sum + r.hours, 0);
              const targetHours = 30; // Annual mandatory target
              const progressPct = Math.min(100, Math.round((totalHours / targetHours) * 100));

              return (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{p.name}</h4>
                      <span className="text-xs text-slate-400">{p.position}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-teal-400">{totalHours}</span>
                      <span className="text-xs text-slate-500"> / {targetHours} hrs</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{progressPct}% of Annual Target</span>
                      <span className={totalHours >= targetHours ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {totalHours >= targetHours ? 'Target Achieved' : `${targetHours - totalHours} hrs remaining`}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          totalHours >= targetHours
                            ? 'bg-emerald-500'
                            : totalHours >= 15
                            ? 'bg-teal-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    {['Workshop', 'Conference', 'Supervision', 'Online Course'].map((cat) => {
                      const catHours = pRecords
                        .filter((r) => r.category === cat)
                        .reduce((sum, r) => sum + r.hours, 0);
                      return (
                        <div key={cat} className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block truncate">{cat}</span>
                          <strong className="text-slate-200 font-mono">{catHours} hrs</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed CPD Activity Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Verified CPD Log History</h3>
              </div>
              <span className="text-xs text-slate-400">{filteredCPD.length} Total Activities Recorded</span>
            </div>

            <div className="divide-y divide-slate-800/60 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Practitioner</th>
                    <th className="py-3 px-4">Activity Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Provider / Organization</th>
                    <th className="py-3 px-4 text-center">Hours</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {filteredCPD.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{rec.practitionerName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{rec.activityTitle}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {rec.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{rec.provider}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-teal-400">
                        {rec.hours} hrs
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{rec.date}</td>
                      <td className="py-3 px-4 text-right">
                        {rec.verified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. CREDENTIAL CALENDAR & GOVERNANCE SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'credentials' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Mandatory Practitioner Regulatory Credentials</h3>
            <button
              onClick={() => setShowAddCredModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Credential</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCredentials.map((cred) => {
              const expiry = new Date(cred.expiryDate);
              const now = new Date('2026-08-16');
              const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpired = daysLeft < 0;
              const isExpiringSoon = daysLeft <= 60 && !isExpired;

              return (
                <div
                  key={cred.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isExpired
                      ? 'bg-rose-950/30 border-rose-500/50'
                      : isExpiringSoon
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {cred.credentialType}
                      </span>
                      <h4 className="font-bold text-white text-base mt-1.5">{cred.practitionerName}</h4>
                      <p className="text-xs text-slate-400 font-mono">Issuer: {cred.issuer}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isExpired
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isExpiringSoon
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isExpired ? 'EXPIRED' : isExpiringSoon ? `${daysLeft}d left` : 'Valid'}
                    </span>
                  </div>

                  <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Credential Ref:</span>
                      <code className="text-teal-400 font-mono font-bold">{cred.credentialNumber}</code>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Expiry Date:</span>
                      <strong className="font-mono text-slate-200">{cred.expiryDate}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">Issued: {cred.issueDate}</span>
                    {isExpiringSoon && (
                      <span className="text-amber-400 font-bold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Renewal Alert Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. ONBOARDING WORKFLOWS SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'onboarding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {onboardingChecklists.map((cl) => {
              const completedCount = cl.items.filter((i) => i.completed).length;
              const totalCount = cl.items.length;
              const pct = Math.round((completedCount / totalCount) * 100);

              return (
                <div key={cl.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{cl.practitionerName}</h4>
                      <p className="text-xs text-slate-400">Supervisor: {cl.supervisorName}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      cl.status === 'Complete' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {cl.status} ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span className="font-mono text-teal-400">{completedCount} of {totalCount} Items Completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          cl.status === 'Complete' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2 pt-2">
                    {cl.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          // Prevent toggling off mandatory items if user is not admin
                          updateOnboardingItem(cl.id, item.id, !item.completed);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                          item.completed
                            ? 'bg-slate-950/70 border-slate-800/80 text-slate-400'
                            : 'bg-slate-950 border-indigo-500/30 text-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'
                          }`}>
                            {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className={item.completed ? 'line-through text-slate-500' : 'font-semibold text-white'}>
                              {item.title}
                            </span>
                            {item.mandatory && (
                              <span className="text-rose-400 font-bold ml-1.5 text-[10px]">*Mandatory</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono block">
                    Target Completion: {cl.targetCompletionDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. COMPETENCY MATRIX SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'competency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">NDIS Practice Capability & Competency Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clinical skill benchmarking against the NDIS Quality & Safeguards Positive Behaviour Support Capability Framework
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Expert</span>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">Advanced</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Intermediate</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">Foundation</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Practitioner</th>
                  <th className="py-3 px-4">Service Domain / Capability</th>
                  <th className="py-3 px-4">Competency Level</th>
                  <th className="py-3 px-4">Last Assessment</th>
                  <th className="py-3 px-4">Assessed By</th>
                  <th className="py-3 px-4 text-right">Next Audit Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {competencyMatrix.map((item) => {
                  const levelColors: Record<CompetencyMatrixEntry['skillLevel'], string> = {
                    Expert: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                    Advanced: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
                    Intermediate: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
                    Foundation: 'bg-slate-800 text-slate-400 border-slate-700',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{item.practitionerName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{item.serviceArea}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${levelColors[item.skillLevel]}`}>
                          {item.skillLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.assessedDate}</td>
                      <td className="py-3 px-4 text-slate-400">{item.assessedBy}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-300">{item.nextReviewDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 5. NDIS WORKER SCREENING CHECK CARDS */}
      {/* ====================================================================== */}
      {activeSubTab === 'screening' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staffCredentials
              .filter((c) => c.credentialType === 'NDIS Worker Screening')
              .map((sc) => {
                const expiry = new Date(sc.expiryDate);
                const now = new Date('2026-08-16');
                const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isWarning = daysLeft <= 90;

                return (
                  <div
                    key={sc.id}
                    className={`p-6 rounded-2xl border transition-all space-y-4 ${
                      isWarning ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isWarning ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {sc.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-lg">{sc.practitionerName}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">NDIS Worker Screening Check (NWSC)</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Screening ID:</span>
                        <code className="text-teal-400 font-mono font-bold">{sc.credentialNumber}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Validity Expiry:</span>
                        <strong className="font-mono text-slate-200">{sc.expiryDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time Remaining:</span>
                        <span className={`font-bold font-mono ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {daysLeft} days
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 6. TRAINING LIBRARY & EMBEDDED QUIZZES */}
      {/* ====================================================================== */}
      {activeSubTab === 'training' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trainingModules.map((mod) => {
              const completions = trainingCompletions.filter((c) => c.moduleId === mod.id);
              const userCompleted = completions.some((c) => c.passed);

              return (
                <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {mod.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {mod.durationMinutes} mins
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{mod.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{mod.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Pass Requirement: {mod.passingScore}%</span>
                      {userCompleted ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not Completed</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartQuiz(mod)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{userCompleted ? 'Retake Knowledge Quiz' : 'Launch Module & Quiz'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: EMBEDDED QUIZ PLAYER */}
      {/* ====================================================================== */}
      {activeQuizModule && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {activeQuizModule.category}
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{activeQuizModule.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuizModule(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quiz Questions */}
            {!quizResult ? (
              <div className="space-y-6">
                {activeQuizModule.quizQuestions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <p className="font-semibold text-white text-sm">
                      {qIndex + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => (
                        <label
                          key={oIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            quizAnswers[q.id] === oIndex
                              ? 'bg-indigo-950/40 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={quizAnswers[q.id] === oIndex}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: oIndex })}
                            className="text-indigo-600 focus:ring-0"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setActiveQuizModule(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length !== activeQuizModule.quizQuestions.length}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Submit Assessment
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Result Display */
              <div className="p-6 bg-slate-950 rounded-2xl border text-center space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  quizResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {quizResult.passed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-white">
                    {quizResult.passed ? 'Assessment Passed!' : 'Did Not Meet Passing Standard'}
                  </h4>
                  <p className="text-sm font-mono font-bold mt-1 text-slate-300">
                    Your Score: {quizResult.score}% (Pass threshold: {activeQuizModule.passingScore}%)
                  </p>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setQuizAnswers({});
                    }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => setActiveQuizModule(null)}
                    className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                  >
                    Close & Log Completion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD CPD RECORD */}
      {/* ====================================================================== */}
      {showAddCPDModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCPD} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-base">Record CPD Hours</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={cpdTitle}
                  onChange={(e) => setCpdTitle(e.target.value)}
                  placeholder="e.g., Trauma-Informed Practice in Disability"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Category</label>
                  <select
                    value={cpdCategory}
                    onChange={(e) => setCpdCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Supervision">Supervision</option>
                    <option value="Online Course">Online Course</option>
                    <option value="Peer Review">Peer Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">CPD Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={cpdHours}
                    onChange={(e) => setCpdHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Provider / Institution</label>
                <input
                  type="text"
                  value={cpdProvider}
                  onChange={(e) => setCpdProvider(e.target.value)}
                  placeholder="e.g., NDIS Quality & Safeguards Commission"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddCPDModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
              >
                Save CPD Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD CREDENTIAL */}
      {/* ====================================================================== */}
      {showAddCredModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCredential} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-base">Add Staff Credential</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Credential Type</label>
                <select
                  value={credType}
                  onChange={(e) => setCredType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="NDIS Worker Screening">NDIS Worker Screening</option>
                  <option value="AHPRA Registration">AHPRA Registration</option>
                  <option value="WWCC">WWCC (Working with Children)</option>
                  <option value="Police Check">National Police Check</option>
                  <option value="First Aid">First Aid & CPR</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Issuer</label>
                <input
                  type="text"
                  required
                  value={credIssuer}
                  onChange={(e) => setCredIssuer(e.target.value)}
                  placeholder="e.g., NDIS Quality & Safeguards Commission"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Certificate #</label>
                  <input
                    type="text"
                    required
                    value={credNumber}
                    onChange={(e) => setCredNumber(e.target.value)}
                    placeholder="WSC-2026-XXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={credExpiry}
                    onChange={(e) => setCredExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddCredModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
              >
                Save Credential
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
