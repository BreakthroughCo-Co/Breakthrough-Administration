'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import {
  BSPDocument,
  BSPAuditPackage,
  NDISQualityIndicatorId,
  RegulatoryPillar
} from '@/types/bsp-audit';
import { evaluateBSPDocument } from '@/lib/bsp-auditor/agent-evaluator';
import { generateRemediationForIndicator } from '@/lib/bsp-auditor/remediation-engine';

// Subcomponents
import { DomainScorecardGauges } from './bsp-audit/DomainScorecardGauges';
import { QualityIndicatorsMatrix } from './bsp-audit/QualityIndicatorsMatrix';
import { RedFlagRemediationHub } from './bsp-audit/RedFlagRemediationHub';
import { AgentDeliberationStream } from './bsp-audit/AgentDeliberationStream';
import { APOSubmissionExportView } from './bsp-audit/APOSubmissionExportView';

import {
  BrainCircuit,
  Sparkles,
  Award,
  Layers,
  Flame,
  Scale,
  Brain,
  ShieldAlert,
  FileCheck,
  RefreshCw,
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Sliders,
  Check
} from 'lucide-react';

interface BSPAuditStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBsp?: BSPDocument;
}

type StudioTab =
  | 'scorecard'
  | 'remediation'
  | 'indicators'
  | 'deliberation'
  | 'apo-export';

