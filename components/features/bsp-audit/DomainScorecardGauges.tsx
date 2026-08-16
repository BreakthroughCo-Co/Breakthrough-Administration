'use client';

import React from 'react';
import {
  BSPAuditPackage,
  RegulatoryPillar
} from '@/types/bsp-audit';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Scale,
  Brain,
  Sparkles,
  ShieldAlert,
  Lock,
  Unlock,
  AlertOctagon,
  Award,
  Clock,
  FileCheck
} from 'lucide-react';

interface DomainScorecardGaugesProps {
  auditPackage: BSPAuditPackage;
  onNavigateToIndicators?: (pillar?: RegulatoryPillar) => void;
  onNavigateToRedFlags?: () => void;
}

const PILLAR_CONFIGS: Record<
  RegulatoryPillar,
  {
    title: string;
    weightLabel: string;
    description: string;
    indicatorsLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    barColor: string;
  }
> = {
  human_rights_legal: {
    title: 'Human Rights & Legal Safeguards',
    weightLabel: '30% Weight',
    description: 'Participant consent, dignity of risk, and Restrictive Practices Rules 2018 statutory authorization.',
    indicatorsLabel: 'QI-01, QI-02, QI-09',
    icon: Scale,
    accentColor: 'text-indigo-400',
    barColor: 'from-indigo-500 to-purple-500'
  },
  clinical_pbs_formulation: {
    title: 'Evidence-Based Clinical PBS',
    weightLabel: '30% Weight',
    description: 'Empirical FBA hypothesis rigor, ABC data alignment, and functionally equivalent replacement skills (FCT).',
    indicatorsLabel: 'QI-03, QI-04, QI-06',
    icon: Brain,
    accentColor: 'text-teal-400',
    barColor: 'from-teal-500 to-cyan-500'
  },
  proactive_skill_building: {
    title: 'Proactive Environmental Supports',
    weightLabel: '20% Weight',
    description: 'Ecological adaptations (visual schedules, sensory accommodations) and early warning de-escalation.',
    indicatorsLabel: 'QI-05, QI-07',
    icon: Sparkles,
    accentColor: 'text-emerald-400',
    barColor: 'from-emerald-500 to-teal-500'
  },
  crisis_reduction_safeguards: {
    title: 'Crisis Management & Governance',
    weightLabel: '20% Weight',
    description: 'Non-punitive crisis protocols, milestone-driven fade-out schedules, debriefing, and annual review cadence.',
    indicatorsLabel: 'QI-08, QI-10, QI-11, QI-12',
    icon: ShieldCheck,
    accentColor: 'text-amber-400',
    barColor: 'from-amber-500 to-orange-500'
  }
};

