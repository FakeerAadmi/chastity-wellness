# Haven Relationship Model
## Architecture of Human Connection, Polyamory & Contextual Roles

---

## 1. The Relational Domain Hierarchy

Haven models human connections not as static database contacts, but as living, multi-layered relational ecosystems. The canonical domain hierarchy flows from the sovereign individual to daily operational practices:

```
                          [ PERSON (User) ]
                                  │
                                  ▼
                         [ RELATIONSHIP ]
                     (Dyad, Triad, Polycule, Solo)
                                  │
                                  ▼
                        [ PARTICIPANT & ROLE ]
                 (Contextual: Dominant, Sub, Switch, Peer)
                                  │
                                  ▼
                             [ DYNAMIC ]
                (D/s, Chastity, Hotwife, Service, Sensual)
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
[ DESIRES & FANTASIES ]     [ BOUNDARIES ]           [ AGREEMENTS ]
  (Curiosities, Limits)     (Soft / Hard Limits)       (Negotiated Covenants)
                                                           │
         ┌────────────────────────┬────────────────────────┤
         ▼                        ▼                        ▼
   [ REQUESTS ]               [ TASKS ]               [ RITUALS ]
 (Permissions, Proposals)   (Assignments, Chores)    (Daily / Weekly Habits)
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                             [ SESSIONS ]
                       (Time-Bounded Scene Play)
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   [ CHECK-INS ]                                      [ MEMORIES ]
(Calibration & Health)                             (Milestones & History)
```

---

## 2. Core Entities & Relational Schema

### 1. Person (`User`)
The cryptographic and legal individual.
- **Attributes:** Unique ID, display name, handle, avatar, bio, base preferences, private encryption key.
- **Privacy Barrier:** A Person maintains absolute ownership over their profile and private vault. No relationship or partner has access to a Person's unshared notes or raw private desires.

### 2. Relationship (`Relationship`)
The social, emotional, or contractual container binding two or more Persons.
- **Topologies Supported:**
  - **Dyad (Monogamous or Polyamorous pair):** Two partners (e.g., married, dating, long-distance).
  - **Triad / Threesome Dynamic:** Three interconnected partners (e.g., A-B-C equilateral or hierarchical).
  - **Polyamorous "V" & Constellations:** Partner A is connected to Partner B and Partner C, while B and C are metamours (shared awareness without necessarily having an erotic dynamic between them).
  - **Quad / Polycule:** Multi-person intentional collectives.
  - **Solo Dynamic:** A single individual tracking solo chastity, self-discipline, erotic journaling, or fantasy exploration without an attached partner.
- **Attributes:** `id`, `title`, `type` (`monogamous`, `polyamorous`, `open`, `d_s`, `casual`, `solo`), `participantIds`, `establishedDate`, `status` (`active`, `paused`, `archived`), `settings`.

### 3. Participant & Contextual Role (`Participant`, `Role`)
A Person’s specific manifestation within a Relationship and Dynamic.
- **The Non-Global Role Axiom:** **Roles are NEVER global static properties of a user.**
  - A user is never globally "a submissive" or "a dominant."
  - In Relationship 1 (with Alex), Jordan may hold the role of **Keyholder / Dominant**.
  - In Relationship 2 (with Taylor), Jordan may hold the role of **Submissive / Bottom**.
  - In Relationship 3 (with Morgan), Jordan may hold the role of **Egalitarian / Peer**.
- **Role Permissions:**
  - *Symmetric Roles:* Peer, Switch, Co-creator, Play Partner. Both participants hold equal creation and approval rights.
  - *Asymmetric Roles:* Master / Slave, Dominant / Submissive, Keyholder / Locked, Stag / Vixen / Bull. One participant may hold primary task-assignment, approval, or lock-control authority, while the other holds sovereign veto and emergency-pause rights.

### 4. Dynamic (`Dynamic`)
A specific erotic, psychological, or operational practice running within a Relationship.
- A single Relationship can host multiple concurrent Dynamics:
  - *Dynamic A:* 24/7 Chastity & Orgasm Control (Keyholder: Alex, Chaste: Jordan).
  - *Dynamic B:* Domestic Service & Protocol (Dominant: Alex, Submissive: Jordan).
  - *Dynamic C:* Consensual Non-Monogamy / Hotwife (Wife: Alex, Stag: Jordan).
- **Attributes:** `id`, `relationshipId`, `title`, `archetype` (`bdsm`, `chastity`, `cuckold_hotwife`, `femdom`, `service`, `roleplay`), `tags`, `rules`, `safetyPlan`, `practiceStage` (`interested`, `exploring`, `agreed`, `active`, `paused`, `hard_boundary`).

