'use client';

import React from 'react';
import {
  Shield,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Lock,
  HeartPulse,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MANIFESTO_PILLARS } from '@/data/manifesto';

interface SplashScreenProps {
  onStartOnboarding: () => void;
  onEnterApp: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartOnboarding,
  onEnterApp
}) => {
  return (
    <div className="min-h-screen bg-[#0f0714] text-[#fae8d7] flex flex-col justify-between relative overflow-hidden">
      {/* Intimate atmospheric ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#d94f6f]/15 via-[#7c3aed]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-[#d94f6f]/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto px-6 py-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d94f6f] to-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-[#d94f6f]/25">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#fae8d7] block">
              Haven
            </span>
            <span className="text-[11px] text-[#b59ebf] uppercase tracking-wider font-semibold block">
              Sexual Wellness Sanctuary
            </span>
          </div>
        </div>

        <button
          onClick={onEnterApp}
          className="px-4 py-2 rounded-xl border border-[#381e47] hover:border-[#d94f6f]/60 bg-[#1c1026]/80 hover:bg-[#251433] text-xs font-semibold text-[#fae8d7] transition-all flex items-center gap-1.5"
        >
          <span>Existing Member / Enter App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Content */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 text-center space-y-8 z-10 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#251433] border border-[#4a2c59] text-[#fae8d7] text-xs font-medium shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>A Safe Space for Consensual Chastity & Intimacy Dynamics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12]">
          Intimacy Reimagined Through{' '}
          <span className="bg-gradient-to-r from-[#d94f6f] via-[#ec4899] to-[#c084fc] bg-clip-text text-transparent">
            Trust, Safety & Consent
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#b59ebf] max-w-2xl mx-auto leading-relaxed">
          Welcome to Haven. We replace taboo and danger with medical harm reduction, ergonomic device guidance, digital lock accountability, and mindful partner intimacy rituals.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartOnboarding}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] hover:from-[#e25b7d] hover:to-[#db2777] text-white font-bold text-sm shadow-xl shadow-[#d94f6f]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
          >
            <span>Begin Guided Journey & Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1c1026] hover:bg-[#251433] border border-[#381e47] text-[#fae8d7] font-semibold text-sm transition-all"
          >
            Explore Dashboard Directly
          </button>
        </div>

        {/* 18+ Verification & Ethos Badges */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-[#1c1026]/70 border border-[#381e47]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fae8d7]">
              <CheckCircle2 className="w-4 h-4 text-[#d94f6f]" />
              <span>18+ Adult Education</span>
            </div>
            <p className="text-[11px] text-[#b59ebf]">
              For mature adults seeking safe, consensual exploration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1026]/70 border border-[#381e47]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fae8d7]">
              <Lock className="w-4 h-4 text-[#d94f6f]" />
              <span>Zero-Coercion Guarantee</span>
            </div>
            <p className="text-[11px] text-[#b59ebf]">
              Unconditional, non-punitive release upon safeword or medical need.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1026]/70 border border-[#381e47]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fae8d7]">
              <HeartPulse className="w-4 h-4 text-[#d94f6f]" />
              <span>Medical Harm Reduction</span>
            </div>
            <p className="text-[11px] text-[#b59ebf]">
              Evidence-based hygiene protocols and circulation checks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-6 border-t border-[#251433] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b59ebf] z-10">
        <p>&copy; {new Date().getFullYear()} Haven Sanctuary. Built for dignity, consent, and safety.</p>
        <div className="flex items-center gap-3">
          <span>Client-Side Private</span>
          <span>&bull;</span>
          <span>Consensual Kink & Wellness</span>
        </div>
      </footer>
    </div>
  );
};
