'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Users,
  Shield,
  Plus,
  Flame,
  HelpCircle,
  Compass,
  Check
} from 'lucide-react';
import {
  Desire,
  DesireCategory,
  DesireRating,
  DesireSharingMode,
  User,
  Relationship,
  ADULT_EXPRESSION_TAXONOMY
} from '@/types/domain';

interface DesireCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  relationships: Relationship[];
  onCreateDesire: (desire: Desire) => void;
}

export const DesireCreationModal: React.FC<DesireCreationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  relationships,
  onCreateDesire,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DesireCategory>('intimacy_sensual');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [sharingMode, setSharingMode] = useState<DesireSharingMode>('mutual_match_only');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(
    relationships[0]?.id || ''
  );
  const [initialRating, setInitialRating] = useState<DesireRating>('curious');

  if (!isOpen) return null;

  const categories: { key: DesireCategory; label: string }[] = [
    { key: 'intimacy_sensual', label: 'Sensual Intimacy & Romance' },
    { key: 'bdsm_power', label: 'BDSM & Power Exchange' },
    { key: 'chastity_control', label: 'Chastity & Orgasm Control' },
    { key: 'non_monogamy', label: 'Non-Monogamy & Cuckold/Hotwife' },
    { key: 'roleplay_fantasy', label: 'Erotic Roleplay & Personas' },
    { key: 'service_protocol', label: 'Service & Domestic Protocol' },
    { key: 'fetish_kink', label: 'Fetish & Specialized Kink' },
    { key: 'emotional_connection', label: 'Emotional & Deep Dialogue' },
    { key: 'daily_living', label: 'Daily Living & Adventure' },
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newDesire: Desire = {
      id: `des_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      tags: selectedTags,
      createdById: currentUser.id,
      relationshipId: selectedRelationshipId || undefined,
      sharingMode,
      participantResponses: {
        [currentUser.id]: {
          userId: currentUser.id,
          rating: initialRating,
          updatedAt: new Date().toISOString(),
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateDesire(newDesire);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#160d20] border border-[#3b1f4c] shadow-2xl p-6 sm:p-8 space-y-6 text-[#fae8d7]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create New Desire or Fantasy</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#fae8d7]">
              Articulate Your Desire
            </h2>
            <p className="text-xs text-[#b59ebf]">
              Privately declare what excites you. Protected by double-blind matching.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#251433] text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Desire / Scenario Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Sensory Blindfolded Massage with Acoustic Music"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-sm text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Core Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as DesireCategory)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
            >
              {categories.map(c => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Description & Scenario Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you imagine, how you would like it to feel, or specific boundaries to respect..."
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs sm:text-sm text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          {/* Adult Expression Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Adult Expression Tags
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl bg-[#1c1026] border border-[#2f193d]">
              {ADULT_EXPRESSION_TAXONOMY.slice(0, 18).map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#d94f6f] text-white'
                        : 'bg-[#251433] text-[#b59ebf] hover:text-[#fae8d7]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            {/* Custom Tag write-in */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value)}
                placeholder="Add custom tag..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 rounded-xl bg-[#251433] text-[#fae8d7] text-xs font-bold hover:bg-[#341b47] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Privacy & Sharing Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Privacy & Sharing Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSharingMode('mutual_match_only')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  sharingMode === 'mutual_match_only'
                    ? 'bg-[#d94f6f]/20 border-[#d94f6f] text-[#fae8d7] shadow-sm'
                    : 'bg-[#1c1026] border-[#2f193d] text-[#b59ebf] hover:text-[#fae8d7]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Lock className="w-3.5 h-3.5 text-[#d94f6f]" />
                  <span>Double-Blind</span>
                </div>
                <p className="text-[10px] text-[#b59ebf] leading-tight">
                  Only revealed if partner independently rates with interest.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSharingMode('shared_relationship')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  sharingMode === 'shared_relationship'
                    ? 'bg-[#60a5fa]/20 border-[#60a5fa] text-[#fae8d7] shadow-sm'
                    : 'bg-[#1c1026] border-[#2f193d] text-[#b59ebf] hover:text-[#fae8d7]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Users className="w-3.5 h-3.5 text-[#60a5fa]" />
                  <span>Shared</span>
                </div>
                <p className="text-[10px] text-[#b59ebf] leading-tight">
                  Visible to relationship members for discussion.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSharingMode('private')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  sharingMode === 'private'
                    ? 'bg-[#f472b6]/20 border-[#f472b6] text-[#fae8d7] shadow-sm'
                    : 'bg-[#1c1026] border-[#2f193d] text-[#b59ebf] hover:text-[#fae8d7]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>Private Only</span>
                </div>
                <p className="text-[10px] text-[#b59ebf] leading-tight">
                  Confidential to your sovereign vault. Never shared.
                </p>
              </button>
            </div>
          </div>

          {/* Relationship Selection & Initial Sovereign Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Relationship
              </label>
              <select
                value={selectedRelationshipId}
                onChange={e => setSelectedRelationshipId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                {relationships.map(rel => (
                  <option key={rel.id} value={rel.id}>
                    {rel.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Your Initial Rating
              </label>
              <select
                value={initialRating}
                onChange={e => setInitialRating(e.target.value as DesireRating)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                <option value="eager">🔥 Eager about</option>
                <option value="curious">✨ Curious about</option>
                <option value="exploring">🧭 Maybe / Exploring</option>
                <option value="fantasy_only">💭 Fantasy only</option>
                <option value="unsure">❓ Unsure</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2a1738]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity"
            >
              Save to Desires
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
