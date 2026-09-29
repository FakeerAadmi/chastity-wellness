# Haven Product Roadmap
## Maturity Horizons, Feature Evaluation Rubric & Evolutionary Strategy

---

## 1. The Maturity Horizons

Haven's technical and product evolution is organized into five progressive horizons. Each horizon builds upon the structural integrity of the previous layer:

```
                            THE FIVE MATURITY HORIZONS

[ HORIZON 5: PLATFORM & FEDERATION ]
Peer-to-peer E2EE sync, zero-knowledge cloud, verifiable attestation, public plugin SDK.
           ▲
[ HORIZON 4: HARDWARE & SENSORY BRIDGES ]
Web Bluetooth (BLE) drivers, smart cages, telemetry vibrators, biometric scene tracking.
           ▲
[ HORIZON 3: COMPOSABLE EXPERIENCE ENGINE ]
Drag-and-drop experience builder, dynamic toolboxes, reward/privilege economies.
           ▲
[ HORIZON 2: INTIMACY & OPERATIONAL DEPTH ]
Double-blind desire decks, structured permission requests, task engine with proof verification.
           ▲
[ HORIZON 1: THE STRUCTURAL FOUNDATION ] ◄── (COMPLETED: Phases 1–5)
Canonical domain, adult taxonomy, relationships, agreements, sessions, rituals, check-ins.
```

---

### Horizon 1: The Structural Foundation (Status: Complete / Validated)
*Delivered across Phases 1 through 5 in the current codebase.*
- **Canonical Domain Model:** Fully typed hierarchy (`User → Relationship → Dynamic → Agreement → Session / Ritual / Check-in`).
- **Unsanitized Adult Taxonomy:** Direct, dignified naming for BDSM, Chastity, Cuckold / Hotwife, Femdom, Power Exchange, and Fetish practices.
- **First-Class Relationships:** Multi-person topologies (dyads, triads, polycules, solo) with non-global contextual roles.
- **Agreements & Negotiation:** Dual-sign agreements with explicit boundaries, review schedules, and immutable history.
- **Sessions, Rituals & Check-ins:** Live time-bounded sessions with participant readiness gates, step-by-step rituals with non-punitive pause, and 3-axis check-in calibrations.
- **Local Sovereignty:** Privacy-aware client-side local storage.

---

### Horizon 2: Intimacy & Operational Depth (Next Immediate Target)
*Focus: Deepening daily communication, discovery, and asymmetric operational workflows.*
- **Double-Blind Desire Matching Decks:**
  - Curated and custom decks for fantasies, roleplay scenarios, and boundaries.
  - Asymmetric reveal algorithm ensuring unreciprocated kinks remain confidential.
  - Automatic promotion of mutual matches into the Negotiation / Agreement queue.
- **Structured Permission Request Workflow:**
  - Asymmetric proposal flows for Chastity release, outside partner dates, and scene scheduling.
  - Structured approval states (Approved, Approved with Condition, Denied with Erotic Rationale).
- **Task & Chore Assignment Engine:**
  - Dominant-to-submissive assignments with recurring cadences.
  - Proof verification workflows (ephemeral in-app photos, focus timers, text reflections).
- **Shared Memory & Milestone Vault:**
  - Private journal entries, anniversary tracking, and post-scene memory archives.

---

### Horizon 3: The Composable Experience Engine
*Focus: Modular play systems and dynamic economies.*
- **Composable Experience Builder:**
  - Visual flow builder allowing partners to assemble custom experiences using triggers, chance nodes (dice/wheels), timers, and action prompts.
- **Dynamic Toolboxes:**
  - Modular activation of archetype-specific tools (e.g., Chastity Lockup Tracker, Hotwife Date Itinerary, Shibari Rope Practice Guide).
- **Privilege & Favor Economy:**
  - Consensual reward points and privilege tokens earned through task completion and redeemed for intimate favors.

---

