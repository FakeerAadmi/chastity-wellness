import {
  PermissionRequest,
  Relationship,
  AgreementScope,
  DynamicPracticeStage,
  ConsentStatus,
  NegotiationResponse,
  AgreementSectionCategory,
  SessionStatus,
  SessionType,
  ParticipantReadiness,
  RitualStatus,
  RitualRecurrence,
} from './domain';

/**
 * Legacy Permission Request structure from the early prototype.
 * Kept here strictly as a migration/adapter target.
 */
export interface LegacyPermissionRequest {
  id: string;
  from: string;
  type: 'shower_clean' | 'sports_release' | 'edging_session' | 'comfort_adjustment' | 'early_release';
  typeLabel: string;
  note: string;
  durationMinutes: number;
  status: 'pending' | 'approved' | 'declined';
  timestamp: string;
}

/**
 * Maps a legacy permission request into the canonical Domain PermissionRequest model.
 */
export function toCanonicalPermissionRequest(
  legacy: LegacyPermissionRequest,
  relationshipId: string,
  dynamicId: string,
  recipientIds: string[] = []
): PermissionRequest {
  return {
    id: legacy.id,
    requesterId: legacy.from,
    recipientIds,
    relationshipId,
    dynamicId,
    requestMode: 'permission',
    requestType: legacy.type,
    title: legacy.typeLabel || legacy.type.replace('_', ' '),
    description: legacy.note,
    durationMinutes: legacy.durationMinutes,
    status: legacy.status,
    history: [
      {
        timestamp: legacy.timestamp || new Date().toISOString(),
        action: 'requested',
        actorId: legacy.from,
        note: legacy.note,
      },
    ],
    createdAt: legacy.timestamp || new Date().toISOString(),
    updatedAt: legacy.timestamp || new Date().toISOString(),
  };
}

/**
 * Maps a canonical Domain PermissionRequest back into the legacy format for legacy UI components.
 */
export function toLegacyPermissionRequest(
  canonical: PermissionRequest,
  fallbackFrom: string = 'Partner'
): LegacyPermissionRequest {
  const allowedLegacyTypes: LegacyPermissionRequest['type'][] = [
    'shower_clean',
    'sports_release',
    'edging_session',
    'comfort_adjustment',
    'early_release',
  ];

  const type = allowedLegacyTypes.includes(canonical.requestType as LegacyPermissionRequest['type'])
    ? (canonical.requestType as LegacyPermissionRequest['type'])
    : 'comfort_adjustment';

  const status: 'pending' | 'approved' | 'declined' =
    canonical.status === 'accepted' || canonical.status === 'approved'
      ? 'approved'
      : canonical.status === 'declined' || canonical.status === 'withdrawn' || canonical.status === 'expired'
      ? 'declined'
      : 'pending';

  return {
    id: canonical.id,
    from: canonical.requesterId || fallbackFrom,
    type,
    typeLabel: canonical.title,
    note: canonical.description || '',
    durationMinutes: canonical.durationMinutes || 30,
    status,
    timestamp: canonical.createdAt,
  };
}

/**
 * Human-readable label for canonical relationship structures.
 */
export function formatRelationshipStructure(structure?: string): string {
  switch (structure) {
    case 'monogamous':
      return 'Monogamous';
    case 'polyamorous':
      return 'Polyamorous';
    case 'open':
      return 'Open';
    case 'solo_exploration':
      return 'Solo exploration';
    case 'custom':
      return 'Custom';
    default:
      return structure ? structure.replace(/_/g, ' ') : 'Partnership';
  }
}

/**
 * Human-readable label for canonical connection contexts.
 */
export function formatConnectionContext(context: string): string {
  switch (context) {
    case 'cohabitating':
      return 'Cohabitating';
    case 'nesting':
      return 'Nesting';
    case 'long_distance':
      return 'Long-distance';
    case 'dating':
      return 'Dating';
    case 'occasional':
      return 'Occasional';
    case 'custom':
      return 'Custom';
    default:
      return context.replace(/_/g, ' ');
  }
}

/**
 * Formats a list of connection contexts into a bullet-separated string (e.g. "Cohabitating · Nesting").
 */
