'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Lead } from '@/types';
import {
  UserPlus,
  Plus,
  PhoneCall,
  Mail,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';

export const CRMModule: React.FC = () => {
  const { leads, addLead, updateLeadStage } = useManagementStore();
  const [isAdding, setIsAdding] = useState(false);

  const [prospectName, setProspectName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [planValue, setPlanValue] = useState(25000);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectName) return;

    addLead({
      prospectName,
      contactName: contactName || prospectName,
      contactEmail: contactEmail || 'intake@breakthrough.org.au',
      contactPhone: '0400 123 456',
      stage: 'New Intake',
      source: 'Support Coordinator Referral',
      estimatedPlanValue: Number(planValue),
      notes: 'New referral submitted via NDIS intake portal.',
    });

    setIsAdding(false);
    setProspectName('');
    setContactName('');
    setContactEmail('');
  };

  const STAGES: Lead['stage'][] = [
    'New Intake',
    'Screening & Qualification',
    'Service Agreement Pending',
    'Converted to Client',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Participant Intake & CRM Pipeline</h2>
            <p className="text-xs text-slate-400">
              Track referrals from Support Coordinators, Service Agreement conversions, and onboarding.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Prospect Intake</span>
        </button>
      </div>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage: Lead['stage']) => {
          const stageLeads = leads.filter((l: Lead) => l.stage === stage);
          return (
            <div key={stage} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300">{stage}</span>
                <span className="text-[10px] bg-slate-950 text-teal-400 px-2 py-0.5 rounded font-mono border border-slate-800 font-bold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageLeads.map((lead: Lead) => (
                  <div key={lead.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-white">{lead.prospectName}</div>
                    <p className="text-[11px] text-slate-400">{lead.notes}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 pt-1 border-t border-slate-900">
                      <span>Est. Plan: ${lead.estimatedPlanValue.toLocaleString()}</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <select
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-teal-400 font-bold"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            Move to {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                New Intake Prospect
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Prospect Full Name</label>
                <input
                  type="text"
                  required
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="e.g. Ethan Wright"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Referral / Contact Person</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Support Coordinator Sarah"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@referral.org.au"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Estimated NDIS Budget ($)</label>
                <input
                  type="number"
                  value={planValue}
                  onChange={(e) => setPlanValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
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
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
