"""
Haven Scenario Library Generator
Generates comprehensive product design research scenarios across 23 core dynamic categories,
cross-dynamic combinations, ordinary relationships, multi-person topologies, and long-distance.
Also generates INDEX.md and PATTERNS.md.
"""

import os
import sys

# Ensure current directory is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from scenarios_data_01_06 import CATEGORIES_01_06
from scenarios_data_07_12 import CATEGORIES_07_12
from scenarios_data_13_18 import CATEGORIES_13_18
from scenarios_data_19_23 import CATEGORIES_19_23
from scenarios_data_extras import THEMATIC_EXTRAS

SCENARIOS_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "docs", "haven", "scenarios")

def ensure_dir():
    os.makedirs(SCENARIOS_DIR, exist_ok=True)

def render_scenario_file(filename, data):
    title = data["title"]
    description = data["description"]
    scenarios = data["scenarios"]

    md = []
    md.append(f"# {title}")
    md.append(f"## Haven Scenario Research Library")
    md.append("")
    md.append(f"> **Overview:** {description}")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### Scenarios in this Section")
    for i, sc in enumerate(scenarios, 1):
        md.append(f"{i}. [{sc['title']}](#scenario-{i}-{slugify(sc['title'])})")
    md.append("")
    md.append("---")
    md.append("")

    for i, sc in enumerate(scenarios, 1):
        md.append(f"### Scenario {i}: {sc['title']}")
        md.append(f"- **Context:** {sc['context']}")
        md.append(f"- **Dynamic:** {sc['dynamic']}")
        md.append(f"- **What they want:** {sc['what_they_want']}")
        md.append(f"- **Before:** {sc['before']}")
        md.append(f"- **Experience:** {sc['experience']}")
        md.append(f"- **Branches:** {sc['branches']}")
        md.append(f"- **Aftercare:** {sc['aftercare']}")
        md.append(f"- **Reflection:** {sc['reflection']}")
        md.append(f"- **Haven opportunities:** {sc['haven_opportunities']}")
        md.append("")
        md.append("---")
        md.append("")

    filepath = os.path.join(SCENARIOS_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(md).strip() + "\n")
    print(f"Generated {filename} ({len(scenarios)} scenarios)")

def slugify(text):
    return text.lower().replace(" ", "-").replace("—", "").replace("'", "").replace("(", "").replace(")", "").replace("/", "").replace("&", "and")

