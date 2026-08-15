'use client';

import React, { useState, useEffect } from 'react';
import { useManagementStore, TabType } from '@/stores/useManagementStore';
import { Client, BillingClaim, CaseNote, Incident } from '@/types';
import {
  Search,
  X,
  Users,
  CreditCard,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    clients,
    billingClaims,
    caseNotes,
    incidents,
    setActiveTab
  } = useManagementStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search clients
  const matchedClients = clients.filter(
    (c: Client) =>
      c.name.toLowerCase().includes(cleanQuery) ||
      c.ndisNumber.includes(cleanQuery) ||
      c.primaryDisability.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  // Search billing claims
  const matchedBilling = billingClaims.filter(
    (b: BillingClaim) =>
      b.clientName.toLowerCase().includes(cleanQuery) ||
      b.invoiceNumber.toLowerCase().includes(cleanQuery) ||
      b.ndisSupportItem.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  // Search case notes
  const matchedNotes = caseNotes.filter(
    (n: CaseNote) =>
      n.clientName.toLowerCase().includes(cleanQuery) ||
      n.subjective.toLowerCase().includes(cleanQuery) ||
      n.practitionerName.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  // Search incidents
  const matchedIncidents = incidents.filter(
    (i: Incident) =>
      i.clientName.toLowerCase().includes(cleanQuery) ||
      i.description.toLowerCase().includes(cleanQuery) ||
      i.severity.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  const totalResults =
    matchedClients.length + matchedBilling.length + matchedNotes.length + matchedIncidents.length;

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 px-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search participants, invoice #, case notes, or incidents... (Type to filter)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!cleanQuery && (
            <div className="py-4 text-center text-slate-400 space-y-4">
              <div className="space-y-1">
                <Command className="w-7 h-7 text-teal-400 mx-auto opacity-80" />
                <p className="font-semibold text-slate-300">Global Breakthrough OS Search</p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  Type any participant name, NDIS number (e.g. 430891204), invoice number (e.g. INV-2026), or keyword to instantly search across all modules.
                </p>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-left">Quick Navigation Shortcuts</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
                  <button
                    onClick={() => handleNavigate('integrations')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-teal-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>API Integrations Hub</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('bsp-plans')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>BSP Plan Generator</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('billing')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Xero / PRODA Claims</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('restrictive-practices')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Restrictive Practices</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('audit')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Compliance Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('hr-roster')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Users className="w-3.5 h-3.5 text-rose-400" />
                    <span>Smart HR Rostering</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {cleanQuery && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">No matching records found for &quot;{query}&quot;</p>
              <p className="text-[11px] text-slate-500">Try searching for participant name, NDIS number, or claim item.</p>
            </div>
          )}

          {/* Participant Results */}
          {matchedClients.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                NDIS Participants ({matchedClients.length})
              </span>
              <div className="space-y-1">
                {matchedClients.map((client: Client) => (
                  <button
                    key={client.id}
                    onClick={() => handleNavigate('clients')}
                    className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-teal-300 transition-colors">
                        {client.name}
                      </span>
                      <span className="ml-2 text-[10px] text-slate-400 font-mono">
                        NDIS #{client.ndisNumber}
                      </span>
                      <p className="text-[11px] text-slate-400">{client.primaryDisability}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Billing Results */}
          {matchedBilling.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                Billing Claims & Invoices ({matchedBilling.length})
              </span>
              <div className="space-y-1">
                {matchedBilling.map((claim: BillingClaim) => (
                  <button
                    key={claim.id}
                    onClick={() => handleNavigate('billing')}
                    className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-emerald-400">{claim.invoiceNumber}</span>
                        <span className="text-white font-semibold">{claim.clientName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-md">{claim.ndisSupportItem}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 text-xs">${claim.totalAmount.toFixed(2)}</span>
                      <span className="block text-[10px] text-slate-400">{claim.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Case Notes Results */}
          {matchedNotes.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Clinical Case Notes ({matchedNotes.length})
              </span>
              <div className="space-y-1">
                {matchedNotes.map((note: CaseNote) => (
                  <button
                    key={note.id}
                    onClick={() => handleNavigate('case-notes')}
                    className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-white">{note.clientName}</span>
                      <span className="ml-2 text-[10px] bg-slate-800 text-sky-300 font-mono px-1.5 py-0.5 rounded">
                        {note.format} Format
                      </span>
                      <p className="text-[11px] text-slate-400 truncate max-w-md">{note.subjective}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{note.date}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Incident Results */}
          {matchedIncidents.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Incidents ({matchedIncidents.length})
              </span>
              <div className="space-y-1">
                {matchedIncidents.map((inc: Incident) => (
                  <button
                    key={inc.id}
                    onClick={() => handleNavigate('incidents')}
                    className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{inc.clientName}</span>
                        <span className="text-[10px] bg-rose-500/10 text-rose-400 font-bold px-1.5 py-0.5 rounded border border-rose-500/20">
                          {inc.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-md">{inc.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(inc.incidentDate).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between px-4">
          <span>Press <kbd className="font-mono text-slate-300 bg-slate-800 px-1 rounded">Ctrl+K</kbd> anytime to open</span>
          <span className="text-teal-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Breakthrough OS Indexer
          </span>
        </div>
      </div>
    </div>
  );
};
