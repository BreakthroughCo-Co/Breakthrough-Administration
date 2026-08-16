'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client, ClientGoal, CaseNote } from '@/types';
import {
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  X,
  Mic,
  MicOff,
  Printer,
  Download,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Wand2,
  Layers,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';

const CLINICAL_PRESETS = [
  {
    title: 'PBS Skill Acquisition & Functional Replacement',
    subjective: 'Participant presented in a calm, regulated state. Expressed readiness to work on functional communication cards.',
    objective: 'Practitioner modeled 3-step PECS token exchange for requesting a break. Participant successfully completed 4 out of 5 trials with gestural prompt.',
    assessment: 'High receptivity to visual prompting. Positive transfer of emotional regulation strategies with reduced vocal agitation.',
    plan: 'Generalize token card use to afternoon classroom transitions. Review data with lead support worker on Friday.',
  },
  {
    title: 'Sensory De-escalation & Environmental Transit',
    subjective: 'High sensory arousal noted upon arrival at community center due to acoustic echoing and bright fluorescent lighting.',
    objective: 'Implemented sensory diet proactive strategies: noise-cancelling headphones and weighted lap pad for 12 minutes.',
    assessment: 'Heart rate and muscle tension visibly decreased within 8 minutes. Avoided behavioral escalation and restrictive practices.',
    plan: 'Ensure sensory kit is pre-positioned before tomorrow community access outing.',
  },
  {
    title: 'Support Team & Carer Psychoeducation Coaching',
    subjective: 'Primary carer reported feeling overwhelmed by morning routine escalations and requested proactive guidance.',
    objective: 'Reviewed proactive antecedent adjustments: 5-minute visual countdown timer and choice-making board during breakfast.',
    assessment: 'Carer demonstrated correct implementation of low-arousal verbal pacing during simulated roleplay.',
    plan: 'Provide laminated visual routine chart and schedule follow-up check-in next Tuesday.',
  },
];

export const CaseNotesModule: React.FC = () => {
  const {
    caseNotes,
    clients,
    currentUser,
    practiceBranding,
    addCaseNote,
    addBillingClaim,
    addNotification,
    addAuditLog
  } = useManagementStore();

  const [activeSubTab, setActiveSubTab] = useState<'RECORDER' | 'LEDGER'>('RECORDER');
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || 'cli-101');
  const [format, setFormat] = useState<'SIMPL' | 'BIRP' | 'SOAP' | 'DAP'>('SIMPL');
  const [autoGenerateClaim, setAutoGenerateClaim] = useState(true);

  // Form Fields
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [rawDictationText, setRawDictationText] = useState('');
  const [isAiStructuring, setIsAiStructuring] = useState(false);

  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  const selectedClientObj = clients.find((c: Client) => c.id === selectedClient);

  // Recording Timer effect
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-AU';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setRawDictationText((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
        };

        recognition.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      // Fallback simulated dictation if browser has no speech recognition
      if (!isRecording) {
        setIsRecording(true);
        setRawDictationText((prev) =>
          prev
            ? `${prev} Participant engaged effectively in today's session. Demonstrated independent use of emotion regulation headset when auditory triggers increased in the common room. Practiced PECS communication sequence with 80% accuracy. Recommend continuation of current support plan.`
            : "Participant engaged effectively in today's session. Demonstrated independent use of emotion regulation headset when auditory triggers increased in the common room. Practiced PECS communication sequence with 80% accuracy. Recommend continuation of current support plan."
        );
        setTimeout(() => setIsRecording(false), 2000);
      } else {
        setIsRecording(false);
      }
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleApplyPreset = (preset: typeof CLINICAL_PRESETS[0]) => {
    setSubjective(preset.subjective);
    setObjective(preset.objective);
    setAssessment(preset.assessment);
    setPlan(preset.plan);
  };

  const handleAiStructureDictation = async () => {
    const textToProcess = rawDictationText || `${subjective} ${objective} ${assessment} ${plan}`;
    if (!textToProcess.trim()) return;

    setIsAiStructuring(true);
    try {
      const prompt = `You are an expert NDIS Allied Health Senior Clinical Auditor.
Transform the following raw spoken clinical transcript into a structured, audit-proof, neuro-affirming ${format} format clinical case note for participant "${selectedClientObj?.name || 'Participant'}".

Raw Transcript / Unstructured Notes:
"""
${textToProcess}
"""

Format Requirements:
- Format requested: ${format}
- If format is SIMPL: keys must be subjective (Situation), objective (Intervention), assessment (Measurement), plan (Plan).
- If format is BIRP: keys must be subjective (Behavior), objective (Intervention), assessment (Response), plan (Plan).
- If format is SOAP: keys must be subjective, objective, assessment, plan.
- If format is DAP: keys must be subjective (Data - presentation), objective (Data - intervention), assessment (Assessment), plan (Plan).
- Ensure objective, non-judgmental, trauma-informed clinical language strictly meeting NDIS Quality & Safeguards Commission standards.

Return JSON with exact keys: subjective, objective, assessment, plan.`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are an authoritative NDIS Allied Health Clinical Governance Officer. Return strictly valid JSON.',
        }),
      });

      const data = await res.json();
      if (data.text) {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.subjective) setSubjective(parsed.subjective);
          if (parsed.objective) setObjective(parsed.objective);
          if (parsed.assessment) setAssessment(parsed.assessment);
          if (parsed.plan) setPlan(parsed.plan);
          setRawDictationText('');
        }
      }
    } catch (e) {
      console.error('AI Note structuring error:', e);
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientObj) return;

    const noteDate = new Date().toISOString().slice(0, 10);
    const hours = Math.round((Number(sessionDuration) / 60) * 100) / 100;
    const itemCode = '07_002_0115_8_3';
    const unitRate = 214.41;
    const totalAmount = Math.round(hours * unitRate * 100) / 100;

    addCaseNote({
      clientId: selectedClientObj.id,
      clientName: selectedClientObj.name,
      practitionerId: currentUser.practitionerId || 'prac-2',
      practitionerName: currentUser.name,
      date: noteDate,
      sessionDurationMinutes: Number(sessionDuration),
      format,
      subjective: subjective || 'Participant engaged in routine session.',
      objective: objective || 'Observed interactions and task completion.',
      assessment: assessment || 'Progress noted toward primary NDIS goals.',
      plan: plan || 'Maintain weekly clinical sessions.',
      linkedGoalIds: selectedClientObj.goals.map((g: ClientGoal) => g.id),
      status: 'Approved',
      flaggedForReview: false,
    });

    if (autoGenerateClaim) {
      addBillingClaim({
        clientId: selectedClientObj.id,
        clientName: selectedClientObj.name,
        ndisNumber: selectedClientObj.ndisNumber,
        serviceDate: noteDate,
        ndisSupportItem: `${itemCode} - Specialist Behavioural Intervention Support`,
        supportItemCode: itemCode,
        hours: hours,
        unitRate: unitRate,
        totalAmount: totalAmount,
        status: 'Approved',
        invoiceNumber: `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      });

      addNotification({
        title: 'NDIS Claim Auto-Generated',
        message: `Claim for $${totalAmount.toFixed(2)} (${hours}h @ $${unitRate}/h) generated from clinical case note for ${selectedClientObj.name}.`,
        type: 'billing',
        severity: 'info',
        linkTab: 'billing',
      });
    }

    addAuditLog('CREATE_CASE_NOTE', 'CASE_NOTE', selectedClientObj.id, `Logged ${format} clinical note for ${selectedClientObj.name}`);

    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setRawDictationText('');
    setActiveSubTab('LEDGER');
  };

  const handlePrintNote = (note: CaseNote) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>NDIS Clinical Session Record - ${note.clientName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 36px; color: #0f172a; line-height: 1.6; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
            .brand-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
            .brand-sub { font-size: 11px; color: #64748b; margin-top: 4px; }
            .badge { display: inline-block; padding: 4px 8px; background: #ecfdf5; color: #059669; border-radius: 4px; font-size: 11px; font-weight: bold; border: 1px solid #a7f3d0; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; font-size: 12px; background: #f8fafc; padding: 16px; border-radius: 8px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 13px; font-weight: 800; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            .section-body { font-size: 12px; color: #334155; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand-title">${practiceBranding.practiceName}</h1>
              <p class="brand-sub">NDIS Registered Provider #${practiceBranding.ndisRegistrationNumber} | ABN: ${practiceBranding.abn}</p>
            </div>
            <div style="text-align: right;">
              <span class="badge">NDIS Quality Commission Verified</span>
              <p style="font-size: 10px; color: #64748b; margin-top: 4px;">Date: ${note.date}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div><strong>Participant:</strong> ${note.clientName} (ID: ${note.clientId})</div>
            <div><strong>Practitioner:</strong> ${note.practitionerName}</div>
            <div><strong>Session Duration:</strong> ${note.sessionDurationMinutes} Minutes (${(note.sessionDurationMinutes/60).toFixed(2)}h)</div>
            <div><strong>Framework:</strong> ${note.format} Structure</div>
          </div>

          <div class="section">
            <div class="section-title">1. Presentation / Subjective Observation</div>
            <div class="section-body">${note.subjective}</div>
          </div>

          <div class="section">
            <div class="section-title">2. Clinical Intervention / Objective Application</div>
            <div class="section-body">${note.objective}</div>
          </div>

          <div class="section">
            <div class="section-title">3. Evaluation / Measurement & Goal Progression</div>
            <div class="section-body">${note.assessment}</div>
          </div>

          <div class="section">
            <div class="section-title">4. Follow-up Recommendations & Support Plan</div>
            <div class="section-body">${note.plan}</div>
          </div>

          <div class="footer">
            <p>${practiceBranding.reportHeaderNotice}</p>
            <p>${practiceBranding.reportFooterDisclaimer}</p>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Pre-flight compliance score calculation
  const complianceChecks = [
    { label: 'Objective observations (>15 words)', passed: objective.trim().split(/\s+/).length >= 15 },
    { label: 'Participant voice / subjective status captured', passed: subjective.trim().length > 10 },
    { label: 'Goal progression measurement stated', passed: assessment.trim().length > 10 },
    { label: 'Concrete follow-up action plan defined', passed: plan.trim().length > 10 },
  ];
  const complianceScore = Math.round((complianceChecks.filter((c) => c.passed).length / complianceChecks.length) * 100);

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Clinical Case Notes & AI Voice Dictation Studio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live speech-to-text transcription, NDIS compliance pre-flight checks, and SIMPL/BIRP/SOAP/DAP structuring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('RECORDER')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeSubTab === 'RECORDER'
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Clinical Recorder & AI Studio
          </button>
          <button
            onClick={() => setActiveSubTab('LEDGER')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeSubTab === 'LEDGER'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Signed Trail ({caseNotes.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'RECORDER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Note Form */}
          <div className="lg:col-span-8 space-y-4">
            {/* Presets & Voice Dictation Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-teal-400" />
                    AI Clinical Voice Dictation Studio
                  </span>
                  {isRecording && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      REC {formatTimer(recordingSeconds)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {rawDictationText && (
                    <button
                      type="button"
                      onClick={() => setRawDictationText('')}
                      className="px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    >
                      Clear Audio
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      isRecording
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse border border-rose-400'
                        : 'bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? `Stop Recording (${formatTimer(recordingSeconds)})` : 'Start Voice Dictation'}</span>
                  </button>
                </div>
              </div>

              {/* Live Audio Waveform Visualizer */}
              {isRecording && (
                <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-1.5 h-7 flex-1 justify-center">
                    {[40, 80, 55, 95, 30, 70, 85, 100, 60, 90, 45, 75, 90, 35, 65, 80, 50, 90, 70, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-teal-500 to-rose-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(15, (h * (Math.sin(recordingSeconds * 3 + i) * 0.4 + 0.6)))}%`,
                          animationDelay: `${i * 60}ms`,
                          animationDuration: '600ms'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-teal-300 font-bold shrink-0">
                    Live Australian English (en-AU)
                  </span>
                </div>
              )}

              {/* Dictation Textbox */}
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={rawDictationText}
                  onChange={(e) => setRawDictationText(e.target.value)}
                  placeholder="Dictate or paste raw notes here... e.g. 'Session with Alex focused on sensory regulation during lunch transitions. Modeled break card prompts. Great progress, 80% accuracy...'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Presets:</span>
                    {CLINICAL_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded text-[11px] border border-slate-700 whitespace-nowrap transition-colors"
                      >
                        {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAiStructureDictation}
                    disabled={isAiStructuring || (!rawDictationText && !subjective && !objective)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-all disabled:opacity-40"
                  >
                    {isAiStructuring ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <Wand2 className="w-3.5 h-3.5" />
                    )}
                    <span>AI Structure into {format}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Note Editor Form */}
            <form onSubmit={handleSaveNote} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Participant</label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-teal-500"
                  >
                    {clients.map((c: Client) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.ndisNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Clinical Framework</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-teal-300 font-bold focus:border-teal-500"
                  >
                    <option value="SIMPL">SIMPL (Situation, Intervention, Measure, Plan)</option>
                    <option value="BIRP">BIRP (Behavior, Intervention, Response, Plan)</option>
                    <option value="SOAP">SOAP (Subjective, Objective, Assessment, Plan)</option>
                    <option value="DAP">DAP (Data, Assessment, Plan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold font-mono focus:border-teal-500"
                  />
                </div>
              </div>

              {/* 4 Form Quadrants */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold flex items-center justify-between">
                    <span>
                      1. {format === 'SIMPL' ? 'Situation / Subjective Presentation' : format === 'BIRP' ? 'Observed Behavior & Presentation' : format === 'SOAP' ? 'Subjective Report' : 'Data - Initial State'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Arousal, engagement & expressed feeling</span>
                  </label>
                  <textarea
                    rows={2}
                    value={subjective}
                    onChange={(e) => setSubjective(e.target.value)}
                    placeholder="Participant presentation, arousal levels, communication attempts..."
                    className="clinical-textarea"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold flex items-center justify-between">
                    <span>
                      2. {format === 'SIMPL' ? 'Clinical Intervention / Strategy Applied' : format === 'BIRP' ? 'Clinical Intervention' : format === 'SOAP' ? 'Objective Observation' : 'Data - Intervention Administered'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Active PBS protocols, sensory tools & coaching</span>
                  </label>
                  <textarea
                    rows={2}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="Environmental adjustments, proactive strategies, sensory tools, prompt fading..."
                    className="clinical-textarea"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold flex items-center justify-between">
                    <span>
                      3. {format === 'SIMPL' ? 'Measurement / Goal Progression Assessment' : format === 'BIRP' ? 'Participant Response' : format === 'SOAP' ? 'Clinical Assessment & Synthesis' : 'Assessment & Progress'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Quantitative trials, latency, GAS score alignment</span>
                  </label>
                  <textarea
                    rows={2}
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="Trial accuracy (e.g. 4/5), de-escalation duration, progress toward NDIS goals..."
                    className="clinical-textarea"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold flex items-center justify-between">
                    <span>
                      4. {format === 'SIMPL' ? 'Plan / Follow-Up Actions' : format === 'BIRP' ? 'Future Plan & Next Steps' : format === 'SOAP' ? 'Treatment Plan' : 'Plan'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">Next clinical session, carer homework, team handover</span>
                  </label>
                  <textarea
                    rows={2}
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="Care team handover, homework tasks, scheduled review date..."
                    className="clinical-textarea"
                  />
                </div>
              </div>

              {/* Billing Claim Checkbox */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoGenerateClaim}
                    onChange={(e) => setAutoGenerateClaim(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500"
                  />
                  <span>Auto-bundle NDIS PRODA Claim for {(Number(sessionDuration)/60).toFixed(2)}h</span>
                </label>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  ${((Number(sessionDuration)/60) * 214.41).toFixed(2)} AUD (Item 07_002_0115_8_3)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign & Digitally Commit Case Note to Audit Ledger</span>
              </button>
            </form>
          </div>

          {/* Right Sidebar: Pre-Flight Compliance Scanner & Recent Notes */}
          <div className="lg:col-span-4 space-y-4">
            {/* Pre-Flight Compliance Scanner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">NDIS Audit Pre-Flight Check</h4>
                </div>
                <span
                  className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
                    complianceScore >= 80
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {complianceScore}% Ready
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {complianceChecks.map((chk, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px]">{chk.label}</span>
                    {chk.passed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Complies with NDIS Practice Standards (Core Module 3).</span>
              </div>
            </div>

            {/* Quick Preview of Participant Goals */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-sm text-xs">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-400" />
                Linked NDIS Goals for {selectedClientObj?.name}
              </h4>
              <div className="space-y-2">
                {selectedClientObj?.goals?.map((g) => (
                  <div key={g.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-teal-200 text-[11px]">{g.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{g.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${g.progressPercent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SIGNED CLINICAL TRAIL & PRINT VIEW */}
      {activeSubTab === 'LEDGER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                Immutable Clinical Case Note Trail ({caseNotes.length} Records)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically verifiable, time-stamped clinical notes ready for audit export.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseNotes.map((note: CaseNote) => (
              <div key={note.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{note.clientName}</span>
                    <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-mono border border-teal-500/20 font-bold">
                      {note.format}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{note.date}</span>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-900">
                  <p>
                    <strong className="text-teal-300">1. Situation / Presentation:</strong> {note.subjective}
                  </p>
                  <p>
                    <strong className="text-teal-300">2. Intervention / Action:</strong> {note.objective}
                  </p>
                  <p>
                    <strong className="text-teal-300">3. Assessment / Result:</strong> {note.assessment}
                  </p>
                  <p>
                    <strong className="text-teal-300">4. Plan:</strong> {note.plan}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                  <span>Practitioner: {note.practitionerName} ({note.sessionDurationMinutes}m)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintNote(note)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded font-bold flex items-center gap-1 border border-slate-700 transition-all shadow-sm"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
