'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rocket,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2,
  WifiOff,
  FileText,
  BrainCircuit,
  Receipt,
  DollarSign,
  Users,
  Video,
  Network,
  Globe,
  Layers,
  X,
  ArrowUpRight,
  Cpu,
  Flame,
  Award
} from 'lucide-react';
import { useManagementStore, TabType } from '@/stores/useManagementStore';

interface PhasedRolloutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RolloutPhase {
  phaseId: number;
  stageName: string;
  codename: string;
  status: 'DEPLOYED' | 'ACTIVE_STAGING' | 'SCHEDULED';
  progressPercent: number;
  targetTimeline: string;
  icon: any;
  summary: string;
  deliverables: {
    title: string;
    description: string;
    isComplete: boolean;
    quickLinkTab?: TabType;
  }[];
  technicalArchitecture: string[];
}

const PHASES_DATA: RolloutPhase[] = [
  {
    phaseId: 1,
    stageName: 'Stage 1: Core PBS & Clinical Voice Studio',
    codename: 'Project Echo & Core PBS',
    status: 'DEPLOYED',
    progressPercent: 100,
    targetTimeline: 'August 2026 (Live)',
    icon: Sparkles,
    summary: 'Clinical voice dictation engine, 6 standardised assessment protocols, cryptographic NDIS Quality Commission evidence bundle compiler, and restrictive practice fading trajectory.',
    deliverables: [
      {
        title: 'AI Clinical Voice-to-Text Studio',
        description: 'Live audio waveform visualizer parsing messy audio notes into SIMPL / BIRP / SOAP / DAP structured notes with 1-click claim generation.',
        isComplete: true,
        quickLinkTab: 'case-notes',
      },
      {
        title: '6 Standardised Assessment Protocols',
        description: 'Interactive scoring, radar charts, and AI diagnostic narrative synthesis for Vineland-3, Sensory Profile 2, VB-MAPP, ABLLS-R, PEDI-CAT, and WHODAS 2.0.',
        isComplete: true,
        quickLinkTab: 'practice-tools',
      },
      {
        title: 'NDIS Quality Commission Evidence Bundle',
        description: '1-Click compilation of BSP, Restrictive Practice authorisations, incident logs, and case notes with SHA-256 cryptographic verification.',
        isComplete: true,
        quickLinkTab: 'audit',
      },
      {
        title: 'Restrictive Practice Fading Analytics',
        description: '12-Month visual reduction chart comparing scheduled authorization caps vs. actual logged minutes with Senior Practitioner briefs.',
        isComplete: true,
        quickLinkTab: 'restrictive-practices',
      },
      {
        title: 'NDIS Plan Review Justification Generator',
        description: '12-Month automated funding justification document synthesizing GAS progress, clinical hours, and fading trajectories.',
        isComplete: true,
        quickLinkTab: 'clients',
      },
    ],
    technicalArchitecture: [
      'Web Speech Recognition API with interim transcript streaming',
      'Gemini 3.1 Pro Clinical prompt chaining for neuroaffirming note structuring',
      'SubtleCrypto SHA-256 digest calculation for evidence bundle integrity',
      'Recharts responsive RadarChart and ComposedChart for psychometrics',
    ],
  },
  {
    phaseId: 2,
    stageName: 'Stage 2: Multi-Tenancy & Mobile Offline PWA',
    codename: 'Project Nomad & Multi-Clinic',
    status: 'DEPLOYED',
    progressPercent: 100,
    targetTimeline: 'September 2026 (Live)',
    icon: Building2,
    summary: 'Multi-clinic organization switching (Melbourne CBD, Geelong Regional, Sydney Specialist), role-based permissions, and offline-first IndexedDB field visit synchronizer.',
    deliverables: [
      {
        title: 'Multi-Clinic Branch Management Hub',
        description: 'Manage clinic branches across Australia, configure caseload capacity caps, assign clinical leads, and inspect branch-level utilization.',
        isComplete: true,
        quickLinkTab: 'command-center',
      },
      {
        title: 'Offline-First Field Visit PWA Mode',
        description: 'Practitioners conduct rural/home visits with zero internet connectivity; local changes queue and auto-sync when online.',
        isComplete: true,
        quickLinkTab: 'case-notes',
      },
      {
        title: 'IndexedDB Offline Transaction Engine',
        description: 'Robust local store tracking pending create/update mutations with status badges, payload JSON inspection, and conflict resolution.',
        isComplete: true,
        quickLinkTab: 'command-center',
      },
    ],
    technicalArchitecture: [
      'Zustand tenancy state slice with localStorage and IndexedDB fallback',
      'IndexedDB BreakthroughOfflineDB_v1 schema with offline_queue and client caching',
      'PWA Manifest & Background Sync Queue Governance',
    ],
  },
  {
    phaseId: 3,
    stageName: 'Stage 3: AI Document Ingestion & Predictive Risk',
    codename: 'Project Cortex',
    status: 'ACTIVE_STAGING',
    progressPercent: 80,
    targetTimeline: 'October 2026',
    icon: BrainCircuit,
    summary: 'Multimodal medical report parser extracting DSM-5 / ICD-11 codes and sensory triggers into BSPs, plus time-series predictive behavioral escalation forecaster.',
    deliverables: [
      {
        title: 'Multimodal Medical PDF / Discharge Scanner',
        description: 'Drag-and-drop 30-page paediatric assessments, OT evaluations, and discharge summaries; Gemini parses triggers directly into BSP draft.',
        isComplete: true,
        quickLinkTab: 'clients',
      },
      {
        title: 'Predictive Escalation Risk Forecaster',
        description: 'Heuristic & time-series regression analyzing ABC logs to forecast high-probability arousal windows and provide proactive counter-interventions.',
        isComplete: true,
        quickLinkTab: 'abc-analyser',
      },
    ],
    technicalArchitecture: [
      'Gemini Multimodal Document Ingestion API with structured JSON output',
      'Temporal ABC incident heatmap matrix (7-day x 24-hour binning)',
      'Cross-module state injection into active BSP draft',
    ],
  },
  {
    phaseId: 4,
    stageName: 'Stage 4: Direct PRODA B2G & Financial Automation',
    codename: 'Project Ledger & PACE Gateway',
    status: 'SCHEDULED',
    progressPercent: 50,
    targetTimeline: 'November 2026',
    icon: Receipt,
    summary: 'Direct NDIS PRODA PACE B2G machine-to-machine batch payment claiming, pre-submission rate cap scrubber, and 2-way Xero/MYOB accounting sync.',
    deliverables: [
      {
        title: '2026 NDIS Price Limits Validator',
        description: 'Real-time validation against Support Catalogue caps (e.g. 01_799_0128_1_1 @ $214.41/hr).',
        isComplete: true,
        quickLinkTab: 'billing',
      },
      {
        title: 'Pre-Submission Claim Scrubber',
        description: 'Automated table of claim warnings detecting unlinked notes, cap breaches, and expired agreements.',
        isComplete: true,
        quickLinkTab: 'billing',
      },
      {
        title: 'Official PRODA CSV/JSON Generator',
        description: 'Generate NDIA-compliant 12-column bulk payment request files with 1-click batch export.',
        isComplete: true,
        quickLinkTab: 'billing',
      },
      {
        title: '2-Way Xero / MYOB Sync Adapter',
        description: 'Automated invoice creation and NDIS bulk disbursement ledger reconciliation.',
        isComplete: false,
        quickLinkTab: 'integrations',
      },
    ],
    technicalArchitecture: [
      'NDIA PRODA B2G REST API specification compliance',
      'OAuth 2.0 PKCE authentication flow with PRODA digital certificates',
      'Xero Accounting API v2.0 Webhook integration',
    ],
  },
  {
    phaseId: 5,
    stageName: 'Stage 5: Stakeholder Ecosystem & Telehealth',
    codename: 'Project Kinship',
    status: 'SCHEDULED',
    progressPercent: 30,
    targetTimeline: 'December 2026',
    icon: Users,
    summary: 'Secure magic-link parent and carer portal with live Goal Attainment Scaling tracking, plus WebRTC-powered interactive Lego therapy telehealth sessions.',
    deliverables: [
      {
        title: 'Secure Magic-Link Family Portal',
        description: 'Passwordless, zero-friction portal for parents, nominees, and support coordinators.',
        isComplete: true,
        quickLinkTab: 'clients',
      },
      {
        title: 'Integrated Telehealth & Interactive Whiteboard',
        description: 'Secure WebRTC video consultations with live Lego therapy role controls and screen sharing.',
        isComplete: false,
        quickLinkTab: 'practice-tools',
      },
    ],
    technicalArchitecture: [
      'WebRTC PeerConnection with STUN/TURN traversal',
      'Time-based HMAC magic tokens with cryptographic expiry',
      'Canvas 2D collaborative whiteboard synchronization',
    ],
  },
  {
    phaseId: 6,
    stageName: 'Stage 6: Enterprise Interoperability & FHIR EHR',
    codename: 'Project Interop & Scale',
    status: 'SCHEDULED',
    progressPercent: 15,
    targetTimeline: 'Q1 2027',
    icon: Globe,
    summary: 'HL7 / FHIR Australian Digital Health Interoperability with My Health Record, plus enterprise white-labeling with custom subdomains and branding.',
    deliverables: [
      {
        title: 'HL7 / FHIR Australian EHR Connector',
        description: 'Bi-directional interoperability with hospital emergency department feeds and My Health Record.',
        isComplete: false,
        quickLinkTab: 'integrations',
      },
      {
        title: 'Custom White-Label Clinic Subdomains',
        description: 'Dedicated provider subdomains, custom DNS, and bespoke CSS styling for national NDIS providers.',
        isComplete: true,
        quickLinkTab: 'audit',
      },
    ],
    technicalArchitecture: [
      'HL7 FHIR Release 4 Australian Base Implementation Guide (AU Base)',
      'Wildcard SSL / SNI dynamic routing with edge middleware',
      'Enterprise SAML 2.0 / Okta single sign-on federation',
    ],
  },
];

