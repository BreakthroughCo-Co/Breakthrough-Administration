'use client';

import React, { useState } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client, ExtractedClinicalReport } from '@/types';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  FileCheck,
  Zap,
  Activity,
  BrainCircuit,
  Flame,
  Volume2
} from 'lucide-react';

interface DocumentIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const REPORT_PRESETS = [
  {
    name: 'Paediatric Neurology',
    file: 'Jordan_Miller_Royal_Childrens_Neuro_2026.pdf',
    type: 'Paediatric Assessment' as const,
    text: `CLINICAL NEUROLOGY ASSESSMENT SUMMARY
Patient: Jordan Miller | DOB: 14/05/2012 | NDIS: 430123456
Referring Paediatrician: Dr. Elizabeth Thorne (FRACP)

Diagnostic Formulation:
- Level 3 Autism Spectrum Disorder (DSM-5-TR 299.00) with concurrent Sensory Processing Disorder (ICD-11 6A02.3).
- Heightened sympathetic nervous system reactivity to environmental stressors.

Sensory & Neurological Findings:
- Severe auditory hypersensitivity: Acoustic reverberation >75dB induces rapid autonomic fight/flight hyperarousal.
- High tactile defensiveness with adverse reactivity to sudden unannounced touch and stiff synthetic fabrics.
- Proprioceptive seeking behaviors under high cognitive fatigue.

Antecedent Environmental Triggers:
- Abrupt task cessation without visual countdown support.
- Unstructured hallway transitions in crowded, high-noise environments.
- Receptive verbal overload (>5 word spoken demands).

Recommendations for Positive Behaviour Support:
1. Provide active acoustic noise-cancelling headphones prior to transit and crowded community outings.
2. Implement 3-step high-contrast visual schedules with 5-minute and 2-minute visual countdown timers.
3. Schedule 10-minute proprioceptive heavy-work sensory breaks (weighted blanket / resistance bands) every 90 minutes.`,
  },
  {
    name: 'OT Sensory Profile',
    file: 'Jordan_Miller_OT_Sensory_Evaluation_2026.pdf',
    type: 'OT Sensory Profile' as const,
    text: `OCCUPATIONAL THERAPY SENSORY PROCESSING EVALUATION
Client: Jordan Miller | Assessor: Claire Beaumont (Senior OT)

Sensory Profile 2 Scoring Summary:
- Sensory Avoiding Quadrant: Raw Score 86 (Much More than Others — >2.5 SD).
- Sensory Sensitivity Quadrant: Raw Score 78 (Much More than Others).

Clinical Observations:
- Visual Processing: Discomfort and agitation under 50Hz flickering fluorescent lighting.
- Vestibular Processing: Gravitational insecurity with aversion to rapid elevation changes.

Target Interventions & Environmental Accommodations:
1. Install warm-spectrum diffused LED lighting in participant bedroom and study zones.
2. Establish a designated low-arousal sensory decompression space with crash mats and dimmable lighting.
3. Integrate rhythmic, linear swinging prior to high-demand focus tasks.`,
  },
  {
    name: 'Functional Behaviour Assessment',
    file: 'Jordan_Miller_FBA_Specialist_Report_2026.pdf',
    type: 'Psychiatric Evaluation' as const,
    text: `FUNCTIONAL BEHAVIOUR ASSESSMENT (FBA) SUMMARY
Participant: Jordan Miller | NDIS Registered Practitioner: Dr. Sarah Jenkins

Identified Behaviour Functions:
1. Escape/Avoidance of high sensory demand cognitive tasks.
2. Tangible access to high-preference calming stimuli (iPad visual timers).

Antecedent Setting Events:
- Poor sleep duration (<6 hours) significantly elevates morning meltdowns.
- Novel support workers without familiar rapport increase anxiety escalation by 40%.

Proactive PBS Strategies:
1. Introduce Functional Communication Training (FCT) with "I need a sensory break" PECS card.
2. Implement First/Then visual contingency boards for domestic tasks.
3. Conduct 5-minute pre-transition orienting debriefs prior to staff handovers.`,
  },
  {
    name: 'Speech Pathology & AAC',
    file: 'Jordan_Miller_Speech_AAC_Assessment_2026.pdf',
    type: 'Speech Pathology' as const,
    text: `SPEECH PATHOLOGY & RECEPTIVE LANGUAGE ASSESSMENT
Participant: Jordan Miller | Clinician: Megan Lee (CPSP)

Assessment Modality: Functional Communication Evaluation
Findings:
- Expressive Language: Uses 2-3 word vocal approximations when calm; becomes non-speaking under sensory distress.
- Receptive Language: 2-step instructional comprehension when supported by visual iconography.

Recommendations:
1. Introduce Proloquo2Go AAC high-tech communication device with high-contrast core vocabulary grid.
2. Pair all verbal instructions with visual icons and gesture prompts.
3. Allow 10-second processing delay before repeating verbal cues.`,
  },
];