export const BSPAuditStudioModal: React.FC<BSPAuditStudioModalProps> = ({
  isOpen,
  onClose,
  initialBsp
}) => {
  const { bspDocuments, updateBSPDocument, addAuditLog, addNotification } = useManagementStore();

  const [activeTab, setActiveTab] = useState<StudioTab>('scorecard');
  const [currentBsp, setCurrentBsp] = useState<BSPDocument>(
    initialBsp || bspDocuments[0]
  );
  const [auditPackage, setAuditPackage] = useState<BSPAuditPackage | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(true);
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<RegulatoryPillar | 'all'>('all');
  const [remediationNotification, setRemediationNotification] = useState<string | null>(null);

  // Sync with prop when opened or changed
  useEffect(() => {
    if (initialBsp) {
      setCurrentBsp(initialBsp);
    } else if (bspDocuments.length > 0) {
      setCurrentBsp(bspDocuments[0]);
    }
  }, [initialBsp, bspDocuments]);

  // Execute Multi-Agent Evaluation
  const runAudit = useCallback(async (bspToAudit: BSPDocument) => {
    setIsAuditing(true);
    try {
      const result = await evaluateBSPDocument(bspToAudit);
      setAuditPackage(result);
    } catch (err) {
      console.error('BSP Quality Audit Engine Error:', err);
    } finally {
      setIsAuditing(false);
    }
  }, []);

  // Run audit on modal open or BSP change
  useEffect(() => {
    if (isOpen && currentBsp) {
      runAudit(currentBsp);
    }
  }, [isOpen, currentBsp, runAudit]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle updates from Remediation Hub
  const handleBspRemediated = (updatedBsp: BSPDocument, summary: string) => {
    setCurrentBsp(updatedBsp);
    setRemediationNotification(summary);
    // Re-evaluate immediately with updated state
    runAudit(updatedBsp);
    setTimeout(() => {
      setRemediationNotification(null);
    }, 6000);
  };

  // Handle on-demand remediation from Indicators Matrix
  const handleRemediateIndicator = (indicatorId: NDISQualityIndicatorId) => {
    const patchResult = generateRemediationForIndicator(currentBsp, indicatorId);
    if (patchResult.patchApplied) {
      updateBSPDocument(currentBsp.id, patchResult.updatedBsp);
      addAuditLog(
        '1-Click Indicator Remediation Injected',
        'BSPDocument',
        currentBsp.id,
        `Remediated ${indicatorId}: ${patchResult.summary}`
      );
      addNotification({
        title: `Remediated ${indicatorId}`,
        message: patchResult.summary,
        type: 'compliance',
        severity: 'medium',
        linkTab: 'bsp-plans'
      });
      handleBspRemediated(patchResult.updatedBsp as BSPDocument, patchResult.summary);
    }
  };

  const handleNavigateToIndicators = (pillar?: RegulatoryPillar) => {
    if (pillar) setSelectedPillarFilter(pillar);
    setActiveTab('indicators');
  };

  const handleNavigateToRedFlags = () => {
    setActiveTab('remediation');
  };

  if (!isOpen) return null;

  const score = auditPackage?.overallScore ?? 0;
  const grade = auditPackage?.complianceGrade ?? 'Grade F';
  const redFlagsCount = auditPackage?.redFlags?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl animate-scaleIn overflow-hidden">
        {/* 1. Modal Header (Sticky) */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500/20 via-indigo-500/20 to-purple-500/20 text-teal-400 rounded-xl border border-teal-500/30 shadow-inner">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Autonomous BSP Quality Audit Studio & Scorecard
                </h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded font-bold uppercase border border-teal-500/30">
                  Tri-Agent Panel
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded font-bold uppercase border border-purple-500/30">
                  Rules 2018
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Participant: <strong className="text-white">{currentBsp.clientName}</strong> ({currentBsp.version}) • NDIS PBS Capability Framework
              </p>
            </div>
          </div>

          {/* Quick Header Score Pill & Controls */}
          <div className="flex items-center gap-2.5">
            {auditPackage && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-inner font-mono text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Score:</span>
                <span
                  className={`font-black text-sm ${
                    score >= 90
                      ? 'text-emerald-400'
                      : score >= 75
                      ? 'text-teal-400'
                      : score >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {score}%
                </span>
                <span className="text-[10px] text-slate-500">({grade})</span>
              </div>
            )}

            <button
              onClick={() => runAudit(currentBsp)}
              disabled={isAuditing}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl border border-slate-700 transition-colors shadow-sm"
              title="Re-run Multi-Agent Audit"
            >
              <RefreshCw className={`w-4 h-4 text-teal-400 ${isAuditing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              title="Close Audit Studio (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Remediation Live Alert Banner */}
        {remediationNotification && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>1-Click Safeguard Applied:</strong> {remediationNotification}
              </span>
            </div>
            <button
              onClick={() => setRemediationNotification(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2. Studio Tab Navigation Bar */}
        <div className="px-5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'scorecard'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Scorecard & Gauges</span>
          </button>

          <button
            onClick={() => setActiveTab('remediation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'remediation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Red-Flag Remediation</span>
            {redFlagsCount > 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
                {redFlagsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('indicators')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'indicators'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>12 Quality Indicators Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('deliberation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'deliberation'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Live Multi-Agent Deliberation</span>
          </button>

          <button
            onClick={() => setActiveTab('apo-export')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'apo-export'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>APO Submission & Export</span>
          </button>
        </div>

        {/* 3. Modal Body (Scrollable with .modal-scroll) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs modal-scroll bg-slate-950/40">
          {isAuditing && !auditPackage ? (
            <div className="p-16 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCw className="w-10 h-10 text-teal-400 animate-spin" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Executing Autonomous Multi-Agent Quality Audit...
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Human Rights Legal Specialist, Clinical PBS Specialist, and Panel Lead Synthesizer are evaluating {currentBsp.clientName}'s plan across all 12 NDIS Quality Indicators.
                </p>
              </div>
            </div>
          ) : auditPackage ? (
            <>
              {activeTab === 'scorecard' && (
                <DomainScorecardGauges
                  auditPackage={auditPackage}
                  onNavigateToIndicators={handleNavigateToIndicators}
                  onNavigateToRedFlags={handleNavigateToRedFlags}
                />
              )}

              {activeTab === 'remediation' && (
                <RedFlagRemediationHub
                  activeBsp={currentBsp}
                  redFlags={auditPackage.redFlags}
                  onBspUpdated={handleBspRemediated}
                />
              )}

              {activeTab === 'indicators' && (
                <QualityIndicatorsMatrix
                  indicatorResults={auditPackage.indicatorResults}
                  selectedPillarFilter={selectedPillarFilter}
                  onRemediateIndicator={handleRemediateIndicator}
                />
              )}

              {activeTab === 'deliberation' && (
                <AgentDeliberationStream
                  traces={auditPackage.deliberationTraces}
                  onSelectIndicator={(indId) => {
                    handleNavigateToIndicators();
                  }}
                />
              )}

              {activeTab === 'apo-export' && (
                <APOSubmissionExportView
                  auditPackage={auditPackage}
                  bsp={currentBsp}
                />
              )}
            </>
          ) : null}
        </div>

        {/* 4. Modal Footer (Sticky) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span>Audit Engine: <strong>Breakthrough NDIS Auditor v2.6</strong></span>
            {auditPackage && (
              <>
                <span>•</span>
                <span>SHA-256: <code className="text-slate-500">{auditPackage.checksumSha256.slice(0, 12)}...</code></span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Close Studio
            </button>
            {activeTab !== 'apo-export' && (
              <button
                onClick={() => setActiveTab('apo-export')}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>View APO Export</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
