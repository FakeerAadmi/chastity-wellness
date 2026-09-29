export interface GuideItem {
  id: string;
  title: string;
  slug: string;
  category: 'hygiene' | 'safety' | 'communication' | 'sizing' | 'mental-health' | 'materials';
  categoryLabel: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  medicalDisclaimer?: string;
  content: {
    heading: string;
    body: string;
    points?: string[];
    callout?: {
      type: 'warning' | 'tip' | 'info';
      title: string;
      text: string;
    };
  }[];
}

export interface CommunityReply {
  id: string;
  author: string;
  authorRole: 'Wearer' | 'Keyholder' | 'Educator' | 'Practitioner' | 'Moderator' | 'Curious';
  date: string;
  text: string;
  isSafetyTip?: boolean;
}

export interface CommunityThread {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: 'Wearer' | 'Keyholder' | 'Educator' | 'Practitioner' | 'Moderator' | 'Curious';
  date: string;
  tags: string[];
  upvotes: number;
  repliesCount: number;
  isSafetyVerified: boolean;
  content: string;
  replies: CommunityReply[];
}

export interface ManifestoPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coreRule: string;
}

export interface OnboardingState {
  role: 'wearer' | 'keyholder' | 'switch' | 'curious' | '';
  experienceLevel: 'beginner' | 'intermediate' | 'experienced' | '';
  primaryGoal: string;
  healthConcerns: string[];
  safeword: string;
  checkInInterval: string;
  emergencyKeyPlan: string;
}

export interface UserProfile {
  // Identity & Bio
  id: string;
  username: string;
  handle: string;
  pronouns: string;
  sexuality: string;
  genderIdentity: string;
  genderExpression: string;
  relationshipStructure: string;
  role: 'Wearer' | 'Keyholder' | 'Switch' | 'Explorer';
  dynamicStatus: 'Active Partner Dynamic' | 'Seeking Keyholder' | 'Seeking Wearer' | 'Solo Practice' | 'Polyamorous Dynamic';
  bio: string;
  location: string;
  joinedDate: string;
  partnerCode: string;

  // Physical & Anatomical Measurements
  height: string;
  weight: string;
  bodyBuild: 'Athletic' | 'Average' | 'Slim' | 'Muscular' | 'Heavy' | 'Custom';
  baseRingDiameterMm: number;
  cageLengthDepthMm: number;
  spacerPreferenceMm: number;
  preferredMaterials: string[];
  skinAllergies: string[];

  // Intimacy, Kinks & Desires
  kinkTags: string[];
  experienceDuration: string;
  intimacyStyle: string;
  aftercarePreferences: string[];

  // Limits & Safeguards
  hardLimits: string[];
  softLimits: string[];
  safewordRed: string;
  safewordYellow: string;
  emergencyKeyLocation: string;

  // Dynamic Statistics
  totalHoursWorn: number;
  completedSessions: number;
  hygieneComplianceRate: number;
  dailyPulsesSubmitted: number;
}

export interface PermissionRequest {
  id: string;
  from: string;
  type: 'shower_clean' | 'sports_release' | 'edging_session' | 'comfort_adjustment' | 'early_release';
  typeLabel: string;
  note: string;
  durationMinutes: number;
  status: 'pending' | 'approved' | 'declined';
  timestamp: string;
}
