'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { LandingHero } from '@/components/LandingHero';
import { ManifestoSection } from '@/components/ManifestoSection';
import { GuidesSection } from '@/components/GuidesSection';
import { SizingCalculator } from '@/components/SizingCalculator';
import { CommunitySection } from '@/components/CommunitySection';
import { AgeDisclaimerModal } from '@/components/AgeDisclaimerModal';
import { EmergencyModal } from '@/components/EmergencyModal';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'Wearer' | 'Keyholder' | 'Explorer'>('Wearer');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200">
      {/* 18+ Age & Content Verification Modal */}
      <AgeDisclaimerModal />

      {/* Instant Emergency Removal Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* 5-Step Guided Onboarding Wizard */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 3-Panel Widescreen Layout */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Panel: Navigation & Perspectives */}
          <div className="hidden lg:block sticky top-22">
            <SidebarLeft
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              userRole={userRole}
              setUserRole={setUserRole}
            />
          </div>

          {/* Central Main Workspace / Content */}
          <main className="flex-1 min-w-0 w-full bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs backdrop-blur-xs">
            {activeTab === 'home' && (
              <LandingHero
                onSelectTab={setActiveTab}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}

            {activeTab === 'manifesto' && <ManifestoSection />}

            {activeTab === 'guides' && <GuidesSection />}

            {activeTab === 'sizing' && <SizingCalculator />}

            {activeTab === 'community' && <CommunitySection />}
          </main>

          {/* Right Panel: Live Monitoring, Hygiene Countdown & Daily Micro-Checks */}
          <div className="w-full lg:w-auto sticky top-22">
            <SidebarRight
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              userRole={userRole}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />
    </div>
  );
}
