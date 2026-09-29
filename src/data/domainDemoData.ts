import {
  User,
  Relationship,
  Dynamic,
  Agreement,
  PermissionRequest,
  Session,
  Ritual,
  CheckIn,
  Toolbox,
  SafetyPlan
} from '../types/domain';

export const CURRENT_USER: User = {
  id: 'usr_alex',
  displayName: 'Alex',
  username: 'alex_sanctuary',
  pronouns: 'they/them',
  timezone: 'America/New_York',
  privacySettings: {
    profileVisibility: 'relationship_only',
    allowPartnerLookup: true,
    maskSensitiveContent: true,
    stealthDisguise: 'spreadsheet',
    autoStealthTimeoutMinutes: 10,
    storageType: 'privacy_aware_local_storage',
  },
  createdAt: '2026-01-10T12:00:00Z',
};

export const PARTNER_SAM: User = {
  id: 'usr_sam',
  displayName: 'Sam',
  username: 'sam_steadfast',
  pronouns: 'she/her',
  timezone: 'America/New_York',
  privacySettings: {
    profileVisibility: 'relationship_only',
    allowPartnerLookup: true,
    maskSensitiveContent: false,
    stealthDisguise: 'notes',
    storageType: 'privacy_aware_local_storage',
  },
  createdAt: '2026-01-12T14:30:00Z',
};

export const PARTNER_JORDAN: User = {
  id: 'usr_jordan',
  displayName: 'Jordan',
  username: 'jordan_distant',
  pronouns: 'he/they',
  timezone: 'America/Los_Angeles',
  privacySettings: {
    profileVisibility: 'private',
    allowPartnerLookup: false,
    maskSensitiveContent: true,
    stealthDisguise: 'calendar',
    storageType: 'privacy_aware_local_storage',
  },
  createdAt: '2026-02-01T18:00:00Z',
};

/**
 * Example relationships illustrating distinct structures and connection contexts.
 * NOTE: These demonstrate schema flexibility and are not rigid defaults.
 */
export const INITIAL_RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel_alex_sam',
    name: 'Alex & Sam',
    structure: 'monogamous',
    connectionContexts: ['cohabitating', 'nesting'],
    description: 'Co-habitating nesting partnership centered on shared vulnerability, gentle discipline, and mutual wellness.',
    status: 'active',
    privacy: 'participants_only',
    participants: [
      {
        userId: 'usr_alex',
        displayName: 'Alex',
        joinedAt: '2026-01-10T12:00:00Z',
        roleDescription: 'Exploring Partner',
      },
      {
        userId: 'usr_sam',
        displayName: 'Sam',
        joinedAt: '2026-01-12T14:30:00Z',
        roleDescription: 'Keyholder & Anchor Partner',
      },
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'rel_alex_jordan',
    name: 'Alex & Jordan',
    structure: 'open',
    connectionContexts: ['long_distance'],
    description: 'Long-distance emotional intimacy and asynchronous reflection rituals across coasts.',
    status: 'active',
    privacy: 'participants_only',
    participants: [
      {
        userId: 'usr_alex',
        displayName: 'Alex',
        joinedAt: '2026-02-01T18:00:00Z',
      },
      {
        userId: 'usr_jordan',
        displayName: 'Jordan',
        joinedAt: '2026-02-01T18:00:00Z',
      },
    ],
    createdAt: '2026-02-01T18:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
];

/**
 * Example dynamics demonstrating canonical participant membership,
 * optional contextual roles, and strict toolbox/history tracking.
 */
