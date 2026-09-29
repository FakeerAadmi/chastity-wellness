import React, { useState } from 'react';
import {
  Agreement,
  AgreementScope,
  AgreementSection,
  AgreementSectionCategory,
  Dynamic,
  Relationship,
  User,
  NegotiationResponse,
} from '@/types/domain';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface AgreementCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationships: Relationship[];
  dynamics: Dynamic[];
  users: User[];
  currentUserId?: string;
  initialRelationshipId?: string;
  initialDynamicId?: string;
  onCreateAgreement: (agreement: Agreement) => void;
}

interface SectionTemplate {
  category: AgreementSectionCategory;
  defaultTitle: string;
  promptPlaceholder: string;
  defaultIncluded: boolean;
}

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    category: 'intent',
    defaultTitle: 'Intent & Shared Purpose',
    promptPlaceholder: 'Why are we establishing this compact? (e.g. Deepening erotic surrender and vulnerability, structured power exchange, establishing transparent dating rules)',
    defaultIncluded: true,
  },
  {
    category: 'boundaries',
    defaultTitle: 'Boundaries & Hard Limits',
    promptPlaceholder: 'What is strictly off-limits or bounded? (e.g. Max 72h wear without break, no contact with mutual colleagues, no marks that interfere with work)',
    defaultIncluded: true,
  },
  {
    category: 'safewords',
    defaultTitle: 'Safewords & Stop Conditions',
    promptPlaceholder: 'Emergency stop protocols (e.g. Traffic light system: Green / Yellow / Red. "Red" unlocks immediately without friction or judgment)',
    defaultIncluded: true,
  },
  {
    category: 'permissions',
    defaultTitle: 'Permissions & Authority',
    promptPlaceholder: 'Who has decision-making authority? (e.g. Keyholder decides release date; lock wearer can release for hygiene anytime)',
    defaultIncluded: false,
  },
  {
    category: 'safety',
    defaultTitle: 'Safety & Physical Wellness',
    promptPlaceholder: 'Physical hygiene and safety checks (e.g. Daily inspection, skin drying, hydration checks every 2 hours)',
    defaultIncluded: false,
  },
  {
    category: 'communication',
    defaultTitle: 'Communication & Check-in Cadence',
    promptPlaceholder: 'How often do we sync? (e.g. 24h advance notice for dates, 3 voice memos per week, daily check-in)',
    defaultIncluded: true,
  },
  {
    category: 'aftercare',
    defaultTitle: 'Aftercare & Reconnection',
    promptPlaceholder: 'Dedicated physical or emotional grounding (e.g. 45 minutes of warm blankets and tea, mandatory debrief within 24h)',
    defaultIncluded: false,
  },
  {
    category: 'review',
    defaultTitle: 'Review & Renegotiation Cadence',
    promptPlaceholder: 'When will we revisit this? (e.g. Monthly on the 1st, after every 3 dates, quarterly check-in)',
    defaultIncluded: true,
  },
];

