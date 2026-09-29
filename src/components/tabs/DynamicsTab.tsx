'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Plus,
  ArrowLeft,
  Lock,
  Heart,
  FileCheck,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Search,
  X,
  Check
} from 'lucide-react';
import {
  INITIAL_DYNAMICS,
  INITIAL_RELATIONSHIPS,
  INITIAL_AGREEMENTS,
  CURRENT_USER
} from '../../data/domainDemoData';
import {
  Dynamic,
  DynamicStatus,
  CoreDynamicType,
  DynamicPracticeStage,
  ADULT_EXPRESSION_TAXONOMY
} from '../../types/domain';
import {
  formatAgreementScope,
  formatDynamicType,
  formatPracticeStage
} from '../../types/legacyAdapters';
import { VaultTab } from './VaultTab';
import { RitualsTab } from './RitualsTab';
import { CouplesDynamicsTab } from './CouplesDynamicsTab';

interface DynamicsTabProps {
  initialDynamicId?: string;
  onOpenEmergency: () => void;
}

export const DynamicsTab: React.FC<DynamicsTabProps> = ({
  initialDynamicId,
  onOpenEmergency
}) => {
  const [dynamics, setDynamics] = useState<Dynamic[]>(INITIAL_DYNAMICS);
  const [selectedDynamicId, setSelectedDynamicId] = useState<string | null>(
    initialDynamicId || INITIAL_DYNAMICS[0]?.id || null
  );
  const [filterStatus, setFilterStatus] = useState<DynamicStatus | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'sessions' | 'rituals' | 'permissions'>('overview');

  // Dynamic creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CoreDynamicType>('power_exchange');
  const [newStage, setNewStage] = useState<DynamicPracticeStage>('active');
  const [newTags, setNewTags] = useState<string[]>(['BDSM', 'Power Exchange']);
  const [newDesc, setNewDesc] = useState('');
  const [newRelId, setNewRelId] = useState(INITIAL_RELATIONSHIPS[0]?.id || '');

  const selectedDynamic = dynamics.find(d => d.id === selectedDynamicId);
  const selectedRel = INITIAL_RELATIONSHIPS.find(r => r.id === selectedDynamic?.relationshipId);
  const dynamicAgreements = INITIAL_AGREEMENTS.filter(a => a.dynamicId === selectedDynamic?.id);

  // Available descriptive tags extracted across dynamics
  const availableTags = Array.from(
    new Set(dynamics.flatMap(d => d.tags || []))
  );

  const toggleCreateTag = (tag: string) => {
    if (newTags.includes(tag)) {
      setNewTags(newTags.filter(t => t !== tag));
    } else {
      setNewTags([...newTags, tag]);
    }
  };

  const handleCreateDynamic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newDyn: Dynamic = {
      id: `dyn_${Date.now()}`,
      relationshipId: newRelId,
      name: newName.trim(),
      dynamicType: newType,
      tags: newTags,
      practiceStage: newStage,
      description: newDesc.trim() || 'Custom consensual dynamic in Haven.',
      status: newStage === 'interested' ? 'exploring' : 'active',
      participantIds: [CURRENT_USER.id],
      participantRoles: [
        {
          userId: CURRENT_USER.id,
          roleTitle: 'Participant',
          canApprovePermissions: true,
          canInitiateSessions: true,
          canModifyAgreements: true,
        },
      ],
      toolboxIds: [],
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'created',
          actorId: CURRENT_USER.id,
          note: `Dynamic registered as ${newStage}`,
        },
      ],
      activeAgreementsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDynamics(prev => [newDyn, ...prev]);
    setSelectedDynamicId(newDyn.id);
    setIsCreating(false);
    setNewName('');
    setNewDesc('');
    setNewTags(['BDSM', 'Power Exchange']);
  };

  const filteredDynamics = dynamics.filter(d => {
    const matchesStatus = filterStatus === 'all' ? true : d.status === filterStatus;
    const matchesTag = !selectedTag || (d.tags && d.tags.includes(selectedTag));
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      d.dynamicType.toLowerCase().includes(q) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)));

    return matchesStatus && matchesTag && matchesSearch;
  });

  const getStageBadgeClasses = (stage?: DynamicPracticeStage) => {
    switch (stage) {
      case 'interested':
        return 'bg-purple-950/70 text-purple-300 border-purple-800/40';
      case 'exploring':
        return 'bg-blue-950/70 text-blue-300 border-blue-800/40';
      case 'agreed':
        return 'bg-teal-950/70 text-teal-300 border-teal-800/40';
      case 'active':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/40';
      case 'paused':
        return 'bg-amber-950/70 text-amber-400 border-amber-800/40';
      case 'hard_boundary':
        return 'bg-rose-950/70 text-rose-400 border-rose-800/40';
      default:
        return 'bg-[#251433] text-[#fae8d7] border-[#381e47]';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1c1026] border border-[#251433]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d94f6f] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consensual Adult Dynamics &amp; Practices</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fae8d7]">Dynamics</h1>
          <p className="text-sm text-[#b59ebf] mt-1 max-w-xl">
            Model specific practices—power exchange, chastity, cuckold/hotwife, BDSM protocols, and emotional connections—anchored inside your relationships.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDynamic && (
            <button
              onClick={() => setSelectedDynamicId(null)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Dynamics</span>
            </button>
          )}
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Dynamic</span>
          </button>
        </div>
      </div>

      {/* Consent Progression & Adult Space Callout */}
      <div className="p-4 rounded-2xl bg-[#170a20] border border-[#2d163d] space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#fae8d7]">
          <Shield className="w-4 h-4 text-[#d94f6f]" />
          <span>Consent Progression: Interest → Discussion → Boundaries → Agreement → Practice → Review</span>
        </div>
        <p className="text-[11px] text-[#b59ebf] leading-relaxed">
          Descriptive tags and expressions of interest represent fantasies and desires. They never imply agreement or consent without explicit, bilateral sign-off between participants.
        </p>
      </div>

      {/* Creation Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreateDynamic}
          className="p-6 rounded-2xl bg-[#170c20] border border-[#d94f6f]/40 space-y-4 animate-fade-in shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[#2d163d] pb-3">
            <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d94f6f]" />
              Form a New Dynamic Framework
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-[#b59ebf] hover:text-[#fae8d7]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                Dynamic Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Chastity, Power Exchange, Cuckold / Hotwife"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                Container Relationship
              </label>
              <select
                value={newRelId}
                onChange={e => setNewRelId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              >
                {INITIAL_RELATIONSHIPS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.structure})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                Dynamic Archetype
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as CoreDynamicType)}
                className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              >
                <option value="power_exchange">Power Exchange (D/s)</option>
                <option value="chastity_practice">Chastity</option>
                <option value="cuckold_hotwife">Cuckold / Hotwife</option>
                <option value="bdsm_protocol">BDSM Protocol</option>
                <option value="sensory_service">Sensory Play</option>
                <option value="service_oriented">Service & Devotion</option>
                <option value="emotional_intimacy">Emotional Intimacy</option>
                <option value="roleplay_kink">Roleplay & Kink</option>
                <option value="long_distance">Long Distance Connection</option>
                <option value="custom">Custom Dynamic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
              Practice &amp; Consent Lifecycle Stage
            </label>
            <select
              value={newStage}
              onChange={e => setNewStage(e.target.value as DynamicPracticeStage)}
              className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
            >
              <option value="interested">Interested in (Fantasy or personal desire)</option>
              <option value="exploring">Exploring (Under active bilateral discussion)</option>
              <option value="agreed">Agreed (Consented boundaries established)</option>
              <option value="active">Active (Currently in live practice)</option>
              <option value="paused">Paused (Temporarily resting)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
              Descriptive Adult Taxonomy Tags (Select all that describe this dynamic)
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#100717] border border-[#2d163d] max-h-36 overflow-y-auto">
              {ADULT_EXPRESSION_TAXONOMY.map(tag => {
                const isSelected = newTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCreateTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#d94f6f] text-white shadow-xs'
                        : 'bg-[#1c1026] text-[#b59ebf] border border-[#2d163d] hover:text-[#fae8d7]'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
              Description &amp; Intention
            </label>
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="e.g. A consensual power-exchange dynamic maintained across distance with agreed rules and regular check-ins."
              className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-colors"
            >
              Establish Dynamic
            </button>
          </div>
        </form>
      )}

      {/* Main View: Dynamic Detail vs Overview Grid */}
      {!selectedDynamic ? (
        /* Overview Grid of all Dynamics */
        <div className="space-y-6">
          {/* Filter Bar & Search */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
              <div className="flex items-center gap-1.5 bg-[#150a1e] p-1 rounded-xl border border-[#251433] text-xs font-semibold">
                {(['all', 'active', 'exploring', 'negotiating', 'paused'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      filterStatus === status
                        ? 'bg-[#251433] text-[#fae8d7] font-bold shadow-xs'
                        : 'text-[#8d7596] hover:text-[#fae8d7]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8d7596] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search dynamics or tags..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#fae8d7] placeholder-[#6d5575] focus:outline-none focus:border-[#d94f6f]"
                />
              </div>
            </div>

            {/* Tag Filter Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d7596] shrink-0 mr-1">
                Filter by tag:
              </span>
              {availableTags.map(tag => {
                const isTagSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                      isTagSelected
                        ? 'bg-[#d94f6f] text-white font-semibold shadow-xs'
                        : 'bg-[#150a1e] text-[#8d7596] hover:text-[#fae8d7] border border-[#251433]'
                    }`}
                  >
                    <span>{tag}</span>
                    {isTagSelected && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredDynamics.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#1c1026] border border-[#251433] space-y-3">
              <Sparkles className="w-8 h-8 text-[#8d7596] mx-auto opacity-40" />
              <h3 className="text-sm font-bold text-[#fae8d7]">No dynamics match</h3>
              <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
                No dynamic frameworks match your current search query or tag filter.
              </p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDynamics.map(dyn => {
                const rel = INITIAL_RELATIONSHIPS.find(r => r.id === dyn.relationshipId);
                return (
                  <div
                    key={dyn.id}
                    onClick={() => setSelectedDynamicId(dyn.id)}
                    className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] hover:border-[#d94f6f]/50 hover:bg-[#20112c] transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-3">
                      {/* Archetype & Practice Stage Badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#d94f6f]">
                          {formatDynamicType(dyn.dynamicType)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border capitalize font-semibold ${getStageBadgeClasses(
                            dyn.practiceStage
                          )}`}
                        >
                          {formatPracticeStage(dyn.practiceStage)}
                        </span>
                      </div>

                      {/* Dynamic Title */}
                      <h3 className="text-base font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                        {dyn.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#b59ebf] line-clamp-2 leading-relaxed">
                        {dyn.description}
                      </p>

                      {/* Descriptive Tags */}
                      {dyn.tags && dyn.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {dyn.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-[#160b1e] border border-[#2d163d] text-[10px] font-medium text-[#b59ebf]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#251433] flex items-center justify-between text-xs text-[#8d7596]">
                      <span>In: {rel?.name || 'Relationship'}</span>
                      <span className="text-[#fae8d7] font-semibold group-hover:underline flex items-center gap-1">
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Selected Dynamic Deep View */
        <div className="space-y-6">
          {/* Dynamic Banner & Navigation Sub-Tabs */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-[#251433] text-[#d94f6f]">
                    {formatDynamicType(selectedDynamic.dynamicType)}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border capitalize font-semibold ${getStageBadgeClasses(
                      selectedDynamic.practiceStage
                    )}`}
                  >
                    {formatPracticeStage(selectedDynamic.practiceStage)}
                  </span>
                  <span className="text-xs text-[#b59ebf]">
                    Relationship: <strong className="text-[#fae8d7]">{selectedRel?.name}</strong>
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#fae8d7]">{selectedDynamic.name}</h2>
                <p className="text-xs text-[#b59ebf] max-w-2xl leading-relaxed">{selectedDynamic.description}</p>

                {/* Descriptive Tags */}
                {selectedDynamic.tags && selectedDynamic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedDynamic.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-[#251433] border border-[#381e47] text-[11px] font-medium text-[#fae8d7]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/40 capitalize">
                  {selectedDynamic.status}
                </span>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex items-center gap-2 border-t border-[#251433] pt-4 overflow-x-auto text-xs font-semibold scrollbar-none">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'overview'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Agreements &amp; Protocols</span>
              </button>

              <button
                onClick={() => setActiveSubTab('sessions')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'sessions'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Sessions &amp; Countdown (Vault)</span>
              </button>

              <button
                onClick={() => setActiveSubTab('rituals')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'rituals'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Dynamic Rituals</span>
              </button>

              <button
                onClick={() => setActiveSubTab('permissions')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'permissions'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Permissions &amp; Prompts</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab Contents */}
          {activeSubTab === 'overview' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex items-center justify-between border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#d94f6f]" />
                    Agreed Protocols &amp; Boundaries ({dynamicAgreements.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">Mutual boundaries negotiated with affirmative consent.</p>
                </div>
              </div>

              {dynamicAgreements.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#8d7596]">
                  No formal agreements registered yet for this dynamic.
                </div>
              ) : (
                <div className="space-y-3">
                  {dynamicAgreements.map(agr => (
                    <div
                      key={agr.id}
                      className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <h4 className="text-sm font-semibold text-[#fae8d7]">{agr.title}</h4>
                          <span className="text-[10px] uppercase font-bold text-[#d94f6f] px-1.5 py-0.5 rounded bg-[#251433]">
                            {formatAgreementScope(agr.scope)}
                          </span>
                        </div>
                        <p className="text-xs text-[#b59ebf] leading-relaxed max-w-2xl">{agr.content}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[#8d7596] block">
                          Agreed on {new Date(agr.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                          ✓ Signed by both
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'sessions' && (
            <div className="rounded-2xl bg-[#1c1026] border border-[#251433] p-4 sm:p-6">
              <VaultTab onOpenEmergency={onOpenEmergency} />
            </div>
          )}

          {activeSubTab === 'rituals' && (
            <div className="rounded-2xl bg-[#1c1026] border border-[#251433] p-4 sm:p-6">
              <RitualsTab />
            </div>
          )}

          {activeSubTab === 'permissions' && (
            <div className="rounded-2xl bg-[#1c1026] border border-[#251433] p-4 sm:p-6">
              <CouplesDynamicsTab />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
