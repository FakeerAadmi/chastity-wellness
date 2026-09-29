# Haven Design System
## Sensory, Architectural & Interaction Language for Adult Dynamics

---

## 1. Design Philosophy: The Sanctuary of Intimacy

Haven's visual and tactile language is guided by four primary aesthetic pillars:

```
                    HAVEN DESIGN PILLARS

┌─────────────────────────┬─────────────────────────┐
│     1. ARCHITECTURAL    │        2. TACTILE       │
│ Clean lines, geometric  │ Textured materials,     │
│ precision, monumental   │ physical weight, subtle │
│ calm, editorial rhythm. │ paper & frosted glass.  │
├─────────────────────────┼─────────────────────────┤
│        3. PRIVATE       │        4. INTIMATE      │
│ Low light dispersion,   │ Warm undertones, deep   │
│ shadow gradients,       │ resonance, sensual      │
│ discreet glances.       │ pacing and anticipation.│
└─────────────────────────┴─────────────────────────┘
```

Haven is not a spreadsheet, nor is it a neon adult toy catalog. It is designed to feel like entering a **private modernist sanctuary**—an architectural space constructed from heavy stone, darkened timber, brushed brass, and soft linen.

---

## 2. Generating Erotic Tension Without Explicit Imagery

The fundamental design challenge of Haven is creating an intensely erotic, adult atmosphere without resorting to cheap pornography or explicit graphic nudity.

Haven achieves sexual tension through **interaction choreography, anticipation, and tactile restraint**:

1. **The Asymmetric Reveal:**
   - Instead of displaying a partner’s intimate message or photo instantly, the UI presents an obscured, frosted card with a subtle breathing glow.
   - Revealing the content requires a deliberate press-and-hold interaction (2 seconds), building physical and psychological anticipation.
2. **Pacing & Slow Transitions:**
   - Actions in Haven do not snap instantaneously like generic web forms. Transitions take 300–500ms, using smooth cubic-bezier easing curves that create a languid, deliberate, and sensual cadence.
3. **Typographic Sensuality:**
   - Editorial serif headings paired with clean, ultra-legible geometric sans-serif body copy.
   - Text is given generous whitespace, allowing words—rules, desires, safewords, vows—to hold gravity and emotional weight.
4. **Whispered Feedback (Haptics & Sound):**
   - Subtle tactile thuds when a lock engages, a soft release vibration when an agreement is ratified, and a sharp double-pulse if a yellow safeword is touched.

---

## 3. Color Architecture & Material Palette

Haven uses a deeply considered palette that avoids sterile clinical grays and aggressive primary colors.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIMARY BASE SYSTEM                             │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Deep Obsidian     │ Slate Charcoal    │ Warm Taupe Surface             │
│ `#0A0D14`         │ `#161B26`         │ `#1E2433`                      │
│ Background Canvas │ Card Surfaces     │ Interactive Hover / Borders    │
└───────────────────┴───────────────────┴────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│                        ACCENT & METALLIC SYSTEM                        │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Burnished Brass   │ Muted Crimson     │ Soft Sage                      │
│ `#D4AF37` / Amber │ `#C53030`         │ `#48BB78`                      │
│ Authority, locks, │ Emergency Stop,   │ Verified, ready,               │
│ agreement seals.  │ Safewords, alerts.│ active health.                 │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Dark Mode as the Canonical State
While Haven supports an editorial Light Mode (parchment, charcoal ink, and warm linen) for discreet daytime reading, **Dark Mode is the canonical, native presentation**. Deep obsidian canvas colors eliminate screen glare, preserve intimacy in bed or low-light scenes, and minimize light leakage in private rooms.

---

## 4. Typography & Editorial Rhythm

Haven treats text as the primary vehicle of human intimacy. The typographic system is structured as follows:

| Style Role | Font Family / Fallbacks | Character & Purpose |
| :--- | :--- | :--- |
| **Editorial Display (Titles & Vows)** | *Playfair Display, Cormorant Garamond, Georgia, serif* | Majestic, literary, timeless. Used for Agreement titles, ritual names, and intimate quotes. |
| **System Interface (Body & Controls)** | *Inter, SF Pro Display, system-ui, sans-serif* | Utilitarian, crisp, razor-sharp legibility for numbers, countdown timers, and form inputs. |
| **Monospace (Timers & Protocols)** | *JetBrains Mono, SF Mono, Menlo, monospace* | Precise, mechanical, clinical clarity for countdown timers, lock hashes, and log entries. |

---

## 5. Component Interaction Patterns

### 1. The Agreement Seal (Dual-Sign Component)
- Rather than a standard web checkbox, Agreements feature a formal **Dual-Sign Stamp**.
- Both partners press and hold their signature medallions. The seal slowly fills with a radial burnished-gold gradient, locking the agreement with an authentic sense of solemnity.

### 2. The Lockout & Countdown Timer
- Rendered in a high-contrast circular or linear progress track.
- Time remaining is displayed in monospace typography with hours, minutes, and seconds.
- Sub-text indicates the controlling partner or scheduled unlock window.
- The Emergency Unlock trigger is cleanly visible below the timer, accompanied by an explanatory sub-note: *"Always available without explanation."*

### 3. The Traffic Light Safeword HUD
- Available during any active Session.
- High-contrast, unambiguous buttons:
  - `GREEN` (Soft emerald background with clear checkmark)
  - `YELLOW` (Muted amber background with pause icon)
  - `RED` (Bold crimson button spanning full viewport width, instant one-tap trigger)

### 4. Asymmetric Reveal Cards
- Card content is obscured with a blur filter (`backdrop-filter: blur(16px)`).
- A subtle shimmering lock icon indicates unread partner content.
- User interacts via press-and-hold or manual unlock toggle.

---

## 6. Accessibility & Inclusivity (A11y)

Erotic wellness and power dynamics belong to all consenting adults, regardless of physical or sensory abilities.

1. **High Contrast Ratios:** All text adheres strictly to WCAG AA/AAA standards (contrast ratio >= 4.5:1 against dark backgrounds).
2. **Screen Reader Semantic Hierarchy:** All state changes (timers expiring, safewords triggered, requests approved) are announced via `aria-live="polite"` or `assertive` regions.
3. **Keyboard & Switch Navigation:** Complete operational parity via keyboard shortcuts (e.g., Space to pause, Esc Esc for panic exit, 1-2-3 for traffic light safewords).
4. **Reduced Motion Opt-In:** Full compliance with `prefers-reduced-motion`; complex transitions and blur animations dissolve into instant, crisp fades.
