'use client';

import React from 'react';
import { X, AlertOctagon, PhoneCall, ShieldAlert, Scissors, Droplet, Sparkles } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-protocol-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a030c]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#1c1026] border border-rose-900/60 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-[#fae8d7] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-rose-950/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/80 text-rose-400 rounded-2xl border border-rose-800">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h2
                id="emergency-protocol-title"
                className="text-xl font-bold text-rose-300 tracking-tight"
              >
                Emergency Release & Harm Reduction Protocol
              </h2>
              <p className="text-xs text-[#b59ebf]">
                Actionable steps for severe pain, entrapment swelling, numbness, or jammed locks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors"
            aria-label="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Red Flag Warning */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>Do NOT wait if you observe any of the following:</span>
          </div>
          <ul className="text-xs text-rose-200/90 space-y-1 list-disc list-inside pl-2">
            <li><strong>Discoloration:</strong> Blue, purple, dusky, or pale/white skin.</li>
            <li><strong>Loss of Sensation:</strong> Numbness, "pins and needles", or inability to feel touch.</li>
            <li><strong>Urinary Retention:</strong> Severe bladder fullness with physical inability to void urine.</li>
            <li><strong>Severe Edema (Swelling):</strong> Skin bulging over the ring edges that cannot be pushed back.</li>
          </ul>
        </div>

        {/* Step-by-Step De-escalation Protocol */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#fae8d7]">
            Immediate De-escalation Steps (If key is lost or jammed)
          </h3>

          {/* Step 1: Vasoconstriction */}
          <div className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#fae8d7]">
              <span className="w-6 h-6 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] flex items-center justify-center text-xs font-bold">1</span>
              <span>Induce Vasoconstriction (Reduce Swelling)</span>
            </div>
            <p className="text-xs text-[#b59ebf] pl-8 leading-relaxed">
              Swelling is caused by vascular engorgement. Lie flat on your back to reduce venous pressure. Apply an <strong>ice pack wrapped in a thin towel</strong> to the surrounding inguinal and upper thigh area for 10-15 minutes. <em>Never put bare ice directly against sensitive genital skin.</em>
            </p>
          </div>

          {/* Step 2: Lubrication Glide */}
          <div className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#fae8d7]">
              <span className="w-6 h-6 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] flex items-center justify-center text-xs font-bold">2</span>
              <span>Generous Lubrication Application</span>
            </div>
            <p className="text-xs text-[#b59ebf] pl-8 leading-relaxed">
              Coat all skin around the base ring with liquid soap, chilled olive oil, or copious water-based lubricant. Gently push skin folds back beneath the ring while attempting to manipulate the lock or spacer.
            </p>
          </div>

          {/* Step 3: Mechanical Cutting (Materials Guide) */}
          <div className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#fae8d7]">
              <span className="w-6 h-6 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] flex items-center justify-center text-xs font-bold">3</span>
              <span>Emergency Cutting Tools</span>
            </div>
            <div className="text-xs text-[#b59ebf] pl-8 space-y-1.5 leading-relaxed">
              <p>
                <strong>Plastic / Resin / Silicone Cages:</strong> Can be cut using heavy EMT trauma shears, wire nippers, or a miniature hacksaw blade. Slip a protective plastic butter knife or tongue depressor underneath the band to shield skin before cutting.
              </p>
              <p>
                <strong>Solid Steel Cages:</strong> Require small bolt cutters (8-10 inch) applied to the base ring. If you do not possess these tools, proceed immediately to an Emergency Room.
              </p>
            </div>
          </div>

          {/* Step 4: Hospital / ER Guidance */}
          <div className="p-4 rounded-2xl bg-[#251433] border border-[#4a2c59] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#fae8d7]">
              <PhoneCall className="w-4 h-4 text-[#d94f6f]" />
              <span>Seeking Medical Care (Zero Shame Assurance)</span>
            </div>
            <p className="text-xs text-[#b59ebf] leading-relaxed">
              Emergency room physicians and nurses frequently encounter trapped rings, jewelry, and constriction devices. They possess dedicated hydraulic and high-speed rotary ring-cutters designed to remove metal bands in seconds without skin trauma. <strong>Do not let embarrassment risk permanent nerve damage or tissue ischemia.</strong>
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white transition-transform hover:scale-[1.01]"
          >
            I Understand This Emergency Protocol (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