export const INITIAL_DYNAMICS: Dynamic[] = [
  {
    id: 'dyn_chastity_wellness',
    relationshipId: 'rel_alex_sam',
    name: 'Mindful Chastity & Hygiene Protocol',
    dynamicType: 'chastity_practice',
    description: 'Structured physical and mental focus practice with emphasis on skin hygiene, daily checks, and safe keys.',
    status: 'active',
    participantIds: ['usr_alex', 'usr_sam'],
    participantRoles: [
      {
        userId: 'usr_alex',
        roleTitle: 'Chaste Partner',
        canApprovePermissions: false,
        canInitiateSessions: true,
        canModifyAgreements: true,
      },
      {
        userId: 'usr_sam',
        roleTitle: 'Keyholder',
        canApprovePermissions: true,
        canInitiateSessions: true,
        canModifyAgreements: true,
      },
    ],
    toolboxIds: ['tbx_chastity_vault', 'tbx_hygiene_guides'],
    history: [
      {
        timestamp: '2026-01-18T10:00:00Z',
        action: 'created',
        actorId: 'usr_alex',
        note: 'Dynamic initiated with mutual consent',
      },
    ],
    activeAgreementsCount: 4,
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-09-29T10:00:00Z',
  },
  {
    id: 'dyn_weekend_power_exchange',
    relationshipId: 'rel_alex_sam',
    name: 'Weekend Dynamic Protocol',
    dynamicType: 'power_exchange',
    description: 'Consensual service and devotion dynamic active exclusively from Friday 18:00 through Sunday 20:00.',
    status: 'active',
    participantIds: ['usr_alex', 'usr_sam'],
    participantRoles: [
      {
        userId: 'usr_alex',
        roleTitle: 'Submissive Partner',
        canApprovePermissions: false,
        canInitiateSessions: true,
        canModifyAgreements: true,
      },
      {
        userId: 'usr_sam',
        roleTitle: 'Dominant / Guide',
        canApprovePermissions: true,
        canInitiateSessions: true,
        canModifyAgreements: true,
      },
    ],
    toolboxIds: ['tbx_rituals_engine', 'tbx_aftercare_debrief'],
    history: [
      {
        timestamp: '2026-02-15T15:00:00Z',
        action: 'created',
        actorId: 'usr_sam',
        note: 'Weekend protocol established',
      },
    ],
    activeAgreementsCount: 3,
    createdAt: '2026-02-15T15:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 'dyn_asynch_reflection',
    relationshipId: 'rel_alex_jordan',
    name: 'Evening Connection & Reflections',
    dynamicType: 'emotional_intimacy',
    description: 'Structured evening check-in questions and weekly reflection exchanges. Equal partners without asymmetric roles.',
    status: 'active',
    participantIds: ['usr_alex', 'usr_jordan'],
    // Note: No asymmetric participantRoles defined, demonstrating roles are not required
    toolboxIds: ['tbx_nonviolent_requests'],
    history: [
      {
        timestamp: '2026-02-10T12:00:00Z',
        action: 'created',
        actorId: 'usr_jordan',
        note: 'Bicoastal connection established',
      },
    ],
    activeAgreementsCount: 2,
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-09-22T08:00:00Z',
  },
  {
    id: 'dyn_sensory_service',
    relationshipId: 'rel_alex_sam',
    name: 'Sensory Deprivation & Gentle Touch',
    dynamicType: 'sensory_service',
    description: 'Exploring sensory stillness, blindfolds, and audio soundscapes during evening unwind periods.',
    status: 'exploring',
    participantIds: ['usr_alex', 'usr_sam'],
    toolboxIds: [],
    history: [
      {
        timestamp: '2026-09-20T14:00:00Z',
        action: 'created',
        actorId: 'usr_alex',
        note: 'Exploratory dynamic drafted',
      },
    ],
    activeAgreementsCount: 1,
    createdAt: '2026-09-20T14:00:00Z',
    updatedAt: '2026-09-28T19:00:00Z',
  },
];

/**
 * Strict Agreements keeping scopes, negotiation responses, and consent status separate.
 */
