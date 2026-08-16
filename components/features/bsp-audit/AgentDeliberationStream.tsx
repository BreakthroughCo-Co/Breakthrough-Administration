'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  AgentDeliberationTrace,
  AgentRole,
  DeliberationSentiment,
  DeliberationStage
} from '@/types/bsp-audit';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Filter,
  Search,
  Scale,
  Brain,
  Award,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Sliders,
  Activity,
  Layers
} from 'lucide-react';

interface AgentDeliberationStreamProps {
  traces: AgentDeliberationTrace[];
  isLiveStreaming?: boolean;
  onSelectIndicator?: (indicatorId: string) => void;
}

const AGENT_CONFIGS: Record<
  AgentRole,
  {
    name: string;
    title: string;
    avatar: string;
    badgeClass: string;
    borderClass: string;
    bgClass: string;
    textClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  human_rights_legal_safeguards: {
    name: 'Advocate Julian Vance',
    title: 'Human Rights & Legal Safeguards Agent',
    avatar: '⚖️',
    badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    borderClass: 'border-indigo-500/40',
    bgClass: 'bg-indigo-950/20',
    textClass: 'text-indigo-400',
    icon: Scale
  },
  clinical_pbs_specialist: {
    name: 'Dr. Alistair Chen, BCBA-D',
    title: 'Clinical PBS Specialist Agent',
    avatar: '🧠',
    badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    borderClass: 'border-teal-500/40',
    bgClass: 'bg-teal-950/20',
    textClass: 'text-teal-400',
    icon: Brain
  },
  quality_panel_lead_synthesizer: {
    name: 'Dr. Evelyn Ross (APO Lead)',
    title: 'Quality Panel Lead Synthesizer',
    avatar: '👩‍⚕️',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    bgClass: 'bg-amber-950/20',
    textClass: 'text-amber-400',
    icon: Award
  }
};

const STAGE_LABELS: Record<DeliberationStage, { label: string; icon: string }> = {
  initial_screening: { label: 'Initial Screening', icon: '🔍' },
  specialist_analysis: { label: 'Specialist Analysis', icon: '🔬' },
  consensus_debate: { label: 'Consensus Debate', icon: '⚡' },
  final_synthesis: { label: 'Final Synthesis', icon: '📋' }
};

