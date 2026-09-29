# Haven Design Reference Library & Product Bible
## Master Index & Architecture Compendium

> **Notice:** This documentation library serves as the permanent architectural, conceptual, and philosophical reference for **Haven**—a private relationship-dynamics and sexual-wellness platform for consenting adults. It documents foundational concepts, domain architectures, future systems, and design aesthetics.

---

### Library Structure & Reading Roadmap

| Document | Title | Core Focus |
| :--- | :--- | :--- |
| [**01 — Product Bible**](./01_PRODUCT_BIBLE.md) | **Product Vision & Manifesto** | Platform identity, adult expression without sanitization, emotional promise, market positioning, and competitor teardowns (Feeld, Kneel, Chaster). |
| [**02 — Experience Principles**](./02_EXPERIENCE_PRINCIPLES.md) | **Human Experience & Philosophy** | The seven core experience principles: expression before categorization, consent before execution, structure without coercion, playfulness without gamification, intimacy without surveillance, privacy as design, and tone adaptability. |
| [**03 — Relationship Model**](./03_RELATIONSHIP_MODEL.md) | **Relational Architecture** | Canonical entity hierarchy (`Person → Relationship → Dynamic → Agreement → Session / Ritual / Check-in`), non-dyadic/polyamorous topologies, contextual asymmetric roles, and relationship lifecycle. |
| [**04 — Dynamics & Kink**](./04_DYNAMICS_AND_KINK.md) | **Taxonomy & Practice Progression** | Deep dives into Power Exchange (D/s), Chastity & Orgasm Control, Consensual Non-Monogamy (Cuckold/Hotwife), BDSM/Impact, Roleplay; the critical separation between *Desire/Fantasy* and *Consent*. |
| [**05 — Feature Systems**](./05_FEATURE_SYSTEMS.md) | **Operational Systems & Builder** | Specifications for Desires Decks, Permission Requests, Task Assignment, Daily Rituals, Live Sessions, Check-ins, and the Chaster-inspired Composable Experience Builder. |
| [**06 — Safety, Privacy & Consent**](./06_SAFETY_PRIVACY_CONSENT.md) | **Safety Infrastructure** | Ongoing affirmative consent, safewords/traffic lights, the Unconditional Pause button, privacy-aware local storage vs. future zero-knowledge E2EE, ephemeral proofs, meetup safety, and sexual health. |
| [**07 — Design System**](./07_DESIGN_SYSTEM.md) | **Sensory & Visual Language** | Architectural minimalism, tactile materials, typographic elegance, dark/warm color schemes, and evoking adult erotic tension through interaction and mystery rather than explicit graphics. |
| [**08 — Extensions & Platform**](./08_EXTENSIONS_PLATFORM.md) | **Ecosystem & Hardware** | Experience plugins, dynamic toolboxes, Bluetooth hardware integration (chastity cages, vibrators, estim), communication hooks, and ethical constraints for AI assistants. |
| [**09 — Product Roadmap**](./09_PRODUCT_ROADMAP.md) | **Maturity Horizons & Evaluation** | Implementation maturity horizons (Foundation to Platform), the 10-Point Feature Evaluation Rule, and future development sequencing. |

---

### Foundational Lexicon

To ensure unambiguous communication across product design, engineering, and user experience, Haven adheres strictly to this canonical terminology:

- **Person (`User` / `Partner`):** An autonomous individual human agent possessing sovereign boundaries, private desires, and cryptographic credentials.
- **Relationship (`Relationship`):** The social, legal, romantic, or domestic container binding two or more persons (e.g., Married, Nesting, Polyamorous V, Casual, Long Distance).
- **Dynamic (`Dynamic`):** An agreed-upon interactional framework or game of power, eroticism, or service operating within a relationship (e.g., Master/Slave, Keyholder/Chaste, Hotwife/Cuckold, Sensual Exploration).
- **Participant (`Participant`):** The projection of a Person into a specific Dynamic, holding a contextual **Role** (e.g., Dominant, Submissive, Keyholder, Locked, Switch). Roles are never global; a person may be a Dominant in Dynamic A and a Submissive in Dynamic B.
- **Desire / Fantasy (`Desire`):** A private or shared yearning, kink, or scenario. A desire does *not* constitute consent or an active practice.
- **Boundary (`Boundary`):** An inviolable limit defined by a participant (Soft Limit = requires caution and renegotiation; Hard Limit = absolute veto).
- **Agreement (`Agreement`):** A mutually negotiated, affirmative covenant establishing terms, expectations, boundaries, and review dates for a dynamic.
- **Permission Request (`Request`):** An asymmetric, structured submission by one participant to another requesting approval, release, or action under an active agreement.
- **Task (`Task`):** A discrete action, challenge, or chore assigned to a participant with specified verification criteria.
- **Ritual (`Ritual`):** A repeatable, habituated sequence of structured steps enacted on a regular cadence (daily, weekly) to reinforce a dynamic.
- **Session (`Session`):** A discrete, time-bounded scene or play window equipped with live timers, phase progression, safeword monitors, and aftercare tracking.
- **Check-in (`Check-in`):** A structured, multi-dimensional calibration measurement (Emotional, Consent, Dynamic alignment) used to assess relationship health.
- **Aftercare (`Aftercare`):** The intentional physical and psychological nurturing period immediately following high-intensity erotic, BDSM, or emotional play.
- **Memory (`Memory`):** A permanent, private milestone, journal entry, or retrospective reflection anchoring relational history.

---

### Core Architectural Axioms

1. **Consent is Not Static:** Consent is affirmative, ongoing, contextual, and freely revocable at any millisecond. No software rule, timer, or lock may supersede human agency.
2. **Adult Expression is Not Obscenity:** Haven refuses clinical euphemisms. BDSM is BDSM; Chastity is Chastity; Cuckoldry is Cuckoldry. The application is honest, mature, and direct.
3. **Local Sovereignty First:** Current builds operate on privacy-aware local storage; future cloud synchronization must rely strictly on end-to-end zero-knowledge cryptography.
4. **Restraint over Gimmicks:** Erotic tension is built through anticipation, structure, and vulnerability—not arcade badges, cartoon animations, or streak anxiety.
