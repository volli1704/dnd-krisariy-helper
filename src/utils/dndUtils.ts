import type { AbilityName, Character, InventoryItem, Currency } from '../types/character';
import type { RollResult } from '../types/rules';

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function calculateProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

export function calculateSkillModifier(
  char: Character,
  skillAbility: AbilityName,
  profLevel: 'none' | 'proficient' | 'expertise' | 'half',
  customBonus = 0
): number {
  const statScore = char.abilities[skillAbility]?.score || 10;
  const baseMod = calculateModifier(statScore);
  const pb = char.proficiencyBonus || calculateProficiencyBonus(char.level);

  let profMultiplier = 0;
  if (profLevel === 'proficient') profMultiplier = 1;
  else if (profLevel === 'expertise') profMultiplier = 2;
  else if (profLevel === 'half') profMultiplier = 0.5;

  return baseMod + Math.floor(pb * profMultiplier) + customBonus;
}

export function calculateSaveModifier(char: Character, ability: AbilityName): number {
  const abilityObj = char.abilities[ability];
  if (!abilityObj) return 0;
  const baseMod = calculateModifier(abilityObj.score);
  const pb = char.proficiencyBonus || calculateProficiencyBonus(char.level);
  return abilityObj.proficientSave ? baseMod + pb : baseMod;
}

export function calculateTotalWeight(inventory: InventoryItem[], currency?: Currency): number {
  const itemsWeight = inventory.reduce((sum, item) => sum + (item.weight * (item.quantity || 1)), 0);
  let coinWeight = 0;
  if (currency) {
    const totalCoins = currency.cp + currency.sp + currency.ep + currency.gp + currency.pp;
    coinWeight = Math.floor(totalCoins / 50); // 50 coins = 1 lb in 5e standard rules
  }
  return Number((itemsWeight + coinWeight).toFixed(1));
}

export function calculateCarryingCapacity(strScore: number): { carryingCap: number; pushDragLift: number } {
  return {
    carryingCap: strScore * 15,
    pushDragLift: strScore * 30,
  };
}

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function executeRoll(
  diceCount: number,
  sides: number,
  modifier = 0,
  label = 'Custom Roll',
  advantageMode: 'normal' | 'advantage' | 'disadvantage' = 'normal'
): RollResult {
  const rolls: number[] = [];
  let total = 0;
  let isCrit = false;
  let isFumble = false;
  let formula = `${diceCount}d${sides}${modifier !== 0 ? formatModifier(modifier) : ''}`;

  if (sides === 20 && diceCount === 1 && advantageMode !== 'normal') {
    const roll1 = rollDie(20);
    const roll2 = rollDie(20);
    rolls.push(roll1, roll2);

    let chosen = roll1;
    if (advantageMode === 'advantage') {
      chosen = Math.max(roll1, roll2);
      formula = `1d20 (Adv) ${modifier !== 0 ? formatModifier(modifier) : ''}`;
    } else {
      chosen = Math.min(roll1, roll2);
      formula = `1d20 (Disadv) ${modifier !== 0 ? formatModifier(modifier) : ''}`;
    }
    total = chosen + modifier;
    if (chosen === 20) isCrit = true;
    if (chosen === 1) isFumble = true;
  } else {
    for (let i = 0; i < diceCount; i++) {
      const val = rollDie(sides);
      rolls.push(val);
      total += val;
    }
    if (sides === 20 && diceCount === 1) {
      if (rolls[0] === 20) isCrit = true;
      if (rolls[0] === 1) isFumble = true;
    }
    total += modifier;
  }

  return {
    id: 'roll_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    label,
    formula,
    rolls,
    modifier,
    total,
    isCrit,
    isFumble,
    advantageMode,
  };
}
