'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Trash2,
  Play,
  FileText,
  Activity,
  Layers,
  X,
  Code,
  Check,
  ShieldCheck,
  Zap,
  Radio
} from 'lucide-react';
import { useManagementStore } from '@/stores/useManagementStore';
import { OfflineSyncQueueItem } from '@/types';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    offlineQueue,
    isOffline,
    setIsOffline,
    syncOfflineQueue,
    clearSyncedOfflineQueue,
    addOfflineQueueItem,
    clients,
    currentUser,
    addNotification
  } = useManagementStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPayloadItem, setSelectedPayloadItem] = useState<OfflineSyncQueueItem | null>(null);

  if (!isOpen) return null;

  const pendingCount = offlineQueue.filter((i) => i.status === 'PENDING').length;
  const syncedCount = offlineQueue.filter((i) => i.status === 'SYNCED').length;

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await syncOfflineQueue();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSimulateFieldNote = () => {
    const randomClient = clients[0] || { id: 'cli-101', name: 'Jordan Miller' };
    addOfflineQueueItem({
      entityType: 'CASE_NOTE',
      action: 'CREATE',
      payload: {
        clientId: randomClient.id,
        clientName: randomClient.name,
        practitionerId: currentUser.practitionerId || 'prac-1',
        practitionerName: currentUser.name,
        date: new Date().toISOString().slice(0, 10),
        format: 'SIMPL',
        sessionDurationMinutes: 60,
        content: `[Field Note Logged Offline] Assessed participant in home environment. Engagement with sensory regulation visuals remained high throughout 60m session.`,
        billableStatus: 'Pending',
        isSynced: false,
      },
    });

    addNotification({
      title: 'Field Mutation Queued (Offline)',
      message: `Captured offline case note for ${randomClient.name} into IndexedDB queue.`,
      type: 'compliance',
      severity: 'info',
      linkTab: 'case-notes',
    });
  };

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
            <div
              className={`p-2.5 rounded-xl border ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isOffline ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Offline-First PWA Sync & Storage Engine
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                    isOffline
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {isOffline ? 'Field Visit Mode (Offline)' : 'Cloud Live (Online)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                IndexedDB offline transaction queue, background synchronisation, and local caching for rural / home visits.
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
          {/* Status & Simulation Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-teal-400 rounded-xl border border-slate-800">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Simulated Network & Connectivity State
                </span>
                <span className="text-[11px] text-slate-400">
                  {isOffline
                    ? 'All case notes, ABC logs and assessments will be queued in IndexedDB.'
                    : 'Changes synchronize live with Firestore cloud ledger.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOffline(!isOffline);
                  addNotification({
                    title: isOffline ? 'Connected to Cloud' : 'Switched to Field Visit Mode',
                    message: isOffline
                      ? 'Re-established online cloud synchronization.'
                      : 'Running in zero-connectivity IndexedDB mode.',
                    type: 'compliance',
                    severity: 'info',
                    linkTab: 'command-center',
                  });
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  isOffline
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-sm'
                    : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/40'
                }`}
              >
                {isOffline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isOffline ? 'Simulate Reconnect' : 'Simulate Offline Visit'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateFieldNote}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>+ Mock Offline Note</span>
              </button>
            </div>
          </div>

          {/* Queue Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                Pending Local Sync
              </span>
              <div className="text-2xl font-black text-amber-400">{pendingCount} Records</div>
              <span className="text-[11px] text-slate-500 font-mono">Stored in IndexedDB</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                Synchronized Records
              </span>
              <div className="text-2xl font-black text-emerald-400">{syncedCount} Records</div>
              <span className="text-[11px] text-slate-500 font-mono">Ledger Verified</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-teal-400">
                Offline Cache Status
              </span>
              <div className="text-2xl font-black text-white">{clients.length} Participants</div>
              <span className="text-[11px] text-teal-400 font-mono">Cached for Offline Access</span>
            </div>
          </div>

          {/* Offline Queue Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-400" />
                IndexedDB Background Sync Queue ({offlineQueue.length})
              </h3>

              <div className="flex items-center gap-2">
                {syncedCount > 0 && (
                  <button
                    type="button"
                    onClick={clearSyncedOfflineQueue}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Clear Synced ({syncedCount})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSyncAll}
                  disabled={isSyncing || pendingCount === 0}
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-40 transition-all"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  <span>Sync All Pending ({pendingCount})</span>
                </button>
              </div>
            </div>

            {offlineQueue.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">All Records Fully Synchronized</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  There are no pending offline mutations. All case notes, observations, and assessment files match the central cloud ledger.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">Entity Type</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Summary / Participant</th>
                        <th className="p-3">Captured At</th>
                        <th className="p-3">Sync Status</th>
                        <th className="p-3 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {offlineQueue.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3">
                            <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                              {item.entityType}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-teal-400 font-bold">{item.action}</td>
                          <td className="p-3 text-slate-300 max-w-[200px] truncate">
                            {item.payload?.clientName || item.payload?.title || item.id}
                          </td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">
                            {new Date(item.createdAt || item.timestamp || Date.now()).toLocaleTimeString()}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                item.status === 'PENDING'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPayloadItem(item)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px] transition-colors"
                            >
                              JSON
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Payload Inspector Drawer */}
          <AnimatePresence>
            {selectedPayloadItem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-slate-950 rounded-2xl border border-teal-500/40 space-y-2 overflow-hidden shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1.5">
                    <Code className="w-4 h-4" />
                    Payload Inspection: {selectedPayloadItem.id} ({selectedPayloadItem.entityType})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPayloadItem(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {JSON.stringify(selectedPayloadItem.payload, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NDIS Digital Health Record Integrity & Local Encryption Active</span>
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