export const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'agr_daily_hygiene',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_chastity_wellness',
    title: 'Daily Hygiene & Device Inspection',
    scope: 'boundary',
    content: 'Physical inspection and cleaning must occur at least once every 24 hours. The wear session is paused immediately if any skin erythema or pinching occurs.',
    participantResponses: [
      {
        participantId: 'usr_alex',
        response: 'definitely_interested',
        respondedAt: '2026-01-20T11:00:00Z',
      },
      {
        participantId: 'usr_sam',
        response: 'definitely_interested',
        respondedAt: '2026-01-20T11:00:00Z',
      },
    ],
    status: 'agreed',
    revisionHistory: [
      {
        revisionId: 'rev_1',
        text: 'Initial hygiene requirement',
        revisedAt: '2026-01-18T10:00:00Z',
        revisedBy: 'usr_sam',
      },
      {
        revisionId: 'rev_2',
        text: 'Added mandatory immediate pause condition on skin erythema',
        revisedAt: '2026-08-15T10:00:00Z',
        revisedBy: 'usr_alex',
      },
    ],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'agr_safeword_guarantee',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_chastity_wellness',
    title: 'Zero-Penalty Safeword Protocol',
    scope: 'rule',
    content: 'Calling "Red" or using the physical key vault incurs absolutely no guilt, shame, or relationship penalty. Safety and bodily integrity remain unconditionally paramount.',
    participantResponses: [
      {
        participantId: 'usr_alex',
        response: 'definitely_interested',
        respondedAt: '2026-01-19T09:00:00Z',
      },
      {
        participantId: 'usr_sam',
        response: 'definitely_interested',
        respondedAt: '2026-01-19T09:00:00Z',
      },
    ],
    status: 'agreed',
    revisionHistory: [
      {
        revisionId: 'rev_1',
        text: 'Initial safeword agreement',
        revisedAt: '2026-01-18T10:00:00Z',
        revisedBy: 'usr_alex',
      },
    ],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-19T09:00:00Z',
  },
  {
    id: 'agr_weekend_curfew',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_weekend_power_exchange',
    title: 'Evening Digital Curfew & Ritual',
    scope: 'agreement',
    content: 'Phones down at 22:00 on Friday & Saturday for 30 minutes of intentional dialogue and physical touch.',
    participantResponses: [
      {
        participantId: 'usr_alex',
        response: 'interested',
        respondedAt: '2026-02-16T12:00:00Z',
      },
      {
        participantId: 'usr_sam',
        response: 'definitely_interested',
        respondedAt: '2026-02-16T12:00:00Z',
      },
    ],
    status: 'agreed',
    revisionHistory: [],
    createdAt: '2026-02-15T15:00:00Z',
    updatedAt: '2026-02-16T12:00:00Z',
  },
  {
    id: 'agr_asynch_checkin_window',
    relationshipId: 'rel_alex_jordan',
    dynamicId: 'dyn_asynch_reflection',
    title: 'Three Asynchronous Touchpoints per Week',
    scope: 'agreement',
    content: 'Sharing at least one reflective voice memo or written prompt answer on Tuesday, Thursday, and Sunday.',
    participantResponses: [
      {
        participantId: 'usr_alex',
        response: 'interested',
        respondedAt: '2026-02-12T14:00:00Z',
      },
      {
        participantId: 'usr_jordan',
        response: 'definitely_interested',
        respondedAt: '2026-02-12T14:00:00Z',
      },
    ],
    status: 'agreed',
    revisionHistory: [],
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-02-12T14:00:00Z',
  },
];

/**
 * Strict canonical Permission Requests.
 */
export const INITIAL_PERMISSION_REQUESTS: PermissionRequest[] = [
  {
    id: 'req_weekend_protocol_extension',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_weekend_power_exchange',
    requesterId: 'usr_alex',
    recipientIds: ['usr_sam'],
    requestType: 'activity_extension',
    title: 'Request: Extend Sunday Evening Ritual by 1 Hour',
    description: 'Alex requested to extend the quiet tea and massage ritual until 21:00 before transitioning back into work week mode.',
    status: 'pending',
    history: [
      {
        timestamp: '2026-09-29T17:30:00Z',
        action: 'requested',
        actorId: 'usr_alex',
        note: 'Submitted through dynamic request desk',
      },
    ],
    createdAt: '2026-09-29T17:30:00Z',
    updatedAt: '2026-09-29T17:30:00Z',
  },
];

