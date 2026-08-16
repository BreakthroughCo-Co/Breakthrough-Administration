'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { AuditLog } from '@/types';
import { ComplianceReportModal } from './ComplianceReportModal';
import {
  Clock,
  Search,
  Download,
  FileSpreadsheet,
  Calendar,
  Filter,
  X,
  FileText
} from 'lucide-react';

export const AuditLogsModule: React.FC = () => {
  const { auditLogs } = useManagementStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isComplianceReportOpen, setIsComplianceReportOpen] = useState(false);

  const modules = ['ALL', 'CLIENT', 'BILLING', 'INCIDENT', 'PRACTITIONER', 'SYSTEM'];
  const severities = ['ALL', 'Critical', 'High', 'Medium', 'Low'];

  const getAuditSeverity = (log: AuditLog): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if ((log as any).severity) return (log as any).severity;
    const combined = `${log.action} ${log.details} ${log.entity}`.toUpperCase();
    if (
      combined.includes('DELETE') ||
      combined.includes('CRITICAL') ||
      combined.includes('RESTRICTIVE') ||
      combined.includes('REVOKE') ||
      combined.includes('OVERRIDE') ||
      combined.includes('DISQUALIFIED')
    ) {
      return 'Critical';
    }
    if (
      combined.includes('INCIDENT') ||
      combined.includes('SUBMIT') ||
      combined.includes('AUTHORIZE') ||
      combined.includes('REJECT') ||
      combined.includes('CLAIM') ||
      combined.includes('BILLING')
    ) {
      return 'High';
    }
    if (
      combined.includes('UPDATE') ||
      combined.includes('EDIT') ||
      combined.includes('CREATE') ||
      combined.includes('ADD') ||
      combined.includes('CASE NOTE')
    ) {
      return 'Medium';
    }
    return 'Low';
  };

  const filteredLogs = auditLogs.filter((l: AuditLog) => {
    const matchesModule =
      selectedModule === 'ALL' ||
      (l.entity && l.entity.toUpperCase().includes(selectedModule)) ||
      (l.action && l.action.toUpperCase().includes(selectedModule));

    const query = searchTerm.toLowerCase();
    const matchesText =
      !searchTerm ||
      l.action.toLowerCase().includes(query) ||
      l.actorName.toLowerCase().includes(query) ||
      l.actorRole.toLowerCase().includes(query) ||
      (l.entity && l.entity.toLowerCase().includes(query)) ||
      l.details.toLowerCase().includes(query);

    const severity = getAuditSeverity(l);
    const matchesSeverity = severityFilter === 'ALL' || severity === severityFilter;

    let matchesDate = true;
    if (startDate) {
      const start = new Date(`${startDate}T00:00:00`);
      matchesDate = matchesDate && new Date(l.timestamp) >= start;
    }
    if (endDate) {
      const end = new Date(`${endDate}T23:59:59`);
      matchesDate = matchesDate && new Date(l.timestamp) <= end;
    }

    return matchesModule && matchesText && matchesSeverity && matchesDate;
  });

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Timestamp',
      'Severity',
      'Action',
      'Actor Name',
      'Actor Role',
      'Entity',
      'Details',
      'IP Address'
    ];
    const rows = filteredLogs.map((l: AuditLog) => {
      const sev = getAuditSeverity(l);
      const cleanDetails = (l.details || '').replace(/"/g, '""');
      const cleanAction = (l.action || '').replace(/"/g, '""');
      const cleanActor = (l.actorName || '').replace(/"/g, '""');
      return `"${l.id}","${l.timestamp}","${sev}","${cleanAction}","${cleanActor}","${l.actorRole}","${l.entity || ''}","${cleanDetails}","${l.ipAddress || ''}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NDIS_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const handleExportAuditCertificate = () => {
    const text = `========================================================================
BREAKTHROUGH COACHING & CONSULTING - IMMUTABLE COMPLIANCE AUDIT CERTIFICATE
NDIS Provider Registration #: 405001234
Generated On: ${new Date().toISOString()}
========================================================================

RECORDED AUDIT LOGS:
${filteredLogs
  .map(
    (l: AuditLog) =>
      `[${l.timestamp}] | SEVERITY: ${getAuditSeverity(l)} | ACTION: ${l.action} | ACTOR: ${l.actorName} (${l.actorRole}) | DETAILS: ${l.details}`
  )
  .join('\n')}

CERTIFICATION STATEMENT:
This document confirms that all clinical records, restrictive practice logs, and financial transactions
recorded above have been preserved in an immutable audit ledger compliant with the NDIS Quality and Safeguards Commission.
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDIS_Compliance_Audit_Log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const renderSeverityBadge = (severity: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Low
          </span>
        );
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModule('ALL');
    setSeverityFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Immutable Compliance Audit Ledger</h2>
            <p className="text-xs text-slate-400">
              Complete, unalterable trail of all clinical edits, status overrides, and NDIS submissions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setIsComplianceReportOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md border border-blue-500/30"
            title="Generate and download/print Board-ready executive compliance PDF summary"
          >
            <FileText className="w-4 h-4 text-blue-200" />
            <span>Compliance Report Generator (Executive PDF)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs rounded-lg border border-emerald-500/30 flex items-center gap-2 transition-all shadow-sm"
            title="Export filtered audit logs to CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportAuditCertificate}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-lg border border-teal-500/30 flex items-center gap-2 transition-all shadow-sm"
            title="Export official text certificate"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export Certificate</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-3 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        {/* Row 1: Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by user, module, action type, or specific change description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Row 2: Date Range, Module & Severity Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-[11px] text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Date Range:</span>
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-teal-500 font-mono"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          {/* Module & Severity Pill Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Severity Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Severity:
              </span>
              {severities.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                    severityFilter === s
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Module Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Module:
              </span>
              {modules.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModule(m)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                    selectedModule === m
                      ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {(searchTerm || selectedModule !== 'ALL' || severityFilter !== 'ALL' || startDate || endDate) && (
              <button
                onClick={clearFilters}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] rounded flex items-center gap-1 border border-slate-700 font-semibold"
                title="Reset all search filters"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audit List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px] bg-slate-950/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Actor Name & Role</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-sans">
                    No audit records match the selected date range or query filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLog) => {
                  const severity = getAuditSeverity(log);
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'medium',
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderSeverityBadge(severity)}
                      </td>
                      <td className="py-3 px-4 font-bold text-teal-300 whitespace-nowrap">{log.action}</td>
                      <td className="py-3 px-4 font-sans whitespace-nowrap">
                        <span className="text-white font-semibold">{log.actorName}</span>{' '}
                        <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-md truncate font-sans text-xs">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Board Compliance Report Modal */}
      <ComplianceReportModal
        isOpen={isComplianceReportOpen}
        onClose={() => setIsComplianceReportOpen(false)}
      />
    </div>
  );
};

