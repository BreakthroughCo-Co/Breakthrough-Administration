'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useManagementStore } from '@/stores/useManagementStore';
import { TabType } from '@/types';
import {
  Sparkles,
  Mic,
  Activity,
  Building2,
  BrainCircuit,
  Receipt,
  Globe,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Award,
  Download,
  Printer,
  ShieldCheck,
  Check,
  Zap,
  Flame,
  Radio,
  Layers,
  Smile
} from 'lucide-react';

const TOUR_STEPS = [
  {
    stepNumber: 1,
    title: 'Clinical Voice Studio & Waveform Dictation',
    tagline: 'Instant hands-free session documentation powered by AI',
    icon: Mic,
    color: 'from-teal-500 to-emerald-600',
    borderColor: 'border-teal-500/40',
    targetTab: 'case-notes' as TabType,
    description:
      'Record live clinical case notes hands-free. The system visualizes speech with a 20-bar live audio waveform and automatically formats clinical findings into SIMPL, BIRP, SOAP, or DAP frameworks.',
    features: [
      '20-bar animated real-time audio waveform recording indicator',
      'One-click format translation: SIMPL, BIRP, SOAP, and DAP',
      'Direct synchronization to participant billing ledgers',
    ],
    previewMock: (
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] text-rose-300 font-bold">REC 00:01:45</span>
          </div>
          <span className="text-[10px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
            SOAP Auto-Format
          </span>
        </div>
        <div className="flex items-center justify-center gap-1 py-2">
          {[40, 75, 90, 60, 85, 100, 70, 95, 80, 50, 65, 85, 90, 70, 45].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-full"
              style={{ height: `${h * 0.28}px` }}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          "Participant demonstrated calm engagement during morning transition; visual schedule utilized successfully."
        </p>
      </div>
    ),
  },
  {
    stepNumber: 2,
    title: '6 Standardised NDIS Psychometrics & Radar Charts',
    tagline: 'Evidence-based functional & sensory assessments',
    icon: Activity,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/40',
    targetTab: 'practice-tools' as TabType,
    description:
      'Administer all 6 NDIS diagnostic protocols (Vineland-3, Sensory Profile 2, VB-MAPP, ABLLS-R, PEDI-CAT, WHODAS 2.0). Compare multi-domain baselines using interactive Radar Charts.',
    features: [
      'Comprehensive scoring algorithms with standard deviation calculations',
      'Dynamic Recharts Radar Chart baseline vs current progress comparison',
      '1-Click AI diagnostic narrative generation and BSP transfer',
    ],
    previewMock: (
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-cyan-300">Vineland-3 Adaptive Behaviour</span>
          <span className="text-[10px] bg-cyan-950/60 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 font-mono">
            Standard Score: 68 (Low)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
            <span className="text-slate-400 block">Communication</span>
            <strong className="text-white">v-Scale: 9</strong>
          </div>
          <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
            <span className="text-slate-400 block">Daily Living</span>
            <strong className="text-teal-400">v-Scale: 11</strong>
          </div>
          <div className="p-1.5 bg-slate-900 rounded border border-slate-800">
            <span className="text-slate-400 block">Socialization</span>
            <strong className="text-amber-400">v-Scale: 7</strong>
          </div>
        </div>
      </div>
    ),
  },
  {
    stepNumber: 3,
    title: 'Multi-Branch Clinic Hub & Offline PWA Sync',
    tagline: 'Multi-state tenancy and zero-friction offline persistence',
    icon: Building2,
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-500/40',
    targetTab: 'command-center' as TabType,
    description:
      'Manage multiple clinic branches across Melbourne, Sydney, Brisbane, Perth, and Adelaide. Work seamlessly in remote offline environments with our IndexedDB persistence engine.',
    features: [
      'Multi-branch caseload capacity and practitioner allocation',
      'IndexedDB `BreakthroughOfflineDB_v1` background sync queue',
      'PWA standalone desktop and tablet installation',
    ],
    previewMock: (
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-indigo-300">Melbourne CBD Central Clinic</span>
          <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
            Online • Synced
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Caseload: <strong className="text-white">42 / 50</strong></span>
          <span>Lead: <strong className="text-indigo-200">Dr. Sarah Jenkins</strong></span>
        </div>
      </div>
    ),
  },
  {
    stepNumber: 4,
    title: 'Multimodal Medical OCR & Predictive Escalation Risk',
    tagline: 'AI document ingestion and 24-hr diurnal escalation modeling',
    icon: BrainCircuit,
    color: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-500/40',
    targetTab: 'incidents' as TabType,
    description:
      'Ingest 30-page paediatric assessments and OT evaluations to automatically extract DSM-5-TR / ICD-11 codes. Model 24-hour diurnal escalation trajectories to preempt crisis events.',
    features: [
      '4 Specialist presets: Paediatric Neurology, OT Sensory, FBA, Speech',
      '24-Hour Diurnal Escalation Risk curves (AreaChart) highlighting peak arousal windows',
      'AI Preemptive de-escalation strategy synthesis with 1-Click BSP sync',
    ],
    previewMock: (
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-rose-300">Escalation Trajectory Modeling</span>
          <span className="text-[10px] bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-mono font-bold">
            Peak: 13:30 - 15:30
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          Identified sensory triggers: Acoustic reverberation &gt;75dB, unannounced transition prompts.
        </p>
      </div>
    ),
  },
  {
    stepNumber: 5,
    title: '2026 Price Limits & NDIA PRODA PACE 12-Column Gateway',
    tagline: 'Flawless B2G claiming and financial compliance',
    icon: Receipt,
    color: 'from-amber-500 to-emerald-600',
    borderColor: 'border-amber-500/40',
    targetTab: 'billing' as TabType,
    description:
      'Automatically validate billing lines against 2026 Support Catalogue caps ($214.41/hr). Export NDIA-compliant 12-column PRODA PACE XML/CSV files and reconcile 2-way with Xero/MYOB.',
    features: [
      'Real-time price cap validation (Specialist Intervention & BSP Development @ $214.41/hr)',
      'Pre-submission claim scrubber flagging unlinked notes and expired agreements',
      'Official NDIA PACE 12-column CSV and XML bulk batch export',
    ],
    previewMock: (
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold">NDIS Support: 07_002_0115_8_3</span>
          <span className="text-emerald-400 font-bold">$214.41 / hr</span>
        </div>
        <div className="text-[11px] text-slate-400">
          PRODA Batch Verified • 12/12 Columns Validated • GST Code: P1 (NDIS Free)
        </div>
      </div>
    ),
  },
  {
    stepNumber: 6,
    title: 'Easy-Read Participant Portal & HL7 FHIR R4 EHR',
    tagline: 'Accessible stakeholder empowerment & national healthcare interoperability',
    icon: Globe,
    color: 'from-teal-500 to-indigo-600',
    borderColor: 'border-teal-500/40',
    targetTab: 'clients' as TabType,
    description:
      'Empower participants and carers with WCAG 2.1 AAA Easy-Read goal progress views, encrypted WebRTC video telehealth consultations, and standard HL7 FHIR R4 Bundle exports for My Health Record.',
    features: [
      'Accessible Easy-Read participant mode with visual goal progress bars',
      'WebRTC encrypted video telehealth room with live session timer and in-call notes',
      'HL7 FHIR R4 Patient, Condition, CarePlan, and Observation bundle exporter',
    ],
    previewMock: (
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-teal-300 flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-amber-400" />
            Easy-Read Goal Tracking
          </span>
          <span className="text-[10px] bg-teal-950/60 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-mono font-bold">
            85% Complete 🌟
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          FHIR R4 Bundle ready for Australian Digital Health Agency (ADHA) exchange.
        </div>
      </div>
    ),
  },
];

