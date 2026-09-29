'use client';

import React, { useState } from 'react';
import {
  Compass,
  Search,
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
  ChevronRight,
  Users,
  X
} from 'lucide-react';
import { INITIAL_TOOLBOXES } from '../../data/domainDemoData';
import { ToolboxCategory } from '../../types/domain';
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  // Explicit adult & relationship categories
  const categories: { key: ToolboxCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All Toolboxes', icon: Layers },
    { key: 'bdsm_power_exchange', label: 'BDSM & Power Exchange', icon: Sparkles },
    { key: 'chastity', label: 'Chastity', icon: Key },
    { key: 'non_monogamy', label: 'Non-monogamy', icon: Heart },
    { key: 'roleplay_kink', label: 'Roleplay & Kink', icon: Sparkles },
    { key: 'long_distance', label: 'Long Distance', icon: Compass },
    { key: 'communication', label: 'Communication', icon: MessageSquare },
    { key: 'safety_consent', label: 'Safety & Consent', icon: Shield },
    { key: 'aftercare_wellness', label: 'Aftercare & Wellness', icon: Heart },
    { key: 'relationship', label: 'Relationship', icon: Users },
  ];

  // Available descriptive tags extracted from toolboxes
  const availableTags = Array.from(
    new Set(INITIAL_TOOLBOXES.flatMap(t => t.tags || []))
  );

  const filteredToolboxes = INITIAL_TOOLBOXES.filter(t => {
    // Match category
    const matchesCategory =
      selectedCategory === 'all' ||
      t.category === selectedCategory ||
      (selectedCategory === 'relationship' && t.category === 'relationships') ||
      (selectedCategory === 'safety_consent' && t.category === 'safety') ||
      (selectedCategory === 'aftercare_wellness' && t.category === 'wellness');

    // Match tag
    const matchesTag = !selectedTag || (t.tags && t.tags.includes(selectedTag));

    // Match search query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
      t.supportedDynamics.some(d => d.toLowerCase().includes(q));

    return matchesCategory && matchesTag && matchesSearch;
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

  const formatCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'bdsm_power_exchange':
        return 'BDSM & Power Exchange';
      case 'chastity':
        return 'Chastity';
      case 'non_monogamy':
        return 'Non-monogamy';
      case 'roleplay_kink':
        return 'Roleplay & Kink';
      case 'long_distance':
        return 'Long Distance';
      case 'safety_consent':
      case 'safety':
        return 'Safety & Consent';
      case 'aftercare_wellness':
      case 'wellness':
        return 'Aftercare & Wellness';
      case 'communication':
        return 'Communication';
      case 'relationship':
      case 'relationships':
        return 'Relationship';
      default:
        return cat.replace(/_/g, ' ');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
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
                {formatCategoryBadge(activeTool.category)}
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
          {![
            'tbx_boundary_matrix',
            'tbx_sizing_calculator',
            'tbx_hygiene_guides',
            'tbx_chastity_vault',
            'tbx_rituals_engine',
            'tbx_emergency_safety_plan'
          ].includes(activeTool.id) && (
            <div className="p-8 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-5 max-w-2xl mx-auto shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#251433] border border-[#381e47] flex items-center justify-center">
                  {renderIcon(activeTool.iconName)}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d94f6f]">
                    {formatCategoryBadge(activeTool.category)} • v{activeTool.version}
                  </span>
                  <h3 className="text-lg font-bold text-[#fae8d7]">{activeTool.name}</h3>
                </div>
              </div>

              <p className="text-xs text-[#b59ebf] leading-relaxed">{activeTool.description}</p>

              {activeTool.tags && activeTool.tags.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#8d7596] block">Descriptive Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTool.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-[#251433] border border-[#381e47] text-[10px] font-medium text-[#fae8d7]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#b59ebf] space-y-2">
                <span className="font-semibold text-[#fae8d7] block">Supported Dynamic Frameworks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTool.supportedDynamics.map(dyn => (
                    <span
                      key={dyn}
                      className="px-2 py-0.5 rounded bg-[#251433] text-[10px] text-[#fae8d7]"
                    >
                      {dyn.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#150a1e] border border-[#2d163d] text-[11px] text-[#8d7596] flex items-center justify-between">
                <span>Integrated with privacy-aware local storage.</span>
                <button
                  onClick={() => onNavigateTab('dynamics')}
                  className="text-xs font-semibold text-[#d94f6f] hover:underline"
                >
                  Apply to a Dynamic →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Catalog Explorer View */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1c1026] border border-[#251433]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d94f6f] uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Exploration & Practice Toolboxes</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#fae8d7]">Explore</h1>
              <p className="text-sm text-[#b59ebf] mt-1 max-w-xl">
                Explore modular frameworks for BDSM, power exchange, chastity, non-monogamy, roleplay, boundaries, and aftercare.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8d7596] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search toolboxes or tags..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#fae8d7] placeholder-[#6d5575] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>
          </div>

          {/* Understated Adult Space Statement */}
          <div className="p-4 rounded-2xl bg-[#170a20] border border-[#2d163d] flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#d94f6f] shrink-0 mt-0.5" />
            <div className="text-xs text-[#b59ebf] leading-relaxed">
              <strong className="text-[#fae8d7]">Haven is for consenting adults.</strong> Explore your relationships, dynamics, fantasies, boundaries, and agreements without judgment. Haven provides tools for communication and safety — not instructions for what your relationship should look like.
            </div>
          </div>

          {/* Explicit Category Filter Pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setSelectedTag(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-sm font-bold'
                        : 'bg-[#150a1e] text-[#8d7596] hover:text-[#fae8d7] hover:bg-[#1c1026] border border-[#200f2e]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#d94f6f]' : 'text-[#8d7596]'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Descriptive Adult Taxonomy Tags Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8d7596] shrink-0 mr-1">
                Filter by tag:
              </span>
              {availableTags.map(tag => {
                const isTagSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg transition-all shrink-0 flex items-center gap-1 ${
                      isTagSelected
                        ? 'bg-[#d94f6f] text-white font-semibold shadow-xs'
                        : 'bg-[#150a1e] text-[#8d7596] hover:text-[#fae8d7] border border-[#251433]'
                    }`}
                  >
                    <span>{tag}</span>
                    {isTagSelected && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toolboxes Grid */}
          {filteredToolboxes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#1c1026] border border-[#251433] space-y-3">
              <Compass className="w-8 h-8 text-[#8d7596] mx-auto opacity-40" />
              <h3 className="text-sm font-bold text-[#fae8d7]">No toolboxes found</h3>
              <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
                No toolboxes match your current search query or tag selection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredToolboxes.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => setActiveToolId(tool.id)}
                  className="p-5 rounded-2xl bg-[#1c1026] border border-[#251433] hover:border-[#d94f6f]/50 hover:bg-[#20112c] transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#130b1a] border border-[#251433] flex items-center justify-center group-hover:scale-105 transition-transform">
                        {renderIcon(tool.iconName)}
                      </div>
                      <span className="text-[10px] font-bold text-[#b59ebf] px-2 py-0.5 rounded bg-[#251433]">
                        {formatCategoryBadge(tool.category)}
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

                    {/* Descriptive Tags */}
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tool.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-[#160b1e] border border-[#2d163d] text-[10px] font-medium text-[#b59ebf]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
          )}
        </div>
      )}
    </div>
  );
};
