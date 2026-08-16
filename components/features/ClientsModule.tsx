'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client } from '@/types';
import { GoalTracker } from '@/components/GoalTracker';
import { ClientPortalModal } from './ClientPortalModal';
import { BrainCircuit, Share2, MapPin, Video } from 'lucide-react';
import {
  Users,
  Search,
  Plus,
  Shield,
  Calendar,
  DollarSign,
  AlertCircle,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const ClientsModule: React.FC = () => {
  const { clients, addClient, setActiveTab } = useManagementStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isJustificationModalOpen, setIsJustificationModalOpen] = useState(false);
  const [isGeneratingJustification, setIsGeneratingJustification] = useState(false);
  const [justificationReportText, setJustificationReportText] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!selectedClient) return;
    setIsGeneratingSummary(true);
    setAiSummary(null);
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate a concise, NDIS-compliant clinical progress summary for participant ${selectedClient.name} (NDIS: ${selectedClient.ndisNumber}, Disability: ${selectedClient.primaryDisability}). Synthesize hypothetical recent case notes and behavior reports into a 3-paragraph summary covering: 1. Current Status 2. Progress towards goals 3. Recommendations.`,
        }),
      });
      const data = await response.json();
      setAiSummary(data.text);
    } catch (err) {
      console.error(err);
      setAiSummary("Failed to generate AI Summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateJustificationReport = async () => {
    if (!selectedClient) return;
    setIsGeneratingJustification(true);
    setIsJustificationModalOpen(true);
    setJustificationReportText(null);
    try {
      const prompt = `You are a Senior Behaviour Support Practitioner preparing an official NDIS Plan Review Funding & Outcome Justification Report for the National Disability Insurance Agency (NDIA).

Participant Details:
- Name: ${selectedClient.name}
- NDIS Number: ${selectedClient.ndisNumber}
- Primary Disability: ${selectedClient.primaryDisability}
- Plan Period: ${selectedClient.planStartDate} to ${selectedClient.planEndDate}
- Total Allocated Budget: $${selectedClient.totalBudget} | Spent: $${selectedClient.spentBudget || 8450}

