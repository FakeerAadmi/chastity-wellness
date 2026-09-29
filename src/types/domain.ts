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
// 3. DYNAMIC
// ==========================================
export type DynamicStatus = 'exploring' | 'negotiating' | 'active' | 'paused' | 'retired';

/** Core dynamic types, cleanly separated from extensible identifiers */
export type CoreDynamicType =
  | 'power_exchange'
  | 'emotional_intimacy'
  | 'sensory_service'
  | 'service_oriented'
  | 'chastity_practice'
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
// 4. AGREEMENT & NEGOTIATION
// ==========================================
export type AgreementScope =
  | 'interest'
  | 'boundary'
  | 'agreement'
  | 'rule'
  | 'active_state';

export type ConsentStatus =
  | 'agreed'
  | 'pending'
  | 'declined'
  | 'paused'
  | 'revoked'
  | 'expired';

export type NegotiationResponse =
  | 'definitely_interested'
  | 'interested'
  | 'maybe'
  | 'unsure'
  | 'not_interested'
  | 'hard_boundary';

export interface AgreementParticipantResponse {
  participantId: string;
  response: NegotiationResponse;
  conditions?: string;
  respondedAt: string;
}

export interface AgreementRevision {
  revisionId: string;
  text: string;
  revisedAt: string;
  revisedBy: string;
  reason?: string;
}

export interface Agreement {
  id: string;
  dynamicId: string;
  relationshipId: string;
  title: string;
  scope: AgreementScope;
  content: string;
  participantResponses: AgreementParticipantResponse[];
  status: ConsentStatus;
  effectiveFrom?: string;
  expiresAt?: string;
  revisionHistory: AgreementRevision[];
  revokedAt?: string;
  revocationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. PERMISSION REQUEST (Canonical Model)
// ==========================================
export type PermissionRequestStatus = 'pending' | 'approved' | 'declined' | 'withdrawn' | 'expired';

export interface PermissionRequestHistory {
  timestamp: string;
  action: 'requested' | 'approved' | 'declined' | 'modified' | 'withdrawn';
  actorId: string;
  note?: string;
}

export interface PermissionRequest {
  id: string;
  requesterId: string;
  recipientIds: string[];
  relationshipId: string;
  dynamicId: string;
  requestType: string;
  title: string;
  description?: string;
  conditions?: string;
  durationMinutes?: number;
  status: PermissionRequestStatus;
  responseNote?: string;
  expiresAt?: string;
  history: PermissionRequestHistory[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 6. GENERIC SESSION MODEL
// Reusable across dynamics (rituals, intimacy, communication, wellness, power exchange)
// ==========================================
export type SessionStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';

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
  dynamicId: string;
  relationshipId: string;
  participantIds: string[];
  startedAt?: string;
  endedAt?: string;
  status: SessionStatus;
  intendedDurationMinutes?: number;
  actualDurationMinutes?: number;
  goal?: string;
  agreementIds: string[];
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
// 7. RITUAL
// ==========================================
export type RitualRecurrence = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom' | 'none';

export interface RitualCompletion {
  id: string;
  completedAt: string;
  completedBy: string;
  note?: string;
  emotionalState?: string;
}

export interface Ritual {
  id: string;
  relationshipId: string;
  dynamicId?: string;
  name: string;
  description: string;
  type: 'romantic' | 'emotional' | 'practical' | 'sensual' | 'dynamic_discipline';
  participantIds: string[];
  recurrence: RitualRecurrence;
  scheduledTime?: string;
  completions: RitualCompletion[];
  privacyLevel: 'relationship' | 'private_to_user';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 8. CHECK-IN
// ==========================================
export type CheckInType = 'relationship' | 'dynamic' | 'wellness' | 'emotional' | 'aftercare' | 'custom';
export type CheckInScale = 'great' | 'good' | 'neutral' | 'uneasy' | 'bad' | 'need_support';

export interface CheckIn {
  id: string;
  userId: string;
  relationshipId?: string;
  dynamicId?: string;
  sessionId?: string;
  type: CheckInType;
  prompt: string;
  scaleResponse: CheckInScale;
  detailNote?: string;
  isPrivateToUser: boolean;
  createdAt: string;
}

// ==========================================
// 9. TOOLBOX
// ==========================================
export type ToolboxCategory = 'relationships' | 'dynamics' | 'safety' | 'wellness' | 'communication';

export interface Toolbox {
  id: string;
  name: string;
  category: ToolboxCategory;
  description: string;
  iconName: string;
  requiredFeatures: string[];
  supportedDynamics: string[];
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
