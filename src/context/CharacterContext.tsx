import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Character, InventoryItem, NoteBlock } from '../types/character';
import type { RollResult } from '../types/rules';
import { DEFAULT_CHARACTER } from '../data/defaultCharacter';
import { executeRoll } from '../utils/dndUtils';

interface CharacterContextType {
  character: Character;
  updateCharacter: (updater: (prev: Character) => Character) => void;
  setHp: (current: number, temp?: number) => void;
  applyDamage: (amount: number) => void;
  applyHeal: (amount: number) => void;
  toggleCondition: (conditionName: string) => void;
  useSpecialResource: (resourceId: string, amount?: number) => void;
  restoreSpecialResource: (resourceId: string, amount?: number) => void;
  toggleSpecialMechanic: (mechanicId: string) => void;
  spendSpellSlot: (level: number) => void;
  restoreSpellSlot: (level: number) => void;
  performShortRest: (hitDiceToSpend: number, conMod: number) => void;
  performLongRest: () => void;
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, updated: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  toggleEquipItem: (id: string) => void;
  toggleAttuneItem: (id: string) => void;
  toggleFavoriteFeature: (featureId: string) => void;
  addNote: (note: { title: string; content: string; category?: string; isPinned?: boolean }) => void;
  updateNote: (id: string, updated: Partial<NoteBlock>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  exportCharacterJson: () => string;
  importCharacterJson: (jsonString: string) => boolean;
  resetToDefault: () => void;
  
  // Dice & Notification State
  rollHistory: RollResult[];
  lastRoll: RollResult | null;
  triggerRoll: (diceCount: number, sides: number, modifier?: number, label?: string, advantageMode?: 'normal' | 'advantage' | 'disadvantage') => RollResult;
  clearRollHistory: () => void;
  isDiceDrawerOpen: boolean;
  setIsDiceDrawerOpen: (open: boolean) => void;

  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'dnd_helper_character_v3';
const ROLLS_STORAGE_KEY = 'dnd_helper_rolls_v1';
const THEME_STORAGE_KEY = 'dnd_helper_theme';

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {
      console.error('Failed to load theme', e);
    }
    return 'dark';
  });

  const [character, setCharacter] = useState<Character>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.notesList) {
          parsed.notesList = DEFAULT_CHARACTER.notesList || [];
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load character from storage', e);
    }
    return DEFAULT_CHARACTER;
  });

  const [rollHistory, setRollHistory] = useState<RollResult[]>(() => {
    try {
      const saved = localStorage.getItem(ROLLS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load roll history', e);
    }
    return [];
  });

  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [isDiceDrawerOpen, setIsDiceDrawerOpen] = useState(false);

  // Apply theme to HTML root & sync
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#090d16' : '#f0f4f8');
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }, [theme]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    } catch (e) {
      console.error('Failed to save character', e);
    }
  }, [character]);

  useEffect(() => {
    try {
      localStorage.setItem(ROLLS_STORAGE_KEY, JSON.stringify(rollHistory.slice(0, 30)));
    } catch (e) {
      console.error('Failed to save rolls', e);
    }
  }, [rollHistory]);

  const updateCharacter = (updater: (prev: Character) => Character) => {
    setCharacter(prev => updater(prev));
  };

  const setHp = (current: number, temp?: number) => {
    setCharacter(prev => ({
      ...prev,
      hp: {
        ...prev.hp,
        current: Math.max(0, Math.min(prev.hp.max, current)),
        temp: temp !== undefined ? Math.max(0, temp) : prev.hp.temp
      }
    }));
  };

  const applyDamage = (amount: number) => {
    if (amount <= 0) return;
    setCharacter(prev => {
      let remainingDamage = amount;
      let newTemp = prev.hp.temp;
      let newCurrent = prev.hp.current;

      if (newTemp > 0) {
        if (remainingDamage <= newTemp) {
          newTemp -= remainingDamage;
          remainingDamage = 0;
        } else {
          remainingDamage -= newTemp;
          newTemp = 0;
        }
      }

      newCurrent = Math.max(0, newCurrent - remainingDamage);

      return {
        ...prev,
        hp: {
          ...prev.hp,
          current: newCurrent,
          temp: newTemp
        }
      };
    });
  };

  const applyHeal = (amount: number) => {
    if (amount <= 0) return;
    setCharacter(prev => ({
      ...prev,
      hp: {
        ...prev.hp,
        current: Math.min(prev.hp.max, prev.hp.current + amount)
      }
    }));
  };

  const toggleCondition = (conditionName: string) => {
    setCharacter(prev => {
      const exists = prev.activeConditions.includes(conditionName);
      return {
        ...prev,
        activeConditions: exists
          ? prev.activeConditions.filter(c => c !== conditionName)
          : [...prev.activeConditions, conditionName]
      };
    });
  };

  const useSpecialResource = (resourceId: string, amount = 1) => {
    setCharacter(prev => ({
      ...prev,
      specialResources: prev.specialResources.map(res => {
        if (res.id === resourceId) {
          return { ...res, current: Math.max(0, res.current - amount) };
        }
        return res;
      })
    }));
  };

  const restoreSpecialResource = (resourceId: string, amount = 1) => {
    setCharacter(prev => ({
      ...prev,
      specialResources: prev.specialResources.map(res => {
        if (res.id === resourceId) {
          return { ...res, current: Math.min(res.max, res.current + amount) };
        }
        return res;
      })
    }));
  };

  const toggleSpecialMechanic = (mechanicId: string) => {
    setCharacter(prev => ({
      ...prev,
      specialMechanics: prev.specialMechanics.map(m => {
        if (m.id === mechanicId) {
          return { ...m, active: !m.active };
        }
        return m;
      })
    }));
  };

  const spendSpellSlot = (level: number) => {
    setCharacter(prev => {
      const slot = prev.spellSlots[level];
      if (!slot || slot.expended >= slot.total) return prev;
      return {
        ...prev,
        spellSlots: {
          ...prev.spellSlots,
          [level]: { ...slot, expended: slot.expended + 1 }
        }
      };
    });
  };

  const restoreSpellSlot = (level: number) => {
    setCharacter(prev => {
      const slot = prev.spellSlots[level];
      if (!slot || slot.expended <= 0) return prev;
      return {
        ...prev,
        spellSlots: {
          ...prev.spellSlots,
          [level]: { ...slot, expended: slot.expended - 1 }
        }
      };
    });
  };

  const performShortRest = (hitDiceToSpend: number, conMod: number) => {
    setCharacter(prev => {
      const availableDice = prev.hitDice.current;
      const diceUsed = Math.min(availableDice, Math.max(0, hitDiceToSpend));
      
      let healedHp = 0;
      for (let i = 0; i < diceUsed; i++) {
        const dieVal = Math.floor(Math.random() * 8) + 1;
        healedHp += Math.max(1, dieVal + conMod);
      }

      // Reset short rest resources
      const refreshedResources = prev.specialResources.map(r => 
        r.resetOn === 'shortRest' ? { ...r, current: r.max } : r
      );

      // Warlock pact slots recover on short rest
      const refreshedSlots = { ...prev.spellSlots };
      Object.keys(refreshedSlots).forEach(key => {
        const lvl = Number(key);
        if (refreshedSlots[lvl].total > 0) {
          refreshedSlots[lvl] = { ...refreshedSlots[lvl], expended: 0 };
        }
      });

      return {
        ...prev,
        hp: {
          ...prev.hp,
          current: Math.min(prev.hp.max, prev.hp.current + healedHp)
        },
        hitDice: {
          ...prev.hitDice,
          current: prev.hitDice.current - diceUsed
        },
        specialResources: refreshedResources,
        spellSlots: refreshedSlots
      };
    });
  };

  const performLongRest = () => {
    setCharacter(prev => {
      const maxDice = prev.hitDice.total;
      const diceToRecover = Math.max(1, Math.floor(maxDice / 2));
      const newHitDice = Math.min(maxDice, prev.hitDice.current + diceToRecover);

      const refreshedResources = prev.specialResources.map(r => ({ ...r, current: r.max }));

      const refreshedSlots: Record<number, any> = {};
      Object.entries(prev.spellSlots).forEach(([lvl, slot]) => {
        refreshedSlots[Number(lvl)] = { ...slot, expended: 0 };
      });

      return {
        ...prev,
        hp: {
          ...prev.hp,
          current: prev.hp.max,
          temp: 0
        },
        hitDice: {
          ...prev.hitDice,
          current: newHitDice
        },
        deathSaves: {
          successes: 0,
          failures: 0
        },
        specialResources: refreshedResources,
        spellSlots: refreshedSlots,
        activeConditions: []
      };
    });
  };

  const addItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: 'item_' + Date.now()
    };
    setCharacter(prev => ({
      ...prev,
      inventory: [newItem, ...prev.inventory]
    }));
  };

  const updateItem = (id: string, updated: Partial<InventoryItem>) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === id ? { ...item, ...updated } : item)
    }));
  };

  const deleteItem = (id: string) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item.id !== id)
    }));
  };

  const toggleEquipItem = (id: string) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => {
        if (item.id === id) {
          return { ...item, equipped: !item.equipped };
        }
        return item;
      })
    }));
  };

  const toggleAttuneItem = (id: string) => {
    setCharacter(prev => {
      const target = prev.inventory.find(i => i.id === id);
      if (!target) return prev;
      
      const isAttuning = !target.attuned;
      const currentAttunedCount = prev.inventory.filter(i => i.attuned && i.id !== id).length;
      
      if (isAttuning && currentAttunedCount >= 3) {
        alert('Максимум 3 налаштованих предмети одночасно! (5e Attunement limit)');
        return prev;
      }

      return {
        ...prev,
        inventory: prev.inventory.map(item => 
          item.id === id ? { ...item, attuned: isAttuning } : item
        )
      };
    });
  };

  const toggleFavoriteFeature = (featureId: string) => {
    setCharacter(prev => {
      const favorites = prev.favoriteFeatureIds || [];
      const exists = favorites.includes(featureId);
      return {
        ...prev,
        favoriteFeatureIds: exists
          ? favorites.filter(id => id !== featureId)
          : [...favorites, featureId]
      };
    });
  };

  const addNote = (note: { title: string; content: string; category?: string; isPinned?: boolean }) => {
    const newNote: NoteBlock = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: note.title.trim() || 'Без назви',
      content: note.content,
      category: note.category || 'general',
      createdAt: Date.now(),
      isPinned: note.isPinned ?? false
    };
    setCharacter(prev => ({
      ...prev,
      notesList: [newNote, ...(prev.notesList || [])]
    }));
  };

  const updateNote = (id: string, updated: Partial<NoteBlock>) => {
    setCharacter(prev => ({
      ...prev,
      notesList: (prev.notesList || []).map(note =>
        note.id === id ? { ...note, ...updated, updatedAt: Date.now() } : note
      )
    }));
  };

  const deleteNote = (id: string) => {
    setCharacter(prev => ({
      ...prev,
      notesList: (prev.notesList || []).filter(note => note.id !== id)
    }));
  };

  const togglePinNote = (id: string) => {
    setCharacter(prev => ({
      ...prev,
      notesList: (prev.notesList || []).map(note =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    }));
  };

  const exportCharacterJson = (): string => {
    return JSON.stringify(character, null, 2);
  };

  const importCharacterJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.name && parsed.abilities) {
        if (!parsed.notesList) {
          parsed.notesList = DEFAULT_CHARACTER.notesList || [];
        }
        setCharacter(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  };

  const resetToDefault = () => {
    setCharacter(DEFAULT_CHARACTER);
  };

  const triggerRoll = (
    diceCount: number,
    sides: number,
    modifier = 0,
    label = 'Custom Roll',
    advantageMode: 'normal' | 'advantage' | 'disadvantage' = 'normal'
  ): RollResult => {
    const res = executeRoll(diceCount, sides, modifier, label, advantageMode);
    setLastRoll(res);
    setRollHistory(prev => [res, ...prev.slice(0, 49)]);
    setIsDiceDrawerOpen(true);
    return res;
  };

  const clearRollHistory = () => {
    setRollHistory([]);
    setLastRoll(null);
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        updateCharacter,
        setHp,
        applyDamage,
        applyHeal,
        toggleCondition,
        useSpecialResource,
        restoreSpecialResource,
        toggleSpecialMechanic,
        spendSpellSlot,
        restoreSpellSlot,
        performShortRest,
        performLongRest,
        addItem,
        updateItem,
        deleteItem,
        toggleEquipItem,
        toggleAttuneItem,
        toggleFavoriteFeature,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        exportCharacterJson,
        importCharacterJson,
        resetToDefault,
        rollHistory,
        lastRoll,
        triggerRoll,
        clearRollHistory,
        isDiceDrawerOpen,
        setIsDiceDrawerOpen,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
