'use client';

import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { Header } from '@/components/Header';
import { TodayTab } from '@/components/tabs/TodayTab';
import { RelationshipsTab } from '@/components/tabs/RelationshipsTab';
import { DynamicsTab } from '@/components/tabs/DynamicsTab';
import { ExploreTab } from '@/components/tabs/ExploreTab';
import { VaultTab } from '@/components/tabs/VaultTab';
import { RitualsTab } from '@/components/tabs/RitualsTab';
import { CouplesDynamicsTab } from '@/components/tabs/CouplesDynamicsTab';
import { BoundariesTab } from '@/components/tabs/BoundariesTab';
import { KnowledgeTab } from '@/components/tabs/KnowledgeTab';
import { CommunitySection } from '@/components/CommunitySection';
import { DesiresTab } from '@/components/tabs/DesiresTab';
import { RequestsTab } from '@/components/tabs/RequestsTab';
import { TasksTab } from '@/components/tabs/TasksTab';
import { ProfileTab } from '@/components/tabs/ProfileTab';
import { EmergencyModal } from '@/components/EmergencyModal';
import { StealthShield } from '@/components/StealthShield';
import { Footer } from '@/components/Footer';
import { INITIAL_HAVEN_REQUESTS, INITIAL_TASKS, CURRENT_USER } from '@/data/domainDemoData';

export default function Home() {
  const [screenMode, setScreenMode] = useState<'splash' | 'onboarding' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedDynamicId, setSelectedDynamicId] = useState<string | undefined>(undefined);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isStealthActive, setIsStealthActive] = useState<boolean>(false);
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
      {/* Discreet Stealth Shield for Immediate Privacy */}
      <StealthShield
        isActive={isStealthActive}
        onDeactivate={() => setIsStealthActive(false)}
      />

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
            onToggleStealth={() => setIsStealthActive(true)}
            userRole={userRole}
            setUserRole={setUserRole}
            pendingRequestsCount={
              INITIAL_HAVEN_REQUESTS.filter(
                r => r.recipientIds.includes(CURRENT_USER.id) && r.status === 'pending'
              ).length
            }
            tasksDueCount={
              INITIAL_TASKS.filter(
                t => t.assignedToIds.includes(CURRENT_USER.id) && t.status !== 'completed' && t.status !== 'verified'
              ).length
            }
          />

          {/* Spacious Main Canvas */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {activeTab === 'today' && (
              <TodayTab
                onNavigateTab={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                userRole={userRole}
              />
            )}

            {activeTab === 'relationships' && (
              <RelationshipsTab
                onNavigateTab={setActiveTab}
                onNavigateDynamic={(dynamicId) => {
                  setSelectedDynamicId(dynamicId);
                  setActiveTab('dynamics');
                }}
              />
            )}

            {activeTab === 'dynamics' && (
              <DynamicsTab
                initialDynamicId={selectedDynamicId}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}

            {activeTab === 'desires' && (
              <DesiresTab
                onNavigateTab={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}

            {activeTab === 'requests' && (
              <RequestsTab
                onNavigateTab={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksTab
                onNavigateTab={setActiveTab}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreTab
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* Direct access fallbacks to keep legacy and footer links robust */}
            {activeTab === 'vault' && (
              <VaultTab onOpenEmergency={() => setIsEmergencyOpen(true)} />
            )}

            {activeTab === 'rituals' && <RitualsTab />}

            {activeTab === 'couples' && <CouplesDynamicsTab />}

            {activeTab === 'boundaries' && <BoundariesTab />}

            {activeTab === 'guides' && <KnowledgeTab />}

            {activeTab === 'community' && <CommunitySection />}

            {activeTab === 'profile' && <ProfileTab />}
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
