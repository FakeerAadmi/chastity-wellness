'use client';

import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { Header } from '@/components/Header';
import { VaultTab } from '@/components/tabs/VaultTab';
import { RitualsTab } from '@/components/tabs/RitualsTab';
import { BoundariesTab } from '@/components/tabs/BoundariesTab';
import { KnowledgeTab } from '@/components/tabs/KnowledgeTab';
import { CommunitySection } from '@/components/CommunitySection';
import { EmergencyModal } from '@/components/EmergencyModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [screenMode, setScreenMode] = useState<'splash' | 'onboarding' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState<string>('vault');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'Wearer' | 'Keyholder' | 'Explorer'>('Wearer');

  // Check if user has previously completed onboarding
  useEffect(() => {
    const hasCompleted = localStorage.getItem('haven_onboarding_completed');
    if (hasCompleted === 'true') {
      // Keep splash as default for new visitors, but enable smooth transition
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('haven_onboarding_completed', 'true');
    setScreenMode('app');
  };

  return (
    <div className="min-h-screen bg-[#0f0714] text-[#fae8d7] selection:bg-[#d94f6f]/30 selection:text-[#fae8d7]">
      {/* Universal Emergency Removal & Harm-Reduction Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Screen 1: Splash & Manifesto Portal */}
      {screenMode === 'splash' && (
        <SplashScreen
          onStartOnboarding={() => setScreenMode('onboarding')}
          onEnterApp={() => setScreenMode('app')}
        />
      )}

      {/* Screen 2: Dedicated Full-Canvas Onboarding */}
      {screenMode === 'onboarding' && (
        <OnboardingScreen
          onComplete={handleCompleteOnboarding}
          onExit={() => setScreenMode('app')}
        />
      )}

      {/* Screen 3: The Main App Workspace (Un-cramped, Focused Views) */}
      {screenMode === 'app' && (
        <div className="min-h-screen flex flex-col">
          {/* Top Bar Header */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenOnboarding={() => setScreenMode('onboarding')}
            onReturnToSplash={() => setScreenMode('splash')}
            userRole={userRole}
            setUserRole={setUserRole}
          />

          {/* Spacious Main Canvas */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {activeTab === 'vault' && (
              <VaultTab onOpenEmergency={() => setIsEmergencyOpen(true)} />
            )}

            {activeTab === 'rituals' && <RitualsTab />}

            {activeTab === 'boundaries' && <BoundariesTab />}

            {activeTab === 'guides' && <KnowledgeTab />}

            {activeTab === 'community' && <CommunitySection />}
          </main>

          {/* Footer */}
          <Footer
            onSelectTab={setActiveTab}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenOnboarding={() => setScreenMode('onboarding')}
          />
        </div>
      )}
    </div>
  );
}
