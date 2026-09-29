import { GuideItem } from '@/types';

export const GUIDES_DATA: GuideItem[] = [
  {
    id: 'hygiene-and-care',
    title: 'The Essential Daily Hygiene & Maintenance Protocol',
    slug: 'daily-hygiene-protocol',
    category: 'hygiene',
    categoryLabel: 'Hygiene & Skin Health',
    readTime: '6 min read',
    summary:
      'A comprehensive guide to keeping skin healthy, preventing bacterial or fungal moisture build-up, and sanitizing devices.',
    keyTakeaways: [
      'Moisture trapped under bands or rings is the #1 cause of contact dermatitis and fungal irritation.',
      'Daily thorough cleaning with pH-neutral, fragrance-free soap is mandatory.',
      'Devices must be completely dry before re-securing to avoid chafing and maceration.',
      'Devices should undergo scheduled deep sanitization (boiling or specialized disinfectant depending on material).'
    ],
    medicalDisclaimer:
      'If you notice persistent rash, skin weeping, foul odor, or broken skin, discontinue wear immediately and allow complete healing before resuming.',
    content: [
      {
        heading: '1. Why Moisture Control is Critical',
        body: 'The inguinal and genital regions are naturally warm and prone to sweat. When an anatomical cage or ring is worn, natural skin shedding (desquamation) and sweat accumulate against the skin surface. Without meticulous daily hygiene, this environment can lead to bacterial overgrowth, balanitis, or tinea cruris (jock itch).',
        callout: {
          type: 'warning',
          title: 'Immediate Stop Condition',
          text: 'Any broken skin, raw fissures, or signs of infection require taking the device off immediately and consulting a healthcare professional if not resolved in 48 hours.'
        }
      },
      {
        heading: '2. Daily Cleansing Routine',
        body: 'Follow this 4-step routine every 24 hours:',
        points: [
          'Step 1: Thorough Showering - If using a lockable device with hygiene gaps, flush water and hypoallergenic body wash through all openings thoroughly.',
          'Step 2: Gentle pH-Neutral Soap - Avoid harsh antibacterial detergents, scents, or abrasive scrubs that strip natural epidermal lipid barriers.',
          'Step 3: Complete Drying - Use a dedicated microfiber towel or a cool-setting hairdryer to ensure no moisture remains in skin folds or around the base ring.',
          'Step 4: Barrier Creams (When Appropriate) - A light application of pure medical-grade zinc oxide or silicone-based anti-chafing balm can reduce friction, but avoid petroleum jelly which degrades certain silicone seals.'
        ]
      },
      {
        heading: '3. Device Sanitization Schedule',
        body: 'Different device materials require specific cleaning methods:',
        points: [
          '316L Stainless Steel: Can be washed in warm water and boiled in water for 5-10 minutes weekly for deep sterilization.',
          'Medical-Grade Silicone: Wash with warm water and antimicrobial soap. Can tolerate mild boiling if certified 100% silicone; do not use silicone-based lubricants.',
          'Resin / 3D Printed Polymers: Hand wash only in lukewarm soapy water. High heat can warp dimensional tolerances and degrade lock housings.'
        ]
      }
    ]
  },
  {
    id: 'circulation-and-safety',
    title: 'Circulation, Nerve Safety & Warning Signs (Red Flags)',
    slug: 'circulation-nerve-safety',
    category: 'safety',
    categoryLabel: 'Physical Safety & Anatomy',
    readTime: '8 min read',
    summary:
      'Understanding blood supply, pudendal nerve pathways, edema risks, and how to identify and react to physiological emergencies.',
    keyTakeaways: [
      'Numbness, tingling ("pins and needles"), or cooling sensation means nerve compression or ischemia.',
      'Edema (swelling) trapped in ring gaps can cause a tourniquet effect requiring immediate intervention.',
      'Emergency shears or an accessible master key must always be within physical reach in the domicile.',
      'Do not sleep in a device that has not been thoroughly tested for nighttime involuntary tumescence.'
    ],
    medicalDisclaimer:
      'Prolonged arterial or venous occlusion can cause permanent tissue necrosis. Never prioritize a keyholder agreement over physiological warning signs.',
    content: [
      {
        heading: '1. The Danger of Nocturnal Erections',
        body: 'The human body naturally undergoes 3 to 5 spontaneous erections per night during REM sleep. If a device or ring is too tight or lacks adequate elongation allowance, nocturnal tumescence can cause severe compression against the base ring, leading to intense pain, tissue strangulation, or awakening in acute distress.',
        callout: {
          type: 'warning',
          title: 'Nighttime Safety Rule',
          text: 'Never sleep in a new device until you have completed multiple daytime wear sessions of at least 8 hours with zero discomfort, pinching, or numbness.'
        }
      },
      {
        heading: '2. Recognizing the "Red Flag" Signals',
        body: 'Inspect skin and sensation frequently throughout the day. Immediate removal is warranted upon detecting:',
        points: [
          'Cyanosis (Blue/purple discoloration): Signifies severe venous pooling or arterial deprivation.',
          'Blanching & Cold Skin: Signifies lack of fresh arterial blood perfusion.',
          'Hypoesthesia (Numbness): Sensation of numbness or loss of touch sensitivity indicates dorsal nerve compression.',
          'Strangulation Edema: Swollen tissue spilling over the edge of the ring that cannot be comfortably compressed back.',
          'Urethral Stinging or Retention: Inability to urinate freely or pain during urination.'
        ]
      },
      {
        heading: '3. Emergency De-escalation & Removal',
        body: 'If swelling prevents key unlocking or the key is jammed:',
        points: [
          'Cold Compress: Apply an ice pack wrapped in a cloth to the swollen area for 10-15 minutes to reduce vascular engorgement.',
          'Elevate & Rest: Lie flat on your back to promote venous return to the core.',
          'Lubrication Slide: Liberally apply cold water-soluble lubricant or mineral oil around the ring.',
          'Cutters for Non-Metallic / Medical Shears: For plastic/resin cages, heavy-duty bolt cutters or rescue EMT trauma shears can fracture the base ring without cutting flesh.'
        ]
      }
    ]
  },
  {
    id: 'communication-and-consent',
    title: 'Negotiation, Boundaries & The Vulnerability Pact',
    slug: 'communication-and-consent-framework',
    category: 'communication',
    categoryLabel: 'Communication & Consent',
    readTime: '7 min read',
    summary:
      'A practical guide to structuring agreements between partners, establishing safewords, and managing psychological dynamics responsibly.',
    keyTakeaways: [
      'Consent is an ongoing dialogue, not a one-time transaction or perpetual contract.',
      'The "Emergency Key in a Sealed Box" protocol protects both parties from emotional coercion or panic.',
      'Establish a color-coded safeword system (Green / Yellow / Red) for emotional and physical check-ins.',
      'Plan deliberate "Aftercare" following device removal to process feelings and reaffirm emotional bonding.'
    ],
    content: [
      {
        heading: '1. The Psychological Reality of Surrendering Control',
        body: 'Wearing a chastity device or holding the key evokes profound emotional states—vulnerability, trust, excitement, anticipation, and sometimes sudden anxiety or frustration. Both wearers and keyholders must recognize that vulnerability requires mutual respect and careful emotional stewardship.',
        callout: {
          type: 'info',
          title: 'Ethical Keyholding',
          text: 'A keyholder’s primary duty is not discipline or power, but the emotional and physical safety of the person who placed their trust in them.'
        }
      },
      {
        heading: '2. The Sealed Safe-Deposit Protocol',
        body: 'To eliminate coercion anxiety and ensure peace of mind, experienced couples employ a sealed container method:',
        points: [
          'Place a spare key in a tamper-evident envelope or sealed lockbox.',
          'Both partners agree that the wearer may open the sealed key in any physical emergency, acute panic, or medical situation.',
          'Opening the sealed key is not considered a "breach of contract" or failure—it is a recognized safety mechanism.',
          'After opening, the couple holds an honest debriefing conversation to evaluate what went wrong and adjust future parameters.'
        ]
      },
      {
        heading: '3. Communication Check-In Rituals',
        body: 'Adopt a structured check-in at consistent points during the day (e.g., morning coffee or before bed):',
        points: [
          'Physical check: Any hot spots, redness, pressure marks, or difficulty urinating?',
          'Emotional check: Are feelings grounded and positive, or is there resentment, loneliness, or detachment?',
          'Adjustment check: Does the device need a temporary hygiene removal or repositioning?'
        ]
      }
    ]
  },
  {
    id: 'sizing-and-ergonomics',
    title: 'Anatomical Sizing: How to Measure Accurately & Avoid Injuries',
    slug: 'anatomical-sizing-ergonomics',
    category: 'sizing',
    categoryLabel: 'Sizing & Ergonomics',
    readTime: '6 min read',
    summary:
      'Detailed guidance on choosing correct ring diameters, cage lengths, and spacer gaps to ensure proper anatomical fit without pinching.',
    keyTakeaways: [
      'Ring diameter must fit snugly behind the scrotum and penis base without constricting testicle blood vessels.',
      'Too tight creates strangulation risk; too loose causes skin to pinch into cage seams.',
      'Always measure when completely flaccid, ideally in a relaxed, warm room environment.',
      'Beginners should always choose the slightly larger ring size and shorter wear durations.'
    ],
    content: [
      {
        heading: '1. Anatomy of a Chastity Device',
        body: 'Most modern male devices comprise three main components: the Base Ring (which sits behind the scrotum and at the base of the penile shaft), the Spacer / Pin connection (which determines distance between ring and cage), and the Cage Body (which encloses the flaccid penile shaft).',
        points: [
          'The Base Ring carries the vast majority of mechanical tension and is the most safety-critical piece.',
          'The Spacer determines whether the testicles are pinched or comfortable.',
          'The Cage should cradle the flaccid anatomy without crushing the glans or obstructing the urethral orifice.'
        ]
      },
      {
        heading: '2. How to Measure Your Ring Diameter',
        body: 'Use a flexible tailor’s tape measure or a strip of paper:',
        points: [
          'Wrap the tape snugly around the base of the flaccid shaft and behind both testicles.',
          'Record the circumference in millimeters (mm).',
          'Divide the circumference by 3.14 (pi) to determine internal diameter.',
          'Common ring diameters range from 40mm, 45mm, 48mm, to 50mm+. If between sizes, always select the larger size first.'
        ]
      }
    ]
  },
  {
    id: 'device-materials',
    title: 'Materials Breakdown: Steel, Medical Silicone & 3D Polymers',
    slug: 'materials-comparison-guide',
    category: 'materials',
    categoryLabel: 'Device Materials',
    readTime: '5 min read',
    summary:
      'Comparative analysis of materials: biocompatibility, porosity, weight, security, and cleaning procedures.',
    keyTakeaways: [
      'Always look for certified biocompatible, medical-grade materials (316L surgical steel, platinum-cured silicone).',
      'Cheap alloy metals containing nickel can trigger severe contact dermatitis or nickel allergies.',
      'Resin and 3D printed cages are lightweight and airport-friendly but can harbor bacteria if porous.',
      'Check all edges for mold lines, sharp burrs, or rough seams before initial wear.'
    ],
    content: [
      {
        heading: '1. 316L Surgical Stainless Steel',
        body: 'The gold standard for durability and hygiene. Highly polished steel has near-zero porosity, making it exceptionally sanitary and easy to boil or sterilize. However, it is rigid, heavy, and will trigger metal detectors.',
        points: [
          'Pros: Hypoallergenic (when medical grade), zero porosity, virtually indestructible, easy to clean.',
          'Cons: Heavy, rigid during temperature shifts, zero flexibility during unintentional tumescence.'
        ]
      },
      {
        heading: '2. Medical-Grade Platinum Silicone',
        body: 'Flexible, skin-friendly, and slightly compliant. Ideal for beginners or active individuals engaged in sports.',
        points: [
          'Pros: Gentle on skin, soft edges, accommodates mild physical shifts comfortably.',
          'Cons: Not 100% rigid (easier to slip out of), silicone degrades when exposed to silicone lubricants.'
        ]
      },
      {
        heading: '3. Biocompatible Polymers & Resins',
        body: 'Lightweight, modern, and often custom-fitted through 3D scanning or printing.',
        points: [
          'Pros: Extremely light, passes through airport security without issue, ergonomic shapes.',
          'Cons: Sensitive to hot water warping, can crack under high lateral impact, must be verified non-toxic.'
        ]
      }
    ]
  },
  {
    id: 'mental-health-and-balance',
    title: 'Psychological Well-being, Aftercare & Avoiding Obsession',
    slug: 'mental-health-and-balance',
    category: 'mental-health',
    categoryLabel: 'Mental Wellness',
    readTime: '7 min read',
    summary:
      'Navigating mood swings, post-orgasmic regret (sub drop / dom drop), and maintaining a balanced, healthy life outside the dynamic.',
    keyTakeaways: [
      'Chastity should enrich intimate relationships, not consume all daily cognitive bandwidth.',
      'Recognize "Drop" (temporary neurochemical depression following intense psychological scenes).',
      'Balance fantasy with mundane reality: maintain professional, social, and emotional commitments.',
      'Seek professional sex-positive therapy if feelings of deep distress, shame, or obsession arise.'
    ],
    content: [
      {
        heading: '1. Neurochemistry and Emotional Vulnerability',
        body: 'Engaging in erotic denial causes significant fluctuations in dopamine, adrenaline, and oxytocin. When release or unlocking occurs, the sudden surge and subsequent crash of these neurotransmitters can trigger a transient low mood, known in wellness and kink literature as "drop".',
        points: [
          'Wearers may feel vulnerable, tearful, exhausted, or unexpectedly sad 2-24 hours after release.',
          'Keyholders can also experience post-scene fatigue and emotional depletion.',
          'Proactive aftercare: warm blankets, hydration, light snacks, physical affection, and non-judgmental talk.'
        ]
      },
      {
        heading: '2. Maintaining Healthy Boundaries with Reality',
        body: 'Chastity should never interfere with job performance, healthy eating, personal friendships, or general happiness. If the dynamic generates constant friction, anxiety, fear, or depressive symptoms, step back and re-evaluate your boundaries together.',
        callout: {
          type: 'tip',
          title: 'Holistic Life Balance',
          text: 'A healthy practice enhances joy, mindfulness, and connection. If it creates chronic tension or dread, pause the practice immediately.'
        }
      }
    ]
  }
];