export const INITIAL_RITUALS: Ritual[] = [
  {
    id: 'rit_morning_intention',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_weekend_power_exchange',
    name: 'Morning Intention & Tea Ritual',
    description: 'Brewing morning herbal tea and presenting daily intentions to partner before screen time.',
    type: 'dynamic_discipline',
    participantIds: ['usr_alex', 'usr_sam'],
    recurrence: 'daily',
    scheduledTime: '08:00',
    completions: [
      {
        id: 'cmp_1',
        completedAt: '2026-09-29T08:15:00Z',
        completedBy: 'usr_alex',
        note: 'Completed with mint tea. Grounded and calm.',
        emotionalState: 'content',
      },
    ],
    privacyLevel: 'relationship',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-09-29T08:15:00Z',
  },
  {
    id: 'rit_hygiene_check',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_chastity_wellness',
    name: 'Daily Physiological Comfort Check',
    description: 'Thorough skin inspection, antibacterial cleanse, and verification of zero pressure points.',
    type: 'practical',
    participantIds: ['usr_alex', 'usr_sam'],
    recurrence: 'daily',
    scheduledTime: '20:30',
    completions: [],
    privacyLevel: 'relationship',
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-09-28T20:45:00Z',
  },
  {
    id: 'rit_evening_aftercare',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_weekend_power_exchange',
    name: 'Evening Debrief & Aftercare',
    description: '15-minute quiet dialogue to discuss energetic headspace, affirmations, and tomorrow’s emotional needs.',
    type: 'emotional',
    participantIds: ['usr_alex', 'usr_sam'],
    recurrence: 'daily',
    scheduledTime: '22:00',
    completions: [],
    privacyLevel: 'relationship',
    createdAt: '2026-02-18T11:00:00Z',
    updatedAt: '2026-09-28T22:10:00Z',
  },
];

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: 'chk_101',
    userId: 'usr_alex',
    relationshipId: 'rel_alex_sam',
    dynamicId: 'dyn_chastity_wellness',
    type: 'dynamic',
    prompt: 'How is physical comfort and mental bandwidth feeling today?',
    scaleResponse: 'great',
    detailNote: 'No pressure points, feeling connected and focused.',
    isPrivateToUser: false,
    createdAt: '2026-09-28T20:30:00Z',
  },
];

/**
 * Generic Session instance with extension/dynamic details isolated in metadata.
 */
export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'ses_active_chastity',
    dynamicId: 'dyn_chastity_wellness',
    relationshipId: 'rel_alex_sam',
    participantIds: ['usr_alex', 'usr_sam'],
    startedAt: '2026-09-27T10:00:00Z',
    status: 'active',
    intendedDurationMinutes: 72 * 60, // 3 days
    goal: 'Mindful focus and connection leading up to the weekend.',
    agreementIds: ['agr_daily_hygiene', 'agr_safeword_guarantee'],
    wellnessChecks: [
      {
        timestamp: '2026-09-28T10:00:00Z',
        reportedBy: 'usr_alex',
        comfortScore: 5,
        note: 'Skin healthy, no chafing.',
        metadata: {
          inspectionCompleted: true,
          hygieneRoutineDone: true,
        },
      },
    ],
    emotionalCheckIns: [
      {
        timestamp: '2026-09-28T18:00:00Z',
        reportedBy: 'usr_alex',
        moodState: 'Grounded and peaceful',
        connectionLevel: 5,
      },
    ],
    metadata: {
      practiceArchetype: 'chastity_practice',
      lockType: 'digital_timer_vault',
    },
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-28T18:00:00Z',
  },
];

/**
 * Safety plan utilizing explicitly synthetic placeholders for security locations.
 */
export const INITIAL_SAFETY_PLAN: SafetyPlan = {
  id: 'saf_alex_primary',
  userId: 'usr_alex',
  relationshipId: 'rel_alex_sam',
  safewords: [
    { word: 'Red', meaning: 'stop_immediate_release' },
    { word: 'Amber / Yellow', meaning: 'slow_down_checkin' },
    { word: 'Green', meaning: 'praise_continue' },
  ],
  emergencyPhysicalKeyLocation: '[DEMO KEYBOX LOCATION: Master lockbox in primary safe #1 - demo only]',
  emergencyRemovalToolLocation: '[DEMO TOOL LOCATION: Medical/emergency kit top shelf - demo only]',
  emergencyInstructions: '[DEMO EMERGENCY PROTOCOL: Seek medical assistance immediately if numbness, discoloration, or acute distress occurs]',
  isolatedHealthAlerts: [],
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-08-20T14:00:00Z',
};

