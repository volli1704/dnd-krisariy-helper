export type PsiMood = 'yellow' | 'blue_1' | 'black' | 'blue_2';

export interface PsiState {
  currentMood: PsiMood;
  diceCurrent: number;
  diceMax: number;
  dieType: string; // 'd6'
  blackPillUsedToday: boolean;
  blackPillActive: boolean; // Panic attack (forces black effects for 1 min)
  whitePillsUsedToday: number;
}

export interface PsiSkillRollOutcome {
  skillId: 'protective_field' | 'psionic_strike' | 'telekinetic_movement';
  skillName: string;
  moodUsed: 'yellow' | 'blue' | 'black';
  d6Roll: number;
  d20Roll?: number;
  effectTitle: string;
  effectDescription: string;
  damage?: number;
  healing?: number;
  selfDamage?: number;
  targetCount?: number;
  dc?: number;
  extraAttackGranted?: boolean;
  psiDieExpended: boolean;
  nextMood: PsiMood;
}
