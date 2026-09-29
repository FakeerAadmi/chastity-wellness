'use client';

import React from 'react';
import { MANIFESTO_PILLARS, CORE_VALUES } from '@/data/manifesto';
import { ShieldCheck, HeartHandshake, Sparkles, Key, Users, HeartPulse, CheckCircle2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
  Key: <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  Users: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
};

export const ManifestoSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* Intro Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>The Haven Charter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Our Manifesto on Safety, Dignity & Sexual Wellness
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
          Chastity is not an exercise in degradation, medical hazard, or toxic control. At Haven, we believe consensual chastity is a profound practice of erotic mindfulness, radical vulnerability, intimacy, and mutual trust.
        </p>
      </div>

      {/* Core Values Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CORE_VALUES.map((val, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2.5"
          >
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 inline-block">
              {iconMap[val.icon] || <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            </div>
            <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {val.title}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {val.desc}
            </p>
          </div>
        ))}
      </div>

      {/* The 5 Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            The Five Pillars of Practice
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Non-negotiable ethical guidelines binding every member and educator of our community.
          </p>
        </div>

        <div className="space-y-4">
          {MANIFESTO_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm transition-all hover:border-emerald-300 dark:hover:border-emerald-900 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-sm flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-11">
                {pillar.description}
              </p>

              <div className="ml-11 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{pillar.coreRule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Pledge Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-950 text-white shadow-xl space-y-4 text-center max-w-2xl mx-auto">
        <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
        <h3 className="text-xl font-bold">Our Pledge to Every Practitioner</h3>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          "We pledge to provide transparent knowledge, reject predatory behaviors and coercion, dismantle toxic taboos, and champion emotional safety. We believe that caring for human bodies and minds is the prerequisite for any consensual adventure."
        </p>
        <span className="text-[11px] uppercase tracking-widest text-emerald-400/80 font-bold block pt-2">
          &mdash; The Haven Community Collective &mdash;
        </span>
      </div>
    </div>
  );
};