export const INITIAL_TOOLBOXES: Toolbox[] = [
  {
    id: 'tbx_boundary_matrix',
    name: 'Boundary & Consent Matrix',
    category: 'relationships',
    description: 'Granular color-coded boundaries (Soft Limits, Hard Limits, Enthusiastic Yes) with partner alignment comparisons.',
    iconName: 'FileSpreadsheet',
    requiredFeatures: ['relationships', 'agreements'],
    supportedDynamics: ['power_exchange', 'chastity_practice', 'sensory_service', 'casual'],
    version: '2.1',
  },
  {
    id: 'tbx_contracting_wizard',
    name: 'Relationship & Dynamic Contracting',
    category: 'relationships',
    description: 'Structured agreement builder with revision history, mutual sign-off, and review expirations.',
    iconName: 'FileText',
    requiredFeatures: ['agreements'],
    supportedDynamics: ['all'],
    version: '1.4',
  },
  {
    id: 'tbx_chastity_vault',
    name: 'Chastity Vault & Countdown',
    category: 'dynamics',
    description: 'Time-locked sessions, hygiene check-in prompts, emergency release logs, and safe keyholder handoffs.',
    iconName: 'Key',
    requiredFeatures: ['sessions'],
    supportedDynamics: ['chastity_practice'],
    version: '3.0',
  },
  {
    id: 'tbx_rituals_engine',
    name: 'Dynamic Rituals & Daily Practices',
    category: 'dynamics',
    description: 'Daily intentions, compliance check-ins, service prompts, and reflection tasks tailored to your dynamic.',
    iconName: 'Heart',
    requiredFeatures: ['rituals'],
    supportedDynamics: ['power_exchange', 'service_oriented', 'emotional_intimacy'],
    version: '2.0',
  },
  {
    id: 'tbx_sizing_calculator',
    name: 'Physiological Sizing & Ergonomics',
    category: 'wellness',
    description: 'Precision calliper measurement guide, ring spacing recommendations, and biological safety calculators.',
    iconName: 'Compass',
    requiredFeatures: ['wellness'],
    supportedDynamics: ['chastity_practice'],
    version: '2.5',
  },
  {
    id: 'tbx_hygiene_guides',
    name: 'Clinical Hygiene & Skin Care Protocols',
    category: 'wellness',
    description: 'Medical reference library covering anti-fungal care, silicone maintenance, micro-tear prevention, and warning signs.',
    iconName: 'BookOpen',
    requiredFeatures: ['guides'],
    supportedDynamics: ['chastity_practice', 'sensory_service'],
    version: '3.1',
  },
  {
    id: 'tbx_emergency_safety_plan',
    name: 'Emergency Action Plan & Safe Key Escrow',
    category: 'safety',
    description: 'Physical tool locations, secondary contact escalation, emergency uncoupling procedures, and physical safewords.',
    iconName: 'ShieldAlert',
    requiredFeatures: ['safety'],
    supportedDynamics: ['all'],
    version: '2.0',
  },
  {
    id: 'tbx_meetup_escort',
    name: 'Public Meetup & Safe Escort Planner',
    category: 'safety',
    description: 'Time-based safety timer for first-time partner meetups with automatic trusted-contact check-in notifications.',
    iconName: 'MapPin',
    requiredFeatures: ['safety'],
    supportedDynamics: ['exploring', 'dating'],
    version: '1.1',
  },
  {
    id: 'tbx_aftercare_debrief',
    name: 'Post-Scene Aftercare & Emotional Debrief',
    category: 'communication',
    description: 'Sub-drop and dom-drop tracking, hydration logging, affirmation prompts, and guided 48-hour emotional integration.',
    iconName: 'Sparkles',
    requiredFeatures: ['sessions', 'checkins'],
    supportedDynamics: ['power_exchange', 'chastity_practice', 'sensory_service'],
    version: '1.8',
  },
  {
    id: 'tbx_nonviolent_requests',
    name: 'Non-Violent Request & Negotiation Builder',
    category: 'communication',
    description: 'Step-by-step framework to propose new dynamic changes without pressure, obligation, or implicit coercion.',
    iconName: 'MessageSquare',
    requiredFeatures: ['communication'],
    supportedDynamics: ['all'],
    version: '1.2',
  },
];