export const AgreementCreationModal: React.FC<AgreementCreationModalProps> = ({
  isOpen,
  onClose,
  relationships,
  dynamics,
  users,
  currentUserId = 'usr_alex',
  initialRelationshipId,
  initialDynamicId,
  onCreateAgreement,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [relationshipId, setRelationshipId] = useState<string>(
    initialRelationshipId || (relationships[0]?.id ?? '')
  );
  const [dynamicId, setDynamicId] = useState<string>(initialDynamicId || '');
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<AgreementScope>('agreement');
  const [contentSummary, setContentSummary] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  // Selected Section categories & contents
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SECTION_TEMPLATES.forEach(t => {
      init[t.category] = t.defaultIncluded;
    });
    return init;
  });

  const [sectionData, setSectionData] = useState<Record<string, { title: string; content: string }>>(() => {
    const init: Record<string, { title: string; content: string }> = {};
    SECTION_TEMPLATES.forEach(t => {
      init[t.category] = {
        title: t.defaultTitle,
        content: '',
      };
    });
    return init;
  });

  // Selected participants
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>(() => {
    const rel = relationships.find(r => r.id === (initialRelationshipId || relationships[0]?.id));
    return rel ? rel.participants.map(p => p.userId) : [currentUserId];
  });

  if (!isOpen) return null;

  const currentRelationship = relationships.find(r => r.id === relationshipId);
  const eligibleDynamics = dynamics.filter(d => d.relationshipId === relationshipId);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const updateSection = (cat: string, field: 'title' | 'content', value: string) => {
    setSectionData(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [field]: value,
      },
    }));
  };

  const toggleParticipant = (userId: string) => {
    if (userId === currentUserId) return; // Author must be included
    setSelectedParticipantIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleFinish = () => {
    const now = new Date().toISOString();

    const sections: AgreementSection[] = SECTION_TEMPLATES
      .filter(t => selectedCategories[t.category])
      .map((t, idx) => ({
        id: `sec_${t.category}_${Date.now()}_${idx}`,
        category: t.category,
        title: sectionData[t.category]?.title || t.defaultTitle,
        content: sectionData[t.category]?.content || '',
        order: idx + 1,
      }));

    const participantResponses = selectedParticipantIds.map(pid => ({
      participantId: pid,
      response: (pid === currentUserId ? 'approved' : 'pending') as NegotiationResponse,
      note: pid === currentUserId ? 'Initiated and consented by author.' : undefined,
      respondedAt: pid === currentUserId ? now : undefined,
    }));

    const newAgreement: Agreement = {
      id: `agr_${Date.now()}`,
      relationshipId,
      dynamicId: dynamicId || undefined,
      title: title.trim() || 'Shared Agreement Compact',
      scope,
      content: contentSummary.trim() || 'Custom negotiated agreement between consenting participants.',
      sections,
      participantResponses,
      status: 'negotiating', // Phase 4 rule: Never auto-active! Always starts in negotiating
      reviewDate: reviewDate || undefined,
      revisionHistory: [
        {
          revisionId: `rev_${Date.now()}`,
          version: 1,
          summary: 'Initial proposal submitted for mutual negotiation.',
          revisedAt: now,
          revisedBy: currentUserId,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    onCreateAgreement(newAgreement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#141211] border border-[#382f2d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2422] bg-[#1a1715] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
              Step {step} of 6 • Bilateral Agreement Composer
            </span>
            <h2 className="text-lg font-bold text-[#fae8d7]">
              {step === 1 && 'Context & Scope'}
              {step === 2 && 'Agreement Title & Purpose'}
              {step === 3 && 'Structured Topics & Sections'}
              {step === 4 && 'Draft Section Clauses'}
              {step === 5 && 'Signatories & Mutual Consent'}
              {step === 6 && 'Review & Propose for Negotiation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8c827a] hover:text-[#fae8d7] hover:bg-[#25201d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress bar */}
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
              <div className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] space-y-1 text-xs text-[#a89f91]">
                <strong className="text-[#fae8d7]">Agreements live in Relationships:</strong> Choose which relationship this compact governs, and optionally attach it to an active dynamic (e.g. Chastity, Power Exchange, Cuckold / Hotwife).
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
                  onChange={e => setDynamicId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-sm focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="">Relationship-wide agreement (No specific dynamic)</option>
                  {eligibleDynamics.map(dyn => (
                    <option key={dyn.id} value={dyn.id}>
                      {dyn.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Agreement Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'agreement', title: 'Mutual Agreement', desc: 'Bilateral shared protocol with mutual expectations' },
                    { id: 'boundary', title: 'Boundary & Limit', desc: 'Protective limits, hard stops, or privacy constraints' },
                    { id: 'rule', title: 'Protocol / Rule', desc: 'Active dynamic guidelines, daily service, or etiquette' },
                    { id: 'interest', title: 'Exploration Compact', desc: 'Trial protocol or exploratory interest' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScope(opt.id as AgreementScope)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        scope === opt.id
                          ? 'bg-[#221c17] border-[#d4af37] text-[#fae8d7]'
                          : 'bg-[#181513] border-[#2e2624] text-[#a89f91] hover:border-[#3d3430]'
                      }`}
                    >
                      <div className="font-semibold text-[#fae8d7] mb-1">{opt.title}</div>
                      <div className="text-[11px] text-[#8c827a]">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TITLE & PURPOSE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Agreement Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chastity Rules & Inspection Compact, Outside Dating Protocol, Weekend D/s Rules"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  High-Level Summary / Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core premise in a few sentences..."
                  value={contentSummary}
                  onChange={e => setContentSummary(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#1a1715] border border-[#382f2d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Scheduled Renegotiation Date (Optional)
                </label>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={e => setReviewDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#1a1715] border border-[#382f2d] text-[#fae8d7] text-xs focus:outline-none focus:border-[#d4af37]"
                />
                <span className="text-[11px] text-[#8c827a]">
                  Agreements in Haven encourage intentional expiration or renegotiation milestones to prevent stagnation.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT SECTIONS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs text-[#a89f91]">
                Select the structured topics that apply to this agreement. Each selected category will have its own dedicated drafting section.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECTION_TEMPLATES.map(tmpl => {
                  const isChecked = !!selectedCategories[tmpl.category];
                  return (
                    <div
                      key={tmpl.category}
                      onClick={() => toggleCategory(tmpl.category)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'bg-[#1f1a17] border-[#d4af37]/60 text-[#fae8d7]'
                          : 'bg-[#181513] border-[#2e2624] text-[#8c827a] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div
                        className="mt-1 accent-[#d4af37]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#fae8d7]">
                          {tmpl.defaultTitle}
                        </div>
                        <div className="text-[11px] text-[#8c827a] mt-0.5 leading-snug">
                          {tmpl.promptPlaceholder}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DRAFT SECTIONS */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="text-xs text-[#a89f91]">
                Draft specific terms for each selected topic. Authentic adult clarity is encouraged.
              </div>

              {SECTION_TEMPLATES.filter(t => selectedCategories[t.category]).map(tmpl => {
                const data = sectionData[tmpl.category] || { title: tmpl.defaultTitle, content: '' };
                return (
                  <div
                    key={tmpl.category}
                    className="p-4 rounded-xl bg-[#1a1715] border border-[#2e2624] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={data.title}
                        onChange={e => updateSection(tmpl.category, 'title', e.target.value)}
                        className="text-xs font-bold text-[#d4af37] bg-transparent border-b border-transparent focus:border-[#d4af37] focus:outline-none"
                      />
                      <span className="text-[10px] text-[#8c827a] uppercase font-mono">
                        {tmpl.category}
                      </span>
                    </div>

                    <textarea
                      rows={3}
                      placeholder={tmpl.promptPlaceholder}
                      value={data.content}
                      onChange={e => updateSection(tmpl.category, 'content', e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#141210] border border-[#2e2624] text-xs text-[#fae8d7] placeholder-[#5c544d] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 5: PARTICIPANTS & CONSENT */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                <strong>No Fake Consent:</strong> An agreement is never active merely because it was created. Every checked participant must review, confirm, and consent.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#a89f91] uppercase tracking-wider">
                  Required Signatories ({currentRelationship?.name})
                </label>

                <div className="space-y-2">
                  {currentRelationship?.participants.map(part => {
                    const uid = part.userId;
                    const user = users.find(u => u.id === uid);
                    const isAuthor = uid === currentUserId;
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
                            disabled={isAuthor}
                            onChange={() => {}}
                            className="accent-[#d4af37]"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#fae8d7] flex items-center gap-1.5">
                              <span>{user?.displayName || uid}</span>
                              {isAuthor && (
                                <span className="text-[10px] text-[#d4af37] font-normal">
                                  (Author — automatically consents on proposal)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8c827a]">
                              {user?.username ? `@${user.username}` : ''}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[#8c827a]">
                          {isChecked ? 'Required Signatory' : 'Excluded'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW & PROPOSE */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <strong>Proposal Ready:</strong> Clicking &ldquo;Propose for Negotiation&rdquo; will initiate the negotiation cycle with status <strong>In Negotiation</strong>. Other signatories will be notified to review.
              </div>

              <div className="p-5 rounded-xl bg-[#191614] border border-[#2e2624] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#d4af37] tracking-wider">
                    {scope.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#8c827a]">Status: In Negotiation</span>
                </div>

                <h3 className="text-base font-bold text-[#fae8d7]">{title || 'Untitled Compact'}</h3>

                {contentSummary && (
                  <p className="text-xs text-[#a89f91]">{contentSummary}</p>
                )}

                <div className="pt-2 border-t border-[#2a2422] space-y-2">
                  <span className="text-[11px] font-semibold text-[#8c827a] uppercase">
                    Sections included ({SECTION_TEMPLATES.filter(t => selectedCategories[t.category]).length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SECTION_TEMPLATES.filter(t => selectedCategories[t.category]).map(t => (
                      <span key={t.category} className="px-2.5 py-1 rounded bg-[#25201d] text-[11px] text-[#fae8d7] border border-[#382f2c]">
                        {sectionData[t.category]?.title || t.defaultTitle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2a2422] flex items-center justify-between text-xs text-[#8c827a]">
                  <span>Signatories: {selectedParticipantIds.length} participants</span>
                  <span>{reviewDate ? `Review Date: ${reviewDate}` : 'Open review'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
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
                  setTitle('Mutual Agreement Compact');
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
              <span>Propose for Negotiation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
