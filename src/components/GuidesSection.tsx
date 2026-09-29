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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Evidence-Based Knowledgebase</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Educational Guides & Harm Reduction
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          Comprehensive, medically-informed protocols for hygiene, circulation safety, device maintenance, and consensual communication.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-stone-600 dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, hygiene tips, circulation rules..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
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
            className="group cursor-pointer rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900">
                  {guide.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime}
                </span>
              </div>

              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {guide.title}
              </h2>

              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                {guide.summary}
              </p>
            </div>

            <div className="pt-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between mt-4">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                Read Full Guide
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-stone-900 dark:text-stone-100 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {activeGuide.categoryLabel}
                  </span>
                  <span className="text-stone-600 dark:text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeGuide.readTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {activeGuide.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close guide modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medical disclaimer callout if present */}
            {activeGuide.medicalDisclaimer && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Clinical Notice:</strong> {activeGuide.medicalDisclaimer}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Key Takeaways at a Glance
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                {activeGuide.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {activeGuide.content.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {sec.heading}
                  </h4>
                  <p className="text-xs sm:text-sm">{sec.body}</p>

                  {sec.points && (
                    <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  )}

                  {sec.callout && (
                    <div
                      className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        sec.callout.type === 'warning'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                          : sec.callout.type === 'tip'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {sec.callout.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        {sec.callout.type === 'info' && <Info className="w-4 h-4 text-teal-600" />}
                        {sec.callout.type === 'tip' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        <span>{sec.callout.title}</span>
                      </div>
                      <p>{sec.callout.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Close footer */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setActiveGuide(null)}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white transition-colors"
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
