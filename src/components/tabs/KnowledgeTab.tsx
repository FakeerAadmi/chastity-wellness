'use client';

import React, { useState } from 'react';
import { GuidesSection } from '@/components/GuidesSection';
import { SizingCalculator } from '@/components/SizingCalculator';
import { ManifestoSection } from '@/components/ManifestoSection';
import { BookOpen, Compass, HeartHandshake } from 'lucide-react';

export const KnowledgeTab: React.FC = () => {
  const [subView, setSubView] = useState<'guides' | 'sizing' | 'manifesto'>('guides');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Sub-navigation pills */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#1c1026] border border-[#381e47] rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          onClick={() => setSubView('guides')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subView === 'guides'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Guides & Hygiene</span>
        </button>

        <button
          onClick={() => setSubView('sizing')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subView === 'sizing'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Sizing Tool</span>
        </button>

        <button
          onClick={() => setSubView('manifesto')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            subView === 'manifesto'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Manifesto</span>
        </button>
      </div>

      {/* Sub-view Content */}
      <div>
        {subView === 'guides' && <GuidesSection />}
        {subView === 'sizing' && <SizingCalculator />}
        {subView === 'manifesto' && <ManifestoSection />}
      </div>
    </div>
  );
};
