'use client';

import React, { useState } from 'react';
import {
  BSPDocument,
  ComplianceRedFlag,
  RedFlagSeverity
} from '@/types/bsp-audit';
import {
  applyRemediationPatch,
  applyAllRemediations
} from '@/lib/bsp-auditor/remediation-engine';
import { useManagementStore } from '@/stores/useManagementStore';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Scale,
  Brain,
  ShieldAlert,
  ArrowRight,
  Check,
  RotateCcw,
  Sliders,
  Info,
  Clock,
  Layers
} from 'lucide-react';

interface RedFlagRemediationHubProps {
  activeBsp: BSPDocument;
  redFlags: ComplianceRedFlag[];
  onBspUpdated: (updatedBsp: BSPDocument, summary: string) => void;
}

const SEVERITY_CONFIGS: Record<
  RedFlagSeverity,
  { label: string; badge: string; border: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  critical: {
    label: 'Critical Safety Violation',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    border: 'border-rose-500/50',
    bg: 'bg-rose-950/20',
    icon: Flame
  },
  high: {
    label: 'High Compliance Risk',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/20',
    icon: AlertTriangle
  },
  medium: {
    label: 'Moderate Safeguards Gap',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    border: 'border-blue-500/40',
    bg: 'bg-blue-950/20',
    icon: Info
  },
  low: {
    label: 'Minor Advisory',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    border: 'border-slate-700',
    bg: 'bg-slate-900',
    icon: Info
  }
};

