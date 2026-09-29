import React, { useState } from 'react';
import { Ritual, RitualStep, RitualCompletion, RitualStepResponse } from '@/types/domain';
import {
  X,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface RitualExecutionModalProps {
  ritual: Ritual | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onCompleteRitual: (completedRitual: Ritual) => void;
}

export const RitualExecutionModal: React.FC<RitualExecutionModalProps> = ({
  ritual,
  isOpen,
  onClose,
  currentUserId = 'usr_alex',
  onCompleteRitual,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepResponses, setStepResponses] = useState<Record<string, { selectedOption?: string; note?: string }>>({});
  const [currentNote, setCurrentNote] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isInterrupted, setIsInterrupted] = useState<boolean>(false);
  const [interruptionMessage, setInterruptionMessage] = useState<string>('');

  if (!isOpen || !ritual) return null;

  const steps: RitualStep[] = ritual.steps && ritual.steps.length > 0 ? ritual.steps : [
    {
      id: 'default_step_1',
      order: 1,
      title: 'Practice & Intention Check',
      prompt: 'Reflect on your present intention and confirm willingness to continue.',
      inputType: 'acknowledgement',
      isRequired: true,
    }
  ];

  const currentStep = steps[currentStepIdx] || steps[0];
  const isLastStep = currentStepIdx === steps.length - 1;

  const handleNextStep = () => {
    const now = new Date().toISOString();
    const newResponses = {
      ...stepResponses,
      [currentStep.id]: {
        selectedOption: selectedOption || undefined,
        note: currentNote || undefined,
      },
    };
    setStepResponses(newResponses);

    if (isLastStep) {
      // Complete the ritual
      const formattedResponses: RitualStepResponse[] = Object.entries(newResponses).map(([sId, r]) => ({
        stepId: sId,
        selectedOption: r.selectedOption,
        note: r.note,
        completedAt: now,
      }));

      const newCompletion: RitualCompletion = {
        id: `cmp_${Date.now()}`,
        completedAt: now,
        completedBy: currentUserId,
        stepResponses: formattedResponses,
        stoppedEarly: false,
        note: 'Completed full ritual practice.',
        emotionalState: selectedOption || 'grounded',
      };

      const updatedRitual: Ritual = {
        ...ritual,
        completions: [newCompletion, ...ritual.completions],
        updatedAt: now,
      };

      onCompleteRitual(updatedRitual);
      onClose();
    } else {
      setCurrentStepIdx(prev => prev + 1);
      setSelectedOption('');
      setCurrentNote('');
    }
  };

  const handleInterrupt = (reason: string) => {
    const now = new Date().toISOString();
    const newCompletion: RitualCompletion = {
      id: `cmp_${Date.now()}`,
      completedAt: now,
      completedBy: currentUserId,
      stoppedEarly: true,
      interruptedReason: reason,
      note: `Ritual halted: ${reason}`,
    };

    const updatedRitual: Ritual = {
      ...ritual,
      completions: [newCompletion, ...ritual.completions],
      updatedAt: now,
    };

    onCompleteRitual(updatedRitual);
    setIsInterrupted(true);
    setInterruptionMessage(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#141211] border border-[#382f2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2422] bg-[#1a1715] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                Step {currentStepIdx + 1} of {steps.length} • Practice Runner
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#fae8d7]">{ritual.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8c827a] hover:text-[#fae8d7] hover:bg-[#25201d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#201c1a] h-1">
          <div
            className="bg-[#d4af37] h-full transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Body Canvas */}
        <div className="p-6 space-y-6">
          {isInterrupted ? (
            <div className="p-6 rounded-xl bg-yellow-950/20 border border-yellow-800/30 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto" />
              <h3 className="text-base font-bold text-[#fae8d7]">Practice Stopped Without Penalty</h3>
              <p className="text-xs text-[#a89f91] max-w-md mx-auto leading-relaxed">
                You chose to pause/stop this ritual instance ({interruptionMessage}). Your underlying agreements, boundaries, and safewords remain unconditionally respected.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-[#25201d] text-[#fae8d7] text-xs font-semibold hover:bg-[#302925]"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step Title & Prompt */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  {currentStep.title}
                </span>
                <p className="text-base text-[#fae8d7] leading-relaxed">
                  {currentStep.prompt}
                </p>
              </div>

              {/* Options Selector if available */}
              {currentStep.options && currentStep.options.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#a89f91] uppercase tracking-wider">
                    Select your current response:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentStep.options.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                          selectedOption === opt
                            ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                            : 'bg-[#181513] border-[#2e2624] text-[#a89f91] hover:border-[#3d3430]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Input if requested */}
              {(currentStep.inputType === 'text' || (!currentStep.options && currentStep.inputType !== 'acknowledgement')) && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-[#a89f91] uppercase tracking-wider">
                    Notes / Reflection (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter any reflection or observation..."
                    value={currentNote}
                    onChange={e => setCurrentNote(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#141210] border border-[#2e2624] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              {/* Acknowledgement Checkbox */}
              {currentStep.inputType === 'acknowledgement' && (
                <div
                  onClick={() => setSelectedOption(selectedOption ? '' : 'Acknowledged')}
                  className="p-4 rounded-xl bg-[#181513] border border-[#2e2624] flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOption === 'Acknowledged'}
                    onChange={() => {}}
                    className="accent-[#d4af37]"
                  />
                  <span className="text-xs text-[#fae8d7] font-medium">
                    I acknowledge and have completed this step.
                  </span>
                </div>
              )}

              {/* Interruption Safety Strip */}
              <div className="p-3.5 rounded-xl bg-[#1a1715] border border-[#2e2624] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#8c827a]">Feeling overwhelmed or want to halt?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleInterrupt('Paused by participant')}
                    className="px-2.5 py-1 rounded bg-[#25201d] hover:bg-yellow-950/30 text-yellow-300 border border-yellow-800/30 text-[11px] font-semibold transition-colors"
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInterrupt("I don't want to continue")}
                    className="px-2.5 py-1 rounded bg-[#25201d] hover:bg-rose-950/30 text-rose-300 border border-rose-800/30 text-[11px] font-semibold transition-colors"
                  >
                    I don&apos;t want to continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isInterrupted && (
          <div className="px-6 py-4 border-t border-[#2a2422] bg-[#1a1715] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#8c827a] hover:text-[#fae8d7]"
            >
              Cancel Practice
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#e6c250] flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>{isLastStep ? 'Complete Ritual' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
