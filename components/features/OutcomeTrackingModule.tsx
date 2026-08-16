'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { GASGoal, GASLevel, OutcomeMeasurement, PlanReviewSummary } from '@/types';
import {
  Target,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  AlertTriangle,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Filter,
  BarChart3,
  UserCheck,
  Zap,
  Info,
  Clock,
  ArrowUpRight,
  Check,
  Sparkles,
  FileText,
  PieChart
} from 'lucide-react';

export const OutcomeTrackingModule: React.FC = () => {
  const {
    planBudgetLines,
    gasGoals,
    outcomeMeasurements,
    planReviewSummaries,
    clients,
    caseNotes,
    bspDocuments,
    billingClaims,
    addGASGoal,
    addGASMeasurement,
    computeGASTScore,
    addOutcomeMeasurement,
    updatePlanBudgetLine,
    generatePlanReviewSummary,
    currentUser,
  } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'budget' | 'gas' | 'timeline' | 'outcomes' | 'wizard' | 'alerts'
  >('budget');

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || 'cli-101');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddMeasurementModal, setShowAddMeasurementModal] = useState<string | null>(null);
  const [newMeasurementLevel, setNewMeasurementLevel] = useState<GASLevel>(0);
  const [newMeasurementNote, setNewMeasurementNote] = useState('');

  // New Goal State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDomain, setNewGoalDomain] = useState('Communication');
  const [newGoalWeight, setNewGoalWeight] = useState(1.0);
  const [newGoalBaseline, setNewGoalBaseline] = useState<GASLevel>(-2);
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('2026-12-31');

  // Plan Review Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [wizardClientId, setWizardClientId] = useState<string>(clients[0]?.id || 'cli-101');
  const [wizardSummary, setWizardSummary] = useState<PlanReviewSummary | null>(null);
  const [wizardCustomRecs, setWizardCustomRecs] = useState<string[]>([]);
  const [newRecInput, setNewRecInput] = useState('');

  // Filtered Data
  const filteredBudgetLines = selectedClientId === 'all'
    ? planBudgetLines
    : planBudgetLines.filter((l) => l.clientId === selectedClientId);

  const filteredGASGoals = selectedClientId === 'all'
    ? gasGoals
    : gasGoals.filter((g) => g.clientId === selectedClientId);

  const filteredOutcomes = selectedClientId === 'all'
    ? outcomeMeasurements
    : outcomeMeasurements.filter((o) => o.clientId === selectedClientId);

  const overallTScore = computeGASTScore(filteredGASGoals);

  // Expiring plans
  const expiringClients = clients.map((c) => {
    const end = new Date(c.planEndDate);
    const now = new Date('2026-08-16');
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { ...c, daysRemaining: diffDays };
  }).filter((c) => c.daysRemaining <= 180).sort((a, b) => a.daysRemaining - b.daysRemaining);

  const handleAddMeasurement = (goalId: string) => {
    if (!newMeasurementNote) return;
    addGASMeasurement(goalId, newMeasurementLevel, newMeasurementNote);
    setShowAddMeasurementModal(null);
    setNewMeasurementNote('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle) return;
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    addGASGoal({
      clientId: client.id,
      clientName: client.name,
      goalTitle: newGoalTitle,
      domain: newGoalDomain,
      expectedLevel: 0,
      baselineLevel: newGoalBaseline,
      currentLevel: newGoalBaseline,
      weight: Number(newGoalWeight),
      measurements: [
        {
          id: `gm-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          level: newGoalBaseline,
          note: 'Initial baseline assessment',
          measuredBy: currentUser.name,
        },
      ],
      startDate: new Date().toISOString().slice(0, 10),
      targetDate: newGoalTargetDate,
      status: 'Active',
    });
    setShowAddGoalModal(false);
    setNewGoalTitle('');
  };

  const handleStartWizard = () => {
    const summary = generatePlanReviewSummary(wizardClientId);
    setWizardSummary(summary);
    setWizardCustomRecs(summary.recommendations);
    setWizardStep(2);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg text-white">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  Participant Outcome Tracking & NDIS Plan Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  R1 Capability
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                NDIS Plan budget utilization, Goal Attainment Scaling (GAS T-Score: {overallTScore}), Vineland-3/ABAS outcomes, and PACE Review Engine
              </p>
            </div>
          </div>

          {/* Participant Filter Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Participants (Aggregate)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.ndisNumber})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New GAS Goal</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-800/80 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'budget', label: 'Plan Budget Tracker', icon: DollarSign },
            { id: 'gas', label: 'GAS Goals & T-Scores', icon: Award, count: filteredGASGoals.length },
            { id: 'timeline', label: 'Progress Trajectory', icon: TrendingUp },
            { id: 'outcomes', label: 'Standardised Measures', icon: BarChart3, count: filteredOutcomes.length },
            { id: 'wizard', label: 'Plan Review Wizard', icon: Sparkles },
            { id: 'alerts', label: 'Plan Expiry Alerts', icon: AlertTriangle, count: expiringClients.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    active ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-800 text-slate-400'
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
      {/* 1. PLAN BUDGET TRACKER SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'budget' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Total Allocated Funding</span>
                <DollarSign className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-2xl font-extrabold text-white mt-2">
                ${filteredBudgetLines.reduce((acc, l) => acc + l.allocated, 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Across {filteredBudgetLines.length} support categories</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Delivered & Claimed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-400 mt-2">
                ${filteredBudgetLines.reduce((acc, l) => acc + l.spent, 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {Math.round((filteredBudgetLines.reduce((acc, l) => acc + l.spent, 0) / Math.max(filteredBudgetLines.reduce((acc, l) => acc + l.allocated, 0), 1)) * 100)}% overall utilization
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Remaining Plan Balance</span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-extrabold text-sky-400 mt-2">
                ${(filteredBudgetLines.reduce((acc, l) => acc + l.allocated, 0) - filteredBudgetLines.reduce((acc, l) => acc + l.spent, 0)).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Available for future sessions</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Categories &gt;85% Utilized</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-amber-400 mt-2">
                {filteredBudgetLines.filter((l) => l.utilizationPercent >= 85).length}
              </p>
              <span className="text-[11px] text-amber-400/80 mt-1 block">Review plan pacing</span>
            </div>
          </div>

          {/* Budget Line-Items Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white text-sm">NDIS Support Category Utilization</h3>
              </div>
              <span className="text-xs text-slate-400">PACE Support Items</span>
            </div>

            <div className="divide-y divide-slate-800/60 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Support Category & Code</th>
                    <th className="py-3 px-4 text-right">Allocated</th>
                    <th className="py-3 px-4 text-right">Spent</th>
                    <th className="py-3 px-4 text-right">Remaining</th>
                    <th className="py-3 px-4 w-48">Utilization Pacing</th>
                    <th className="py-3 px-4">Plan Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {filteredBudgetLines.map((line) => {
                    const remaining = line.allocated - line.spent;
                    const percent = line.utilizationPercent;
                    const isHigh = percent >= 90;
                    const isMedium = percent >= 75 && percent < 90;

                    return (
                      <tr key={line.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          {line.clientName}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-200">{line.supportCategory}</p>
                          <code className="text-[10px] text-teal-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">
                            {line.supportItemCode}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                          ${line.allocated.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                          ${line.spent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-sky-400">
                          ${remaining.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className={isHigh ? 'text-rose-400 font-bold' : isMedium ? 'text-amber-400' : 'text-emerald-400'}>
                                {percent}%
                              </span>
                              <span className="text-slate-500">Target: 70%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-400' : 'bg-teal-500'
                                }`}
                                style={{ width: `${Math.min(100, percent)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                          {line.planStartDate} → {line.planEndDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. GAS GOALS & T-SCORES SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'gas' && (
        <div className="space-y-6">
          {/* T-Score Mathematical Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm">Goal Attainment Scaling (GAS) Standardised Formula</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Calculated using Kiresuk & Sherman (1968) formula: <code className="bg-slate-950 px-2 py-0.5 rounded text-teal-300 font-mono">T = 50 + (10 * ∑wᵢxᵢ) / √( (1-ρ)∑wᵢ² + ρ(∑wᵢ)² )</code> where ρ=0.3
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-xl border border-indigo-500/30">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Composite T-Score</span>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                    {overallTScore}
                  </p>
                </div>
                <div className="text-xs text-slate-400 border-l border-slate-800 pl-4 space-y-0.5">
                  <p className="text-emerald-400 font-bold">&gt;50: Exceeding Expected</p>
                  <p className="text-teal-400 font-bold">50: Met Expected Target</p>
                  <p className="text-amber-400">&lt;50: Approaching Target</p>
                </div>
              </div>
            </div>
          </div>

          {/* Goal Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGASGoals.map((goal) => {
              const levelColors: Record<GASLevel, { bg: string; text: string; label: string }> = {
                [-2]: { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30', text: 'text-rose-400', label: 'Much Less than Expected (-2)' },
                [-1]: { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', text: 'text-amber-400', label: 'Somewhat Less than Expected (-1)' },
                [0]: { bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30', text: 'text-teal-400', label: 'Expected Outcome Achieved (0)' },
                [1]: { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400', label: 'Somewhat More than Expected (+1)' },
                [2]: { bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', text: 'text-indigo-400', label: 'Much More than Expected (+2)' },
              };

              const currentConfig = levelColors[goal.currentLevel];

              return (
                <div key={goal.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                            {goal.domain}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Weight: {goal.weight}x</span>
                        </div>
                        <h4 className="font-bold text-white text-base mt-1.5 leading-snug">{goal.goalTitle}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Participant: <strong className="text-slate-200">{goal.clientName}</strong></p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-bold block">T-Score</span>
                        <span className="text-xl font-black text-teal-400 font-mono">{goal.tScore}</span>
                      </div>
                    </div>

                    {/* Scale Level Badges */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Current Status:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentConfig.bg}`}>
                          Level {goal.currentLevel > 0 ? `+${goal.currentLevel}` : goal.currentLevel}: {currentConfig.label}
                        </span>
                      </div>
                      {/* Step Indicator */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {([-2, -1, 0, 1, 2] as GASLevel[]).map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-2 rounded-full transition-all ${
                              lvl === goal.currentLevel
                                ? lvl >= 0 ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                                : lvl < goal.currentLevel
                                ? 'bg-slate-700'
                                : 'bg-slate-800/60'
                            }`}
                            title={`Level ${lvl}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Measurement Timeline Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Recent Clinical Measurements ({goal.measurements.length})
                      </span>
                      <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                        {goal.measurements.map((m) => (
                          <div key={m.id} className="text-xs bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-teal-400 font-bold mr-2">{m.date}</span>
                              <span className="text-slate-300">{m.note}</span>
                            </div>
                            <span className="text-[10px] font-bold font-mono text-slate-400 shrink-0">
                              Lvl {m.level > 0 ? `+${m.level}` : m.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Target Date: {goal.targetDate}</span>
                    <button
                      onClick={() => setShowAddMeasurementModal(goal.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-teal-400" />
                      <span>Record Measurement</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. PROGRESS TRAJECTORY TIMELINE SUB-TAB (SVG Line Chart) */}
      {/* ====================================================================== */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Longitudinal GAS Level Trajectory</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual mapping of GAS scale measurements (-2 baseline to +2 exceeding target) over treatment duration
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-slate-300">Measured Value</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-emerald-400" />
                  <span className="text-slate-300">Expected Target (0)</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Graph Container */}
            <div className="space-y-8">
              {filteredGASGoals.map((goal) => {
                const points = goal.measurements;
                const width = 700;
                const height = 180;
                const padding = 40;

                const getY = (level: number) => {
                  const normalized = (level + 2) / 4;
                  return height - padding - normalized * (height - 2 * padding);
                };

                const getX = (idx: number, total: number) => {
                  if (total === 1) return width / 2;
                  return padding + (idx / (total - 1)) * (width - 2 * padding);
                };

                const polylinePoints = points
                  .map((p, idx) => `${getX(idx, points.length)},${getY(p.level)}`)
                  .join(' ');

                return (
                  <div key={goal.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white text-sm">{goal.goalTitle}</strong>
                        <span className="text-slate-400 ml-2">({goal.clientName} • {goal.domain})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Current: Level {goal.currentLevel > 0 ? `+${goal.currentLevel}` : goal.currentLevel}
                      </span>
                    </div>

                    <div className="relative overflow-x-auto">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
                        {/* Grid lines for each GAS level */}
                        {[-2, -1, 0, 1, 2].map((lvl) => {
                          const y = getY(lvl);
                          return (
                            <g key={lvl}>
                              <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke={lvl === 0 ? '#10b981' : '#334155'}
                                strokeWidth={lvl === 0 ? '1.5' : '1'}
                                strokeDasharray={lvl === 0 ? '4 2' : undefined}
                              />
                              <text
                                x={padding - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="text-[10px] fill-slate-500 font-mono"
                              >
                                {lvl > 0 ? `+${lvl}` : lvl}
                              </text>
                            </g>
                          );
                        })}

                        {/* Trend Line */}
                        {points.length > 1 && (
                          <polyline
                            fill="none"
                            stroke="#14b8a6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={polylinePoints}
                          />
                        )}

                        {/* Measurement Plot Points */}
                        {points.map((p, idx) => {
                          const cx = getX(idx, points.length);
                          const cy = getY(p.level);
                          return (
                            <g key={p.id}>
                              <circle
                                cx={cx}
                                cy={cy}
                                r="6"
                                className="fill-teal-400 stroke-slate-950 stroke-2"
                              />
                              <text
                                x={cx}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-[9px] fill-slate-400 font-mono"
                              >
                                {p.date}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. STANDARDISED OUTCOME MEASUREMENTS SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'outcomes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOutcomes.map((item) => {
              const baselinePct = Math.round((item.baselineValue / item.maxValue) * 100);
              const currentPct = Math.round((item.currentValue / item.maxValue) * 100);
              const improvement = item.currentValue - item.baselineValue;

              return (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.domain}
                      </span>
                      <h4 className="font-bold text-white text-base mt-1.5">{item.instrument}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.clientName} • Assessed by {item.assessedBy}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.trend === 'Improving' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.trend}
                    </span>
                  </div>

                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                    {/* Baseline Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Baseline Score</span>
                        <span className="text-slate-300 font-mono">{item.baselineValue} / {item.maxValue} ({baselinePct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 rounded-full" style={{ width: `${baselinePct}%` }} />
                      </div>
                    </div>

                    {/* Current Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-teal-400 font-bold">Current Assessment</span>
                        <span className="text-emerald-400 font-mono font-bold">{item.currentValue} / {item.maxValue} ({currentPct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all" style={{ width: `${currentPct}%` }} />
                      </div>
                    </div>

                    {/* Delta indicator */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Delta Improvement</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{improvement} standard points ({currentPct - baselinePct}% gain)
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono block">Date: {item.measurementDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 5. PLAN REVIEW WIZARD SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'wizard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">NDIS Plan Review Compilation Engine</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated synthesis of clinical evidence, billing expenditure, GAS scores, and BSP compliance for PACE reassessments
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    wizardStep === step
                      ? 'bg-teal-500 text-white ring-4 ring-teal-500/20'
                      : wizardStep > step
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {wizardStep > step ? <Check className="w-3.5 h-3.5" /> : step}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: Participant Select */}
          {wizardStep === 1 && (
            <div className="space-y-4 max-w-lg py-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Participant for Plan Review
              </label>
              <select
                value={wizardClientId}
                onChange={(e) => setWizardClientId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-teal-500 focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — NDIS: {c.ndisNumber} (Plan ends: {c.planEndDate})
                  </option>
                ))}
              </select>

              <button
                onClick={handleStartWizard}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer mt-4"
              >
                <span>Compile Evidence & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Auto-Compiled Evidence */}
          {wizardStep === 2 && wizardSummary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Participant Overview</span>
                  <p className="text-lg font-extrabold text-white mt-1">{wizardSummary.clientName}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{wizardSummary.planPeriod}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Billed Expenditure</span>
                  <p className="text-lg font-extrabold text-emerald-400 mt-1">${wizardSummary.billingTotal.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{wizardSummary.caseNoteSummary.totalNotes} Clinical Sessions Logged</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">BSP Quality Status</span>
                  <p className="text-lg font-extrabold text-teal-400 mt-1">{wizardSummary.bspComplianceStatus}</p>
                  <p className="text-xs text-slate-400">{wizardSummary.incidentSummary.totalIncidents} Total Incidents Tracked</p>
                </div>
              </div>

              {/* Goal Progress Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Compiled Goal Outcomes</h4>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                  {wizardSummary.goalProgress.map((g, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white">{g.goalTitle}</strong>
                        <span className="text-slate-400 ml-2 font-mono">Baseline: Lvl {g.baseline} → Current: Lvl {g.current}</span>
                      </div>
                      <span className="font-mono font-bold text-teal-400">T-Score: {g.tScore}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setWizardStep(3)}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  <span>Review Clinical Recommendations</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Edit Recommendations */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Practitioner Recommendations for Next Plan</h4>
              <div className="space-y-2">
                {wizardCustomRecs.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="flex-1">{rec}</span>
                    <button
                      onClick={() => setWizardCustomRecs(wizardCustomRecs.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 text-xs font-bold px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newRecInput}
                  onChange={(e) => setNewRecInput(e.target.value)}
                  placeholder="Add customized clinical recommendation..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={() => {
                    if (newRecInput) {
                      setWizardCustomRecs([...wizardCustomRecs, newRecInput]);
                      setNewRecInput('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 text-teal-300 hover:bg-slate-700 text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setWizardStep(4)}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  <span>Generate Final Report</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Final Summary Report Display */}
          {wizardStep === 4 && wizardSummary && (
            <div className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-teal-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">NDIS Participant Plan Review Summary Report</h4>
                    <p className="text-xs text-slate-400">Generated on {wizardSummary.reviewDate} by {wizardSummary.generatedBy}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
                  Ready for NDIA Submission
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Participant</span>
                  <p className="font-bold text-white mt-0.5">{wizardSummary.clientName}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Plan Period</span>
                  <p className="font-bold text-white mt-0.5">{wizardSummary.planPeriod}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Total Expenditure</span>
                  <p className="font-bold text-emerald-400 mt-0.5">${wizardSummary.billingTotal.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Clinical Sessions</span>
                  <p className="font-bold text-teal-400 mt-0.5">{wizardSummary.caseNoteSummary.totalNotes} Delivered</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase">Recommendations</h5>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {wizardCustomRecs.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setWizardStep(1)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
              >
                Start Another Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* 6. PLAN EXPIRY ALERTS SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {expiringClients.map((client) => {
              const isUrgent = client.daysRemaining <= 60;
              return (
                <div
                  key={client.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isUrgent
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-900/20'
                      : 'bg-slate-900 border-slate-800 shadow-md'
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{client.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">NDIS: {client.ndisNumber}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isUrgent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {client.daysRemaining} days left
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Plan End Date:</span>
                      <strong className="font-mono text-slate-200">{client.planEndDate}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Allocated Budget:</span>
                      <strong className="font-mono text-emerald-400">${client.allocatedBudget?.toLocaleString()}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setWizardClientId(client.id);
                      setActiveSubTab('wizard');
                    }}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Plan Review Wizard</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD GAS MEASUREMENT */}
      {/* ====================================================================== */}
      {showAddMeasurementModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-base">Record GAS Goal Measurement</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Attainment Level</label>
                <select
                  value={newMeasurementLevel}
                  onChange={(e) => setNewMeasurementLevel(Number(e.target.value) as GASLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value={-2}>-2: Much Less than Expected</option>
                  <option value={-1}>-1: Somewhat Less than Expected</option>
                  <option value={0}>0: Expected Outcome Achieved</option>
                  <option value={1}>+1: Somewhat More than Expected</option>
                  <option value={2}>+2: Much More than Expected</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Clinical Observation Notes</label>
                <textarea
                  value={newMeasurementNote}
                  onChange={(e) => setNewMeasurementNote(e.target.value)}
                  placeholder="Document specific behavioral observations and prompt levels..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowAddMeasurementModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddMeasurement(showAddMeasurementModal)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
              >
                Save Measurement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: CREATE NEW GAS GOAL */}
      {/* ====================================================================== */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateGoal} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-base">Define New GAS Goal</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Goal Statement</label>
                <input
                  type="text"
                  required
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g., Independently initiate AAC device to request items during transitions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Domain</label>
                  <select
                    value={newGoalDomain}
                    onChange={(e) => setNewGoalDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Communication">Communication</option>
                    <option value="Self-Regulation">Self-Regulation</option>
                    <option value="Daily Living">Daily Living</option>
                    <option value="Community Participation">Community Participation</option>
                    <option value="Behaviour Reduction">Behaviour Reduction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Goal Weight (Importance)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="2.0"
                    value={newGoalWeight}
                    onChange={(e) => setNewGoalWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Baseline Starting Level</label>
                  <select
                    value={newGoalBaseline}
                    onChange={(e) => setNewGoalBaseline(Number(e.target.value) as GASLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value={-2}>-2: Much Less than Expected</option>
                    <option value={-1}>-1: Somewhat Less than Expected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Target Achievement Date</label>
                  <input
                    type="date"
                    value={newGoalTargetDate}
                    onChange={(e) => setNewGoalTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
              >
                Create GAS Goal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
