'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Compass,
  Layers,
  Search,
  Plus,
  Lock,
  Users,
  Shield,
  Heart,
  Key,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  Desire,
  DesireCategory,
  DesireRating,
  DesireSharingMode,
  User,
  Relationship,
  Dynamic,
  HavenRequest
} from '@/types/domain';
import {
  INITIAL_DESIRES,
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  ALL_USERS,
  CURRENT_USER
} from '@/data/domainDemoData';
import { DesireCard } from '../desires/DesireCard';
import { DesireDiscoveryDeck } from '../desires/DesireDiscoveryDeck';
import { DesireCreationModal } from '../desires/DesireCreationModal';
import { RequestCreationModal } from '../requests/RequestCreationModal';

interface DesiresTabProps {
  onNavigateTab?: (tab: string) => void;
  onOpenEmergency?: () => void;
}

export const DesiresTab: React.FC<DesiresTabProps> = ({
  onNavigateTab,
  onOpenEmergency,
}) => {
  const [desires, setDesires] = useState<Desire[]>(INITIAL_DESIRES);
  const [viewMode, setViewMode] = useState<'deck' | 'matches' | 'catalog'>('deck');
  const [selectedCategory, setSelectedCategory] = useState<DesireCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [targetDesireForRequest, setTargetDesireForRequest] = useState<Desire | null>(null);

  const currentUser = CURRENT_USER;
  const allUsers = ALL_USERS;
  const relationships = INITIAL_RELATIONSHIPS;
  const dynamics = INITIAL_DYNAMICS;

  // Rate a desire
  const handleRateDesire = (desireId: string, rating: DesireRating) => {
    setDesires(prev =>
      prev.map(d => {
        if (d.id !== desireId) return d;
        return {
          ...d,
          participantResponses: {
            ...d.participantResponses,
            [currentUser.id]: {
              userId: currentUser.id,
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

  const handleProposeRequestFromDesire = (desire: Desire) => {
    setTargetDesireForRequest(desire);
    setIsRequestModalOpen(true);
  };

  // Helper: check mutual positive match
  const isPositive = (r?: DesireRating) => r === 'eager' || r === 'curious' || r === 'exploring';

  const isMutualMatch = (desire: Desire) => {
    const myRating = desire.participantResponses[currentUser.id]?.rating;
    if (!isPositive(myRating)) return false;

    const otherRatings = Object.entries(desire.participantResponses)
      .filter(([uid]) => uid !== currentUser.id)
      .map(([, resp]) => resp.rating);

    return otherRatings.some(r => isPositive(r));
  };

  const mutualMatches = desires.filter(isMutualMatch);

  // Filtered catalog
  const filteredDesires = desires.filter(d => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const categories: { key: DesireCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'intimacy_sensual', label: 'Sensual Intimacy' },
    { key: 'bdsm_power', label: 'BDSM & Power Exchange' },
    { key: 'chastity_control', label: 'Chastity & Orgasm Control' },
    { key: 'non_monogamy', label: 'Non-Monogamy / Cuckoldry' },
    { key: 'roleplay_fantasy', label: 'Roleplay & Personas' },
    { key: 'service_protocol', label: 'Service & Protocol' },
    { key: 'daily_living', label: 'Romance & Living' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intimacy & Mutual Discovery</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
            Desires & Discovery Decks
          </h1>
          <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl">
            Privately explore adult kinks, fantasies, and boundaries. Double-blind matching surfaces mutual curiosities without emotional vulnerability.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsCreationModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Desire</span>
        </button>
      </div>

      {/* Mode Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#1c1026] border border-[#2f193d] w-fit">
        <button
          onClick={() => setViewMode('deck')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'deck'
              ? 'bg-[#d94f6f] text-white shadow-sm'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discovery Deck</span>
        </button>

        <button
          onClick={() => setViewMode('matches')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'matches'
              ? 'bg-[#d94f6f] text-white shadow-sm'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#eab308]" />
          <span>Mutual Matches</span>
          {mutualMatches.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#fae8d7]/20 text-[10px]">
              {mutualMatches.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setViewMode('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'catalog'
              ? 'bg-[#d94f6f] text-white shadow-sm'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Desires ({desires.length})</span>
        </button>
      </div>

      {/* VIEW 1: Discovery Deck */}
      {viewMode === 'deck' && (
        <div className="space-y-6">
          <DesireDiscoveryDeck
            desires={filteredDesires}
            currentUser={currentUser}
            allUsers={allUsers}
            onRateDesire={handleRateDesire}
            onProposeRequest={handleProposeRequestFromDesire}
          />
        </div>
      )}

      {/* VIEW 2: Mutual Matches */}
      {viewMode === 'matches' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#d94f6f]/20 via-[#a855f7]/15 to-[#1c1026] border border-[#d94f6f]/40 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#fae8d7] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d94f6f]" />
                Something You Both Want to Explore
              </h2>
              <p className="text-xs text-[#d4c3d9]">
                These desires received positive ratings from both you and your partner. You can propose a scene or draft an agreement.
              </p>
            </div>
          </div>

          {mutualMatches.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#160d20] border border-[#2f193d] space-y-2">
              <Compass className="w-8 h-8 text-[#b59ebf] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[#fae8d7]">No Mutual Matches Yet</h3>
              <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
                Continue rating cards in the Discovery Deck. When both you and your partner mark a desire as eager or curious, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mutualMatches.map(desire => (
                <DesireCard
                  key={desire.id}
                  desire={desire}
                  currentUser={currentUser}
                  allUsers={allUsers}
                  onRateDesire={handleRateDesire}
                  onProposeRequest={handleProposeRequestFromDesire}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Full Catalog / Grid */}
      {viewMode === 'catalog' && (
        <div className="space-y-6">
          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#b59ebf] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search desires, fantasies, tags..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#160d20] border border-[#2f193d] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-[#b59ebf] shrink-0" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as DesireCategory | 'all')}
                className="px-3 py-2 rounded-xl bg-[#160d20] border border-[#2f193d] text-xs text-[#fae8d7] focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDesires.map(desire => (
              <DesireCard
                key={desire.id}
                desire={desire}
                currentUser={currentUser}
                allUsers={allUsers}
                onRateDesire={handleRateDesire}
                onProposeRequest={handleProposeRequestFromDesire}
              />
            ))}
          </div>
        </div>
      )}

      {/* Creation Modal */}
      <DesireCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        currentUser={currentUser}
        relationships={relationships}
        onCreateDesire={handleCreateDesire}
      />

      {/* Request Modal triggered from Desire */}
      {targetDesireForRequest && (
        <RequestCreationModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setTargetDesireForRequest(null);
          }}
          currentUser={currentUser}
          allUsers={allUsers}
          relationships={relationships}
          dynamics={dynamics}
          initialTitle={`Proposal: ${targetDesireForRequest.title}`}
          initialDynamicId={targetDesireForRequest.dynamicId}
          initialMode="proposal"
          onCreateRequest={() => {
            setIsRequestModalOpen(false);
            setTargetDesireForRequest(null);
            if (onNavigateTab) onNavigateTab('requests');
          }}
        />
      )}
    </div>
  );
};
