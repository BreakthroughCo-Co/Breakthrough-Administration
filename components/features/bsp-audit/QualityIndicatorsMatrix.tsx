'use client';

import React, { useState, useMemo } from 'react';
import {
  NDISQualityIndicatorId,
  NDISQualityIndicatorResult,
  RegulatoryPillar
} from '@/types/bsp-audit';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Check,
  Layers,
  Scale,
  Brain,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

interface QualityIndicatorsMatrixProps {
  indicatorResults: NDISQualityIndicatorResult[];
  selectedPillarFilter?: RegulatoryPillar | 'all';
  onRemediateIndicator?: (indicatorId: NDISQualityIndicatorId) => void;
}

const PILLAR_META: Record<
  RegulatoryPillar,
  { label: string; icon: React.ComponentType<{ className?: string }>; badge: string }
> = {
  human_rights_legal: {
    label: 'Human Rights & Legal Safeguards',
    icon: Scale,
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
  },
  clinical_pbs_formulation: {
    label: 'Evidence-Based Clinical PBS',
    icon: Brain,
    badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30'
  },
  proactive_skill_building: {
    label: 'Proactive Environmental Supports',
    icon: Sparkles,
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
  },
  crisis_reduction_safeguards: {
    label: 'Crisis Management & Governance',
    icon: ShieldCheck,
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  }
};

