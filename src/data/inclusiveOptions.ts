export const SEXUALITY_OPTIONS = [
  'Heterosexual / Straight',
  'Bisexual',
  'Pansexual',
  'Gay / Homosexual',
  'Lesbian',
  'Queer',
  'Demisexual',
  'Asexual / Ace Spectrum',
  'Graysexual',
  'Omnisexual',
  'Fluid',
  'Questioning / Exploring'
];

export const GENDER_IDENTITY_OPTIONS = [
  'Cisgender Man',
  'Cisgender Woman',
  'Transgender Man',
  'Transgender Woman',
  'Non-Binary',
  'Genderfluid',
  'Genderqueer',
  'Agender',
  'Two-Spirit',
  'Intersex',
  'Bigender',
  'Androgynous'
];

export const GENDER_EXPRESSION_OPTIONS = [
  'Masculine / Masc',
  'Feminine / Fem',
  'Androgynous',
  'Gender-Nonconforming (GNC)',
  'Butch',
  'Femme',
  'Neutral',
  'Fluid'
];

export const RELATIONSHIP_STRUCTURE_OPTIONS = [
  'Monogamous',
  'Consensual Non-Monogamy (CNM)',
  'Polyamorous',
  'Open Relationship',
  'Female-Led Relationship (FLR)',
  'Male-Led Relationship (MLR)',
  'Egalitarian / Switch Dynamic',
  'Solo Polyamorous',
  'Relationship Anarchy'
];

export interface KinkCategory {
  category: string;
  items: string[];
}

export const KINKS_CATALOG: KinkCategory[] = [
  {
    category: 'Chastity & Orgasm Control',
    items: [
      'Sensual Tease & Denial',
      'Orgasm Control & Edging',
      'Ruined Orgasms',
      'Lockbox Accountability',
      'Hygiene Rituals & Care',
      'Extended Denial Cycles',
      'Keyholding Dynamic',
      'Keyholder Permission Requests',
      'Blind Timers & Surprise Release'
    ]
  },
  {
    category: 'Power Exchange & Dynamic',
    items: [
      'Consensual Power Exchange (D/s)',
      'Female-Led Relationship (FLR)',
      'Male-Led Relationship (MLR)',
      'Service Submissive / Devotion',
      'Gentle / Affectionate Domination',
      'Praise Kink & Affirmation',
      'Consensual Bratting & Playful Resistance',
      'Disciplined Rituals & Tasks',
      'Protocols & Mannerisms'
    ]
  },
  {
    category: 'Sensation & Mindfulness',
    items: [
      'Mindfulness Meditation & Urge Surrender',
      'Sensory Deprivation (Blindfolds, Noise Reduction)',
      'Sensual Massage & Erotic Touch',
      'Temperature Play (Warm/Cool)',
      'Feather & Wartenberg Wheel Sensation',
      'Light Bondage (Silk / Rope)'
    ]
  },
  {
    category: 'Roleplay & Exploration',
    items: [
      'Domestic Servitude / Butler & Master',
      'Aftercare Devotion & Deep Cuddling',
      'Discreet Public Wear',
      'Erotic Hypnosis & Conditioning',
      'Latex, Leather & Rubber Aesthetics',
      'Cuckolding / Hotwifing / Stag & Vixen'
    ]
  }
];

export interface LimitCategory {
  category: string;
  items: string[];
}

export const LIMITS_CATALOG: LimitCategory[] = [
  {
    category: 'Physiological & Anatomical Limits',
    items: [
      'No physical pain or tissue strangulation',
      'Strict daily 24-hr hygiene shower requirement',
      'Immediate non-punitive release upon numbness or discoloration',
      'No metal cages (silicone/resin only due to skin sensitivity)',
      'No overnight sleep wear without prior nap clearance',
      'No bathroom restriction or urination inhibition'
    ]
  },
  {
    category: 'Consent & Psychological Boundaries',
    items: [
      'Immediate release upon designated Safeword RED',
      'No public outing or non-consensual exposure',
      'No non-consensual degradation or verbal insults',
      'No financial extortion or blackmail (FinDom)',
      'No sleep deprivation or exhaustion',
      'Tamper-evident sealed emergency key must remain accessible'
    ]
  },
  {
    category: 'Relationship & Communication Limits',
    items: [
      'No lock extensions without prior discussion',
      'Mandatory post-unlock emotional aftercare',
      'Daily morning/evening connection check-in',
      'Keyholder must not travel out of town without spare key plan'
    ]
  }
];

export const DAILY_INTIMATE_PROMPTS = [
  {
    id: 1,
    topic: 'Vulnerability & Trust',
    prompt: 'What was a moment this week when surrendering control made you feel most connected and deeply cherished?'
  },
  {
    id: 2,
    topic: 'Erotic Mindfulness',
    prompt: 'How has experiencing erotic anticipation without immediate release changed your perception of sensual touch?'
  },
  {
    id: 3,
    topic: 'Boundaries & Comfort',
    prompt: 'Is there a quiet desire or gentle boundary you have been thinking about that you would like to explore together safely?'
  },
  {
    id: 4,
    topic: 'Gratitude & Devotion',
    prompt: 'What is one specific ritual or caretaking action your partner did recently that made you feel safe?'
  }
];

export const FOREPLAY_CHALLENGES = [
  {
    id: 'f1',
    title: 'The 10-Minute Feather Touch',
    instruction: 'Wearer lies relaxed and blindfolded. Keyholder traces fingertips across inner thighs, neck, and chest for 10 minutes without touching the device.'
  },
  {
    id: 'f2',
    title: 'Mindful Urge Surrender',
    instruction: 'Sit together in candlelight. Hold hands and breathe together for 5 minutes, focusing on the calm warmth of emotional surrender.'
  },
  {
    id: 'f3',
    title: 'Keyholder Gratitude Reading',
    instruction: 'Wearer reads aloud 3 written appreciations of their partner before kneeling to receive an affectionate forehead kiss.'
  },
  {
    id: 'f4',
    title: 'Ice & Warmth Contrast',
    instruction: 'Keyholder slowly glides an ice cube across the collarbone and lower abdomen, followed immediately by warm breath.'
  }
];
