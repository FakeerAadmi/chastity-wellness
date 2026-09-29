'use client';

import React, { useState, useEffect } from 'react';
import {
  Experience,
  ExperienceStep,
  ExperienceExecutionState,
  User
} from '@/types/domain';
import {
  X,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Heart,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Check
} from 'lucide-react';

interface ExperienceExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience;
  users: User[];
  currentUserId?: string;
  onUpdateExperience: (updated: Experience) => void;
  onOpenEmergency?: () => void;
}

export const ExperienceExecutionModal: React.FC<ExperienceExecutionModalProps> = ({
  isOpen,
  onClose,
  experience,
  users,
  currentUserId,
  onUpdateExperience,
  onOpenEmergency
}) => {
  // Initialize execution state if not already started
  const [executionState, setExecutionState] = useState<ExperienceExecutionState>(() => {
    if (experience.executionState) {
      return experience.executionState;
    }
    const initialStepId = experience.steps[0]?.id || '';
    return {
      currentStepId: initialStepId,
      stepHistory: [],
      startedAt: new Date().toISOString(),
      isPaused: false,
      safewordTriggered: false,
      aftercareCompleted: false,
      reflectionNotes: ''
    };
  });

  const [isPaused, setIsPaused] = useState<boolean>(executionState.isPaused || false);
  const [pauseReason, setPauseReason] = useState<string>('');
  const [showYellowModal, setShowYellowModal] = useState<boolean>(false);
  const [reflectionInput, setReflectionInput] = useState<string>(
    executionState.reflectionNotes || ''
  );
  const [inAftercareStage, setInAftercareStage] = useState<boolean>(
    executionState.aftercareCompleted || executionState.safewordTriggered || false
  );

  // Current step resolution
  const currentStep: ExperienceStep | undefined = experience.steps.find(
    s => s.id === executionState.currentStepId
  ) || experience.steps[0];

  const currentStepIndex = experience.steps.findIndex(s => s.id === currentStep?.id);
  const totalSteps = experience.steps.length;

  // Timer states
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(() => {
    return (currentStep?.durationMinutes || 0) * 60;
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(() => {
    return Boolean(currentStep?.durationMinutes && currentStep.durationMinutes > 0);
  });

  const resetTimerForStep = (step?: ExperienceStep) => {
    if (step?.durationMinutes && step.durationMinutes > 0) {
      setTimerSecondsRemaining(step.durationMinutes * 60);
      setIsTimerRunning(true);
    } else {
      setTimerSecondsRemaining(0);
      setIsTimerRunning(false);
    }
  };

  // Active countdown effect
  useEffect(() => {
    if (!isTimerRunning || isPaused || inAftercareStage) return;

    const interval = setInterval(() => {
      setTimerSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused, inAftercareStage]);

  if (!isOpen) return null;

  // Universal Unconditional Pause
  const handleTogglePause = (reason?: string) => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    setIsTimerRunning(false);
    if (reason) setPauseReason(reason);

    const updatedState: ExperienceExecutionState = {
      ...executionState,
      isPaused: nextPaused,
      pausedAt: nextPaused ? new Date().toISOString() : undefined
    };
    setExecutionState(updatedState);

    onUpdateExperience({
      ...experience,
      status: nextPaused ? 'paused' : 'in_progress',
      executionState: updatedState,
      updatedAt: new Date().toISOString()
    });
  };

  // Red Safeword: Hard immediate stop -> routes directly to Aftercare
  const handleSafewordRed = () => {
    setIsTimerRunning(false);
    setIsPaused(false);
    setInAftercareStage(true);

    const updatedState: ExperienceExecutionState = {
      ...executionState,
      safewordTriggered: true,
      safewordTriggeredBy: currentUserId,
      safewordType: 'red_stop',
      isPaused: false,
      completedAt: new Date().toISOString()
    };
    setExecutionState(updatedState);

    onUpdateExperience({
      ...experience,
      status: 'safeword_stopped',
      executionState: updatedState,
      updatedAt: new Date().toISOString()
    });
  };

  // Branch Option Selected
  const handleSelectBranchOption = (optionId: string, optionLabel: string, nextStepId?: string) => {
    if (!currentStep) return;

    const newHistory = [
      ...executionState.stepHistory,
      {
        stepId: currentStep.id,
        stepTitle: currentStep.title,
        completedAt: new Date().toISOString(),
        actorId: currentUserId,
        selectedOptionId: optionId,
        selectedOptionLabel: optionLabel
      }
    ];

    const targetStepId = nextStepId || currentStep.nextStepId;
    if (targetStepId && experience.steps.some(s => s.id === targetStepId)) {
      const targetStep = experience.steps.find(s => s.id === targetStepId);
      const updatedState: ExperienceExecutionState = {
        ...executionState,
        currentStepId: targetStepId,
        stepHistory: newHistory
      };
      setExecutionState(updatedState);
      resetTimerForStep(targetStep);
      onUpdateExperience({
        ...experience,
        status: 'in_progress',
        executionState: updatedState,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Reached the end -> enter Aftercare
      transitionToAftercare(newHistory);
    }
  };

  // Linear Next Step
  const handleNextStep = () => {
    if (!currentStep) return;

    const newHistory = [
      ...executionState.stepHistory,
      {
        stepId: currentStep.id,
        stepTitle: currentStep.title,
        completedAt: new Date().toISOString(),
        actorId: currentUserId
      }
    ];

    // Follow step's nextStepId or sequential next in array
    let nextStep: ExperienceStep | undefined;
    if (currentStep.nextStepId) {
      nextStep = experience.steps.find(s => s.id === currentStep.nextStepId);
    } else {
      nextStep = experience.steps[currentStepIndex + 1];
    }

    if (nextStep) {
      const updatedState: ExperienceExecutionState = {
        ...executionState,
        currentStepId: nextStep.id,
        stepHistory: newHistory
      };
      setExecutionState(updatedState);
      resetTimerForStep(nextStep);
      onUpdateExperience({
        ...experience,
        status: 'in_progress',
        executionState: updatedState,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Reached conclusion -> enter Aftercare
      transitionToAftercare(newHistory);
    }
  };

  const transitionToAftercare = (history = executionState.stepHistory) => {
    setInAftercareStage(true);
    setIsTimerRunning(false);

    const updatedState: ExperienceExecutionState = {
      ...executionState,
      stepHistory: history,
      completedAt: new Date().toISOString()
    };
    setExecutionState(updatedState);
    onUpdateExperience({
      ...experience,
      executionState: updatedState,
      updatedAt: new Date().toISOString()
    });
  };

  // Complete and Seal Reflection
  const handleCompleteExperience = () => {
    const updatedState: ExperienceExecutionState = {
      ...executionState,
      aftercareCompleted: true,
      reflectionNotes: reflectionInput,
      completedAt: new Date().toISOString()
    };
    setExecutionState(updatedState);

    onUpdateExperience({
      ...experience,
      status: executionState.safewordTriggered ? 'safeword_stopped' : 'completed',
      executionState: updatedState,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#110718] border border-[#3b1f4e] shadow-2xl overflow-hidden flex flex-col my-auto text-[#fae8d7]">
        {/* Safety & Grounding Top Bar */}
        <div className="px-6 py-3.5 bg-[#180a22] border-b border-[#2d1439] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-tight text-[#fae8d7] truncate">
              {experience.title}
            </span>
            <span className="hidden sm:inline text-[11px] text-[#b59ebf]">
              ({users.filter(u => experience.participantIds.includes(u.id)).map(u => u.displayName).join(' & ')})
            </span>
          </div>

          {/* Primary Safety Controls (Always Active) */}
          <div className="flex items-center gap-2">
            {/* Unconditional Pause Button */}
            <button
              onClick={() => handleTogglePause()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isPaused
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                  : 'bg-[#251433] text-[#fae8d7] border-[#381e47] hover:border-amber-400/60'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Universal Pause'}</span>
            </button>

            {/* Yellow Slow Down Trigger */}
            <button
              onClick={() => setShowYellowModal(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/50 transition-colors"
              title="Yellow: Slow down, check pacing"
            >
              Yellow
            </button>

            {/* Red Safeword: Instant Hard Stop */}
            <button
              onClick={handleSafewordRed}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 border border-rose-600 shadow-md shadow-rose-950 transition-all hover:scale-105"
              title="Red Safeword: Immediately halts all steps and shifts to aftercare without penalty"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safeword RED</span>
            </button>

            {/* Exit/Close Window */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Yellow Check-In Modal Overlay */}
        {showYellowModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full p-6 rounded-2xl bg-[#1c1026] border border-amber-500/50 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto text-amber-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-200">
                Safeword YELLOW Signaled
              </h3>
              <p className="text-xs text-[#d9cddb] leading-relaxed">
                A request to ease intensity, slow the tempo, or take a gentle breath. 
                Pacing adjustments are welcome at any moment without justification.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setShowYellowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  I Am Grounded, Continue
                </button>
                <button
                  onClick={() => {
                    setShowYellowModal(false);
                    handleTogglePause('Pacing pause requested');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#fae8d7] bg-[#2d1838] border border-[#3f2154] hover:bg-[#381e47] transition-colors"
                >
                  Take a 2-Minute Pause
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paused Grounding Breath Screen */}
        {isPaused && (
          <div className="p-8 bg-gradient-to-b from-[#241533] to-[#160b20] border-b border-amber-500/30 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-300">
              <Pause className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-200">
                {pauseReason ? `Journey Paused (${pauseReason})` : 'Journey Paused — Take a Breath'}
              </h3>
              <p className="text-xs text-[#b59ebf] max-w-md mt-1">
                There is zero rush. All timers and branch steps are frozen. 
                Check in with your partner, adjust positioning, or hydrate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleTogglePause()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md transition-all"
              >
                Resume Experience
              </button>
              <button
                onClick={() => transitionToAftercare()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/40 transition-colors"
              >
                Conclude Cleanly & Transition to Aftercare
              </button>
            </div>
          </div>
        )}

        {/* MAIN BODY: In Experience or Aftercare */}
        {!inAftercareStage ? (
          <div className="p-6 sm:p-10 space-y-8 flex-1">
            {/* Step Progress & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2d1838] pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#d94f6f] uppercase tracking-wider block font-semibold">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <h3 className="text-lg font-bold text-[#fae8d7]">
                  {currentStep?.title}
                </h3>
              </div>

              {/* Countdown Timer Display if duration configured */}
              {currentStep?.durationMinutes && currentStep.durationMinutes > 0 && (
                <div className="flex items-center gap-3 bg-[#1e102b] px-4 py-2 rounded-2xl border border-[#3b1f4e]">
                  <Clock className="w-4 h-4 text-[#d94f6f]" />
                  <span className="font-mono text-xl font-bold tracking-wider text-rose-200">
                    {formatTime(timerSecondsRemaining)}
                  </span>
                  <button
                    onClick={() => setIsTimerRunning(prev => !prev)}
                    className="p-1 rounded-lg text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
                    title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerSecondsRemaining((currentStep.durationMinutes || 0) * 60);
                      setIsTimerRunning(true);
                    }}
                    className="p-1 rounded-lg text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Contextual Role Banner */}
            {currentStep?.roleAssignment && currentStep.roleAssignment !== 'all' && (
              <div className="p-3 rounded-xl bg-[#251433]/70 border border-[#3b1f4e] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
                  <span className="text-[#b59ebf]">Focus for this step:</span>
                  <span className="font-bold text-rose-300 uppercase tracking-wide">
                    {currentStep.roleAssignment}
                  </span>
                </div>
                <span className="text-[11px] text-[#8c7896]">
                  Follow together at your own rhythm
                </span>
              </div>
            )}

            {/* Tactile Narrative & Sensory Guidance */}
            <div className="space-y-4">
              {currentStep?.description && (
                <p className="text-base text-[#d9cddb] leading-relaxed font-normal">
                  {currentStep.description}
                </p>
              )}

              {currentStep?.prompt && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#241334] to-[#1a0c26] border-l-4 border-l-[#d94f6f] border border-[#381e47] text-sm text-[#fae8d7] leading-relaxed font-serif italic">
                  &ldquo;{currentStep.prompt}&rdquo;
                </div>
              )}
            </div>

            {/* Decision Branching Options if stepType === 'decision_branch' */}
            {currentStep?.stepType === 'decision_branch' && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Choose Your Desired Path Forward</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentStep.options || []).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        handleSelectBranchOption(opt.id, opt.label, opt.nextStepId)
                      }
                      className="p-4 rounded-2xl bg-[#1e102b] hover:bg-[#281538] border border-purple-800/40 hover:border-purple-500 text-left transition-all space-y-2 group shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#fae8d7] group-hover:text-purple-200">
                          {opt.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      {opt.description && (
                        <p className="text-xs text-[#b59ebf] leading-relaxed">
                          {opt.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Linear Step Progression Footer */}
            {currentStep?.stepType !== 'decision_branch' && (
              <div className="pt-6 border-t border-[#2d1838] flex items-center justify-between">
                <span className="text-xs text-[#8c7896]">
                  Take as much time as desired before advancing.
                </span>

                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] hover:from-[#e25c7c] hover:to-[#8b4bf3] shadow-lg shadow-[#d94f6f]/25 transition-all hover:scale-[1.02]"
                >
                  <span>
                    {currentStepIndex + 1 >= totalSteps
                      ? 'Proceed to Aftercare'
                      : 'Next Step'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* AFTERCARE & REFLECTION SCREEN */
          <div className="p-6 sm:p-10 space-y-8 flex-1">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-700/60 flex items-center justify-center mx-auto text-rose-300">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#fae8d7]">
                {executionState.safewordTriggered
                  ? 'Safeword Respected — Grounding & Aftercare'
                  : 'Experience Complete — Transition & Integration'}
              </h3>
              <p className="text-xs text-[#b59ebf] leading-relaxed">
                Take time to return to baseline gently. Hydrate, provide warmth, hold space,
                and reflect on what you shared.
              </p>
            </div>

            {/* Essential Aftercare Checklist */}
            <div className="p-5 rounded-2xl bg-[#1b1025] border border-[#2d1838] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                Aftercare Essentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#d9cddb]">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#241334]/50 border border-[#3b1f4e]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Hydration (fresh water or warm tea)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#241334]/50 border border-[#3b1f4e]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Physical warmth (blanket, comfortable clothing)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#241334]/50 border border-[#3b1f4e]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Gentle tactile touch / reassuring presence</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#241334]/50 border border-[#3b1f4e]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Debrief feelings without judgment</span>
                </div>
              </div>
            </div>

            {/* Reflection Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Private Shared Reflections & Sensations
              </label>
              <textarea
                value={reflectionInput}
                onChange={e => setReflectionInput(e.target.value)}
                placeholder="What sensations, emotional shifts, or discoveries arose during this experience? (Saved to relationship history)..."
                rows={4}
                className="w-full rounded-2xl bg-[#1a0e24] border border-[#3b1f4e] p-4 text-xs text-[#fae8d7] placeholder-[#6b5277] focus:outline-none focus:border-[#d94f6f] resize-none leading-relaxed"
              />
            </div>

            {/* Concluding Action */}
            <div className="pt-4 border-t border-[#2d1838] flex items-center justify-between">
              {onOpenEmergency && executionState.safewordTriggered && (
                <button
                  onClick={onOpenEmergency}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/60 transition-colors"
                >
                  Open Emergency Harm-Reduction
                </button>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleCompleteExperience}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 shadow-md shadow-purple-900/40 transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Reflection & Seal Memory</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
