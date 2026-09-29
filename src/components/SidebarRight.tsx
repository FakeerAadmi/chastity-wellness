'use client';

import React, { useState, useEffect } from 'react';
import {
  Timer,
  Droplet,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  BellRing,
  HeartPulse,
  Key
} from 'lucide-react';

interface SidebarRightProps {
  onOpenEmergency: () => void;
  userRole: 'Wearer' | 'Keyholder' | 'Explorer';
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  onOpenEmergency,
  userRole
}) => {
  // Session tracking state
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);
  const [sessionSeconds, setSessionSeconds] = useState<number>(51840); // 14h 24m seed
  const [hygieneSecondsRemaining, setHygieneSecondsRemaining] = useState<number>(13080); // 3h 38m seed
  const [hygieneStatus, setHygieneStatus] = useState<'good' | 'due_soon' | 'overdue'>('good');

  // Wellness check state
  const [circulationStatus, setCirculationStatus] = useState<'normal' | 'pressure' | 'numb'>('normal');
  const [skinStatus, setSkinStatus] = useState<'healthy' | 'redness' | 'irritation'>('healthy');
  const [lastCheckTime, setLastCheckTime] = useState<string>('1 hour ago');
  const [checkConfirmed, setCheckConfirmed] = useState<boolean>(false);

  // Daily tips index
  const tips = [
    {
      title: 'The "1-Finger Test"',
      body: 'You should always be able to gently slip a fingertip beneath the spacer pin when standing. If flesh is wedged tight, switch to a wider spacer.'
    },
    {
      title: 'Moisture Barrier Rule',
      body: 'Always wait 5-10 minutes after showering to ensure skin is 100% dry before re-locking. Trapped moisture is the primary trigger for contact dermatitis.'
    },
    {
      title: 'Nocturnal Warning',
      body: 'REM sleep brings 3-5 involuntary erections. If waking in sharp pain, remove immediately—never attempt to endure nocturnal edema.'
    }
  ];
  const [tipIndex, setTipIndex] = useState(0);

  // Live timer effect
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
      setHygieneSecondsRemaining(prev => {
        if (prev <= 1) {
          setHygieneStatus('overdue');
          return 0;
        }
        if (prev < 3600) setHygieneStatus('due_soon');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatHoursMins = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const handleLogHygiene = () => {
    setHygieneSecondsRemaining(24 * 3600); // Reset to 24h
    setHygieneStatus('good');
  };

  const handleSaveWellnessCheck = () => {
    if (circulationStatus === 'numb' || skinStatus === 'irritation') {
      onOpenEmergency();
    } else {
      setLastCheckTime('Just now');
      setCheckConfirmed(true);
      setTimeout(() => setCheckConfirmed(false), 2000);
    }
  };

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-5">
      {/* Active Wear & Hygiene Tracker */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              {userRole === 'Keyholder' ? 'Partner Session Monitor' : 'Wear & Hygiene Monitor'}
            </span>
          </div>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isSessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'
            }`}
            title={isSessionActive ? 'Session Active' : 'Session Paused'}
          />
        </div>

        {/* Counter Displays */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 block">
              Session Duration
            </span>
            <span className="font-mono text-base font-extrabold text-stone-900 dark:text-stone-100">
              {formatHoursMins(sessionSeconds)}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border space-y-0.5 ${
              hygieneStatus === 'good'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <span className="text-[10px] uppercase font-bold opacity-80 block flex items-center gap-1">
              <Droplet className="w-3 h-3" />
              Hygiene Window
            </span>
            <span className="font-mono text-base font-extrabold">
              {formatHoursMins(hygieneSecondsRemaining)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleLogHygiene}
            className="flex-1 py-1.5 px-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Log Shower/Clean</span>
          </button>
          <button
            onClick={() => setIsSessionActive(!isSessionActive)}
            className="py-1.5 px-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-[11px] font-semibold text-stone-600 dark:text-stone-400 transition-colors"
          >
            {isSessionActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Daily Physical Wellness Quick-Check */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Circulation & Skin Check
            </span>
          </div>
          <span className="text-[10px] text-stone-600 dark:text-stone-400">
            Last: {lastCheckTime}
          </span>
        </div>

        {/* Circulation Status */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block">
            Circulation / Sensation:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {[
              { id: 'normal', label: 'Warm / Normal' },
              { id: 'pressure', label: 'Mild Pinch' },
              { id: 'numb', label: 'Numb / Cold' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setCirculationStatus(opt.id as any)}
                className={`py-1.5 px-1 rounded-xl font-medium border text-center transition-colors ${
                  circulationStatus === opt.id
                    ? opt.id === 'numb'
                      ? 'bg-rose-100 border-rose-500 text-rose-800 font-bold'
                      : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-800 dark:text-emerald-300'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skin Status */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block">
            Skin Condition:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {[
              { id: 'healthy', label: 'Intact' },
              { id: 'redness', label: 'Red Mark' },
              { id: 'irritation', label: 'Broken' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setSkinStatus(opt.id as any)}
                className={`py-1.5 px-1 rounded-xl font-medium border text-center transition-colors ${
                  skinStatus === opt.id
                    ? opt.id === 'irritation'
                      ? 'bg-rose-100 border-rose-500 text-rose-800 font-bold'
                      : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-800 dark:text-emerald-300'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit wellness status */}
        <button
          onClick={handleSaveWellnessCheck}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
            circulationStatus === 'numb' || skinStatus === 'irritation'
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-800 dark:hover:bg-stone-700'
          }`}
        >
          {circulationStatus === 'numb' || skinStatus === 'irritation' ? (
            <>
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Warning: Launch Emergency Protocol</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{checkConfirmed ? 'Check Recorded!' : 'Confirm Daily Health Check'}</span>
            </>
          )}
        </button>
      </div>

      {/* Emergency Safeguard Card */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            Active Safeguards
          </span>
          <span className="text-[10px] text-stone-400">Non-Coercion Protocol</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-400">Designated Safeword:</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 font-mono font-black border border-rose-800">
            RED
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-400">Emergency Key:</span>
          <span className="text-stone-200 text-[11px] font-medium">Sealed Envelope #1</span>
        </div>
      </div>

      {/* Daily Micro-Tip */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Harm-Reduction Tip</span>
          </div>
          <button
            onClick={() => setTipIndex((tipIndex + 1) % tips.length)}
            className="text-stone-400 hover:text-stone-600 p-0.5"
            title="Next Tip"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
          {tips[tipIndex].title}
        </h4>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
          {tips[tipIndex].body}
        </p>
      </div>
    </aside>
  );
};
