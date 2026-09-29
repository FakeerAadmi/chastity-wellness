'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Key,
  HelpCircle,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { OnboardingState } from '@/types';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<OnboardingState>({
    role: '',
    experienceLevel: '',
    primaryGoal: 'Deepening partner intimacy and vulnerability',
    healthConcerns: [],
    safeword: 'RED',
    checkInInterval: 'Daily during morning shower',
    emergencyKeyPlan: 'Spare key in a sealed tamper-evident envelope on nightstand'
  });

  if (!isOpen) return null;

  const toggleHealthConcern = (item: string) => {
    setFormData(prev => {
      const exists = prev.healthConcerns.includes(item);
      return {
        ...prev,
        healthConcerns: exists
          ? prev.healthConcerns.filter(i => i !== item)
          : [...prev.healthConcerns, item]
      };
    });
  };

  const handleCopySummary = () => {
    const text = `HAVEN CHASTITY & WELLNESS - PERSONAL SAFETY CHARTER
-------------------------------------------------------
Role: ${formData.role || 'Explorer'}
Experience Level: ${formData.experienceLevel || 'Beginner'}
Primary Intention: ${formData.primaryGoal}

SAFETY & PHYSIOLOGICAL CHECKS:
${formData.healthConcerns.length > 0 ? formData.healthConcerns.map(c => `- ${c}`).join('\n') : '- No specific pre-existing risk conditions reported'}

COMMUNICATION & EMERGENCY AGREEMENT:
- Designated Safeword: ${formData.safeword} (Immediate non-punitive release guaranteed)
- Daily Check-In Routine: ${formData.checkInInterval}
- Fail-Safe Emergency Plan: ${formData.emergencyKeyPlan}

CORE PACT:
We agree that physical health, skin integrity, and continuous consent override all psychological play. Release is always supported upon safeword or medical discomfort without guilt.
-------------------------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-wizard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-stone-900 dark:text-stone-100 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Step {step} of 5 &bull; Safe Exploration Roadmap
            </span>
            <h2 id="onboarding-wizard-title" className="text-lg font-bold tracking-tight">
              {step === 1 && 'Define Your Role & Dynamic'}
              {step === 2 && 'Intentions & Experience'}
              {step === 3 && 'Physiological & Health Assessment'}
              {step === 4 && 'Safewords & Emergency Agreements'}
              {step === 5 && 'Your Personal Safety & Wellness Charter'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Chastity is explored across diverse individual and partnered contexts. Which profile best reflects your current path?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    id: 'wearer',
                    title: 'Wearer (Partnered)',
                    desc: 'Exploring erotic surrender and emotional trust with a keyholder partner.',
                    icon: LockIcon
                  },
                  {
                    id: 'keyholder',
                    title: 'Keyholder (Partnered)',
                    desc: 'Holding the key for your partner and seeking ethical, safe guidance.',
                    icon: Key
                  },
                  {
                    id: 'solo',
                    title: 'Solo Explorer / Self-Lock',
                    desc: 'Practicing for mindfulness, self-discipline, body awareness, or fantasy.',
                    icon: ShieldCheck
                  },
                  {
                    id: 'curious',
                    title: 'Curious Learner',
                    desc: 'Researching the lifestyle, health aspects, and science before deciding.',
                    icon: HelpCircle
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setFormData({ ...formData, role: item.id as any })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.role === item.id
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                        {item.title}
                      </span>
                      {formData.role === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  What is your experience level?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'beginner', label: 'Complete Beginner' },
                    { id: 'intermediate', label: 'Some Practice (<6 mo)' },
                    { id: 'experienced', label: 'Experienced (>6 mo)' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl.id as any })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-colors ${
                        formData.experienceLevel === lvl.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Primary Motivation & Intention
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={e => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Deepening partner intimacy and vulnerability">
                    Deepening partner intimacy and mutual trust
                  </option>
                  <option value="Mindfulness, self-control, and reducing compulsive habits">
                    Mindfulness, self-control, and reducing compulsive habits
                  </option>
                  <option value="Erotic anticipation, teasing, and orgasm control">
                    Erotic anticipation, sensual teasing, and orgasm control
                  </option>
                  <option value="Exploration of consensual power exchange (BDSM/Kink)">
                    Exploration of consensual power exchange (BDSM/Kink)
                  </option>
                  <option value="General curiosity and anatomical understanding">
                    General curiosity and anatomical understanding
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Safety requires honoring your body's physical limits. Check any physiological factors that apply to adjust your safety plan:
              </p>

              <div className="space-y-2.5 pt-1">
                {[
                  {
                    id: 'allergies',
                    title: 'Sensitive Skin or Nickel / Metal Allergies',
                    desc: 'Demands certified surgical 316L steel, titanium, or medical-grade platinum silicone.'
                  },
                  {
                    id: 'circulation',
                    title: 'Circulatory / Vascular Sensitivity (e.g. Raynaud’s, Diabetes)',
                    desc: 'Requires wider base rings, frequent daytime inspections, and shorter wear durations.'
                  },
                  {
                    id: 'nocturnal',
                    title: 'Strong Involuntary Nighttime Erections',
                    desc: 'Requires verifying nocturnal tumescence tolerance during daytime naps before overnight wear.'
                  },
                  {
                    id: 'active_lifestyle',
                    title: 'Physical Labor or Intense Sports Routine',
                    desc: 'Requires moisture-wicking undergarments, anti-chafing balm, and lightweight resin/silicone.'
                  }
                ].map(item => {
                  const checked = formData.healthConcerns.includes(item.title);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleHealthConcern(item.title)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        checked
                          ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 dark:border-emerald-600'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 dark:border-stone-700'
                      }`}>
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-stone-700 dark:text-stone-300">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Ethical practice requires clear protocols. Establish your boundaries and emergency release mechanism:
              </p>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Designated Safeword (Instant, Non-Debatable Release)
                  </label>
                  <input
                    type="text"
                    value={formData.safeword}
                    onChange={e => setFormData({ ...formData, safeword: e.target.value })}
                    placeholder="e.g. RED, MAYDAY, MERCY"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                  <span className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 block">
                    When spoken, the wearer must be released without argument or emotional penalty.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Daily Hygiene & Check-In Window
                  </label>
                  <input
                    type="text"
                    value={formData.checkInInterval}
                    onChange={e => setFormData({ ...formData, checkInInterval: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Fail-Safe Emergency Key Strategy
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyKeyPlan}
                    onChange={e => setFormData({ ...formData, emergencyKeyPlan: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 block">
                    Always keep a spare key or shears accessible in case of sudden partner incapacitation or jammed lock.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Personal Safety Charter Complete!</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Your customized safety profile is ready. You can review and copy this agreement to share with your partner or keep as your personal foundation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 font-mono text-xs space-y-2.5 text-stone-800 dark:text-stone-200">
                <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300">
                    Summary Card
                  </span>
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>

                <div>
                  <span className="text-stone-700 dark:text-stone-300">Dynamic: </span>
                  <span className="font-semibold capitalize">{formData.role || 'Explorer'} ({formData.experienceLevel || 'Beginner'})</span>
                </div>
                <div>
                  <span className="text-stone-700 dark:text-stone-300">Focus: </span>
                  <span>{formData.primaryGoal}</span>
                </div>
                <div>
                  <span className="text-stone-700 dark:text-stone-300">Safeword: </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{formData.safeword}</span>
                </div>
                <div>
                  <span className="text-stone-700 dark:text-stone-300">Check-in Routine: </span>
                  <span>{formData.checkInInterval}</span>
                </div>
                <div>
                  <span className="text-stone-700 dark:text-stone-300">Emergency Plan: </span>
                  <span>{formData.emergencyKeyPlan}</span>
                </div>
                {formData.healthConcerns.length > 0 && (
                  <div>
                    <span className="text-stone-700 dark:text-stone-300">Health Awareness: </span>
                    <ul className="list-disc list-inside text-amber-700 dark:text-amber-400 pl-2">
                      {formData.healthConcerns.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="p-4 sm:p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Finish & Explore Haven</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
