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
  ChevronLeft,
  ChevronRight,
  Lock,
  Send,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Desire, DesireRating, User } from '@/types/domain';

interface DesireDiscoveryDeckProps {
  desires: Desire[];
  currentUser: User;
  allUsers: User[];
  onRateDesire: (desireId: string, rating: DesireRating) => void;
  onProposeRequest?: (desire: Desire) => void;
}

export const DesireDiscoveryDeck: React.FC<DesireDiscoveryDeckProps> = ({
  desires,
  currentUser,
  allUsers,
  onRateDesire,
  onProposeRequest,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [justMatched, setJustMatched] = useState(false);

  if (desires.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-[#160d20] border border-[#2f193d] space-y-3">
        <Sparkles className="w-8 h-8 text-[#d94f6f] mx-auto opacity-60" />
        <h3 className="text-lg font-bold text-[#fae8d7]">Discovery Deck Empty</h3>
        <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
          All currently available desires in this category have been reviewed or matched.
        </p>
      </div>
    );
  }

  const currentDesire = desires[currentIndex];
  const myResponse = currentDesire?.participantResponses[currentUser.id];
  const myRating = myResponse?.rating;

  // Check if partner also has positive response
  const otherParticipantsResponses = currentDesire
    ? Object.entries(currentDesire.participantResponses)
        .filter(([userId]) => userId !== currentUser.id)
        .map(([userId, resp]) => ({
          user: allUsers.find(u => u.id === userId) || { id: userId, displayName: 'Partner' },
          response: resp,
        }))
    : [];

  const isPositiveRating = (r?: DesireRating) => r === 'eager' || r === 'curious' || r === 'exploring';

  const isMutualMatch =
    isPositiveRating(myRating) &&
    otherParticipantsResponses.some(p => isPositiveRating(p.response.rating));

  const handleRate = (rating: DesireRating) => {
    onRateDesire(currentDesire.id, rating);

    // If this rating completes a mutual match, briefly celebrate
    if (isPositiveRating(rating) && otherParticipantsResponses.some(p => isPositiveRating(p.response.rating))) {
      setJustMatched(true);
      setTimeout(() => setJustMatched(false), 4000);
    } else {
      // Advance to next card smoothly
      if (currentIndex < desires.length - 1) {
        setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < desires.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setJustMatched(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setJustMatched(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Deck Progress Bar */}
      <div className="flex items-center justify-between text-xs text-[#b59ebf] px-1">
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Confidential Discovery Deck
        </span>
        <div className="flex items-center gap-2">
          <span>
            Card <strong className="text-[#fae8d7]">{currentIndex + 1}</strong> of {desires.length}
          </span>
          <div className="w-24 h-1.5 rounded-full bg-[#251433] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / desires.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#1c1026] via-[#170e20] to-[#120a1a] border border-[#3b1f4c] shadow-2xl space-y-6 min-h-[380px] flex flex-col justify-between">
        {/* Double-Blind Confidential Watermark / Header */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59]">
                {currentDesire.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1c1026] text-[#b59ebf] border border-[#2f193d] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#a855f7]" />
                Double-Blind Protected
              </span>
            </div>
            {myRating && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#251433] text-[#fae8d7] border border-[#381e47]">
                Rated: <strong className="capitalize text-[#d94f6f]">{myRating.replace('_', ' ')}</strong>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#fae8d7] tracking-tight leading-snug">
            {currentDesire.title}
          </h2>

          <p className="mt-3 text-sm text-[#d4c3d9] leading-relaxed">
            {currentDesire.description}
          </p>

          {/* Adult Tags */}
          {currentDesire.tags && currentDesire.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {currentDesire.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#251433]/80 text-[#fae8d7] border border-[#381e47]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mutual Match Instant Toast */}
        {(justMatched || isMutualMatch) && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#d94f6f]/30 to-[#a855f7]/30 border border-[#d94f6f]/60 shadow-lg animate-pulse flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#d94f6f] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#fae8d7]">
                  ✨ Instant Mutual Match!
                </p>
                <p className="text-[11px] text-[#e8cce8]">
                  Both you and your partner marked this with curiosity/eagerness.
                </p>
              </div>
            </div>
            {onProposeRequest && (
              <button
                onClick={() => onProposeRequest(currentDesire)}
                className="px-3 py-1.5 rounded-xl bg-[#d94f6f] hover:bg-[#e05a7a] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Propose Request
              </button>
            )}
          </div>
        )}

        {/* Confidential Sovereign Rating Action Matrix */}
        <div className="space-y-2 pt-4 border-t border-[#2a1738]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf] text-center">
            Rate confidentially (never revealed unless mutual)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleRate('eager')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                myRating === 'eager'
                  ? 'bg-[#d94f6f] text-white shadow-md shadow-[#d94f6f]/30'
                  : 'bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] border border-[#4a2c59]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#d94f6f] group-hover:scale-110" />
              <span>Eager to Do</span>
            </button>

            <button
              onClick={() => handleRate('curious')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                myRating === 'curious'
                  ? 'bg-[#eab308] text-black shadow-md shadow-[#eab308]/30'
                  : 'bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] border border-[#4a2c59]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#eab308]" />
              <span>Curious</span>
            </button>

            <button
              onClick={() => handleRate('exploring')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                myRating === 'exploring'
                  ? 'bg-[#06b6d4] text-black shadow-md shadow-[#06b6d4]/30'
                  : 'bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] border border-[#4a2c59]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#06b6d4]" />
              <span>Maybe / Discuss</span>
            </button>

            <button
              onClick={() => handleRate('fantasy_only')}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                myRating === 'fantasy_only'
                  ? 'bg-[#a855f7] text-white shadow-md shadow-[#a855f7]/30'
                  : 'bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] border border-[#4a2c59]'
              }`}
            >
              <Cloud className="w-4 h-4 text-[#a855f7]" />
              <span>Fantasy Only</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleRate('unsure')}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                myRating === 'unsure'
                  ? 'bg-[#64748b] text-white'
                  : 'bg-[#1c1026] hover:bg-[#251433] text-[#b59ebf] border border-[#2f193d]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unsure</span>
            </button>

            <button
              onClick={() => handleRate('not_interested')}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                myRating === 'not_interested'
                  ? 'bg-[#475569] text-white'
                  : 'bg-[#1c1026] hover:bg-[#251433] text-[#94a3b8] border border-[#2f193d]'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>Not for Me</span>
            </button>

            <button
              onClick={() => handleRate('hard_boundary')}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                myRating === 'hard_boundary'
                  ? 'bg-[#ef4444] text-white'
                  : 'bg-[#1c1026] hover:bg-[#251433] text-[#ef4444] border border-[#ef4444]/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Hard Boundary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed text-[#64748b]'
              : 'bg-[#1c1026] hover:bg-[#251433] text-[#fae8d7] border border-[#381e47]'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-[11px] text-[#b59ebf] italic">
          Use buttons to rate or advance
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === desires.length - 1}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            currentIndex === desires.length - 1
              ? 'opacity-40 cursor-not-allowed text-[#64748b]'
              : 'bg-[#1c1026] hover:bg-[#251433] text-[#fae8d7] border border-[#381e47]'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
