'use client';

import React from 'react';
import { Shield, AlertCircle, Heart, Lock } from 'lucide-react';

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
    <footer className="mt-auto border-t border-[#251433] bg-[#0c0510] text-[#b59ebf] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Ethos */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d94f6f] to-[#7c3aed] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-[#fae8d7]">
                Haven Sanctuary
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#b59ebf]">
              An evidence-based sexual wellness portal championing physiological safety, uncompromised consent, and mindful relationship dynamics.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#fae8d7] uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('vault')}
                  className="hover:text-[#d94f6f] transition-colors"
                >
                  Lock Vault & Countdown
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rituals')}
                  className="hover:text-[#d94f6f] transition-colors"
                >
                  Dynamic Rituals & Tasks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('boundaries')}
                  className="hover:text-[#d94f6f] transition-colors"
                >
                  Boundary & Consent Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guides')}
                  className="hover:text-[#d94f6f] transition-colors"
                >
                  Guides, Hygiene & Sizing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('community')}
                  className="hover:text-[#d94f6f] transition-colors"
                >
                  Peer Community Sanctuary
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Harm Reduction & Tools */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#fae8d7] uppercase tracking-wider text-[11px]">
              Safety & Self-Assessment
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenEmergency}
                  className="text-rose-400 font-bold hover:underline"
                >
                  Emergency Release Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOnboarding}
                  className="text-[#d94f6f] font-semibold hover:underline"
                >
                  Launch Self-Assessment Wizard
                </button>
              </li>
              <li>
                <span className="text-[#b59ebf]/80">
                  Medical-Grade Material Standards (316L, Platinum Silicone)
                </span>
              </li>
              <li>
                <span className="text-[#b59ebf]/80">
                  Non-Punitive Release Guarantee
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Important Health & Legal Notice */}
          <div className="p-4 rounded-2xl bg-[#1c1026] border border-[#381e47] space-y-2 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[#fae8d7]">
              <AlertCircle className="w-3.5 h-3.5 text-[#d94f6f]" />
              <span>Medical & Health Notice</span>
            </div>
            <p className="text-[#b59ebf]">
              Content on Haven is for educational and harm-reduction purposes only. It is not medical advice. If you experience persistent numbness, discoloration, or urinary blockage, seek immediate emergency medical care.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#251433] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#b59ebf]">
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
