import React, { useState } from 'react';
import {
  Session,
  SessionType,
  Dynamic,
  Relationship,
  Agreement,
  User,
  ParticipantReadiness,
} from '@/types/domain';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface SessionCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  dynamics: Dynamic[];
  agreements: Agreement[];
  users: User[];
  currentUserId?: string;
  initialRelationshipId?: string;
  initialDynamicId?: string;
  onCreateSession: (session: Session) => void;
}

export const SessionCreationModal: React.FC<SessionCreationModalProps> = ({
  isOpen,
  onClose,
  relationships,
  dynamics,
  agreements,
  users,
  currentUserId = 'usr_alex',
  initialRelationshipId,
  initialDynamicId,
  onCreateSession,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [relationshipId, setRelationshipId] = useState<string>(
    initialRelationshipId || (relationships[0]?.id ?? '')
  );
  const [dynamicId, setDynamicId] = useState<string>(initialDynamicId || '');
  const [agreementId, setAgreementId] = useState<string>('');
  const [sessionType, setSessionType] = useState<SessionType>('dynamic_practice');
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [scheduleType, setScheduleType] = useState<'now' | 'later' | 'no_fixed_time'>('now');
  const [scheduledFor, setScheduledFor] = useState('');
  const [intendedDurationMinutes, setIntendedDurationMinutes] = useState(60);
  const [preparationNotes, setPreparationNotes] = useState('');

  // Selected participants
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>(() => {
    const rel = relationships.find(r => r.id === (initialRelationshipId || relationships[0]?.id));
    return rel ? rel.participants.map(p => p.userId) : [currentUserId];
  });

  if (!isOpen) return null;

  const currentRelationship = relationships.find(r => r.id === relationshipId);
  const eligibleDynamics = dynamics.filter(d => d.relationshipId === relationshipId);
  const eligibleAgreements = agreements.filter(a => {
    if (a.relationshipId !== relationshipId) return false;
    if (dynamicId && a.dynamicId && a.dynamicId !== dynamicId) return false;
    return true;
  });

  const toggleParticipant = (userId: string) => {
    setSelectedParticipantIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleFinish = () => {
    const now = new Date().toISOString();
    const readiness: Record<string, ParticipantReadiness> = {};
    selectedParticipantIds.forEach(id => {
      readiness[id] = id === currentUserId ? 'ready' : 'ready';
    });

    const isStartingNow = scheduleType === 'now';

    const newSession: Session = {
      id: `ses_${Date.now()}`,
      title: title.trim() || 'Dynamic Practice Session',
      sessionType,
      relationshipId,
      dynamicId: dynamicId || undefined,
      agreementIds: agreementId ? [agreementId] : [],
      participantIds: selectedParticipantIds,
      scheduleType,
      scheduledFor: scheduleType === 'later' && scheduledFor ? scheduledFor : undefined,
      status: isStartingNow ? 'active' : 'planned',
      startedAt: isStartingNow ? now : undefined,
      intendedDurationMinutes,
      goal: goal.trim() || undefined,
      preparationNotes: preparationNotes.trim() || undefined,
      participantReadiness: readiness,
      wellnessChecks: [],
      emotionalCheckIns: [],
      createdAt: now,
      updatedAt: now,
    };

    onCreateSession(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#141211] border border-[#382f2d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2422] bg-[#1a1715] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
              Step {step} of 6 • Session Creator
            </span>
            <h2 className="text-lg font-bold text-[#fae8d7]">
              {step === 1 && 'Context & Agreement Reference'}
              {step === 2 && 'Session Type & Intention'}
              {step === 3 && 'Participants'}
              {step === 4 && 'Schedule & Duration'}
              {step === 5 && 'Preparation & Environment'}
              {step === 6 && 'Review & Confirm'}
            </h2>
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
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CONTEXT */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] text-xs text-[#a89f91] space-y-1">
                <strong className="text-[#fae8d7]">Bounded Practice Instance:</strong> A session connects a relationship, an optional dynamic (such as Chastity or Power Exchange), and an agreement compact.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Target Relationship *
                </label>
                <select
                  value={relationshipId}
                  onChange={e => {
                    const newRelId = e.target.value;
                    setRelationshipId(newRelId);
                    setDynamicId('');
                    setAgreementId('');
                    const rel = relationships.find(r => r.id === newRelId);
                    if (rel) {
                      setSelectedParticipantIds(rel.participants.map(p => p.userId));
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  {relationships.map(rel => (
                    <option key={rel.id} value={rel.id}>
                      {rel.name} ({rel.participants.length} Participants)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Associated Dynamic (Optional)
                </label>
                <select
                  value={dynamicId}
                  onChange={e => {
                    setDynamicId(e.target.value);
                    setAgreementId('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="">Relationship-wide (No specific dynamic)</option>
                  {eligibleDynamics.map(dyn => (
                    <option key={dyn.id} value={dyn.id}>
                      {dyn.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Governed by Agreement (Optional)
                </label>
                <select
                  value={agreementId}
                  onChange={e => setAgreementId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="">None (Independent session without agreement link)</option>
                  {eligibleAgreements.map(agr => (
                    <option key={agr.id} value={agr.id}>
                      {agr.title} ({agr.status})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-[#8c827a]">
                  Linking an agreement references safewords, limits, and rules without copying whole text into the session.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: SESSION TYPE & INTENTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Session Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'dynamic_practice', label: 'Dynamic Practice', desc: 'Active D/s scene, chastity wear, sensory play' },
                    { id: 'ritual', label: 'Ritual', desc: 'Repeatable shared habit or protocol' },
                    { id: 'check_in', label: 'Check-in', desc: 'Emotional, consent, or dynamic sync' },
                    { id: 'date_connection', label: 'Date / Connection', desc: 'Video date, dinner, undisturbed time' },
                    { id: 'aftercare', label: 'Aftercare', desc: 'Somatic grounding, cuddling, debrief' },
                    { id: 'custom', label: 'Custom', desc: 'Tailored experience' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSessionType(opt.id as SessionType)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        sessionType === opt.id
                          ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                          : 'bg-[#181513] border-[#2e2624] text-[#a89f91] hover:border-[#3d3430]'
                      }`}
                    >
                      <div className="font-semibold text-[#fae8d7] mb-0.5">{opt.label}</div>
                      <div className="text-[10px] text-[#8c827a] leading-tight">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Session Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chastity Check-in, Weekend D/s Protocol, Outside Play Reconnection"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Session Intention / Focus
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly state what you hope to experience or focus on..."
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#1a1715] border border-[#382f2d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PARTICIPANTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] text-xs text-[#a89f91]">
                Select who will participate in this session. Supports pairs, triads, or 1-on-1 subsets within larger relationships.
              </div>

              <div className="space-y-2">
                {currentRelationship?.participants.map(part => {
                  const uid = part.userId;
                  const user = users.find(u => u.id === uid);
                  const isChecked = selectedParticipantIds.includes(uid);

                  return (
                    <div
                      key={uid}
                      onClick={() => toggleParticipant(uid)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#1d1815] border-[#d4af37]/40'
                          : 'bg-[#181513] border-[#2e2624] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-[#d4af37]"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#fae8d7]">
                            {user?.displayName || part.displayName}
                          </div>
                          <div className="text-[11px] text-[#8c827a]">
                            {user?.username ? `@${user.username}` : ''}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#8c827a]">
                        {isChecked ? 'Participating' : 'Excluded'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE & DURATION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  When will this take place?
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'now', label: 'Start Now', desc: 'Sets session to Active immediately' },
                    { id: 'later', label: 'Schedule Later', desc: 'Set date & time' },
                    { id: 'no_fixed_time', label: 'No Fixed Time', desc: 'Save as Planned' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScheduleType(opt.id as 'now' | 'later' | 'no_fixed_time')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        scheduleType === opt.id
                          ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                          : 'bg-[#181513] border-[#2e2624] text-[#a89f91]'
                      }`}
                    >
                      <div className="font-semibold text-[#fae8d7] mb-0.5">{opt.label}</div>
                      <div className="text-[10px] text-[#8c827a]">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {scheduleType === 'later' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                    Scheduled Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={e => setScheduledFor(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Intended Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={intendedDurationMinutes}
                  onChange={e => setIntendedDurationMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: PREPARATION & NOTES */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] text-xs text-[#a89f91]">
                Optional preparation or environmental checklist. You do not need to share intimate details.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Preparation Notes / Checklist
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Warm room, tea prepared, heavy blankets by bedside, safety shears accessible..."
                  value={preparationNotes}
                  onChange={e => setPreparationNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#1a1715] border border-[#382f2d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & START */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#191614] border border-[#2e2624] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#d4af37]">
                    {sessionType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#8c827a]">
                    {scheduleType === 'now' ? 'Starts Immediately' : 'Will be Planned'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#fae8d7]">{title || 'Dynamic Practice Session'}</h3>

                {goal && (
                  <p className="text-xs text-[#a89f91] leading-relaxed">{goal}</p>
                )}

                <div className="pt-2 border-t border-[#2a2422] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8c827a]">
                  <span>Participants: {selectedParticipantIds.length} members</span>
                  <span>Duration: ~{intendedDurationMinutes} mins</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a2422] bg-[#1a1715] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#a89f91] hover:text-[#fae8d7] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2 && !title.trim()) {
                  setTitle('Dynamic Practice Session');
                }
                setStep(s => s + 1);
              }}
              className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#e6c250] flex items-center gap-1.5 transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{scheduleType === 'now' ? 'Start Session Now' : 'Save Planned Session'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
