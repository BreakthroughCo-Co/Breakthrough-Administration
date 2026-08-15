'use client';

import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';

export const PracticeToolsModule: React.FC = () => {
  const { clients } = useManagementStore();
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || 'cli-101');
  const [activeTab, setActiveTab] = useState<'lego' | 'social-stories'>('social-stories');

  // Social Story Generator State
  const [socialStoryPrompt, setSocialStoryPrompt] = useState({
    situation: 'Taking the bus to the day program during peak sensory noise',
    targetEmotion: 'Calmness & Sensory Self-Regulation',
    participantAge: 'Young Adult (19 yrs)',
  });
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Lego Therapy Planner State
  const [legoSession, setLegoSession] = useState({
    theme: 'Building a Community Rescue Station',
    engineerName: 'Jordan (Participant)',
    builderName: 'Marcus (Specialist)',
    supplierName: 'Carer Support',
    socialTarget: 'Turn-taking, expressing frustration with words, asking for pieces politely',
  });

  const selectedClientObj = clients.find((c: Client) => c.id === selectedClient);

  const handleGenerateSocialStory = async () => {
    setIsGeneratingStory(true);
    try {
      const prompt = `Write a personalized, clear, neuroaffirming NDIS Social Story for participant ${selectedClientObj?.name || 'Participant'}.
Situation: ${socialStoryPrompt.situation}
Target Emotion/Goal: ${socialStoryPrompt.targetEmotion}
Age Group: ${socialStoryPrompt.participantAge}

Format the story into 5 structured, encouraging paragraphs:
1. Descriptive sentences (Where I am and what is happening).
2. Perspective sentences (How others feel and why it is loud/busy).
3. Directive/Positive coping sentences (What I can do - e.g. put on noise-cancelling headphones, take 3 deep breaths).
4. Affirming closing sentence (I am safe and supported).

Use simple, respectful, first-person language ("I can...", "My body...").`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are an expert NDIS Clinical Allied Health Specialist creating Social Stories.',
        }),
      });

      const data = await res.json();
      if (data.text) {
        setGeneratedStory(data.text);
      }
    } catch (e) {
      console.error('Failed to generate social story:', e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Clinical & Social Practice Tools</h2>
            <p className="text-xs text-slate-400">
              Lego Based Therapy role assignments and AI-powered personalized NDIS Social Story builder.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('social-stories')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'social-stories'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            AI Social Stories
          </button>
          <button
            onClick={() => setActiveTab('lego')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'lego'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            Lego Based Therapy
          </button>
        </div>
      </div>

      {/* Participant Selection */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <span className="text-xs text-slate-400 font-semibold shrink-0">Select Participant:</span>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-teal-500 w-full sm:w-64"
        >
          {clients.map((c: Client) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.primaryDisability})
            </option>
          ))}
        </select>
      </div>

      {/* AI Social Stories Section */}
      {activeTab === 'social-stories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              Social Story Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Situation / Trigger</label>
                <textarea
                  rows={2}
                  value={socialStoryPrompt.situation}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, situation: e.target.value })
                  }
                  placeholder="e.g. Visiting the dentist or taking the bus..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Regulation / Emotion Goal</label>
                <input
                  type="text"
                  value={socialStoryPrompt.targetEmotion}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, targetEmotion: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Participant Stage</label>
                <input
                  type="text"
                  value={socialStoryPrompt.participantAge}
                  onChange={(e) =>
                    setSocialStoryPrompt({ ...socialStoryPrompt, participantAge: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <button
                onClick={handleGenerateSocialStory}
                disabled={isGeneratingStory}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isGeneratingStory ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>{isGeneratingStory ? 'Crafting Social Story...' : 'Generate AI Social Story'}</span>
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Custom Story Canvas ({selectedClientObj?.name})
            </h3>

            {generatedStory ? (
              <div className="p-4 bg-slate-950/80 rounded-xl border border-teal-500/20 text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-3 font-serif">
                {generatedStory}
              </div>
            ) : (
              <div className="p-8 bg-slate-950/40 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                Fill out parameters on the left and click &quot;Generate AI Social Story&quot; to create a custom narrative.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lego Based Therapy Section */}
      {activeTab === 'lego' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" />
              Lego Based Therapy Collaboration Planner
            </h3>
            <span className="text-xs text-teal-400 font-mono">Capacity Building Intervention</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm">1. Engineer</span>
              <p className="text-slate-400 text-[11px]">Describes the instructions from the diagram to the supplier.</p>
              <input
                type="text"
                value={legoSession.engineerName}
                onChange={(e) => setLegoSession({ ...legoSession, engineerName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-teal-400 text-sm">2. Supplier</span>
              <p className="text-slate-400 text-[11px]">Finds the correct Lego bricks requested and hands them to builder.</p>
              <input
                type="text"
                value={legoSession.supplierName}
                onChange={(e) => setLegoSession({ ...legoSession, supplierName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm">3. Builder</span>
              <p className="text-slate-400 text-[11px]">Listens to instructions from engineer and puts pieces together.</p>
              <input
                type="text"
                value={legoSession.builderName}
                onChange={(e) => setLegoSession({ ...legoSession, builderName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300">Social Communication Goal & Metrics</span>
            <p className="text-slate-200">{legoSession.socialTarget}</p>
          </div>
        </div>
      )}
    </div>
  );
};
