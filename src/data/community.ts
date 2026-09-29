import { CommunityThread } from '@/types';

export const INITIAL_THREADS: CommunityThread[] = [
  {
    id: 'thread-1',
    title: 'Beginner advice: How to safely manage nocturnal erections without waking in pain?',
    category: 'Safety & Sizing',
    author: 'Elena_W',
    authorRole: 'Wearer',
    date: '2 days ago',
    tags: ['Sleep Safety', 'Beginners', 'Sizing'],
    upvotes: 42,
    repliesCount: 6,
    isSafetyVerified: true,
    content:
      'I started exploring chastity as a mindfulness and intimacy practice with my partner. Daytime wear has been completely comfortable for 4-5 hours. However, last night was my first attempt sleeping in the device, and I woke up around 3 AM with severe pinching pressure during involuntary REM tumescence. What is the safest protocol to ensure nocturnal safety?',
    replies: [
      {
        id: 'reply-1',
        author: 'Dr. Marcus V.',
        authorRole: 'Educator',
        date: '1 day ago',
        isSafetyTip: true,
        text: 'Crucial physiological reminder: nocturnal erections can swell to near-maximal girth even in a restrictive cage. If your ring is too snug or the spacer doesn’t allow natural forward displacement, venous pressure rises rapidly. Never "power through" nighttime pain. Remove the device immediately. You likely need either a 2-3mm larger diameter ring or a spacer with a slight gap. Test during weekend daytime naps before attempting full overnight lockups.'
      },
      {
        id: 'reply-2',
        author: 'Sora_K',
        authorRole: 'Keyholder',
        date: '1 day ago',
        text: 'My partner and I made the mistake of rushing into overnight wear too quickly. What solved it for us was switching to a slightly larger silicone ring for sleeping during the first 6 weeks. It provides enough compliance that involuntary nighttime swelling does not tourniquet.'
      },
      {
        id: 'reply-3',
        author: 'Alex_M',
        authorRole: 'Wearer',
        date: '18 hours ago',
        text: 'Also keep a cold water bottle or ice pack wrapped in a hand towel next to your nightstand. If waking up with an uncomfortable erection that is difficult to slide out of, touching cold to the inner thigh immediately triggers sympathetic vasoconstriction and reduces the swelling naturally.'
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'Best practices for skin hygiene during long active workdays?',
    category: 'Hygiene & Daily Living',
    author: 'Sam_River',
    authorRole: 'Wearer',
    date: '3 days ago',
    tags: ['Hygiene', 'Daily Care', 'Skin Health'],
    upvotes: 35,
    repliesCount: 4,
    isSafetyVerified: true,
    content:
      'I work in a reasonably physical warehouse environment where I walk 12,000+ steps a day. I noticed minor moisture chafing along the base ring seam. What specific barrier creams, powder, or drying techniques do long-term wearers recommend that won’t degrade silicone or foster bacterial growth?',
    replies: [
      {
        id: 'reply-2-1',
        author: 'Clara_Nurse',
        authorRole: 'Moderator',
        date: '2 days ago',
        isSafetyTip: true,
        text: 'Avoid standard cornstarch or talcum powder if moisture is heavy—cornstarch can turn into a paste that feeds candida (yeast) in dark warm folds. Instead, apply a micro-thin layer of dimethicone-based anti-chafing glide (BodyGlide or medical barrier ointment) specifically where the ring touches the skin folds. Also pack sterile moist wipes for mid-shift bathroom refreshes, followed by gentle pat-drying.'
      },
      {
        id: 'reply-2-2',
        author: 'Jordan_T',
        authorRole: 'Wearer',
        date: '2 days ago',
        text: 'Bamboo or moisture-wicking athletic boxer briefs are an absolute game changer. Cotton holds sweat against the metal and silicone, whereas technical synthetic athletic mesh pulls perspiration away instantly.'
      }
    ]
  },
  {
    id: 'thread-3',
    title: 'Structuring our first "Keyholder Agreement" with zero coercion & built-in safety valves',
    category: 'Relationship & Boundaries',
    author: 'Devon_And_Kai',
    authorRole: 'Keyholder',
    date: '4 days ago',
    tags: ['Agreements', 'Consent', 'Communication'],
    upvotes: 58,
    repliesCount: 5,
    isSafetyVerified: true,
    content:
      'My partner and I are drafting our first consensual chastity agreement. We want to ensure that it deepens our emotional connection and anticipation without ever turning into toxic control, anxiety, or resentment. What are the essential clauses and boundaries that every healthy couple’s agreement should have?',
    replies: [
      {
        id: 'reply-3-1',
        author: 'Maya_Ethics',
        authorRole: 'Educator',
        date: '3 days ago',
        isSafetyTip: true,
        text: 'We always teach the "Three Non-Negotiable Pillars" for agreements:\n1. The Emergency Safe-Deposit Clause: A spare key is kept in an accessible tamper-evident box. Opening it for physical relief or acute distress is protected and celebrated as safety compliance, never punished.\n2. Scheduled Hygiene Windows: Minimum mandatory 30-minute daily or every-other-day removal for complete washing and skin inspection.\n3. The Emotional Timeout: Either partner can call a non-punitive pause if external life stressors (job loss, bereavement, illness) make power-exchange dynamic overwhelming.'
      },
      {
        id: 'reply-3-2',
        author: 'Taylor_P',
        authorRole: 'Wearer',
        date: '3 days ago',
        text: 'Adding to that: establish a debrief ritual! Every Sunday morning, Kai and I have tea and review how the week felt. If there was any unspoken irritation or insecurity, we clear the air before continuing into the next week.'
      }
    ]
  },
  {
    id: 'thread-4',
    title: 'How to choose between 316L Stainless Steel vs Biocompatible Medical Resin for a first device?',
    category: 'Devices & Materials',
    author: 'Chris_B',
    authorRole: 'Curious',
    date: '5 days ago',
    tags: ['Materials', 'Steel', 'Resin', 'Beginners'],
    upvotes: 29,
    repliesCount: 3,
    isSafetyVerified: false,
    content:
      'I am ready to invest in my first ergonomic device. I see stainless steel cages praised for cleanliness, but resin praised for lightness and comfort. For someone who travels frequently through airports and does moderate desk work, what is the best starting choice?',
    replies: [
      {
        id: 'reply-4-1',
        author: 'TechSafety_Mark',
        authorRole: 'Practitioner',
        date: '4 days ago',
        isSafetyTip: true,
        text: 'If you travel through airports with full-body millimeter-wave scanners, steel will virtually always show up as an anomaly requiring a private secondary pat-down. For travelers, high-grade medical resin or nylon polymer with plastic security locks is far less intrusive and stressful. Start with resin or silicone to learn your exact dimensions before investing in custom steel.'
      }
    ]
  }
];
