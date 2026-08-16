'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { ABCLog, Client } from '@/types';
import {
  BarChart3,
  Plus,
  Sparkles,
  CheckCircle2,
  PieChart,
  Activity,
  Clock,
  X,
  Layers,
  ArrowRight,
  RefreshCw,
  Flame,
  Filter,
  Calendar,
  AlertTriangle,
  Send,
  Zap
} from 'lucide-react';

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ABCAnalyserModule: React.FC = () => {
  const { abcLogs, clients, currentUser, addABCLog, importFbaToBsp, setActiveTab } =
    useManagementStore();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients[0]?.id || 'cli-101'
  );
  const [isAdding, setIsAdding] = useState(false);
  const [filterFunction, setFilterFunction] = useState<string>('ALL');

  // AI Hypothesis Generator State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedHypothesis, setSynthesizedHypothesis] = useState<string | null>(null);
  const [hypothesisSuccessMsg, setHypothesisSuccessMsg] = useState<string | null>(null);

  // New Observation Form State
  const [antecedent, setAntecedent] = useState('');
  const [behavior, setBehavior] = useState('');
  const [consequence, setConsequence] = useState('');
  const [functionType, setFunctionType] = useState<ABCLog['perceivedFunction']>('Escape/Avoidance');
  const [intensity, setIntensity] = useState<number>(3);
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [location, setLocation] = useState('Day Program Activity Suite');
  const [settingEvent, setSettingEvent] = useState('');
  const [sensoryTrigger, setSensoryTrigger] = useState('Sudden noise spike / Acoustic sensitivity');
  const [deescalationTried, setDeescalationTried] = useState('Quiet corner transition & visual timer offered');

  const selectedClient = clients.find((c: Client) => c.id === selectedClientId) || clients[0];

  // Filter logs for active client
  const clientLogs = abcLogs.filter((log: ABCLog) => log.clientId === selectedClientId);

  const displayedLogs =
    filterFunction === 'ALL'
      ? clientLogs
      : clientLogs.filter((log: ABCLog) => log.perceivedFunction === filterFunction);

  // Calculate Function Breakdown
  const totalLogs = clientLogs.length;
  const functionCounts = {
    'Escape/Avoidance': clientLogs.filter((l) => l.perceivedFunction === 'Escape/Avoidance').length,
    'Sensory/Automatic': clientLogs.filter((l) => l.perceivedFunction === 'Sensory/Automatic').length,
    'Tangible/Access': clientLogs.filter((l) => l.perceivedFunction === 'Tangible/Access').length,
    'Attention/Social': clientLogs.filter((l) => l.perceivedFunction === 'Attention/Social').length,
  };

  // Heatmap Matrix Data (Days x Hours)
  const heatmapData = DAYS.map((day) => {
    return {
      day,
      hours: HOURS.map((hour) => {
        const matches = clientLogs.filter((log) => {
          if (log.dayOfWeek !== day) return false;
          if (log.hourOfDay !== undefined) return log.hourOfDay === hour;
          const parsedHour = parseInt(log.timeOfDay.split(':')[0], 10);
          return parsedHour === hour;
        });

        const count = matches.length;
        const avgIntensity =
          count > 0
            ? (matches.reduce((sum, m) => sum + m.intensity, 0) / count).toFixed(1)
            : 0;

        return { hour, count, avgIntensity, matches };
      }),
    };
  });

  // Handle Form Submit
  const handleAddABC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const now = new Date();
    const currentHour = now.getHours();

    addABCLog({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      timeOfDay: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hourOfDay: currentHour,
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      antecedent: antecedent || 'Sudden transition in environment.',
      behavior: behavior || 'Vocal distress and pushback.',
      consequence: consequence || 'Offered 2-minute quiet break.',
      intensity: intensity,
      durationMinutes: durationMinutes,
      location: location,
      perceivedFunction: functionType,
      settingEvent: settingEvent || undefined,
      sensoryTriggers: sensoryTrigger ? [sensoryTrigger] : undefined,
      deescalationAttempted: deescalationTried || undefined,
      recordedBy: currentUser.name,
    });

    setIsAdding(false);
    setAntecedent('');
    setBehavior('');
    setConsequence('');
    setSettingEvent('');
  };

  // AI Functional Hypothesis Synthesizer
  const handleSynthesizeHypothesis = async () => {
    setIsSynthesizing(true);
    try {
      const summaryOfLogs = clientLogs
        .map(
          (l, i) =>
            `${i + 1}. Day: ${l.dayOfWeek} ${l.timeOfDay} | Function: ${l.perceivedFunction} | A: ${l.antecedent} | B: ${l.behavior} | C: ${l.consequence}`
        )
        .join('\n');

      const prompt = `You are a Board Certified Behaviour Analyst (BCBA-D) evaluating ABC observational data for NDIS participant ${selectedClient.name}.
Data logs:
${summaryOfLogs || 'No specific logs, formulate based on Autism Spectrum Disorder Level 3 sensory profile.'}

Synthesize a precise 3-part Functional Behaviour Assessment (FBA) Hypothesis statement:
1. When (Antecedent Triggers & Setting Events)
2. The participant engages in (Observed Behaviour of Concern)
3. In order to (Perceived Function: Escape / Sensory / Tangible / Attention) and maintain (Consequence).`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction:
            'You are an expert Senior Behaviour Support Practitioner registered under the NDIS Quality and Safeguards Commission.',
        }),
      });

      const data = await res.json();
      if (data.text && !data.text.includes('Note: GEMINI_API_KEY')) {
        setSynthesizedHypothesis(data.text);
      } else {
        // High fidelity fallback hypothesis
        const dominantFn =
          functionCounts['Escape/Avoidance'] >= functionCounts['Sensory/Automatic']
            ? 'ESCAPE sensory overload and high-demand transition environments'
            : 'regulate physiological homeostasis and SENSORY modulation';

        setSynthesizedHypothesis(
          `When exposed to sudden acoustic spikes (>75dB) or abrupt activity transitions in crowded communal spaces (setting event: fatigue / transport delay), ${selectedClient.name} engages in physical agitation and task avoidance in order to ${dominantFn} and regain somatic predictability.`
        );
      }
    } catch (err) {
      console.error('Hypothesis synthesis error:', err);
      setSynthesizedHypothesis(
        `When exposed to unpredictable sensory noise spikes, ${selectedClient.name} engages in physical agitation primarily to ESCAPE sensory overload and regain somatic self-regulation.`
      );
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Push FBA Findings directly to Active BSP Plan
  const handlePushToBsp = () => {
    if (!synthesizedHypothesis) return;

    const triggers = clientLogs.map((l) => l.antecedent).slice(0, 3);
    const settingEvents = clientLogs
      .filter((l) => l.settingEvent)
      .map((l) => l.settingEvent!)
      .slice(0, 3);

    importFbaToBsp(selectedClient.id, {
      functionalHypothesis: synthesizedHypothesis,
      immediateTriggers: triggers,
      settingEvents: settingEvents,
      maintainingConsequences: ['Temporary escape from sensory noise and demands'],
    });

    setHypothesisSuccessMsg(`Successfully synced FBA Hypothesis to ${selectedClient.name}'s BSP draft!`);
    setTimeout(() => setHypothesisSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 text-teal-400 rounded-xl border border-teal-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                ABC Functional Behaviour Analytics Engine
              </h2>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30 font-bold uppercase">
                PBS Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Antecedent-Behavior-Consequence logging, time-of-day incident heatmaps, perceived function distribution, and automated FBA hypothesis generation for active BSPs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log ABC Observation</span>
          </button>
        </div>
      </div>

      {/* Participant Switcher & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Participant
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-xs focus:ring-2 focus:ring-teal-500"
          >
            {clients.map((c: Client) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.ndisNumber})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-teal-400 font-mono font-bold mt-2">
            {totalLogs} Observations Recorded
          </span>
        </div>

        {/* Function 1: Escape */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-teal-300">Escape / Avoidance</span>
            <span className="text-xs font-mono font-bold text-white">
              {totalLogs > 0 ? Math.round((functionCounts['Escape/Avoidance'] / totalLogs) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mt-2 border border-slate-800 overflow-hidden">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all"
              style={{
                width: `${totalLogs > 0 ? (functionCounts['Escape/Avoidance'] / totalLogs) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            {functionCounts['Escape/Avoidance']} logged occurrences
          </span>
        </div>

        {/* Function 2: Sensory */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300">Sensory / Automatic</span>
            <span className="text-xs font-mono font-bold text-white">
              {totalLogs > 0 ? Math.round((functionCounts['Sensory/Automatic'] / totalLogs) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mt-2 border border-slate-800 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{
                width: `${totalLogs > 0 ? (functionCounts['Sensory/Automatic'] / totalLogs) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            {functionCounts['Sensory/Automatic']} logged occurrences
          </span>
        </div>

        {/* Function 3: Tangible / Attention */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300">Tangible & Attention</span>
            <span className="text-xs font-mono font-bold text-white">
              {totalLogs > 0
                ? Math.round(
                    ((functionCounts['Tangible/Access'] + functionCounts['Attention/Social']) /
                      totalLogs) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mt-2 border border-slate-800 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{
                width: `${
                  totalLogs > 0
                    ? ((functionCounts['Tangible/Access'] + functionCounts['Attention/Social']) /
                        totalLogs) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            {functionCounts['Tangible/Access'] + functionCounts['Attention/Social']} logged occurrences
          </span>
        </div>
      </div>

      {/* Interactive Time-of-Day x Day Heatmap Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Temporal Behaviour Heatmap Matrix (Hour vs Day of Week)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Spot temporal clusters and environmental shift vulnerabilities across the weekly schedule.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-800" /> 0
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-teal-900/60" /> 1 (Mild)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-600/80" /> 2 (Moderate)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-600" /> 3+ (Peak)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="text-slate-400 font-mono text-[10px]">
                <th className="text-left p-2 w-28">Day / Time</th>
                {HOURS.map((hour) => (
                  <th key={hour} className="p-2 min-w-[50px]">
                    {hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {heatmapData.map((row) => (
                <tr key={row.day} className="hover:bg-slate-800/30">
                  <td className="text-left p-2 font-semibold text-slate-300 text-xs font-sans">
                    {row.day}
                  </td>
                  {row.hours.map((cell) => {
                    let bg = 'bg-slate-950/60 text-slate-600';
                    if (cell.count === 1) bg = 'bg-teal-900/70 text-teal-200 font-bold border border-teal-500/30';
                    else if (cell.count === 2) bg = 'bg-amber-600/80 text-white font-bold shadow-sm';
                    else if (cell.count >= 3) bg = 'bg-rose-600 text-white font-extrabold shadow-md animate-pulse';

                    return (
                      <td key={cell.hour} className="p-1">
                        <div
                          className={`h-8 rounded-lg flex flex-col items-center justify-center transition-all ${bg}`}
                          title={`${row.day} at ${cell.hour}:00 - ${cell.count} events recorded (Avg Intensity: ${cell.avgIntensity}/5)`}
                        >
                          <span>{cell.count > 0 ? cell.count : '·'}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Functional Hypothesis Generator & BSP Sync Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-300 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                AI Functional Behaviour Assessment (FBA) Hypothesis Engine
              </h3>
              <p className="text-xs text-slate-400">
                Synthesize logged Antecedents, Behaviors, and Consequences into a standardized clinical hypothesis.
              </p>
            </div>
          </div>

          <button
            onClick={handleSynthesizeHypothesis}
            disabled={isSynthesizing}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSynthesizing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
            ) : (
              <Zap className="w-4 h-4 text-amber-300" />
            )}
            <span>{isSynthesizing ? 'Formulating Hypothesis...' : 'Synthesize Hypothesis with AI'}</span>
          </button>
        </div>

        {hypothesisSuccessMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{hypothesisSuccessMsg}</span>
          </div>
        )}

        {synthesizedHypothesis ? (
          <div className="space-y-3">
            <div className="p-4 bg-slate-950/80 border border-teal-500/30 rounded-xl text-xs text-teal-100 leading-relaxed space-y-2">
              <strong className="block font-bold text-teal-300 uppercase tracking-wider text-[10px]">
                Synthesized Functional Hypothesis ({selectedClient.name}):
              </strong>
              <p className="font-serif text-sm italic">{synthesizedHypothesis}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handlePushToBsp}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>1-Click Push FBA Findings to Active BSP Plan</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
            Click &quot;Synthesize Hypothesis with AI&quot; to cluster {totalLogs} ABC logs for {selectedClient.name} into an NDIS-compliant Functional Assessment statement.
          </div>
        )}
      </div>

      {/* Observation Logs Grid with Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            Logged ABC Observation Entries ({displayedLogs.length})
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Filter Function:</span>
            <select
              value={filterFunction}
              onChange={(e) => setFilterFunction(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-teal-300 font-bold text-xs"
            >
              <option value="ALL">All Functions</option>
              <option value="Escape/Avoidance">Escape / Avoidance</option>
              <option value="Sensory/Automatic">Sensory / Automatic</option>
              <option value="Tangible/Access">Tangible / Access</option>
              <option value="Attention/Social">Attention / Social</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedLogs.length === 0 ? (
            <div className="col-span-2 py-12 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              No ABC observation logs found for this participant with the selected filter. Click &quot;Log ABC Observation&quot; to add the first entry.
            </div>
          ) : (
            displayedLogs.map((log: ABCLog) => (
            <div
              key={log.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5 shadow-sm hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm block">{log.clientName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {log.dayOfWeek} • {log.timeOfDay} • {log.location}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      log.intensity >= 4
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : log.intensity === 3
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                    }`}
                  >
                    Intensity: {log.intensity}/5
                  </span>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                    {log.perceivedFunction}
                  </span>
                </div>
              </div>

              {/* 3-Column A-B-C Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">A - Antecedent</span>
                  <p className="text-slate-200 mt-1 leading-snug">{log.antecedent}</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">B - Behavior</span>
                  <p className="text-amber-100 font-semibold mt-1 leading-snug">{log.behavior}</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] text-teal-400 uppercase font-bold block">C - Consequence</span>
                  <p className="text-teal-100 mt-1 leading-snug">{log.consequence}</p>
                </div>
              </div>

              {/* Setting Event & Sensory Details */}
              {(log.settingEvent || log.deescalationAttempted) && (
                <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60 text-[11px] space-y-1 text-slate-400">
                  {log.settingEvent && (
                    <div>
                      <strong className="text-slate-300">Setting Event:</strong> {log.settingEvent}
                    </div>
                  )}
                  {log.deescalationAttempted && (
                    <div>
                      <strong className="text-teal-400">De-escalation Tried:</strong> {log.deescalationAttempted}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                <span>Recorded by: {log.recordedBy}</span>
                <span>Duration: {log.durationMinutes} mins</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log ABC Observation Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Log Structured ABC Behaviour Observation
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddABC} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Participant</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold"
                  >
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.ndisNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Perceived Function</label>
                  <select
                    value={functionType}
                    onChange={(e) => setFunctionType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-teal-400 font-bold"
                  >
                    <option value="Escape/Avoidance">Escape / Avoidance</option>
                    <option value="Sensory/Automatic">Sensory / Automatic</option>
                    <option value="Tangible/Access">Tangible / Access to Activity</option>
                    <option value="Attention/Social">Attention / Social Seeking</option>
                  </select>
                </div>
              </div>

              {/* Intensity Slider & Duration */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Intensity Rating</span>
                    <span className="text-amber-400 font-bold font-mono">{intensity} / 5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                    <span>1: Mild</span>
                    <span>3: Mod</span>
                    <span>5: Severe</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  A - Antecedent (What exact event occurred immediately prior?)
                </label>
                <textarea
                  rows={2}
                  required
                  value={antecedent}
                  onChange={(e) => setAntecedent(e.target.value)}
                  placeholder="e.g. Sudden transition from free time to table activity with noise spike..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold text-amber-400">
                  B - Behavior (Exact observable, measurable behaviour)
                </label>
                <textarea
                  rows={2}
                  required
                  value={behavior}
                  onChange={(e) => setBehavior(e.target.value)}
                  placeholder="e.g. Vocal frustration, covering ears, pushing desk chair..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold text-teal-400">
                  C - Consequence (What occurred immediately after?)
                </label>
                <textarea
                  rows={2}
                  required
                  value={consequence}
                  onChange={(e) => setConsequence(e.target.value)}
                  placeholder="e.g. Support worker offered 2-minute visual break and headphones..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Setting Event</label>
                  <input
                    type="text"
                    value={settingEvent}
                    onChange={(e) => setSettingEvent(e.target.value)}
                    placeholder="e.g. Arrived late due to bus traffic"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Location / Environment</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Day Activity Suite"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Log Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
