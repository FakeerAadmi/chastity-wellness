import {
  PermissionRequest,
  Relationship,
  AgreementScope
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
 * Formats a relationship's multidimensional characteristics into a human-readable display string.
 */
export function formatRelationshipDimensions(relationship: Relationship): string {
  const structureLabel = relationship.structure
    ? relationship.structure.replace(/_/g, ' ')
    : 'Partnership';

  const contextLabels = (relationship.connectionContexts || [])
    .map(ctx => ctx.replace(/_/g, ' '))
    .join(', ');

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
