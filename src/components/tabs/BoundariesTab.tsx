'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface BoundaryItem {
  id: string;
  category: string;
  title: string;
  status: 'yes' | 'maybe' | 'no';
  notes?: string;
}

export const BoundariesTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const initialItems: BoundaryItem[] = [
    // Duration
    { id: '1', category: 'Duration & Sleep', title: 'Daytime wear (4 to 8 hours)', status: 'yes' },
    { id: '2', category: 'Duration & Sleep', title: 'Overnight sleep wear (after nap test)', status: 'maybe' },
    { id: '3', category: 'Duration & Sleep', title: 'Multi-day continuous wear (with daily hygiene pauses)', status: 'maybe' },
    { id: '4', category: 'Duration & Sleep', title: 'Extended wear exceeding 7 days', status: 'no' },

    // Daily Living & Travel
    { id: '5', category: 'Daily Living & Environment', title: 'Wearing during desk / remote work', status: 'yes' },
    { id: '6', category: 'Daily Living & Environment', title: 'Wearing during gym / cardio exercise', status: 'maybe' },
    { id: '7', category: 'Daily Living & Environment', title: 'Wearing through airport security (metal detectors)', status: 'no' },

    // Keyholder Dynamic
    { id: '8', category: 'Power Exchange & Dynamic', title: 'Keyholder holds combination code digitally', status: 'yes' },
    { id: '9', category: 'Power Exchange & Dynamic', title: 'Tamper-evident sealed emergency key stored in home', status: 'yes' },
    { id: '10', category: 'Power Exchange & Dynamic', title: 'Keyholder adds/subtracts time based on mindfulness tasks', status: 'maybe' },
    { id: '11', category: 'Power Exchange & Dynamic', title: 'Unrestricted denial with no agreed release window', status: 'no' },

    // Intimacy & Release
    { id: '12', category: 'Intimacy & Erotic Teasing', title: 'Sensual massage and teasing without release', status: 'yes' },
    { id: '13', category: 'Intimacy & Erotic Teasing', title: 'Keyholder controls timing of allowed release', status: 'maybe' },
    { id: '14', category: 'Intimacy & Erotic Teasing', title: 'Post-unlock mandatory 20-min aftercare bonding', status: 'yes' },

    // Hygiene & Safety
    { id: '15', category: 'Hygiene & Health Safeguards', title: 'Mandatory daily skin inspection and shower', status: 'yes' },
    { id: '16', category: 'Hygiene & Health Safeguards', title: 'Instant non-punitive release upon safeword or numbness', status: 'yes' },
  ];

  const [items, setItems] = useState<BoundaryItem[]>(initialItems);

  const setStatus = (id: string, newStatus: 'yes' | 'maybe' | 'no') => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  const handleCopyAgreement = () => {
    const text = `HAVEN CHASTITY & INTIMACY BOUNDARY AGREEMENT
===================================================
ENTHUSIASTIC YES (Green):
${items.filter(i => i.status === 'yes').map(i => `[YES] ${i.title}`).join('\n')}

CONDITIONAL / NEEDS DISCUSSION (Yellow):
${items.filter(i => i.status === 'maybe').map(i => `[DISCUSS] ${i.title}`).join('\n')}

HARD LIMITS / NEVER (Red):
${items.filter(i => i.status === 'no').map(i => `[HARD LIMIT] ${i.title}`).join('\n')}

CONSENT PACT:
Both partners agree to respect these limits. Hard limits are never breached under any circumstances.
===================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>SSC Negotiation Matrix</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Boundary & Consent Matrix
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Establish clear expectations between partners. Classify each practice into Green (Yes), Yellow (Discuss/Conditional), or Red (Hard Limit).
        </p>
      </div>

      {/* Legend & Export Bar */}
      <div className="p-4 rounded-2xl bg-[#1c1026] border border-[#381e47] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Yes (Enthusiastic)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Maybe (Conditional)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <XCircle className="w-4 h-4" />
            <span>No (Hard Limit)</span>
          </div>
        </div>

        <button
          onClick={handleCopyAgreement}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white font-bold flex items-center gap-1.5 shadow-md shadow-[#d94f6f]/20 transition-transform hover:scale-[1.02]"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Agreement!' : 'Export Agreement'}</span>
        </button>
      </div>

      {/* Categories & Items */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] border-b border-[#251433] pb-2">
              {category}
            </h2>

            <div className="space-y-2">
              {items
                .filter(i => i.category === category)
                .map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#0f0714] border border-[#381e47] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-medium text-[#fae8d7]">{item.title}</span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setStatus(item.id, 'yes')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          item.status === 'yes'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-sm'
                            : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47] hover:text-[#fae8d7]'
                        }`}
                      >
                        Yes
                      </button>

                      <button
                        onClick={() => setStatus(item.id, 'maybe')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          item.status === 'maybe'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500 shadow-sm'
                            : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47] hover:text-[#fae8d7]'
                        }`}
                      >
                        Maybe
                      </button>

                      <button
                        onClick={() => setStatus(item.id, 'no')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          item.status === 'no'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500 shadow-sm'
                            : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47] hover:text-[#fae8d7]'
                        }`}
                      >
                        Hard Limit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
