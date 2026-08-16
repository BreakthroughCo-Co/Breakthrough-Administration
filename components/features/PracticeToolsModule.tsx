'use client';

import React, { useState, useEffect } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client } from '@/types';
import {
  Sparkles,
  BookOpen,
  Boxes,
  Users,
  CheckCircle2,
  RefreshCw,
  Send,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Copy,
  Check,
  TrendingUp,
  Award,
  Layers,
  Smile,
  ShieldCheck,
  Volume2,
  Navigation,
  BarChart2,
  Zap,
  Activity,
  FileText,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const PracticeToolsModule: React.FC = () => {
  const {
    clients,
    currentUser,
    clinicalAssessments,
    addClinicalAssessment,
    addCaseNote,
    updateClientGoal,
    importFbaToBsp,
    addNotification,
    addAuditLog
  } = useManagementStore();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cli-101');
  const [activeTab, setActiveTab] = useState<'social-stories' | 'lego' | 'gas-tracker' | 'assessments'>('social-stories');

  // Clinical Assessments State - All 6 Core NDIS Protocols
  const [selectedAssessmentTool, setSelectedAssessmentTool] = useState<
    'Vineland-3' | 'Sensory Profile 2' | 'VB-MAPP' | 'ABLLS-R' | 'PEDI-CAT' | 'WHODAS 2.0'
  >('Vineland-3');

  const [assessmentDomainScores, setAssessmentDomainScores] = useState<Record<string, number>>({
    'Communication': 74,
    'Daily Living Skills': 68,
    'Socialization': 62,
    'Motor Skills': 85,
    'Adaptive Behavior Composite': 71,
  });

  const [assessmentInterpretation, setAssessmentInterpretation] = useState('');
  const [isGeneratingAssessmentAi, setIsGeneratingAssessmentAi] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Social Story Generator State
  const [socialStoryPrompt, setSocialStoryPrompt] = useState({
    situation: 'Taking the public bus to the day program during peak sensory noise',
    targetEmotion: 'Calmness & Sensory Self-Regulation',
    participantAge: 'Young Adult (19 yrs)',
    copingTools: 'Noise-cancelling headphones, deep breathing, listening to music',
  });
  const [generatedStory, setGeneratedStory] = useState<{
    title: string;
    cards: { step: number; title: string; text: string; iconType: string }[];
    fullText: string;
  } | null>({
    title: 'Riding the Bus with Comfort and Ease',
    cards: [
      {
        step: 1,
        title: 'Where I am Going',
        text: 'Sometimes I take the bus to the community day program in the morning. The bus helps me travel safely from home.',
        iconType: 'bus',
      },
      {
        step: 2,
        title: 'Understanding the Sounds',
        text: 'The bus can have loud engine sounds, doors opening, and other people talking. It is okay that the bus is busy.',
        iconType: 'volume',
      },
      {
        step: 3,
        title: 'What I Can Do',
        text: 'When the sounds feel too loud, I can put on my noise-cancelling headphones. I can take 3 slow, deep belly breaths.',
        iconType: 'headphones',
      },
      {
        step: 4,
        title: 'I Am Safe and Supported',
        text: 'I am doing a great job traveling. When the bus arrives, I will be ready to see my friends at the day program.',
        iconType: 'heart',
      },
    ],
    fullText: `Riding the Bus with Comfort and Ease\n\n1. Where I am Going:\nSometimes I take the bus to the community day program in the morning. The bus helps me travel safely from home.\n\n2. Understanding the Sounds:\nThe bus can have loud engine sounds, doors opening, and other people talking. It is okay that the bus is busy.\n\n3. What I Can Do:\nWhen the sounds feel too loud, I can put on my noise-cancelling headphones. I can take 3 slow, deep belly breaths.\n\n4. I Am Safe and Supported:\nI am doing a great job traveling. When the bus arrives, I will be ready to see my friends at the day program.`,
  });
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Lego Therapy Planner & Live Session Runner State
  const [legoSession, setLegoSession] = useState({
    theme: 'Building a Community Rescue Station & Helipad',
    engineerName: 'Jordan (Participant)',
    builderName: 'Marcus (Senior BSP)',
    supplierName: 'Dave (Support Worker)',
    socialTarget: 'Turn-taking, expressing needs politely, polite requests for Lego blocks',
  });

  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [politeRequestsCount, setPoliteRequestsCount] = useState(6);
  const [turnTakingCount, setTurnTakingCount] = useState(8);
  const [frustrationRegulationScore, setFrustrationRegulationScore] = useState(4); // out of 5
  const [legoSessionSaved, setLegoSessionSaved] = useState(false);

  // Timer Effect - clean single interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCardIcon = (iconType: string) => {
    switch (iconType) {
      case 'bus':
      case 'transit':
        return <Navigation className="w-4 h-4 text-teal-400" />;
      case 'volume':
      case 'sound':
        return <Volume2 className="w-4 h-4 text-amber-400" />;
      case 'headphones':
      case 'listen':
        return <ShieldCheck className="w-4 h-4 text-sky-400" />;
      case 'heart':
      case 'smile':
      default:
        return <Heart className="w-4 h-4 text-rose-400" />;
    }
  };

  const selectedClient = clients.find((c: Client) => c.id === selectedClientId) || clients[0];

  // AI Social Story Generator
  const handleGenerateSocialStory = async () => {
    setIsGeneratingStory(true);
    try {
      const prompt = `Write a personalized, neuroaffirming NDIS Social Story for participant ${selectedClient.name}.
Situation: ${socialStoryPrompt.situation}
Target Regulation / Emotion Goal: ${socialStoryPrompt.targetEmotion}
Age Group: ${socialStoryPrompt.participantAge}
Coping Tools: ${socialStoryPrompt.copingTools}

Return a valid JSON object with:
{
  "title": "Story Title",
  "cards": [
    { "step": 1, "title": "Where I Am / What is Happening", "text": "Descriptive sentence...", "iconType": "bus" },
    { "step": 2, "title": "Perspective Sentence", "text": "Why things happen...", "iconType": "volume" },
    { "step": 3, "title": "What I Can Do", "text": "Directive coping actions...", "iconType": "headphones" },
    { "step": 4, "title": "I Am Safe & Supported", "text": "Affirming closing sentence...", "iconType": "heart" }
  ],
  "fullText": "Full formatted text with all sections"
}`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction:
            'You are an expert Senior Allied Health Behaviour Support Practitioner in Australia crafting neuroaffirming Social Stories.',
        }),
      });

      const data = await res.json();
      let parsed = null;

      if (data.text) {
        const match = data.text.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch (e) {}
        }
      }

      if (parsed && Array.isArray(parsed.cards)) {
        setGeneratedStory(parsed);
      } else {
        // High fidelity fallback story
        setGeneratedStory({
          title: `My Calm Guide: ${socialStoryPrompt.situation}`,
          cards: [
            {
              step: 1,
              title: 'Where I am Going',
              text: `Sometimes I take part in ${socialStoryPrompt.situation}. It is an activity designed for my day.`,
              iconType: 'bus',
            },
            {
              step: 2,
              title: 'Understanding What Happens',
              text: `There might be unexpected sounds or multiple people around. It is okay for environments to feel busy.`,
              iconType: 'volume',
            },
            {
              step: 3,
              title: 'Positive Choices I Can Make',
              text: `I can use my tools: ${socialStoryPrompt.copingTools}. I can ask for a 2-minute break whenever I need.`,
              iconType: 'headphones',
            },
            {
              step: 4,
              title: 'I Am Safe & Proud',
              text: `My support team is here to help me. I am capable and supported at every step.`,
              iconType: 'heart',
            },
          ],
          fullText: `My Calm Guide: ${socialStoryPrompt.situation}\n\n1. Where I am Going:\nSometimes I take part in ${socialStoryPrompt.situation}. It is an activity designed for my day.\n\n2. Understanding What Happens:\nThere might be unexpected sounds or multiple people around. It is okay for environments to feel busy.\n\n3. Positive Choices I Can Make:\nI can use my tools: ${socialStoryPrompt.copingTools}. I can ask for a 2-minute break whenever I need.\n\n4. I Am Safe & Proud:\nMy support team is here to help me. I am capable and supported at every step.`,
        });
      }
    } catch (e) {
      console.error('Failed to generate story:', e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleCopyStory = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(generatedStory.fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Export Lego Therapy Session directly to Case Notes
  const handleExportLegoToCaseNote = () => {
    const mins = Math.max(15, Math.ceil(sessionSeconds / 60));
    addCaseNote({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      practitionerId: currentUser.practitionerId || 'prac-2',
      practitionerName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      sessionDurationMinutes: mins,
      format: 'SOAP',
      subjective: `${selectedClient.name} participated in Lego-Based Therapy session focusing on social communication and collaborative turn-taking.`,
      objective: `Engaged for ${mins} mins in role of ${legoSession.engineerName}. Recorded ${politeRequestsCount} polite requests for pieces and ${turnTakingCount} successful turn exchanges. Frustration regulation rating: ${frustrationRegulationScore}/5.`,
      assessment: `Demonstrated strong receptive language following assembly diagrams and regulated arousal without physical agitation.`,
      plan: `Advance build complexity in next session. Target peer-to-peer role rotation without practitioner mediation.`,
      linkedGoalIds: selectedClient.goals.map((g) => g.id),
      status: 'Approved',
      flaggedForReview: false,
    });

    setLegoSessionSaved(true);
    setTimeout(() => setLegoSessionSaved(false), 4000);
  };

  // Interactive GAS Score updater
  const handleSelectGasScore = (goalId: string, newScore: number) => {
    const goal = selectedClient?.goals.find((g) => g.id === goalId);
    if (!goal || !selectedClient) return;
    const getProgressFromScore = (score: number): number => {
      switch (score) {
        case -2: return 20;
        case -1: return 45;
        case 0:  return 70;
        case 1:  return 85;
        case 2:  return 100;
        default: return goal.progressPercent;
      }
    };
    const newProgress = getProgressFromScore(newScore);
    const today = new Date().toISOString().slice(0, 10);
    const updatedHistory = [
      ...(goal.gasHistory || []),
      {
        date: today,
        score: newScore,
        note: `Updated during clinical session to score ${newScore >= 0 ? `+${newScore}` : newScore} (${
          newScore === 0 ? 'Target Expected Outcome' : newScore > 0 ? 'Higher than expected' : 'Below expected'
        })`,
      },
    ];
    updateClientGoal(selectedClient.id, goal.id, {
      gasScore: newScore,
      progressPercent: newProgress,
      gasHistory: updatedHistory,
    });
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-teal-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Clinical & Social Practice Tools Studio
              </h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
                Capacity Building
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              AI-assisted neuroaffirming Social Story generation with printable visual flashcards, Lego-Based Therapy live session timers with metric tracking, and Goal Attainment Scaling (GAS).
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('social-stories')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'social-stories'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Social Storyboard</span>
          </button>
          <button
            onClick={() => setActiveTab('lego')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'lego'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Lego Based Therapy</span>
          </button>
          <button
            onClick={() => setActiveTab('gas-tracker')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'gas-tracker'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>GAS Goal Scaling</span>
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'assessments'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Assessments ({clinicalAssessments.length})</span>
          </button>
        </div>
      </div>

      {/* Participant Selector Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Selected Participant:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-teal-500 w-64"
          >
            {clients.map((c: Client) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.primaryDisability})
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] text-teal-400 font-mono hidden sm:inline">
          NDIS #: {selectedClient?.ndisNumber}
        </span>
      </div>

      {/* Tab 1: AI Social Stories Studio */}
      {activeTab === 'social-stories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Parameters */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              Social Story Parameters & Triggers
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Target Situation / Transition Scenario
                </label>
                <textarea
                  rows={2}
                  value={socialStoryPrompt.situation}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, situation: e.target.value })
                  }
                  placeholder="e.g. Taking the bus, dental checkup, school assembly..."
                  className="clinical-textarea"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-teal-400">
                  Target Emotional Goal & Regulation Target
                </label>
                <input
                  type="text"
                  value={socialStoryPrompt.targetEmotion}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, targetEmotion: e.target.value })
                  }
                  className="clinical-input"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-amber-400">
                  Sensory & Coping Tools (Personalized)
                </label>
                <input
                  type="text"
                  value={socialStoryPrompt.copingTools}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, copingTools: e.target.value })
                  }
                  className="clinical-input"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Participant Stage / Age</label>
                <input
                  type="text"
                  value={socialStoryPrompt.participantAge}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, participantAge: e.target.value })
                  }
                  className="clinical-input"
                />
              </div>

              <button
                onClick={handleGenerateSocialStory}
                disabled={isGeneratingStory}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isGeneratingStory ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>{isGeneratingStory ? 'Crafting Social Story...' : 'Generate AI Storyboard Cards'}</span>
              </button>
            </div>
          </div>

          {/* Visual Storyboard Cards View */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  {generatedStory?.title || `Social Story for ${selectedClient?.name}`}
                </h3>
                <span className="text-[10px] text-slate-400">
                  4-Panel Neuroaffirming Visual Narrative
                </span>
              </div>

              {generatedStory && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyStory}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-400" />
                    <span>Print Cards</span>
                  </button>
                </div>
              )}
            </div>

            {generatedStory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {generatedStory.cards.map((card) => (
                  <div
                    key={card.step}
                    className="bg-slate-950 rounded-xl p-4 border border-teal-500/20 space-y-2.5 flex flex-col justify-between shadow-sm hover:border-teal-500/40 transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center font-mono">
                          {card.step}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {card.title}
                        </span>
                      </div>
                      <div className="p-1 bg-slate-900 rounded-lg border border-slate-800">
                        {getCardIcon(card.iconType)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans min-h-[55px]">
                      {card.text}
                    </p>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-teal-400 font-mono">
                      <span>Card #{card.step} of 4</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                Fill out the scenario parameters and click &quot;Generate AI Storyboard Cards&quot; to build a personalized 4-step illustrated narrative.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Lego Based Therapy Interactive Runner */}
      {activeTab === 'lego' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-amber-400" />
                Lego-Based Therapy Collaborative Session Runner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured evidence-based intervention promoting social communication, verbal negotiation, and shared goals.
              </p>
            </div>

            {/* Live Session Timer */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Session Timer:</span>
              <span className="text-lg font-mono font-extrabold text-teal-400">
                {formatTimer(sessionSeconds)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-1.5 rounded-lg text-white font-bold transition-all ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-600 hover:bg-teal-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSessionSeconds(0);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Core Collaborative Roles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Engineer */}
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-sm">1. The Engineer</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-300 font-mono px-2 py-0.5 rounded font-bold">
                  Directs Build
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Holds the diagram and verbally describes instructions and block placements to the supplier.
              </p>
              <input
                type="text"
                value={legoSession.engineerName}
                onChange={(e) => setLegoSession({ ...legoSession, engineerName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-bold clinical-input"
              />
            </div>

            {/* Supplier */}
            <div className="p-4 bg-slate-950 rounded-xl border border-teal-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-400 text-sm">2. The Supplier</span>
                <span className="text-[9px] bg-teal-500/10 text-teal-300 font-mono px-2 py-0.5 rounded font-bold">
                  Selects Blocks
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Listens to engineer, searches piece bin, and passes correct colored bricks to the builder.
              </p>
              <input
                type="text"
                value={legoSession.supplierName}
                onChange={(e) => setLegoSession({ ...legoSession, supplierName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-bold clinical-input"
              />
            </div>

            {/* Builder */}
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-sm">3. The Builder</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                  Assembles Structure
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Receives pieces from supplier and follows spatial orientation prompts from the engineer.
              </p>
              <input
                type="text"
                value={legoSession.builderName}
                onChange={(e) => setLegoSession({ ...legoSession, builderName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-bold clinical-input"
              />
            </div>
          </div>

          {/* Real-time Interactive Scorecard */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Real-Time Social Metrics & Skill Acquisition Scorecard
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Metric 1 */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Polite Requests (&quot;Please / May I&quot;)</span>
                  <span className="text-lg font-bold font-mono text-teal-400">{politeRequestsCount}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPoliteRequestsCount((p) => Math.max(0, p - 1))}
                    className="w-6 h-6 bg-slate-800 rounded text-slate-300 font-bold hover:bg-slate-700"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setPoliteRequestsCount((p) => p + 1)}
                    className="w-6 h-6 bg-teal-600 rounded text-white font-bold hover:bg-teal-500"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Turn-Taking Exchanges</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{turnTakingCount}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTurnTakingCount((p) => Math.max(0, p - 1))}
                    className="w-6 h-6 bg-slate-800 rounded text-slate-300 font-bold hover:bg-slate-700"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setTurnTakingCount((p) => p + 1)}
                    className="w-6 h-6 bg-amber-600 rounded text-white font-bold hover:bg-amber-500"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Frustration Regulation</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {frustrationRegulationScore} / 5
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFrustrationRegulationScore((p) => Math.max(1, p - 1))}
                    className="w-6 h-6 bg-slate-800 rounded text-slate-300 font-bold hover:bg-slate-700"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setFrustrationRegulationScore((p) => Math.min(5, p + 1))}
                    className="w-6 h-6 bg-emerald-600 rounded text-white font-bold hover:bg-emerald-500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Export action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-900">
              <span className="text-[11px] text-slate-400">
                Session build theme: <strong className="text-slate-200">{legoSession.theme}</strong>
              </span>

              <button
                onClick={handleExportLegoToCaseNote}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                {legoSessionSaved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{legoSessionSaved ? 'Saved to Case Notes!' : 'Export Session to Case Notes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Goal Attainment Scaling (GAS) Tracker */}
      {activeTab === 'gas-tracker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Goal Attainment Scaling (GAS) Clinical Framework
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Standardized psychometric scaling methodology for tracking participant progress against behavioral benchmarks. Click any score below to record live clinical assessment.
              </p>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded font-mono font-bold self-start sm:self-auto">
              Click Tier to Rate
            </span>
          </div>

          <div className="space-y-4">
            {selectedClient?.goals.map((goal) => (
              <div
                key={goal.id}
                className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded font-bold border border-indigo-500/20 uppercase">
                      {goal.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{goal.title}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-teal-400">
                      GAS Score: {goal.gasScore !== undefined ? (goal.gasScore > 0 ? `+${goal.gasScore}` : goal.gasScore) : '0 (Expected)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Progress: {goal.progressPercent}%</span>
                  </div>
                </div>

                {/* GAS 5-Point Rating Visualizer */}
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                  {[
                    { score: -2, label: 'Much Less (-2)', desc: 'Baseline / Frequent distress' },
                    { score: -1, label: 'Less Than (-1)', desc: 'Prompted compliance' },
                    { score: 0, label: 'Expected (0)', desc: 'Target Goal Achieved' },
                    { score: 1, label: 'More Than (+1)', desc: 'Spontaneous independence' },
                    { score: 2, label: 'Much More (+2)', desc: 'Generalizes across venues' },
                  ].map((tier) => {
                    const isSelected = goal.gasScore === tier.score;
                    return (
                      <button
                        key={tier.score}
                        type="button"
                        onClick={() => handleSelectGasScore(goal.id, tier.score)}
                        className={`p-2.5 rounded-lg border text-left gas-tier flex flex-col justify-between ${
                          isSelected
                            ? 'bg-teal-600 text-white font-bold border-teal-400 shadow-md scale-105 ring-2 ring-teal-400/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{tier.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </div>
                        <div className="text-[9px] mt-1 opacity-80 leading-tight">{tier.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Progress History Log */}
                {goal.gasHistory && goal.gasHistory.length > 0 && (
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Historical Progress Trajectory ({goal.gasHistory.length} checkpoints)
                    </span>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      {goal.gasHistory.map((h, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b border-slate-900/60 pb-1 last:border-0">
                          <span className="font-mono text-teal-400 font-bold">{h.date} (Score: {h.score > 0 ? `+${h.score}` : h.score})</span>
                          <span className="text-slate-400 text-[10px]">{h.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* TAB 4: STANDARDISED CLINICAL ASSESSMENTS (STAGE 1 CLINICAL POWERHOUSE) */}
      {activeTab === 'assessments' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Banner & Assessment Tool Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Allied Health Standardised Assessment Protocol Studio
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                    Stage 1 Studio
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vineland-3, Sensory Profile 2, VB-MAPP, ABLLS-R, PEDI-CAT, and WHODAS 2.0 psychometric scoring, radar charts, and AI diagnostic narrative synthesis.
                </p>
              </div>

              {/* Protocol Switcher Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['Vineland-3', 'Sensory Profile 2', 'VB-MAPP', 'ABLLS-R', 'PEDI-CAT', 'WHODAS 2.0'] as const).map((tool) => {
                  const isSelected = selectedAssessmentTool === tool;
                  return (
                    <button
                      key={tool}
                      onClick={() => {
                        setSelectedAssessmentTool(tool);
                        // Reset defaults based on tool
                        if (tool === 'Vineland-3') {
                          setAssessmentDomainScores({
                            'Communication': 74,
                            'Daily Living Skills': 68,
                            'Socialization': 62,
                            'Motor Skills': 85,
                            'Adaptive Behavior Composite': 71,
                          });
                        } else if (tool === 'Sensory Profile 2') {
                          setAssessmentDomainScores({
                            'Auditory Processing': 78,
                            'Visual Processing': 52,
                            'Touch / Tactile': 82,
                            'Movement / Vestibular': 45,
                            'Oral Sensory': 60,
                            'Sensory Avoiding': 86,
                          });
                        } else if (tool === 'VB-MAPP') {
                          setAssessmentDomainScores({
                            'Mand (Requests)': 28,
                            'Tact (Labeling)': 34,
                            'Echoic Imitation': 40,
                            'Intraverbal': 18,
                            'Listener Responding': 32,
                            'Barriers Score': 24,
                          });
                        } else if (tool === 'ABLLS-R') {
                          setAssessmentDomainScores({
                            'Cooperation': 75,
                            'Receptive Language': 60,
                            'Play & Leisure': 48,
                            'Functional Academics': 55,
                            'Self-Help': 62,
                            'Motor Imitation': 80,
                          });
                        } else if (tool === 'PEDI-CAT') {
                          setAssessmentDomainScores({
                            'Daily Activities': 42,
                            'Mobility': 58,
                            'Social / Cognitive': 38,
                            'Responsibility': 35,
                          });
                        } else if (tool === 'WHODAS 2.0') {
                          setAssessmentDomainScores({
                            'Cognition': 65,
                            'Mobility': 30,
                            'Self-Care': 45,
                            'Getting Along': 72,
                            'Life Activities': 68,
                            'Participation': 80,
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md ring-1 ring-purple-400/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assessment Input Sliders & Radar Chart Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Interactive Domain Sliders */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {selectedAssessmentTool} Domain Scoring Matrix
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(assessmentDomainScores).map(([domain, score]) => {
                    const maxVal = selectedAssessmentTool === 'VB-MAPP' ? 50 : selectedAssessmentTool === 'Vineland-3' ? 140 : 100;
                    const minVal = selectedAssessmentTool === 'VB-MAPP' ? 0 : selectedAssessmentTool === 'Vineland-3' ? 20 : 0;
                    
                    let qualitativeLabel = 'Typical';
                    if (selectedAssessmentTool === 'Vineland-3') {
                      qualitativeLabel = score < 70 ? 'Extremely Low' : score < 85 ? 'Moderately Low' : score <= 115 ? 'Adequate' : 'High';
                    } else if (selectedAssessmentTool === 'Sensory Profile 2') {
                      qualitativeLabel = score > 70 ? 'Much More than Others' : score > 60 ? 'More than Others' : 'Typical';
                    } else if (selectedAssessmentTool === 'WHODAS 2.0') {
                      qualitativeLabel = score > 70 ? 'Severe Difficulty' : score > 40 ? 'Moderate' : 'Mild / None';
                    }

                    return (
                      <div key={domain} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-bold truncate max-w-[150px]" title={domain}>
                            {domain}
                          </span>
                          <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-xs">
                            {score} pts
                          </span>
                        </div>
                        <input
                          type="range"
                          min={minVal}
                          max={maxVal}
                          value={score}
                          onChange={(e) =>
                            setAssessmentDomainScores((prev) => ({
                              ...prev,
                              [domain]: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-purple-500 cursor-pointer"
                        />
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Min: {minVal}</span>
                          <span className="text-purple-300 font-semibold">{qualitativeLabel}</span>
                          <span>Max: {maxVal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Psychometric Radar Chart Visualizer */}
              <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Psychometric Radar Profile
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30 font-semibold">
                    Normative Comparison
                  </span>
                </div>

                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={Object.entries(assessmentDomainScores).map(([domain, score]) => ({
                        domain: domain.length > 14 ? domain.slice(0, 12) + '..' : domain,
                        score: score,
                        baseline: selectedAssessmentTool === 'Vineland-3' ? 100 : selectedAssessmentTool === 'VB-MAPP' ? 25 : 50,
                      }))}
                    >
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="domain" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} stroke="#475569" />
                      <Radar
                        name={selectedClient.name}
                        dataKey="score"
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.45}
                      />
                      <Radar
                        name="Age Norm Baseline"
                        dataKey="baseline"
                        stroke="#0d9488"
                        fill="#0d9488"
                        fillOpacity={0.15}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#fff',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Participant Profile
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    Normative Cohort
                  </span>
                </div>
              </div>
            </div>

            {/* AI Narrative Generator Button & Narrative Preview */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Clinical Diagnostic Interpretation & Evidence Narrative
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsGeneratingAssessmentAi(true);
                      try {
                        const scoresSummary = Object.entries(assessmentDomainScores)
                          .map(([d, s]) => `- ${d}: ${s} points`)
                          .join('\n');

                        const prompt = `You are a Senior Clinical Psychologist and NDIS Positive Behaviour Support Specialist.
Generate an authoritative, neuroaffirming clinical diagnostic evaluation report for participant "${selectedClient.name}" (NDIS #${selectedClient.ndisNumber}) based on the standardised ${selectedAssessmentTool} assessment protocol.

Recorded Domain Scores:
${scoresSummary}

Provide:
1. Executive Clinical Summary & Adaptive Impact Analysis (2 comprehensive paragraphs linking functional deficits to environmental support requirements).
2. 3 Specific Neuro-affirming Positive Behaviour Support & Skill Acquisition Recommendations for support workers and educators.`;

                        const res = await fetch('/api/gemini/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ prompt }),
                        });
                        const data = await res.json();
                        if (data.text) {
                          setAssessmentInterpretation(data.text);
                        }
                      } catch (e) {
                        console.error(e);
                        // High-fidelity fallback
                        setAssessmentInterpretation(
                          `Clinical evaluation using the ${selectedAssessmentTool} protocol indicates significant functional support needs for ${selectedClient.name}. Adaptive behavior and sensory modulation show elevated vulnerability during high-arousal environmental transitions.\n\nRecommendations:\n1. Implement proactive low-arousal sensory breaks prior to structured activities.\n2. Introduce visual transition cues and schedule checklists to reduce cognitive fatigue.\n3. Reinforce functional replacement communication using high-preference AAC tools.`
                        );
                      } finally {
                        setIsGeneratingAssessmentAi(false);
                      }
                    }}
                    disabled={isGeneratingAssessmentAi}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isGeneratingAssessmentAi ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>AI Synthesize Diagnostic Narrative</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={assessmentInterpretation}
                onChange={(e) => setAssessmentInterpretation(e.target.value)}
                placeholder="Click 'AI Synthesize Diagnostic Narrative' or enter clinical diagnostic notes here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
              />

              {syncSuccessMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncSuccessMessage}</span>
                </div>
              )}

              {/* Action Buttons: Push to BSP & Commit to Clinical Vault */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const topDomains = Object.entries(assessmentDomainScores).slice(0, 3);
                    importFbaToBsp(selectedClient.id, {
                      functionalHypothesis: assessmentInterpretation || `${selectedAssessmentTool} indicates environmental adaptations required for daily functioning.`,
                      immediateTriggers: topDomains.map(([d]) => `Sensory/demand load in ${d}`),
                      settingEvents: [`Standardised ${selectedAssessmentTool} recorded`],
                      maintainingConsequences: ['Sensory regulation and environmental accommodation'],
                    });
                    setSyncSuccessMessage(`Successfully pushed ${selectedAssessmentTool} assessment findings directly to ${selectedClient.name}'s Behaviour Support Plan (BSP)!`);
                    setTimeout(() => setSyncSuccessMessage(null), 4000);
                  }}
                  className="px-3.5 py-2 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                >
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span>1-Click Sync to Active BSP Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const domainScoresArray = Object.entries(assessmentDomainScores).map(([name, score]) => ({
                      domainName: name,
                      rawScore: score,
                      adaptiveLevel: score < 70 ? ('Extremely Low' as const) : score < 85 ? ('Moderately Low' as const) : ('Adequate' as const),
                    }));

                    addClinicalAssessment({
                      clientId: selectedClient.id,
                      clientName: selectedClient.name,
                      practitionerId: currentUser.practitionerId || 'prac-1',
                      practitionerName: currentUser.name,
                      assessmentTool: selectedAssessmentTool,
                      assessmentDate: new Date().toISOString().slice(0, 10),
                      domainScores: domainScoresArray,
                      clinicalInterpretation: assessmentInterpretation || `Standardised ${selectedAssessmentTool} assessment completed with normative scoring.`,
                      recommendations: [
                        'Provide visual schedule support during transitions',
                        'Incorporate sensory breaks every 90 minutes',
                        'Review adaptive goals at 6-month clinical checkpoint',
                      ],
                      status: 'COMPLETED',
                    });

                    addNotification({
                      title: 'Assessment Vault Updated',
                      message: `Saved ${selectedAssessmentTool} assessment record for ${selectedClient.name}.`,
                      type: 'compliance',
                      severity: 'info',
                      linkTab: 'practice-tools',
                    });

                    setSyncSuccessMessage(`Assessment committed to ${selectedClient.name}'s permanent clinical vault!`);
                    setTimeout(() => setSyncSuccessMessage(null), 4000);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Commit Assessment to Clinical Vault</span>
                </button>
              </div>
            </div>
          </div>

          {/* Assessment History for Participant */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Standardised Assessment Records on File ({clinicalAssessments.filter((a) => a.clientId === selectedClient.id).length})
            </h4>

            <div className="space-y-3">
              {clinicalAssessments
                .filter((a) => a.clientId === selectedClient.id)
                .map((ass) => (
                  <div key={ass.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{ass.assessmentTool}</span>
                        <span className="text-[10px] bg-purple-500/10 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                          {ass.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{ass.assessmentDate}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
                      {ass.domainScores?.map((ds, idx) => (
                        <div key={idx} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px] truncate" title={ds.domainName}>
                            {ds.domainName}
                          </span>
                          <span className="text-purple-300 font-bold">{ds.rawScore} pts</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-900 whitespace-pre-wrap">
                      {ass.clinicalInterpretation}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
