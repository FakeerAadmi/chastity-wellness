'use client';

import React from 'react';
import { Experience, User } from '@/types/domain';
import {
  Clock,
  Play,
  CheckCircle2,
  GitBranch,
  Shield,
  Users,
  Compass,
  Sparkles,
  ChevronRight,
  Flame,
  Lock,
  Heart,
  Volume2
} from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
  users: User[];
  currentUserId?: string;
  onSelect: (experience: Experience) => void;
  onStart: (experience: Experience) => void;
  onResume: (experience: Experience) => void;
  onToggleReadiness?: (experienceId: string, status: 'ready' | 'not_ready') => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  users,
  currentUserId,
  onSelect,
  onStart,
  onResume,
  onToggleReadiness
}) => {
  const getUser = (id: string) => users.find(u => u.id === id);

  // Type label & styling
  const getTypeBadge = (type: Experience['experienceType']) => {
    switch (type) {
      case 'bdsm_scene':
        return {
          label: 'BDSM / Power Exchange',
          classes: 'bg-purple-950/40 text-purple-300 border-purple-800/60',
          icon: Shield
        };
      case 'chastity_tease':
        return {
          label: 'Chastity & Orgasm Control',
          classes: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
          icon: Lock
        };
      case 'cuckold_fantasy':
        return {
          label: 'Hotwife / Cuckold Dynamic',
          classes: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60',
          icon: Flame
        };
      case 'sensory':
        return {
          label: 'Sensory Immersion',
          classes: 'bg-sky-950/40 text-sky-300 border-sky-800/60',
          icon: Sparkles
        };
      case 'erotic_ritual':
        return {
          label: 'Erotic Devotion & Ritual',
          classes: 'bg-fuchsia-950/40 text-fuchsia-300 border-fuchsia-800/60',
          icon: Heart
        };
      case 'long_distance':
        return {
          label: 'Long-Distance Resonance',
          classes: 'bg-blue-950/40 text-blue-300 border-blue-800/60',
          icon: Volume2
        };
      case 'reconnection':
        return {
          label: 'Emotional & Body Reconnection',
          classes: 'bg-rose-950/40 text-rose-300 border-rose-800/60',
          icon: Heart
        };
      default:
        return {
          label: 'Guided Dynamic Experience',
          classes: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/60',
          icon: Compass
        };
    }
  };

  const getStatusBadge = (status: Experience['status']) => {
    switch (status) {
      case 'in_progress':
        return {
          label: 'Happening Now',
          dot: 'bg-emerald-400 animate-pulse',
          badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
        };
      case 'ready':
        return {
          label: 'All Partners Ready',
          dot: 'bg-cyan-400',
          badge: 'bg-cyan-950/50 text-cyan-300 border-cyan-800/80'
        };
      case 'scheduled':
        return {
          label: 'Anticipated / Scheduled',
          dot: 'bg-amber-400',
          badge: 'bg-amber-950/50 text-amber-300 border-amber-800/80'
        };
      case 'paused':
        return {
          label: 'Paused (Grounding)',
          dot: 'bg-yellow-400',
          badge: 'bg-yellow-950/50 text-yellow-300 border-yellow-800/80'
        };
      case 'completed':
        return {
          label: 'Completed & Integrated',
          dot: 'bg-purple-400',
          badge: 'bg-purple-950/50 text-purple-300 border-purple-800/80'
        };
      case 'safeword_stopped':
        return {
          label: 'Safeword Stopped (Harm-Free)',
          dot: 'bg-rose-400',
          badge: 'bg-rose-950/50 text-rose-300 border-rose-800/80'
        };
      default:
        return {
          label: 'Draft Journey',
          dot: 'bg-neutral-500',
          badge: 'bg-neutral-900 text-neutral-400 border-neutral-800'
        };
    }
  };

  const typeConfig = getTypeBadge(experience.experienceType);
  const statusConfig = getStatusBadge(experience.status);
  const TypeIcon = typeConfig.icon;

  const hasBranches = experience.steps.some(s => s.stepType === 'decision_branch');
  const currentStep = experience.executionState?.currentStepId
    ? experience.steps.find(s => s.id === experience.executionState?.currentStepId)
    : undefined;

  const currentUserReadiness = currentUserId && experience.participantReadiness
    ? experience.participantReadiness[currentUserId]
    : undefined;

  return (
    <div
      onClick={() => onSelect(experience)}
      className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#1b1224] to-[#140b1c] hover:from-[#22162e] hover:to-[#180d22] border border-[#381e47]/60 hover:border-[#d94f6f]/50 transition-all cursor-pointer space-y-4 shadow-lg hover:shadow-[#d94f6f]/5 flex flex-col justify-between"
    >
      {/* Top Meta Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border flex items-center gap-1.5 shadow-xs ${typeConfig.classes}`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              <span>{typeConfig.label}</span>
            </span>

            <span
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border flex items-center gap-1.5 ${statusConfig.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              <span>{statusConfig.label}</span>
            </span>
          </div>

          {experience.estimatedDurationMinutes && (
            <div className="flex items-center gap-1 text-[11px] text-[#b59ebf] bg-[#251433]/70 px-2 py-0.5 rounded-md border border-[#3b1f4e]">
              <Clock className="w-3 h-3 text-[#d94f6f]" />
              <span>~{experience.estimatedDurationMinutes}m</span>
            </div>
          )}
        </div>

        {/* Title & Intent */}
        <div>
          <h3 className="text-base font-bold text-[#fae8d7] group-hover:text-rose-200 transition-colors tracking-tight">
            {experience.title}
          </h3>
          {experience.intent && (
            <p className="text-xs text-[#d4af37] italic mt-1 font-serif">
              &ldquo;{experience.intent}&rdquo;
            </p>
          )}
          <p className="text-xs text-[#b59ebf] line-clamp-2 mt-1.5 leading-relaxed">
            {experience.description}
          </p>
        </div>

        {/* In-progress Active Callout */}
        {experience.status === 'in_progress' && currentStep && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#1e1328] border border-emerald-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="truncate">
                <span className="text-[#a1a1aa] block text-[10px] uppercase font-bold tracking-wider">
                  Active Step
                </span>
                <span className="text-emerald-200 font-medium truncate block">
                  {currentStep.title}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-2">
              {experience.steps.findIndex(s => s.id === currentStep.id) + 1} / {experience.steps.length}
            </span>
          </div>
        )}

        {/* Contextual Roles & Participants */}
        {experience.participantRoles && Object.keys(experience.participantRoles).length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(experience.participantRoles).map(([uid, roleName]) => {
              const u = getUser(uid);
              const isReady = experience.participantReadiness?.[uid] === 'ready';
              return (
                <div
                  key={uid}
                  className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-lg bg-[#251433]/80 border border-[#3b1f4e] text-[#fae8d7]"
                >
                  <span className="text-[#b59ebf]">{u?.displayName || uid}:</span>
                  <span className="font-semibold text-rose-300">{roleName}</span>
                  {isReady ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Ready" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" title="Pending readiness" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-[#b59ebf]">
            <Users className="w-3.5 h-3.5 text-[#d94f6f]" />
            <span>
              {experience.participantIds.map(pid => getUser(pid)?.displayName || pid).join(', ')}
            </span>
          </div>
        )}

        {/* Step count & Architecture badges */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8c7896]">
          <span className="flex items-center gap-1">
            <span className="font-bold text-[#fae8d7]">{experience.steps.length}</span> steps
          </span>
          <span>•</span>
          {hasBranches ? (
            <span className="flex items-center gap-1 text-purple-300">
              <GitBranch className="w-3 h-3 text-purple-400" />
              <span>Adaptive Branching</span>
            </span>
          ) : (
            <span>Linear Journey</span>
          )}
          {experience.agreementIds && experience.agreementIds.length > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#d4af37]">
                <Shield className="w-3 h-3" />
                <span>Agreement Bound</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div
        className="pt-3 border-t border-[#2d1838] flex items-center justify-between gap-2"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onSelect(experience)}
          className="text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#251433]"
        >
          <span>View Flow</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {/* Readiness check toggle if applicable */}
          {currentUserId && experience.status === 'scheduled' && onToggleReadiness && (
            <button
              onClick={() => onToggleReadiness(experience.id, currentUserReadiness === 'ready' ? 'not_ready' : 'ready')}
              className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all border ${
                currentUserReadiness === 'ready'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-[#251433] text-[#fae8d7] border-[#381e47] hover:border-[#d94f6f]/50'
              }`}
            >
              {currentUserReadiness === 'ready' ? '✓ I am Ready' : 'Mark Ready'}
            </button>
          )}

          {/* Primary Action Button */}
          {experience.status === 'in_progress' ? (
            <button
              onClick={() => onResume(experience)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/40 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </button>
          ) : experience.status === 'ready' || experience.status === 'scheduled' ? (
            <button
              onClick={() => onStart(experience)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] hover:from-[#e25c7c] hover:to-[#8b4bf3] shadow-md shadow-[#d94f6f]/25 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Begin Experience</span>
            </button>
          ) : experience.status === 'completed' ? (
            <button
              onClick={() => onSelect(experience)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium text-purple-300 bg-purple-950/40 border border-purple-800/60 hover:bg-purple-900/40 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reflections</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
