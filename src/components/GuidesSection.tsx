'use client';

import React, { useState } from 'react';
import { GUIDES_DATA } from '@/data/guides';
import { GuideItem } from '@/types';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Search,
  X,
  ShieldAlert
} from 'lucide-react';

export const GuidesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGuide, setActiveGuide] = useState<GuideItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'hygiene', label: 'Hygiene & Skin' },
    { id: 'safety', label: 'Circulation & Safety' },
    { id: 'communication', label: 'Consent & Boundaries' },
    { id: 'sizing', label: 'Sizing & Ergonomics' },
    { id: 'materials', label: 'Materials' },
    { id: 'mental-health', label: 'Mental Wellness' }
  ];

  const filteredGuides = GUIDES_DATA.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesQuery =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Evidence-Based Harm Reduction</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Educational Guides & Health Protocols
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Comprehensive, medically-informed protocols for hygiene, circulation safety, material biocompatibility, and consensual communication.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#b59ebf] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, hygiene tips, circulation rules..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs text-[#fae8d7] placeholder:text-[#b59ebf]/50 focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
          />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#d94f6f] text-white shadow-md shadow-[#d94f6f]/20'
                  : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47] hover:border-[#4a2c59] hover:text-[#fae8d7]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map(guide => (
          <div
            key={guide.id}
            onClick={() => setActiveGuide(guide)}
            className="group cursor-pointer rounded-3xl bg-[#1c1026] border border-[#381e47] p-6 shadow-sm hover:border-[#d94f6f]/60 hover:shadow-lg hover:shadow-[#d94f6f]/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#d94f6f] bg-[#251433] px-2.5 py-0.5 rounded-full border border-[#4a2c59]">
                  {guide.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-[#b59ebf]">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                {guide.title}
              </h2>

              <p className="text-xs text-[#b59ebf] line-clamp-3 leading-relaxed">
                {guide.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-[#251433] flex items-center justify-between mt-4">
              <span className="text-xs font-semibold text-[#d94f6f] group-hover:underline">
                Read Full Guide
              </span>
              <ChevronRight className="w-4 h-4 text-[#d94f6f] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a030c]/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-[#1c1026] border border-[#381e47] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-[#fae8d7] space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#251433] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#d94f6f] bg-[#251433] px-2.5 py-0.5 rounded-full border border-[#4a2c59]">
                    {activeGuide.categoryLabel}
                  </span>
                  <span className="text-[#b59ebf] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeGuide.readTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#fae8d7]">
                  {activeGuide.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-1.5 rounded-lg text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors"
                aria-label="Close guide modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medical disclaimer callout if present */}
            {activeGuide.medicalDisclaimer && (
              <div className="p-4 rounded-2xl bg-[#251433] border border-amber-800/80 flex items-start gap-3 text-xs text-amber-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Clinical Notice:</strong> {activeGuide.medicalDisclaimer}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d94f6f]">
                Key Takeaways at a Glance
              </h3>
              <ul className="space-y-1.5 text-xs text-[#b59ebf]">
                {activeGuide.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#d94f6f] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 text-sm text-[#b59ebf] leading-relaxed">
              {activeGuide.content.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h4 className="text-base font-bold text-[#fae8d7]">
                    {sec.heading}
                  </h4>
                  <p className="text-xs sm:text-sm">{sec.body}</p>

                  {sec.points && (
                    <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-[#b59ebf]">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  )}

                  {sec.callout && (
                    <div
                      className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        sec.callout.type === 'warning'
                          ? 'bg-rose-950/40 border-rose-900/60 text-rose-200'
                          : 'bg-[#251433] border-[#4a2c59] text-[#fae8d7]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {sec.callout.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#d94f6f]" />
                        )}
                        <span>{sec.callout.title}</span>
                      </div>
                      <p>{sec.callout.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Close footer */}
            <div className="pt-4 border-t border-[#251433]">
              <button
                onClick={() => setActiveGuide(null)}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-[#251433] hover:bg-[#381e47] border border-[#4a2c59] text-[#fae8d7] transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