### Horizon 4: Hardware Bridges & Sensory Telemetry
*Focus: Bridging digital state machines with physical reality.*
- **Web Bluetooth (BLE) Device Integration:**
  - Standardized device drivers for smart chastity cages (Qiui, Cellmate, Chaster BLE bridge).
  - Telemetric control for vibrators and estim units (Lovense, We-Vibe, E-Stim Systems).
- **Biometric Scene Monitoring:**
  - Integration with BLE heart rate bands to monitor stress, arousal, and subspace during physical scenes.
- **Remote / Long-Distance Scene Sync:**
  - Real-time synchronization of session timers and toy controls across distance.

---

### Horizon 5: Platform, Federation & Zero-Knowledge Architecture
*Focus: Scalability, cross-device sync, and cryptographic invulnerability.*
- **Zero-Knowledge End-to-End Encryption (E2EE):**
  - Signal Double Ratchet protocol for peer-to-peer synchronization.
  - Cryptographic guarantees ensuring server operators have zero visibility into user desires or agreements.
- **Decentralized / Self-Hosted Node Support:**
  - Capability for privacy-conscious users to host their own Haven sync relay.
- **Public Developer Plugin SDK:**
  - Sandboxed API enabling third-party creators to author and distribute experience decks and dynamic toolboxes.

---

## 2. The Haven 10-Point Feature Evaluation Rule

Before writing code for any proposed new feature, the product team must evaluate the proposal against the **Haven 10-Point Evaluation Rule**.

If a proposal fails even one of these criteria, it must be rejected or redesigned:

```
                      THE HAVEN 10-POINT EVALUATION RULE

┌────┬─────────────────────────────┬────────────────────────────────────────┐
│ #  │ CRITERION                   │ PASS REQUIREMENT                       │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 1  │ Consent Preservation        │ Does the feature preserve unconditional│
│    │                             │ human agency to pause or revoke?       │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 2  │ Adult Honesty               │ Does it use direct, dignified language │
│    │                             │ without clinical or moral sanitization?│
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 3  │ Anti-Coercion               │ Is it impossible for one partner to    │
│    │                             │ trap another in a digital prison?      │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 4  │ Anti-Gamification           │ Does it avoid arcade Skinner-boxes,    │
│    │                             │ cheap badges, and cartoon graphics?    │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 5  │ Relational Context          │ Does it live inside an agreement rather│
│    │                             │ than floating as an isolated gimmick?  │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 6  │ Multi-Partner Awareness     │ Does it function cleanly in polyamorous│
│    │                             │ and non-monogamous topologies?         │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 7  │ Privacy Sovereignty         │ Does it minimize data leakage and      │
│    │                             │ respect local storage / E2EE bounds?   │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 8  │ Tone Calibrated             │ Does it adapt appropriately between    │
│    │                             │ sober safety and erotic playfulness?   │
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 9  │ Sensory Restraint           │ Does it build tension through pacing   │
│    │                             │ and typography rather than pornography?│
├────┼─────────────────────────────┼────────────────────────────────────────┤
│ 10 │ Aftercare Completeness      │ Does it account for the emotional and  │
│    │                             │ physical cooldown following intensity? │
└────┴─────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Recommended Next Implementation Target: Phase 6

Based on the completion of the structural foundation (Phases 1–5), the recommended next implementation phase for Haven is:

### **Phase 6: Intimacy & Discovery (Desires Decks & Asymmetric Operations)**

1. **Double-Blind Desires Deck UI:** Interactive card deck allowing partners to independently swipe/rate desires (`Eager`, `Curious`, `Fantasy Only`, `Hard Limit`) with secret matching reveals.
2. **Permission Request Center:** Asymmetric proposal and approval dashboard (Chastity release, outside date, scene request) linked directly to active agreements.
3. **Task & Proof Manager:** Actionable assignments with ephemeral photo and timer verification.
4. **Discreet Mode & Quick Panic Trigger:** Universal panic exit shortcut and neutral camouflage options.
