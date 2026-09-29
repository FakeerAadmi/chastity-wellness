import React, { useState } from 'react';
import {
  CheckIn,
  Dynamic,
  Relationship,
  User,
  EmotionalCheckInDimension,
  ConsentCheckInDimension,
  DynamicCheckInDimension,
} from '@/types/domain';
import {
  X,
  Heart,
  Shield,
  MessageSquare,
} from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  dynamics: Dynamic[];
  users: User[];
  currentUserId?: string;
  initialRelationshipId?: string;
  initialDynamicId?: string;
  onSaveCheckIn: (checkIn: CheckIn) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  relationships,
  dynamics,
  users,
  currentUserId = 'usr_alex',
  initialRelationshipId,
  initialDynamicId,
  onSaveCheckIn,
}) => {
  const [relationshipId, setRelationshipId] = useState<string>(
    initialRelationshipId || (relationships[0]?.id ?? '')
  );
  const [dynamicId, setDynamicId] = useState<string>(initialDynamicId || '');
  const [targetUserId, setTargetUserId] = useState<string>('');

  // 3 Multi-dimensional scales
  const [emotionalDimension, setEmotionalDimension] = useState<EmotionalCheckInDimension>('good');
  const [consentDimension, setConsentDimension] = useState<ConsentCheckInDimension>('comfortable');
  const [dynamicDimension, setDynamicDimension] = useState<DynamicCheckInDimension>('working_well');

  // Free-form note
  const [freeformFeedback, setFreeformFeedback] = useState<string>('');

  if (!isOpen) return null;

  const currentRelationship = relationships.find(r => r.id === relationshipId);
  const eligibleDynamics = dynamics.filter(d => d.relationshipId === relationshipId);
  const otherParticipants = currentRelationship?.participants.filter(p => p.userId !== currentUserId) || [];
  const getUser = (uid: string) => users.find(u => u.id === uid);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    const newCheckIn: CheckIn = {
      id: `chk_${Date.now()}`,
      userId: currentUserId,
      relationshipId,
      dynamicId: dynamicId || undefined,
      targetUserId: targetUserId || undefined,
      type: dynamicId ? 'dynamic' : 'relationship',
      prompt: 'Multi-dimensional relationship pulse check',
      scaleResponse:
        emotionalDimension === 'good' && consentDimension === 'comfortable' && dynamicDimension === 'working_well'
          ? 'great'
          : emotionalDimension === 'need_support' || consentDimension === 'want_to_pause'
          ? 'need_support'
          : 'good',
      emotionalDimension,
      consentDimension,
      dynamicDimension,
      freeformFeedback: freeformFeedback.trim() || undefined,
      isPrivateToUser: false,
      createdAt: now,
    };

    onSaveCheckIn(newCheckIn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#141211] border border-[#382f2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2422] bg-[#1a1715] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
              Communication &amp; Boundary Pulse
            </span>
            <h2 className="text-lg font-bold text-[#fae8d7]">Relationship Check-in</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8c827a] hover:text-[#fae8d7] hover:bg-[#25201d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Context Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                Relationship *
              </label>
              <select
                value={relationshipId}
                onChange={e => {
                  setRelationshipId(e.target.value);
                  setDynamicId('');
                  setTargetUserId('');
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-xs focus:outline-none focus:border-[#d4af37]"
              >
                {relationships.map(rel => (
                  <option key={rel.id} value={rel.id}>
                    {rel.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                Associated Dynamic (Optional)
              </label>
              <select
                value={dynamicId}
                onChange={e => setDynamicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-xs focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">General Relationship Check-in</option>
                {eligibleDynamics.map(dyn => (
                  <option key={dyn.id} value={dyn.id}>
                    {dyn.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* If multi-person relationship, optional target partner */}
          {otherParticipants.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                Targeted Partner (Optional)
              </label>
              <select
                value={targetUserId}
                onChange={e => setTargetUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-xs focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">Entire relationship (All participants)</option>
                {otherParticipants.map(part => (
                  <option key={part.userId} value={part.userId}>
                    1-on-1 for {part.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dimension 1: Emotional State */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fae8d7]">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Emotional State</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'good', label: 'Good', desc: 'Positive & grounded' },
                { id: 'neutral', label: 'Neutral', desc: 'Stable, routine' },
                { id: 'difficult', label: 'Difficult', desc: 'Strained, tender' },
                { id: 'need_support', label: 'Need Support', desc: 'Vulnerable, asking for help' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEmotionalDimension(opt.id as EmotionalCheckInDimension)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    emotionalDimension === opt.id
                      ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                      : 'bg-[#181513] border-[#2e2624] text-[#8c827a]'
                  }`}
                >
                  <div className="font-semibold text-[#fae8d7]">{opt.label}</div>
                  <div className="text-[10px] text-[#8c827a]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension 2: Consent & Boundary State */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fae8d7]">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Consent &amp; Boundaries</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'comfortable', label: 'Comfortable', desc: 'Boundaries feel right' },
                { id: 'unsure', label: 'Unsure', desc: 'Want to talk through' },
                { id: 'want_to_pause', label: 'Want to Pause', desc: 'Take a break' },
                { id: 'want_to_renegotiate', label: 'Want to Renegotiate', desc: 'Revisit terms' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setConsentDimension(opt.id as ConsentCheckInDimension)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    consentDimension === opt.id
                      ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                      : 'bg-[#181513] border-[#2e2624] text-[#8c827a]'
                  }`}
                >
                  <div className="font-semibold text-[#fae8d7]">{opt.label}</div>
                  <div className="text-[10px] text-[#8c827a]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension 3: Dynamic State */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#fae8d7]">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>3. Dynamic Alignment</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'working_well', label: 'Working Well', desc: 'Healthy & rewarding' },
                { id: 'needs_discussion', label: 'Needs Discussion', desc: 'A few things to tweak' },
                { id: 'boundary_concern', label: 'Boundary Concern', desc: 'Felt uncomfortable' },
                { id: 'pause_requested', label: 'Pause Requested', desc: 'Halt dynamic' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDynamicDimension(opt.id as DynamicCheckInDimension)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    dynamicDimension === opt.id
                      ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                      : 'bg-[#181513] border-[#2e2624] text-[#8c827a]'
                  }`}
                >
                  <div className="font-semibold text-[#fae8d7]">{opt.label}</div>
                  <div className="text-[10px] text-[#8c827a]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Free-form Note */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#fae8d7]">
              Anything you want the other participants to know?
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 'I enjoyed this but want less protocol next time', or 'I am feeling loving but need an early bedtime tonight'..."
              value={freeformFeedback}
              onChange={e => setFreeformFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#141210] border border-[#382f2d] text-xs text-[#fae8d7] placeholder-[#6b625b] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-[#2a2422] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#8c827a] hover:text-[#fae8d7]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e6c250] text-black font-bold text-xs shadow-md transition-colors"
            >
              Submit Check-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
