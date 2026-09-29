'use client';

import React, { useState } from 'react';
import { Compass, AlertCircle, Info, ShieldCheck, Ruler } from 'lucide-react';

export const SizingCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'mm' | 'in'>('mm');
  const [baseCircumference, setBaseCircumference] = useState<number>(140); // mm
  const [flaccidLength, setFlaccidLength] = useState<number>(65); // mm
  const [anatomyType, setAnatomyType] = useState<'standard' | 'high_scrotum' | 'relaxed'>('standard');

  // Calculations
  const calculatedCircumferenceMm = unit === 'in' ? baseCircumference * 25.4 : baseCircumference;
  const calculatedLengthMm = unit === 'in' ? flaccidLength * 25.4 : flaccidLength;

  const rawDiameterMm = calculatedCircumferenceMm / Math.PI;

  // Round up to standard device ring increments (usually 40, 42, 45, 48, 50, 52, 55mm)
  const standardRings = [40, 42, 45, 48, 50, 52, 55];
  const recommendedRing = standardRings.find(r => r >= rawDiameterMm) || 55;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Fit & Ergonomics</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Anatomical Sizing & Fit Assessment
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Proper fit is the fundamental barrier against tissue ischemia, pinching, and nerve injury. Use this calculator to determine your baseline dimensions.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Input Form (5 cols) */}
        <div className="md:col-span-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h2 className="font-bold text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Anatomical Measurements</span>
            </h2>
            <div className="flex rounded-lg border border-stone-200 dark:border-stone-700 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (unit === 'in') {
                    setBaseCircumference(Math.round(baseCircumference * 25.4));
                    setFlaccidLength(Math.round(flaccidLength * 25.4));
                    setUnit('mm');
                  }
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  unit === 'mm'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                mm
              </button>
              <button
                type="button"
                onClick={() => {
                  if (unit === 'mm') {
                    setBaseCircumference(Number((baseCircumference / 25.4).toFixed(1)));
                    setFlaccidLength(Number((flaccidLength / 25.4).toFixed(1)));
                    setUnit('in');
                  }
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  unit === 'in'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                inches
              </button>
            </div>
          </div>

          {/* Base Circumference */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                1. Base Circumference (Behind Testicles)
              </label>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {baseCircumference} {unit}
              </span>
            </div>
            <input
              type="range"
              min={unit === 'mm' ? 100 : 4}
              max={unit === 'mm' ? 200 : 8}
              step={unit === 'mm' ? 1 : 0.1}
              value={baseCircumference}
              onChange={e => setBaseCircumference(parseFloat(e.target.value))}
              aria-label="Base Circumference (Behind Testicles)"
              className="w-full accent-emerald-600"
            />
            <p className="text-[11px] text-stone-700 dark:text-stone-300">
              Measure around the shaft base and behind both testicles while relaxed.
            </p>
          </div>

          {/* Flaccid Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                2. Flaccid Penile Length
              </label>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {flaccidLength} {unit}
              </span>
            </div>
            <input
              type="range"
              min={unit === 'mm' ? 30 : 1.2}
              max={unit === 'mm' ? 120 : 4.8}
              step={unit === 'mm' ? 1 : 0.1}
              value={flaccidLength}
              onChange={e => setFlaccidLength(parseFloat(e.target.value))}
              aria-label="Flaccid Penile Length"
              className="w-full accent-emerald-600"
            />
            <p className="text-[11px] text-stone-700 dark:text-stone-300">
              Measure from pubic bone to tip of glans in a normal room temperature setting.
            </p>
          </div>

          {/* Scrotal Anatomy */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              3. Scrotal & Testicular Position
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'standard', label: 'Average' },
                { id: 'high_scrotum', label: 'High / Tight' },
                { id: 'relaxed', label: 'Low / Relaxed' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnatomyType(opt.id as any)}
                  className={`py-2 px-2 rounded-xl border text-center font-medium transition-colors ${
                    anatomyType === opt.id
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Recommendation (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-6 shadow-md border border-stone-800 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Recommended Fit Profile
              </span>
              <span className="text-[11px] text-stone-400">Safe Sizing Margin Included</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-stone-800/60 rounded-xl border border-stone-700/60 space-y-1">
                <span className="text-[11px] text-stone-400 block">Recommended Ring Diameter</span>
                <span className="text-2xl font-black tracking-tight text-white">
                  {recommendedRing} mm
                </span>
                <span className="text-[10px] text-stone-400 block">
                  (Calculated: ~{rawDiameterMm.toFixed(1)} mm)
                </span>
              </div>

              <div className="p-3.5 bg-stone-800/60 rounded-xl border border-stone-700/60 space-y-1">
                <span className="text-[11px] text-stone-400 block">Optimal Cage Length</span>
                <span className="text-2xl font-black tracking-tight text-white">
                  {calculatedLengthMm < 55 ? 'Nano / Micro' : calculatedLengthMm < 75 ? 'Standard' : 'Maxi / Long'}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  (~{Math.round(calculatedLengthMm)} mm depth)
                </span>
              </div>
            </div>

            {/* Spacer Guidance */}
            <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-xs space-y-1.5 text-emerald-200">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Spacer Recommendation:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-200/90">
                {anatomyType === 'high_scrotum'
                  ? 'Your anatomy indicates a higher scrotal attachment. Use a wider spacer pin (at least 6-8mm) to prevent pinching the scrotum when sitting down.'
                  : anatomyType === 'relaxed'
                  ? 'Lower scrotal hang requires careful attention that testicles do not slip partially into ring gaps. Use a 4-6mm spacer.'
                  : 'Standard 4-6mm spacer clearance recommended. Ensure no skin folds get trapped in pin joints.'}
              </p>
            </div>
          </div>

          {/* Golden Rules Callout */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-5 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>The "Golden Sizing Rules"</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside pl-1 text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
              <li><strong>The Rule of Two Sizes:</strong> When purchasing your first device, order one size larger than your calculation if you fall between standard ring sizes.</li>
              <li><strong>Test While Sitting:</strong> When testing a new ring, sit in a low chair and bend forward. If sharp pressure or pinch occurs in the groin, the ring is either too small or the spacer is too narrow.</li>
              <li><strong>Zero Numbness Tolerance:</strong> A device should never feel like a tight rubber band cutting off circulation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
