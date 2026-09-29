'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  Pencil,
  Pause,
  Play,
  Archive,
  RotateCcw,
  UserPlus,
  Trash2,
  ShieldCheck,
  Check,
  Flame,
  MessageSquare,
  Key,
  ListChecks
} from 'lucide-react';
import {
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  INITIAL_AGREEMENTS,
  INITIAL_CHECKINS,
  INITIAL_SESSIONS,
  INITIAL_RITUALS,
  INITIAL_DESIRES,
  INITIAL_HAVEN_REQUESTS,
  INITIAL_TASKS,
  CURRENT_USER,
  ALL_USERS
} from '../../data/domainDemoData';
import {
  Relationship,
  RelationshipStatus,
  CoreRelationshipStructure,
  CoreConnectionContext,
  RelationshipParticipant,
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
  formatRelationshipStructure,
  formatConnectionContext,
  formatConnectionContextsList,
  formatDynamicType,
  formatPracticeStage
} from '../../types/legacyAdapters';

interface RelationshipsTabProps {
  onNavigateDynamic?: (dynamicId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ActivityEvent {
  id: string;
  type: 'checkin' | 'session' | 'ritual' | 'agreement';
  title: string;
  description: string;
  timestamp: string;
}

export const RelationshipsTab: React.FC<RelationshipsTabProps> = ({
  onNavigateDynamic,
  onNavigateTab
}) => {
  const [relationships, setRelationships] = useState<Relationship[]>(INITIAL_RELATIONSHIPS);
  const [selectedRelId, setSelectedRelId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [filterStatus, setFilterStatus] = useState<RelationshipStatus | 'all'>('active');

  // Creation Wizard State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [createStep, setCreateStep] = useState<number>(1);
  const [newRelName, setNewRelName] = useState('');
  const [newRelStructure, setNewRelStructure] = useState<CoreRelationshipStructure>('monogamous');
  const [newRelContexts, setNewRelContexts] = useState<CoreConnectionContext[]>(['cohabitating']);
  const [newUserRole, setNewUserRole] = useState('');
  const [additionalParticipants, setAdditionalParticipants] = useState<Array<{ displayName: string; roleDescription?: string }>>([
    { displayName: '', roleDescription: '' }
  ]);
  const [newRelDescription, setNewRelDescription] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStructure, setEditStructure] = useState<CoreRelationshipStructure>('monogamous');
  const [editContexts, setEditContexts] = useState<CoreConnectionContext[]>([]);
  const [editDescription, setEditDescription] = useState('');
  const [editPrivacy, setEditPrivacy] = useState<'participants_only' | 'private'>('participants_only');

  // Add Participant Modal State
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantRole, setNewParticipantRole] = useState('');

  // Agreements State (Phase 4)
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [selectedAgreementForDetail, setSelectedAgreementForDetail] = useState<Agreement | null>(null);
  const [isCreateAgreementOpen, setIsCreateAgreementOpen] = useState(false);
  const [agreementFilter, setAgreementFilter] = useState<'all' | 'active' | 'negotiating' | 'paused_retired'>('all');

  // Sessions State (Phase 5)
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<Session | null>(null);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);

  // Rituals State (Phase 5)
  const [rituals, setRituals] = useState<Ritual[]>(INITIAL_RITUALS);
  const [selectedRitualForExecution, setSelectedRitualForExecution] = useState<Ritual | null>(null);

  // Desires State (Phase 6)
  const [desires, setDesires] = useState<Desire[]>(INITIAL_DESIRES);
  const [isCreateDesireOpen, setIsCreateDesireOpen] = useState(false);

