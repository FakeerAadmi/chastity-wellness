'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Timer,
  Droplet,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Dices,
  RefreshCw,
  Gift
} from 'lucide-react';

interface VaultTabProps {
  onOpenEmergency: () => void;
}

export const VaultTab: React.FC<VaultTabProps> = ({ onOpenEmergency }) => {
  // Lock state
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(43200); // 12 hours
  const [combinationCode, setCombinationCode] = useState<string>('[DEMO-0000]');
  const [isCombinationRevealed, setIsCombinationRevealed] = useState<boolean>(false);
  const [isHygieneFrozen, setIsHygieneFrozen] = useState<boolean>(false);
  const [hygieneFreezeSeconds, setHygieneFreezeSeconds] = useState<number>(2700); // 45 min
  const [extensionLog, setExtensionLog] = useState<string[]>([]);
  const [randomChallenge, setRandomChallenge] = useState<string | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      if (isHygieneFrozen) {
        setHygieneFreezeSeconds(prev => {
          if (prev <= 1) {
            setIsHygieneFrozen(false);
            return 2700;
          }
          return prev - 1;
        });
      } else {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setIsCombinationRevealed(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, isHygieneFrozen]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleApplyExtension = (hours: number, label: string) => {
    const delta = hours * 3600;
    setSecondsRemaining(prev => Math.max(0, prev + delta));
    setExtensionLog(prev => [`${label} (${hours > 0 ? '+' : ''}${hours}h)`, ...prev.slice(0, 4)]);
  };

  const spinWheel = () => {
    const challenges = [
      'Mindfulness Task: 15 minutes of uninterrupted deep breathing meditation.',
      'Partner Intimacy: Write a 3-sentence note describing what you appreciate about your keyholder.',
      'Reward: Time reduced by 1 hour for completing your daily skin health check.',
      'Hydration Ritual: Drink a 500ml glass of fresh water with lemon.',
      'Surprise: No change in time—enjoy the serene anticipation!'
    ];
    const picked = challenges[Math.floor(Math.random() * challenges.length)];
    setRandomChallenge(picked);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <Key className="w-3.5 h-3.5" />
          <span>Digital Accountability Vault</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Lock & Session Vault
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Manage your lockbox combination, track active wear countdown, request scheduled hygiene freezes, or trigger emergency release.
        </p>
      </div>

      {/* Main Lockbox Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#1c1026] border border-[#381e47] shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d94f6f]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex items-center justify-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
            isLocked
              ? 'bg-[#251433] text-[#d94f6f] border border-[#d94f6f]/40 shadow-lg shadow-[#d94f6f]/20'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-lg shadow-emerald-500/20'
          }`}>
            {isLocked ? <Lock className="w-10 h-10" /> : <Unlock className="w-10 h-10" />}
          </div>
        </div>

        {/* Lock State & Timer */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b59ebf]">
            {isHygieneFrozen ? 'Hygiene Window Freeze Active' : isLocked ? 'Session in Progress' : 'Lockbox Unlocked!'}
          </span>
          <div className="font-mono text-4xl sm:text-6xl font-black text-[#fae8d7] tracking-tight">
            {isHygieneFrozen ? formatTime(hygieneFreezeSeconds) : formatTime(secondsRemaining)}
          </div>
          {isHygieneFrozen && (
            <p className="text-xs text-[#d94f6f] font-semibold pt-1">
              Timer is paused for mandatory shower, washing & skin inspection.
            </p>
          )}
        </div>

        {/* Combination Box */}
        <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-[#b59ebf] block">
            Physical Lockbox Combination
          </span>
          <div className="font-mono text-2xl font-black tracking-widest text-[#d94f6f]">
            {isCombinationRevealed ? combinationCode : '••••'}
          </div>
          <span className="text-[10px] text-[#b59ebf]/80 block">
            {isCombinationRevealed ? 'Use this code to open your physical key box' : 'Reveals automatically when timer reaches zero'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Hygiene Freeze Toggle */}
          <button
            onClick={() => setIsHygieneFrozen(!isHygieneFrozen)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              isHygieneFrozen
                ? 'bg-[#d94f6f] text-white border-[#d94f6f]'
                : 'bg-[#251433] hover:bg-[#381e47] border-[#4a2c59] text-[#fae8d7]'
            }`}
          >
            <Droplet className="w-4 h-4 text-[#d94f6f]" />
            <span>{isHygieneFrozen ? 'Resume Timer' : '45m Hygiene Freeze'}</span>
          </button>

          {/* Reveal Combination Early (Emergency Tamper Safe) */}
          <button
            onClick={() => {
              setIsCombinationRevealed(true);
              setIsLocked(false);
            }}
            className="px-4 py-2.5 rounded-xl border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/60 text-xs font-bold text-rose-300 flex items-center gap-2 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Instant Emergency Release (No Shame)</span>
          </button>
        </div>
      </div>

      {/* Gamification & Extensions Panel (Inspired by Chaster) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wheel of Challenges */}
        <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#fae8d7]">
              <Dices className="w-4 h-4 text-[#d94f6f]" />
              <span>Wheel of Reflection & Challenges</span>
            </div>
            <button
              onClick={spinWheel}
              className="p-1.5 rounded-lg bg-[#251433] hover:bg-[#381e47] text-[#d94f6f] transition-colors"
              title="Spin for a random challenge"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#b59ebf] leading-relaxed">
            Draw an intimate mindfulness task, partner appreciation prompt, or time modifier.
          </p>

          {randomChallenge ? (
            <div className="p-4 rounded-2xl bg-[#251433] border border-[#d94f6f]/50 text-xs text-[#fae8d7] leading-relaxed animate-in fade-in">
              <span className="font-bold text-[#d94f6f] block mb-1">Drawn Challenge:</span>
              {randomChallenge}
            </div>
          ) : (
            <button
              onClick={spinWheel}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white text-xs font-bold transition-transform hover:scale-[1.01]"
            >
              Spin the Wheel
            </button>
          )}
        </div>

        {/* Time Modifiers & Rewards */}
        <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#fae8d7]">
            <Gift className="w-4 h-4 text-[#d94f6f]" />
            <span>Session Time Modifiers</span>
          </div>

          <p className="text-xs text-[#b59ebf] leading-relaxed">
            Adjust lock duration collaboratively based on completed intimacy tasks or mutual agreement.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleApplyExtension(-1, 'Early Reward')}
              className="py-2 px-3 rounded-xl border border-[#381e47] bg-[#251433] hover:bg-[#381e47] text-xs font-semibold text-[#fae8d7]"
            >
              -1 Hour (Reward)
            </button>
            <button
              onClick={() => handleApplyExtension(1, 'Agreed Extension')}
              className="py-2 px-3 rounded-xl border border-[#381e47] bg-[#251433] hover:bg-[#381e47] text-xs font-semibold text-[#fae8d7]"
            >
              +1 Hour (Extension)
            </button>
            <button
              onClick={() => handleApplyExtension(3, 'Weekend Lock')}
              className="py-2 px-3 rounded-xl border border-[#381e47] bg-[#251433] hover:bg-[#381e47] text-xs font-semibold text-[#fae8d7]"
            >
              +3 Hours
            </button>
            <button
              onClick={() => handleApplyExtension(6, 'Overnight Agreement')}
              className="py-2 px-3 rounded-xl border border-[#381e47] bg-[#251433] hover:bg-[#381e47] text-xs font-semibold text-[#fae8d7]"
            >
              +6 Hours
            </button>
          </div>

          {extensionLog.length > 0 && (
            <div className="pt-2 border-t border-[#251433] space-y-1">
              <span className="text-[10px] text-[#b59ebf] font-bold uppercase">Recent Changes:</span>
              {extensionLog.map((log, i) => (
                <span key={i} className="text-[11px] text-[#fae8d7]/80 block font-mono">
                  &bull; {log}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
