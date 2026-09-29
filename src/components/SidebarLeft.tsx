'use client';

import React from 'react';
import {
  Shield,
  HeartHandshake,
  BookOpen,
  Compass,
  MessageSquare,
  AlertTriangle,
  ClipboardCheck,
  UserCheck,
  Sparkles,
  Timer
} from 'lucide-react';

interface SidebarLeftProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onOpenOnboarding: () => void;
  userRole: 'Wearer' | 'Keyholder' | 'Explorer';
  setUserRole: (role: 'Wearer' | 'Keyholder' | 'Explorer') => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenOnboarding,
  userRole,
  setUserRole
}) => {
  const navItems = [
    { id: 'home', label: 'Dashboard & Home', icon: Shield, badge: 'Hub' },
    { id: 'manifesto', label: 'The Haven Manifesto', icon: HeartHandshake, badge: '5 Pillars' },
    { id: 'guides', label: 'Hygiene & Guides', icon: BookOpen, badge: '6 Topics' },
    { id: 'sizing', label: 'Fit & Sizing Tool', icon: Compass, badge: 'Calculator' },
    { id: 'community', label: 'Community Sanctuary', icon: MessageSquare, badge: 'Active' },
  ];

  return (
    <aside className="w-full lg:w-[260px] xl:w-[280px] shrink-0 space-y-5">
      {/* Brand Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-stone-100">
                Haven
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Sanctuary
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Sexual Wellness & Safety
            </p>
          </div>
        </div>

        {/* Perspective Switcher */}
        <div className="space-y-1.5 pt-1 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            Active Perspective:
          </span>
          <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl text-[11px] font-semibold">
            {(['Explorer', 'Wearer', 'Keyholder'] as const).map(role => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`py-1 rounded-lg text-center transition-all ${
                  userRole === role
                    ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-3 shadow-xs space-y-1">
        <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider px-3 py-1.5 block">
          Navigation
        </span>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isActive
                    ? 'bg-emerald-200/60 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Safety & Onboarding Quick Triggers */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Self-Assessment</span>
        </div>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
          Create or review your custom Personal Safety & Non-Coercion Agreement.
        </p>
        <button
          onClick={onOpenOnboarding}
          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Launch Assessment</span>
        </button>
      </div>

      {/* Emergency Action Card */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
          <span>Urgent Harm Reduction</span>
        </div>
        <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
          Swelling, cyanosis, loss of sensation, or stuck locks? Access immediate de-escalation steps.
        </p>
        <button
          onClick={onOpenEmergency}
          className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
        >
          Emergency Protocol
        </button>
      </div>
    </aside>
  );
};
