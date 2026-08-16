'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Plus,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Users,
  ShieldCheck,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';
import { useManagementStore } from '@/stores/useManagementStore';
import { ClinicBranch } from '@/types';

interface BranchManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchManagementModal: React.FC<BranchManagementModalProps> = ({ isOpen, onClose }) => {
  const {
    clinics,
    currentClinicId,
    setClinic,
    addClinicBranch,
    updateClinicBranch,
    deleteClinicBranch,
    practitioners,
    clients,
    addNotification
  } = useManagementStore();

  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [state, setState] = useState<'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'>('VIC');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [leadPractitionerName, setLeadPractitionerName] = useState(practitioners[0]?.name || 'Dr. Sarah Jenkins');
  const [activeCaseloadCount, setActiveCaseloadCount] = useState(20);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setName('');
    setCode('');
    setState('VIC');
    setAddress('');
    setPhone('');
    setEmail('');
    setLeadPractitionerName(practitioners[0]?.name || 'Dr. Sarah Jenkins');
    setActiveCaseloadCount(20);
    setEditingBranchId(null);
    setIsAddingBranch(true);
  };

  const handleOpenEdit = (branch: ClinicBranch) => {
    setName(branch.name);
    setCode(branch.code);
    setState(branch.state);
    setAddress(branch.address);
    setPhone(branch.phone);
    setEmail(branch.email);
    setLeadPractitionerName(branch.leadPractitionerName);
    setActiveCaseloadCount(branch.activeCaseloadCount);
    setEditingBranchId(branch.id);
    setIsAddingBranch(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    if (editingBranchId) {
      updateClinicBranch(editingBranchId, {
        name,
        code: code.toUpperCase(),
        state,
        address,
        phone,
        email,
        leadPractitionerName,
        activeCaseloadCount: Number(activeCaseloadCount),
      });
      addNotification({
        title: 'Clinic Branch Updated',
        message: `Updated configuration for branch ${name} (${code}).`,
        type: 'hr',
        severity: 'info',
        linkTab: 'command-center',
      });
    } else {
      const newId = `clinic-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      addClinicBranch({
        id: newId,
        name,
        code: code.toUpperCase(),
        state,
        address: address || 'Regional Practice Hub',
        phone: phone || '(03) 9000 0000',
        email: email || `${code.toLowerCase()}@breakthrough.org.au`,
        leadPractitionerName,
        activeCaseloadCount: Number(activeCaseloadCount),
      });
      addNotification({
        title: 'New Clinic Branch Registered',
        message: `Registered ${name} (${code}) in Breakthrough OS tenancy directory.`,
        type: 'hr',
        severity: 'info',
        linkTab: 'command-center',
      });
    }

    setIsAddingBranch(false);
    setEditingBranchId(null);
  };

  const totalPractitioners = practitioners.length;
  const totalClients = clients.length;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Multi-Clinic Tenancy & Organization Hub
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold uppercase">
                  Phase 2 Multi-Tenancy
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage practice branch locations, caseload capacities, regional hub scoping, and clinical leadership.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Active Practice Branches
              </span>
              <div className="text-2xl font-black text-teal-400">{clinics.length} Hubs</div>
              <span className="text-[11px] text-slate-500 font-mono">VIC, NSW & Regional Centers</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Total Caseload Capacity
              </span>
              <div className="text-2xl font-black text-white">
                {clinics.reduce((sum, c) => sum + (c.activeCaseloadCount || 0), 0)} Placements
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">{totalClients} Active Participants</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Screened Allied Health Staff
              </span>
              <div className="text-2xl font-black text-indigo-400">{totalPractitioners} Clinicians</div>
              <span className="text-[11px] text-slate-500 font-mono">100% NDIS Clearance Verified</span>
            </div>
          </div>

          {/* Branch List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                Registered Practice Branches ({clinics.length})
              </h3>

              {!isAddingBranch && (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Clinic Branch</span>
                </button>
              )}
            </div>

            {/* Add / Edit Form */}
            <AnimatePresence>
              {isAddingBranch && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveBranch}
                  className="p-5 bg-slate-950 rounded-2xl border border-teal-500/40 space-y-4 shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-teal-300">
                      {editingBranchId ? 'Edit Clinic Branch Details' : 'Register New Regional Clinic Branch'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingBranch(false);
                        setEditingBranchId(null);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Clinic Branch Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Brisbane Specialist Regional Hub"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Branch Code *</label>
                      <input
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. QLD-BNE"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-mono font-bold focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">State / Jurisdiction</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-teal-500 focus:outline-none"
                      >
                        {['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Physical Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Suite 10, 200 Queen St, Brisbane QLD 4000"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. (07) 3000 4500"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Branch Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. brisbane@breakthrough.org.au"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Lead Practitioner</label>
                      <select
                        value={leadPractitionerName}
                        onChange={(e) => setLeadPractitionerName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-teal-500 focus:outline-none"
                      >
                        {practitioners.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.position})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Caseload Capacity Limit</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={activeCaseloadCount}
                        onChange={(e) => setActiveCaseloadCount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingBranch(false);
                        setEditingBranchId(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingBranchId ? 'Save Changes' : 'Register Branch'}</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Branch Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinics.map((clinic) => {
                const isCurrent = clinic.id === currentClinicId;
                return (
                  <div
                    key={clinic.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'bg-slate-950 border-teal-500/60 shadow-lg ring-1 ring-teal-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{clinic.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                            {clinic.code}
                          </span>
                        </div>

                        {isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Hub
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{clinic.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>Lead: {clinic.leadPractitionerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-0.5">
                          <span>{clinic.phone}</span>
                          <span>•</span>
                          <span className="truncate">{clinic.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Caseload Limit: <strong className="text-teal-300">{clinic.activeCaseloadCount}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(clinic)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                          title="Edit branch details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              setClinic(clinic.id);
                              addNotification({
                                title: 'Active Practice Branch Switched',
                                message: `Switched active clinical tenancy to ${clinic.name} (${clinic.code}).`,
                                type: 'hr',
                                severity: 'info',
                                linkTab: 'command-center',
                              });
                            }}
                            className="px-3 py-1 bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-bold transition-colors"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>NDIS Practice Standards Multi-Tenancy & Data Isolation Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
