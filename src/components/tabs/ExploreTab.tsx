'use client';

import React, { useState } from 'react';
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Shield,
  Heart,
  Key,
  BookOpen,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  MapPin,
  FileText,
  ShieldAlert,
  Layers,
  ChevronRight
} from 'lucide-react';
import { INITIAL_TOOLBOXES } from '../../data/domainDemoData';
import { Toolbox, ToolboxCategory } from '../../types/domain';
import { BoundariesTab } from './BoundariesTab';
import { KnowledgeTab } from './KnowledgeTab';
import { VaultTab } from './VaultTab';
import { RitualsTab } from './RitualsTab';

interface ExploreTabProps {
  onOpenEmergency: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  onOpenEmergency,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolboxCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const categories: { key: ToolboxCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All Toolboxes', icon: Layers },
    { key: 'relationships', label: 'Relationships', icon: Heart },
    { key: 'dynamics', label: 'Dynamics', icon: Sparkles },
    { key: 'wellness', label: 'Wellness', icon: Compass },
    { key: 'safety', label: 'Safety', icon: Shield },
    { key: 'communication', label: 'Communication', icon: MessageSquare },
  ];

  const filteredToolboxes = INITIAL_TOOLBOXES.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.supportedDynamics.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeTool = INITIAL_TOOLBOXES.find(t => t.id === activeToolId);

  // Render icon based on iconName
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-[#d94f6f]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Key':
        return <Key className="w-5 h-5 text-amber-400" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-[#d94f6f]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'MessageSquare':
      default:
        return <MessageSquare className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* If a tool is open, render its embedded canvas with back action */}
      {activeToolId && activeTool ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1c1026] border border-[#251433]">
            <button
              onClick={() => setActiveToolId(null)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#b59ebf] hover:text-[#fae8d7] border border-[#381e47] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explore Catalog</span>
            </button>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d94f6f]">
                {activeTool.category} Toolbox
              </span>
              <h2 className="text-sm font-bold text-[#fae8d7]">{activeTool.name}</h2>
            </div>
          </div>

          {/* Embedded Tool implementations */}
          {activeTool.id === 'tbx_boundary_matrix' && <BoundariesTab />}
          {activeTool.id === 'tbx_sizing_calculator' && <KnowledgeTab />}
          {activeTool.id === 'tbx_hygiene_guides' && <KnowledgeTab />}
          {activeTool.id === 'tbx_chastity_vault' && <VaultTab onOpenEmergency={onOpenEmergency} />}
          {activeTool.id === 'tbx_rituals_engine' && <RitualsTab />}
          {activeTool.id === 'tbx_emergency_safety_plan' && (
            <div className="p-8 rounded-2xl bg-[#1c1026] border border-[#251433] text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-xl font-bold text-[#fae8d7]">Emergency Action Plan & Safe Key Escrow</h3>
              <p className="text-xs text-[#b59ebf] max-w-md mx-auto">
                Access immediate emergency release guidance, medical safety measures, and safe key unlocking protocols.
              </p>
              <button
                onClick={onOpenEmergency}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Launch Emergency Protocol Drawer
              </button>
            </div>
          )}
          {['tbx_contracting_wizard', 'tbx_meetup_escort', 'tbx_aftercare_debrief', 'tbx_nonviolent_requests'].includes(
            activeTool.id
          ) && (
            <div className="p-8 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#251433] border border-[#381e47] flex items-center justify-center">
                  {renderIcon(activeTool.iconName)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d94f6f]">
                    {activeTool.category} • v{activeTool.version}
                  </span>
                  <h3 className="text-lg font-bold text-[#fae8d7]">{activeTool.name}</h3>
                </div>
              </div>
              <p className="text-xs text-[#b59ebf] leading-relaxed">{activeTool.description}</p>
              <div className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#b59ebf] space-y-2">
                <span className="font-semibold text-[#fae8d7] block">Supported Dynamic Frameworks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTool.supportedDynamics.map(dyn => (
                    <span
                      key={dyn}
                      className="px-2 py-0.5 rounded bg-[#251433] text-[10px] text-[#fae8d7]"
                    >
                      {dyn}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-[#8d7596]">
                This modular toolbox is enabled and integrated with your active relationship agreements.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Catalog Explorer View */
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1c1026] border border-[#251433]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d94f6f] uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Modular Toolboxes Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#fae8d7]">Explore</h1>
              <p className="text-sm text-[#b59ebf] mt-1 max-w-xl">
                Browse modular toolboxes for boundary negotiation, physiological ergonomics, clinical hygiene, and dynamic contracting.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8d7596] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search toolboxes..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#fae8d7] placeholder-[#6d5575] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-sm'
                      : 'bg-[#150a1e] text-[#8d7596] hover:text-[#fae8d7] hover:bg-[#1c1026] border border-[#200f2e]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#d94f6f]' : 'text-[#8d7596]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toolboxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredToolboxes.map(tool => (
              <div
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] hover:border-[#d94f6f]/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#130b1a] border border-[#251433] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {renderIcon(tool.iconName)}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#b59ebf] px-2 py-0.5 rounded bg-[#251433]">
                      {tool.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#b59ebf] leading-relaxed mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#251433] flex items-center justify-between text-xs text-[#8d7596]">
                  <span>v{tool.version}</span>
                  <span className="text-[#fae8d7] font-semibold group-hover:underline flex items-center gap-1">
                    <span>Open Tool</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
