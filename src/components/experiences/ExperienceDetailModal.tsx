'use client';

import React from 'react';
import { Experience, User, Dynamic, Agreement } from '@/types/domain';
import {
  X,
  Play,
  Clock,
  Shield,
  GitBranch,
  Heart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface ExperienceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience | null;
  users: User[];
  dynamics: Dynamic[];
  agreements: Agreement[];
  currentUserId?: string;
  onStart: (experience: Experience) => void;
  onResume: (experience: Experience) => void;
  onToggleReadiness?: (experienceId: string, status: 'ready' | 'not_ready') => void;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  isOpen,
  onClose,
  experience,
  users,
  dynamics,
  agreements,
  currentUserId,
  onStart,
  onResume,
  onToggleReadiness
}) => {
  if (!isOpen || !experience) return null;

  const getUser = (id: string) => users.find(u => u.id === id);
  const dynamic = experience.dynamicId ? dynamics.find(d => d.id === experience.dynamicId) : undefined;
  const boundAgreements = (experience.agreementIds || [])
    .map(aid => agreements.find(a => a.id === aid))
    .filter(Boolean) as Agreement[];

  const currentUserReadiness = currentUserId && experience.participantReadiness
    ? experience.participantReadiness[currentUserId]
    : undefined;

  const allReady = experience.participantIds.every(
    pid => experience.participantReadiness?.[pid] === 'ready'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#140b1c] border border-[#3b1f4e] shadow-2xl overflow-hidden my-8 text-[#fae8d7]">
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-[#241334] to-[#1a0c26] border-b border-[#381e47] flex items-start justify-between">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#d94f6f]/15 text-[#d94f6f] border border-[#d94f6f]/30">
                {experience.experienceType.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#251433] text-[#b59ebf] border border-[#381e47] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d94f6f]" />
                ~{experience.estimatedDurationMinutes || 30} minutes
              </span>
              {dynamic && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#3b1f4e]/50 text-rose-200 border border-[#4a2663]">
                  {dynamic.name}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#fae8d7]">
              {experience.title}
            </h2>
            {experience.intent && (
              <p className="text-sm text-[#d4af37] italic font-serif">
                &ldquo;{experience.intent}&rdquo;
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Narrative Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
              Narrative & Purpose
            </h3>
            <p className="text-sm text-[#d9cddb] leading-relaxed bg-[#1b1025] p-4 rounded-2xl border border-[#2d1838]">
              {experience.description}
            </p>
          </div>

          {/* Contextual Roles & Readiness Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
                Participants & Contextual Roles
              </h3>
              <span className="text-xs text-[#d94f6f] font-medium">
                {allReady ? 'All partners marked ready' : 'Awaiting confirmation'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experience.participantIds.map(pid => {
                const user = getUser(pid);
                const roleName = experience.participantRoles?.[pid] || 'Participant';
                const status = experience.participantReadiness?.[pid] || 'not_ready';
                const isCurrent = pid === currentUserId;

                return (
                  <div
                    key={pid}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      status === 'ready'
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : 'bg-[#1e1229] border-[#381e47]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#381e47] border border-[#4a2663] flex items-center justify-center font-bold text-xs text-[#fae8d7]">
                        {user?.displayName?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-[#fae8d7]">
                            {user?.displayName || pid}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-[#b59ebf] font-mono">(You)</span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-rose-300">
                          {roleName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'ready' ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ready
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bound Agreements & Safety Invariants */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#d94f6f]" />
              <span>Safety, Agreements & Safewords</span>
            </h3>

            <div className="p-4 rounded-2xl bg-[#1b1025] border border-[#2d1838] space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/50 text-rose-300 border border-rose-800/60 font-semibold">
                  <span>RED</span> = Immediate Hard Stop
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/50 text-amber-300 border border-amber-800/60 font-semibold">
                  <span>YELLOW</span> = Slow Pacing / Check-in
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/50 text-blue-300 border border-blue-800/60 font-semibold">
                  <span>PAUSE</span> = Unconditional Freeze
                </div>
              </div>

              {boundAgreements.length > 0 ? (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-[#b59ebf] block">
                    Underlying Agreed Covenants:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {boundAgreements.map(a => (
                      <span
                        key={a.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#251433] text-[#fae8d7] border border-[#381e47] flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3 text-[#d4af37]" />
                        {a.title}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#a898b0]">
                  Operates under Haven&apos;s universal voluntary consent charter with unconditional pause rights.
                </p>
              )}
            </div>
          </div>

          {/* Journey Steps Roadmap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                <span>Experience Flow & Branch Paths ({experience.steps.length} Steps)</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {experience.steps.map((step, idx) => {
                const isBranch = step.stepType === 'decision_branch';

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isBranch
                        ? 'bg-purple-950/20 border-purple-800/50'
                        : 'bg-[#1b1025] border-[#2d1838]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#2a1639] border border-[#3f2154] flex items-center justify-center text-xs font-mono text-[#fae8d7] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#fae8d7]">
                              {step.title}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#251433] text-purple-300 border border-purple-800/40">
                              {step.stepType.replace('_', ' ')}
                            </span>
                            {step.roleAssignment && step.roleAssignment !== 'all' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-800/40">
                                Guided Role: {step.roleAssignment}
                              </span>
                            )}
                          </div>
                          {step.description && (
                            <p className="text-xs text-[#b59ebf] leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {step.durationMinutes && (
                        <div className="flex items-center gap-1 text-[11px] text-[#b59ebf] shrink-0 bg-[#251433] px-2 py-0.5 rounded-md border border-[#381e47]">
                          <Clock className="w-3 h-3 text-[#d94f6f]" />
                          <span>{step.durationMinutes}m</span>
                        </div>
                      )}
                    </div>

                    {/* If decision branch, render choice paths */}
                    {isBranch && step.options && step.options.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-purple-900/30 pl-9 space-y-2">
                        <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wide block">
                          Branch Decision Choices:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.options.map(opt => (
                            <div
                              key={opt.id}
                              className="p-2.5 rounded-lg bg-[#241334]/80 border border-purple-800/40 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between font-medium text-[#fae8d7]">
                                <span>{opt.label}</span>
                                <ArrowRight className="w-3 h-3 text-purple-400" />
                              </div>
                              {opt.description && (
                                <p className="text-[11px] text-[#b59ebf]">
                                  {opt.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aftercare Commitment */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-[#1e102b] border border-purple-800/40 flex items-start gap-3">
            <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#fae8d7] block text-sm">
                Mandatory Aftercare & Reflection Integration
              </span>
              <p className="text-[#c7b5cd] leading-relaxed">
                Every Haven experience automatically reserves transition time after completion. 
                Partners check in on emotional grounding, physical warmth/hydration, and capture quiet reflections.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#1a0c26] border-t border-[#381e47] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors"
          >
            Back to Catalog
          </button>

          <div className="flex items-center gap-3">
            {/* Toggle Readiness */}
            {currentUserId && onToggleReadiness && (
              <button
                onClick={() =>
                  onToggleReadiness(
                    experience.id,
                    currentUserReadiness === 'ready' ? 'not_ready' : 'ready'
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  currentUserReadiness === 'ready'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                    : 'bg-[#251433] text-[#fae8d7] border-[#381e47] hover:border-[#d94f6f]/50'
                }`}
              >
                {currentUserReadiness === 'ready' ? '✓ You Are Marked Ready' : 'Mark Yourself Ready'}
              </button>
            )}

            {/* Launch or Resume */}
            {experience.status === 'in_progress' ? (
              <button
                onClick={() => onResume(experience)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/50 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Active Journey</span>
              </button>
            ) : (
              <button
                onClick={() => onStart(experience)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] hover:from-[#e25c7c] hover:to-[#8b4bf3] shadow-lg shadow-[#d94f6f]/30 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Enter Experience Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