export const RedFlagRemediationHub: React.FC<RedFlagRemediationHubProps> = ({
  activeBsp,
  redFlags,
  onBspUpdated
}) => {
  const { updateBSPDocument, addAuditLog, addNotification } = useManagementStore();

  const [remediatedIds, setRemediatedIds] = useState<Set<string>>(new Set());
  const [remediationLogs, setRemediationLogs] = useState<Array<{ id: string; timestamp: string; summary: string }>>([]);
  const [severityFilter, setSeverityFilter] = useState<'all' | RedFlagSeverity | 'remediated'>('all');
  const [isRemediatingAll, setIsRemediatingAll] = useState(false);

  // Single 1-Click Remediation Execution
  const handleRemediateSingle = (redFlag: ComplianceRedFlag) => {
    const result = applyRemediationPatch(activeBsp, redFlag);
    if (result.patchApplied) {
      // 1. Update state store directly
      updateBSPDocument(activeBsp.id, result.updatedBsp);

      // 2. Audit Trail
      addAuditLog(
        '1-Click NDIS Compliance Remediation Injected',
        'BSPDocument',
        activeBsp.id,
        `Remediated ${redFlag.affectedIndicator} (${redFlag.title}): ${result.summary}`
      );

      // 3. Notification
      addNotification({
        title: `Safeguard Injected: ${redFlag.affectedIndicator}`,
        message: `Updated BSP for ${activeBsp.clientName}: ${result.summary}`,
        type: 'compliance',
        severity: redFlag.severity === 'critical' ? 'high' : 'medium',
        linkTab: 'bsp-plans'
      });

      // 4. Update local state
      setRemediatedIds((prev) => new Set([...prev, redFlag.id]));
      setRemediationLogs((prev) => [
        {
          id: redFlag.id,
          timestamp: new Date().toLocaleTimeString(),
          summary: result.summary
        },
        ...prev
      ]);

      // 5. Trigger parent re-evaluation
      onBspUpdated(result.updatedBsp as BSPDocument, result.summary);
    }
  };

  // Batch "Remediate All Safeguards" Execution
  const handleRemediateAll = () => {
    setIsRemediatingAll(true);
    const unResolvedFlags = redFlags.filter((rf) => !remediatedIds.has(rf.id));
    const result = applyAllRemediations(activeBsp, unResolvedFlags);

    if (result.appliedCount > 0) {
      // 1. Update state store
      updateBSPDocument(activeBsp.id, result.updatedBsp);

      // 2. Audit Trail
      addAuditLog(
        'Batch 1-Click NDIS Compliance Remediation Injected',
        'BSPDocument',
        activeBsp.id,
        `Batch remediated ${result.appliedCount} compliance gaps for ${activeBsp.clientName}`
      );

      // 3. Notification
      addNotification({
        title: `Batch Remediated ${result.appliedCount} BSP Safeguards`,
        message: `Injected all missing statutory safeguards for ${activeBsp.clientName}. Score elevated.`,
        type: 'compliance',
        severity: 'high',
        linkTab: 'bsp-plans'
      });

      // 4. Mark all as remediated
      const allIds = new Set([...remediatedIds, ...unResolvedFlags.map((rf) => rf.id)]);
      setRemediatedIds(allIds);

      setRemediationLogs((prev) => [
        {
          id: `batch-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          summary: `Batch applied ${result.appliedCount} clinical patches: ${result.summaries.join('; ')}`
        },
        ...prev
      ]);

      // 5. Parent notification & re-evaluation
      onBspUpdated(result.updatedBsp, `Batch injected ${result.appliedCount} clinical safeguards.`);
    }

    setTimeout(() => setIsRemediatingAll(false), 400);
  };

  const outstandingRedFlags = redFlags.filter((rf) => !remediatedIds.has(rf.id));
  const remediatedRedFlags = redFlags.filter((rf) => remediatedIds.has(rf.id));

  const criticalCount = outstandingRedFlags.filter((rf) => rf.severity === 'critical').length;
  const highCount = outstandingRedFlags.filter((rf) => rf.severity === 'high').length;
  const mediumCount = outstandingRedFlags.filter((rf) => rf.severity === 'medium').length;

  const displayFlags = redFlags.filter((rf) => {
    const isRemediated = remediatedIds.has(rf.id);
    if (severityFilter === 'remediated') return isRemediated;
    if (severityFilter !== 'all' && rf.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Hero Action Banner: Batch Remediate & Summary Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Autonomous Red-Flag Compliance Remediation Hub
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Inject evidence-based clinical text, Restrictive Practices Rules 2018 authorizations, FBA hypotheses, and proactive ecological safeguards directly into the active Behaviour Support Plan with 1 click.
            </p>
          </div>

          {outstandingRedFlags.length > 0 ? (
            <button
              onClick={handleRemediateAll}
              disabled={isRemediatingAll}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 hover:from-teal-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-current animate-pulse" />
              <span>
                {isRemediatingAll
                  ? 'Injecting Safeguards...'
                  : `1-Click Remediate All Safeguards (${outstandingRedFlags.length})`}
              </span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All Red-Flag Safeguards Applied!</span>
            </div>
          )}
        </div>

        {/* Severity Metrics Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Outstanding Gaps
            </span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">
              {outstandingRedFlags.length}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${criticalCount > 0 ? 'bg-rose-950/20 border-rose-500/40 text-rose-400' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">
              Critical Violations
            </span>
            <span className={`text-xl font-bold font-mono mt-0.5 block ${criticalCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {criticalCount}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${highCount > 0 ? 'bg-amber-950/20 border-amber-500/40 text-amber-400' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">
              High Compliance Risks
            </span>
            <span className={`text-xl font-bold font-mono mt-0.5 block ${highCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
              {highCount}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Safeguards Remediated
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {remediatedRedFlags.length}
            </span>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Gaps ({redFlags.length})
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'critical'
                ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-800'
            }`}
          >
            Critical ({redFlags.filter((rf) => rf.severity === 'critical').length})
          </button>
          <button
            onClick={() => setSeverityFilter('high')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'high'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800'
            }`}
          >
            High Risk ({redFlags.filter((rf) => rf.severity === 'high').length})
          </button>
          <button
            onClick={() => setSeverityFilter('medium')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'medium'
                ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-blue-400 border border-slate-800'
            }`}
          >
            Moderate ({redFlags.filter((rf) => rf.severity === 'medium').length})
          </button>
          <button
            onClick={() => setSeverityFilter('remediated')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              severityFilter === 'remediated'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800'
            }`}
          >
            Remediated ({remediatedRedFlags.length})
          </button>
        </div>
      </div>

      {/* Red-Flag Alert Cards List */}
      <div className="space-y-3">
        {displayFlags.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">
              {severityFilter === 'remediated'
                ? 'No remediations applied yet in this session.'
                : 'Zero red flags matching the current filter! All plan safeguards are compliant.'}
            </p>
          </div>
        ) : (
          displayFlags.map((redFlag) => {
            const isRemediated = remediatedIds.has(redFlag.id);
            const sevCfg = SEVERITY_CONFIGS[redFlag.severity] || SEVERITY_CONFIGS.medium;
            const SeverityIcon = sevCfg.icon;

            return (
              <div
                key={redFlag.id}
                className={`bg-slate-900 border ${
                  isRemediated
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : sevCfg.border
                } rounded-xl p-4 transition-all duration-200 shadow-md space-y-3 animate-fadeIn`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border ${
                        isRemediated
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : `${sevCfg.bg} ${sevCfg.badge}`
                      }`}
                    >
                      {isRemediated ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <SeverityIcon className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white">{redFlag.title}</h4>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                            isRemediated
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : sevCfg.badge
                          }`}
                        >
                          {isRemediated ? 'Remediated & Synced' : sevCfg.label}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-950 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-bold">
                          {redFlag.affectedIndicator}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        Affected Pillar: {redFlag.affectedPillar.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Remediate Button */}
                  <div>
                    {isRemediated ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold shadow-inner">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Safeguard Applied</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRemediateSingle(redFlag)}
                        className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>1-Click Remediate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Regulatory Breach Description */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Regulatory Finding & Impact
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans">{redFlag.description}</p>
                </div>

                {/* Recommended Clinical Patch Preview */}
                {redFlag.recommendedRemediation && (
                  <div className="bg-teal-950/20 border border-teal-500/30 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>Synthesized Clinical Safeguard (Injected into State)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic font-sans">
                      "{redFlag.recommendedRemediation}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Live Remediation Audit Trail */}
      {remediationLogs.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs animate-fadeIn shadow-md">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <Clock className="w-4 h-4" />
            <span>State Store Remediation Activity Log ({remediationLogs.length} events)</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto modal-scroll pr-1">
            {remediationLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-2 bg-slate-900/80 rounded-lg border border-slate-800/60 font-mono text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{log.summary}</span>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
