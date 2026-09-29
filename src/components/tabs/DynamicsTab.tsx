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
  ChevronRight,
  Search,
  X,
  Check,
  Flame,
  ListChecks
} from 'lucide-react';
import {
  INITIAL_DYNAMICS,
  INITIAL_RELATIONSHIPS,
  INITIAL_AGREEMENTS,
  INITIAL_SESSIONS,
  INITIAL_RITUALS,
  INITIAL_DESIRES,
  INITIAL_HAVEN_REQUESTS,
  INITIAL_TASKS,
  CURRENT_USER,
  ALL_USERS
} from '../../data/domainDemoData';
import {
  Dynamic,
  DynamicStatus,
  CoreDynamicType,
  DynamicPracticeStage,
  ADULT_EXPRESSION_TAXONOMY,
  Agreement,
  Session,
  Ritual,
  Desire,
  HavenRequest,
  HavenTask,
  DesireRating,
  TaskProof,
} from '../../types/domain';
import { AgreementCard } from '../agreements/AgreementCard';
import { AgreementDetailModal } from '../agreements/AgreementDetailModal';
import { AgreementCreationModal } from '../agreements/AgreementCreationModal';
import { SessionCard } from '../sessions/SessionCard';
import { SessionDetailModal } from '../sessions/SessionDetailModal';
import { SessionCreationModal } from '../sessions/SessionCreationModal';
import { RitualCard } from '../rituals/RitualCard';
import { RitualExecutionModal } from '../rituals/RitualExecutionModal';
import { DesireCard } from '../desires/DesireCard';
import { DesireCreationModal } from '../desires/DesireCreationModal';
import { RequestCard } from '../requests/RequestCard';
import { RequestCreationModal } from '../requests/RequestCreationModal';
import { TaskCard } from '../tasks/TaskCard';
import { TaskCreationModal } from '../tasks/TaskCreationModal';
import {
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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'requests' | 'tasks' | 'sessions' | 'rituals' | 'desires' | 'permissions'>('overview');

  // Dynamic creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CoreDynamicType>('power_exchange');
  const [newStage, setNewStage] = useState<DynamicPracticeStage>('active');
  const [newTags, setNewTags] = useState<string[]>(['BDSM', 'Power Exchange']);
  const [newDesc, setNewDesc] = useState('');
  const [newRelId, setNewRelId] = useState(INITIAL_RELATIONSHIPS[0]?.id || '');

  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [selectedAgreementForDetail, setSelectedAgreementForDetail] = useState<Agreement | null>(null);
  const [isCreateAgreementOpen, setIsCreateAgreementOpen] = useState(false);

  // Sessions State (Phase 5)
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<Session | null>(null);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<'all' | 'active' | 'planned' | 'completed'>('all');
  const [showVaultTimer, setShowVaultTimer] = useState(false);

  // Rituals State (Phase 5)
  const [rituals, setRituals] = useState<Ritual[]>(INITIAL_RITUALS);
  const [selectedRitualForExecution, setSelectedRitualForExecution] = useState<Ritual | null>(null);
  const [showRitualTemplates, setShowRitualTemplates] = useState(false);

  // Phase 6 State: Desires, Requests, Tasks
  const [desires, setDesires] = useState<Desire[]>(INITIAL_DESIRES);
  const [isCreateDesireOpen, setIsCreateDesireOpen] = useState(false);
  const [requests, setRequests] = useState<HavenRequest[]>(INITIAL_HAVEN_REQUESTS);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [tasks, setTasks] = useState<HavenTask[]>(INITIAL_TASKS);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const selectedDynamic = dynamics.find(d => d.id === selectedDynamicId);
  const selectedRel = INITIAL_RELATIONSHIPS.find(r => r.id === selectedDynamic?.relationshipId);
  const dynamicAgreements = agreements.filter(a => a.dynamicId === selectedDynamic?.id);

  // Dynamic sessions & rituals
  const dynamicSessions = sessions.filter(s =>
    s.dynamicId === selectedDynamic?.id || (s.relationshipId === selectedDynamic?.relationshipId && !s.dynamicId)
  );

  const filteredDynamicSessions = dynamicSessions.filter(s => {
    if (sessionFilter === 'all') return true;
    return s.status === sessionFilter;
  });

  const dynamicRituals = rituals.filter(r =>
    r.dynamicId === selectedDynamic?.id || (r.relationshipId === selectedDynamic?.relationshipId && !r.dynamicId)
  );

  // Dynamic Phase 6 collections
  const dynamicRequests = requests.filter(r =>
    r.dynamicId === selectedDynamic?.id || (r.relationshipId === selectedDynamic?.relationshipId && !r.dynamicId)
  );

  const dynamicTasks = tasks.filter(t =>
    t.dynamicId === selectedDynamic?.id || (t.relationshipId === selectedDynamic?.relationshipId && !t.dynamicId)
  );

  const dynamicDesires = desires.filter(d =>
    d.dynamicId === selectedDynamic?.id ||
    (d.relationshipId === selectedDynamic?.relationshipId && (d.tags?.some(t => selectedDynamic?.tags?.includes(t)) || !d.dynamicId))
  );

  const handleUpdateAgreement = (updated: Agreement) => {
    setAgreements(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (selectedAgreementForDetail?.id === updated.id) {
      setSelectedAgreementForDetail(updated);
    }
  };

  const handleCreateAgreement = (newAgr: Agreement) => {
    setAgreements(prev => [newAgr, ...prev]);
    setSelectedAgreementForDetail(newAgr);
  };

  const handleUpdateSession = (updated: Session) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (selectedSessionForDetail?.id === updated.id) {
      setSelectedSessionForDetail(updated);
    }
  };

  const handleCreateSession = (newSess: Session) => {
    setSessions(prev => [newSess, ...prev]);
    setSelectedSessionForDetail(newSess);
  };

  const handleCompleteRitual = (completedRitual: Ritual) => {
    setRituals(prev => prev.map(r => r.id === completedRitual.id ? completedRitual : r));
    setSelectedRitualForExecution(null);
  };

  // Desires Handlers (Phase 6)
  const handleRateDesire = (desireId: string, rating: DesireRating) => {
    setDesires(prev =>
      prev.map(d => {
        if (d.id !== desireId) return d;
        return {
          ...d,
          participantResponses: {
            ...d.participantResponses,
            [CURRENT_USER.id]: {
              userId: CURRENT_USER.id,
              rating,
              updatedAt: new Date().toISOString(),
            },
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleCreateDesire = (newDesire: Desire) => {
    setDesires(prev => [newDesire, ...prev]);
  };

  // Requests Handlers (Phase 6)
  const handleRespondRequest = (
    requestId: string,
    action: 'accept' | 'decline' | 'discuss' | 'not_now',
    note?: string
  ) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        const now = new Date().toISOString();
        let newStatus = r.status;
        let actionType: 'accepted' | 'declined' | 'discuss_requested' | 'not_now' = 'accepted';

        if (action === 'accept') {
          newStatus = 'accepted';
          actionType = 'accepted';
        } else if (action === 'decline') {
          newStatus = 'declined';
          actionType = 'declined';
        } else if (action === 'discuss') {
          newStatus = 'discussing';
          actionType = 'discuss_requested';
        } else if (action === 'not_now') {
          newStatus = 'not_now';
          actionType = 'not_now';
        }

        return {
          ...r,
          status: newStatus,
          responseNote: note || r.responseNote,
          history: [
            ...r.history,
            {
              id: `h_${Date.now()}`,
              timestamp: now,
              actorId: CURRENT_USER.id,
              action: actionType,
              note,
            },
          ],
          updatedAt: now,
        };
      })
    );
  };

  const handleCounterProposeRequest = (
    requestId: string,
    modifiedTitle: string,
    modifiedConditions: string,
    modifiedDurationMinutes: number | undefined,
    note: string
  ) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        const now = new Date().toISOString();
        return {
          ...r,
          status: 'counter_proposed',
          counterProposal: {
            proposedById: CURRENT_USER.id,
            proposedAt: now,
            modifiedTitle,
            modifiedConditions,
            modifiedDurationMinutes,
            note,
          },
          history: [
            ...r.history,
            {
              id: `h_${Date.now()}`,
              timestamp: now,
              actorId: CURRENT_USER.id,
              action: 'counter_proposed',
              note: `Counter-proposed: ${note}`,
            },
          ],
          updatedAt: now,
        };
      })
    );
  };

  const handleCreateRequest = (newReq: HavenRequest) => {
    setRequests(prev => [newReq, ...prev]);
  };

  // Tasks Handlers (Phase 6)
  const handleToggleCompleteTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const isDone = t.status === 'completed' || t.status === 'verified';
        return {
          ...t,
          status: isDone ? 'pending' : 'completed',
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleSubmitProofTask = (taskId: string, proof: TaskProof) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'submitted',
          proof,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleVerifyProofTask = (taskId: string, verificationNote?: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'verified',
          proof: t.proof
            ? {
                ...t.proof,
                verifiedAt: new Date().toISOString(),
                verifiedById: CURRENT_USER.id,
                verificationNote,
              }
            : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleCreateTask = (newTask: HavenTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

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
                <span>Agreements &amp; Protocols ({dynamicAgreements.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('requests')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'requests'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Requests &amp; Permissions ({dynamicRequests.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('tasks')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'tasks'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Tasks &amp; Devotions ({dynamicTasks.length})</span>
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
                <span>Sessions &amp; Practice ({dynamicSessions.length})</span>
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
                <span>Dynamic Rituals ({dynamicRituals.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('desires')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'desires'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Desires ({dynamicDesires.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('permissions')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeSubTab === 'permissions'
                    ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50'
                    : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#150a1e]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Sparks &amp; Prompts</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab Contents */}
          {activeSubTab === 'overview' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#d4af37]" />
                    Agreed Protocols &amp; Boundaries ({dynamicAgreements.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">Mutual boundaries negotiated with affirmative consent.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateAgreementOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#e6c250] transition-colors flex items-center gap-1.5 shadow-md shadow-[#d4af37]/10 self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Propose Agreement</span>
                </button>
              </div>

              {dynamicAgreements.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                  <p className="text-xs text-[#8d7596]">No formal agreements registered yet for this dynamic.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateAgreementOpen(true)}
                    className="text-xs text-[#d4af37] font-semibold hover:underline"
                  >
                    Propose an agreement for {selectedDynamic.name}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dynamicAgreements.map(agr => (
                    <AgreementCard
                      key={agr.id}
                      agreement={agr}
                      dynamic={selectedDynamic}
                      users={ALL_USERS}
                      currentUserId="usr_alex"
                      onClick={() => setSelectedAgreementForDetail(agr)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'requests' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#d94f6f]" />
                    Requests &amp; Permissions ({dynamicRequests.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">
                    Chastity unlock inquiries, protocol waivers, scene proposals, and boundary checks.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateRequestOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#d94f6f] text-white hover:bg-[#b83856] transition-colors flex items-center gap-1.5 shadow-md shadow-[#d94f6f]/10 self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Request</span>
                </button>
              </div>

              {dynamicRequests.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                  <p className="text-xs text-[#8d7596]">No requests currently active for this dynamic.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateRequestOpen(true)}
                    className="text-xs text-[#d94f6f] font-semibold hover:underline"
                  >
                    Submit a request or proposal for {selectedDynamic.name}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dynamicRequests.map(req => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      currentUser={CURRENT_USER}
                      allUsers={ALL_USERS}
                      onRespond={handleRespondRequest}
                      onCounterPropose={handleCounterProposeRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'tasks' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-[#d94f6f]" />
                    Tasks &amp; Devotions ({dynamicTasks.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">
                    Service protocols, daily devotions, hygiene checks, and reflective practice tasks.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#d94f6f] text-white hover:bg-[#b83856] transition-colors flex items-center gap-1.5 shadow-md shadow-[#d94f6f]/10 self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Task</span>
                </button>
              </div>

              {dynamicTasks.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                  <p className="text-xs text-[#8d7596]">No tasks or devotions currently assigned for this dynamic.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="text-xs text-[#d94f6f] font-semibold hover:underline"
                  >
                    Assign a devotion or task for {selectedDynamic.name}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dynamicTasks.map(t => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      currentUser={CURRENT_USER}
                      allUsers={ALL_USERS}
                      onToggleComplete={handleToggleCompleteTask}
                      onSubmitProof={handleSubmitProofTask}
                      onVerifyProof={handleVerifyProofTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'sessions' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#d94f6f]" />
                    Practice &amp; Play Sessions ({dynamicSessions.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">
                    Live and planned practice instances governed by your dynamic agreements.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowVaultTimer(!showVaultTimer)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors"
                  >
                    {showVaultTimer ? 'Show Session Cards' : 'Timer & Vault Utility'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateSessionOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#d94f6f] text-white hover:bg-[#b83856] transition-colors flex items-center gap-1.5 shadow-md shadow-[#d94f6f]/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Session</span>
                  </button>
                </div>
              </div>

              {showVaultTimer ? (
                <div className="rounded-xl bg-[#130b1a] border border-[#251433] p-4">
                  <VaultTab onOpenEmergency={onOpenEmergency} />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(['all', 'active', 'planned', 'completed'] as const).map(flt => (
                      <button
                        key={flt}
                        type="button"
                        onClick={() => setSessionFilter(flt)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                          sessionFilter === flt
                            ? 'bg-[#d94f6f] text-white font-semibold'
                            : 'bg-[#130b1a] text-[#b59ebf] hover:text-[#fae8d7] border border-[#251433]'
                        }`}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>

                  {filteredDynamicSessions.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                      <p className="text-xs text-[#8d7596]">No sessions found matching this filter.</p>
                      <button
                        type="button"
                        onClick={() => setIsCreateSessionOpen(true)}
                        className="text-xs text-[#d94f6f] font-semibold hover:underline"
                      >
                        Start or schedule a session for {selectedDynamic.name}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredDynamicSessions.map(sess => (
                        <SessionCard
                          key={sess.id}
                          session={sess}
                          dynamic={selectedDynamic}
                          agreement={agreements.find(a => sess.agreementIds?.includes(a.id))}
                          users={ALL_USERS}
                          currentUserId={CURRENT_USER.id}
                          onClick={() => setSelectedSessionForDetail(sess)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'rituals' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#d94f6f]" />
                    Dynamic Rituals &amp; Recurring Practices ({dynamicRituals.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">
                    Interactive step-by-step protocols designed to reinforce trust, service, and connection.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setShowRitualTemplates(!showRitualTemplates)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors"
                  >
                    {showRitualTemplates ? 'Show Active Rituals' : 'Ritual Catalog & Templates'}
                  </button>
                </div>
              </div>

              {showRitualTemplates ? (
                <div className="rounded-xl bg-[#130b1a] border border-[#251433] p-4">
                  <RitualsTab />
                </div>
              ) : (
                <div className="space-y-4">
                  {dynamicRituals.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                      <p className="text-xs text-[#8d7596]">No dynamic rituals active for this practice yet.</p>
                      <button
                        type="button"
                        onClick={() => setShowRitualTemplates(true)}
                        className="text-xs text-[#d94f6f] font-semibold hover:underline"
                      >
                        Explore Ritual Templates
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dynamicRituals.map(rit => (
                        <RitualCard
                          key={rit.id}
                          ritual={rit}
                          dynamic={selectedDynamic}
                          onRunRitual={r => setSelectedRitualForExecution(r)}
                          onClick={() => setSelectedRitualForExecution(rit)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'desires' && (
            <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#d94f6f]" />
                    Desires &amp; Curiosities ({dynamicDesires.length})
                  </h3>
                  <p className="text-xs text-[#b59ebf]">
                    Explore fantasies and boundary interests connected to this dynamic with double-blind privacy.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateDesireOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5 self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d94f6f]" />
                  <span>Add Desire</span>
                </button>
              </div>

              {dynamicDesires.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                  <p className="text-xs text-[#8d7596]">No desires linked to this dynamic yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateDesireOpen(true)}
                    className="text-xs text-[#d94f6f] font-semibold hover:underline"
                  >
                    Add a desire related to {selectedDynamic.name}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dynamicDesires.map(d => (
                    <DesireCard
                      key={d.id}
                      desire={d}
                      currentUser={CURRENT_USER}
                      allUsers={ALL_USERS}
                      onRateDesire={handleRateDesire}
                      onProposeRequest={() => {
                        setActiveSubTab('requests');
                        setIsCreateRequestOpen(true);
                      }}
                      onDraftAgreement={() => {
                        setActiveSubTab('overview');
                        setIsCreateAgreementOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'permissions' && (
            <div className="rounded-2xl bg-[#1c1026] border border-[#251433] p-4 sm:p-6">
              <CouplesDynamicsTab />
            </div>
          )}
        </div>
      )}

      {/* Agreement Detail Modal */}
      {selectedAgreementForDetail && (
        <AgreementDetailModal
          agreement={selectedAgreementForDetail}
          isOpen={!!selectedAgreementForDetail}
          onClose={() => setSelectedAgreementForDetail(null)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={dynamics}
          users={ALL_USERS}
          currentUserId="usr_alex"
          onUpdateAgreement={handleUpdateAgreement}
          onNavigateToDynamic={(dynId) => setSelectedDynamicId(dynId)}
        />
      )}

      {/* Agreement Creation Modal */}
      {isCreateAgreementOpen && (
        <AgreementCreationModal
          isOpen={isCreateAgreementOpen}
          onClose={() => setIsCreateAgreementOpen(false)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={dynamics}
          users={ALL_USERS}
          currentUserId="usr_alex"
          initialRelationshipId={selectedDynamic?.relationshipId}
          initialDynamicId={selectedDynamic?.id}
          onCreateAgreement={handleCreateAgreement}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSessionForDetail && (
        <SessionDetailModal
          session={selectedSessionForDetail}
          isOpen={!!selectedSessionForDetail}
          onClose={() => setSelectedSessionForDetail(null)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={dynamics}
          agreements={agreements}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
          onUpdateSession={handleUpdateSession}
          onOpenAgreement={agr => setSelectedAgreementForDetail(agr)}
          onOpenEmergency={onOpenEmergency}
        />
      )}

      {/* Session Creation Modal */}
      {isCreateSessionOpen && (
        <SessionCreationModal
          isOpen={isCreateSessionOpen}
          onClose={() => setIsCreateSessionOpen(false)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={dynamics}
          agreements={agreements}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
          initialRelationshipId={selectedDynamic?.relationshipId}
          initialDynamicId={selectedDynamic?.id}
          onCreateSession={handleCreateSession}
        />
      )}

      {/* Ritual Execution Modal */}
      {selectedRitualForExecution && (
        <RitualExecutionModal
          ritual={selectedRitualForExecution}
          isOpen={!!selectedRitualForExecution}
          onClose={() => setSelectedRitualForExecution(null)}
          currentUserId={CURRENT_USER.id}
          onCompleteRitual={handleCompleteRitual}
        />
      )}

      {/* Desire Creation Modal */}
      {isCreateDesireOpen && (
        <DesireCreationModal
          isOpen={isCreateDesireOpen}
          onClose={() => setIsCreateDesireOpen(false)}
          currentUser={CURRENT_USER}
          relationships={INITIAL_RELATIONSHIPS}
          onCreateDesire={handleCreateDesire}
        />
      )}

      {/* Request Creation Modal */}
      {isCreateRequestOpen && (
        <RequestCreationModal
          isOpen={isCreateRequestOpen}
          onClose={() => setIsCreateRequestOpen(false)}
          currentUser={CURRENT_USER}
          allUsers={ALL_USERS}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={dynamics}
          initialDynamicId={selectedDynamic?.id}
          onCreateRequest={handleCreateRequest}
        />
      )}

      {/* Task Creation Modal */}
      {isCreateTaskOpen && (
        <TaskCreationModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          currentUser={CURRENT_USER}
          allUsers={ALL_USERS}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={dynamics}
          initialDynamicId={selectedDynamic?.id}
          onCreateTask={handleCreateTask}
        />
      )}
    </div>
  );
};