const SENTIMENT_CONFIGS: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  support: { label: 'Support', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle2 },
  compliant: { label: 'Compliant', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle2 },
  consensus_reached: { label: 'Consensus Reached', bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-400', icon: Sparkles },
  concern: { label: 'Concern Raised', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle },
  warning: { label: 'Warning', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle },
  critical_dissent: { label: 'Critical Dissent', bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', icon: Flame },
  critical_breach: { label: 'Critical Breach', bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', icon: Flame },
  remediated: { label: 'Remediated', bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400', icon: Check }
};

export const AgentDeliberationStream: React.FC<AgentDeliberationStreamProps> = ({
  traces,
  isLiveStreaming = false,
  onSelectIndicator
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(traces.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number | 'instant'>(1); // 1x, 2x, 4x, instant
  const [selectedAgent, setSelectedAgent] = useState<'all' | AgentRole>('all');
  const [selectedStage, setSelectedStage] = useState<'all' | DeliberationStage>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTraceIds, setExpandedTraceIds] = useState<Set<string>>(new Set());
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize playback mode if traces change
  useEffect(() => {
    setVisibleCount(traces.length);
  }, [traces.length]);

  // Handle animated streaming timer
  useEffect(() => {
    if (isPlaying && speed !== 'instant') {
      const intervalMs = Math.max(300, Math.floor(1500 / (speed as number)));
      intervalRef.current = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= traces.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, traces.length]);

  // Auto-scroll to bottom on new trace
  useEffect(() => {
    if (autoScroll && containerRef.current && isPlaying) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount, autoScroll, isPlaying]);

  const handleTogglePlay = () => {
    if (!isPlaying && visibleCount >= traces.length) {
      setVisibleCount(1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setVisibleCount((prev) => Math.min(traces.length, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setVisibleCount(1);
  };

  const handleShowAll = () => {
    setIsPlaying(false);
    setVisibleCount(traces.length);
  };

  const toggleExpand = (id: string) => {
    setExpandedTraceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered slice of visible traces
  const visibleTraces = useMemo(() => {
    const currentStream = traces.slice(0, visibleCount);
    return currentStream.filter((trace) => {
      if (selectedAgent !== 'all' && trace.agentRole !== selectedAgent) return false;
      if (selectedStage !== 'all' && trace.stage !== selectedStage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const msg = (trace.message || '').toLowerCase();
        const reason = (trace.reasoning || '').toLowerCase();
        const rules = (trace.citedRules || []).join(' ').toLowerCase();
        const focus = (trace.focusIndicator || trace.indicatorId || '').toLowerCase();
        return msg.includes(q) || reason.includes(q) || rules.includes(q) || focus.includes(q);
      }
      return true;
    });
  }, [traces, visibleCount, selectedAgent, selectedStage, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Control & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
        {/* Playback Controls & Progress */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Stream' : visibleCount >= traces.length ? 'Replay Stream' : 'Play Stream'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={visibleCount >= traces.length || isPlaying}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
              title="Step forward 1 deliberation turn"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Step</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title="Reset stream to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleShowAll}
              className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700"
            >
              Show All ({traces.length})
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono px-1.5 uppercase">Speed:</span>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s as number)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded font-bold transition-colors ${
                  speed === s ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Stream Progress Counter */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${traces.length > 0 ? (visibleCount / traces.length) * 100 : 0}%` }}
              />
            </div>
            <span>
              {visibleCount} / {traces.length} Traces
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {/* Agent Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedAgent('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedAgent === 'all'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 3 Agents</span>
            </button>

            {(['human_rights_legal_safeguards', 'clinical_pbs_specialist', 'quality_panel_lead_synthesizer'] as AgentRole[]).map(
              (role) => {
                const cfg = AGENT_CONFIGS[role];
                const IconComponent = cfg.icon;
                const isSelected = selectedAgent === role;
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedAgent(role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? `${cfg.badgeClass} ring-1 ring-teal-500/50 shadow-sm`
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    <span className="text-xs">{cfg.avatar}</span>
                    <span>{cfg.title.split(' ')[0]} {cfg.title.split(' ')[1]}</span>
                  </button>
                );
              }
            )}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliberation reasoning, regulations, indicators..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Deliberation Trace Stream Feed */}
      <div
        ref={containerRef}
        className="max-h-[560px] overflow-y-auto space-y-3.5 pr-1 modal-scroll"
      >
        {visibleTraces.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-400">No deliberation traces match current filter criteria.</p>
            <button
              onClick={() => {
                setSelectedAgent('all');
                setSelectedStage('all');
                setSearchQuery('');
              }}
              className="text-xs text-teal-400 hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          visibleTraces.map((trace, index) => {
            const agentCfg = AGENT_CONFIGS[trace.agentRole] || AGENT_CONFIGS.quality_panel_lead_synthesizer;
            const sentimentCfg = SENTIMENT_CONFIGS[trace.sentiment] || SENTIMENT_CONFIGS.support;
            const stageCfg = STAGE_LABELS[trace.stage] || { label: trace.stage, icon: '📌' };
            const isExpanded = expandedTraceIds.has(trace.id);
            const SentimentIcon = sentimentCfg.icon;

            return (
              <div
                key={trace.id}
                className={`bg-slate-900 border ${agentCfg.borderClass} rounded-xl p-4 transition-all duration-200 animate-slideUp shadow-lg space-y-3`}
              >
                {/* Trace Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-3">
                    {/* Agent Avatar Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shadow-inner ${agentCfg.bgClass} ${agentCfg.borderClass}`}
                    >
                      <span>{trace.agentAvatar || agentCfg.avatar}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{trace.agentName}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${agentCfg.badgeClass}`}
                        >
                          {agentCfg.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <span>{stageCfg.icon}</span>
                          <span>{stageCfg.label}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {new Date(trace.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment & Score Badge */}
                  <div className="flex items-center gap-2">
                    {trace.scoreAwarded !== undefined && (
                      <span className="text-[11px] font-mono font-bold bg-slate-950 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                        Score: {trace.scoreAwarded}%
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${sentimentCfg.bg} ${sentimentCfg.text}`}
                    >
                      <SentimentIcon className="w-3 h-3" />
                      <span>{sentimentCfg.label}</span>
                    </span>
                  </div>
                </div>

                {/* Main Deliberation Message */}
                <div className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-3 rounded-lg border border-slate-800/70">
                  {trace.message}
                </div>

                {/* Focus Indicator & Expandable Details Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(trace.focusIndicator || trace.indicatorId) && (
                      <button
                        onClick={() =>
                          onSelectIndicator &&
                          onSelectIndicator(trace.indicatorId || trace.focusIndicator || '')
                        }
                        className="text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-teal-400 font-bold px-2 py-0.5 rounded border border-teal-500/30 flex items-center gap-1 transition-colors"
                        title="Click to view indicator in matrix"
                      >
                        <Activity className="w-3 h-3 text-teal-400" />
                        <span>Focus: {trace.indicatorId || trace.focusIndicator}</span>
                      </button>
                    )}

                    {trace.citedRules && trace.citedRules.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-500" />
                        <span>{trace.citedRules.length} Rule(s) Cited</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(trace.id)}
                    className="text-[11px] text-slate-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Reasoning & Citations' : 'View Reasoning & Citations'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Section: Reasoning, Cited Regulations, Proposed Remediation */}
                {isExpanded && (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3 text-xs animate-fadeIn">
                    {trace.reasoning && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Clinical & Legal Reasoning Trace
                        </span>
                        <p className="text-slate-300 leading-relaxed font-sans">{trace.reasoning}</p>
                      </div>
                    )}

                    {trace.citedRules && trace.citedRules.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Governing Statutory Rules & Frameworks Cited
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {trace.citedRules.map((rule, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono bg-slate-900 text-indigo-300 px-2 py-1 rounded border border-indigo-500/20 font-medium"
                            >
                              § {rule}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {trace.proposedRemediation && (
                      <div className="p-2.5 bg-teal-950/30 border border-teal-500/30 rounded-lg space-y-1">
                        <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Proposed Remediation: {trace.proposedRemediation.remediationLabel}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-mono">
                          Target Field: <code className="text-amber-300">{trace.proposedRemediation.fieldToUpdate}</code>
                        </p>
                        <p className="text-[11px] text-slate-300 italic">
                          "{trace.proposedRemediation.suggestedText}"
                        </p>
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