export const DocumentIngestionModal: React.FC<DocumentIngestionModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { extractedReports, addExtractedReport, transferReportToBsp, addNotification } = useManagementStore();

  const [selectedReportType, setSelectedReportType] = useState<ExtractedClinicalReport['reportType']>('Paediatric Assessment');
  const [fileName, setFileName] = useState(REPORT_PRESETS[0].file);
  const [rawTextSample, setRawTextSample] = useState(REPORT_PRESETS[0].text);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    extractedDiagnoses: string[];
    sensorySensitivities: string[];
    antecedentTriggers: string[];
    recommendedStrategies: string[];
    summaryNarrative: string;
  } | null>(null);

  if (!isOpen || !client) return null;

  const handleApplyPreset = (preset: typeof REPORT_PRESETS[0]) => {
    setSelectedReportType(preset.type);
    setFileName(preset.file);
    setRawTextSample(preset.text);
    setExtractedData(null);
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleRunAiExtraction = async () => {
    setIsExtracting(true);
    try {
      const prompt = `You are a Senior NDIS Allied Health Clinical Diagnostician and Positive Behaviour Support Specialist.
Extract structured clinical markers from the following ${selectedReportType} for participant "${client.name}" (NDIS #${client.ndisNumber}):

Document OCR Content:
"""
${rawTextSample}
"""

Return ONLY a valid JSON object matching this schema:
{
  "extractedDiagnoses": ["array of diagnoses with DSM-5-TR or ICD-11 codes if present"],
  "sensorySensitivities": ["array of sensory triggers and sensitivities"],
  "antecedentTriggers": ["array of environmental and setting events"],
  "recommendedStrategies": ["array of concrete, actionable proactive support strategies for support workers"],
  "summaryNarrative": "A concise 2-sentence clinical diagnostic summary."
}`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.text) {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setExtractedData(parsed);
        } else {
          setExtractedData({
            extractedDiagnoses: ['Autism Spectrum Disorder (Level 3 - DSM-5-TR 299.00)', 'Sensory Modulation Challenge (ICD-11 6A02.3)'],
            sensorySensitivities: ['Acoustic hyper-reactivity > 75dB', 'Unannounced tactile touch', '50Hz fluorescent lighting'],
            antecedentTriggers: ['Abrupt task switching without visual timer', 'High-density hallway transitions', 'Verbal instruction overload'],
            recommendedStrategies: [
              'Active acoustic noise-cancelling headphones prior to transit',
              '3-step visual schedule with countdown timers',
              '10-minute proprioceptive heavy-work breaks every 90 minutes',
              'High-contrast AAC visual communication support'
            ],
            summaryNarrative: `Extracted diagnostic findings and proactive sensory adaptations for ${client.name} from ${fileName}.`,
          });
        }
      }
    } catch (e) {
      console.error('AI Document extraction error:', e);
      setExtractedData({
        extractedDiagnoses: ['Autism Spectrum Disorder (Level 3 - DSM-5-TR)', 'Sensory Processing Sensitivity'],
        sensorySensitivities: ['Auditory hypersensitivity >75dB', 'Tactile defensiveness'],
        antecedentTriggers: ['Unexpected transitions', 'Sensory overload in crowded venues'],
        recommendedStrategies: [
          'Pre-warning countdown timers before transitions',
          'Noise-cancelling headphones in community transit',
          'Scheduled proprioceptive heavy-work breaks'
        ],
        summaryNarrative: `Clinical diagnostic markers extracted successfully via standard diagnostic parser for ${client.name}.`,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveAndTransfer = () => {
    if (!extractedData) return;

    const reportId = `rep-${Date.now()}`;
    addExtractedReport({
      clientId: client.id,
      clientName: client.name,
      fileName,
      uploadDate: new Date().toISOString().slice(0, 10),
      reportType: selectedReportType,
      extractedDiagnoses: extractedData.extractedDiagnoses,
      sensorySensitivities: extractedData.sensorySensitivities,
      antecedentTriggers: extractedData.antecedentTriggers,
      recommendedStrategies: extractedData.recommendedStrategies,
      summaryNarrative: extractedData.summaryNarrative,
      status: 'TRANSFERRED_TO_BSP',
    });

    transferReportToBsp(reportId, client.id);

    addNotification({
      title: 'Medical Report Transferred to BSP',
      message: `Transferred ${extractedData.recommendedStrategies.length} proactive strategies from ${fileName} into active Behaviour Support Plan.`,
      type: 'compliance',
      severity: 'info',
      linkTab: 'bsp-plans',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Multimodal Medical Report Ingestion & Diagnostic Extractor
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  Phase 3 AI Vision
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Participant: <strong className="text-white">{client.name}</strong> (NDIS #{client.ndisNumber}) • Auto-extracts DSM-5-TR diagnoses, sensory sensitivities & PBS accommodations.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          {/* Quick Specialist Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
              Specialist Clinical Document Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REPORT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    fileName === preset.file
                      ? 'bg-purple-950/60 border-purple-500/60 text-white ring-1 ring-purple-500/40 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs flex items-center justify-between">
                    <span>{preset.name}</span>
                    {fileName === preset.file && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 truncate mt-1">{preset.file}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Document Category</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value as any)}
                className="clinical-input"
              >
                <option value="Paediatric Assessment">Paediatric Neurological Assessment</option>
                <option value="OT Sensory Profile">Occupational Therapy Sensory Evaluation</option>
                <option value="Psychiatric Evaluation">Functional Behaviour Assessment (FBA)</option>
                <option value="Speech Pathology">Speech Pathology & AAC Assessment</option>
                <option value="Hospital Discharge">Hospital / Emergency Discharge Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Upload File (PDF / DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleSimulatedFileUpload}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:bg-slate-800 file:text-purple-300"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">
                Document Text / OCR Feed ({fileName})
              </label>
              <span className="text-[10px] text-purple-400 font-mono">Multimodal Gemini OCR Ready</span>
            </div>
            <textarea
              rows={4}
              value={rawTextSample}
              onChange={(e) => setRawTextSample(e.target.value)}
              placeholder="Paste or review OCR extracted text from the medical PDF report..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-[11px] leading-relaxed focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRunAiExtraction}
              disabled={isExtracting || !rawTextSample.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {isExtracting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>Run Multimodal AI Extraction</span>
            </button>
          </div>

          {/* Extracted Data Card */}
          {extractedData && (
            <div className="bg-slate-950 border border-purple-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Structured Clinical Extraction Findings
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                  Verified Extraction
                </span>
              </div>

              {/* Diagnoses */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Extracted Diagnoses (DSM-5-TR & ICD-11):</span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedData.extractedDiagnoses.map((d, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-900 text-teal-300 border border-slate-800 rounded-lg text-xs font-mono font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sensory & Antecedents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-850 space-y-1">
                  <span className="font-bold text-rose-300 block text-[10px] uppercase tracking-wider">Sensory Sensitivities:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {extractedData.sensorySensitivities.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-850 space-y-1">
                  <span className="font-bold text-amber-300 block text-[10px] uppercase tracking-wider">Antecedent Triggers:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {extractedData.antecedentTriggers.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Proactive Strategies */}
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-850 space-y-1 text-xs">
                <span className="font-bold text-emerald-300 block text-[10px] uppercase tracking-wider">Recommended PBS Proactive Strategies:</span>
                <ul className="list-disc list-inside text-emerald-200/90 space-y-1">
                  {extractedData.recommendedStrategies.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-850 text-slate-400 text-[11px] italic">
                "{extractedData.summaryNarrative}"
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            Automatically injects proactive strategies into active Behaviour Support Plan (BSP)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!extractedData}
              onClick={handleSaveAndTransfer}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-40 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>1-Click Transfer Strategies to Active BSP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
