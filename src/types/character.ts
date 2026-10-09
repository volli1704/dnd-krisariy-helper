export type AbilityName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface AbilityScore {
  name: AbilityName;
  fullName: string;
  fullNameUk: string;
  score: number;
  proficientSave: boolean;
}

export interface Skill {
  id: string;
  name: string;
  nameUk: string;
  ability: AbilityName;
  proficiencyLevel: 'none' | 'proficient' | 'expertise' | 'half';
  customBonus?: number;
}

export interface SpecialResource {
  id: string;
  name: string;
  description: string;
  current: number;
  max: number;
  resetOn: 'shortRest' | 'longRest' | 'custom' | 'turn';
  color?: string; // e.g. amber, purple, crimson, cyan
}

export interface SpecialMechanic {
  id: string;
  title: string;
  description: string;
  type: 'passive' | 'active' | 'stance' | 'resource';
  active?: boolean;
  cost?: string;
  effectSummary?: string;
  tags?: string[];
}

export interface AttackAction {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'spell' | 'special';
  toHitBonus: number;
  damage: string; // e.g. "1d8 + 4"
  damageType: string; // e.g. "Slashing", "Fire"
  range: string; // e.g. "5 ft", "120 ft"
  notes?: string;
}

export interface SpellSlot {
  level: number;
  total: number;
  expended: number;
}

export interface Spell {
  id: string;
  name: string;
  nameUk?: string;
  level: number; // 0 for cantrip
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  prepared?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameUk?: string;
  category: 'weapon' | 'armor' | 'potion' | 'scroll' | 'magic' | 'adventuring' | 'quest';
  quantity: number;
  weight: number; // in lbs
  cost?: string; // e.g. "15 gp"
  rarity?: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';
  attuned?: boolean;
  requiresAttunement?: boolean;
  equipped?: boolean;
  description: string;
  properties?: string[];
}

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface Character {
  id: string;
  name: string;
  avatarUrl?: string;
  class: string;
  subclass: string;
  level: number;
  race: string;
  background: string;
  alignment: string;
  experience?: number;

  // Combat Stats
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  armorClass: number;
  initiativeBonus: number;
  speed: number; // in feet (e.g. 30)
  proficiencyBonus: number;
  hitDice: {
    current: number;
    total: number;
    dieType: string; // e.g. "d8", "d10"
  };
  deathSaves: {
    successes: number; // 0-3
    failures: number;  // 0-3
  };

  // Abilities & Skills
  abilities: Record<AbilityName, AbilityScore>;
  skills: Skill[];

  // Custom Character Mechanics & Resources
  specialMechanicName: string; // e.g. "Warlock Pact & Invocations" or "Blood Hunter Rites"
  specialMechanicDescription: string;
  specialResources: SpecialResource[];
  specialMechanics: SpecialMechanic[];

  // Combat & Spells
  attacks: AttackAction[];
  spellcastingAbility?: AbilityName;
  spellSaveDC?: number;
  spellAttackBonus?: number;
  spellSlots: Record<number, SpellSlot>;
  spells: Spell[];

  // Active Conditions (e.g., 'Poisoned', 'Blinded')
  activeConditions: string[];
  favoriteFeatureIds?: string[];

  // Inventory
  inventory: InventoryItem[];
  currency: Currency;

  // Proficiencies & Traits
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
  };
  languages: string[];
  senses: {
    passivePerception: number;
    passiveInvestigation: number;
    passiveInsight: number;
    darkvision?: number;
    special?: string;
  };
  notes: string;
}