  // Requests State (Phase 6)
  const [requests, setRequests] = useState<HavenRequest[]>(INITIAL_HAVEN_REQUESTS);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);

  // Tasks State (Phase 6)
  const [tasks, setTasks] = useState<HavenTask[]>(INITIAL_TASKS);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const selectedRelationship = relationships.find(r => r.id === selectedRelId) || relationships[0];

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

  // Derive counts & activity strictly from domain data
  const getRelationshipDynamics = (relId: string) =>
    INITIAL_DYNAMICS.filter(d => d.relationshipId === relId);

  const getRelationshipAgreements = (relId: string) =>
    agreements.filter(a => a.relationshipId === relId);

  const getRelationshipSessions = (relId: string) =>
    sessions.filter(s => s.relationshipId === relId);

  const getRelationshipRituals = (relId: string) =>
    rituals.filter(r => r.relationshipId === relId);

  const getRelationshipActivity = (relId: string): ActivityEvent[] => {
    const events: ActivityEvent[] = [];

    // Check-ins
    INITIAL_CHECKINS.filter(c => c.relationshipId === relId).forEach(c => {
      events.push({
        id: c.id,
        type: 'checkin',
        title: 'Consensual Check-in',
        description: c.detailNote ? `"${c.detailNote}"` : c.prompt,
        timestamp: c.createdAt
      });
    });

    // Sessions
    sessions.filter(s => s.relationshipId === relId).forEach(s => {
      events.push({
        id: s.id,
        type: 'session',
        title: s.title || 'Practice Session',
        description: s.goal || 'Structured practice recorded',
        timestamp: s.startedAt || s.createdAt
      });
    });

    // Rituals
    rituals.filter(r => r.relationshipId === relId).forEach(r => {
      events.push({
        id: r.id,
        type: 'ritual',
        title: r.name,
        description: `${r.recurrence} • ${r.completions.length > 0 ? 'Recently completed' : 'Scheduled'}`,
        timestamp: r.updatedAt
      });
    });

    // Agreements
    agreements.filter(a => a.relationshipId === relId).forEach(a => {
      events.push({
        id: a.id,
        type: 'agreement',
        title: 'Shared Agreement',
        description: `${a.title} • ${a.status === 'agreed' ? 'Agreed' : 'Pending Review'}`,
        timestamp: a.updatedAt
      });
    });

    // Sort descending by timestamp
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const formatParticipantsSummary = (participants: RelationshipParticipant[]): string => {
    if (!participants || participants.length === 0) return 'No participants';
    const names = participants.map(p => (p.userId === CURRENT_USER.id ? 'You' : p.displayName));
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]}, ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  };

  const formatTimeSnippet = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Status Handlers
  const handleTogglePause = (relId: string) => {
    setRelationships(prev =>
      prev.map(r => {
        if (r.id === relId) {
          const newStatus: RelationshipStatus = r.status === 'active' ? 'paused' : 'active';
          return { ...r, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );
  };

  const handleToggleArchive = (relId: string) => {
    setRelationships(prev =>
      prev.map(r => {
        if (r.id === relId) {
          const newStatus: RelationshipStatus = r.status === 'archived' ? 'active' : 'archived';
          return { ...r, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );
  };

  // Edit Handlers
  const handleOpenEditModal = (rel: Relationship) => {
    setEditName(rel.name);
    setEditStructure((rel.structure as CoreRelationshipStructure) || 'monogamous');
    setEditContexts(rel.connectionContexts as CoreConnectionContext[]);
    setEditDescription(rel.description || '');
    setEditPrivacy(rel.privacy || 'participants_only');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setRelationships(prev =>
      prev.map(r => {
        if (r.id === selectedRelationship.id) {
          return {
            ...r,
            name: editName.trim(),
            structure: editStructure,
            connectionContexts: editContexts.length > 0 ? editContexts : ['custom'],
            description: editDescription.trim(),
            privacy: editPrivacy,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    setIsEditModalOpen(false);
  };

  // Add Participant Handlers
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim()) return;

    const newMember: RelationshipParticipant = {
      userId: `usr_${Date.now()}`,
      displayName: newParticipantName.trim(),
      joinedAt: new Date().toISOString(),
      ...(newParticipantRole.trim() ? { roleDescription: newParticipantRole.trim() } : {})
    };

    setRelationships(prev =>
      prev.map(r => {
        if (r.id === selectedRelationship.id) {
          return {
            ...r,
            participants: [...r.participants, newMember],
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );

    setNewParticipantName('');
    setNewParticipantRole('');
    setIsAddParticipantOpen(false);
  };

  // Creation Wizard Handlers
  const handleStartCreate = () => {
    setCreateStep(1);
    setNewRelName('');
    setNewRelStructure('monogamous');
    setNewRelContexts(['cohabitating']);
    setNewUserRole('');
    setAdditionalParticipants([{ displayName: '', roleDescription: '' }]);
    setNewRelDescription('');
    setIsCreatingNew(true);
  };

  const handleFinishCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelName.trim()) return;

    const participants: RelationshipParticipant[] = [
      {
        userId: CURRENT_USER.id,
        displayName: CURRENT_USER.displayName,
        joinedAt: new Date().toISOString(),
        ...(newUserRole.trim() ? { roleDescription: newUserRole.trim() } : {})
      }
    ];

    additionalParticipants.forEach((p, idx) => {
      if (p.displayName.trim()) {
        participants.push({
          userId: `usr_${Date.now()}_${idx}`,
          displayName: p.displayName.trim(),
          joinedAt: new Date().toISOString(),
          ...(p.roleDescription?.trim() ? { roleDescription: p.roleDescription.trim() } : {})
        });
      }
    });

    const newRel: Relationship = {
      id: `rel_${Date.now()}`,
      name: newRelName.trim(),
      structure: newRelStructure,
      connectionContexts: newRelContexts.length > 0 ? newRelContexts : ['custom'],
      status: 'active',
      privacy: 'participants_only',
      description: newRelDescription.trim() || 'Consensual connection defined in Haven.',
      participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRelationships(prev => [newRel, ...prev]);
    setSelectedRelId(newRel.id);
    setViewMode('detail');
    setIsCreatingNew(false);
  };

  const toggleContextSelection = (
    context: CoreConnectionContext,
    currentList: CoreConnectionContext[],
    setList: React.Dispatch<React.SetStateAction<CoreConnectionContext[]>>
  ) => {
    if (currentList.includes(context)) {
      setList(currentList.filter(c => c !== context));
    } else {
      setList([...currentList, context]);
    }
  };

  // Filtered List
  const filteredRelationships = relationships.filter(r =>
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  const activeCount = relationships.filter(r => r.status === 'active').length;
  const pausedCount = relationships.filter(r => r.status === 'paused').length;
  const archivedCount = relationships.filter(r => r.status === 'archived').length;

  // Selected relationship derived projections
  const currentRelDynamics = selectedRelationship ? getRelationshipDynamics(selectedRelationship.id) : [];
  const currentRelAgreements = selectedRelationship ? getRelationshipAgreements(selectedRelationship.id) : [];
  const currentRelSessions = selectedRelationship ? getRelationshipSessions(selectedRelationship.id) : [];
  const currentRelRituals = selectedRelationship ? getRelationshipRituals(selectedRelationship.id) : [];
  const currentRelActivity = selectedRelationship ? getRelationshipActivity(selectedRelationship.id) : [];
  const activeAgreementsCount = currentRelAgreements.filter(a => a.status === 'active' || a.status === 'agreed').length;
  const pendingAgreementsCount = currentRelAgreements.filter(a => a.status === 'negotiating' || a.status === 'pending' || a.status === 'pending_approval' || a.status === 'draft').length;
  const pausedRetiredCount = currentRelAgreements.filter(a => a.status === 'paused' || a.status === 'retired' || a.status === 'declined' || a.status === 'revoked').length;

  const isPositiveDesire = (r?: DesireRating) => r === 'eager' || r === 'curious' || r === 'exploring';
  const currentRelDesires = selectedRelationship ? desires.filter(d => d.relationshipId === selectedRelationship.id && d.sharingMode !== 'private') : [];
  const currentRelMutualDesires = currentRelDesires.filter(d => {
    const myRating = d.participantResponses[CURRENT_USER.id]?.rating;
    if (!isPositiveDesire(myRating)) return false;
    return Object.values(d.participantResponses).some(resp => resp.userId !== CURRENT_USER.id && isPositiveDesire(resp.rating));
  });
  const currentRelRequests = selectedRelationship ? requests.filter(r => r.relationshipId === selectedRelationship.id) : [];
  const pendingRelRequests = currentRelRequests.filter(r => r.status === 'pending' || r.status === 'counter_proposed');
  const currentRelTasks = selectedRelationship ? tasks.filter(t => t.relationshipId === selectedRelationship.id) : [];
  const pendingRelTasks = currentRelTasks.filter(t => t.status === 'pending' || t.status === 'submitted');

  const filteredRelAgreements = currentRelAgreements.filter(agr => {
    if (agreementFilter === 'active') return agr.status === 'active' || agr.status === 'agreed';
    if (agreementFilter === 'negotiating') return agr.status === 'negotiating' || agr.status === 'pending' || agr.status === 'pending_approval' || agr.status === 'draft';
    if (agreementFilter === 'paused_retired') return agr.status === 'paused' || agr.status === 'retired' || agr.status === 'declined' || agr.status === 'revoked';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1c1026] border border-[#251433]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d94f6f] uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Connection Containers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fae8d7]">Relationships</h1>
          <p className="text-sm text-[#b59ebf] mt-1 max-w-xl">
            Explore relationships, dynamics, boundaries, fantasies, and agreements — together.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-all flex items-center gap-2 shadow-sm self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add relationship</span>
        </button>
      </div>

      {/* Main View Switcher: List View vs Focused Detail View */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Status Tabs Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#251433] pb-4">
            <div className="flex items-center gap-1.5 bg-[#150a1e] p-1 rounded-xl border border-[#251433] text-xs font-semibold">
              {(
                [
                  { id: 'active', label: 'Active', count: activeCount },
                  { id: 'paused', label: 'Paused', count: pausedCount },
                  { id: 'archived', label: 'Archived', count: archivedCount },
                  { id: 'all', label: 'All', count: relationships.length }
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors flex items-center gap-1.5 ${
                    filterStatus === tab.id
                      ? 'bg-[#251433] text-[#fae8d7] shadow-sm font-bold'
                      : 'text-[#8d7596] hover:text-[#fae8d7]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      filterStatus === tab.id
                        ? 'bg-[#d94f6f] text-white'
                        : 'bg-[#1e1028] text-[#8d7596]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-xs text-[#8d7596]">
              Showing {filteredRelationships.length} of {relationships.length} connections
            </span>
          </div>

          {/* Cards Grid */}
          {filteredRelationships.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#1c1026] border border-[#251433] space-y-3">
              <Users className="w-8 h-8 text-[#8d7596] mx-auto opacity-40" />
              <h3 className="text-sm font-bold text-[#fae8d7]">No {filterStatus} relationships found</h3>
              <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
                {filterStatus === 'all'
                  ? 'Get started by creating your first connection container in Haven.'
                  : `You currently have no relationships with ${filterStatus} status.`}
              </p>
              {filterStatus !== 'all' ? (
                <button
                  onClick={() => setFilterStatus('all')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] transition-colors"
                >
                  View all relationships
                </button>
              ) : (
                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-colors"
                >
                  Add relationship
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRelationships.map(rel => {
                const dynamics = getRelationshipDynamics(rel.id);
                const agreements = getRelationshipAgreements(rel.id);
                const activity = getRelationshipActivity(rel.id);
                const latestEvent = activity[0];

                return (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedRelId(rel.id);
                      setViewMode('detail');
                    }}
                    className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] hover:border-[#d94f6f]/50 hover:bg-[#20112c] transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      {/* Card Header: Structure & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#d94f6f]">
                          {formatRelationshipStructure(rel.structure)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            rel.status === 'active'
                              ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                              : rel.status === 'paused'
                              ? 'bg-amber-950/70 text-amber-400 border border-amber-800/40'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-700/40'
                          }`}
                        >
                          {rel.status}
                        </span>
                      </div>

                      {/* Relationship Name */}
                      <h3 className="text-lg font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                        {rel.name}
                      </h3>

                      {/* Connection Contexts */}
                      <p className="text-xs text-[#b59ebf] mt-1">
                        {formatConnectionContextsList(rel.connectionContexts)}
                      </p>

                      {/* Participants list */}
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#fae8d7] font-medium bg-[#140a1b] p-2 rounded-xl border border-[#251433]">
                        <Users className="w-3.5 h-3.5 text-[#d94f6f] shrink-0" />
                        <span className="truncate">{formatParticipantsSummary(rel.participants)}</span>
                      </div>
                    </div>

                    {/* Footer: Metrics and Recent Activity Snippet */}
                    <div className="mt-5 pt-3 border-t border-[#251433] space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#8d7596]">
                        <span>{dynamics.length} Dynamics</span>
                        <span>•</span>
                        <span>{agreements.length} Agreements</span>
                        <span>•</span>
                        <span>{rel.participants.length} Members</span>
                      </div>

                      {/* Derived latest activity snippet */}
                      <div className="flex items-center justify-between text-[11px] text-[#b59ebf]">
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3 h-3 text-[#8d7596] shrink-0" />
                          <span className="truncate">
                            {latestEvent
                              ? `${latestEvent.title} (${formatTimeSnippet(latestEvent.timestamp)})`
                              : 'No recent activity'}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#d94f6f] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Focused Detail View */
        <div className="space-y-6">
          {/* Navigation Bar back to List */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] transition-colors bg-[#1c1026] px-3.5 py-2 rounded-xl border border-[#251433]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to all relationships</span>
            </button>

            <span className="text-xs text-[#8d7596]">
              Last updated {new Date(selectedRelationship.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Relationship Header Card */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] font-semibold">
                    {formatRelationshipStructure(selectedRelationship.structure)}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      selectedRelationship.status === 'active'
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                        : selectedRelationship.status === 'paused'
                        ? 'bg-amber-950/70 text-amber-400 border border-amber-800/40'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-700/40'
                    }`}
                  >
                    {selectedRelationship.status}
                  </span>
                  {selectedRelationship.connectionContexts.map(ctx => (
                    <span
                      key={ctx}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#160b1e] text-[#b59ebf] border border-[#2d163d]"
                    >
                      {formatConnectionContext(ctx)}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-[#fae8d7]">{selectedRelationship.name}</h2>
                <p className="text-sm text-[#b59ebf] max-w-2xl">{selectedRelationship.description}</p>
              </div>

              {/* Header Actions: Edit, Pause/Resume, Archive/Restore */}
              <div className="flex items-center gap-2 flex-wrap self-start">
                <button
                  onClick={() => handleOpenEditModal(selectedRelationship)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#b59ebf]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleTogglePause(selectedRelationship.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
                >
                  {selectedRelationship.status === 'active' ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleToggleArchive(selectedRelationship.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#8d7596] hover:text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
                >
                  {selectedRelationship.status === 'archived' ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Participants */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#d94f6f]" />
                  Participants ({selectedRelationship.participants.length})
                </h3>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  Consensual members participating in this connection container.
                </p>
              </div>

              <button
                onClick={() => setIsAddParticipantOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Add participant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedRelationship.participants.map(part => (
                <div
                  key={part.userId}
                  className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#fae8d7]">{part.displayName}</span>
                      {part.userId === CURRENT_USER.id && (
                        <span className="text-[10px] text-[#d94f6f] font-bold px-1.5 py-0.5 rounded bg-[#251433]">
                          (You)
                        </span>
                      )}
                    </div>
                    {/* Cleanly omitted if no role description exists */}
                    {part.roleDescription ? (
                      <span className="text-xs text-[#d94f6f] block font-medium">
                        {part.roleDescription}
                      </span>
                    ) : null}
                  </div>

                  <span className="text-[10px] text-[#8d7596] mt-3 pt-2 border-t border-[#200f2e] block">
                    Joined{' '}
                    {new Date(part.joinedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Associated Dynamics */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
                  Associated Dynamics ({currentRelDynamics.length})
                </h3>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  Consensual practices and protocols active within this relationship.
                </p>
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('dynamics')}
                  className="text-xs font-semibold text-[#d94f6f] hover:underline flex items-center gap-1"
                >
                  <span>Explore dynamics</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {currentRelDynamics.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                <Sparkles className="w-6 h-6 text-[#8d7596] mx-auto opacity-40" />
                <p className="text-xs font-semibold text-[#fae8d7]">No dynamics yet</p>
                <p className="text-xs text-[#8d7596] max-w-sm mx-auto">
                  Dynamics allow you to structure consensual practices, boundaries, and rituals with partners.
                </p>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('dynamics')}
                    className="mt-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] transition-colors"
                  >
                    Explore dynamics
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentRelDynamics.map(dyn => (
                  <div
                    key={dyn.id}
                    onClick={() => onNavigateDynamic && onNavigateDynamic(dyn.id)}
                    className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] hover:border-[#d94f6f]/50 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d94f6f]">
                          {formatDynamicType(dyn.dynamicType)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {dyn.practiceStage && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#160b1e] border border-[#2d163d] text-[#b59ebf] capitalize font-medium">
                              {formatPracticeStage(dyn.practiceStage)}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#251433] text-[#fae8d7] capitalize font-medium">
                            {dyn.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                        {dyn.name}
                      </h4>
                      <p className="text-xs text-[#b59ebf] line-clamp-2 mt-1">
                        {dyn.description}
                      </p>

                      {/* Descriptive Tags */}
                      {dyn.tags && dyn.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
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

                    <div className="mt-4 pt-2.5 border-t border-[#200f2e] flex items-center justify-between text-xs text-[#8d7596]">
                      <span>{dyn.participantIds.length} Participants • {dyn.activeAgreementsCount} Agreed Boundaries</span>
                      <span className="text-[#fae8d7] font-semibold group-hover:underline flex items-center gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Shared Agreements & Boundaries (Phase 4 First-Class Product Area) */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="text-sm font-bold text-[#fae8d7] uppercase tracking-wider">
                    Agreements &amp; Boundary Compacts ({currentRelAgreements.length})
                  </h3>
                </div>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  {activeAgreementsCount} active • {pendingAgreementsCount} in negotiation • {pausedRetiredCount} paused/archived
                </p>
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

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#251433]">
              {[
                { id: 'all', label: `All (${currentRelAgreements.length})` },
                { id: 'active', label: `Active (${activeAgreementsCount})` },
                { id: 'negotiating', label: `In Negotiation (${pendingAgreementsCount})` },
                { id: 'paused_retired', label: `Paused / Retired (${pausedRetiredCount})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAgreementFilter(tab.id as 'all' | 'active' | 'negotiating' | 'paused_retired')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    agreementFilter === tab.id
                      ? 'bg-[#d4af37] text-black font-semibold'
                      : 'bg-[#130b1a] text-[#b59ebf] hover:text-[#fae8d7] border border-[#251433]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredRelAgreements.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                <p className="text-xs text-[#8d7596]">No agreements found under this filter view.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateAgreementOpen(true)}
                  className="text-xs text-[#d4af37] font-semibold hover:underline"
                >
                  Propose an agreement for {selectedRelationship.name}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRelAgreements.map(agr => (
                  <AgreementCard
                    key={agr.id}
                    agreement={agr}
                    dynamic={INITIAL_DYNAMICS.find(d => d.id === agr.dynamicId)}
                    users={ALL_USERS}
                    currentUserId="usr_alex"
                    onClick={() => setSelectedAgreementForDetail(agr)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section: Shared Desires & Double-Blind Exploration (Phase 6) */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#d94f6f]" />
                  <h3 className="text-sm font-bold text-[#fae8d7] uppercase tracking-wider">
                    Shared Desires &amp; Exploration ({currentRelDesires.length})
                  </h3>
                  {currentRelMutualDesires.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/40 font-bold">
                      {currentRelMutualDesires.length} Mutual Match{currentRelMutualDesires.length > 1 ? 'es' : ''}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  Double-blind discovery reveals ideas only when partners express mutual curiosity. No consent is implied by desire.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsCreateDesireOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d94f6f]" />
                  <span>Add Desire</span>
                </button>
              </div>
            </div>

            {currentRelDesires.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                <p className="text-xs text-[#8d7596]">No shared desires recorded for this relationship yet.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateDesireOpen(true)}
                  className="text-xs text-[#d94f6f] font-semibold hover:underline"
                >
                  Add a desire to explore with {selectedRelationship.name}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRelDesires.map(desire => (
                  <DesireCard
                    key={desire.id}
                    desire={desire}
                    currentUser={CURRENT_USER}
                    allUsers={ALL_USERS}
                    onRateDesire={handleRateDesire}
                    onProposeRequest={() => setIsCreateRequestOpen(true)}
                    onDraftAgreement={() => setIsCreateAgreementOpen(true)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section: Requests & Formal Permissions (Phase 6) */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#d94f6f]" />
                  <h3 className="text-sm font-bold text-[#fae8d7] uppercase tracking-wider">
                    Requests &amp; Formal Permissions ({currentRelRequests.length})
                  </h3>
                  {pendingRelRequests.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-400 border border-amber-800/40 font-bold">
                      {pendingRelRequests.length} Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  Asynchronous proposals, chastity unlock requests, protocol waivers, and scene proposals with counter-offers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateRequestOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Propose Request</span>
              </button>
            </div>

            {currentRelRequests.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                <p className="text-xs text-[#8d7596]">No requests or permission inquiries in this relationship.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateRequestOpen(true)}
                  className="text-xs text-[#d94f6f] font-semibold hover:underline"
                >
                  Send a request to {selectedRelationship.name}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRelRequests.map(req => (
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

          {/* Section: Tasks & Daily Devotions (Phase 6) */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-[#d94f6f]" />
                  <h3 className="text-sm font-bold text-[#fae8d7] uppercase tracking-wider">
                    Tasks &amp; Devotions ({currentRelTasks.length})
                  </h3>
                  {pendingRelTasks.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d94f6f]/20 text-[#d94f6f] border border-[#d94f6f]/30 font-bold">
                      {pendingRelTasks.length} Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  D/s assignments, domestic duties, hygiene protocols, and sensual devotions. No streak penalties or gamification.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateTaskOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Assign Task</span>
              </button>
            </div>

            {currentRelTasks.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                <p className="text-xs text-[#8d7596]">No tasks or devotions currently assigned for this relationship.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="text-xs text-[#d94f6f] font-semibold hover:underline"
                >
                  Assign a devotion or task for {selectedRelationship.name}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRelTasks.map(t => (
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

          {/* Section 4: Scheduled & Practice Sessions */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#d94f6f]" />
                  Practice &amp; Play Sessions ({currentRelSessions.length})
                </h3>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  Consensual practice instances, check-in windows, and scheduled connection time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateSessionOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#d94f6f] text-white hover:bg-[#b83856] transition-colors flex items-center gap-1.5 shadow-md shadow-[#d94f6f]/10 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Session</span>
              </button>
            </div>

            {currentRelSessions.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#130b1a] border border-[#251433] space-y-2">
                <p className="text-xs text-[#8d7596]">No practice sessions recorded for this relationship yet.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateSessionOpen(true)}
                  className="text-xs text-[#d94f6f] font-semibold hover:underline"
                >
                  Schedule or start a session for {selectedRelationship.name}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRelSessions.map(sess => (
                  <SessionCard
                    key={sess.id}
                    session={sess}
                    dynamic={INITIAL_DYNAMICS.find(d => d.id === sess.dynamicId)}
                    agreement={agreements.find(a => sess.agreementIds?.includes(a.id))}
                    users={ALL_USERS}
                    currentUserId={CURRENT_USER.id}
                    onClick={() => setSelectedSessionForDetail(sess)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Dynamic Rituals & Practices */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#d94f6f]" />
                  Dynamic Rituals &amp; Recurring Practices ({currentRelRituals.length})
                </h3>
                <p className="text-xs text-[#b59ebf] mt-0.5">
                  Interactive protocols designed to cultivate intimacy and maintain intentionality.
                </p>
              </div>
            </div>

            {currentRelRituals.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#8d7596]">
                No recurring rituals currently anchored to this relationship.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRelRituals.map(rit => (
                  <RitualCard
                    key={rit.id}
                    ritual={rit}
                    dynamic={INITIAL_DYNAMICS.find(d => d.id === rit.dynamicId)}
                    onRunRitual={r => setSelectedRitualForExecution(r)}
                    onClick={() => setSelectedRitualForExecution(rit)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Recent Activity Feed */}
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#d94f6f]" />
                Recent Activity
              </h3>
              <p className="text-xs text-[#b59ebf] mt-0.5">
                Projected timeline derived from check-ins, sessions, rituals, and agreements.
              </p>
            </div>

            {currentRelActivity.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#8d7596]">
                No recent activity recorded for this relationship yet.
              </div>
            ) : (
              <div className="space-y-3">
                {currentRelActivity.map(event => (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-xl bg-[#130b1a] border border-[#251433] flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#251433] text-[#d94f6f] shrink-0 mt-0.5">
                      {event.type === 'checkin' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {event.type === 'session' && <Clock className="w-3.5 h-3.5" />}
                      {event.type === 'ritual' && <Heart className="w-3.5 h-3.5" />}
                      {event.type === 'agreement' && <Shield className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#fae8d7]">{event.title}</span>
                        <span className="text-[10px] text-[#8d7596]">
                          {formatTimeSnippet(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-[#b59ebf] mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Guard Notice */}
          <div className="p-4 rounded-xl bg-[#100717] border border-[#251433] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#8d7596] leading-relaxed">
              <strong className="text-[#b59ebf]">Privacy Guard:</strong> Relationship metadata and participant settings are preserved in privacy-aware local storage. Sensitive dynamic logs, health alerts, and personal reflections remain isolated and are never shared without explicit consent.
            </div>
          </div>
        </div>
      )}

      {/* 5-Step Creation Wizard Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#170c20] border border-[#d94f6f]/40 p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2d163d] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#d94f6f] uppercase tracking-wider">
                  Step {createStep} of 5
                </span>
                <h3 className="text-base font-bold text-[#fae8d7] flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#d94f6f]" />
                  Establish New Relationship
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-[#b59ebf] hover:text-[#fae8d7]"
              >
                Cancel
              </button>
            </div>

            {/* Step 1: Relationship Name */}
            {createStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#fae8d7] block mb-1">
                    What should you call this relationship?
                  </label>
                  <p className="text-[11px] text-[#b59ebf] mb-3">
                    A clear, recognizable name for this connection container (e.g., &ldquo;Alex &amp; Jordan&rdquo; or &ldquo;The Triad&rdquo;).
                  </p>
                  <input
                    type="text"
                    value={newRelName}
                    onChange={e => setNewRelName(e.target.value)}
                    placeholder="e.g. Alex & Jordan"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Relationship Structure */}
            {createStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#fae8d7] block mb-1">
                    Relationship Structure
                  </label>
                  <p className="text-[11px] text-[#b59ebf] mb-3">
                    Select the foundational architecture of this connection.
                  </p>
                  <div className="space-y-2">
                    {(
                      [
                        { id: 'monogamous', label: 'Monogamous', desc: 'Exclusive relational commitment between two participants.' },
                        { id: 'polyamorous', label: 'Polyamorous', desc: 'Consensual non-monogamy supporting multiple loving connections.' },
                        { id: 'open', label: 'Open', desc: 'Committed relationship with openness for external experiences.' },
                        { id: 'solo_exploration', label: 'Solo Exploration', desc: 'Self-focused dynamic for personal reflection, limits, and growth.' },
                        { id: 'custom', label: 'Custom', desc: 'Self-defined relationship framework.' }
                      ] as const
                    ).map(item => (
                      <div
                        key={item.id}
                        onClick={() => setNewRelStructure(item.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          newRelStructure === item.id
                            ? 'bg-[#251433] border-[#d94f6f] text-[#fae8d7]'
                            : 'bg-[#100717] border-[#251433] text-[#b59ebf] hover:border-[#381e47]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#fae8d7]">{item.label}</span>
                          {newRelStructure === item.id && <Check className="w-3.5 h-3.5 text-[#d94f6f]" />}
                        </div>
                        <p className="text-[11px] text-[#8d7596] mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Connection Context (Multi-select) */}
            {createStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#fae8d7] block mb-1">
                    Connection Context (Select all that apply)
                  </label>
                  <p className="text-[11px] text-[#b59ebf] mb-3">
                    The living circumstances or cadence of this relationship.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: 'cohabitating', label: 'Cohabitating' },
                        { id: 'nesting', label: 'Nesting' },
                        { id: 'long_distance', label: 'Long-distance' },
                        { id: 'dating', label: 'Dating' },
                        { id: 'occasional', label: 'Occasional' },
                        { id: 'custom', label: 'Custom' }
                      ] as const
                    ).map(ctx => {
                      const isSelected = newRelContexts.includes(ctx.id);
                      return (
                        <div
                          key={ctx.id}
                          onClick={() => toggleContextSelection(ctx.id, newRelContexts, setNewRelContexts)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#251433] border-[#d94f6f] text-[#fae8d7]'
                              : 'bg-[#100717] border-[#251433] text-[#b59ebf] hover:border-[#381e47]'
                          }`}
                        >
                          <span className="text-xs font-semibold">{ctx.label}</span>
                          {isSelected && <Check className="w-3 h-3 text-[#d94f6f]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Participants */}
            {createStep === 4 && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-semibold text-[#fae8d7] block mb-1">
                    Participants
                  </label>
                  <p className="text-[11px] text-[#b59ebf] mb-3">
                    Add the people in this relationship. Contextual roles are optional.
                  </p>

                  {/* Current User Card */}
                  <div className="p-3 rounded-xl bg-[#100717] border border-[#251433] mb-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#fae8d7] mb-1.5">
                      <span>{CURRENT_USER.displayName} (You)</span>
                      <span className="text-[10px] text-[#d94f6f] font-semibold">Initiator</span>
                    </div>
                    <input
                      type="text"
                      value={newUserRole}
                      onChange={e => setNewUserRole(e.target.value)}
                      placeholder="Optional contextual role (e.g. Anchor, Partner)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#160b1e] border border-[#2d163d] text-[11px] text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                    />
                  </div>

                  {/* Additional Participants */}
                  <div className="space-y-2.5">
                    {additionalParticipants.map((part, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#100717] border border-[#251433] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#fae8d7]">Member {idx + 2}</span>
                          {additionalParticipants.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setAdditionalParticipants(
                                  additionalParticipants.filter((_, i) => i !== idx)
                                )
                              }
                              className="text-xs text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={part.displayName}
                          onChange={e => {
                            const updated = [...additionalParticipants];
                            updated[idx].displayName = e.target.value;
                            setAdditionalParticipants(updated);
                          }}
                          placeholder="Display Name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#160b1e] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                        />
                        <input
                          type="text"
                          value={part.roleDescription || ''}
                          onChange={e => {
                            const updated = [...additionalParticipants];
                            updated[idx].roleDescription = e.target.value;
                            setAdditionalParticipants(updated);
                          }}
                          placeholder="Optional contextual role description"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#160b1e] border border-[#2d163d] text-[11px] text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setAdditionalParticipants([
                        ...additionalParticipants,
                        { displayName: '', roleDescription: '' }
                      ])
                    }
                    className="mt-3 text-xs font-semibold text-[#d94f6f] hover:underline flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add another participant</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Description & Intentions */}
            {createStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#fae8d7] block mb-1">
                    Description &amp; Shared Intentions (Optional)
                  </label>
                  <p className="text-[11px] text-[#b59ebf] mb-3">
                    Provide context or notes about this relationship.
                  </p>
                  <textarea
                    rows={4}
                    value={newRelDescription}
                    onChange={e => setNewRelDescription(e.target.value)}
                    placeholder="e.g. Dedicated connection focused on mutual emotional support, intentional communication, and shared practices."
                    className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2d163d]">
              {createStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCreateStep(createStep - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {createStep < 5 ? (
                <button
                  type="button"
                  disabled={createStep === 1 && !newRelName.trim()}
                  onClick={() => setCreateStep(createStep + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishCreate}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-colors"
                >
                  Create Relationship
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Relationship Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-2xl bg-[#170c20] border border-[#251433] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#2d163d] pb-3">
              <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#d94f6f]" />
                Edit Relationship
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs text-[#b59ebf] hover:text-[#fae8d7]"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Relationship Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Relationship Structure
                </label>
                <select
                  value={editStructure}
                  onChange={e => setEditStructure(e.target.value as CoreRelationshipStructure)}
                  className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                >
                  <option value="monogamous">Monogamous</option>
                  <option value="polyamorous">Polyamorous</option>
                  <option value="open">Open</option>
                  <option value="solo_exploration">Solo Exploration</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Connection Contexts
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'cohabitating', label: 'Cohabitating' },
                      { id: 'nesting', label: 'Nesting' },
                      { id: 'long_distance', label: 'Long-distance' },
                      { id: 'dating', label: 'Dating' },
                      { id: 'occasional', label: 'Occasional' },
                      { id: 'custom', label: 'Custom' }
                    ] as const
                  ).map(ctx => {
                    const isSelected = editContexts.includes(ctx.id);
                    return (
                      <div
                        key={ctx.id}
                        onClick={() => toggleContextSelection(ctx.id, editContexts, setEditContexts)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#251433] border-[#d94f6f] text-[#fae8d7]'
                            : 'bg-[#100717] border-[#251433] text-[#8d7596]'
                        }`}
                      >
                        <span>{ctx.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#d94f6f]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f] resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Privacy Level
                </label>
                <select
                  value={editPrivacy}
                  onChange={e => setEditPrivacy(e.target.value as 'participants_only' | 'private')}
                  className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                >
                  <option value="participants_only">Participants Only</option>
                  <option value="private">Private (Only You)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#2d163d]">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Participant Modal */}
      {isAddParticipantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleAddParticipant}
            className="w-full max-w-sm rounded-2xl bg-[#170c20] border border-[#251433] p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#2d163d] pb-2.5">
              <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#d94f6f]" />
                Add Participant
              </h3>
              <button
                type="button"
                onClick={() => setIsAddParticipantOpen(false)}
                className="text-xs text-[#b59ebf] hover:text-[#fae8d7]"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Participant Display Name
                </label>
                <input
                  type="text"
                  value={newParticipantName}
                  onChange={e => setNewParticipantName(e.target.value)}
                  placeholder="e.g. Jordan"
                  required
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                  Contextual Role (Optional)
                </label>
                <input
                  type="text"
                  value={newParticipantRole}
                  onChange={e => setNewParticipantRole(e.target.value)}
                  placeholder="e.g. Partner, Nesting Partner"
                  className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#2d163d]">
              <button
                type="button"
                onClick={() => setIsAddParticipantOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agreement Detail Modal */}
      {selectedAgreementForDetail && (
        <AgreementDetailModal
          agreement={selectedAgreementForDetail}
          isOpen={!!selectedAgreementForDetail}
          onClose={() => setSelectedAgreementForDetail(null)}
          relationships={relationships}
          dynamics={INITIAL_DYNAMICS}
          users={ALL_USERS}
          currentUserId="usr_alex"
          onUpdateAgreement={handleUpdateAgreement}
          onNavigateToDynamic={(dynId) => {
            if (onNavigateDynamic) onNavigateDynamic(dynId);
          }}
          onNavigateToRelationship={(relId) => {
            setSelectedRelId(relId);
            setViewMode('detail');
          }}
        />
      )}

      {/* Agreement Creation Modal */}
      {isCreateAgreementOpen && (
        <AgreementCreationModal
          isOpen={isCreateAgreementOpen}
          onClose={() => setIsCreateAgreementOpen(false)}
          relationships={relationships}
          dynamics={INITIAL_DYNAMICS}
          users={ALL_USERS}
          currentUserId="usr_alex"
          initialRelationshipId={selectedRelationship?.id}
          onCreateAgreement={handleCreateAgreement}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSessionForDetail && (
        <SessionDetailModal
          session={selectedSessionForDetail}
          isOpen={!!selectedSessionForDetail}
          onClose={() => setSelectedSessionForDetail(null)}
          relationships={relationships}
          dynamics={INITIAL_DYNAMICS}
          agreements={agreements}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
          onUpdateSession={handleUpdateSession}
          onOpenAgreement={agr => setSelectedAgreementForDetail(agr)}
        />
      )}

      {/* Session Creation Modal */}
      {isCreateSessionOpen && (
        <SessionCreationModal
          isOpen={isCreateSessionOpen}
          onClose={() => setIsCreateSessionOpen(false)}
          relationships={relationships}
          dynamics={INITIAL_DYNAMICS}
          agreements={agreements}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
          initialRelationshipId={selectedRelationship?.id}
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
          relationships={relationships}
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
          relationships={relationships}
          dynamics={INITIAL_DYNAMICS}
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
          relationships={relationships}
          dynamics={INITIAL_DYNAMICS}
          onCreateTask={handleCreateTask}
        />
      )}
    </div>
  );
};
