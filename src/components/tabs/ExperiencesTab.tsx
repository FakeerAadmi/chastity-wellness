'use client';

import React, { useState } from 'react';
import {
  Experience,
  Relationship,
  Dynamic,
  Agreement,
  User
} from '@/types/domain';
import {
  Sparkles,
  Plus,
  Play,
  Shield,
  Compass
} from 'lucide-react';
import { ExperienceCard } from '../experiences/ExperienceCard';
import { ExperienceDetailModal } from '../experiences/ExperienceDetailModal';
import { ExperienceExecutionModal } from '../experiences/ExperienceExecutionModal';
import { ExperienceBuilderModal } from '../experiences/ExperienceBuilderModal';

interface ExperiencesTabProps {
  experiences: Experience[];
  relationships: Relationship[];
  dynamics: Dynamic[];
  agreements: Agreement[];
  users: User[];
  currentUserId: string;
  onUpdateExperience: (updated: Experience) => void;
  onCreateExperience: (created: Experience) => void;
  onOpenEmergency?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ExperiencesTab: React.FC<ExperiencesTabProps> = ({
  experiences,
  relationships,
  dynamics,
  agreements,
  users,
  currentUserId,
  onUpdateExperience,
  onCreateExperience,
  onOpenEmergency,
  onNavigateTab
}) => {
  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'active_ready' | 'scheduled' | 'completed' | 'templates'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedDynamicFilter, setSelectedDynamicFilter] = useState<string>('all');

