'use client';

import React from 'react';
import { Shield, Heart, AlertCircle, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenOnboarding: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenEmergency,
  onOpenOnboarding
}) => {
  return (
    <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Ethos */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-stone-900 dark:text-stone-100">
                Haven Sanctuary
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              An evidence-based sexual wellness portal championing physiological safety, uncompromised consent, and compassionate kink education.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('manifesto')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  The Haven Manifesto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guides')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Hygiene & Safety Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('sizing')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Anatomical Sizing Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('community')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Peer Community Forum
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Harm Reduction & Tools */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
              Safety & Self-Assessment
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenEmergency}
                  className="text-rose-700 dark:text-rose-400 font-semibold hover:underline"
                >
                  Emergency Release Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOnboarding}
                  className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Onboarding & Personal Safety Plan
                </button>
              </li>
              <li>
                <span className="text-stone-600 dark:text-stone-400">
                  Medical-Grade Material Standards (316L, Platinum Silicone)
                </span>
              </li>
              <li>
                <span className="text-stone-600 dark:text-stone-400">
                  Non-Punitive Release Clause Guidelines
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Important Health & Legal Notice */}
          <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-2 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Medical & Health Notice</span>
            </div>
            <p className="text-stone-700 dark:text-stone-300">
              Content on Haven is for educational and harm-reduction purposes only. It is not medical advice. If you experience persistent numbness, discoloration, or urinary blockage, seek immediate emergency medical care.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-600 dark:text-stone-400">
          <p>&copy; {new Date().getFullYear()} Haven Sexual Wellness Sanctuary. Built for dignity, consent, and safety.</p>
          <div className="flex items-center gap-4">
            <span>Confidential & Client-Side Stored</span>
            <span>&bull;</span>
            <span>18+ Adult Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
