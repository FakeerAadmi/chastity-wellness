'use client';

import React, { useState } from 'react';
import {
  Experience,
  ExperienceType,
  ExperienceStep,
  ExperienceStepType,
  Relationship,
  Dynamic,
  User
} from '@/types/domain';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Layers
} from 'lucide-react';

interface ExperienceBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  dynamics: Dynamic[];
  users: User[];
  currentUserId: string;
  onSave: (experience: Experience) => void;
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}`;
}

export const ExperienceBuilderModal: React.FC<ExperienceBuilderModalProps> = ({
  isOpen,
  onClose,
  relationships,
  dynamics,
  users,
  currentUserId,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [intent, setIntent] = useState('');
  const [description, setDescription] = useState('');
  const [experienceType, setExperienceType] = useState<ExperienceType>('sensory');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string>(
    relationships[0]?.id || ''
  );
  const [selectedDynamicId, setSelectedDynamicId] = useState<string>(
    dynamics[0]?.id || ''
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [isTemplate, setIsTemplate] = useState<boolean>(false);

  // Steps
  const [steps, setSteps] = useState<ExperienceStep[]>([
    {
      id: 'step_1',
      order: 1,
      title: 'Arrival & Grounding Breath',
      stepType: 'prompt',
      description: 'Find a comfortable space together. Disconnect from external screens and synchronize your breathing.',
      durationMinutes: 5,
      roleAssignment: 'all'
    },
    {
      id: 'step_2',
      order: 2,
      title: 'Sensory Exploration / Core Practice',
      stepType: 'action',
      description: 'Engage with deliberate, tactile pacing according to agreed boundaries.',
      durationMinutes: 20,
      roleAssignment: 'all'
    },
    {
      id: 'step_3',
      order: 3,
      title: 'Aftercare & Gentle Reconnection',
      stepType: 'aftercare',
      description: 'Provide water, warmth, hold each other closely, and share quiet appreciation.',
      durationMinutes: 10,
      roleAssignment: 'all'
    }
  ]);

  const currentRel = relationships.find(r => r.id === selectedRelationshipId);
  const participantIds: string[] = currentRel?.participants.map(p => p.userId) || [currentUserId];

  const handleAddStep = () => {
    const newId = `step_${Date.now()}`;
    const newStep: ExperienceStep = {
      id: newId,
      order: steps.length + 1,
      title: `Step ${steps.length + 1}`,
      stepType: 'action',
      description: '',
      durationMinutes: 10,
      roleAssignment: 'all'
    };
    setSteps(prev => [...prev, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const handleUpdateStep = (id: string, updates: Partial<ExperienceStep>) => {
    setSteps(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleAddBranchOption = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => {
        if (s.id !== stepId) return s;
        const options = s.options || [];
        const optId = `opt_${Date.now()}_${options.length + 1}`;
        return {
          ...s,
          options: [
            ...options,
            {
              id: optId,
              label: `Path ${String.fromCharCode(65 + options.length)}: Choice`,
              description: 'Description of this chosen path branch'
            }
          ]
        };
      })
    );
  };

  const handleSave = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    // Build default readiness & role mapping
    const readiness: Record<string, 'ready' | 'not_ready'> = {};
    const roles: Record<string, string> = {};
    participantIds.forEach((pid: string) => {
      readiness[pid] = pid === currentUserId ? 'ready' : 'not_ready';
      roles[pid] = pid === currentUserId ? 'Initiator' : 'Partner';
    });

    const newExperience: Experience = {
      id: createId('exp'),
      title: title.trim(),
      description: description.trim() || 'A curated dynamic experience in Haven.',
      intent: intent.trim() || undefined,
      experienceType,
      status: 'scheduled',
      relationshipId: selectedRelationshipId,
      dynamicId: selectedDynamicId || undefined,
      participantIds,
      participantRoles: roles,
      participantReadiness: readiness,
      estimatedDurationMinutes: durationMinutes,
      isTemplate,
      steps,
      createdById: currentUserId,
      visibility: 'relationship_shared',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newExperience);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#140b1c] border border-[#3b1f4e] shadow-2xl overflow-hidden my-8 text-[#fae8d7]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#241334] to-[#1a0c26] border-b border-[#381e47] flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#fae8d7] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d94f6f]" />
              <span>Design a Dynamic Experience</span>
            </h2>
            <p className="text-xs text-[#b59ebf]">
              Compose an immersive journey with prompts, tactile pacing, branching, and integrated aftercare.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Builder Form */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Experience Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Midnight Blindfold & Sensory Awakening"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1025] border border-[#381e47] text-sm text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Category & Type
              </label>
              <select
                value={experienceType}
                onChange={e => setExperienceType(e.target.value as ExperienceType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1025] border border-[#381e47] text-sm text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              >
                <option value="sensory">Sensory Immersion</option>
                <option value="bdsm_scene">BDSM / Power Exchange</option>
                <option value="chastity_tease">Chastity & Orgasm Control</option>
                <option value="cuckold_fantasy">Hotwife / Cuckold Dynamic</option>
                <option value="erotic_ritual">Erotic Devotion & Ritual</option>
                <option value="long_distance">Long-Distance Whispers</option>
                <option value="reconnection">Emotional & Body Reconnection</option>
                <option value="custom">Custom Journey</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value) || 20)}
                min={5}
                max={240}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1025] border border-[#381e47] text-sm text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Intent / Emotional Arc
              </label>
              <input
                type="text"
                value={intent}
                onChange={e => setIntent(e.target.value)}
                placeholder="e.g., Deepen surrender, explore anticipation through stillness..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1025] border border-[#381e47] text-sm text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Detailed Narrative Overview
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what partners will explore, prerequisites needed (blindfold, oil, chastity device, timer)..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1b1025] border border-[#381e47] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Associated Relationship
              </label>
              <select
                value={selectedRelationshipId}
                onChange={e => setSelectedRelationshipId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1025] border border-[#381e47] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              >
                {relationships.map(rel => (
                  <option key={rel.id} value={rel.id}>
                    {rel.name || `Relationship (${rel.structure})`}
                  </option>
                ))}
              </select>
              {currentRel && (
                <span className="text-[11px] text-[#b59ebf] block pt-1">
                  Partners: {currentRel.participants.map(p => users.find(u => u.id === p.userId)?.displayName || p.displayName).join(', ')}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Associated Dynamic (Optional)
              </label>
              <select
                value={selectedDynamicId}
                onChange={e => setSelectedDynamicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1025] border border-[#381e47] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              >
                <option value="">None / General Relationship</option>
                {dynamics.map(dyn => (
                  <option key={dyn.id} value={dyn.id}>
                    {dyn.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Steps Editor */}
          <div className="space-y-3 pt-4 border-t border-[#2d1838]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Experience Steps & Branching ({steps.length})</span>
              </h3>
              <button
                onClick={handleAddStep}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-[#251433] hover:bg-[#341b46] border border-[#381e47] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-2xl bg-[#1b1025] border border-[#2d1838] space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-full bg-[#2a1639] border border-[#3f2154] flex items-center justify-center font-mono font-bold text-xs text-[#fae8d7]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={e => handleUpdateStep(step.id, { title: e.target.value })}
                        placeholder="Step title"
                        className="flex-1 px-2.5 py-1 rounded-lg bg-[#251433] border border-[#381e47] text-xs font-bold text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={step.stepType}
                        onChange={e =>
                          handleUpdateStep(step.id, {
                            stepType: e.target.value as ExperienceStepType
                          })
                        }
                        className="px-2 py-1 rounded-lg bg-[#251433] border border-[#381e47] text-[11px] text-[#fae8d7]"
                      >
                        <option value="prompt">Prompt / Text</option>
                        <option value="action">Action / Practice</option>
                        <option value="sensory">Sensory</option>
                        <option value="decision_branch">Decision Branch</option>
                        <option value="timer">Timer Focus</option>
                        <option value="reflection">Reflection</option>
                        <option value="aftercare">Aftercare</option>
                      </select>

                      <input
                        type="number"
                        value={step.durationMinutes || 5}
                        onChange={e =>
                          handleUpdateStep(step.id, {
                            durationMinutes: parseInt(e.target.value) || 5
                          })
                        }
                        className="w-14 px-2 py-1 rounded-lg bg-[#251433] border border-[#381e47] text-[11px] text-center text-[#fae8d7]"
                        placeholder="min"
                      />

                      <button
                        onClick={() => handleRemoveStep(step.id)}
                        className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={step.description || ''}
                    onChange={e => handleUpdateStep(step.id, { description: e.target.value })}
                    placeholder="Instructions, narrative tone, or guidance for this step..."
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#140b1c] border border-[#2d1838] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f] resize-none"
                  />

                  {/* If decision branch, add options editor */}
                  {step.stepType === 'decision_branch' && (
                    <div className="pl-6 space-y-2 pt-1 border-l-2 border-purple-800/40">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-300">
                          Branch Paths:
                        </span>
                        <button
                          onClick={() => handleAddBranchOption(step.id)}
                          className="text-[10px] text-purple-300 hover:text-white"
                        >
                          + Add Branch Choice
                        </button>
                      </div>

                      {(step.options || []).map((opt, optIdx) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.label}
                            onChange={e => {
                              const updatedOptions = [...(step.options || [])];
                              updatedOptions[optIdx] = { ...opt, label: e.target.value };
                              handleUpdateStep(step.id, { options: updatedOptions });
                            }}
                            className="flex-1 px-2 py-1 rounded-md bg-[#251433] border border-[#381e47] text-[11px] text-[#fae8d7]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Template checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isTemplate"
              checked={isTemplate}
              onChange={e => setIsTemplate(e.target.checked)}
              className="rounded bg-[#1b1025] border-[#381e47] text-[#d94f6f] focus:ring-0"
            />
            <label htmlFor="isTemplate" className="text-xs text-[#b59ebf] cursor-pointer">
              Save as a reusable Experience Template in your library
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#1a0c26] border-t border-[#381e47] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] hover:from-[#e25c7c] hover:to-[#8b4bf3] shadow-md shadow-[#d94f6f]/25 disabled:opacity-50 transition-all"
          >
            Save & Schedule Experience
          </button>
        </div>
      </div>
    </div>
  );
};
