'use client';

import React from 'react';
import { Eye, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface StealthShieldProps {
  isActive: boolean;
  onDeactivate: () => void;
}

export const StealthShield: React.FC<StealthShieldProps> = ({ isActive, onDeactivate }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-stone-300 font-mono text-xs flex flex-col justify-between p-6 select-none animate-in fade-in duration-100">
      {/* Fake Work Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-stone-700" />
          <span className="font-bold text-stone-200">Financial Modeling & Q3 Variance Audit.xlsx</span>
          <span className="text-[10px] text-stone-500">[Read-Only]</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-stone-400">
          <span>Formula Bar: =SUM(B4:B29)*1.085</span>
          <span>Last Saved: 2 mins ago</span>
        </div>
      </div>

      {/* Fake Spreadsheet Grid */}
      <div className="flex-1 py-4 overflow-hidden space-y-2">
        <div className="grid grid-cols-6 gap-2 text-[10px] text-stone-500 border-b border-stone-800 pb-1">
          <span>ROW #</span>
          <span>ACCOUNT CODE</span>
          <span>ALLOCATION DEPT</span>
          <span>BUDGET (USD)</span>
          <span>ACTUAL (USD)</span>
          <span>VARIANCE</span>
        </div>
        {[
          { code: '4010-OPEX', dept: 'Cloud Infrastructure', b: '$42,500.00', a: '$39,120.40', v: '-7.95%' },
          { code: '4025-DEV', dept: 'Engineering Core', b: '$85,000.00', a: '$84,200.00', v: '-0.94%' },
          { code: '4100-MKTG', dept: 'Acquisition Channels', b: '$22,000.00', a: '$23,100.50', v: '+5.00%' },
          { code: '4250-SECR', dept: 'Compliance & Legal', b: '$15,000.00', a: '$14,800.00', v: '-1.33%' },
          { code: '4300-FACIL', dept: 'Office Operations', b: '$12,400.00', a: '$11,900.00', v: '-4.03%' },
          { code: '4450-AUDIT', dept: 'Quarterly Risk', b: '$8,200.00', a: '$7,950.00', v: '-3.05%' },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 text-stone-400 py-1 border-b border-stone-900 text-[11px]">
            <span className="text-stone-600">0{i + 1}</span>
            <span className="font-semibold text-stone-300">{row.code}</span>
            <span>{row.dept}</span>
            <span className="font-mono">{row.b}</span>
            <span className="font-mono">{row.a}</span>
            <span className={row.v.startsWith('+') ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>{row.v}</span>
          </div>
        ))}
      </div>

      {/* Discreet Exit Button */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-3 text-[11px] text-stone-500">
        <span>Stealth Mode Active. Work screen displayed for immediate privacy.</span>
        <button
          onClick={onDeactivate}
          className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-sans text-xs transition-colors flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Exit Stealth Mode</span>
        </button>
      </div>
    </div>
  );
};
