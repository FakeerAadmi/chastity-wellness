'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Compass,
  Cloud,
  HelpCircle,
  MinusCircle,
  ShieldAlert,
  Lock,
  Eye,
  Users,
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { Desire, DesireRating, User } from '@/types/domain';

interface DesireCardProps {
  desire: Desire;
  currentUser: User;
  allUsers: User[];
  onRateDesire: (desireId: string, rating: DesireRating) => void;
  onProposeRequest?: (desire: Desire) => void;
  onDraftAgreement?: (desire: Desire) => void;
}

export const DesireCard: React.FC<DesireCardProps> = ({
  desire,
  currentUser,
  allUsers,
  onRateDesire,
  onProposeRequest,
  onDraftAgreement
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  const myResponse = desire.participantResponses[currentUser.id];
  const myRating = myResponse?.rating;

  // Determine mutual match
  const otherParticipantsResponses = Object.entries(desire.participantResponses)
    .filter(([userId]) => userId !== currentUser.id)
    .map(([userId, resp]) => ({
      user: allUsers.find(u => u.id === userId) || { id: userId, displayName: 'Partner' },
      response: resp
    }));

  const isPositiveRating = (r?: DesireRating) => r === 'eager' || r === 'curious' || r === 'exploring';

  const isMutualMatch =
    isPositiveRating(myRating) &&
    otherParticipantsResponses.some(p => isPositiveRating(p.response.rating));

  const partnerHasHardBoundary = otherParticipantsResponses.some(
    p => p.response.rating === 'hard_boundary'
  );

  const getRatingBadge = (rating?: DesireRating) => {
    switch (rating) {
      case 'eager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d94f6f]/20 text-[#d94f6f] border border-[#d94f6f]/40 text-[11px] font-semibold">
            <Flame className="w-3 h-3" />
            Eager
          </span>
        );
      case 'curious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            Curious
          </span>
        );
      case 'exploring':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/40 text-[11px] font-semibold">
            <Compass className="w-3 h-3" />
            Exploring
          </span>
        );
      case 'fantasy_only':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40 text-[11px] font-semibold">
            <Cloud className="w-3 h-3" />
            Fantasy Only
          </span>
        );
      case 'unsure':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#94a3b8]/20 text-[#94a3b8] border border-[#94a3b8]/40 text-[11px] font-semibold">
            <HelpCircle className="w-3 h-3" />
            Unsure
          </span>
        );
      case 'not_interested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#64748b]/20 text-[#94a3b8] border border-[#64748b]/40 text-[11px] font-semibold">
            <MinusCircle className="w-3 h-3" />
            Not Interested
          </span>
        );
      case 'hard_boundary':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 text-[11px] font-semibold">
            <ShieldAlert className="w-3 h-3" />
            Hard Boundary
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#251433] text-[#b59ebf] border border-[#381e47] text-[11px] font-semibold">
            Unrated
          </span>
        );
    }
  };

  const ratingOptions: { rating: DesireRating; label: string; icon: React.ElementType; color: string }[] = [
    { rating: 'eager', label: 'Eager about', icon: Flame, color: 'text-[#d94f6f] hover:bg-[#d94f6f]/20' },
    { rating: 'curious', label: 'Curious about', icon: Sparkles, color: 'text-[#eab308] hover:bg-[#eab308]/20' },
    { rating: 'exploring', label: 'Maybe / Exploring', icon: Compass, color: 'text-[#06b6d4] hover:bg-[#06b6d4]/20' },
    { rating: 'fantasy_only', label: 'Fantasy-only (no execution)', icon: Cloud, color: 'text-[#a855f7] hover:bg-[#a855f7]/20' },
    { rating: 'unsure', label: 'Unsure / Need context', icon: HelpCircle, color: 'text-[#94a3b8] hover:bg-[#94a3b8]/20' },
    { rating: 'not_interested', label: 'Not interested', icon: MinusCircle, color: 'text-[#64748b] hover:bg-[#64748b]/20' },
    { rating: 'hard_boundary', label: 'Hard boundary (inviolable)', icon: ShieldAlert, color: 'text-[#ef4444] hover:bg-[#ef4444]/20' },
  ];

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isMutualMatch
          ? 'bg-gradient-to-br from-[#1c1026] via-[#241233] to-[#2d123b] border-[#d94f6f]/60 shadow-lg shadow-[#d94f6f]/15'
          : myRating === 'hard_boundary' || partnerHasHardBoundary
          ? 'bg-[#180e1e] border-[#ef4444]/40'
          : 'bg-[#160d20] border-[#2f193d] hover:border-[#4d2863]'
      }`}
    >
      {/* Mutual Match Banner */}
      {isMutualMatch && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#d94f6f]/25 to-[#a855f7]/25 border border-[#d94f6f]/50 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#d94f6f] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-[#fae8d7] flex items-center gap-1.5">
                Mutual Desire Match
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#d94f6f]/40 font-semibold uppercase tracking-wider">
                  Aligned
                </span>
              </p>
              <p className="text-[11px] text-[#e8cce8]">
                You and your partner both expressed interest in exploring this.
              </p>
            </div>
          </div>
          {onProposeRequest && (
            <button
              onClick={() => onProposeRequest(desire)}
              className="px-3 py-1.5 rounded-lg bg-[#d94f6f] hover:bg-[#e05a7a] text-white text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 shadow-sm"
            >
              <Send className="w-3 h-3" />
              Propose Request
            </button>
          )}
        </div>
      )}

      {/* Header & Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category tag */}
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#251433] text-[#b59ebf] border border-[#381e47]">
              {desire.category.replace('_', ' ')}
            </span>

            {/* Sharing Mode */}
            {desire.sharingMode === 'mutual_match_only' && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1f142b] text-[#c084fc] border border-[#7e22ce]/30 flex items-center gap-1"
                title="Double-Blind: Partner cannot see your rating unless there is mutual interest"
              >
                <Lock className="w-2.5 h-2.5" />
                Double-Blind
              </span>
            )}
            {desire.sharingMode === 'shared_relationship' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1a1c2e] text-[#60a5fa] border border-[#2563eb]/30 flex items-center gap-1">
                <Users className="w-2.5 h-2.5" />
                Shared
              </span>
            )}
            {desire.sharingMode === 'private' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1f1622] text-[#f472b6] border border-[#db2777]/30 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                Private
              </span>
            )}

            {/* Current user rating */}
            {getRatingBadge(myRating)}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#fae8d7] leading-snug">
            {desire.title}
          </h3>
        </div>

        {/* Action Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowRatingMenu(!showRatingMenu)}
            className="px-3 py-1.5 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] border border-[#4a2c59] text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>{myRating ? 'Update Rating' : 'Rate Desire'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Rating Dropdown Menu */}
          {showRatingMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[#1c1026] border border-[#4a2c59] shadow-2xl z-30 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf] px-2 py-1">
                Your sovereign rating
              </p>
              {ratingOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = myRating === opt.rating;
                return (
                  <button
                    key={opt.rating}
                    onClick={() => {
                      onRateDesire(desire.id, opt.rating);
                      setShowRatingMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      opt.color
                    } ${isSelected ? 'bg-[#251433] font-bold' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#d94f6f]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-2.5 text-xs sm:text-sm text-[#d4c3d9] leading-relaxed">
        {desire.description}
      </p>

      {/* Adult Expression Tags */}
      {desire.tags && desire.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {desire.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#1f1129] text-[#e0cce0] border border-[#3b1f4c]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Double Blind Status Note */}
      {desire.sharingMode === 'mutual_match_only' && !isMutualMatch && (
        <div className="mt-4 pt-3 border-t border-[#2a1738] flex items-center justify-between text-[11px] text-[#b59ebf]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#a855f7]" />
            {myRating
              ? 'Your rating is recorded. Partner ratings remain confidential until mutual interest occurs.'
              : 'Double-blind matching: rate this desire to see if there is mutual curiosity.'}
          </span>
        </div>
      )}

      {/* Shared Relationship Transparency Details */}
      {desire.sharingMode === 'shared_relationship' && otherParticipantsResponses.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#2a1738] space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf]">
            Participant Responses
          </p>
          <div className="flex flex-wrap gap-2">
            {otherParticipantsResponses.map(p => (
              <div
                key={p.user.id}
                className="px-2.5 py-1 rounded-lg bg-[#251433] border border-[#381e47] text-xs flex items-center gap-1.5"
              >
                <span className="text-[#fae8d7] font-semibold">{p.user.displayName}:</span>
                {getRatingBadge(p.response.rating)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graduation to Dynamic / Agreement */}
      {(desire.graduatedToDynamicId || desire.graduatedToAgreementId) && (
        <div className="mt-4 pt-3 border-t border-[#2a1738] flex items-center gap-2 text-xs text-[#48bb78]">
          <Check className="w-3.5 h-3.5" />
          <span>Active in practice: linked to established Agreement / Dynamic</span>
        </div>
      )}
    </div>
  );
};
