# Haven Safety, Privacy & Consent
## Digital Risk Management, Threat Modeling & Ethical Foundations

---

## 1. The Consent Philosophy: The Digital FRIES Standard

In traditional software, "consent" is degraded to an opaque End User License Agreement (EULA) signed once and forgotten. In Haven, consent is the central kinetic force of the entire application.

We translate the acclaimed **FRIES Framework** (Freely Given, Reversible, Informed, Enthusiastic, Specific) into concrete software architecture:

```
                      THE DIGITAL FRIES STANDARD

┌─────────────────────────┬─────────────────────────────────────────────────┐
│ PRINCIPLE               │ SOFTWARE IMPLEMENTATION IN HAVEN                │
├─────────────────────────┼─────────────────────────────────────────────────┤
│ 1. Freely Given         │ No coercion, no lockout traps, no automated     │
│                         │ penalties for pausing or revoking agreements.   │
├─────────────────────────┼─────────────────────────────────────────────────┤
│ 2. Reversible           │ Universal Unconditional Pause button active     │
│                         │ across all sessions, rituals, and timers.       │
├─────────────────────────┼─────────────────────────────────────────────────┤
│ 3. Informed             │ Explicit boundary taxonomy, risk descriptions   │
│                         │ (RACK), and clear review dates on agreements.   │
├─────────────────────────┼─────────────────────────────────────────────────┤
│ 4. Enthusiastic         │ Pre-scene Readiness Gates requiring affirmative │
│                         │ real-time opt-in from all participants.         │
├─────────────────────────┼─────────────────────────────────────────────────┤
│ 5. Specific             │ Desires and practices categorized into discrete │
│                         │ tags; agreeing to X never automatically implies │
│                         │ consent to Y.                                   │
└─────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 2. Safeword Architecture & The Traffic Light System

Every live Session, high-intensity Ritual, and active Dynamic is continuously monitored by Haven's Safeword Engine.

### The Standard Traffic Light Protocol
- **GREEN (Optimal Play):** Scene proceeds as planned; all participants are energized, comfortable, and operating within desired intensity.
- **YELLOW (Caution / Approaching Limit):**
  - *Trigger:* Participant taps Yellow button or vocalizes yellow safeword.
  - *System Action:* Live timers pulse amber; intensity must immediately decrease; active physical play halts until verbal calibration occurs.
- **RED (Immediate Emergency Stop):**
  - *Trigger:* Participant taps Red button or vocalizes red safeword.
  - *System Action:*
    1. Instantly terminates the session or ritual.
    2. Silences all countdowns, sound effects, or background audio.
    3. Neutralizes any linked hardware toys (immediate motor stop and unlocking signal).
    4. Transitions both screens immediately into **Aftercare & De-escalation Mode**.
    5. Disables all task assignments or punitive consequences for 24 hours.

### Custom Safewords
Partners can define custom safewords in their Dynamic Safety Plan (e.g., "Red", "Pineapple", "Cacao"). The app prominently displays both the custom words and the universal color buttons on the active session HUD.

---

## 3. The Unconditional Pause / Emergency Stop

The cornerstone of safety in Haven is the **Unconditional Pause**.

```
                   [ UNCONDITIONAL PAUSE ACTIVATED ]
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 [ HALT ALL TIMERS ]     [ NEUTRALIZE LOCKS ]      [ ENTER AFTERCARE ]
 All countdowns, tasks,   Immediate emergency      Calming UI, hydration
 & notifications stop.    release code displayed.  checklists, grounding.
