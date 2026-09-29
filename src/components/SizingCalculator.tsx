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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Fit & Ergonomics</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Anatomical Sizing & Fit Assessment
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Proper fit is the fundamental barrier against tissue ischemia, pinching, and nerve injury. Use this calculator to determine your baseline dimensions.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="md:col-span-6 bg-[#1c1026] border border-[#381e47] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#251433] pb-3">
            <h2 className="font-bold text-sm text-[#fae8d7] flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#d94f6f]" />
              <span>Anatomical Measurements</span>
            </h2>
            <div className="flex rounded-xl border border-[#381e47] bg-[#0f0714] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (unit === 'in') {
                    setBaseCircumference(Math.round(baseCircumference * 25.4));
                    setFlaccidLength(Math.round(flaccidLength * 25.4));
                    setUnit('mm');
                  }
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  unit === 'mm'
                    ? 'bg-[#d94f6f] text-white shadow-xs'
                    : 'text-[#b59ebf] hover:text-[#fae8d7]'
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
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  unit === 'in'
                    ? 'bg-[#d94f6f] text-white shadow-xs'
                    : 'text-[#b59ebf] hover:text-[#fae8d7]'
                }`}
              >
                inches
              </button>
            </div>
          </div>

          {/* Base Circumference */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#fae8d7]">
                1. Base Circumference (Behind Testicles)
              </label>
              <span className="font-mono font-bold text-[#d94f6f]">
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
              className="w-full accent-[#d94f6f]"
            />
            <p className="text-[11px] text-[#b59ebf]">
              Measure around the shaft base and behind both testicles while relaxed.
            </p>
          </div>

          {/* Flaccid Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#fae8d7]">
                2. Flaccid Penile Length
              </label>
              <span className="font-mono font-bold text-[#d94f6f]">
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
              className="w-full accent-[#d94f6f]"
            />
            <p className="text-[11px] text-[#b59ebf]">
              Measure from pubic bone to tip of glans in a normal room temperature setting.
            </p>
          </div>

          {/* Scrotal Anatomy */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#fae8d7]">
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
                      ? 'border-[#d94f6f] bg-[#251433] text-[#fae8d7]'
                      : 'border-[#381e47] bg-[#0f0714] text-[#b59ebf] hover:text-[#fae8d7]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Recommendation */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-[#1c1026] text-[#fae8d7] rounded-3xl p-6 shadow-md border border-[#381e47] space-y-5">
            <div className="flex items-center justify-between border-b border-[#251433] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#d94f6f] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Recommended Fit Profile
              </span>
              <span className="text-[11px] text-[#b59ebf]">Safety Margin Included</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#0f0714] rounded-2xl border border-[#381e47] space-y-1">
                <span className="text-[11px] text-[#b59ebf] block">Recommended Ring</span>
                <span className="text-2xl font-black tracking-tight text-[#fae8d7]">
                  {recommendedRing} mm
                </span>
                <span className="text-[10px] text-[#b59ebf] block">
                  (Calculated: ~{rawDiameterMm.toFixed(1)} mm)
                </span>
              </div>

              <div className="p-4 bg-[#0f0714] rounded-2xl border border-[#381e47] space-y-1">
                <span className="text-[11px] text-[#b59ebf] block">Optimal Cage Length</span>
                <span className="text-2xl font-black tracking-tight text-[#fae8d7]">
                  {calculatedLengthMm < 55 ? 'Nano / Micro' : calculatedLengthMm < 75 ? 'Standard' : 'Maxi / Long'}
                </span>
                <span className="text-[10px] text-[#b59ebf] block">
                  (~{Math.round(calculatedLengthMm)} mm depth)
                </span>
              </div>
            </div>

            {/* Spacer Guidance */}
            <div className="p-4 bg-[#251433] rounded-2xl border border-[#4a2c59] text-xs space-y-1 text-[#fae8d7]">
              <div className="font-bold text-[#d94f6f] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Spacer Recommendation:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#b59ebf]">
                {anatomyType === 'high_scrotum'
                  ? 'Your anatomy indicates higher scrotal attachment. Use a wider spacer pin (at least 6-8mm) to prevent pinching when sitting.'
                  : anatomyType === 'relaxed'
                  ? 'Lower scrotal hang requires ensuring testicles do not slip into ring gaps. Use a 4-6mm spacer.'
                  : 'Standard 4-6mm spacer clearance recommended. Ensure no skin folds get trapped in pin joints.'}
              </p>
            </div>
          </div>

          {/* Golden Rules Callout */}
          <div className="bg-[#251433] border border-[#4a2c59] rounded-3xl p-5 space-y-2 text-xs text-[#fae8d7]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#d94f6f]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>The "Golden Sizing Rules"</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside pl-1 text-[#b59ebf] leading-relaxed">
              <li><strong>The Rule of Two Sizes:</strong> When purchasing your first device, order one size larger than your calculation if you fall between sizes.</li>
              <li><strong>Test While Sitting:</strong> When testing a new ring, sit in a low chair and bend forward. If sharp pressure or pinch occurs in the groin, the ring is either too small or the spacer is too narrow.</li>
              <li><strong>Zero Numbness Tolerance:</strong> A device should never feel like a tight rubber band cutting off circulation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
