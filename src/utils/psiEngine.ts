import type { Character } from '../types/character';
import type { PsiMood, PsiSkillRollOutcome } from '../types/psiMechanics';
import { calculateModifier, rollDie } from './dndUtils';

export const MOOD_CYCLE: PsiMood[] = ['yellow', 'blue_1', 'black', 'blue_2'];

export function getNextMoodInCycle(current: PsiMood): PsiMood {
  const idx = MOOD_CYCLE.indexOf(current);
  return MOOD_CYCLE[(idx + 1) % MOOD_CYCLE.length];
}

export function getEffectiveMoodColor(mood: PsiMood, blackPillActive: boolean): 'yellow' | 'blue' | 'black' {
  if (blackPillActive) return 'black';
  if (mood === 'yellow') return 'yellow';
  if (mood === 'black') return 'black';
  return 'blue';
}

export function executePsiSkill(
  skillId: 'protective_field' | 'psionic_strike' | 'telekinetic_movement',
  char: Character,
  currentMood: PsiMood,
  blackPillActive: boolean,
  forcedD6?: number,
  forcedD20?: number
): PsiSkillRollOutcome {
  const effMood = getEffectiveMoodColor(currentMood, blackPillActive);
  const intScore = char.abilities.INT?.score || 16;
  const intMod = calculateModifier(intScore);
  const level = char.level || 8;

  const d6 = forcedD6 !== undefined ? forcedD6 : rollDie(6);
  let nextMood = getNextMoodInCycle(currentMood);
  let psiDieExpended = true;

  // -------------------------------------------------------------
  // 1. PROTECTIVE FIELD (Захисне поле)
  // -------------------------------------------------------------
  if (skillId === 'protective_field') {
    if (effMood === 'yellow') {
      const shieldVal = d6;
      const casterHeal = d6;
      const isSix = d6 === 6;

      return {
        skillId,
        skillName: 'Захисне поле (Protective Field)',
        moodUsed: 'yellow',
        d6Roll: d6,
        effectTitle: `💛 Жовтий: +${shieldVal} до щита/хіла цілі та +${casterHeal} хіла собі!`,
        effectDescription: `Додає +${shieldVal} до захисту та відновлення цілі, і лікує Крисарія на ${casterHeal} HP (включно з Temp HP).` +
          (isSix ? '\n🌟 d6 = 6! Реакцію можна застосувати ще раз у цьому ж раунді!' : ''),
        healing: casterHeal,
        psiDieExpended,
        nextMood
      };
    }

    // Blue Mood
    if (effMood === 'blue') {
      const d20 = forcedD20 !== undefined ? forcedD20 : rollDie(20);

      if (d20 === 1) {
        return {
          skillId,
          skillName: 'Захисне поле (Protective Field)',
          moodUsed: 'blue',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `💙 Синій (d20 = 1): Тільки бонус Інтелекту (+${Math.max(1, intMod)})`,
          effectDescription: `Ціль не отримує бонусів від кубиків, лише модифікатор Інтелекту: +${Math.max(1, intMod)} до захисту.`,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 2 && d20 <= 10) {
        return {
          skillId,
          skillName: 'Захисне поле (Protective Field)',
          moodUsed: 'blue',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `💙 Синій (d20 = ${d20}): +${d6} щит цілі, але -${d6} HP кастеру!`,
          effectDescription: `Ціль отримує +${d6} щита/лікування. Крисарій втрачає ${d6} HP (залишає щонайменше 1 HP).`,
          selfDamage: d6,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 11 && d20 <= 19) {
        const bonusTotal = d6 + level;
        return {
          skillId,
          skillName: 'Захисне поле (Protective Field)',
          moodUsed: 'blue',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `💙 Синій (d20 = ${d20}): +${bonusTotal} щит (d6 + рівень ${level})!`,
          effectDescription: `Використовує додатковий псі-дайс: додає +${bonusTotal} (+${d6} + ${level}) до щита/відхілу цілі.`,
          psiDieExpended: true,
          nextMood
        };
      }

      // d20 === 20
      const critShield = d6 * 2;
      return {
        skillId,
        skillName: 'Захисне поле (Protective Field)',
        moodUsed: 'blue',
        d6Roll: d6,
        d20Roll: d20,
        effectTitle: `💙 Синій (d20 = 20): +${critShield} щит (d6 x 2) + ланцюговий відхіл!`,
        effectDescription: `+${critShield} до щита/відхілу цілі. Можна застосувати такий самий відхіл (+${critShield}) на ще одну будь-яку ціль у радіусі!`,
        psiDieExpended,
        nextMood
      };
    }

    // Black Mood
    if (effMood === 'black') {
      const d20 = forcedD20 !== undefined ? forcedD20 : rollDie(20);

      if (d20 === 1) {
        const reductionVal = Math.max(d6 * 2, d6 * 2 * intMod);
        return {
          skillId,
          skillName: 'Захисне поле (Protective Field)',
          moodUsed: 'black',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `🖤 Чорний (d20 = 1): Зменшення щита на ${reductionVal} (2d6 * INT)!`,
          effectDescription: `Щит зменшується на ${reductionVal}. Якщо значення більше за значення щита — ціль отримує шкоду, рівну різниці!`,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 2 && d20 <= 13) {
        const addedShield = Math.max(d6, d6 * intMod);
        const selfCost = addedShield + d6 + intMod;
        return {
          skillId,
          skillName: 'Захисне поле (Protective Field)',
          moodUsed: 'black',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `🖤 Чорний (d20 = ${d20}): +${addedShield} щит цілі, АЛЕ -${selfCost} HP кастеру!`,
          effectDescription: `Ціль отримує +${addedShield} щита/відхілу, але Крисарій втрачає ${selfCost} HP (може бути смертельно!).`,
          selfDamage: selfCost,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 14 && d20 <= 19) {
        const extraSplash = d6 + intMod;
        return {
          skillId,
          skillName: 'Захисне поле (Protective Field)',
          moodUsed: 'black',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `🖤 Чорний (d20 = ${d20}): +${d6} щит та +${extraSplash} другій цілі!`,
          effectDescription: `+${d6} щит цілі, а також +${extraSplash} (d6+INT) ще одній цілі в радіусі (включно з Крисарієм).`,
          psiDieExpended,
          nextMood
        };
      }

      // d20 === 20
      const aoeHeal = d6 + d6 + intMod;
      return {
        skillId,
        skillName: 'Захисне поле (Protective Field)',
        moodUsed: 'black',
        d6Roll: d6,
        d20Roll: d20,
        effectTitle: `🖤 Чорний (d20 = 20): ПОВНЕ БЛОКУВАННЯ та оверхіл +${aoeHeal} усім!`,
        effectDescription: `Повністю блокує всю шкоду цілі! Також відхілює (з оверхілом) усіх союзників у радіусі на ${aoeHeal} HP (d6 + psi die + INT mod).`,
        healing: aoeHeal,
        psiDieExpended,
        nextMood
      };
    }
  }

  // -------------------------------------------------------------
  // 2. PSIONIC STRIKE (Псіонічний удар)
  // -------------------------------------------------------------
  if (skillId === 'psionic_strike') {
    if (effMood === 'yellow') {
      let dmg = 0;
      if (d6 === 1) dmg = 1;
      else if (d6 >= 2 && d6 <= 5) dmg = d6 + intMod;
      else dmg = Math.max(6, 6 * intMod);

      return {
        skillId,
        skillName: 'Псіонічний удар (Psionic Strike)',
        moodUsed: 'yellow',
        d6Roll: d6,
        damage: dmg,
        effectTitle: `💛 Жовтий (d6 = ${d6}): +${dmg} силової шкоди!`,
        effectDescription: d6 === 1 
          ? '+1 додаткова силова шкода (Force damage).' 
          : d6 === 6 
          ? `+${dmg} максимізованої силової шкоди (6 * INT)!` 
          : `+${dmg} силової шкоди (d6=${d6} + INT=${intMod}).`,
        psiDieExpended,
        nextMood
      };
    }

    // Blue Mood
    if (effMood === 'blue') {
      const d20 = forcedD20 !== undefined ? forcedD20 : rollDie(20);

      if (d20 === 1) {
        const pen = Math.max(1, d6 + intMod);
        return {
          skillId,
          skillName: 'Псіонічний удар (Psionic Strike)',
          moodUsed: 'blue',
          d6Roll: d6,
          d20Roll: d20,
          effectTitle: `💙 Синій (d20 = 1): Шкода атаки ЗМЕНШУЄТЬСЯ на -${pen}!`,
          effectDescription: `Шкода від атаки зменшується на ${pen} (d6 + INT mod).`,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 2 && d20 <= 10) {
        return {
          skillId,
          skillName: 'Псіонічний удар (Psionic Strike)',
          moodUsed: 'blue',
          d6Roll: d6,
          d20Roll: d20,
          damage: d6,
          effectTitle: `💙 Синій (d20 = ${d20}): +${d6} шкоди цілі, жертва 6 HP!`,
          effectDescription: `+${d6} шкоди до атаки. Потрібно забрати 6 HP у будь-кого в 60 фт (або кастер отримує 6 шкоди, залишаючи мін 1 HP). Можна розділити на 6 таргетів.`,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 11 && d20 <= 19) {
        const healAmt = d6 + intMod;
        return {
          skillId,
          skillName: 'Псіонічний удар (Psionic Strike)',
          moodUsed: 'blue',
          d6Roll: d6,
          d20Roll: d20,
          damage: d6,
          healing: healAmt,
          effectTitle: `💙 Синій (d20 = ${d20}): +${d6} шкоди та +${healAmt} оверхіл кастеру!`,
          effectDescription: `+${d6} силової шкоди цілі та лікування Крисарія на ${healAmt} HP (d6 + INT mod з оверхілом).`,
          psiDieExpended,
          nextMood
        };
      }

      // d20 === 20
      const critDmg = d6 * 2;
      return {
        skillId,
        skillName: 'Псіонічний удар (Psionic Strike)',
        moodUsed: 'blue',
        d6Roll: d6,
        d20Roll: d20,
        damage: critDmg,
        effectTitle: `💙 Синій (d20 = 20): +${critDmg} шкоди та вибір наступної фази!`,
        effectDescription: `+${critDmg} (d6 x 2) силової шкоди. Крисарій може вільно обрати будь-яку наступну фазу настрою!`,
        psiDieExpended,
        nextMood
      };
    }

    // Black Mood
    if (effMood === 'black') {
      const d20 = forcedD20 !== undefined ? forcedD20 : rollDie(20);

      if (d20 === 1) {
        const selfCost = Math.max(1, d6 + intMod * 2) + level;
        const targetDmg = selfCost * 2;
        return {
          skillId,
          skillName: 'Псіонічний удар (Psionic Strike)',
          moodUsed: 'black',
          d6Roll: d6,
          d20Roll: d20,
          damage: targetDmg,
          selfDamage: selfCost,
          effectTitle: `🖤 Чорний (d20 = 1): +${targetDmg} шкоди ворогу, але -${selfCost} HP кастеру!`,
          effectDescription: `Ціль отримує ${targetDmg} шкоди першою, після чого Крисарій отримує ${selfCost} шкоди (може бути смертельно!).`,
          psiDieExpended,
          nextMood
        };
      }

      if (d20 >= 2 && d20 <= 13) {
        const selfPen = Math.ceil(d6 / 2);
        return {
          skillId,
          skillName: 'Псіонічний удар (Psionic Strike)',
          moodUsed: 'black',
          d6Roll: d6,
          d20Roll: d20,
          damage: d6,
          selfDamage: selfPen,
          effectTitle: `🖤 Чорний (d20 = ${d20}): +${d6} шкоди цілі, -${selfPen} HP кастеру (фаза залишається чорною!)`,
          effectDescription: `+${d6} шкоди до атаки і ${selfPen} (ceil(d6/2)) шкоди кастеру. Наступна фаза залишається Чорною!`,
          psiDieExpended,
          nextMood: 'black' // phase remains black!
        };
      }

      if (d20 >= 14 && d20 <= 19) {
        const bonusDmg = d6 * 2;
        return {
          skillId,
          skillName: 'Псіонічний удар (Psionic Strike)',
          moodUsed: 'black',
          d6Roll: d6,
          d20Roll: d20,
          damage: bonusDmg,
          effectTitle: `🖤 Чорний (d20 = ${d20}): +${bonusDmg} шкоди, ПСІ-ДАЙС НЕ ВИТРАЧАЄТЬСЯ!`,
          effectDescription: `+${bonusDmg} (d6 x 2) силової шкоди. Псіонічний дайс збережено!`,
          psiDieExpended: false,
          nextMood
        };
      }

      // d20 === 20
      const godDmg = Math.max(1, d6 + intMod * 2) + level;
      return {
        skillId,
        skillName: 'Псіонічний удар (Psionic Strike)',
        moodUsed: 'black',
        d6Roll: d6,
        d20Roll: d20,
        damage: godDmg,
        extraAttackGranted: true,
        effectTitle: `🖤 Чорний (d20 = 20): +${godDmg} шкоди та ДОДАТКОВА ДІЯ АТАКИ!`,
        effectDescription: `+${godDmg} силової шкоди! Крисарій отримує можливість здійснити ще одну повну дію Атака (Action) у цей хід!`,
        psiDieExpended,
        nextMood
      };
    }
  }

  // -------------------------------------------------------------
  // 3. TELEKINETIC MOVEMENT (Телекінетичний рух)
  // -------------------------------------------------------------
  if (skillId === 'telekinetic_movement') {
    if (effMood === 'yellow') {
      const freeAction = d6 >= 5;
      return {
        skillId,
        skillName: 'Телекінетичний рух (Telekinetic Movement)',
        moodUsed: 'yellow',
        d6Roll: d6,
        effectTitle: `💛 Жовтий (d6 = ${d6}): ${freeAction ? 'БЕЗКОШТОВНА ДІЯ (Free Action)!' : 'Звичайна дія'}`,
        effectDescription: freeAction 
          ? 'd6 = 5-6: Телекінетичний рух не коштує дію (Free Action)!' 
          : 'Телекінетичний рух виконано за звичайну дію (Action).',
        psiDieExpended,
        nextMood
      };
    }

    if (effMood === 'blue') {
      const failed = d6 === 1;
      const freeAction = d6 === 6;

      return {
        skillId,
        skillName: 'Телекінетичний рух (Telekinetic Movement)',
        moodUsed: 'blue',
        d6Roll: d6,
        effectTitle: `💙 Синій (d6 = ${d6}): ${failed ? '❌ ПРОВАЛ ДІЇ!' : freeAction ? '🌟 БЕЗКОШТОВНА ДІЯ!' : 'Звичайна дія'}`,
        effectDescription: failed 
          ? 'd6 = 1: Дія провалена!' 
          : freeAction 
          ? 'd6 = 6: Телекінетичний рух не коштує дію!' 
          : 'Телекінетичний рух виконано успішно.',
        psiDieExpended,
        nextMood
      };
    }

    // Black Mood
    if (effMood === 'black') {
      if (d6 <= 2) {
        return {
          skillId,
          skillName: 'Телекінетичний рух (Telekinetic Movement)',
          moodUsed: 'black',
          d6Roll: d6,
          effectTitle: `🖤 Чорний (d6 = ${d6}): Потрібно +1 псі-дайс або дія провалена!`,
          effectDescription: 'Дія виконується тільки за умови витрати ще одного псі-дайсу, інакше скасовується.',
          psiDieExpended: true,
          nextMood
        };
      }

      if (d6 === 3 || d6 === 4) {
        return {
          skillId,
          skillName: 'Телекінетичний рух (Telekinetic Movement)',
          moodUsed: 'black',
          d6Roll: d6,
          selfDamage: d6,
          effectTitle: `🖤 Чорний (d6 = ${d6}): Виконується, але кастер отримує -${d6} HP шкоди!`,
          effectDescription: `Рух виконано, Крисарій отримує ${d6} шкоди (не може вбити кастера).`,
          psiDieExpended,
          nextMood
        };
      }

      if (d6 === 5) {
        return {
          skillId,
          skillName: 'Телекінетичний рух (Telekinetic Movement)',
          moodUsed: 'black',
          d6Roll: d6,
          effectTitle: '🖤 Чорний (d6 = 5): Звичайне виконання',
          effectDescription: 'Телекінетичний рух виконано успішно.',
          psiDieExpended,
          nextMood
        };
      }

      // d6 === 6
      const forceDC = 8 + Math.ceil(level / 2) + intMod;
      return {
        skillId,
        skillName: 'Телекінетичний рух (Telekinetic Movement)',
        moodUsed: 'black',
        d6Roll: d6,
        dc: forceDC,
        effectTitle: `🖤 Чорний (d6 = 6): ПРИМУСОВИЙ РУХ ВОРОГА (DC ${forceDC})!`,
        effectDescription: `Телекінетичний рух можна застосувати на небажану ворожу ціль! Спас кидок цілі DC = ${forceDC} (8 + ceil(Lvl/2) + INT mod).`,
        psiDieExpended,
        nextMood
      };
    }
  }

  return {
    skillId,
    skillName: 'Psi Skill',
    moodUsed: effMood,
    d6Roll: d6,
    effectTitle: 'Виконано',
    effectDescription: 'Успіх',
    psiDieExpended,
    nextMood
  };
}
