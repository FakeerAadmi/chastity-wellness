'use client';

import React from 'react';
import { Shield, AlertTriangle, BookOpen, MessageSquare, Compass, HeartHandshake } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenOnboarding
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                  Haven
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Wellness & Safety
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 hidden sm:block">
                Safe, Sane, and Consensual Chastity Education
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('manifesto')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'manifesto'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Manifesto
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'guides'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Guides & Hygiene
            </button>

            <button
              onClick={() => setActiveTab('sizing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'sizing'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Fit & Sizing Tool
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Community
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {/* Urgent Safety Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-xs"
              title="Immediate emergency removal, swelling de-escalation, and warning signs"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Emergency Protocol</span>
              <span className="sm:hidden">Emergency</span>
            </button>

            {/* Guided Onboarding Button */}
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <span>Self-Assessment</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-100 dark:border-stone-900 text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-1 px-2 rounded ${activeTab === 'home' ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('manifesto')}
            className={`py-1 px-2 rounded ${activeTab === 'manifesto' ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}
          >
            Manifesto
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`py-1 px-2 rounded ${activeTab === 'guides' ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}
          >
            Guides
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`py-1 px-2 rounded ${activeTab === 'sizing' ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}
          >
            Sizing
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`py-1 px-2 rounded ${activeTab === 'community' ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}
          >
            Community
          </button>
        </div>
      </div>
    </header>
  );
};
