'use client';

import React, { useState } from 'react';
import {
  Heart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  ArrowRight,
  Send,
  Users,
  Compass,
  Check,
  Plus,
  Play,
  Flame,
  Gift,
  Camera,
  CheckSquare,
  Inbox,
  GitFork,
  ChevronRight,
  Circle
} from 'lucide-react';
import {
  CURRENT_USER,
  ALL_USERS,
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  INITIAL_RITUALS,
  INITIAL_HAVEN_REQUESTS,
  INITIAL_DESIRES,
  INITIAL_TASKS,
  INITIAL_PERMISSION_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_AGREEMENTS,
  INITIAL_CHECKINS,
  INITIAL_SAFETY_PLAN
} from '../../data/domainDemoData';
import {
  CheckInScale,
  Ritual,
  Session,
  CheckIn,
  HavenRequest,
  Desire,
  HavenTask,
  TaskProof
} from '../../types/domain';
import { SessionCard } from '../sessions/SessionCard';
import { SessionDetailModal } from '../sessions/SessionDetailModal';
import { SessionCreationModal } from '../sessions/SessionCreationModal';
import { RitualExecutionModal } from '../rituals/RitualExecutionModal';
import { CheckInModal } from '../checkins/CheckInModal';
import { TaskProofModal } from '../tasks/TaskProofModal';
import { RequestCounterModal } from '../requests/RequestCounterModal';

interface TodayTabProps {
  onNavigateTab: (tab: string) => void;
  onOpenEmergency: () => void;
  userRole: 'Wearer' | 'Keyholder' | 'Explorer';
}

