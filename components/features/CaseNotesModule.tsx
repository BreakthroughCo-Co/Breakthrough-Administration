'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client, ClientGoal, CaseNote } from '@/types';
import {
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  X
} from 'lucide-react';

export const CaseNotesModule: React.FC = () => {
  const { caseNotes, clients, currentUser, addCaseNote, addBillingClaim, addNotification, addAuditLog } = useManagementStore();
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || 'cli-101');
  const [format, setFormat] = useState<'SIMPL' | 'BIRP'>('SIMPL');
  const [autoGenerateClaim, setAutoGenerateClaim] = useState(true);

  // Form Fields
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [isAiStructuring, setIsAiStructuring] = useState(false);

  const selectedClientObj = clients.find((c: Client) => c.id === selectedClient);

  const handleAiRefineNote = async () => {
    setIsAiStructuring(true);
    try {
      const rawText = `Subjective: ${subjective}\nObjective: ${objective}\nAssessment: ${assessment}\nPlan: ${plan}`;
      const prompt = `Refine and format the following NDIS Allied Health clinical session notes for participant ${selectedClientObj?.name || 'Participant'} into professional, audit-compliant ${format} structure. Ensure non-judgmental, objective, neuroaffirming language. Return JSON with keys: subjective, objective, assessment, plan.

Raw Notes:
${rawText}`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are an NDIS Allied Health Senior Clinical Auditor. Format the clinical note into clear JSON.',
        }),
      });

      const data = await res.json();
      if (data.text) {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.subjective) setSubjective(parsed.subjective);
          if (parsed.objective) setObjective(parsed.objective);
          if (parsed.assessment) setAssessment(parsed.assessment);
          if (parsed.plan) setPlan(parsed.plan);
        }
      }
    } catch (e) {
      console.error('AI Note structuring error:', e);
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientObj) return;

    const noteDate = new Date().toISOString().slice(0, 10);
    const hours = Math.round((Number(sessionDuration) / 60) * 100) / 100;
    const itemCode = '07_002_0115_8_3';
    const unitRate = 214.41;
    const totalAmount = Math.round(hours * unitRate * 100) / 100;

    addCaseNote({
      clientId: selectedClientObj.id,
      clientName: selectedClientObj.name,
      practitionerId: currentUser.practitionerId || 'prac-2',
      practitionerName: currentUser.name,
      date: noteDate,
      sessionDurationMinutes: Number(sessionDuration),
      format,
      subjective: subjective || 'Participant engaged in routine session.',
      objective: objective || 'Observed interactions and task completion.',
      assessment: assessment || 'Progress noted toward primary NDIS goals.',
      plan: plan || 'Maintain weekly clinical sessions.',
      linkedGoalIds: selectedClientObj.goals.map((g: ClientGoal) => g.id),
      status: 'Approved',
      flaggedForReview: false,
    });

    if (autoGenerateClaim) {
      addBillingClaim({
        clientId: selectedClientObj.id,
        clientName: selectedClientObj.name,
        ndisNumber: selectedClientObj.ndisNumber,
        serviceDate: noteDate,
        ndisSupportItem: `${itemCode} - Specialist Behavioural Intervention Support`,
        supportItemCode: itemCode,
        hours: hours,
        unitRate: unitRate,
        totalAmount: totalAmount,
        status: 'Approved',
        invoiceNumber: `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      });

      addNotification({
        title: 'Billing Claim Auto-Generated',
        message: `Claim for $${totalAmount.toFixed(2)} (${hours}h @ $${unitRate}/h) generated from clinical case note for ${selectedClientObj.name}.`,
        type: 'compliance',
        severity: 'medium',
        linkTab: 'billing',
      });
    }

    addAuditLog('CREATE_CASE_NOTE', 'CASE_NOTE', selectedClientObj.id, `Logged ${format} clinical note for ${selectedClientObj.name}`);

    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Clinical Case Notes & Governance</h2>
            <p className="text-xs text-slate-400">
              SIMPL & BIRP formatted Allied Health session recording with AI clinical refinement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiRefineNote}
            disabled={isAiStructuring}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-lg border border-teal-500/30 flex items-center gap-2 transition-all shadow-sm"
          >
            {isAiStructuring ? (
              <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>AI Audit Refine</span>
          </button>
        </div>
      </div>

      {/* Editor & Recent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Note Form */}
        <form onSubmit={handleSaveNote} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Participant</label>
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

            <div>
              <label className="block text-slate-400 mb-1">Framework Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-teal-400 font-bold"
              >
                <option value="SIMPL">SIMPL (Situation, Intervention, Measure, Plan)</option>
                <option value="BIRP">BIRP (Behavior, Intervention, Response, Plan)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {format === 'SIMPL' ? 'Situation / Subjective' : 'Behavior'}
              </label>
              <textarea
                rows={2}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="Participant presentation, arousal levels, or expressed feelings..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Intervention / Objective</label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Clinical strategies applied, environmental adjustments, sensory tools..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {format === 'SIMPL' ? 'Measurement / Assessment' : 'Response'}
              </label>
              <textarea
                rows={2}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Participant engagement, goal progression, behavior metrics..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Next Steps / Plan</label>
              <textarea
                rows={2}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Follow-up training, next session goals, support staff guidance..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerateClaim}
                onChange={(e) => setAutoGenerateClaim(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500"
              />
              <span>Auto-Generate NDIS PRODA Billing Claim</span>
            </label>
            <span className="text-[10px] text-teal-400 font-mono font-bold">$214.41/hr</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sign & Commit Case Note</span>
          </button>
        </form>

        {/* Recent Signed Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            Recent Signed Clinical Trail
          </h3>

          <div className="space-y-3">
            {caseNotes.map((note: CaseNote) => (
              <div key={note.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{note.clientName}</span>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-mono border border-teal-500/20 font-bold">
                    {note.format} • {note.date}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-3">
                  <span className="text-slate-400 font-semibold">Situation:</span> {note.subjective}
                </p>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-900">
                  <span>Practitioner: {note.practitionerName}</span>
                  <span className="text-emerald-400 font-semibold">Audit Status: Approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