export const PhasedRolloutModal: React.FC<PhasedRolloutModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useManagementStore();
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);

  if (!isOpen) return null;

  const selectedPhase = PHASES_DATA.find((p) => p.phaseId === selectedPhaseId) || PHASES_DATA[0];

  const handleNavigateToFeature = (tab?: TabType) => {
    if (tab) {
      setActiveTab(tab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Breakthrough OS: Multi-Phase Product & Technical Rollout
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold uppercase">
                  Stage 1 Live ✅
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live strategic roadmap and engineering deployment tracker across Phases 1 through 6.
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
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Sidebar: Phase Selector */}
          <div className="md:col-span-4 p-4 overflow-y-auto space-y-2 bg-slate-950/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
              Strategic Release Stages
            </span>

            {PHASES_DATA.map((phase) => {
              const Icon = phase.icon;
              const isSelected = phase.phaseId === selectedPhaseId;

              return (
                <button
                  key={phase.phaseId}
                  onClick={() => setSelectedPhaseId(phase.phaseId)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500/60 shadow-md ring-1 ring-teal-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          phase.status === 'DEPLOYED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : phase.status === 'ACTIVE_STAGING'
                            ? 'bg-teal-500/20 text-teal-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white">Phase {phase.phaseId}</span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        phase.status === 'DEPLOYED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : phase.status === 'ACTIVE_STAGING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {phase.status === 'DEPLOYED'
                        ? 'Deployed'
                        : phase.status === 'ACTIVE_STAGING'
                        ? 'In Staging'
                        : 'Scheduled'}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-200 line-clamp-1">{phase.stageName.split(':')[1]}</p>

                  <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        phase.status === 'DEPLOYED'
                          ? 'bg-emerald-500'
                          : phase.status === 'ACTIVE_STAGING'
                          ? 'bg-teal-500'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${phase.progressPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Area: Phase Detail */}
          <div className="md:col-span-8 p-5 overflow-y-auto space-y-5">
            {/* Active Phase Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                    {selectedPhase.codename} • {selectedPhase.targetTimeline}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedPhase.stageName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    {selectedPhase.progressPercent}% Ready
                  </span>
                  <div className="w-20 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${selectedPhase.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{selectedPhase.summary}</p>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Key Deliverables & Clinical Capabilities
              </h4>

              <div className="space-y-2.5">
                {selectedPhase.deliverables.map((del, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {del.isComplete ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                            <Clock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{del.title}</span>
                          {del.isComplete && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{del.description}</p>
                      </div>
                    </div>

                    {del.quickLinkTab && (
                      <button
                        onClick={() => handleNavigateToFeature(del.quickLinkTab)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-[10px] rounded-lg border border-slate-700 flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Architecture Notes */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Technical Implementation Invariants
              </h4>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                {selectedPhase.technicalArchitecture.map((tech, i) => (
                  <li key={i} className="leading-relaxed">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NDIS Practice Standards & Quality Commission 2026 Specification Compliant</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Close Roadmap
          </button>
        </div>
      </motion.div>
    </div>
  );
};
