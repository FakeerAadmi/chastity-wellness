import {
  PermissionRequest,
  Relationship,
  AgreementScope,
  DynamicPracticeStage
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

  return {
    id: canonical.id,
    from: canonical.requesterId || fallbackFrom,
    type,
    typeLabel: canonical.title,
    note: canonical.description || '',
    durationMinutes: canonical.durationMinutes || 30,
    status: canonical.status === 'withdrawn' || canonical.status === 'expired' ? 'declined' : canonical.status,
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
