export interface RuleEntry {
  id: string;
  name: string;
  nameUk: string;
  category: 'condition' | 'action' | 'combat' | 'resting' | 'magic' | 'environment' | 'glossary';
  shortSummary: string;
  shortSummaryUk: string;
  bullets: string[];
  bulletsUk: string[];
  tags: string[];
  source?: string;
}

export interface RollResult {
  id: string;
  timestamp: string;
  label: string;
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  isCrit?: boolean;
  isFumble?: boolean;
  advantageMode?: 'normal' | 'advantage' | 'disadvantage';
  details?: string;
}