export function formatConnectionContextsList(contexts?: string[]): string {
  if (!contexts || contexts.length === 0) return 'Context not specified';
  return contexts.map(formatConnectionContext).join(' · ');
}

/**
 * Formats a relationship's multidimensional characteristics into a human-readable display string.
 */
export function formatRelationshipDimensions(relationship: Relationship): string {
  const structureLabel = formatRelationshipStructure(relationship.structure);
  const contextLabels = (relationship.connectionContexts || []).map(formatConnectionContext).join(' · ');
  return contextLabels ? `${structureLabel} • ${contextLabels}` : structureLabel;
}

/**
 * Human-readable display formatting for canonical agreement scopes.
 */
export function formatAgreementScope(scope: AgreementScope): string {
  switch (scope) {
    case 'boundary':
      return 'Boundary & Limit';
    case 'agreement':
      return 'Mutual Agreement';
    case 'rule':
      return 'Protocol Rule';
    case 'interest':
      return 'Exploration Interest';
    case 'active_state':
      return 'Active State Protocol';
    default:
      return scope;
  }
}

/**
 * Human-readable display formatting for practice & consent stages.
 */
export function formatPracticeStage(stage?: DynamicPracticeStage): string {
  switch (stage) {
    case 'interested':
      return 'Interested in';
    case 'exploring':
      return 'Exploring';
    case 'agreed':
      return 'Agreed';
    case 'active':
      return 'Active';
    case 'paused':
      return 'Paused';
    case 'hard_boundary':
      return 'Hard boundary';
    default:
      return 'Exploring';
  }
}

/**
 * Human-readable display formatting for dynamic types.
 */
export function formatDynamicType(type?: string): string {
  switch (type) {
    case 'power_exchange':
      return 'Power Exchange';
    case 'chastity_practice':
      return 'Chastity';
    case 'cuckold_hotwife':
      return 'Cuckold / Hotwife';
    case 'bdsm_protocol':
      return 'BDSM Protocol';
    case 'sensory_service':
      return 'Sensory Play';
    case 'service_oriented':
      return 'Service';
    case 'emotional_intimacy':
      return 'Emotional Intimacy';
    case 'roleplay_kink':
      return 'Roleplay & Kink';
    case 'long_distance':
      return 'Long Distance';
    case 'custom':
      return 'Custom Dynamic';
    default:
      return type ? type.replace(/_/g, ' ') : 'Dynamic';
  }
}

/**
 * Format consent status with visual style tokens.
 */
export function formatConsentStatus(status: ConsentStatus): {
  label: string;
  badgeClass: string;
  textClass: string;
} {
  switch (status) {
    case 'active':
    case 'agreed':
      return {
        label: 'Active Agreement',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        textClass: 'text-emerald-400',
      };
    case 'negotiating':
    case 'pending':
      return {
        label: 'In Negotiation',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        textClass: 'text-amber-300',
      };
    case 'pending_approval':
      return {
        label: 'Pending Mutual Approval',
        badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        textClass: 'text-purple-300',
      };
    case 'draft':
      return {
        label: 'Draft Proposal',
        badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
        textClass: 'text-neutral-400',
      };
    case 'paused':
      return {
        label: 'Paused',
        badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
        textClass: 'text-yellow-300',
      };
    case 'retired':
      return {
        label: 'Retired / Archived',
        badgeClass: 'bg-stone-800 text-stone-400 border-stone-700',
        textClass: 'text-stone-400',
      };
    case 'declined':
      return {
        label: 'Declined',
        badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        textClass: 'text-rose-300',
      };
    case 'revoked':
      return {
        label: 'Revoked',
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        textClass: 'text-rose-400',
      };
    case 'expired':
      return {
        label: 'Expired',
        badgeClass: 'bg-neutral-800 text-neutral-400 border-neutral-700',
        textClass: 'text-neutral-400',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
        textClass: 'text-neutral-300',
      };
  }
}

/**
 * Format participant negotiation response.
 */
