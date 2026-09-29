'use client';

import React from 'react';
import { MANIFESTO_PILLARS, CORE_VALUES } from '@/data/manifesto';
import { ShieldCheck, HeartHandshake, Sparkles, Key, Users, HeartPulse, CheckCircle2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#d94f6f]" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-400" />,
  Key: <Key className="w-5 h-5 text-amber-400" />,
  Users: <Users className="w-5 h-5 text-purple-400" />
};

export const ManifestoSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Intro Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>The Haven Charter</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Our Manifesto on Safety, Dignity & Sexual Wellness
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-2xl mx-auto leading-relaxed">
          Chastity is not an exercise in degradation, medical hazard, or toxic control. At Haven, we believe consensual chastity is a profound practice of erotic mindfulness, radical vulnerability, intimacy, and mutual trust.
        </p>
      </div>

      {/* Core Values Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CORE_VALUES.map((val, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-[#1c1026] border border-[#381e47] shadow-xs space-y-2.5"
          >
            <div className="p-2.5 rounded-2xl bg-[#0f0714] inline-block border border-[#251433]">
              {iconMap[val.icon] || <ShieldCheck className="w-5 h-5 text-[#d94f6f]" />}
            </div>
            <h2 className="font-bold text-sm text-[#fae8d7]">
              {val.title}
            </h2>
            <p className="text-xs text-[#b59ebf] leading-relaxed">
              {val.desc}
            </p>
          </div>
        ))}
      </div>

      {/* The 5 Pillars */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-[#fae8d7]">
            The Five Pillars of Practice
          </h2>
          <p className="text-xs text-[#b59ebf]">
            Non-negotiable ethical guidelines binding every member and educator of our community.
          </p>
        </div>

        <div className="space-y-4">
          {MANIFESTO_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#251433] text-[#d94f6f] border border-[#4a2c59] font-bold text-sm flex items-center justify-center">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#fae8d7]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#d94f6f] font-medium">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#b59ebf] leading-relaxed pl-11">
                {pillar.description}
              </p>

              <div className="ml-11 p-3 rounded-2xl bg-[#0f0714] border border-[#381e47] text-xs font-semibold text-[#fae8d7] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d94f6f] flex-shrink-0" />
                <span>{pillar.coreRule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
