'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Dices,
  Lock,
  MessageSquare,
  Shield,
  HelpCircle,
  EyeOff,
  Flame,
  Coffee,
  Check
} from 'lucide-react';
import { DAILY_INTIMATE_PROMPTS, FOREPLAY_CHALLENGES } from '@/data/inclusiveOptions';
import { LegacyPermissionRequest } from '@/types';

export const CouplesDynamicsTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'blind_match' | 'permissions' | 'sparks'>('blind_match');

  // Double-Blind Matcher state (Spicer/Kindu inspired)
  const blindQuestions = [
    { id: 'q1', text: 'Sensual massage where only keyholder is allowed to touch' },
    { id: 'q2', text: 'Blindfolded urge surrender while partner whispers praise' },
    { id: 'q3', text: 'Scheduled overnight lockup after a relaxing warm bath' },
    { id: 'q4', text: 'Morning coffee check-in with physical comfort rating' },
    { id: 'q5', text: 'Keyholder assigning a discreet daytime mindfulness task' },
    { id: 'q6', text: 'Tease & denial session where release is delayed 24 hours' },
    { id: 'q7', text: 'Structured 20-minute post-unlock cuddle aftercare' },
    { id: 'q8', text: 'Writing an intimate gratitude letter before receiving key' }
  ];

  const [wearerAnswers, setWearerAnswers] = useState<Record<string, 'yes' | 'maybe' | 'no'>>({
    q1: 'yes',
    q2: 'yes',
    q3: 'maybe',
    q4: 'yes',
    q5: 'maybe',
    q6: 'yes',
    q7: 'yes',
    q8: 'yes'
  });

  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, 'yes' | 'maybe' | 'no'>>({
    q1: 'yes',
    q2: 'yes',
    q3: 'no',
    q4: 'yes',
    q5: 'yes',
    q6: 'maybe',
    q7: 'yes',
    q8: 'no'
  });

  const [isMatchesRevealed, setIsMatchesRevealed] = useState<boolean>(true);

  // Keyholder Permission Desk state (Kneel/Chaster inspired)
  const [requests, setRequests] = useState<LegacyPermissionRequest[]>([
    {
      id: 'req-1',
      from: 'Wearer (Alex)',
      type: 'shower_clean',
      typeLabel: 'Hygiene Shower & Wash Window',
      note: 'Need 45 minutes for thorough antibacterial washing and skin drying.',
      durationMinutes: 45,
      status: 'approved',
      timestamp: 'Today, 8:15 AM'
    },
    {
      id: 'req-2',
      from: 'Wearer (Alex)',
      type: 'edging_session',
      typeLabel: 'Sensual Teasing & Edging Session',
      note: 'Requesting a supervised 15-minute tease session this evening without release.',
      durationMinutes: 15,
      status: 'pending',
      timestamp: 'Today, 2:30 PM'
    }
  ]);

  const [reqType, setReqType] = useState<LegacyPermissionRequest['type']>('shower_clean');
  const [reqNote, setReqNote] = useState('');
  const [reqDuration, setReqDuration] = useState(45);
  const [reqSubmitted, setReqSubmitted] = useState(false);

  // Sparks & Foreplay deck
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(FOREPLAY_CHALLENGES[0]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabels: Record<string, string> = {
      shower_clean: 'Hygiene Shower & Skin Wash',
      sports_release: 'Sports / Gym Physical Release',
      edging_session: 'Supervised Tease & Edging',
      comfort_adjustment: 'Comfort / Spacer Pin Adjustment',
      early_release: 'Scheduled Early Release Request'
    };

    const newReq: LegacyPermissionRequest = {
      id: `req-${Date.now()}`,
      from: 'Wearer (You)',
      type: reqType,
      typeLabel: typeLabels[reqType] || 'General Request',
      note: reqNote.trim() || 'No additional note provided.',
      durationMinutes: reqDuration,
      status: 'pending',
      timestamp: 'Just now'
    };

    setRequests([newReq, ...requests]);
    setReqNote('');
    setReqSubmitted(true);
    setTimeout(() => setReqSubmitted(false), 2000);
  };

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'declined') => {
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const calculateMatches = () => {
    return blindQuestions.filter(q => {
      const w = wearerAnswers[q.id];
      const p = partnerAnswers[q.id];
      return (w === 'yes' || w === 'maybe') && (p === 'yes' || p === 'maybe');
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Couples NSFW Dynamics</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Couples Connection & Dynamic Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Explore mutual desires safely, submit keyholder permission requests, and deepen emotional resonance with daily sparks.
        </p>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#1c1026] border border-[#381e47] rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('blind_match')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'blind_match'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Double-Blind Matcher</span>
        </button>

        <button
          onClick={() => setSubTab('permissions')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'permissions'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Permission Desk</span>
        </button>

        <button
          onClick={() => setSubTab('sparks')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subTab === 'sparks'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Sparks & Foreplay</span>
        </button>
      </div>

      {/* SUB-TAB 1: DOUBLE BLIND MATCHER (Inspired by Spicer/Kindu) */}
      {subTab === 'blind_match' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#fae8d7] flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-[#d94f6f]" />
                  <span>The "Zero-Rejection" Double Blind Matcher</span>
                </h2>
                <p className="text-xs text-[#b59ebf]">
                  Answer freely! The app <strong>only reveals</strong> desires where both you and your partner answered Yes or Maybe. If one of you answers No, it remains confidential forever.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#251433] text-emerald-400 border border-emerald-800/80">
                {calculateMatches().length} Mutual Matches
              </span>
            </div>

            {/* Revealed Mutual Matches */}
            {isMatchesRevealed && (
              <div className="p-5 rounded-2xl bg-[#0f0714] border border-emerald-900/60 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Your Discovered Mutual Desires:
                </span>

                <div className="space-y-2">
                  {calculateMatches().map(m => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#1c1026] border border-[#381e47] flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#fae8d7]">{m.text}</span>
                      <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                        Mutual Yes ✨
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Card Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider block">
                Your Individual Responses:
              </span>

              <div className="space-y-2">
                {blindQuestions.map(q => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-[#0f0714] border border-[#381e47] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-[#fae8d7]">{q.text}</span>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setWearerAnswers({ ...wearerAnswers, [q.id]: 'yes' })}
                        className={`px-3 py-1 rounded-xl font-bold transition-all ${
                          wearerAnswers[q.id] === 'yes'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47]'
                        }`}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => setWearerAnswers({ ...wearerAnswers, [q.id]: 'maybe' })}
                        className={`px-3 py-1 rounded-xl font-bold transition-all ${
                          wearerAnswers[q.id] === 'maybe'
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47]'
                        }`}
                      >
                        Maybe
                      </button>

                      <button
                        type="button"
                        onClick={() => setWearerAnswers({ ...wearerAnswers, [q.id]: 'no' })}
                        className={`px-3 py-1 rounded-xl font-bold transition-all ${
                          wearerAnswers[q.id] === 'no'
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KEYHOLDER PERMISSION DESK (Inspired by Kneel/Chaster) */}
      {subTab === 'permissions' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Submit Request Form (5 cols) */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4 text-xs">
            <div className="border-b border-[#251433] pb-2">
              <h2 className="font-bold text-sm text-[#fae8d7]">Submit Formal Request</h2>
              <p className="text-[11px] text-[#b59ebf]">Ask keyholder for temporary release or check-in</p>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="font-bold text-[#fae8d7] block mb-1">Request Category</label>
                <select
                  value={reqType}
                  onChange={e => setReqType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                >
                  <option value="shower_clean">Hygiene Shower (Mandatory)</option>
                  <option value="sports_release">Sports / Gym Exercise</option>
                  <option value="edging_session">Supervised Tease & Edging</option>
                  <option value="comfort_adjustment">Comfort / Spacer Adjustment</option>
                  <option value="early_release">Early Release Request</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#fae8d7]">Requested Duration</label>
                  <span className="font-mono text-[#d94f6f] font-bold">{reqDuration} min</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={reqDuration}
                  onChange={e => setReqDuration(parseInt(e.target.value))}
                  className="w-full accent-[#d94f6f]"
                />
              </div>

              <div>
                <label className="font-bold text-[#fae8d7] block mb-1">Personal Note / Context</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this request is needed or share your state..."
                  value={reqNote}
                  onChange={e => setReqNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white font-bold flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01]"
              >
                {reqSubmitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Request Submitted!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit to Keyholder</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Permission Desk (7 cols) */}
          <div className="md:col-span-7 p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-2">
              <h2 className="font-bold text-sm text-[#fae8d7] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#d94f6f]" />
                <span>Permission Decision Desk ({requests.length})</span>
              </h2>
              <span className="text-[10px] text-[#b59ebf]">Logged Requests</span>
            </div>

            <div className="space-y-3">
              {requests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#fae8d7]">{req.typeLabel}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        req.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : req.status === 'declined'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-[#b59ebf] leading-relaxed">{req.note}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1c1026] text-[11px] text-[#b59ebf]">
                    <span>Duration: {req.durationMinutes} min &bull; {req.timestamp}</span>

                    {req.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'declined')}
                          className="px-2.5 py-1 rounded-lg bg-[#251433] hover:bg-rose-900/60 text-rose-300 border border-rose-900/40 font-bold text-[10px]"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DAILY SPARKS & FOREPLAY (Inspired by Paired/Coral) */}
      {subTab === 'sparks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Intimate Spark Card */}
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-2">
              <span className="text-[10px] uppercase font-bold text-[#d94f6f] flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                Intimacy Question of the Day
              </span>
              <button
                onClick={() => setCurrentPromptIdx((currentPromptIdx + 1) % DAILY_INTIMATE_PROMPTS.length)}
                className="text-xs text-[#b59ebf] hover:text-[#fae8d7] underline"
              >
                Next Spark
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-2">
              <span className="text-[11px] font-bold text-[#d94f6f] block">
                {DAILY_INTIMATE_PROMPTS[currentPromptIdx].topic}
              </span>
              <p className="text-sm font-semibold text-[#fae8d7] leading-relaxed">
                "{DAILY_INTIMATE_PROMPTS[currentPromptIdx].prompt}"
              </p>
            </div>

            <p className="text-xs text-[#b59ebf] leading-relaxed">
              Take turns sharing your answers over evening tea or while relaxing together. Listen without judgment or rush.
            </p>
          </div>

          {/* Foreplay Dice & Tasks Deck */}
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <div className="flex items-center justify-between border-b border-[#251433] pb-2">
              <span className="text-[10px] uppercase font-bold text-[#d94f6f] flex items-center gap-1">
                <Dices className="w-3.5 h-3.5" />
                Sensual Foreplay Deck
              </span>
              <button
                onClick={() => {
                  const random = FOREPLAY_CHALLENGES[Math.floor(Math.random() * FOREPLAY_CHALLENGES.length)];
                  setCurrentChallenge(random);
                }}
                className="text-xs text-[#b59ebf] hover:text-[#fae8d7] underline"
              >
                Draw Card
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#251433] border border-[#d94f6f]/40 space-y-2">
              <span className="text-xs font-bold text-[#fae8d7] block">
                {currentChallenge.title}
              </span>
              <p className="text-xs text-[#b59ebf] leading-relaxed">
                {currentChallenge.instruction}
              </p>
            </div>

            <button
              onClick={() => {
                const random = FOREPLAY_CHALLENGES[Math.floor(Math.random() * FOREPLAY_CHALLENGES.length)];
                setCurrentChallenge(random);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white text-xs font-bold transition-transform hover:scale-[1.01]"
            >
              Draw Random Foreplay Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