Key Directives:
1. Provide an Executive Clinical Justification for Continuing Capacity Building (Improved Relationships - Behaviour Support).
2. Report on Goal Attainment Scaling (GAS) outcomes achieved over the past 12 months.
3. Detail evidence of Restrictive Practice reduction / fading.
4. Provide a concrete, itemised Recommended Funding Request for Year 2 (Item 07_002_0115_8_3 Specialist Behavioural Intervention Support @ $214.41/hr).
5. Ensure professional, evidence-based, neuroaffirming language compliant with NDIA Operational Guidelines.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setJustificationReportText(data.text || 'Unable to generate justification report.');
    } catch (err) {
      console.error(err);
      setJustificationReportText('Failed to generate NDIS Plan Review Justification Report.');
    } finally {
      setIsGeneratingJustification(false);
    }
  };
  const [isAddingClient, setIsAddingClient] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    ndisNumber: '',
    dateOfBirth: '',
    primaryDisability: '',
    totalBudget: 35000,
    primaryPractitionerName: 'Marcus Vance',
    primaryPractitionerId: 'prac-2',
    riskLevel: 'Medium' as Client['riskLevel'],
    emergencyName: '',
    emergencyPhone: '',
    emergencyRel: '',
  });

  const filteredClients = clients.filter(
    (c: Client) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ndisNumber.includes(searchTerm) ||
      c.primaryDisability.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.ndisNumber) return;

    addClient({
      name: newClient.name,
      ndisNumber: newClient.ndisNumber,
      dateOfBirth: newClient.dateOfBirth || '2000-01-01',
      status: 'Active',
      primaryDisability: newClient.primaryDisability || 'Autism Spectrum Disorder',
      secondaryDisabilities: [],
      goals: [
        {
          id: 'g-new-1',
          title: 'Develop emotion regulation strategies in high-arousal environments',
          category: 'Capacity Building',
          targetDate: '2026-12-31',
          progressPercent: 20,
          status: 'In Progress',
        },
      ],
      planStartDate: new Date().toISOString().slice(0, 10),
      planEndDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      totalBudget: Number(newClient.totalBudget),
      allocatedBudget: Number(newClient.totalBudget) * 0.8,
      spentBudget: 0,
      primaryPractitionerId: newClient.primaryPractitionerId,
      primaryPractitionerName: newClient.primaryPractitionerName,
      riskLevel: newClient.riskLevel,
      emergencyContact: {
        name: newClient.emergencyName || 'Primary Carer',
        relationship: newClient.emergencyRel || 'Family',
        phone: newClient.emergencyPhone || '0400 000 000',
      },
      restrictivePracticesActive: false,
    });

    setIsAddingClient(false);
    setNewClient({
      name: '',
      ndisNumber: '',
      dateOfBirth: '',
      primaryDisability: '',
      totalBudget: 35000,
      primaryPractitionerName: 'Marcus Vance',
      primaryPractitionerId: 'prac-2',
      riskLevel: 'Medium',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRel: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">NDIS Participants & Profiles</h2>
            <p className="text-xs text-slate-400">
              Manage participant records, NDIS plans, goals, and capacity building allocations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingClient(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Participant</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participant List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, NDIS #, or disability..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            {filteredClients.map((client: Client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{client.name}</span>
                    <span className="text-[10px] bg-slate-950 text-teal-400 font-mono px-1.5 py-0.5 rounded border border-slate-800">
                      #{client.ndisNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{client.primaryDisability}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Participant Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{selectedClient.name}</h3>
                      <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-mono border border-teal-500/20 font-bold">
                        NDIS #{selectedClient.ndisNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Primary Practitioner: <span className="text-slate-200 font-semibold">{selectedClient.primaryPractitionerName}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveTab('google-maps')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm border border-slate-700"
                      title="View participant location, travel route, and calculate NDIS MMM travel claim on Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span>Google Maps Routing</span>
                    </button>
                    <button
                      onClick={() => setIsClientPortalOpen(true)}
                      className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-sm border border-teal-400/30"
                      title="Open secure Client Portal to share NDIS goals & progress with family / coordinators"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Client Portal</span>
                    </button>
                    <button
                      onClick={handleGenerateJustificationReport}
                      disabled={isGeneratingJustification}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                      title="Generate 1-Click NDIA Plan Review Funding Justification Document"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Plan Review Justification</span>
                    </button>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-bold text-xs rounded-lg flex items-center gap-2 border border-indigo-500/20 transition-all shadow-sm disabled:opacity-50"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      {isGeneratingSummary ? 'Generating...' : 'AI Clinical Summary'}
                    </button>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      selectedClient.riskLevel === 'Critical' || selectedClient.riskLevel === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    }`}>
                      {selectedClient.riskLevel} Risk Level
                    </span>
                  </div>
                </div>

                {/* NDIS Budget Utilization & Burn Rate Forecaster */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-slate-200">NDIS Capacity Building Budget Utilization</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      {Math.round(((selectedClient.spentBudget || 8450) / (selectedClient.totalBudget || 35000)) * 100)}% Spent
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((selectedClient.spentBudget || 8450) / (selectedClient.totalBudget || 35000)) * 100)
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Total Plan Value</span>
                      <span className="text-white font-bold">${(selectedClient.totalBudget || 35000).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Spent / Claimed</span>
                      <span className="text-emerald-400 font-bold">${(selectedClient.spentBudget || 8450).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Funds Remaining</span>
                      <span className="text-teal-300 font-bold">
                        ${((selectedClient.totalBudget || 35000) - (selectedClient.spentBudget || 8450)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {aiSummary && (
                  <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold">
                      <BrainCircuit className="w-4 h-4" />
                      AI Synthesized Clinical Progress Update
                    </div>
                    <div className="text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                      {aiSummary}
                    </div>
                  </div>
                )}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <span className="font-bold text-slate-300">Emergency & Carer Contact</span>
                  <p className="text-slate-400">
                    {selectedClient.emergencyContact.name} ({selectedClient.emergencyContact.relationship}) -{' '}
                    <span className="text-teal-400 font-mono">{selectedClient.emergencyContact.phone}</span>
                  </p>
                </div>
              </div>

              {/* Sub-component: Goal Tracker */}
              <GoalTracker client={selectedClient} />
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a participant from the left menu to view clinical profile details and goal tracker.
            </div>
          )}
        </div>
      </div>

      {/* New Participant Modal */}
      {isAddingClient && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New NDIS Participant</h3>
              <button onClick={() => setIsAddingClient(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Participant Full Name</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Jordan Miller"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">NDIS Number</label>
                  <input
                    type="text"
                    required
                    value={newClient.ndisNumber}
                    onChange={(e) => setNewClient({ ...newClient, ndisNumber: e.target.value })}
                    placeholder="430891204"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total NDIS Budget ($)</label>
                  <input
                    type="number"
                    value={newClient.totalBudget}
                    onChange={(e) => setNewClient({ ...newClient, totalBudget: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Disability</label>
                <input
                  type="text"
                  value={newClient.primaryDisability}
                  onChange={(e) => setNewClient({ ...newClient, primaryDisability: e.target.value })}
                  placeholder="Autism Spectrum Disorder (Level 3)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingClient(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secure Client Portal & Family Share Modal */}
      <ClientPortalModal
        client={selectedClient}
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
      />

      {/* Plan Review Justification Report Modal */}
      {isJustificationModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    NDIA Plan Review Funding Justification Report — {selectedClient.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    NDIS #{selectedClient.ndisNumber} | Plan Period: {selectedClient.planStartDate} to {selectedClient.planEndDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsJustificationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {isGeneratingJustification ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400 font-semibold">
                    Synthesizing 12 months of GAS progress, case note hours, and restrictive practice fading data...
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {justificationReportText}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Official justification ready for NDIA Planner and Support Coordinator review
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={!justificationReportText}
                  onClick={() => {
                    if (!justificationReportText) return;
                    const blob = new Blob([justificationReportText], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `NDIS_Plan_Review_Justification_${selectedClient.name.replace(/\s+/g, '_')}_2026.md`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Download Report (.md)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
