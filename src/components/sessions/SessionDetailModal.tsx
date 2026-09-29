import React, { useState } from 'react';
import {
  Session,
  SessionStatus,
  Dynamic,
  Relationship,
  Agreement,
  User,
  ParticipantReadiness,
} from '@/types/domain';
import {
  formatSessionStatus,
  formatSessionType,
  formatParticipantReadiness,
} from '@/types/legacyAdapters';
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  Shield,
  ShieldAlert,
  Users,
  MessageSquare,
  Sparkles,
  Lock,
  Heart,
  HandHeart,
  Send,
} from 'lucide-react';

interface SessionDetailModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  dynamics: Dynamic[];
  agreements: Agreement[];
  users: User[];
  currentUserId?: string;
  onUpdateSession?: (updated: Session) => void;
  onOpenAgreement?: (agreement: Agreement) => void;
  onOpenEmergency?: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  isOpen,
  onClose,
  relationships,
  dynamics,
  agreements,
  users,
  currentUserId = 'usr_alex',
  onUpdateSession,
  onOpenAgreement,
  onOpenEmergency,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'readiness' | 'aftercare' | 'notes'>('overview');
  const [freeformInput, setFreeformInput] = useState('');
  const [showCompletePrompt, setShowCompletePrompt] = useState(false);
  const [aftercareNotes, setAftercareNotes] = useState('');

  if (!isOpen || !session) return null;

  const relationship = relationships.find(r => r.id === session.relationshipId);
  const dynamic = dynamics.find(d => d.id === session.dynamicId);
  const governedAgreements = agreements.filter(a => session.agreementIds?.includes(a.id));
  const statusInfo = formatSessionStatus(session.status);

  const getUser = (userId: string) => users.find(u => u.id === userId);

  // Status transitions
  const updateStatus = (newStatus: SessionStatus) => {
    if (!onUpdateSession) return;
    const now = new Date().toISOString();
    const updated: Session = {
      ...session,
      status: newStatus,
      startedAt: newStatus === 'active' && !session.startedAt ? now : session.startedAt,
      endedAt: newStatus === 'completed' || newStatus === 'cancelled' ? now : session.endedAt,
      updatedAt: now,
    };
    onUpdateSession(updated);
  };

  const handleUpdateReadiness = (readiness: ParticipantReadiness) => {
    if (!onUpdateSession) return;
    const now = new Date().toISOString();
    const updated: Session = {
      ...session,
      participantReadiness: {
        ...(session.participantReadiness || {}),
        [currentUserId]: readiness,
      },
      updatedAt: now,
    };
    onUpdateSession(updated);
  };

  const handleAddFreeformNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateSession || !freeformInput.trim()) return;
    const now = new Date().toISOString();
    const existing = session.freeformNote ? `${session.freeformNote}\n` : '';
    const updated: Session = {
      ...session,
      freeformNote: `${existing}${getUser(currentUserId)?.displayName || 'Participant'} (${new Date().toLocaleTimeString()}): ${freeformInput.trim()}`,
      updatedAt: now,
    };
    onUpdateSession(updated);
    setFreeformInput('');
  };

  const handleCompleteWithAftercare = () => {
    if (!onUpdateSession) return;
    const now = new Date().toISOString();
    const updated: Session = {
      ...session,
      status: 'completed',
      endedAt: now,
      aftercare: {
        completed: true,
        comfortCheckDone: true,
        hydrationDone: true,
        emotionalDebriefDone: true,
        notes: aftercareNotes.trim() || 'Debrief and grounding completed with mutual affirmation.',
      },
      updatedAt: now,
    };
    onUpdateSession(updated);
    setShowCompletePrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#141211] border border-[#382f2d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2a2422] bg-[#1a1715]/90 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                {formatSessionType(session.sessionType)}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${statusInfo.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                <span>{statusInfo.label}</span>
              </span>
              {session.startedAt && (
                <span className="text-xs text-[#a89f91]">
                  Started {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8d7] tracking-tight">
              {session.title || 'Dynamic Practice Session'}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8c827a]">
              <span>In relationship:</span>
              <span className="font-medium text-[#fae8d7]">
                {relationship?.name || 'Shared Relationship'}
              </span>
              {dynamic && (
                <>
                  <span>• Dynamic:</span>
                  <span className="font-medium text-[#d4af37]">
                    {dynamic.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8c827a] hover:text-[#fae8d7] hover:bg-[#25201d] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Governed by Agreement Callout */}
        {governedAgreements.length > 0 && (
          <div className="px-6 py-3 bg-[#1f1915] border-b border-[#332822] flex flex-wrap items-center justify-between gap-2 text-xs text-[#c4b5a5]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>
                Governed by: <strong className="text-[#fae8d7]">{governedAgreements.map(a => a.title).join(', ')}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {governedAgreements.map(agr => (
                <button
                  key={agr.id}
                  type="button"
                  onClick={() => onOpenAgreement && onOpenAgreement(agr)}
                  className="px-2.5 py-1 rounded bg-[#2a221d] hover:bg-[#382d26] text-[#d4af37] text-[11px] font-semibold border border-[#42342b] transition-colors"
                >
                  View Agreement
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2a2422] bg-[#171412] px-6 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#d4af37] text-[#fae8d7]'
                : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('readiness')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'readiness'
                ? 'border-[#d4af37] text-[#fae8d7]'
                : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Participants &amp; Readiness</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aftercare')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'aftercare'
                ? 'border-[#d4af37] text-[#fae8d7]'
                : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
            }`}
          >
            <HandHeart className="w-4 h-4" />
            <span>Aftercare Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-[#d4af37] text-[#fae8d7]'
                : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Dialogue &amp; Notes</span>
          </button>
        </div>

        {/* Modal Body Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Goal / Context */}
              {session.goal && (
                <div className="p-4 rounded-xl bg-[#191614] border border-[#2a2422] space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a89f91]">Session Intention</h4>
                  <p className="text-sm text-[#e6dcd0] leading-relaxed">
                    {session.goal}
                  </p>
                </div>
              )}

              {/* Dynamic-Specific Dedicated Modules */}
              {dynamic?.dynamicType === 'bdsm_protocol' || dynamic?.dynamicType === 'power_exchange' ? (
                <div className="p-4 rounded-xl bg-[#1f1717] border border-rose-950/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Power Exchange &amp; Safeword Protocol</span>
                  </div>
                  <p className="text-xs text-[#d6c4c0] leading-relaxed">
                    Traffic light safewords (Green / Yellow / Red) are active. The word &ldquo;Red&rdquo; terminates authority and scenes immediately without friction.
                  </p>
                  {session.preparationNotes && (
                    <div className="text-xs p-3 rounded-lg bg-black/40 border border-rose-900/30 text-[#e6dcd0]">
                      <strong>Preparation Checklist:</strong> {session.preparationNotes}
                    </div>
                  )}
                  {onOpenEmergency && (
                    <button
                      type="button"
                      onClick={onOpenEmergency}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Launch Emergency Safeguards</span>
                    </button>
                  )}
                </div>
              ) : null}

              {dynamic?.dynamicType === 'chastity_practice' ? (
                <div className="p-4 rounded-xl bg-[#1b1915] border border-amber-950/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Chastity Device &amp; Hygiene Status</span>
                  </div>
                  <p className="text-xs text-[#d6c4c0] leading-relaxed">
                    Verify zero erythema or base ring pressure. Lock wearer retains unconditional authority to remove device for hygiene or discomfort.
                  </p>
                  {session.wellnessChecks.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-semibold text-[#a89f91] uppercase">Recent Wellness Logs:</span>
                      {session.wellnessChecks.map((w, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-black/40 text-xs text-[#fae8d7] flex items-center justify-between">
                          <span>{w.note || 'Comfort check recorded'}</span>
                          <span className="text-[#8c827a] font-mono text-[10px]">{new Date(w.timestamp).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {dynamic?.dynamicType === 'cuckold_hotwife' ? (
                <div className="p-4 rounded-xl bg-[#19171b] border border-purple-950/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                    <Heart className="w-4 h-4 text-purple-400" />
                    <span>Outside Play Reconnection Guidelines</span>
                  </div>
                  <p className="text-xs text-[#d6c4c0] leading-relaxed">
                    Dedicated, non-judgmental debriefing. Barrier protection adherence confirmed. Reconnection cuddle window prioritized.
                  </p>
                </div>
              ) : null}

              {/* Free-form note banner */}
              {session.freeformNote && (
                <div className="p-4 rounded-xl bg-[#181513] border border-[#2e2624] space-y-1.5">
                  <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                    Participant Notes &amp; Communication
                  </span>
                  <p className="text-xs text-[#fae8d7] whitespace-pre-wrap leading-relaxed">
                    {session.freeformNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: READINESS & PARTICIPANTS */}
          {activeTab === 'readiness' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] text-xs text-[#a89f91] space-y-1">
                <strong className="text-[#fae8d7]">Session-Level Consent:</strong> General agreement sign-off does not mean someone is forced into every individual session. Participants confirm readiness on each practice.
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Participants Readiness Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {session.participantIds.map(uid => {
                    const user = getUser(uid);
                    const readiness = session.participantReadiness?.[uid];
                    const readinessInfo = formatParticipantReadiness(readiness);
                    const isSelf = uid === currentUserId;

                    return (
                      <div
                        key={uid}
                        className="p-3.5 rounded-xl bg-[#1a1715] border border-[#2e2624] space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#25201d] border border-[#382f2c] flex items-center justify-center text-xs font-bold text-[#d4af37]">
                              {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : '??'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#fae8d7] flex items-center gap-1">
                                <span>{user?.displayName || uid}</span>
                                {isSelf && <span className="text-[10px] text-[#8c827a] font-normal">(You)</span>}
                              </div>
                              <div className="text-[10px] text-[#8c827a]">
                                {user?.username ? `@${user.username}` : ''}
                              </div>
                            </div>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${readinessInfo.badgeClass}`}>
                            {readinessInfo.label}
                          </span>
                        </div>

                        {/* Interactive toggle for current user */}
                        {isSelf && session.status !== 'completed' && session.status !== 'cancelled' && (
                          <div className="pt-2 border-t border-[#26201e] flex items-center gap-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateReadiness('ready')}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                readiness === 'ready'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#25201d] text-[#8c827a] hover:text-[#fae8d7]'
                              }`}
                            >
                              Ready
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateReadiness('needs_discussion')}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                readiness === 'needs_discussion'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-[#25201d] text-[#8c827a] hover:text-[#fae8d7]'
                              }`}
                            >
                              Needs Discussion
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateReadiness('paused')}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                readiness === 'paused'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-[#25201d] text-[#8c827a] hover:text-[#fae8d7]'
                              }`}
                            >
                              Pause
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AFTERCARE PLAN */}
          {activeTab === 'aftercare' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                  <HandHeart className="w-4 h-4 text-rose-300" />
                  <span>Dedicated Re-entry &amp; Aftercare</span>
                </div>
                <p className="text-xs text-[#a89f91] leading-relaxed">
                  Aftercare grounds both partners somaticly and emotionally. It is never optional or rushed.
                </p>

                {session.aftercare?.notes && (
                  <div className="mt-2 p-3 rounded-lg bg-black/40 border border-[#2e2624] text-xs text-[#fae8d7]">
                    <strong>Agreed Plan:</strong> {session.aftercare.notes}
                  </div>
                )}

                <div className="pt-3 border-t border-[#26201e] space-y-2">
                  <h5 className="text-[11px] font-semibold uppercase text-[#a89f91]">Standard Grounding Checkpoints</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#141210] border border-[#2a2422] flex items-center gap-2 text-[#fae8d7]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Warmth &amp; Heavy Blankets</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#141210] border border-[#2a2422] flex items-center gap-2 text-[#fae8d7]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Hydration &amp; Nourishment</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#141210] border border-[#2a2422] flex items-center gap-2 text-[#fae8d7]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Verbal Reassurance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIALOGUE & NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#191614] border border-[#2e2624] space-y-3">
                <h4 className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Anything you want the other participants to know?
                </h4>
                <form onSubmit={handleAddFreeformNote} className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="e.g. 'I enjoyed this but want less protocol next time' or 'Feeling very connected tonight'..."
                    value={freeformInput}
                    onChange={e => setFreeformInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#141210] border border-[#382f2d] text-xs text-[#fae8d7] placeholder-[#6b625b] focus:outline-none focus:border-[#d4af37]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!freeformInput.trim()}
                      className="px-4 py-1.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#e6c250] disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Note</span>
                    </button>
                  </div>
                </form>
              </div>

              {session.freeformNote && (
                <div className="p-4 rounded-xl bg-[#141210] border border-[#2e2624] text-xs text-[#fae8d7] whitespace-pre-wrap leading-relaxed">
                  {session.freeformNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="px-6 py-4 border-t border-[#2a2422] bg-[#1a1715] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#8c827a] flex items-center gap-1.5">
            <span>Any participant may pause or stop this session at any time.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {session.status === 'planned' && (
              <button
                type="button"
                onClick={() => updateStatus('active')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Session</span>
              </button>
            )}

            {session.status === 'active' && (
              <>
                <button
                  type="button"
                  onClick={() => updateStatus('paused')}
                  className="px-3.5 py-2 rounded-xl bg-[#25201d] hover:bg-yellow-950/30 border border-yellow-700/40 text-yellow-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompletePrompt(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Session</span>
                </button>
              </>
            )}

            {session.status === 'paused' && (
              <>
                <button
                  type="button"
                  onClick={() => updateStatus('active')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompletePrompt(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#25201d] hover:bg-[#322a27] border border-[#3d3430] text-[#fae8d7] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conclude Session</span>
                </button>
              </>
            )}

            {(session.status === 'planned' || session.status === 'active' || session.status === 'paused') && (
              <button
                type="button"
                onClick={() => updateStatus('cancelled')}
                className="px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/20 text-xs font-semibold transition-colors"
              >
                Cancel Session
              </button>
            )}
          </div>
        </div>

        {/* Completion & Aftercare Prompt Modal */}
        {showCompletePrompt && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#1a1715] border border-[#382f2d] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#fae8d7] flex items-center gap-2">
                  <HandHeart className="w-4 h-4 text-rose-300" />
                  <span>Complete Session &amp; Record Aftercare</span>
                </h3>
                <button onClick={() => setShowCompletePrompt(false)} className="text-[#8c827a] hover:text-[#fae8d7]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#a89f91] leading-relaxed">
                Take a moment to verify physical and emotional grounding before concluding this instance.
              </p>

              <textarea
                rows={3}
                placeholder="Optional aftercare notes (e.g. warm tea, heavy blankets, debriefed together)..."
                value={aftercareNotes}
                onChange={e => setAftercareNotes(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-[#141210] border border-[#382f2d] text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompletePrompt(false)}
                  className="px-4 py-2 text-xs font-medium text-[#8c827a] hover:text-[#fae8d7]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteWithAftercare}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Conclude &amp; Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