export function formatNegotiationResponse(response: NegotiationResponse): {
  label: string;
  badgeClass: string;
} {
  switch (response) {
    case 'approved':
    case 'definitely_interested':
      return {
        label: 'Approved',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      };
    case 'interested':
      return {
        label: 'Consenting / Interested',
        badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      };
    case 'changes_requested':
      return {
        label: 'Changes Requested',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    case 'maybe':
    case 'unsure':
    case 'pending':
      return {
        label: 'Awaiting Response',
        badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      };
    case 'declined':
    case 'not_interested':
      return {
        label: 'Declined',
        badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      };
    case 'hard_boundary':
      return {
        label: 'Hard Boundary',
        badgeClass: 'bg-rose-600/20 text-rose-400 border-rose-500/40',
      };
    default:
      return {
        label: response,
        badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
      };
  }
}

/**
 * Format Agreement Section Category.
 */
export function formatSectionCategory(category?: AgreementSectionCategory): string {
  switch (category) {
    case 'intent':
      return 'Intent & Purpose';
    case 'boundaries':
      return 'Boundaries & Limits';
    case 'permissions':
      return 'Permissions & Authority';
    case 'expectations':
      return 'Expectations & Cadence';
    case 'safewords':
      return 'Safewords & Stop Conditions';
    case 'safety':
      return 'Safety & Physical Integrity';
    case 'communication':
      return 'Communication & Transparency';
    case 'aftercare':
      return 'Aftercare & Reconnection';
    case 'exceptions':
      return 'Emergency Exceptions';
    case 'review':
      return 'Review & Renegotiation Date';
    case 'custom':
    default:
      return 'Custom Section';
  }
}

/**
 * Format Session Type.
 */
export function formatSessionType(type?: SessionType): string {
  switch (type) {
    case 'dynamic_practice':
      return 'Dynamic Practice';
    case 'ritual':
      return 'Ritual';
    case 'check_in':
      return 'Check-in';
    case 'date_connection':
      return 'Date / Connection';
    case 'aftercare':
      return 'Aftercare';
    case 'custom':
    default:
      return 'Session';
  }
}

/**
 * Format Session Status with visual styling tokens.
 */
export function formatSessionStatus(status: SessionStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'active':
      return {
        label: 'Active Scene / Session',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dotClass: 'bg-emerald-400 animate-pulse',
      };
    case 'planned':
      return {
        label: 'Planned',
        badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        dotClass: 'bg-sky-400',
      };
    case 'paused':
      return {
        label: 'Paused',
        badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
        dotClass: 'bg-yellow-400',
      };
    case 'completed':
      return {
        label: 'Completed',
        badgeClass: 'bg-stone-800 text-stone-300 border-stone-700',
        dotClass: 'bg-stone-400',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        dotClass: 'bg-rose-400',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
        dotClass: 'bg-neutral-400',
      };
  }
}

/**
 * Format Participant Readiness confirmation.
 */
export function formatParticipantReadiness(readiness?: ParticipantReadiness): {
  label: string;
  badgeClass: string;
} {
  switch (readiness) {
    case 'ready':
      return {
        label: 'Ready',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      };
    case 'needs_discussion':
      return {
        label: 'Needs Discussion',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    case 'not_participating':
      return {
        label: 'Not Participating',
        badgeClass: 'bg-stone-800 text-stone-400 border-stone-700',
      };
    case 'paused':
      return {
        label: 'Paused',
        badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      };
    default:
      return {
        label: 'Awaiting Confirmation',
        badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      };
  }
}

/**
 * Format Ritual Status.
 */
export function formatRitualStatus(status?: RitualStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'active':
      return {
        label: 'Active Practice',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      };
    case 'paused':
      return {
        label: 'Paused Practice',
        badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      };
    case 'retired':
      return {
        label: 'Retired Practice',
        badgeClass: 'bg-stone-800 text-stone-400 border-stone-700',
      };
    default:
      return {
        label: 'Active Practice',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      };
  }
}

/**
 * Format Ritual Recurrence.
 */
export function formatRitualRecurrence(recurrence: RitualRecurrence): string {
  switch (recurrence) {
    case 'daily':
      return 'Daily';
    case 'weekdays':
      return 'Weekdays';
    case 'weekends':
      return 'Weekends';
    case 'weekly':
      return 'Weekly';
    case 'custom':
      return 'Custom';
    case 'none':
    default:
      return 'As Needed';
  }
}