export const QualityIndicatorsMatrix: React.FC<QualityIndicatorsMatrixProps> = ({
  indicatorResults,
  selectedPillarFilter = 'all',
  onRemediateIndicator
}) => {
  const [activePillar, setActivePillar] = useState<RegulatoryPillar | 'all'>(selectedPillarFilter);
  const [statusFilter, setStatusFilter] = useState<'all' | 'compliant' | 'warning' | 'non_compliant'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Set<NDISQualityIndicatorId>>(
    new Set(indicatorResults.map((r) => r.id)) // default all open for high visibility
  );

  // Sync selectedPillarFilter prop changes
  React.useEffect(() => {
    if (selectedPillarFilter) {
      setActivePillar(selectedPillarFilter);
    }
  }, [selectedPillarFilter]);

  const toggleExpand = (id: NDISQualityIndicatorId) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedCards(new Set(indicatorResults.map((r) => r.id)));
  };

  const handleCollapseAll = () => {
    setExpandedCards(new Set());
  };

  // Filtered indicators
  const filteredIndicators = useMemo(() => {
    return indicatorResults.filter((ind) => {
      if (activePillar !== 'all' && ind.pillar !== activePillar) return false;
      if (statusFilter !== 'all' && ind.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = ind.id.toLowerCase().includes(q);
        const nameMatch = ind.name.toLowerCase().includes(q);
        const evidenceMatch = ind.evidenceFound.some((e) => e.toLowerCase().includes(q));
        const gapsMatch = ind.gapsIdentified.some((g) => g.toLowerCase().includes(q));
        const regMatch = ind.citedRegulations.some((r) => r.toLowerCase().includes(q));
        return idMatch || nameMatch || evidenceMatch || gapsMatch || regMatch;
      }
      return true;
    });
  }, [indicatorResults, activePillar, statusFilter, searchQuery]);

  const passedCount = indicatorResults.filter((r) => r.passed).length;
  const warningCount = indicatorResults.filter((r) => r.status === 'warning').length;
  const criticalCount = indicatorResults.filter((r) => r.status === 'non_compliant').length;

  return (
    <div className="space-y-4">
      {/* Filters, Search & Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              12 NDIS Quality Indicators Rubric
            </span>
            <span className="text-[11px] font-mono bg-slate-950 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-800">
              <strong className="text-emerald-400">{passedCount}</strong> / 12 Passed
            </span>
            {criticalCount > 0 && (
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-500/30">
                {criticalCount} Critical Gap(s)
              </span>
            )}
          </div>

          {/* Expand/Collapse Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleExpandAll}
              className="text-slate-400 hover:text-slate-200 font-semibold transition-colors"
            >
              Expand All
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={handleCollapseAll}
              className="text-slate-400 hover:text-slate-200 font-semibold transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Pillar Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800/80">
          <button
            onClick={() => setActivePillar('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activePillar === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Pillars (12)
          </button>

          {(Object.keys(PILLAR_META) as RegulatoryPillar[]).map((pillarKey) => {
            const meta = PILLAR_META[pillarKey];
            const IconComponent = meta.icon;
            const isSelected = activePillar === pillarKey;
            const count = indicatorResults.filter((r) => r.pillar === pillarKey).length;

            return (
              <button
                key={pillarKey}
                onClick={() => setActivePillar(pillarKey)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? `${meta.badge} ring-1 ring-teal-500/40 shadow-sm`
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{meta.label.split(' ')[0]} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Status Filters and Search Query */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('compliant')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded font-semibold transition-colors ${
                statusFilter === 'compliant'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Compliant ({passedCount})
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded font-semibold transition-colors ${
                statusFilter === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Warning ({warningCount})
            </button>
            <button
              onClick={() => setStatusFilter('non_compliant')}
              className={`px-2 py-0.5 text-[11px] font-mono rounded font-semibold transition-colors ${
                statusFilter === 'non_compliant'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Gaps ({criticalCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search QI title, regulations, evidence, gaps..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 12 Quality Indicators Card Grid */}
      <div className="space-y-3">
        {filteredIndicators.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl">
            <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400">No quality indicators match current filter criteria.</p>
            <button
              onClick={() => {
                setActivePillar('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-teal-400 hover:underline mt-1 font-medium"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredIndicators.map((ind) => {
            const isExpanded = expandedCards.has(ind.id);
            const pillarMeta = PILLAR_META[ind.pillar];
            const weightPercent = Math.round(ind.weight * 100);

            const statusClass =
              ind.status === 'compliant'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : ind.status === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

            const scoreColor =
              ind.score >= 80
                ? 'text-emerald-400'
                : ind.score >= 60
                ? 'text-amber-400'
                : 'text-rose-400';

            return (
              <div
                key={ind.id}
                className={`bg-slate-900 border ${
                  ind.status === 'non_compliant'
                    ? 'border-rose-500/40'
                    : ind.status === 'warning'
                    ? 'border-amber-500/40'
                    : 'border-slate-800'
                } rounded-xl p-4 transition-all duration-200 shadow-md space-y-3`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Indicator ID Badge */}
                    <div className="w-12 h-10 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white shadow-inner">
                      {ind.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white">{ind.name}</h4>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${pillarMeta.badge}`}>
                          {pillarMeta.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          Weight: {weightPercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>Pillar Sub-weight: {Math.round(ind.pillarWeight * 100)}%</span>
                        {ind.citedRegulations && ind.citedRegulations.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-indigo-300 text-[10px]">
                              {ind.citedRegulations[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score & Status Action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-base font-extrabold font-mono ${scoreColor}`}>
                          {ind.score}%
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusClass}`}
                        >
                          {ind.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(ind.id)}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      ind.score >= 80
                        ? 'bg-emerald-500'
                        : ind.score >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, ind.score))}%` }}
                  />
                </div>

                {/* Expanded Details: Evidence Found, Identified Gaps & Remediation */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t border-slate-800/80 animate-fadeIn text-xs">
                    {/* Evidence & Gaps Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Evidence Found */}
                      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Evidence Found in BSP ({ind.evidenceFound.length})</span>
                        </div>
                        {ind.evidenceFound.length > 0 ? (
                          <ul className="space-y-1 text-[11px] text-slate-300">
                            {ind.evidenceFound.map((ev, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-400 mt-0.5">•</span>
                                <span className="leading-relaxed">{ev}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[11px] text-slate-500 italic">No positive evidence detected for this indicator.</p>
                        )}
                      </div>

                      {/* Gaps Identified */}
                      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Identified Compliance Gaps ({ind.gapsIdentified.length})</span>
                        </div>
                        {ind.gapsIdentified.length > 0 ? (
                          <ul className="space-y-1 text-[11px] text-slate-300">
                            {ind.gapsIdentified.map((gap, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-rose-400 mt-0.5">•</span>
                                <span className="leading-relaxed">{gap}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Zero compliance gaps detected. Fully satisfied standard.</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remediation Suggestion and Action */}
                    {ind.remediationSuggestion && (
                      <div className="bg-teal-950/30 border border-teal-500/30 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="space-y-0.5 max-w-xl">
                          <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                            <span>Clinical Safeguard Recommendation</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            {ind.remediationSuggestion}
                          </p>
                        </div>

                        {onRemediateIndicator && ind.status !== 'compliant' && (
                          <button
                            onClick={() => onRemediateIndicator(ind.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shrink-0 active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>1-Click Remediate</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Cited NDIS Regulations */}
                    {ind.citedRegulations && ind.citedRegulations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                          Governing Standards:
                        </span>
                        {ind.citedRegulations.map((reg, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono bg-slate-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20"
                          >
                            {reg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
