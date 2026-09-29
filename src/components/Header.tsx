'use client';

import React from 'react';
import {
  Shield,
  Key,
  Heart,
  FileSpreadsheet,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  User,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenOnboarding: () => void;
  onReturnToSplash: () => void;
  userRole: 'Wearer' | 'Keyholder' | 'Explorer';
  setUserRole: (role: 'Wearer' | 'Keyholder' | 'Explorer') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenOnboarding,
  onReturnToSplash,
  userRole,
  setUserRole
}) => {
  const tabs = [
    { id: 'vault', label: 'Lock Vault', icon: Key },
    { id: 'rituals', label: 'Dynamic Rituals', icon: Heart },
    { id: 'boundaries', label: 'Boundary Matrix', icon: FileSpreadsheet },
    { id: 'guides', label: 'Guides & Sizing', icon: BookOpen },
    { id: 'community', label: 'Peer Sanctuary', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#251433] bg-[#0f0714]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={onReturnToSplash}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            title="Return to Splash Screen"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d94f6f] to-[#7c3aed] flex items-center justify-center text-white shadow-md shadow-[#d94f6f]/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#fae8d7] block">
                Haven
              </span>
              <span className="text-[10px] text-[#b59ebf] uppercase tracking-wider block font-semibold">
                Sanctuary
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-inner'
                      : 'text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#1c1026]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#d94f6f]' : 'text-[#b59ebf]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Role Selector */}
          <div className="flex items-center gap-3">
            {/* Perspective Picker */}
            <div className="hidden sm:flex items-center bg-[#1c1026] p-1 rounded-xl border border-[#381e47] text-[11px] font-semibold">
              {(['Wearer', 'Keyholder', 'Explorer'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    userRole === role
                      ? 'bg-[#251433] text-[#d94f6f] shadow-xs'
                      : 'text-[#b59ebf] hover:text-[#fae8d7]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Emergency Protocol Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/60 transition-colors shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Emergency</span>
            </button>

            {/* Exit/Splash Trigger */}
            <button
              onClick={onReturnToSplash}
              className="p-2 rounded-xl text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#1c1026] border border-[#381e47] transition-colors"
              title="Return to Welcome Splash"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#251433] text-[11px]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1 px-2 rounded-lg font-semibold ${
                activeTab === tab.id ? 'text-[#d94f6f] bg-[#251433]' : 'text-[#b59ebf]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
