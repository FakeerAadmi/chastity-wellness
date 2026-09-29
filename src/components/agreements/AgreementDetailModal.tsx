import React, { useState } from 'react';
import {
  Agreement,
  AgreementSection,
  Dynamic,
  Relationship,
  User,
  NegotiationResponse,
} from '@/types/domain';
import {
  formatAgreementScope,
  formatConsentStatus,
  formatNegotiationResponse,
  formatSectionCategory,
} from '@/types/legacyAdapters';
import {
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  PauseCircle,
  Archive,
  History,
  ShieldAlert,
  HandHeart,
  Scale,
  MessageSquare,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Sliders,
} from 'lucide-react';

interface AgreementDetailModalProps {
  agreement: Agreement | null;
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  dynamics: Dynamic[];
  users: User[];
  currentUserId?: string;
  onUpdateAgreement?: (updated: Agreement) => void;
  onNavigateToDynamic?: (dynamicId: string) => void;
  onNavigateToRelationship?: (relationshipId: string) => void;
}

export const AgreementDetailModal: React.FC<AgreementDetailModalProps> = ({
  agreement,
  isOpen,
  onClose,
  relationships,
  dynamics,
  users,
  currentUserId = 'usr_alex',
  onUpdateAgreement,
  onNavigateToDynamic,
  onNavigateToRelationship,
}) => {
  const [activeTab, setActiveTab] = useState<'contract' | 'history' | 'edit'>('contract');
  const [showFeedbackModal, setShowFeedbackModal] = useState<false | 'request_changes' | 'renegotiate' | 'pause'>(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Edit draft state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSections, setDraftSections] = useState<AgreementSection[]>([]);
  const [revisionSummary, setRevisionSummary] = useState('');

  if (!isOpen || !agreement) return null;

  const relationship = relationships.find(r => r.id === agreement.relationshipId);
  const dynamic = dynamics.find(d => d.id === agreement.dynamicId);
  const statusInfo = formatConsentStatus(agreement.status);

  const getUser = (userId: string) => users.find(u => u.id === userId);
  const currentUserResponse = agreement.participantResponses.find(r => r.participantId === currentUserId);

  const toggleSection = (secId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: prev[secId] === undefined ? false : !prev[secId],
    }));
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'intent':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'boundaries':
        return <Lock className="w-4 h-4 text-rose-400" />;
      case 'permissions':
        return <Unlock className="w-4 h-4 text-purple-400" />;
      case 'safewords':
      case 'safety':
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
      case 'aftercare':
        return <HandHeart className="w-4 h-4 text-rose-300" />;
      case 'communication':
      case 'expectations':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'review':
        return <Clock className="w-4 h-4 text-amber-300" />;
      default:
        return <FileText className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  // Participant resolution logic
  const handleApprove = () => {
    if (!onUpdateAgreement) return;
    const now = new Date().toISOString();
    const updatedResponses = agreement.participantResponses.map(r => {
      if (r.participantId === currentUserId) {
        return {
          ...r,
          response: 'approved' as NegotiationResponse,
          respondedAt: now,
          note: undefined,
        };
      }
      return r;
    });

    // Check if all participants have now approved
    const allApproved = updatedResponses.every(r => r.response === 'approved' || r.response === 'definitely_interested');
    const newStatus = allApproved ? 'active' : 'pending_approval';

    const newRevision = {
      revisionId: `rev_${Date.now()}`,
      version: (agreement.revisionHistory.length || 0) + 1,
      summary: `Approved by ${getUser(currentUserId)?.displayName || 'Participant'}`,
      revisedAt: now,
      revisedBy: currentUserId,
      text: allApproved ? 'Mutual consensus achieved. Agreement activated.' : 'Participant consented. Awaiting remaining sign-offs.',
    };

    onUpdateAgreement({
      ...agreement,
      participantResponses: updatedResponses,
      status: newStatus,
      revisionHistory: [newRevision, ...agreement.revisionHistory],
      updatedAt: now,
    });
  };

  const handleRequestChanges = () => {
    if (!onUpdateAgreement || !feedbackNote.trim()) return;
    const now = new Date().toISOString();

    const updatedResponses = agreement.participantResponses.map(r => {
      if (r.participantId === currentUserId) {
        return {
          ...r,
          response: 'changes_requested' as NegotiationResponse,
          note: feedbackNote.trim(),
          respondedAt: now,
        };
      }
      return r;
    });

    const newRevision = {
      revisionId: `rev_${Date.now()}`,
      version: (agreement.revisionHistory.length || 0) + 1,
      summary: `Changes requested by ${getUser(currentUserId)?.displayName || 'Participant'}`,
      revisedAt: now,
      revisedBy: currentUserId,
      reason: feedbackNote.trim(),
    };

    onUpdateAgreement({
      ...agreement,
      participantResponses: updatedResponses,
      status: 'negotiating',
      revisionHistory: [newRevision, ...agreement.revisionHistory],
      updatedAt: now,
    });

    setShowFeedbackModal(false);
    setFeedbackNote('');
  };

  const handlePause = () => {
    if (!onUpdateAgreement) return;
    const now = new Date().toISOString();

    const newRevision = {
      revisionId: `rev_${Date.now()}`,
      version: (agreement.revisionHistory.length || 0) + 1,
      summary: `Agreement paused by ${getUser(currentUserId)?.displayName || 'Participant'}`,
      revisedAt: now,
      revisedBy: currentUserId,
      reason: feedbackNote.trim() || 'Voluntary non-judgmental pause invoked.',
    };

    onUpdateAgreement({
      ...agreement,
      status: 'paused',
      revisionHistory: [newRevision, ...agreement.revisionHistory],
      updatedAt: now,
    });

    setShowFeedbackModal(false);
    setFeedbackNote('');
  };

  const handleRenegotiate = () => {
    if (!onUpdateAgreement) return;
    const now = new Date().toISOString();

    // Reset other responses to pending since terms are open for renegotiation
    const updatedResponses = agreement.participantResponses.map(r => ({
      ...r,
      response: (r.participantId === currentUserId ? 'approved' : 'pending') as NegotiationResponse,
      note: r.participantId === currentUserId ? feedbackNote.trim() : undefined,
      respondedAt: now,
    }));

    const newRevision = {
      revisionId: `rev_${Date.now()}`,
      version: (agreement.revisionHistory.length || 0) + 1,
      summary: `Renegotiation requested by ${getUser(currentUserId)?.displayName || 'Participant'}`,
      revisedAt: now,
      revisedBy: currentUserId,
      reason: feedbackNote.trim() || 'Terms opened for bilateral review and revision.',
    };

    onUpdateAgreement({
      ...agreement,
      participantResponses: updatedResponses,
      status: 'negotiating',
      revisionHistory: [newRevision, ...agreement.revisionHistory],
      updatedAt: now,
    });

    setShowFeedbackModal(false);
    setFeedbackNote('');
  };

  const handleRetire = () => {
    if (!onUpdateAgreement) return;
    const now = new Date().toISOString();

    const newRevision = {
      revisionId: `rev_${Date.now()}`,
      version: (agreement.revisionHistory.length || 0) + 1,
      summary: `Archived and retired by ${getUser(currentUserId)?.displayName || 'Participant'}`,
      revisedAt: now,
      revisedBy: currentUserId,
      reason: 'Compact concluded or superseded.',
    };

    onUpdateAgreement({
      ...agreement,
      status: 'retired',
      revisionHistory: [newRevision, ...agreement.revisionHistory],
      updatedAt: now,
    });
  };

  const startEditMode = () => {
    setDraftTitle(agreement.title);
    setDraftSections(agreement.sections ? JSON.parse(JSON.stringify(agreement.sections)) : []);
    setRevisionSummary('');
    setActiveTab('edit');
  };

  const saveRevisionDraft = () => {
    if (!onUpdateAgreement) return;
    const now = new Date().toISOString();
    const newVersion = (agreement.revisionHistory[0]?.version || 1) + 1;

    // Changes revert agreement to negotiating and require re-affirmation
    const updatedResponses = agreement.participantResponses.map(r => ({
      ...r,
      response: (r.participantId === currentUserId ? 'approved' : 'pending') as NegotiationResponse,
      note: undefined,
      respondedAt: now,
    }));

    const newRev = {
      revisionId: `rev_${Date.now()}`,
      version: newVersion,
      summary: revisionSummary.trim() || `v${newVersion} revision proposed by ${getUser(currentUserId)?.displayName || 'Author'}`,
      revisedAt: now,
      revisedBy: currentUserId,
    };

    onUpdateAgreement({
      ...agreement,
      title: draftTitle.trim() || agreement.title,
      sections: draftSections,
      status: 'negotiating',
      participantResponses: updatedResponses,
      revisionHistory: [newRev, ...agreement.revisionHistory],
      updatedAt: now,
    });

    setActiveTab('contract');
  };

  const updateDraftSectionContent = (index: number, newContent: string) => {
    setDraftSections(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], content: newContent };
      return copy;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#141211] border border-[#382f2d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#2a2422] bg-[#1a1715]/90 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                {formatAgreementScope(agreement.scope)}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusInfo.badgeClass}`}>
                {statusInfo.label}
              </span>
              {agreement.effectiveFrom && (
                <span className="text-xs text-[#a89f91]">
                  Active since {new Date(agreement.effectiveFrom).toLocaleDateString()}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8d7] tracking-tight">
              {agreement.title}
            </h2>

            {/* Context breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8c827a]">
              <span>In relationship:</span>
              <button
                type="button"
                onClick={() => {
                  if (relationship && onNavigateToRelationship) {
                    onClose();
                    onNavigateToRelationship(relationship.id);
                  }
                }}
                className="font-medium text-[#d4af37] hover:underline"
              >
                {relationship?.name || 'Shared Relationship'}
              </button>
              {dynamic && (
                <>
                  <span>• Dynamic:</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToDynamic) {
                        onClose();
                        onNavigateToDynamic(dynamic.id);
                      }
                    }}
                    className="font-medium text-[#d4af37] hover:underline"
                  >
                    {dynamic.name}
                  </button>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8c827a] hover:text-[#fae8d7] hover:bg-[#25201d] rounded-xl transition-colors"
            aria-label="Close agreement"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Banner */}
        {agreement.status === 'negotiating' && (
          <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Negotiation Open:</strong> All required participants must review and consent before this compact is active.
              </span>
            </div>
            <span className="font-mono text-amber-300">
              {agreement.participantResponses.filter(r => r.response === 'approved' || r.response === 'definitely_interested').length} / {agreement.participantResponses.length} Consented
            </span>
          </div>
        )}

        {agreement.status === 'paused' && (
          <div className="px-6 py-3 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center gap-2 text-xs text-yellow-200">
            <PauseCircle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>
              <strong>Agreement Currently Paused:</strong> Activities covered by this protocol are on hold. Safety boundaries and limits remain permanently non-negotiable.
            </span>
          </div>
        )}

        {agreement.status === 'retired' && (
          <div className="px-6 py-3 bg-stone-500/10 border-b border-stone-600/30 flex items-center gap-2 text-xs text-stone-300">
            <Archive className="w-4 h-4 text-stone-400 shrink-0" />
            <span>
              <strong>Archived Compact:</strong> This agreement has been concluded or superseded. Kept permanently for relationship record integrity.
            </span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2a2422] bg-[#171412] px-6 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('contract')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'contract'
                ? 'border-[#d4af37] text-[#fae8d7]'
                : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Agreement Protocol</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#d4af37] text-[#fae8d7]'
                : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Revision History ({agreement.revisionHistory.length})</span>
          </button>
          {agreement.status !== 'retired' && (
            <button
              type="button"
              onClick={startEditMode}
              className={`py-3 px-4 font-medium border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'edit'
                  ? 'border-[#d4af37] text-[#fae8d7]'
                  : 'border-transparent text-[#8c827a] hover:text-[#c4b5a5]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Propose Revision</span>
            </button>
          )}
        </div>

        {/* Main Body Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CONTRACT VIEW */}
          {activeTab === 'contract' && (
            <>
              {/* Participant Consent Grid */}
              <div className="p-4 rounded-xl bg-[#1c1816] border border-[#2e2624] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  <span>Signatories &amp; Consents</span>
                  <span>Mutual Consent Architecture</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {agreement.participantResponses.map(resp => {
                    const user = getUser(resp.participantId);
                    const respInfo = formatNegotiationResponse(resp.response);
                    const isSelf = resp.participantId === currentUserId;

                    return (
                      <div
                        key={resp.participantId}
                        className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                          resp.response === 'changes_requested'
                            ? 'bg-amber-950/20 border-amber-800/40'
                            : resp.response === 'approved' || resp.response === 'definitely_interested'
                            ? 'bg-[#151f18] border-emerald-900/40'
                            : 'bg-[#181513] border-[#2e2624]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#2a2422] border border-[#3d3430] flex items-center justify-center text-xs font-bold text-[#d4af37]">
                              {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : '??'}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[#fae8d7] flex items-center gap-1">
                                <span>{user?.displayName || 'Unknown'}</span>
                                {isSelf && <span className="text-[10px] text-[#8c827a] font-normal">(You)</span>}
                              </div>
                              <div className="text-[10px] text-[#8c827a]">
                                {resp.respondedAt ? new Date(resp.respondedAt).toLocaleDateString() : 'Awaiting sign-off'}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${respInfo.badgeClass}`}>
                            {respInfo.label}
                          </span>
                        </div>

                        {resp.note && (
                          <div className="text-xs p-2 rounded bg-black/40 border border-amber-900/30 text-amber-200/90 italic">
                            &ldquo;{resp.note}&rdquo;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* General Scope / Summary */}
              {agreement.content && (
                <div className="p-4 rounded-xl bg-[#191614] border border-[#2a2422] space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a89f91]">Protocol Summary</h4>
                  <p className="text-sm text-[#e6dcd0] leading-relaxed">
                    {agreement.content}
                  </p>
                </div>
              )}

              {/* Structured Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
                    Negotiated Sections ({agreement.sections?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = (agreement.sections || []).map(s => s.id);
                      const areAllOpen = allIds.every(id => expandedSections[id] !== false);
                      const nextState: Record<string, boolean> = {};
                      allIds.forEach(id => {
                        nextState[id] = !areAllOpen;
                      });
                      setExpandedSections(nextState);
                    }}
                    className="text-xs text-[#8c827a] hover:text-[#d4af37] transition-colors"
                  >
                    Toggle All Sections
                  </button>
                </div>

                {(!agreement.sections || agreement.sections.length === 0) ? (
                  <div className="p-6 text-center rounded-xl bg-[#181513] border border-dashed border-[#2a2422] text-[#8c827a] text-sm">
                    No individual sections configured. See summary protocol above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {agreement.sections.map((section, idx) => {
                      const isOpen = expandedSections[section.id] !== false; // default open
                      const categoryLabel = formatSectionCategory(section.category);

                      return (
                        <div
                          key={section.id || idx}
                          className="rounded-xl border border-[#2e2624] bg-[#1a1715] overflow-hidden transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#221e1b] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-[#25201d] border border-[#382f2c]">
                                {getCategoryIcon(section.category)}
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a89f91]">
                                  {categoryLabel}
                                </span>
                                <h4 className="text-sm font-semibold text-[#fae8d7]">
                                  {section.title}
                                </h4>
                              </div>
                            </div>
                            <div className="text-[#8c827a]">
                              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-5 py-4 border-t border-[#26201e] bg-[#141210]/60 text-sm text-[#e6dcd0] leading-relaxed space-y-2">
                              <p className="whitespace-pre-wrap">{section.content}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Review & Renegotiation Commitment */}
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#a89f91]">
                  <Scale className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {agreement.reviewDate
                      ? `Next scheduled renegotiation check-in: ${new Date(agreement.reviewDate).toLocaleDateString()}`
                      : 'Open-ended compact with continuous renegotiation privilege.'}
                  </span>
                </div>
                <span className="text-[10px] text-[#8c827a]">
                  Updated {new Date(agreement.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </>
          )}

          {/* TAB 2: REVISION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#fae8d7]">Agreement Audit Trail</h3>
                  <p className="text-xs text-[#8c827a]">
                    Every negotiation step, boundary amendment, and pause is recorded for full transparency.
                  </p>
                </div>
              </div>

              {agreement.revisionHistory.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#181513] border border-dashed border-[#2a2422] text-sm text-[#8c827a]">
                  No revisions logged yet. Current draft is initial inception.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2e2624]">
                  {agreement.revisionHistory.map((rev, idx) => {
                    const author = getUser(rev.revisedBy);
                    return (
                      <div key={rev.revisionId || idx} className="relative group">
                        <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#2a2422] border-2 border-[#d4af37] group-hover:scale-110 transition-transform" />
                        <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#d4af37]">
                              {rev.version ? `Version ${rev.version}` : `Revision ${idx + 1}`}
                            </span>
                            <span className="text-xs text-[#8c827a]">
                              {new Date(rev.revisedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-[#fae8d7]">
                            {rev.summary || rev.text}
                          </p>
                          {rev.reason && (
                            <div className="text-xs text-amber-300/90 italic bg-amber-950/20 p-2 rounded border border-amber-900/30">
                              Reason / Note: {rev.reason}
                            </div>
                          )}
                          <div className="text-[11px] text-[#8c827a] pt-1">
                            Logged by {author?.displayName || 'Participant'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROPOSE REVISION / EDIT */}
          {activeTab === 'edit' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <strong>Submitting a Revision:</strong> Any modification will create a new version of this agreement and require re-affirmation from all required participants.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Agreement Title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={e => setDraftTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Negotiated Sections
                </label>
                {draftSections.map((sec, idx) => (
                  <div key={sec.id || idx} className="p-4 rounded-xl bg-[#191614] border border-[#2e2624] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#d4af37]">{sec.title}</span>
                      <span className="text-[#8c827a] uppercase">{formatSectionCategory(sec.category)}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={e => updateDraftSectionContent(idx, e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#141210] border border-[#2e2624] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Summary of Proposed Changes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adjusted check-in frequency and clarified 24h notice clause"
                  value={revisionSummary}
                  onChange={e => setRevisionSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] focus:outline-none focus:border-[#d4af37] text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2422]">
                <button
                  type="button"
                  onClick={() => setActiveTab('contract')}
                  className="px-4 py-2 text-xs font-medium text-[#8c827a] hover:text-[#fae8d7]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveRevisionDraft}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#e6c250] transition-colors"
                >
                  Propose New Revision
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="px-6 py-4 border-t border-[#2a2422] bg-[#1a1715] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#8c827a]">
            <span>Safewords &amp; limits override all active agreements unconditionally.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Contextual actions for CURRENT USER */}
            {(agreement.status === 'negotiating' || agreement.status === 'pending_approval') && (
              <>
                {currentUserResponse?.response !== 'approved' && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Agreement</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal('request_changes');
                    setFeedbackNote('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#25201d] hover:bg-[#302925] border border-amber-600/30 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Request Changes</span>
                </button>
              </>
            )}

            {agreement.status === 'active' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal('pause');
                    setFeedbackNote('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#25201d] hover:bg-yellow-950/30 border border-yellow-700/40 text-yellow-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Agreement</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal('renegotiate');
                    setFeedbackNote('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#25201d] hover:bg-[#302925] border border-[#3d3430] text-[#fae8d7] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Renegotiation</span>
                </button>
              </>
            )}

            {agreement.status === 'paused' && (
              <>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resume Agreement</span>
                </button>
                <button
                  type="button"
                  onClick={handleRetire}
                  className="px-3.5 py-2 rounded-xl bg-[#25201d] hover:bg-stone-800 border border-stone-700 text-stone-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive &amp; Retire</span>
                </button>
              </>
            )}

            {agreement.status === 'retired' && (
              <span className="text-xs text-stone-400 font-mono px-3 py-1 rounded bg-[#201d1b] border border-stone-800">
                Archived Record
              </span>
            )}
          </div>
        </div>

        {/* Nested Feedback Modal for Changes / Pause / Renegotiation */}
        {showFeedbackModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#1a1715] border border-[#382f2d] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#fae8d7]">
                  {showFeedbackModal === 'request_changes' && 'Request Agreement Changes'}
                  {showFeedbackModal === 'pause' && 'Pause Agreement'}
                  {showFeedbackModal === 'renegotiate' && 'Open Bilateral Renegotiation'}
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-[#8c827a] hover:text-[#fae8d7]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#a89f91] leading-relaxed">
                {showFeedbackModal === 'request_changes' &&
                  'Explain specifically what clauses or boundaries need adjustment before you can approve this agreement.'}
                {showFeedbackModal === 'pause' &&
                  'Pausing halts practice of this agreement without judgment or deletion. Safety boundaries and safewords remain unconditionally active.'}
                {showFeedbackModal === 'renegotiate' &&
                  'This will reopen the agreement for discussion with all participants.'}
              </p>

              <textarea
                rows={4}
                placeholder={
                  showFeedbackModal === 'request_changes'
                    ? 'e.g. Can we adjust the check-in time to after 20:00?'
                    : showFeedbackModal === 'pause'
                    ? 'Optional reason for pausing (e.g. traveling for work this week)...'
                    : 'Notes on what you would like to revisit...'
                }
                value={feedbackNote}
                onChange={e => setFeedbackNote(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-[#141210] border border-[#382f2d] text-[#fae8d7] placeholder-[#6b625b] focus:outline-none focus:border-[#d4af37]"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#8c827a] hover:text-[#fae8d7]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (showFeedbackModal === 'request_changes') handleRequestChanges();
                    if (showFeedbackModal === 'pause') handlePause();
                    if (showFeedbackModal === 'renegotiate') handleRenegotiate();
                  }}
                  disabled={showFeedbackModal === 'request_changes' && !feedbackNote.trim()}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-[#e6c250] disabled:opacity-50 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
