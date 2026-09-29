/**
 * Haven Core Domain Model
 * 
 * Re-architected around:
 * User -> Relationship -> Dynamic -> Agreement -> Session / Ritual / Check-in
 * 
 * Storage note:
 * Current client persistence uses privacy-aware local storage (browser localStorage).
 * It is NOT cryptographically encrypted storage. Full end-to-end cryptographic protection
 * is a future architectural target.
 */

// ==========================================
// 1. USER
// ==========================================
export type ProfileVisibility = 'private' | 'relationship_only' | 'community_pseudonym';

export interface UserPrivacySettings {
  profileVisibility: ProfileVisibility;
  allowPartnerLookup: boolean;
  maskSensitiveContent: boolean;
  stealthDisguise: 'spreadsheet' | 'notes' | 'calendar';
  autoStealthTimeoutMinutes?: number;
  /** Storage posture: privacy-aware local storage */
  storageType?: 'privacy_aware_local_storage';
}

export interface User {
  id: string;
  displayName: string;
  username: string;
  pronouns?: string;
  timezone?: string;
  privacySettings: UserPrivacySettings;
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// 2. RELATIONSHIP DIMENSIONS
// ==========================================
export type RelationshipStatus = 'active' | 'paused' | 'archived';

/** Core relationship structures, cleanly separated from extensible identifiers */
export type CoreRelationshipStructure =
  | 'monogamous'
  | 'polyamorous'
  | 'open'
  | 'solo_exploration'
  | 'custom';

export type RelationshipStructureIdentifier = CoreRelationshipStructure | (string & {});

/** Core connection contexts, cleanly separated from structure and dynamics */
export type CoreConnectionContext =
  | 'cohabitating'
  | 'nesting'
  | 'long_distance'
  | 'dating'
  | 'occasional'
  | 'custom';

export type ConnectionContextIdentifier = CoreConnectionContext | (string & {});

export interface RelationshipParticipant {
  userId: string;
  displayName: string;
  joinedAt: string;
  roleDescription?: string; // Contextual note, not an asymmetric requirement
}

export interface Relationship {
  id: string;
  name: string;
  structure: RelationshipStructureIdentifier;
  connectionContexts: ConnectionContextIdentifier[];
  participants: RelationshipParticipant[];
  description?: string;
  status: RelationshipStatus;
  privacy: 'private' | 'participants_only';
  sharedSettings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. DYNAMIC & ADULT EXPRESSION TAXONOMY
// ==========================================
export type DynamicStatus = 'exploring' | 'negotiating' | 'active' | 'paused' | 'retired';

/**
 * Practice & Consent Lifecycle Stages.
 * Explicitly distinguishes fantasy/interest from active agreement.
 * An expression of interest or fantasy does NOT imply agreement or consent.
 * Canonical progression: Interest → Discussion → Boundaries → Agreement → Practice → Review
 */
export type DynamicPracticeStage =
  | 'interested'     // Fantasy or desire a participant is curious about
  | 'exploring'      // Under active bilateral discussion
  | 'agreed'         // Explicitly consented to
  | 'active'         // Currently in live practice
  | 'paused'         // Temporarily not active
  | 'hard_boundary'; // Explicitly not acceptable

/**
 * Adult Expression Taxonomy.
 * Non-prescriptive, descriptive tags that consenting adults use to define
 * their consensual relationships and dynamics.
 */
export const ADULT_EXPRESSION_TAXONOMY = [
  'BDSM',
  'Dominance / Submission',
  'Power Exchange',
  'Femdom',
  'Male Submission',
  'Chastity',
  'Orgasm Control',
  'Teasing',
  'Cuckold / Hotwife',
  'Voyeurism',
  'Exhibitionism',
  'Roleplay',
  'Service',
  'Protocol',
  'Praise / Degradation',
  'Pet Play',
  'Sensory Play',
  'Impact Play',
  'Rope / Bondage',
  'Fetish',
  'Erotic Roleplay',
  'Long Distance',
  'Remote Play',
  'Open Relationship',
  'Polyamory',
  'Non-monogamy',
  'Jealousy',
  'Communication',
  'Rituals',
  'Aftercare',
] as const;

export type AdultTaxonomyTag = (typeof ADULT_EXPRESSION_TAXONOMY)[number] | (string & {});

/** Core dynamic types, cleanly separated from extensible identifiers */
export type CoreDynamicType =
  | 'power_exchange'
  | 'chastity_practice'
  | 'cuckold_hotwife'
  | 'bdsm_protocol'
  | 'sensory_service'
  | 'service_oriented'
  | 'emotional_intimacy'
  | 'roleplay_kink'
  | 'long_distance'
  | 'custom';

export type DynamicTypeIdentifier = CoreDynamicType | (string & {});

export interface DynamicParticipantRole {
  userId: string;
  roleTitle: string;
  canApprovePermissions?: boolean;
  canInitiateSessions?: boolean;
  canModifyAgreements?: boolean;
}

export interface DynamicHistoryEntry {
  timestamp: string;
  action: 'created' | 'status_changed' | 'agreement_modified' | 'paused' | 'resumed' | 'retired';
  actorId: string;
  note?: string;
}

export interface Dynamic {
  id: string;
  relationshipId: string;
  name: string;
  description?: string;
  dynamicType: DynamicTypeIdentifier;
  /** Descriptive adult expression & dynamic tags (e.g. Chastity, Power Exchange, Long Distance) */
  tags?: string[];
  /** Explicit practice & consent stage distinguishing fantasy from agreed practice */
  practiceStage?: DynamicPracticeStage;
  /** Canonical participant membership list (required) */
  participantIds: string[];
  /** Optional contextual roles (having a role is NOT required to participate) */
  participantRoles?: DynamicParticipantRole[];
  status: DynamicStatus;
  startDate?: string;
  endDate?: string;
  /** Active toolboxes plugged into this dynamic (empty array valid) */
  toolboxIds: string[];
  /** Chronological history of dynamic lifecycle changes (empty array valid) */
  history: DynamicHistoryEntry[];
  activeAgreementsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4. AGREEMENT & NEGOTIATION (Phase 4 Canonical Model)
// ==========================================
export type AgreementScope =
  | 'interest'
  | 'boundary'
  | 'agreement'
  | 'rule'
  | 'active_state';

export type ConsentStatus =
  | 'draft'
  | 'negotiating'
  | 'pending_approval'
  | 'active'
  | 'agreed'           // alias for active
  | 'pending'          // alias for negotiating
  | 'paused'
  | 'retired'
  | 'revoked'
  | 'declined'
  | 'expired';

export type NegotiationResponse =
  | 'approved'
  | 'changes_requested'
  | 'declined'
  | 'pending'
  | 'definitely_interested'
  | 'interested'
  | 'maybe'
  | 'unsure'
  | 'not_interested'
  | 'hard_boundary';

export type AgreementSectionCategory =
  | 'intent'
  | 'boundaries'
  | 'permissions'
  | 'expectations'
  | 'safewords'
  | 'safety'
  | 'communication'
  | 'aftercare'
  | 'exceptions'
  | 'review'
  | 'custom';

export interface AgreementSection {
  id: string;
  category?: AgreementSectionCategory;
  title: string;
  content: string;
  order?: number;
}

export interface AgreementParticipantResponse {
  participantId: string;
  response: NegotiationResponse;
  conditions?: string;
  note?: string;
  respondedAt?: string;
}

export interface AgreementRevision {
  revisionId: string;
  version?: number;
  text?: string;
  summary?: string;
  revisedAt: string;
  revisedBy: string;
  reason?: string;
  changes?: string;
}

export interface Agreement {
  id: string;
  dynamicId?: string;
  relationshipId: string;
  title: string;
  scope: AgreementScope;
  content: string;
  sections?: AgreementSection[];
  participantResponses: AgreementParticipantResponse[];
  status: ConsentStatus;
  effectiveFrom?: string;
  expiresAt?: string;
  reviewDate?: string;
  revisionHistory: AgreementRevision[];
  revokedAt?: string;
  revocationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4.5. DESIRES & MUTUAL DISCOVERY (Phase 6)
// ==========================================
export type DesireRating =
  | 'eager'           // Enthusiastic yes / eager about
  | 'curious'         // Curious about / open to try
  | 'exploring'       // Exploring / maybe interested
  | 'fantasy_only'    // Erotic in thought only / no physical execution
  | 'unsure'          // Unsure / needs more context or discussion
  | 'not_interested'  // Not interested
  | 'hard_boundary';  // Hard limit / inviolable boundary

export type DesireSharingMode =
  | 'private'              // Only creator sees it
  | 'mutual_match_only'    // Double-blind: only revealed if both/all express interest
  | 'shared_relationship'  // Visible to relationship participants
  | 'shared_selected';     // Visible to designated user IDs

export type DesireCategory =
  | 'bdsm_power'
  | 'chastity_control'
  | 'non_monogamy'
  | 'roleplay_fantasy'
  | 'intimacy_sensual'
  | 'service_protocol'
  | 'fetish_kink'
  | 'emotional_connection'
  | 'daily_living';

export interface ParticipantDesireResponse {
  userId: string;
  rating: DesireRating;
  privateNotes?: string;
  updatedAt: string;
}

export interface Desire {
  id: string;
  title: string;
  description: string;
  category: DesireCategory;
  tags: string[];
  createdById: string;
  relationshipId?: string;
  dynamicId?: string;
  sharingMode: DesireSharingMode;
  allowedParticipantIds?: string[];
  participantResponses: Record<string, ParticipantDesireResponse>;
  /** Optional linked dynamic or agreement if graduated to practice */
  graduatedToDynamicId?: string;
  graduatedToAgreementId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. REQUEST & PERMISSION REQUEST (Phase 6 Canonical Model)
// ==========================================
export type RequestMode = 'proposal' | 'permission';

export type HavenRequestStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'discussing'
  | 'counter_proposed'
  | 'not_now'
  | 'withdrawn'
  | 'expired'
  | 'approved'; // Alias for accepted in backward compat

export type PermissionRequestStatus = HavenRequestStatus;

export interface RequestHistoryEntry {
  timestamp: string;
  action:
    | 'requested'
    | 'accepted'
    | 'approved'
    | 'declined'
    | 'discuss_requested'
    | 'counter_proposed'
    | 'not_now'
    | 'modified'
    | 'withdrawn';
  actorId: string;
  note?: string;
}

export type PermissionRequestHistory = RequestHistoryEntry;

export interface RequestCounterProposal {
  modifiedTitle?: string;
  modifiedConditions?: string;
  modifiedDurationMinutes?: number;
  note: string;
  proposedById: string;
  proposedAt: string;
}

export interface HavenRequest {
  id: string;
  requesterId: string;
  recipientIds: string[]; // Supports 1-to-1, 1-to-many, multi-party
  relationshipId: string;
  dynamicId?: string;
  agreementId?: string;
  requestMode?: RequestMode; // 'proposal' for casual/interpersonal vs 'permission' for D/s/Chastity
  requestType: string; // e.g. 'chastity_release', 'scene_proposal', 'outside_date', 'protocol_waiver', 'date_invitation'
  title: string;
  description?: string;
  conditions?: string;
  durationMinutes?: number;
  status: HavenRequestStatus;
  responseNote?: string;
  counterProposal?: RequestCounterProposal;
  expiresAt?: string;
  history: RequestHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

/** PermissionRequest alias maintaining complete backward compatibility */
export type PermissionRequest = HavenRequest;

// ==========================================
// 5.5. TASKS & PROOF VERIFICATION (Phase 6)
// ==========================================
export type TaskRecurrence = 'once' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
export type TaskPriority = 'gentle' | 'standard' | 'high_focus';
export type TaskProofType = 'none' | 'text_note' | 'ephemeral_photo' | 'voice_note' | 'completion_confirmation';
export type TaskStatus = 'pending' | 'submitted' | 'verified' | 'completed' | 'dismissed';

export interface TaskProof {
  proofType: TaskProofType;
  submittedAt: string;
  submittedById: string;
  textNote?: string;
  mediaUri?: string; // Encrypted / private ephemeral reference
  mediaExpiresAt?: string;
  verifiedAt?: string;
  verifiedById?: string;
  verificationNote?: string;
}

export interface HavenTask {
  id: string;
  title: string;
  description?: string;
  assignedById: string;
  assignedToIds: string[]; // Multi-person support
  relationshipId: string;
  dynamicId?: string;
  agreementId?: string;
  dueDate?: string;
  recurrence: TaskRecurrence;
  priority: TaskPriority;
  proofType: TaskProofType;
  proof?: TaskProof;
  notes?: string;
  rewardDescription?: string; // e.g. "Choose Saturday date", "Receive surprise", "Unlocked massage"
  visibility: 'relationship' | 'assignee_only';
  status: TaskStatus;
  category: 'ordinary' | 'ldr' | 'ds_protocol' | 'chastity' | 'relationship_care' | 'custom';
  createdAt: string;
  updatedAt: string;
}


// ==========================================
// 6. FIRST-CLASS SESSION MODEL (Phase 5)
// ==========================================
export type SessionStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';

export type SessionType =
  | 'dynamic_practice'
  | 'ritual'
  | 'check_in'
  | 'date_connection'
  | 'aftercare'
  | 'custom';

export type ParticipantReadiness =
  | 'ready'
  | 'not_participating'
  | 'needs_discussion'
  | 'paused';

export interface SessionWellnessEntry {
  timestamp: string;
  reportedBy: string;
  comfortScore?: number; // 1-5 generic comfort score
  note?: string;
  metadata?: Record<string, unknown>; // Extension-specific or dynamic-specific physiological notes
}

export interface SessionEmotionalEntry {
  timestamp: string;
  reportedBy: string;
  moodState: string;
  connectionLevel?: number; // 1-5
  note?: string;
}

export interface SessionAftercare {
  completed: boolean;
  notes?: string;
  comfortCheckDone: boolean;
  hydrationDone: boolean;
  emotionalDebriefDone: boolean;
}

export interface Session {
  id: string;
  title?: string;
  sessionType?: SessionType;
  dynamicId?: string;
  relationshipId: string;
  participantIds: string[];
  startedAt?: string;
  endedAt?: string;
  status: SessionStatus;
  intendedDurationMinutes?: number;
  actualDurationMinutes?: number;
  goal?: string;
  agreementIds?: string[];
  tags?: string[];
  scheduleType?: 'now' | 'later' | 'no_fixed_time';
  scheduledFor?: string;
  participantReadiness?: Record<string, ParticipantReadiness>;
  preparationNotes?: string;
  freeformNote?: string;
  wellnessChecks: SessionWellnessEntry[];
  emotionalCheckIns: SessionEmotionalEntry[];
  aftercare?: SessionAftercare;
  notes?: string;
  /** Dynamic-specific or extension-specific metadata (keeps Session generic) */
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. RITUAL (Phase 5 Interactive & Interrupted Practices)
// ==========================================
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom' | 'none';
export type RitualStatus = 'active' | 'paused' | 'retired';

export interface RitualStep {
  id: string;
  order: number;
  title: string;
  prompt: string;
  options?: string[]; // e.g. ["Good", "Tired", "Overwhelmed", "Need quiet", "Want connection", "Something feels wrong"]
  inputType?: 'options' | 'text' | 'acknowledgement';
  isRequired?: boolean;
}

export interface RitualStepResponse {
  stepId: string;
  selectedOption?: string;
  note?: string;
  completedAt: string;
}

export interface RitualCompletion {
  id: string;
  completedAt: string;
  completedBy: string;
  note?: string;
  emotionalState?: string;
  stepResponses?: RitualStepResponse[];
  stoppedEarly?: boolean;
  interruptedReason?: string;
}

export interface Ritual {
  id: string;
  relationshipId: string;
  dynamicId?: string;
  agreementId?: string;
  name: string;
  description: string;
  type: 'romantic' | 'emotional' | 'practical' | 'sensual' | 'dynamic_discipline';
  tags?: string[];
  status?: RitualStatus;
  participantIds: string[];
  recurrence: RitualRecurrence;
  scheduledTime?: string;
  steps?: RitualStep[];
  hasCheckIn?: boolean;
  hasAftercare?: boolean;
  aftercarePrompt?: string;
  completions: RitualCompletion[];
  privacyLevel: 'relationship' | 'private_to_user';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 8. CHECK-IN (Phase 5 Multi-dimensional Relationship Pulse)
// ==========================================
export type CheckInType = 'relationship' | 'dynamic' | 'wellness' | 'emotional' | 'aftercare' | 'custom';
export type CheckInScale = 'great' | 'good' | 'neutral' | 'uneasy' | 'bad' | 'need_support';

export type EmotionalCheckInDimension = 'good' | 'neutral' | 'difficult' | 'need_support';
export type ConsentCheckInDimension = 'comfortable' | 'unsure' | 'want_to_pause' | 'want_to_renegotiate';
export type DynamicCheckInDimension = 'working_well' | 'needs_discussion' | 'boundary_concern' | 'pause_requested';

export interface CheckIn {
  id: string;
  userId: string;
  relationshipId?: string;
  dynamicId?: string;
  sessionId?: string;
  type: CheckInType;
  prompt: string;
  scaleResponse: CheckInScale;
  emotionalDimension?: EmotionalCheckInDimension;
  consentDimension?: ConsentCheckInDimension;
  dynamicDimension?: DynamicCheckInDimension;
  freeformFeedback?: string;
  detailNote?: string;
  targetUserId?: string;
  participantIds?: string[];
  isPrivateToUser: boolean;
  createdAt: string;
}

// ==========================================
// 9. TOOLBOX
// ==========================================
export type ToolboxCategory =
  | 'relationship'
  | 'communication'
  | 'bdsm_power_exchange'
  | 'chastity'
  | 'non_monogamy'
  | 'roleplay_kink'
  | 'long_distance'
  | 'safety_consent'
  | 'aftercare_wellness'
  | 'relationships' // backward compat
  | 'dynamics'      // backward compat
  | 'safety'        // backward compat
  | 'wellness';     // backward compat

export interface Toolbox {
  id: string;
  name: string;
  category: ToolboxCategory;
  description: string;
  iconName: string;
  requiredFeatures: string[];
  supportedDynamics: string[];
  /** Explicit adult expression / feature tags */
  tags?: string[];
  version: string;
  configuration?: Record<string, unknown>;
}

// ==========================================
// 10. SAFETY PLAN
// ==========================================
export interface SafeWordPair {
  word: string;
  meaning: 'stop_immediate_release' | 'slow_down_checkin' | 'praise_continue';
}

export interface MeetupSafetyDetails {
  contactPerson: string;
  location: string;
  scheduledTime: string;
  expectedReturnTime: string;
  trustedContactPhone?: string;
  checkInScheduleMinutes?: number;
  safeCodePhrase?: string;
  exitPlanNotes?: string;
  status: 'planned' | 'active' | 'checked_in' | 'completed' | 'escalation_needed';
}

/**
 * Isolated sensitive health alert:
 * Sensitive health/medical information is never part of a general medical profile,
 * never visible on general profiles, and never included in ordinary relationship summaries.
 * It is strictly optional, explicitly entered by the user, private by default, and separately permissioned.
 */
export interface IsolatedSensitiveHealthAlert {
  id: string;
  conditionDescription: string;
  notes?: string;
  permissionedParticipantIds: string[];
  isPrivateByDefault: boolean;
}

export interface SafetyPlan {
  id: string;
  userId: string;
  relationshipId?: string;
  dynamicId?: string;
  safewords: SafeWordPair[];
  emergencyPhysicalKeyLocation?: string;
  emergencyRemovalToolLocation?: string;
  emergencyInstructions?: string;
  isolatedHealthAlerts?: IsolatedSensitiveHealthAlert[];
  meetupSafety?: MeetupSafetyDetails;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 11. JOURNAL ENTRY (Sensitive Content Model)
// ==========================================
export type ContentPrivacyLevel = 'private_only' | 'relationship_shared' | 'selected_participants' | 'community_pseudonym';

export interface JournalEntry {
  id: string;
  userId: string;
  relationshipId?: string;
  dynamicId?: string;
  sessionId?: string;
  title?: string;
  content: string;
  tags: string[];
  privacy: ContentPrivacyLevel;
  sensitiveCategory?: 'intimate_reflection' | 'fantasy' | 'aftercare_notes' | 'dynamic_log';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 12. COMMUNITY POST & COMMENT
// ==========================================
export interface CommunityComment {
  id: string;
  postId: string;
  authorPseudonym: string;
  authorBadge?: string;
  content: string;
  isHelpfulAdvice: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorPseudonym: string;
  authorRoleDescriptor?: string;
  categoryTag: string;
  tags: string[];
  contentWarning?: string;
  sourceProvenance?: 'personal_experience' | 'peer_discussion' | 'educational_reference';
  upvotesCount: number;
  commentsCount: number;
  comments: CommunityComment[];
  isFlaggedForReview?: boolean;
  createdAt: string;
}
