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
  role: 'Wearer' | 'Keyholder' | 'Switch' | 'Explorer';
  dynamicStatus: 'Active Partner Dynamic' | 'Seeking Keyholder' | 'Seeking Wearer' | 'Solo Practice';
  bio: string;
  location: string;
  joinedDate: string;
  partnerCode: string;

  // Physical & Anatomical Measurements
  height: string; // e.g. "5 ft 10 in (178 cm)"
  weight: string; // e.g. "165 lbs (75 kg)"
  bodyBuild: 'Athletic' | 'Average' | 'Slim' | 'Muscular' | 'Heavy' | 'Custom';
  baseRingDiameterMm: number; // e.g. 45
  cageLengthDepthMm: number; // e.g. 65
  spacerPreferenceMm: number; // e.g. 5
  preferredMaterials: string[]; // e.g. ["316L Surgical Steel", "Platinum Silicone"]
  skinAllergies: string[]; // e.g. ["Nickel Sensitive", "Latex Sensitive"]

  // Intimacy, Kinks & Desires
  kinkTags: string[]; // e.g. ["Tease & Denial", "Sensual Surrender", "Mindfulness", "D/s"]
  experienceDuration: string; // e.g. "8 months active"
  intimacyStyle: string; // e.g. "Affectionate, sensual, communication-heavy"
  aftercarePreferences: string[]; // e.g. ["Warm tea & hydration", "Quiet physical cuddle", "Non-judgmental debrief"]

  // Limits & Safeguards
  hardLimits: string[]; // e.g. ["No public exposure", "No pain", "No degradation"]
  softLimits: string[]; // e.g. ["Blind timers", "Overnight sleep wear with notice"]
  safewordRed: string; // e.g. "RED"
  safewordYellow: string; // e.g. "YELLOW"
  emergencyKeyLocation: string; // e.g. "Tamper-evident sealed box on dresser"

  // Dynamic Statistics
  totalHoursWorn: number;
  completedSessions: number;
  hygieneComplianceRate: number; // e.g. 99
  dailyPulsesSubmitted: number;
}