export const DomainScorecardGauges: React.FC<DomainScorecardGaugesProps> = ({
  auditPackage,
  onNavigateToIndicators,
  onNavigateToRedFlags
}) => {
  const {
    overallScore,
    rawWeightedScore,
    complianceGrade,
    complianceStatus,
    rating,
    pillarScores,
    pillarBreakdown,
    activePenaltyMultipliers,
    restrictivePracticesSummary,
    redFlags
  } = auditPackage;

  // SVG Radial calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Gauge colors based on score
  const gaugeColor =
    overallScore >= 90
      ? '#10b981' // emerald-500
      : overallScore >= 75
      ? '#14b8a6' // teal-500
      : overallScore >= 50
      ? '#f59e0b' // amber-500
      : '#f43f5e'; // rose-500

  const badgeBg =
    overallScore >= 90
      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      : overallScore >= 75
      ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
      : overallScore >= 50
      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      : 'bg-rose-500/10 text-rose-300 border-rose-500/30';

  return (
    <div className="space-y-6">
      {/* Master Scorecard & Key Metrics Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Master Radial Authoritative Score Gauge */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute -top-12 -left-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: gaugeColor }}
          />

          <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Authoritative Quality Scorecard
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badgeBg}`}>
              {complianceGrade}
            </span>
          </div>

          {/* Radial SVG Meter */}
          <div className="relative my-4 flex items-center justify-center">
            <svg width="170" height="170" className="transform -rotate-90">
              {/* Background track circle */}
              <circle
                cx="85"
                cy="85"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-950"
              />
              {/* Animated Progress circle */}
              <circle
                cx="85"
                cy="85"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span
                className="text-4xl font-extrabold font-mono tracking-tight"
                style={{ color: gaugeColor }}
              >
                {overallScore}%
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">
                {complianceStatus}
              </span>
              {rawWeightedScore !== overallScore && (
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                  Raw: {rawWeightedScore}% (Penalty Applied)
                </span>
              )}
            </div>
          </div>

          {/* Bottom Rating Status Bar */}
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              {overallScore >= 90 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : overallScore >= 75 ? (
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
              <span className="text-xs font-bold text-white">{rating}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {overallScore >= 90
                ? 'Meets all 12 NDIS Quality Indicators. Endorsed for NDIS Commission lodging.'
                : overallScore >= 75
                ? 'Substantially compliant. Ready for conditional APO endorsement.'
                : 'Identified critical compliance gaps. Mandatory remediation required before filing.'}
            </p>
          </div>
        </div>

        {/* Right: 4 Regulatory Pillars Meters */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                4 Regulatory Pillars Breakdown
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">100% Total Weighted Rubric</span>
          </div>

          <div className="space-y-3.5">
            {(Object.keys(PILLAR_CONFIGS) as RegulatoryPillar[]).map((pillarKey) => {
              const cfg = PILLAR_CONFIGS[pillarKey];
              const IconComponent = cfg.icon;
              const score = pillarScores[pillarKey] ?? 0;
              const breakdown = pillarBreakdown[pillarKey];

              const pillarScoreColor =
                score >= 85
                  ? 'text-emerald-400'
                  : score >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400';

              return (
                <div
                  key={pillarKey}
                  onClick={() => onNavigateToIndicators && onNavigateToIndicators(pillarKey)}
                  className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 transition-all cursor-pointer group shadow-sm"
                  title="Click to view indicator details in Matrix"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 text-teal-400 group-hover:border-teal-500/40 transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                            {cfg.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ({cfg.weightLabel})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Indicators: {cfg.indicatorsLabel}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-extrabold font-mono ${pillarScoreColor}`}>
                        {score}%
                      </span>
                      <span className="text-[10px] font-bold block text-slate-400">
                        {breakdown?.status || (score >= 85 ? 'Compliant' : score >= 60 ? 'Minor Gaps' : 'Breach')}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Progress Track */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full bg-gradient-to-r ${cfg.barColor} transition-all duration-700 rounded-full`}
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Penalty Multipliers Notification (If Any) */}
      {activePenaltyMultipliers && activePenaltyMultipliers.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Critical Red-Flag Penalty Multipliers Active ({activePenaltyMultipliers.length})</span>
            </div>
            <button
              onClick={onNavigateToRedFlags}
              className="text-[11px] font-bold text-rose-300 hover:text-white underline"
            >
              Resolve in Remediation Hub →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activePenaltyMultipliers.map((penalty, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-rose-500/30 rounded-lg p-2.5 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400">{penalty.type}</span>
                  <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                    Multiplier: ×{penalty.factor.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{penalty.description}</p>
                <p className="text-[10px] text-slate-400 italic">Trigger: {penalty.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restrictive Practices & Governance Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Restrictive Practices */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Reported Practices
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {restrictivePracticesSummary.totalReported}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">under NDIS Rules</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Chemical, Env, Mech, Phys</span>
        </div>

        {/* Authorized vs Unauthorized */}
        <div className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 shadow-sm ${
          restrictivePracticesSummary.unauthorizedCount > 0 ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            State Authorization
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                restrictivePracticesSummary.unauthorizedCount > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {restrictivePracticesSummary.authorizedCount} / {restrictivePracticesSummary.totalReported}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Authorized</span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {restrictivePracticesSummary.unauthorizedCount > 0
              ? `${restrictivePracticesSummary.unauthorizedCount} Missing State Ref`
              : '100% Lawfully Registered'}
          </span>
        </div>

        {/* Prohibited Restraints Hold Safety */}
        <div className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 shadow-sm ${
          restrictivePracticesSummary.prohibitedDetected ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Rule 8 Hold Safety
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {restrictivePracticesSummary.prohibitedDetected ? (
              <>
                <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
                <span className="text-sm font-bold font-mono text-rose-400 uppercase">Violation</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold font-mono text-emerald-400 uppercase">Safe (0 Prohibited)</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">
            {restrictivePracticesSummary.prohibitedDetected ? 'Prone/Supine hold detected' : 'No prohibited holds found'}
          </span>
        </div>

        {/* Active Red Flags Action Counter */}
        <div
          onClick={onNavigateToRedFlags}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 space-y-1 cursor-pointer transition-all shadow-sm group"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block group-hover:text-amber-300 transition-colors">
            Red-Flag Safeguards
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                redFlags.length === 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {redFlags.length}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Gaps Detected</span>
          </div>
          <span className="text-[10px] text-teal-400 group-hover:underline font-semibold block">
            {redFlags.length > 0 ? '1-Click Remediate →' : 'All Safeguards Applied'}
          </span>
        </div>
      </div>
    </div>
  );
};
