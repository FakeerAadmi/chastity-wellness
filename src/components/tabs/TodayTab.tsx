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
} from 'lucide-react';
import {
  CURRENT_USER,
  ALL_USERS,
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  INITIAL_RITUALS,
  INITIAL_PERMISSION_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_AGREEMENTS,
  INITIAL_CHECKINS,
  INITIAL_SAFETY_PLAN
} from '../../data/domainDemoData';
import { CheckInScale, Ritual, Session, CheckIn } from '../../types/domain';
import { SessionCard } from '../sessions/SessionCard';
import { SessionDetailModal } from '../sessions/SessionDetailModal';
import { SessionCreationModal } from '../sessions/SessionCreationModal';
import { RitualExecutionModal } from '../rituals/RitualExecutionModal';
import { CheckInModal } from '../checkins/CheckInModal';

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
  const [pendingRequests, setPendingRequests] = useState(INITIAL_PERMISSION_REQUESTS);
  const [checkInMood, setCheckInMood] = useState<CheckInScale>('great');
  const [checkInNote, setCheckInNote] = useState('');
  const [checkInSaved, setCheckInSaved] = useState(false);

  // Modals state
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<Session | null>(null);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [selectedRitualForExecution, setSelectedRitualForExecution] = useState<Ritual | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

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

  // Quick permission approval / resolution
  const handleResolveRequest = (id: string, status: 'approved' | 'declined') => {
    setPendingRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status } : req))
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
  const sessionsNeedingReadiness = sessions.filter(
    s => (s.status === 'planned' || s.status === 'active') &&
         s.participantReadiness?.[CURRENT_USER.id] === 'needs_discussion'
  );
  const agreementsInNegotiation = INITIAL_AGREEMENTS.filter(
    a => a.status === 'negotiating' && a.participantResponses.some(p => p.participantId === CURRENT_USER.id && p.response === 'pending')
  );

  const pendingItemsCount =
    pendingRequests.filter(r => r.status === 'pending').length +
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
              <p className="text-xs text-[#8d7596]">All agreements, checks, and requests are currently up to date.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {/* Permission Requests */}
            {pendingRequests
              .filter(r => r.status === 'pending')
              .map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-[#1c1026] border border-[#d94f6f]/30 hover:border-[#d94f6f]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d94f6f]/15 text-[#d94f6f] border border-[#d94f6f]/30 uppercase tracking-wider">
                        {req.requestType.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#b59ebf]">
                        from {req.requesterId === CURRENT_USER.id ? 'You' : 'Partner'}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#fae8d7]">{req.title}</h3>
                    <p className="text-xs text-[#b59ebf] leading-relaxed max-w-2xl">{req.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleResolveRequest(req.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-colors"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleResolveRequest(req.id, 'declined')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors"
                    >
                      Discuss
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

        {/* Right Column (1 Col): Today's Rituals Checklist & Safety Quick Access */}
        <div className="space-y-6">
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
    </div>
  );
};