export const TodayTab: React.FC<TodayTabProps> = ({
  onNavigateTab,
  onOpenEmergency,
  userRole
}) => {
  // Local interactive states for sessions, rituals & check-ins
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [rituals, setRituals] = useState<Ritual[]>(INITIAL_RITUALS);
  const [, setCheckins] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const [requests, setRequests] = useState<HavenRequest[]>(INITIAL_HAVEN_REQUESTS);
  const [tasks, setTasks] = useState<HavenTask[]>(INITIAL_TASKS);
  const [desires] = useState<Desire[]>(INITIAL_DESIRES);
  const [checkInMood, setCheckInMood] = useState<CheckInScale>('great');
  const [checkInNote, setCheckInNote] = useState('');
  const [checkInSaved, setCheckInSaved] = useState(false);

  // Modals state
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<Session | null>(null);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [selectedRitualForExecution, setSelectedRitualForExecution] = useState<Ritual | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedTaskForProof, setSelectedTaskForProof] = useState<HavenTask | null>(null);
  const [counterModalRequest, setCounterModalRequest] = useState<HavenRequest | null>(null);

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
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

  const handleSubmitTaskProof = (taskId: string, proof: TaskProof) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'submitted', proof, updatedAt: new Date().toISOString() } : t))
    );
  };

  // Quick request response
  const handleRespondToRequest = (
    requestId: string,
    action: 'accept' | 'decline' | 'discuss' | 'not_now',
    note?: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        const statusMap = {
          accept: 'accepted' as const,
          decline: 'declined' as const,
          discuss: 'discussing' as const,
          not_now: 'not_now' as const,
        };
        return {
          ...req,
          status: statusMap[action],
          responseNote: note,
          history: [
            ...req.history,
            {
              timestamp: new Date().toISOString(),
              action: action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'discuss_requested',
              actorId: CURRENT_USER.id,
              note,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleSendCounterProposal = (
    requestId: string,
    modifiedTitle: string,
    modifiedConditions: string,
    modifiedDurationMinutes: number | undefined,
    note: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: 'counter_proposed',
          counterProposal: {
            modifiedTitle,
            modifiedConditions,
            modifiedDurationMinutes,
            note,
            proposedById: CURRENT_USER.id,
            proposedAt: new Date().toISOString(),
          },
          history: [
            ...req.history,
            {
              timestamp: new Date().toISOString(),
              action: 'counter_proposed',
              actorId: CURRENT_USER.id,
              note: `Counter-proposed: ${note}`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Toggle ritual completion
  const handleToggleRitual = (ritualId: string) => {
    setRituals(prev =>
      prev.map(r => {
        if (r.id !== ritualId) return r;
        const isDone = r.completions.length > 0;
        if (isDone) {
          return { ...r, completions: [] };
        } else {
          return {
            ...r,
            completions: [
              {
                id: `cmp_${Date.now()}`,
                completedAt: new Date().toISOString(),
                completedBy: CURRENT_USER.id,
                note: 'Completed from Today dashboard',
                emotionalState: 'content',
              },
            ],
          };
        }
      })
    );
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInSaved(true);
    setTimeout(() => setCheckInSaved(false), 3000);
    setCheckInNote('');
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

  const handleSaveModalCheckIn = (newCheckIn: CheckIn) => {
    setCheckins(prev => [newCheckIn, ...prev]);
    setIsCheckInModalOpen(false);
  };

  const primaryRelationship = INITIAL_RELATIONSHIPS[0];
  const activeDynamics = INITIAL_DYNAMICS.filter(d => d.status === 'active');
  const activeOrPlannedSessions = sessions.filter(s => s.status === 'active' || s.status === 'planned');

  // Things that need user attention
  const incomingPendingRequests = requests.filter(
    r => r.recipientIds.includes(CURRENT_USER.id) && r.status === 'pending'
  );

  const tasksDueToday = tasks.filter(
    t => t.assignedToIds.includes(CURRENT_USER.id) &&
         (t.priority === 'high_focus' || t.recurrence === 'daily') &&
         t.status !== 'completed' && t.status !== 'verified'
  );

  const isPositiveRating = (r?: string) => r === 'eager' || r === 'curious' || r === 'exploring';
  const topMutualMatch = desires.find(d => {
    const myRating = d.participantResponses[CURRENT_USER.id]?.rating;
    if (!isPositiveRating(myRating)) return false;
    return Object.entries(d.participantResponses).some(
      ([uid, resp]) => uid !== CURRENT_USER.id && isPositiveRating(resp.rating)
    );
  });

  const sessionsNeedingReadiness = sessions.filter(
    s => (s.status === 'planned' || s.status === 'active') &&
         s.participantReadiness?.[CURRENT_USER.id] === 'needs_discussion'
  );
  const agreementsInNegotiation = INITIAL_AGREEMENTS.filter(
    a => a.status === 'negotiating' && a.participantResponses.some(p => p.participantId === CURRENT_USER.id && p.response === 'pending')
  );

  const pendingItemsCount =
    incomingPendingRequests.length +
    tasksDueToday.length +
    sessionsNeedingReadiness.length +
    agreementsInNegotiation.length;
  const completedRitualsCount = rituals.filter(r => r.completions.length > 0).length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header Greeting & Today's Vital Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#1c1026] via-[#170a20] to-[#0f0714] border border-[#2d163d] shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d94f6f] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today at Haven</span>
            <span className="text-[#6d5575]">•</span>
            <span className="text-[#b59ebf]">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fae8d7] tracking-tight">
            Welcome back, {CURRENT_USER.displayName}
          </h1>
          <p className="text-sm text-[#b59ebf] mt-1 max-w-xl">
            Viewing through the <span className="font-semibold text-[#fae8d7]">{userRole}</span> perspective in{' '}
            <button
              onClick={() => onNavigateTab('relationships')}
              className="font-semibold text-[#d94f6f] hover:underline"
            >
              {primaryRelationship.name}
            </button>.
          </p>
        </div>

        {/* Quick Vital Badges */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-[#251433]/80 border border-[#381e47] text-left">
            <span className="text-[10px] text-[#b59ebf] block uppercase font-medium">Pending Review</span>
            <span className="text-sm font-bold text-[#fae8d7]">
              {pendingItemsCount > 0 ? `${pendingItemsCount} Item${pendingItemsCount > 1 ? 's' : ''}` : 'All clear'}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#251433]/80 border border-[#381e47] text-left">
            <span className="text-[10px] text-[#b59ebf] block uppercase font-medium">Daily Rituals</span>
            <span className="text-sm font-bold text-[#d94f6f]">
              {completedRitualsCount}/{rituals.length} Done
            </span>
          </div>
        </div>
      </div>

      {/* 2. Things That Need You (Action Required) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#fae8d7] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#d94f6f]" />
            Things That Need You
          </h2>
          <span className="text-xs text-[#b59ebf]">
            {pendingItemsCount === 0 ? 'Everything current' : `${pendingItemsCount} action${pendingItemsCount > 1 ? 's' : ''} waiting`}
          </span>
        </div>

        {pendingItemsCount === 0 ? (
          <div className="p-4 rounded-xl bg-[#1c1026]/40 border border-[#251433] text-sm text-[#b59ebf] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-[#fae8d7]">No urgent actions pending</p>
              <p className="text-xs text-[#8d7596]">All agreements, checks, requests, and tasks are currently up to date.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {/* Incoming Requests Waiting For You */}
            {incomingPendingRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-[#1c1026] border border-[#d94f6f]/40 hover:border-[#d94f6f]/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d94f6f]/20 text-[#d94f6f] border border-[#d94f6f]/30 uppercase tracking-wider">
                      {req.requestMode === 'permission' ? 'Permission Request' : 'Proposal'}
                    </span>
                    <span className="text-xs text-[#b59ebf]">
                      from {ALL_USERS.find(u => u.id === req.requesterId)?.displayName || 'Partner'}
                    </span>
                    {req.durationMinutes && (
                      <span className="text-[10px] font-semibold text-[#b59ebf] bg-[#251433] px-2 py-0.5 rounded">
                        {req.durationMinutes} min
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#fae8d7]">{req.title}</h3>
                  <p className="text-xs text-[#b59ebf] leading-relaxed max-w-2xl">{req.description}</p>
                  {req.conditions && (
                    <p className="text-[11px] text-[#e8cce8] italic">
                      Condition: {req.conditions}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleRespondToRequest(req.id, 'accept')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-white transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => setCounterModalRequest(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c084fc]/20 hover:bg-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 transition-colors flex items-center gap-1"
                  >
                    <GitFork className="w-3 h-3" />
                    Counter
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(req.id, 'discuss', 'Let\'s talk in person')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors"
                  >
                    Discuss
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(req.id, 'decline')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#251433] hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}

            {/* High-Focus Tasks Due Today */}
            {tasksDueToday.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-[#1c1026] border border-[#eab308]/40 hover:border-[#eab308]/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eab308]/15 text-[#eab308] border border-[#eab308]/30 uppercase tracking-wider">
                      Task Due Today
                    </span>
                    <span className="text-xs text-[#b59ebf]">
                      Assigned by {ALL_USERS.find(u => u.id === task.assignedById)?.displayName || 'Partner'}
                    </span>
                    {task.proofType !== 'none' && (
                      <span className="text-[10px] text-[#f472b6] font-semibold bg-[#2d123b] px-1.5 py-0.5 rounded border border-[#db2777]/30">
                        {task.proofType.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#fae8d7]">{task.title}</h3>
                  <p className="text-xs text-[#b59ebf] leading-relaxed max-w-2xl">{task.description}</p>
                  {task.rewardDescription && (
                    <p className="text-[11px] text-[#eab308] flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      Reward: {task.rewardDescription}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (task.proofType !== 'none' && task.proofType !== 'completion_confirmation') {
                        setSelectedTaskForProof(task);
                      } else {
                        handleToggleTask(task.id);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#eab308] hover:bg-[#ca8a04] text-black transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{task.proofType !== 'none' && task.proofType !== 'completion_confirmation' ? 'Submit Proof' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Sessions Needing Discussion / Readiness */}
            {sessionsNeedingReadiness.map(sess => (
              <div
                key={sess.id}
                className="p-4 rounded-xl bg-[#1c1026] border border-amber-500/40 hover:border-amber-500/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                      Readiness Discussion
                    </span>
                    <span className="text-xs text-[#b59ebf]">Session: {sess.title}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#fae8d7]">{sess.title}</h3>
                  <p className="text-xs text-[#b59ebf] leading-relaxed max-w-2xl">
                    Your readiness status is currently marked as needing discussion before this session proceeds.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedSessionForDetail(sess)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors"
                  >
                    Confirm Readiness
                  </button>
                </div>
              </div>
            ))}

            {/* Agreements In Negotiation */}
            {agreementsInNegotiation.map(agr => (
              <div
                key={agr.id}
                className="p-4 rounded-xl bg-[#1c1026] border border-[#d4af37]/40 hover:border-[#d4af37]/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 uppercase tracking-wider">
                      Agreement Review
                    </span>
                    <span className="text-xs text-[#b59ebf]">Mutual sign-off requested</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#fae8d7]">{agr.title}</h3>
                  <p className="text-xs text-[#b59ebf] leading-relaxed max-w-2xl">{agr.content}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onNavigateTab('agreements')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#d4af37] hover:bg-[#e6c250] text-black transition-colors"
                  >
                    Review Compact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2.5. Something You Both Want to Explore (Mutual Desire Match Spotlight) */}
      {topMutualMatch && (
        <section className="p-5 rounded-2xl bg-gradient-to-r from-[#d94f6f]/20 via-[#a855f7]/15 to-[#1c1026] border border-[#d94f6f]/50 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d94f6f]/30 text-[#fae8d7] text-[10px] font-bold uppercase tracking-wider border border-[#d94f6f]/40">
                  <Flame className="w-3 h-3 text-[#d94f6f]" />
                  Something You Both Want to Explore
                </span>
                <span className="text-[10px] font-semibold text-[#b59ebf] uppercase">
                  {topMutualMatch.category.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#fae8d7]">
                {topMutualMatch.title}
              </h3>
              <p className="text-xs text-[#d4c3d9] leading-relaxed max-w-2xl">
                {topMutualMatch.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateTab('requests')}
                className="px-4 py-2 rounded-xl bg-[#d94f6f] hover:bg-[#e05a7a] text-white text-xs font-bold transition-all shadow-md shadow-[#d94f6f]/25 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Propose Request</span>
              </button>
              <button
                onClick={() => onNavigateTab('desires')}
                className="px-3 py-2 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] border border-[#381e47] text-xs font-semibold transition-colors"
              >
                <span>View Deck</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. Core Split: Active Dynamics & Today's Rituals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Dynamics & Active Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Dynamics Overview */}
          <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#d94f6f]" />
                  Active Dynamics
                </h2>
                <p className="text-xs text-[#b59ebf]">Currently operating within {primaryRelationship.name}</p>
              </div>
              <button
                onClick={() => onNavigateTab('dynamics')}
                className="text-xs font-semibold text-[#d94f6f] hover:text-[#fae8d7] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeDynamics.map(dynamic => {
                return (
                  <div
                    key={dynamic.id}
                    onClick={() => onNavigateTab('dynamics')}
                    className="p-4 rounded-xl bg-[#130b1a] border border-[#2d163d] hover:border-[#d94f6f]/50 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#251433] text-[#fae8d7]">
                          {dynamic.dynamicType.replace('_', ' ')}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active" />
                      </div>
                      <h3 className="text-sm font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                        {dynamic.name}
                      </h3>
                      <p className="text-xs text-[#b59ebf] line-clamp-2">
                        {dynamic.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#200f2e] flex items-center justify-between text-[11px] text-[#8d7596]">
                      <span>{dynamic.activeAgreementsCount} Agreed Protocols</span>
                      <span className="text-[#fae8d7] font-medium group-hover:underline">
                        Details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active & Planned Practice Sessions */}
            <div className="mt-4 pt-4 border-t border-[#251433] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d94f6f]" />
                    Upcoming &amp; Active Sessions ({activeOrPlannedSessions.length})
                  </h3>
                  <p className="text-[11px] text-[#b59ebf]">Structured practices with explicit agreements and readiness.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateSessionOpen(true)}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#d94f6f] text-white hover:bg-[#b83856] transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Session</span>
                </button>
              </div>

              {activeOrPlannedSessions.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] text-center text-xs text-[#8d7596]">
                  No active or planned practice sessions scheduled today.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeOrPlannedSessions.slice(0, 4).map(sess => (
                    <SessionCard
                      key={sess.id}
                      session={sess}
                      dynamic={INITIAL_DYNAMICS.find(d => d.id === sess.dynamicId)}
                      agreement={INITIAL_AGREEMENTS.find(a => sess.agreementIds?.includes(a.id))}
                      users={ALL_USERS}
                      currentUserId={CURRENT_USER.id}
                      onClick={() => setSelectedSessionForDetail(sess)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Emotional & Dynamic Check-in */}
          <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#d94f6f]" />
                  Daily Connection &amp; Headspace Check-in
                </h2>
                <p className="text-xs text-[#b59ebf]">
                  A private emotional temperature check to maintain alignment and psychological safety.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckInModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5 self-start sm:self-center shrink-0"
              >
                <Heart className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Multi-Dimensional Check-in &rarr;</span>
              </button>
            </div>

            <form onSubmit={handleSaveCheckIn} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    { key: 'great', label: 'Great', emoji: '🌿', color: 'border-emerald-500/40 text-emerald-300' },
                    { key: 'good', label: 'Good', emoji: '🌸', color: 'border-rose-400/40 text-rose-300' },
                    { key: 'neutral', label: 'Neutral', emoji: '⚖️', color: 'border-blue-400/40 text-blue-300' },
                    { key: 'uneasy', label: 'Uneasy', emoji: '🌧️', color: 'border-amber-400/40 text-amber-300' },
                    { key: 'need_support', label: 'Support', emoji: '🚨', color: 'border-purple-400/40 text-purple-300' },
                  ] as const
                ).map(scale => {
                  const isSelected = checkInMood === scale.key;
                  return (
                    <button
                      key={scale.key}
                      type="button"
                      onClick={() => setCheckInMood(scale.key)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? `bg-[#251433] ${scale.color} shadow-sm ring-1 ring-[#d94f6f]`
                          : 'bg-[#130b1a] border-[#251433] text-[#b59ebf] hover:bg-[#1a0e24]'
                      }`}
                    >
                      <span className="text-lg">{scale.emoji}</span>
                      <span>{scale.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={checkInNote}
                  onChange={e => setCheckInNote(e.target.value)}
                  placeholder="Optional reflection (e.g. skin feels good, energy is high, looking forward to evening)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#fae8d7] placeholder-[#6d5575] focus:outline-none focus:border-[#d94f6f]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8d7596]">
                  Stored locally in privacy-aware local storage.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {checkInSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Check-in Logged</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Check-in</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1 Col): Today's Tasks, Today's Rituals & Safety Quick Access */}
        <div className="space-y-6">
          {/* Today's Tasks & Devotions */}
          <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#d94f6f]" />
                  Today&apos;s Tasks &amp; Devotions
                </h2>
                <p className="text-xs text-[#b59ebf]">Active daily commitments</p>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-semibold text-[#d94f6f] hover:underline"
              >
                All Tasks
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks
                .filter(t => t.assignedToIds.includes(CURRENT_USER.id) && t.status !== 'completed' && t.status !== 'verified')
                .slice(0, 3)
                .map(task => {
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        if (task.proofType !== 'none' && task.proofType !== 'completion_confirmation') {
                          setSelectedTaskForProof(task);
                        } else {
                          handleToggleTask(task.id);
                        }
                      }}
                      className="p-3 rounded-xl border border-[#251433] hover:border-[#d94f6f]/40 bg-[#130b1a] transition-all cursor-pointer flex items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-5 h-5 mt-0.5 rounded-lg border border-[#472758] bg-[#1a0c26] flex items-center justify-center shrink-0">
                          <Circle className="w-3.5 h-3.5 text-[#6b5873]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold truncate text-[#fae8d7]">
                            {task.title}
                          </h4>
                          {task.rewardDescription ? (
                            <p className="text-[10px] text-[#eab308] truncate mt-0.5 flex items-center gap-1">
                              <Gift className="w-2.5 h-2.5" />
                              Reward: {task.rewardDescription}
                            </p>
                          ) : (
                            <p className="text-[11px] text-[#b59ebf] line-clamp-1 mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {task.proofType !== 'none' && task.proofType !== 'completion_confirmation' ? (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#251433] text-[#f472b6] border border-[#db2777]/30 shrink-0">
                          Proof
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#251433] text-[#fae8d7] border border-[#381e47] shrink-0">
                          Done
                        </span>
                      )}
                    </div>
                  );
                })}

              {tasks.filter(t => t.assignedToIds.includes(CURRENT_USER.id) && t.status !== 'completed' && t.status !== 'verified').length === 0 && (
                <div className="p-3 text-center text-xs text-[#8d7596] rounded-xl bg-[#130b1a] border border-[#251433]">
                  All assigned tasks completed for today.
                </div>
              )}
            </div>
          </div>

          {/* Today's Rituals Checklist */}
          <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d94f6f]" />
                  Today&apos;s Rituals
                </h2>
                <p className="text-xs text-[#b59ebf]">Interactive step protocols</p>
              </div>
              <button
                onClick={() => onNavigateTab('rituals')}
                className="text-xs font-semibold text-[#d94f6f] hover:underline"
              >
                All Rituals
              </button>
            </div>

            <div className="space-y-2.5">
              {rituals.map(ritual => {
                const isCompleted = ritual.completions.length > 0;
                return (
                  <div
                    key={ritual.id}
                    onClick={() => handleToggleRitual(ritual.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                      isCompleted
                        ? 'bg-[#150a1e]/60 border-[#2b173a] opacity-80'
                        : 'bg-[#130b1a] border-[#251433] hover:border-[#d94f6f]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          isCompleted
                            ? 'bg-[#d94f6f] border-[#d94f6f] text-white'
                            : 'border-[#472758] bg-[#1a0c26]'
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className={`text-xs font-semibold truncate ${
                              isCompleted ? 'line-through text-[#8d7596]' : 'text-[#fae8d7]'
                            }`}
                          >
                            {ritual.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#b59ebf] line-clamp-1 mt-0.5">
                          {ritual.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRitualForExecution(ritual);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#251433] hover:bg-[#d94f6f] text-[#fae8d7] border border-[#381e47] transition-all flex items-center gap-1 shrink-0"
                    >
                      <Play className="w-3 h-3 text-[#d94f6f] group-hover:text-white" />
                      <span>Run</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Safety Safeguards */}
          <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#d94f6f]" />
                Safety Anchor
              </h3>
              <button
                onClick={onOpenEmergency}
                className="text-[11px] font-bold text-rose-400 hover:underline"
              >
                Emergency Protocol
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#130b1a] border border-[#251433] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#fae8d7]">
                <span className="font-semibold text-rose-400">Red:</span>
                <span>Immediate release / stop</span>
              </div>
              <div className="flex items-center justify-between text-[#fae8d7]">
                <span className="font-semibold text-amber-300">Yellow / Amber:</span>
                <span>Pause &amp; comfort check-in</span>
              </div>
              <div className="flex items-center justify-between text-[#fae8d7]">
                <span className="font-semibold text-emerald-400">Green:</span>
                <span>Consent confirmed, continue</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8d7596] leading-relaxed">
              Key location: <span className="text-[#b59ebf] font-medium">{INITIAL_SAFETY_PLAN.emergencyPhysicalKeyLocation?.slice(0, 45)}...</span>
            </p>
          </div>

          {/* Quick Navigation Cards */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1026] to-[#120719] border border-[#251433] space-y-2">
            <span className="text-[10px] font-bold text-[#b59ebf] uppercase tracking-wider block">
              Quick Portals
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('explore')}
                className="p-2.5 rounded-xl bg-[#130b1a] border border-[#251433] hover:border-[#d94f6f]/50 text-left transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#d94f6f]" />
                <span className="text-xs font-semibold text-[#fae8d7]">Explore Tools</span>
              </button>
              <button
                onClick={() => onNavigateTab('relationships')}
                className="p-2.5 rounded-xl bg-[#130b1a] border border-[#251433] hover:border-[#d94f6f]/50 text-left transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#7c3aed]" />
                <span className="text-xs font-semibold text-[#fae8d7]">Relationships</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSessionForDetail && (
        <SessionDetailModal
          session={selectedSessionForDetail}
          isOpen={!!selectedSessionForDetail}
          onClose={() => setSelectedSessionForDetail(null)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={INITIAL_DYNAMICS}
          agreements={INITIAL_AGREEMENTS}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
          onUpdateSession={handleUpdateSession}
          onOpenEmergency={onOpenEmergency}
        />
      )}

      {/* Session Creation Modal */}
      {isCreateSessionOpen && (
        <SessionCreationModal
          isOpen={isCreateSessionOpen}
          onClose={() => setIsCreateSessionOpen(false)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={INITIAL_DYNAMICS}
          agreements={INITIAL_AGREEMENTS}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
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

      {/* Multi-Dimensional CheckIn Modal */}
      {isCheckInModalOpen && (
        <CheckInModal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          relationships={INITIAL_RELATIONSHIPS}
          dynamics={activeDynamics}
          users={ALL_USERS}
          currentUserId={CURRENT_USER.id}
          onSaveCheckIn={handleSaveModalCheckIn}
        />
      )}

      {/* Task Proof Modal */}
      {selectedTaskForProof && (
        <TaskProofModal
          isOpen={!!selectedTaskForProof}
          onClose={() => setSelectedTaskForProof(null)}
          task={selectedTaskForProof}
          currentUser={CURRENT_USER}
          allUsers={ALL_USERS}
          onSubmitProof={handleSubmitTaskProof}
        />
      )}

      {/* Request Counter-Proposal Modal */}
      {counterModalRequest && (
        <RequestCounterModal
          isOpen={!!counterModalRequest}
          onClose={() => setCounterModalRequest(null)}
          request={counterModalRequest}
          onSendCounterProposal={handleSendCounterProposal}
        />
      )}
    </div>
  );
};