def render_index(all_data):
    md = []
    md.append("# Haven Scenario Research Library")
    md.append("## Master Index & Design Reference Repository")
    md.append("")
    md.append("> **Notice:** This internal scenario library serves as design research and architectural raw material for future Haven features. These scenarios document real-world human dynamics, edge cases, boundaries, and emotional branching across adult relationship, kink, power-exchange, and intimacy practices.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### Core Dynamic Categories (01 — 23)")
    md.append("")
    md.append("| # | Category | Core Dynamic Focus | Scenarios |")
    md.append("| :- | :--- | :--- | :- |")

    cat_keys = sorted([k for k in all_data.keys() if k[0].isdigit()])
    total_scenarios = 0

    for k in cat_keys:
        item = all_data[k]
        count = len(item["scenarios"])
        total_scenarios += count
        num = k.split("_")[0]
        name = item["title"].replace(f"Category {num} — ", "")
        md.append(f"| **{num}** | [**{name}**](./{k}) | {item['description']} | {count} scenarios |")

    md.append("")
    md.append("### Cross-Category & Topology Deep Dives")
    md.append("")
    md.append("| File | Domain Focus | Scenarios |")
    md.append("| :--- | :--- | :- |")

    extra_keys = [k for k in all_data.keys() if not k[0].isdigit()]
    for k in extra_keys:
        item = all_data[k]
        count = len(item["scenarios"])
        total_scenarios += count
        name = item["title"]
        md.append(f"| [**{name}**](./{k}) | {item['description']} | {count} scenarios |")

    md.append("")
    md.append("---")
    md.append("")
    md.append(f"**Total Documented Scenarios:** {total_scenarios} comprehensive human interaction cases.")
    md.append("")
    md.append("### Architectural Synthesis")
    md.append("For recurring cross-cutting patterns, emotional friction points, and domain engineering models derived from these scenarios, see [**PATTERNS.md — Architectural & Psychological Patterns**](./PATTERNS.md).")

    filepath = os.path.join(SCENARIOS_DIR, "INDEX.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(md).strip() + "\n")
    print(f"Generated INDEX.md ({total_scenarios} total scenarios indexed)")

def render_patterns():
    md = []
    md.append("# Haven Scenario Library — Architectural & Psychological Patterns")
    md.append("## Cross-Cutting Design Insights Derived from 189 Intimacy Scenarios")
    md.append("")
    md.append("> **Purpose:** This document synthesizes the recurring patterns, edge cases, friction points, and architectural imperatives revealed across the Haven Scenario Research Library. It provides clear guidance for future engineering, domain modeling, and interaction design.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. The Criticality of Boundary Transitions & Decompression")
    md.append("Across all categories—from heavy impact play to ordinary domestic discussions—the highest risk of relational damage occurs **at the transitions into and out of dynamic states**, rather than during the peak experience itself.")
    md.append("")
    md.append("- **Re-entry Vulnerability:** Shifting from Master/slave protocol or high-intensity BDSM back into mundane civilian chores requires deliberate decompression (the 'Civilian Transition Protocol'). Abrupt endings induce cognitive whiplash.")
    md.append("- **LDR Reunion Fatigue:** Couples reuniting after months apart frequently fall into the 'Disney Trip' trap, expecting immediate perfection and burning out from travel fatigue on Day 1. Pacing protocols that mandate resting before intimacy prevent catastrophic arguments.")
    md.append("- **The 48-Hour Recovery Curve:** Neurochemical depletion (sub-drop and dom-drop) consistently strikes 24 to 72 hours post-scene. Applications that stop tracking aftercare when the timer stops fail the user; Haven must provide automated 24h and 48h check-ins.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. The Asymmetric Authority vs. Bilateral Sovereignty Paradox")
    md.append("A central architectural tension in Haven is supporting authentic asymmetric hierarchy (D/s, Keyholder/Wearer, Queen/Subject) while maintaining uncompromised bilateral human sovereignty.")
    md.append("")
    md.append("- **The Unconditional Override:** Regardless of contract language or lock status, every participant must hold an absolute, non-punitive emergency exit hatch. Software must enforce this at the protocol level (e.g., Safe Key Escrow, Universal Emergency Removal).")
    md.append("- **No Coercive Gamification:** Streak counters, public ranking boards, and punitive countdowns turn consensual submission into coercive gamification. Discipline in Haven must remain rooted in reverent human relationship, not algorithmic guilt.")
    md.append("- **Protocol Waivers as an Act of Grace:** Dominants frequently need mechanisms to grant temporary waivers (illness, bereavement, work stress) without the submissive feeling like a failure. The domain model must treat waivers as first-class objects.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 3. Double-Blind Discovery & Psychological Safety")
    md.append("Many of the most profound desires (cuckoldry, adult chastity, primal play, feminization) carry immense vulnerability and fear of judgment.")
    md.append("")
    md.append("- **Zero-Risk Exposure:** The double-blind card deck architecture is non-negotiable. Expressing interest in a card must remain cryptographically invisible to a partner unless they independently express matching interest.")
    md.append("- **Desire Does Not Equal Consent:** A fundamental boundary in Haven: a mutual match in the Desire Deck is purely an invitation for curious conversation—it is never an implied agreement or permission to execute.")
    md.append("- **Asynchronous Counter-Proposals:** When requests are made (e.g., chastity unlock or scene proposal), binary 'Accept/Decline' is inadequate. Real human dynamics require structured counter-offers (e.g., 'Yes, but for 2 hours instead of 6, and only if tasks are done').")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Multi-Person Topologies & Relational Granularity")
    md.append("Non-monogamous relationships cannot be modeled as simple contact lists. They operate as complex, evolving graphs.")
    md.append("")
    md.append("- **Dyadic Independence in Triads:** A triad of A, B, and C consists of four distinct relational containers: Dyad A-B, Dyad B-C, Dyad A-C, and the collective Triad ABC. Each requires independent agreements, privacy settings, and calendar management.")
    md.append("- **Metamour Discretion:** Software must support varied metamour comfort levels, from 'Parallel Polyamory' (complete informational firewall) to 'Kitchen Table Polyamory' (shared group chats and calendar visibility).")
    md.append("- **Crisis Networks:** In medical emergencies or hospitalizations, polycule directives and healthcare proxies must ensure non-biological partners are recognized and notified.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Somatic & Environmental Grounding")
    md.append("Intimacy cannot live solely in digital forms. The most successful scenarios rely on physical sensory anchors that bridge digital coordination into physical reality.")
    md.append("")
    md.append("- **Olfactory & Tactile Anchors:** Identical scented candles for LDR couples, worn clothing in care packages, and conditioned leather or jute establish somatic co-regulation faster than voice alone.")
    md.append("- **Physiological De-escalation:** During acute conflict or jealousy spirals, cognitive conversation fails because heart rate exceeds 100 bpm. Haven must provide somatic tools (mammalian dive reflex, 4-7-8 breathing, weighted pressure) to reset physiology before verbal communication restarts.")
    md.append("- **Environmental Cleansing:** Domestic rituals like changing bedsheets, drawing warm baths, and white-glove room inspections establish sacred boundaries between chaotic outside life and intimate partnership.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 6. Synthesis: The Core Entity Lifecycle in Haven")
    md.append("The 189 scenarios consistently validate the foundational entity progression:")
    md.append("")
    md.append("```text")
    md.append("Person")
    md.append("  ↓")
    md.append("Relationship Container (Who are we?)")
    md.append("  ↓")
    md.append("Dynamic Framework (What game/structure are we playing?)")
    md.append("  ↓")
    md.append("Agreements & Compacts (What are our boundaries, rules, and covenants?)")
    md.append("  ↓")
    md.append("Desires & Mutual Discovery (What are we curious about exploring?)")
    md.append("  ↓")
    md.append("Requests & Proposals (Can we do this together under these conditions?)")
    md.append("  ↓")
    md.append("Tasks & Devotions (Ongoing practices, chores, and accountability)")
    md.append("  ↓")
    md.append("Sessions & Rituals (Live bounded scenes and daily grounding habits)")
    md.append("  ↓")
    md.append("Aftercare, Check-ins & Long-Term Reflection (Healing, calibration, and growth)")
    md.append("```")

    filepath = os.path.join(SCENARIOS_DIR, "PATTERNS.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(md).strip() + "\n")
    print("Generated PATTERNS.md (Architectural & Psychological Synthesis)")

def main():
    ensure_dir()
    all_data = {}
    all_data.update(CATEGORIES_01_06)
    all_data.update(CATEGORIES_07_12)
    all_data.update(CATEGORIES_13_18)
    all_data.update(CATEGORIES_19_23)
    all_data.update(THEMATIC_EXTRAS)

    for filename, data in all_data.items():
        render_scenario_file(filename, data)

    render_index(all_data)
    render_patterns()
    print("\nSuccessfully built complete Haven Scenario Library!")

if __name__ == "__main__":
    main()
