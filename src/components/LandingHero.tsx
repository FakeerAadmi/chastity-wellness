'use client';

import React from 'react';
import {
  Shield,
  HeartHandshake,
  BookOpen,
  Compass,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LandingHeroProps {
  onSelectTab: (tab: string) => void;
  onOpenOnboarding: () => void;
  onOpenEmergency: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectTab,
  onOpenOnboarding,
  onOpenEmergency
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-indigo-500/10 blur-3xl -z-10 rounded-full" />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Redefining Chastity Through Health, Consent & Dignity</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 dark:text-stone-100 leading-[1.15]">
            A Safe Space for{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Sexual Wellness & Consensual Chastity
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to Haven. We replace shame, taboo, and physical danger with medical clarity, ergonomic safety, non-punitive release agreements, and a supportive peer community.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onOpenOnboarding}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <span>Start Onboarding Self-Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('guides')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold text-sm text-stone-800 dark:text-stone-200 shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Read Safety & Hygiene Guides</span>
            </button>
          </div>

          {/* Key Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Anatomical Safety Protocols</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Coercion Ethics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Moderated Peer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Manifesto */}
          <div
            onClick={() => onSelectTab('manifesto')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all space-y-3"
          >
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 w-fit">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              The Haven Manifesto
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Our 5 non-negotiable pillars: uncompromised consent, physiological preservation, radical honesty, and mutual dignity.
            </p>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 pt-1">
              Read Manifesto &rarr;
            </span>
          </div>

          {/* Card 2: Sizing Tool */}
          <div
            onClick={() => onSelectTab('sizing')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-800 transition-all space-y-3"
          >
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 w-fit">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              Fit & Sizing Calculator
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Interactive anatomical tool to calculate ring diameter, cage depth, and spacer distance to avoid constriction injuries.
            </p>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 inline-flex items-center gap-1 pt-1">
              Calculate Dimensions &rarr;
            </span>
          </div>

          {/* Card 3: Community */}
          <div
            onClick={() => onSelectTab('community')}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-3"
          >
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 w-fit">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              Community Discussions
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Peer advice with verified safety tips covering sleep, hygiene, partner communication, and mental health aftercare.
            </p>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1 pt-1">
              Join Conversations &rarr;
            </span>
          </div>

          {/* Card 4: Emergency Protocol */}
          <div
            onClick={onOpenEmergency}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 p-6 shadow-xs hover:shadow-md hover:border-rose-400 transition-all space-y-3"
          >
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-rose-800 dark:text-rose-400 group-hover:text-rose-600 transition-colors">
              Emergency Protocol
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Immediate instructions for severe swelling, jammed locks, emergency cutting tools, and medical de-escalation.
            </p>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 pt-1">
              View Protocol &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Clear Answers to Core Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Is wearing a chastity device safe for long-term health?',
              a: 'When practiced with proper anatomical sizing, certified medical-grade materials, and rigorous daily hygiene, chastity can be practiced safely. However, it requires vigilance: any sign of numbness, coldness, or skin breakdown necessitates immediate removal. Never sleep in a device without prior daytime nap testing for nocturnal erections.'
            },
            {
              q: 'What is the "Sealed Emergency Key" protocol?',
              a: 'To prevent emotional panic or physical danger if a keyholder is away or a medical emergency arises, a spare key is sealed inside a tamper-evident envelope or safe-deposit box. Both partners formally agree that the wearer may open it without shame or relationship consequences.'
            },
            {
              q: 'How does chastity foster emotional intimacy in couples?',
              a: 'By removing automatic sexual climax, couples frequently experience enhanced verbal communication, heightened sensuality, playful anticipation, and deep emotional vulnerability. It transforms the dynamic into a shared journey of trust and mutual care.'
            },
            {
              q: 'What should I do if a device becomes trapped by sudden swelling?',
              a: 'Do not panic. Lie flat, apply a towel-wrapped ice compress to the groin for 10-15 minutes to trigger vasoconstriction, apply cold lubrication, and gently compress the tissue back. If unsuccessful, use emergency shears or visit an urgent care center where staff have standard ring-cutting instruments.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2"
            >
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Q:</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
