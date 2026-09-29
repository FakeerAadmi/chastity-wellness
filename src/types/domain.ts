/**
 * Haven Core Domain Model
 * 
 * Re-architected around:
 * User -> Relationship -> Dynamic -> Agreement -> Session / Ritual / Check-in
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
// 2. RELATIONSHIP
// ==========================================
export type RelationshipStatus = 'active' | 'paused' | 'archived';

export interface RelationshipParticipant {
  userId: string;
  displayName: string;
  joinedAt: string;
  roleDescription?: string; // Contextual, not a rigid global enum
}

export interface Relationship {
  id: string;
  name: string;
  participants: RelationshipParticipant[];
  relationshipType: string; // Extensible (e.g., 'primary', 'long_distance', 'power_exchange', 'polyamorous', 'casual', 'custom')
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
  participantIds: string[];
  category: string; // e.g., 'chastity', 'power_exchange', 'long_distance', 'weekend_ritual', 'cuckold_hotwife', 'teasing', 'service', 'custom'
  status: DynamicStatus;
  startDate?: string;
  endDate?: string; // Optional for temporary experiments (e.g. Weekend Dynamic)
  toolboxIds: string[]; // Toolboxes plugged into this dynamic
  history: DynamicHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4. AGREEMENT & NEGOTIATION
// ==========================================
export type AgreementScope = 'interest' | 'boundary' | 'agreement' | 'rule' | 'active_state';
export type ConsentStatus = 'agreed' | 'pending' | 'declined' | 'paused' | 'revoked' | 'expired';
export type NegotiationResponse = 'definitely_interested' | 'interested' | 'maybe' | 'unsure' | 'not_interested' | 'hard_boundary';

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
// 5. PERMISSION REQUEST
// ==========================================
export type PermissionRequestStatus = 'pending' | 'approved' | 'declined' | 'withdrawn' | 'expired';

export interface PermissionRequestHistory {
  timestamp: string;
  action: 'requested' | 'approved' | 'declined' | 'modified' | 'withdrawn';
  actorId: string;
  note?: string;
}

export interface DomainPermissionRequest {
  id: string;
  requesterId: string;
  recipientIds: string[];
  relationshipId: string;
  dynamicId: string;
  requestType: string; // e.g. 'hygiene_shower', 'temporary_release', 'intimacy_session', 'comfort_adjustment', 'custom'
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
// 6. SESSION
// ==========================================
export type SessionStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface SessionWellnessEntry {
  timestamp: string;
  reportedBy: string;
  circulationStatus?: 'normal' | 'pressure' | 'numb_alert';
  skinCondition?: 'intact' | 'redness' | 'irritation_alert';
  comfortScore?: number; // 1-5
  note?: string;
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
export type ToolboxCategory = 'relationships' | 'dynamics' | 'safety' | 'wellness';

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

export interface SafetyPlan {
  id: string;
  userId: string;
  relationshipId?: string;
  dynamicId?: string;
  safewords: SafeWordPair[];
  emergencyPhysicalKeyLocation?: string;
  emergencyRemovalToolLocation?: string;
  emergencyInstructions?: string;
  medicalConditionsAlert?: string[];
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
  authorBadge?: string; // Non-clinical badge (e.g. 'Community Member', 'Experienced Practitioner')
  content: string;
  isHelpfulAdvice: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorPseudonym: string;
  authorRoleDescriptor?: string; // Contextual role descriptor
  categoryTag: string;
  tags: string[];
  contentWarning?: string; // For responsible community disclosure
  sourceProvenance?: 'personal_experience' | 'peer_discussion' | 'educational_reference';
  upvotesCount: number;
  commentsCount: number;
  comments: CommunityComment[];
  isFlaggedForReview?: boolean;
  createdAt: string;
}
