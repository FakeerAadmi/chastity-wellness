'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
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

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
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

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />
    </div>
  );
}
