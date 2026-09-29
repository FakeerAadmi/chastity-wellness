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
