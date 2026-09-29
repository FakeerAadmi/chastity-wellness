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
  Lock,
  Calendar,
  MessageSquare,
  Users,
  Compass,
  Check
} from 'lucide-react';
import {
  CURRENT_USER,
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  INITIAL_RITUALS,
  INITIAL_PERMISSION_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_SAFETY_PLAN
} from '../../data/domainDemoData';
import { CheckInScale, Ritual } from '../../types/domain';

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
  // Local interactive states for checklist & quick check-in
  const [rituals, setRituals] = useState<Ritual[]>(INITIAL_RITUALS);
  const [pendingRequests, setPendingRequests] = useState(INITIAL_PERMISSION_REQUESTS);
  const [checkInMood, setCheckInMood] = useState<CheckInScale>('great');
  const [checkInNote, setCheckInNote] = useState('');
  const [checkInSaved, setCheckInSaved] = useState(false);

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
  const handleResolveRequest = (id: string, status: 'approved' | 'rejected') => {
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

  const primaryRelationship = INITIAL_RELATIONSHIPS[0];
  const activeDynamics = INITIAL_DYNAMICS.filter(d => d.status === 'active');
  const activeSession = INITIAL_SESSIONS.find(s => s.status === 'active');

  const pendingItemsCount = pendingRequests.filter(r => r.status === 'pending').length;
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
              {pendingItemsCount > 0 ? `${pendingItemsCount} Item` : 'All clear'}
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
            {pendingItemsCount === 0 ? 'Everything current' : `${pendingItemsCount} action waiting`}
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
                        {req.type} Request
                      </span>
                      <span className="text-xs text-[#b59ebf]">
                        from {req.requestedBy === CURRENT_USER.id ? 'You' : 'Partner'}
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
                      onClick={() => handleResolveRequest(req.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors"
                    >
                      Discuss
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
                const isChastity = dynamic.dynamicType === 'chastity_practice';
                return (
                  <div
                    key={dynamic.id}
                    onClick={() => onNavigateTab('dynamics')}
                    className="p-4 rounded-xl bg-[#130b1a] border border-[#2d163d] hover:border-[#d94f6f]/50 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#251433] text-[#fae8d7]">
                          {(dynamic.dynamicType || dynamic.category || 'Dynamic').replace('_', ' ')}
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

            {/* Active Session Highlight if Running */}
            {activeSession && (
              <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-[#200b25] to-[#16071d] border border-[#d94f6f]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d94f6f]/20 border border-[#d94f6f]/40 flex items-center justify-center text-[#d94f6f] shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#d94f6f] uppercase tracking-wider">
                        Active Time Session
                      </span>
                      <span className="text-[10px] text-[#b59ebf]">• 72h protocol</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#fae8d7]">
                      Mindful Chastity & Hygiene Window
                    </h4>
                    <p className="text-xs text-[#b59ebf]">
                      Day 2 of 3 • Next hygiene verification due at 20:30
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('vault')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#251433] hover:bg-[#d94f6f] text-[#fae8d7] border border-[#381e47] transition-all shrink-0 self-start sm:self-center"
                >
                  Manage Session
                </button>
              </div>
            )}
          </div>

          {/* Quick Emotional & Dynamic Check-in */}
          <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#d94f6f]" />
                Daily Connection & Headspace Check-in
              </h2>
              <p className="text-xs text-[#b59ebf]">
                A private emotional temperature check to maintain alignment and psychological safety.
              </p>
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
                  Today's Rituals
                </h2>
                <p className="text-xs text-[#b59ebf]">Tap to mark completed</p>
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
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isCompleted
                        ? 'bg-[#150a1e]/60 border-[#2b173a] opacity-80'
                        : 'bg-[#130b1a] border-[#251433] hover:border-[#d94f6f]/40'
                    }`}
                  >
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
                        {ritual.scheduledTime && (
                          <span className="text-[10px] text-[#8d7596] shrink-0">
                            {ritual.scheduledTime}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#b59ebf] line-clamp-1 mt-0.5">
                        {ritual.description}
                      </p>
                    </div>
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
                <span>Pause & comfort check-in</span>
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
    </div>
  );
};