export const GuidedTourModal: React.FC = () => {
  const { isTourOpen, closeTour, completeTour, setActiveTab } = useManagementStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompletedView, setIsCompletedView] = useState(false);

  if (!isTourOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep?.icon || Sparkles;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompletedView(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToFeature = (tab: TabType) => {
    setActiveTab(tab);
    closeTour();
  };

  const handlePrintQuickReference = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Breakthrough OS - Clinical Quick Reference Guide</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; line-height: 1.5; }
            h1 { color: #0f766e; font-size: 20px; border-bottom: 2px solid #0f766e; padding-bottom: 6px; }
            h2 { color: #1e293b; font-size: 14px; margin-top: 18px; }
            .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: #f8fafc; }
            .code { font-family: monospace; font-weight: bold; color: #0f766e; }
            ul { margin: 6px 0; padding-left: 20px; font-size: 12px; }
            li { margin-bottom: 4px; }
            .footer { margin-top: 30px; font-size: 10px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          </style>
        </head>
        <body>
          <h1>Breakthrough Coaching OS — Practitioner Quick Reference Guide</h1>
          <p><strong>NDIS Practice Registration:</strong> 405001234 | <strong>Version:</strong> 2026.4.2</p>

          <div class="card">
            <h2>1. Clinical Voice Studio & Case Notes</h2>
            <ul>
              <li>Use hands-free live waveform dictation for session capture.</li>
              <li>Auto-structure into <span class="code">SIMPL</span>, <span class="code">BIRP</span>, <span class="code">SOAP</span>, or <span class="code">DAP</span>.</li>
            </ul>
          </div>

          <div class="card">
            <h2>2. Standardised Psychometrics</h2>
            <ul>
              <li>Administer Vineland-3, Sensory Profile 2, VB-MAPP, ABLLS-R, PEDI-CAT, WHODAS 2.0.</li>
              <li>1-Click transfer diagnostic summaries into active Behaviour Support Plans.</li>
            </ul>
          </div>

          <div class="card">
            <h2>3. 2026 NDIS Price Limits & PRODA PACE B2G</h2>
            <ul>
              <li>Specialist Behavioural Intervention: <span class="code">07_002_0115_8_3</span> ($214.41/hr cap).</li>
              <li>Individual BSP Development: <span class="code">07_004_0115_8_3</span> ($214.41/hr cap).</li>
              <li>Generate official 12-column PRODA PACE XML/CSV batches in 1-Click.</li>
            </ul>
          </div>

          <div class="card">
            <h2>4. HL7 FHIR R4 & Interoperability</h2>
            <ul>
              <li>Export ADHA My Health Record standard FHIR R4 Bundles directly from Compliance Studio.</li>
            </ul>
          </div>

          <div class="footer">
            <p>Confidential Clinical Governance Document • Breakthrough OS</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleIn relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow Halo Background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 text-teal-400 rounded-2xl border border-teal-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Breakthrough OS Interactive Clinical Tour
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold uppercase">
                  6 Core Workflows
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A 3-minute guided tour of our NDIS Positive Behaviour Support & Clinical Governance ecosystem.
              </p>
            </div>
          </div>

          <button
            onClick={closeTour}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-6 relative z-10 pr-1">
          {!isCompletedView ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Step Indicator & Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      Step {currentStep.stepNumber} of {TOUR_STEPS.length}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Module: {currentStep.targetTab}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${currentStep.color} text-white shadow-lg`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{currentStep.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{currentStep.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Preview Mock Box */}
                {currentStep.previewMock}

                {/* Key Capabilities Checklist */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Core Clinical Capabilities:
                  </span>
                  <div className="space-y-1.5">
                    {currentStep.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* COMPLETION CELEBRATION VIEW */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-teal-500 to-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-amber-400/40 animate-bounce">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl font-black text-white">
                  Clinical Onboarding Complete! 🎉
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You are now certified in the complete Breakthrough OS workflow: from clinical voice capture and psychometric radar scoring to PRODA B2G claiming and FHIR R4 interoperability.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/40 text-left max-w-lg mx-auto space-y-2 text-xs">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Practitioner Checklist Mastered (6/6)
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Voice Case Notes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>6 NDIS Psychometrics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multi-Clinic PWA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Predictive Risk AI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PRODA PACE Claims</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>FHIR R4 Exporter</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintQuickReference}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl flex items-center gap-2 border border-teal-500/30 transition-all cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download Quick Reference Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    completeTour();
                    setActiveTab('clients');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <RocketIcon className="w-4 h-4" />
                  <span>Open Active Clients</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        {!isCompletedView && (
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between relative z-10">
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentStepIndex
                      ? 'w-6 bg-teal-400'
                      : i < currentStepIndex
                      ? 'w-2 bg-teal-600'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleJumpToFeature(currentStep.targetTab)}
                className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-teal-500/20 transition-all cursor-pointer"
              >
                <span>Jump to {currentStep.targetTab}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
