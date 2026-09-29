'use client';

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Key,
  HelpCircle,
  Copy,
  Check,
  Heart,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { OnboardingState } from '@/types';

interface OnboardingScreenProps {
  onComplete: () => void;
  onExit: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onExit
}) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<OnboardingState>({
    role: 'wearer',
    experienceLevel: 'beginner',
    primaryGoal: 'Deepening partner intimacy and vulnerability',
    healthConcerns: [],
    safeword: 'RED',
    checkInInterval: 'Daily during morning shower',
    emergencyKeyPlan: 'Spare key in a sealed tamper-evident envelope on nightstand'
  });

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
Role: ${formData.role.toUpperCase()} (${formData.experienceLevel.toUpperCase()})
Primary Focus: ${formData.primaryGoal}

COMMUNICATION & SAFEGUARDS:
- Mandatory Safeword: ${formData.safeword} (Immediate, non-punitive release guaranteed)
- Daily Check-In Routine: ${formData.checkInInterval}
- Fail-Safe Emergency Key: ${formData.emergencyKeyPlan}

HEALTH SCREENING:
${formData.healthConcerns.length > 0 ? formData.healthConcerns.map(c => `- ${c}`).join('\n') : '- No specific pre-existing circulatory or skin risks reported'}

MUTUAL PACT:
Physical health, skin integrity, and continuous consent override all psychological play. Release is always supported upon safeword or medical discomfort without guilt.
-------------------------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0714] text-[#fae8d7] flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#d94f6f]/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d94f6f] to-[#7c3aed] flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#fae8d7] block">
              Haven Onboarding
            </span>
            <span className="text-[10px] text-[#b59ebf] block">
              Step {step} of 5 &bull; Personal Safety Charter
            </span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="text-xs text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
        >
          Skip to Dashboard
        </button>
      </header>

      {/* Main Form Canvas */}
      <main className="max-w-2xl w-full mx-auto px-6 py-6 z-10 my-auto">
        {/* Progress bar */}
        <div className="w-full bg-[#251433] h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-[#d94f6f] to-[#be185d] h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d94f6f]">
                Step 1: Your Role & Perspective
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#fae8d7]">
                How do you approach chastity today?
              </h2>
              <p className="text-xs sm:text-sm text-[#b59ebf]">
                Whether you practice solo, hold the key for a partner, or are exploring with a keyholder, Haven customizes its guidance to your dynamic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                {
                  id: 'wearer',
                  title: 'Partnered Wearer',
                  desc: 'Exploring erotic surrender, trust, and intimacy with a keyholder partner.',
                  icon: Lock
                },
                {
                  id: 'keyholder',
                  title: 'Partnered Keyholder',
                  desc: 'Holding the key for your partner and seeking ethical, safe guidance.',
                  icon: Key
                },
                {
                  id: 'solo',
                  title: 'Solo Explorer / Self-Lock',
                  desc: 'Practicing for mindfulness, self-discipline, body awareness, or fantasy.',
                  icon: Shield
                },
                {
                  id: 'curious',
                  title: 'Curious Learner',
                  desc: 'Researching the lifestyle, health aspects, and science before taking steps.',
                  icon: HelpCircle
                }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = formData.role === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFormData({ ...formData, role: item.id as any })}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#251433] border-[#d94f6f] shadow-lg shadow-[#d94f6f]/15 ring-1 ring-[#d94f6f]'
                        : 'bg-[#1c1026] border-[#381e47] hover:border-[#4a2c59]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[#fae8d7]">{item.title}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#d94f6f]" />
                      ) : (
                        <Icon className="w-4 h-4 text-[#b59ebf]" />
                      )}
                    </div>
                    <p className="text-xs text-[#b59ebf] leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d94f6f]">
                Step 2: Intentions & Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#fae8d7]">
                What is your core aspiration?
              </h2>
              <p className="text-xs sm:text-sm text-[#b59ebf]">
                Chastity can be a tool for emotional intimacy, sensual mindfulness, or exploring consensual power exchange.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#fae8d7] uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'beginner', label: 'Beginner' },
                    { id: 'intermediate', label: 'Developing (<6 mo)' },
                    { id: 'experienced', label: 'Experienced (>6 mo)' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl.id as any })}
                      className={`py-3 px-3 rounded-xl text-xs font-semibold border text-center transition-colors ${
                        formData.experienceLevel === lvl.id
                          ? 'border-[#d94f6f] bg-[#251433] text-[#fae8d7]'
                          : 'border-[#381e47] bg-[#1c1026] text-[#b59ebf] hover:text-[#fae8d7]'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#fae8d7] uppercase tracking-wider mb-2">
                  Primary Relationship / Personal Motivation
                </label>
                <select
                  value={formData.primaryGoal}
                  onChange={e => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                >
                  <option value="Deepening partner intimacy and vulnerability">
                    Deepening partner intimacy, trust, and vulnerability
                  </option>
                  <option value="Sensual teasing, anticipation, and erotic control">
                    Sensual teasing, anticipation, and erotic control
                  </option>
                  <option value="Consensual Power Exchange & D/s Dynamic">
                    Consensual Power Exchange & D/s Dynamic
                  </option>
                  <option value="Mindfulness, self-control, and impulse reduction">
                    Mindfulness, self-control, and impulse reduction
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d94f6f]">
                Step 3: Physiological Health Screen
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#fae8d7]">
                Honor Your Body's Limits
              </h2>
              <p className="text-xs sm:text-sm text-[#b59ebf]">
                Physical safety always precedes kink. Select any factors that apply so we can customize your health alerts:
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'allergies',
                  title: 'Sensitive Skin / Metal Allergies (Nickel)',
                  desc: 'Requires certified surgical 316L steel, titanium, or medical platinum silicone.'
                },
                {
                  id: 'circulation',
                  title: 'Vascular / Circulation Sensitivity (Raynaud’s, Diabetes)',
                  desc: 'Requires larger ring diameters, frequent daily skin inspections, and shorter sessions.'
                },
                {
                  id: 'nocturnal',
                  title: 'Pronounced Involuntary Nocturnal Erections',
                  desc: 'Requires daytime nap verification before any overnight sleep attempts.'
                },
                {
                  id: 'active',
                  title: 'High Activity / Sports Routine',
                  desc: 'Requires moisture-wicking undergarments and lightweight resin/silicone materials.'
                }
              ].map(item => {
                const checked = formData.healthConcerns.includes(item.title);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleHealthConcern(item.title)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      checked
                        ? 'bg-[#251433] border-[#d94f6f]'
                        : 'bg-[#1c1026] border-[#381e47] hover:border-[#4a2c59]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 ${
                        checked
                          ? 'bg-[#d94f6f] border-[#d94f6f] text-white'
                          : 'border-[#4a2c59]'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#fae8d7] block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#b59ebf]">
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
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d94f6f]">
                Step 4: Non-Coercion Agreements
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#fae8d7]">
                Safewords & Emergency Key
              </h2>
              <p className="text-xs sm:text-sm text-[#b59ebf]">
                A sanctuary is founded on failsafes. Set your non-punitive release rules:
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#fae8d7] uppercase tracking-wider mb-1.5">
                  Designated Safeword (Immediate, Non-Debatable Release)
                </label>
                <input
                  type="text"
                  value={formData.safeword}
                  onChange={e => setFormData({ ...formData, safeword: e.target.value.toUpperCase() })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs font-mono font-bold text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f] uppercase"
                />
                <span className="text-[11px] text-[#b59ebf] mt-1 block">
                  When uttered, device must be opened without argument, guilt, or penalty.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#fae8d7] uppercase tracking-wider mb-1.5">
                  Daily Hygiene Window
                </label>
                <input
                  type="text"
                  value={formData.checkInInterval}
                  onChange={e => setFormData({ ...formData, checkInInterval: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#fae8d7] uppercase tracking-wider mb-1.5">
                  Sealed Emergency Key Storage
                </label>
                <input
                  type="text"
                  value={formData.emergencyKeyPlan}
                  onChange={e => setFormData({ ...formData, emergencyKeyPlan: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                />
                <span className="text-[11px] text-[#b59ebf] mt-1 block">
                  A spare key kept in a tamper-evident box provides peace of mind against panic or lock failures.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d94f6f]">
                Step 5: Your Safety Charter
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#fae8d7]">
                Your Foundation is Complete
              </h2>
              <p className="text-xs sm:text-sm text-[#b59ebf]">
                Review your mutual agreement. You can copy this summary to keep or share with your partner.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1c1026] border border-[#381e47] font-mono text-xs space-y-3 text-[#fae8d7]">
              <div className="flex justify-between items-center border-b border-[#381e47] pb-2">
                <span className="font-bold uppercase text-[10px] text-[#b59ebf]">
                  Agreement Summary
                </span>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 text-xs text-[#d94f6f] hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>

              <div>
                <span className="text-[#b59ebf]">Dynamic: </span>
                <span className="font-bold capitalize">{formData.role} ({formData.experienceLevel})</span>
              </div>
              <div>
                <span className="text-[#b59ebf]">Focus: </span>
                <span>{formData.primaryGoal}</span>
              </div>
              <div>
                <span className="text-[#b59ebf]">Safeword: </span>
                <span className="text-[#d94f6f] font-black">{formData.safeword}</span>
              </div>
              <div>
                <span className="text-[#b59ebf]">Daily Check-in: </span>
                <span>{formData.checkInInterval}</span>
              </div>
              <div>
                <span className="text-[#b59ebf]">Emergency Key: </span>
                <span>{formData.emergencyKeyPlan}</span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-[#251433] mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-[#381e47] text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] flex items-center gap-2 transition-colors"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white text-xs font-bold flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white text-xs font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-[#d94f6f]/25"
            >
              <span>Enter Sanctuary Workspace</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#b59ebf]/60 z-10">
        Confidential &bull; Zero Server Storage &bull; Safe, Sane, and Consensual
      </footer>
    </div>
  );
};