  // Modals
  const [selectedExperienceForDetail, setSelectedExperienceForDetail] = useState<Experience | null>(null);
  const [selectedExperienceForExecution, setSelectedExperienceForExecution] = useState<Experience | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);

  // Toggle user readiness
  const handleToggleReadiness = (experienceId: string, nextStatus: 'ready' | 'not_ready') => {
    const exp = experiences.find(e => e.id === experienceId);
    if (!exp) return;

    const currentReadiness = { ...(exp.participantReadiness || {}) };
    currentReadiness[currentUserId] = nextStatus;

    // Check if all participants are ready
    const allNowReady = exp.participantIds.every(pid => currentReadiness[pid] === 'ready');

    const updated: Experience = {
      ...exp,
      status: allNowReady ? 'ready' : 'scheduled',
      participantReadiness: currentReadiness,
      updatedAt: new Date().toISOString()
    };
    onUpdateExperience(updated);
  };

  // Filter computation
  const filteredExperiences = experiences.filter(exp => {
    // Status filter
    if (statusFilter === 'active_ready') {
      if (exp.status !== 'in_progress' && exp.status !== 'ready' && exp.status !== 'paused') return false;
    } else if (statusFilter === 'scheduled') {
      if (exp.status !== 'scheduled') return false;
    } else if (statusFilter === 'completed') {
      if (exp.status !== 'completed' && exp.status !== 'safeword_stopped') return false;
    } else if (statusFilter === 'templates') {
      if (!exp.isTemplate) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && exp.experienceType !== typeFilter) {
      return false;
    }

    // Dynamic filter
    if (selectedDynamicFilter !== 'all' && exp.dynamicId !== selectedDynamicFilter) {
      return false;
    }

    return true;
  });

  // Active / Spotlight experience
  const activeSpotlight = experiences.find(
    e => e.status === 'in_progress' || e.status === 'paused'
  ) || experiences.find(e => e.status === 'ready');

  return (
    <div className="space-y-8">
      {/* Tab Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#241334] via-[#1a0d26] to-[#12081a] border border-[#3b1f4e] shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#d94f6f]/20 text-[#d94f6f] border border-[#d94f6f]/40 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                The Experience Layer
              </span>
              <span className="text-xs text-[#b59ebf] flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#d4af37]" />
                Universal Unconditional Pause Protected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#fae8d7]">
              Experiences & Guided Practices
            </h1>
            <p className="text-sm text-[#c7b5cd] leading-relaxed">
              Curated adult journeys bridging desires, agreements, and intimate execution. 
              Step-by-step anticipation, adaptive branching, tactile instructions, and non-negotiable aftercare.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] hover:from-[#e25c7c] hover:to-[#8b4bf3] shadow-lg shadow-[#d94f6f]/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Design Experience</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d94f6f]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* Happening Now / Hero Spotlight if active */}
      {activeSpotlight && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#1e1328] to-[#160a20] border border-emerald-800/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {activeSpotlight.status === 'in_progress' ? 'Happening Right Now' : 'Ready for Immersion'}
              </span>
              <span className="text-xs text-[#b59ebf]">•</span>
              <span className="text-xs text-rose-200 font-medium">{activeSpotlight.title}</span>
            </div>
            {activeSpotlight.intent && (
              <p className="text-xs text-[#d4af37] italic font-serif">
                &ldquo;{activeSpotlight.intent}&rdquo;
              </p>
            )}
            <p className="text-xs text-[#b59ebf] max-w-xl">
              {activeSpotlight.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSelectedExperienceForDetail(activeSpotlight)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] bg-[#251433] border border-[#381e47] transition-colors"
            >
              View Roadmap
            </button>

            <button
              onClick={() => setSelectedExperienceForExecution(activeSpotlight)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/40 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{activeSpotlight.status === 'in_progress' ? 'Resume Live Journey' : 'Enter Experience'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Navigation Bar */}
      <div className="space-y-4">
        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All Journeys (${experiences.length})` },
            {
              id: 'active_ready',
              label: `Active / Ready (${
                experiences.filter(e => e.status === 'in_progress' || e.status === 'ready' || e.status === 'paused').length
              })`
            },
            {
              id: 'scheduled',
              label: `Scheduled (${experiences.filter(e => e.status === 'scheduled').length})`
            },
            {
              id: 'completed',
              label: `Completed (${
                experiences.filter(e => e.status === 'completed' || e.status === 'safeword_stopped').length
              })`
            },
            {
              id: 'templates',
              label: `Templates (${experiences.filter(e => e.isTemplate).length})`
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as 'all' | 'active_ready' | 'scheduled' | 'completed' | 'templates')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-inner'
                  : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#1c1026] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic & Category Sub-filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#251433] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#8c7896] text-[11px] font-semibold uppercase tracking-wider">
              Dynamic:
            </span>
            <select
              value={selectedDynamicFilter}
              onChange={e => setSelectedDynamicFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#1c1026] border border-[#381e47] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
            >
              <option value="all">All Dynamics</option>
              {dynamics.map(dyn => (
                <option key={dyn.id} value={dyn.id}>
                  {dyn.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8c7896] text-[11px] font-semibold uppercase tracking-wider">
              Type:
            </span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#1c1026] border border-[#381e47] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
            >
              <option value="all">All Types</option>
              <option value="sensory">Sensory Immersion</option>
              <option value="bdsm_scene">BDSM / Power Exchange</option>
              <option value="chastity_tease">Chastity & Orgasm Control</option>
              <option value="cuckold_fantasy">Hotwife / Cuckold</option>
              <option value="erotic_ritual">Erotic Devotion & Ritual</option>
              <option value="long_distance">Long-Distance</option>
              <option value="reconnection">Reconnection</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experience Cards Grid */}
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExperiences.map(exp => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              users={users}
              currentUserId={currentUserId}
              onSelect={setSelectedExperienceForDetail}
              onStart={setSelectedExperienceForExecution}
              onResume={setSelectedExperienceForExecution}
              onToggleReadiness={handleToggleReadiness}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#140b1c] border border-[#2d1838] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#251433] border border-[#381e47] flex items-center justify-center mx-auto text-[#b59ebf]">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#fae8d7]">
            No Experiences match your current filter
          </h3>
          <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
            Try adjusting your filter criteria or design a new custom experience for your dynamic.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setSelectedDynamicFilter('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-[#251433] border border-[#381e47] hover:bg-[#341b46] transition-colors"
            >
              Clear Filters
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('dynamics')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b59ebf] bg-[#1c1026] border border-[#381e47] hover:text-[#fae8d7] transition-colors"
              >
                Browse Dynamics
              </button>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedExperienceForDetail && (
        <ExperienceDetailModal
          isOpen={Boolean(selectedExperienceForDetail)}
          onClose={() => setSelectedExperienceForDetail(null)}
          experience={selectedExperienceForDetail}
          users={users}
          dynamics={dynamics}
          agreements={agreements}
          currentUserId={currentUserId}
          onStart={exp => {
            setSelectedExperienceForDetail(null);
            setSelectedExperienceForExecution(exp);
          }}
          onResume={exp => {
            setSelectedExperienceForDetail(null);
            setSelectedExperienceForExecution(exp);
          }}
          onToggleReadiness={handleToggleReadiness}
        />
      )}

      {/* Execution Modal */}
      {selectedExperienceForExecution && (
        <ExperienceExecutionModal
          isOpen={Boolean(selectedExperienceForExecution)}
          onClose={() => setSelectedExperienceForExecution(null)}
          experience={selectedExperienceForExecution}
          users={users}
          currentUserId={currentUserId}
          onUpdateExperience={onUpdateExperience}
          onOpenEmergency={onOpenEmergency}
        />
      )}

      {/* Builder Modal */}
      {isBuilderOpen && (
        <ExperienceBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          relationships={relationships}
          dynamics={dynamics}
          users={users}
          currentUserId={currentUserId}
          onSave={onCreateExperience}
        />
      )}
    </div>
  );
};
