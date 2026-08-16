'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import {
  TaskAssignment,
  AutomationRule,
  WorkflowTemplate,
  BatchAction,
  WorkloadPrediction,
} from '@/types';
import {
  Zap,
  Sliders,
  Layers,
  BarChart3,
  Bot,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  CheckSquare,
  Square,
  FileText,
  DollarSign
} from 'lucide-react';

export const WorkflowAutomationModule: React.FC = () => {
  const {
    taskAssignments,
    automationRules,
    workflowTemplates,
    batchActions,
    workloadPredictions,
    practitioners,
    referrals,
    billingClaims,
    caseNotes,
    addTaskAssignment,
    updateTaskStatus,
    executeBatchAction,
    toggleAutomationRule,
    smartAssignTask,
    currentUser,
  } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'tasks' | 'rules' | 'templates' | 'balancer' | 'routing' | 'batch'
  >('tasks');

  // New Smart Task Assignment Modal State
  const [showSmartAssignModal, setShowSmartAssignModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState('Functional Behaviour Assessment');
  const [sourceModule, setSourceModule] = useState('referral-intake');
  const [sourceEntityId, setSourceEntityId] = useState('ref-1');
  const [latestAssignedResult, setLatestAssignedResult] = useState<TaskAssignment | null>(null);

  // Batch Action State
  const [batchTab, setBatchTab] = useState<'billing' | 'notes'>('billing');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmBatchModal, setShowConfirmBatchModal] = useState(false);

  const handleExecuteSmartAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    const result = smartAssignTask(taskTitle, taskType, sourceModule, sourceEntityId);
    setLatestAssignedResult(result);
    setTaskTitle('');
  };

  const handleToggleSelectAll = () => {
    if (batchTab === 'billing') {
      if (selectedIds.length === billingClaims.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(billingClaims.map((c) => c.id));
      }
    } else {
      if (selectedIds.length === caseNotes.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(caseNotes.map((n) => n.id));
      }
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirmBatch = () => {
    if (selectedIds.length === 0) return;
    executeBatchAction({
      actionType: batchTab === 'billing' ? 'bulk_approve' : 'bulk_update_status',
      targetModule: batchTab === 'billing' ? 'billing' : 'case-notes',
      targetIds: selectedIds,
      executedBy: currentUser.id,
      executedByName: currentUser.name,
      details: `Bulk approved ${selectedIds.length} ${batchTab === 'billing' ? 'claims' : 'notes'}`,
    });
    setSelectedIds([]);
    setShowConfirmBatchModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl shadow-lg text-white">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  AI-Powered Workflow Automation Engine
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  R6 Capability
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Intelligent task matching algorithms, conditional automation pipelines, practitioner workload balancing, and bulk transaction processing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowSmartAssignModal(true);
                setLatestAssignedResult(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Task Assignment</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-800/80 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'tasks', label: 'Smart Task Queue', icon: Zap, count: taskAssignments.length },
            { id: 'rules', label: 'Automation Rules', icon: Sliders, count: automationRules.length },
            { id: 'templates', label: 'Workflow Pipelines', icon: Layers, count: workflowTemplates.length },
            { id: 'balancer', label: 'Workload Balancer', icon: BarChart3 },
            { id: 'routing', label: 'Referral Auto-Router', icon: UserCheck },
            { id: 'batch', label: 'Bulk Batch Operations', icon: CheckSquare },
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
      {/* 1. SMART TASK ASSIGNMENT QUEUE SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskAssignments.map((task) => {
              const isCompleted = task.status === 'Completed';

              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-slate-900/60 border-slate-800/80'
                      : 'bg-slate-900 border-slate-800 shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {task.taskType}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{task.taskTitle}</h4>
                    <p className="text-xs text-slate-400">
                      Assigned To: <strong className="text-slate-200">{task.assignedToPractitionerName}</strong>
                    </p>
                  </div>

                  {/* Matching Criteria Breakdown */}
                  {task.matchCriteria && (
                    <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">AI Match Fit</span>
                        <strong className="text-teal-400 font-mono font-black text-sm">{task.matchScore}%</strong>
                      </div>
                      {task.matchCriteria.map((crit, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-400">
                          <span>{crit.criterion}</span>
                          <span className="font-mono text-slate-300">{crit.score}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-500">Due: {task.dueDate}</span>
                    {!isCompleted ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'Completed')}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
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
      {/* 2. AUTOMATION RULES ENGINE SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'rules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  rule.enabled
                    ? 'bg-slate-900 border-slate-800 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-base">{rule.name}</h4>
                    <span className="text-xs text-teal-400 font-mono">Trigger: {rule.triggerEvent}</span>
                  </div>
                  <button
                    onClick={() => toggleAutomationRule(rule.id)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-7 h-7 text-teal-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* Condition Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Execution Rule Logic</span>
                  <div className="font-mono text-slate-300 text-[11px] bg-slate-900 p-2 rounded border border-slate-800/80">
                    IF {rule.conditions.map((c) => `${c.field} ${c.operator} "${c.value}"`).join(' AND ')}
                  </div>
                  <p className="text-slate-400 leading-snug">
                    <strong className="text-teal-300">THEN:</strong> {rule.action.details}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>Fired: {rule.triggerCount} times</span>
                  <span>Last: {rule.lastTriggered?.slice(0, 10) || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 3. WORKFLOW PIPELINE TEMPLATES SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          {workflowTemplates.map((template) => (
            <div key={template.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {template.category}
                  </span>
                  <h3 className="font-extrabold text-white text-base mt-1">{template.name}</h3>
                  <p className="text-xs text-slate-400">{template.description}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold font-mono">
                  {template.stages.length} Stages Configured
                </span>
              </div>

              {/* Horizontal Pipeline Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {template.stages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono">
                        <span>Step {idx + 1}</span>
                        <span>{stage.estimatedDurationDays}d</span>
                      </div>
                      <strong className="text-white text-xs block mt-1 leading-snug">{stage.name}</strong>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                      <span className="text-teal-400 font-bold font-mono">{stage.assignedRole}</span>
                      {stage.autoTransition && (
                        <span className="text-indigo-400 font-bold" title="Auto-Transitions upon condition">
                          Auto ⚡
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================== */}
      {/* 4. WORKLOAD BALANCER SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'balancer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workloadPredictions.map((wp) => {
              const isOver = wp.recommendation === 'At Capacity' || wp.recommendation === 'Overloaded';
              const isUnder = wp.recommendation === 'Under-utilized';

              return (
                <div key={wp.practitionerId} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{wp.practitionerName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOver
                          ? 'bg-rose-500/20 text-rose-300'
                          : isUnder
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {wp.recommendation}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-2xl font-black text-white">{wp.currentCaseload}</span>
                      <span className="text-xs text-slate-500"> / {wp.maxCaseload}</span>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Load: {wp.utilizationPercent}%</span>
                      <span className="font-mono text-slate-400">Predicted Next Wk: {wp.predictedNextWeek}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver ? 'bg-rose-500' : isUnder ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${wp.utilizationPercent}%` }}
                      />
                    </div>
                  </div>

                  {wp.suggestedReallocation && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="text-[10px] text-teal-400 font-bold uppercase block">Smart Suggestion</span>
                      <p className="leading-snug">{wp.suggestedReallocation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 5. REFERRAL AUTO-ROUTING DEMONSTRATION SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'routing' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base">Algorithmic Referral-to-Practitioner Routing</h3>
            <p className="text-xs text-slate-400">
              Evaluates specialty alignment (40%), current caseload availability (35%), and schedule proximity (25%)
            </p>

            <div className="space-y-4 pt-2">
              {referrals.slice(0, 3).map((ref) => (
                <div key={ref.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-white text-sm">{ref.participantName}</strong>
                      <span className="text-xs text-slate-400 ml-2">({ref.primaryDisability})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Priority Score: {ref.priorityScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {practitioners.map((prac) => {
                      const caseloadFit = Math.max(0, 100 - ((prac.activeCaseloadCount / prac.caseloadLimit) * 100));
                      const score = Math.round(90 * 0.4 + caseloadFit * 0.35 + 85 * 0.25);

                      return (
                        <div key={prac.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">{prac.name}</strong>
                            <span className="text-teal-400 font-mono font-bold">{score}% Match</span>
                          </div>
                          <p className="text-[10px] text-slate-500">Caseload: {prac.activeCaseloadCount}/{prac.caseloadLimit}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 6. BULK BATCH OPERATIONS SUB-TAB */}
      {/* ====================================================================== */}
      {activeSubTab === 'batch' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBatchTab('billing');
                    setSelectedIds([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    batchTab === 'billing' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Billing Claims ({billingClaims.length})
                </button>
                <button
                  onClick={() => {
                    setBatchTab('notes');
                    setSelectedIds([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    batchTab === 'notes' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Clinical Case Notes ({caseNotes.length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {selectedIds.length} Selected
                </span>
                <button
                  onClick={() => setShowConfirmBatchModal(true)}
                  disabled={selectedIds.length === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Execute Bulk Approval ({selectedIds.length})
                </button>
              </div>
            </div>

            {/* Selection Table */}
            <div className="divide-y divide-slate-800/60 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <button onClick={handleToggleSelectAll} className="text-slate-400 hover:text-white">
                        {selectedIds.length > 0 ? <CheckSquare className="w-4 h-4 text-teal-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Item Code / Service</th>
                    <th className="py-3 px-4">Practitioner</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-right">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {batchTab === 'billing'
                    ? billingClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(claim.id)}
                              onChange={() => handleToggleSelectOne(claim.id)}
                              className="accent-teal-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{claim.clientName}</td>
                          <td className="py-3 px-4 font-mono text-teal-400">{claim.supportItemCode}</td>
                          <td className="py-3 px-4 text-slate-300">{claim.practitionerName}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                            ${claim.totalAmount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              {claim.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    : caseNotes.map((note) => (
                        <tr key={note.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(note.id)}
                              onChange={() => handleToggleSelectOne(note.id)}
                              className="accent-teal-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{note.clientName}</td>
                          <td className="py-3 px-4 text-slate-300 truncate max-w-xs">{note.summary}</td>
                          <td className="py-3 px-4 text-slate-300">{note.practitionerName}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-400">{note.date}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              {note.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Past Batch History */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Recent Batch Audit History</h4>
              <div className="space-y-1">
                {batchActions.map((ba) => (
                  <div key={ba.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <strong className="text-white">{ba.details}</strong>
                      <span className="text-slate-500 text-[10px] ml-2 font-mono">{ba.executedAt}</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">Success</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: SMART TASK ASSIGNMENT */}
      {/* ====================================================================== */}
      {showSmartAssignModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-base">Execute Smart Task AI Assignment</h3>

            {!latestAssignedResult ? (
              <form onSubmit={handleExecuteSmartAssign} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g., FBA Behaviour Assessment"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Task Type</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Functional Behaviour Assessment">FBA Assessment</option>
                      <option value="Crisis Intervention">Crisis Intervention</option>
                      <option value="BSP Review">BSP Review</option>
                      <option value="AAC Implementation">AAC Implementation</option>
                      <option value="Compliance">Compliance Reporting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold uppercase mb-1">Source Module</label>
                    <select
                      value={sourceModule}
                      onChange={(e) => setSourceModule(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="referral-intake">Referral Intake</option>
                      <option value="incidents">Incidents</option>
                      <option value="bsp-plans">BSP Plans</option>
                      <option value="staff-training">Staff Training</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSmartAssignModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Run AI Matching & Assign
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-teal-500/40 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Task Successfully Assigned</span>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400">Assigned To: <strong className="text-white text-sm">{latestAssignedResult.assignedToPractitionerName}</strong></p>
                  <p className="text-slate-400">AI Match Fit Score: <strong className="text-teal-400 font-mono text-sm">{latestAssignedResult.matchScore}%</strong></p>
                </div>

                <button
                  onClick={() => setShowSmartAssignModal(false)}
                  className="w-full py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
                >
                  Close & View in Queue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: CONFIRM BATCH EXECUTION */}
      {/* ====================================================================== */}
      {showConfirmBatchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-base">Confirm Bulk Action</h3>
            <p className="text-xs text-slate-300">
              You are about to execute a bulk approval on <strong className="text-teal-400">{selectedIds.length} records</strong>. This action will update their statuses and create an audit ledger entry.
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowConfirmBatchModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBatch}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