### 5. Desires, Fantasies & Boundaries
The raw material of erotic interest.
- **Desire / Fantasy:** What a participant finds exciting, erotic, or intriguing.
- **Boundary:**
  - *Soft Limit:* A practice a participant is hesitant about, open to exploring under tight constraints, or currently negotiating.
  - *Hard Limit:* An absolute veto. The software will refuse to generate tasks, suggest prompts, or activate sessions involving hard limits.

### 6. Agreement (`Agreement`)
A formalized, mutual compact governing a dynamic or relationship.
- Includes clear parameters, expected frequency, assigned roles, explicit boundaries, review schedules (e.g., 30-day review), and dual affirmative signatures.

### 7. Operational Actions: Requests, Tasks, Rituals, Sessions
- **Permission Request:** Structured asymmetric request (e.g., "Requesting release for evening shower", "Requesting permission for dinner date with metamour").
- **Task:** An actionable directive with proof requirements (e.g., "15 minutes posture kneeling before 8 PM; photo proof required").
- **Ritual:** Recurring habit loop (e.g., "Morning inspection: temperature check, keyholder greeting, daily devotion").
- **Session:** A time-bounded, active scene (e.g., "Saturday impact play scene; 90 minutes; safeword active").

### 8. Health, Reflection & History: Check-ins, Aftercare, Memories
- **Check-in:** Scheduled or spontaneous calibration across Emotional, Consent, and Dynamic axes.
- **Aftercare:** Structured cooldown workflow following intense physical or psychological scenes.
- **Memory:** Shared or private commemorative journal entries capturing milestones, scene reflections, and agreements over time.

---

## 3. Polyamorous & Multi-Partner Network Topology

Haven is natively architected for non-monogamy. It does not treat non-dyadic relationships as "hacks" or secondary edge cases.

```
       [ ALEX ] (Keyholder to Jordan; Egalitarian with Sam)
        /    \
       /      \
[ JORDAN ]   [ SAM ] (Metamours: shared awareness, no direct dynamic)
       \
        \
       [ MORGAN ] (Long-distance dynamic with Jordan)
```

### Privacy & Visibility in Polyamorous Networks
- **Strict Boundary Isolation:** In a "V" structure (Alex with Jordan and Sam), Sam cannot inspect Jordan’s chastity timers, private tasks, check-in history, or agreements with Alex unless Jordan and Alex explicitly grant multi-participant visibility.
- **Metamour Awareness Channel:** Polyamorous relationships can enable an optional *Metamour Calendar & Status Channel* showing non-intimate status (e.g., "Alex is on an overnight date with Jordan; emergency contact active") without exposing sexual or scene details.
- **Multi-Participant Dynamics:** Triads or Quads can bind 3+ participants into a single shared dynamic (e.g., a shared polyamorous household service agreement or joint fantasy deck).

---

## 4. Relationship Lifecycle

Relationships and dynamics evolve over time. Haven provides a clear, respectful lifecycle state machine:

```
[ INITIATION & DISCOVERY ]
           │ (Invitation accepted, boundaries aligned)
           ▼
     [ INCUBATION ]
           │ (Trial period, soft limits tested, agreements drafted)
           ▼
       [ ACTIVE ] ◄────────────────────────┐
           │                               │ (Renegotiation resolved)
           ├───────────────┐               │
           ▼               ▼               │
       [ PAUSED ]    [ RENEGOTIATION ] ────┘
           │               │
           └───────┬───────┘
                   ▼
       [ ARCHIVED / DISSOLVED ]
    (Dignified retrospective, memory vault preserved)
```

1. **Initiation & Discovery:** Two or more users connect via private cryptographic pairing code. No dynamics or agreements exist yet; participants review each other's shared boundary profiles.
2. **Incubation & Trial:** Partners establish initial exploratory agreements with short expiration horizons (e.g., 7-day or 14-day trial period) to test communication and dynamic comfort.
3. **Active:** Full operational status. Daily rituals fire, tasks can be assigned, sessions can be launched, check-ins are logged.
4. **Renegotiation:** Triggered automatically at agreement review dates or manually upon request. Operational routines continue, but pending changes are highlighted until re-signed.
5. **Paused (Hiatus):** Temporarily deactivates all active timers, task notifications, and lockouts without deleting history. Used during illness, travel, stressful life events, or emotional recovery.
6. **Archived / Dissolved:** When a dynamic or relationship ends, Haven ensures a **dignified exit**:
   - No vengeful deletion or sudden digital erasure.
   - All locks, tasks, and permissions are immediately released and neutralized.
   - Shared history is frozen into an immutable, private archive.
   - Users can choose to keep their personal reflections and memories or permanently purge their data.