```

- **Zero Explanation Required:** When a user taps the Unconditional Pause, the app does not demand an interrogation or reason. It immediately yields to the human.
- **Hardware Fail-Safe:** If linked to electronic chastity or bondage hardware, triggering the Unconditional Pause immediately broadcasts an emergency unlock command or reveals the emergency physical key code.
- **Non-Judgmental Record:** The event is logged in the dynamic's history simply as *"Session paused by [Participant] at [Time]"*. No shame, no guilt, no penalty.

---

## 4. Privacy Architecture: Local Sovereignty vs. Future E2EE

A platform holding adult desires, power dynamics, and intimate agreements represents an extraordinary privacy liability if engineered carelessly.

### Phase 1–5 Current Posture: Privacy-Aware Local Storage
- In the current implementation, all Haven records reside in **privacy-aware client-side local storage (`localStorage`)**.
- **Important Disclosure:** Local storage is isolated to the user’s specific browser profile, but is *not* cryptographically encrypted at rest by the operating system. Haven explicitly refrains from claiming false military-grade encryption in this tier.
- No personal data, fantasies, or check-in logs are transmitted to central corporate servers, analytics trackers, or third-party ad networks.

### Future Architecture: Zero-Knowledge End-to-End Encryption (E2EE)
When Haven implements cross-device synchronization and peer-to-peer partner messaging, it will adhere strictly to zero-knowledge cryptography:
- **Client-Side Key Derivation:** Cryptographic keys derived locally using Argon2id or PBKDF2 with user-held passphrases.
- **Double Ratchet Protocol:** Inter-partner messages and state sync secured via the Signal Double Ratchet protocol.
- **Zero Server Knowledge:** Even in the event of a government subpoena or database breach, Haven’s sync servers will store only encrypted blobs; server operators cannot read desires, agreements, photos, or participant identities.

---

## 5. Discretion & Anti-Surveillance UI Features

To protect users from shoulder surfing, device confiscation, or hostile domestic scrutiny, Haven includes dedicated discretion mechanisms:

1. **Quick-Exit Panic Button:**
   - A discreet, ever-present icon in the interface header.
   - Tapping or hot-keying (Esc Esc) instantly clears the screen and replaces it with a convincing decoy utility (e.g., a neutral recipe blog, minimalist markdown note-taker, or weather dashboard).
2. **App Icon & Notification Camouflage:**
   - Customizable mobile launcher icon (e.g., stylized flower, calculator, or plain geometric icon).
   - Sanitized notification masks: When Partner A approves a release request, the device notification reads *"Calendar: 1 item updated"* or *"Notes: Task verified"*.
3. **Decoy Vault PIN:**
   - Support for two PINs: a real access PIN and a Decoy PIN.
   - Entering the Decoy PIN opens an empty, innocuous vanilla relationship organizer with zero kink tags or adult dynamics.

---

## 6. Ephemeral Media & Verification Proofs

In power exchange, chastity, and non-monogamy, partners frequently share intimate photo proofs (e.g., verification of cage placement, outfit inspection, lingerie confirmation, location proof).

### Ephemeral Media Rules
- **No Device Camera Roll Pollution:** Photos taken within Haven are captured using an isolated camera stream and held exclusively in memory or sandboxed temporary cache. They are never written to the iOS or Android public photo roll.
- **View-Once & Auto-Decay:** Dominants/Keyholders can be granted view-once or time-limited access (e.g., 60 seconds) after which the media blob is cryptographically shredded.
- **Anti-Screenshot Detection:** Client-side triggers detect screenshot attempts, alerting the sender and immediately blanking the viewport.

---

## 7. Meetup Safety & Sexual Health

Consensual Non-Monogamy, Cuckold/Hotwife dynamics, and outdoor kink meetups require specialized safety infrastructure:

### Meetup Safety Check-In Timer
- When an individual embarks on a date or scene with an outside partner (e.g., Hotwife meeting a Bull), they can activate a **Haven Safety Timer**.
- **Automated Check-in Interval:** User must tap "All is well" every 60–120 minutes.
- **Emergency Escalation:** If two check-in windows are missed without response, Haven automatically alerts designated emergency contacts or primary partners with pre-configured emergency notes and location data.

### Sexual Health & Testing Vault
- **Private STI Test Tracking:** Log verified testing dates, panel types (HIV, Syphilis, Hep B/C, Chlamydia, Gonorrhea), and next scheduled screening date.
- **Prophylactic Agreements:** Formalized agreements documenting barrier rules (dental dams, condoms, PrEP usage) with outside partners.
