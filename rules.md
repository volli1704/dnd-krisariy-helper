# D&D Helper Application — Project Rules & Guidelines

## 1. Project Mission & Objectives
- **Target Audience**: Tabletop D&D 5e player seeking a streamlined, mobile-first companion app for character tracking, special mechanics, inventory, stats, and 5e rules lookup.
- **Form Factor**: Progressive Web App (PWA) designed primarily for mobile viewport (touch-friendly, fast access during sessions, offline capability).
- **Core Standard**: Strict adherence to D&D 5e mechanics, official 5e terminology, and 5e.tools accuracy.

## 2. Technical Stack & Architecture
- **Framework**: React 18+ with TypeScript and Vite.
- **Icons**: Lucide React for consistent, high-quality iconography.
- **Styling**: Vanilla CSS with modern CSS variables, fluid responsive typography, glassmorphism, rich dark-fantasy palette (amber, gold, arcane purple, crimson, deep obsidian slate).
- **Data Persistence**: LocalStorage with schema versioning and JSON Export/Import functionality (no data loss on refresh or browser restart).
- **Offline / PWA**: Manifest + Service Worker support for standalone mobile installation ("Add to Home Screen").

## 3. UI/UX Design System
- **Theme**: Dark Fantasy RPG interface (deep slate `#0d1117`, gold/amber accents `#e5a93b` & `#f59e0b`, arcane runes `#8b5cf6`, combat crimson `#ef4444`, vitality green `#10b981`).
- **Layout**:
  - **Header**: Character quick status (Name, Class, Level, AC, HP bar, Short/Long Rest buttons, Dice roller toggle).
  - **Navigation Bar (Bottom on Mobile)**:
    1. ⚔️ **Combat / Quick Actions**: HP controls, Spell Slots / Class Resources, Weapons / Cantrips, Conditions.
    2. 📜 **Mechanics & Spells**: Special character mechanics, class features, spellbook, active buffs/debuffs.
    3. 🛡️ **Stats & Skills**: 6 Ability Scores, Saving Throws, Skills list with modifier chips, Proficiencies, Senses.
    4. 🎒 **Inventory**: Currency purse (CP/SP/EP/GP/PP), Encumbrance tracker, Categorized items (Weapons, Armor, Consumables, Magic Items, Quest items), Attunement slots.
    5. 📖 **5e Rules & Glossary**: Searchable 5e.tools rules library, combat actions, conditions, cover, environment rules, quick tooltips.
    6. 🎲 **Dice Roller Modal/Drawer**: Interactive dice roller (d4, d6, d8, d10, d12, d20, d100 + modifier) with roll history.

## 4. Code & Quality Standards
- **Clean Typing**: Strict TypeScript interfaces for Character, Items, Spells, Features, Resources, Rules, and Logs.
- **Safety & Error Handling**: Graceful fallback for missing fields or corrupted storage data.
- **Mobile First**: All touch targets at least 44x44px. No horizontal overflow on mobile screens (min-width 360px).
- **Modularity**: Clean separation between state stores, components, data fixtures, and utility calculators (e.g., modifier calculation `floor((stat - 10) / 2)`).
