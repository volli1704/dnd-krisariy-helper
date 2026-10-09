import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import type { 
  PsiMood, 
  PsiState, 
  PsiSkillRollOutcome 
} from '../types/psiMechanics';
import { 
  executePsiSkill, 
  getNextMoodInCycle, 
  getEffectiveMoodColor 
} from '../utils/psiEngine';
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Move, 
  Pill, 
  AlertTriangle, 
  RotateCw, 
  Star,
  Dices,
  Hand,
  X,
  Check
} from 'lucide-react';

export const PsiMechanicsPanel: React.FC = () => {
  const { character, applyDamage, applyHeal } = useCharacter();

  const [psiState, setPsiState] = useState<PsiState>(() => {
    try {
      const saved = localStorage.getItem('dnd_krysarii_psi_state_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      currentMood: 'yellow',
      diceCurrent: 6, // 2 * PB = 6 at level 8
      diceMax: 6,
      dieType: 'd6',
      blackPillUsedToday: false,
      blackPillActive: false,
      whitePillsUsedToday: 0
    };
  });

  const [lastOutcome, setLastOutcome] = useState<PsiSkillRollOutcome | null>(null);

  // Manual Dice Input Modal State
  const [manualModalSkill, setManualModalSkill] = useState<'protective_field' | 'psionic_strike' | 'telekinetic_movement' | null>(null);
  const [manualD6, setManualD6] = useState<number>(4);
  const [manualD20, setManualD20] = useState<number>(12);

  const savePsiState = (newState: PsiState) => {
    setPsiState(newState);
    try {
      localStorage.setItem('dnd_krysarii_psi_state_v1', JSON.stringify(newState));
    } catch (e) {
      console.error(e);
    }
  };

  const effectiveMoodColor = getEffectiveMoodColor(psiState.currentMood, psiState.blackPillActive);

  const processOutcome = (outcome: PsiSkillRollOutcome) => {
    setLastOutcome(outcome);

    // Apply HP side-effects automatically if any
    if (outcome.selfDamage && outcome.selfDamage > 0) {
      applyDamage(outcome.selfDamage);
    }
    if (outcome.healing && outcome.healing > 0) {
      applyHeal(outcome.healing);
    }

    // Update Psi state: spend die & update mood
    const newDice = outcome.psiDieExpended 
      ? Math.max(0, psiState.diceCurrent - 1) 
      : psiState.diceCurrent;

    savePsiState({
      ...psiState,
      diceCurrent: newDice,
      currentMood: outcome.nextMood
    });
  };

  const handleAutoUseSkill = (skillId: 'protective_field' | 'psionic_strike' | 'telekinetic_movement') => {
    if (psiState.diceCurrent <= 0) {
      alert('Усі псіонічні кубики (d6) витрачено! Потрібен відпочинок.');
      return;
    }

    const outcome = executePsiSkill(
      skillId,
      character,
      psiState.currentMood,
      psiState.blackPillActive
    );

    processOutcome(outcome);
  };

  const handleOpenManualModal = (skillId: 'protective_field' | 'psionic_strike' | 'telekinetic_movement') => {
    if (psiState.diceCurrent <= 0) {
      alert('Усі псіонічні кубики (d6) витрачено! Потрібен відпочинок.');
      return;
    }
    setManualModalSkill(skillId);
  };

  const handleConfirmManualRoll = () => {
    if (!manualModalSkill) return;

    const outcome = executePsiSkill(
      manualModalSkill,
      character,
      psiState.currentMood,
      psiState.blackPillActive,
      manualD6,
      manualD20
    );

    processOutcome(outcome);
    setManualModalSkill(null);
  };

  const handleBlackPill = () => {
    if (psiState.blackPillUsedToday && !psiState.blackPillActive) {
      alert('Чорну пігулку вже було використано сьогодні! (1 раз на довгий відпочинок)');
      return;
    }

    const nextActive = !psiState.blackPillActive;
    savePsiState({
      ...psiState,
      blackPillActive: nextActive,
      blackPillUsedToday: true
    });
  };

  const handleWhitePill = () => {
    const nextCount = psiState.whitePillsUsedToday + 1;
    const nextMood = getNextMoodInCycle(psiState.currentMood);

    // If 6 or more pills: instant damage = half max hp
    if (nextCount >= 6) {
      const halfHp = Math.floor(character.hp.max / 2);
      applyDamage(halfHp);
      alert(`⚠️ ПЕРЕДОЗУВАННЯ (6+ пігулок)! Отримано ${halfHp} шкоди (50% Max HP)! Якщо HP = 0, персонаж впадає в кому.`);
    }

    savePsiState({
      ...psiState,
      whitePillsUsedToday: nextCount,
      currentMood: nextMood
    });
  };

  const handleManualMoodSelect = (mood: PsiMood) => {
    savePsiState({
      ...psiState,
      currentMood: mood
    });
  };

  const handleResetPsiDay = () => {
    savePsiState({
      ...psiState,
      diceCurrent: psiState.diceMax,
      currentMood: 'yellow',
      blackPillActive: false,
      blackPillUsedToday: false,
      whitePillsUsedToday: 0
    });
    setLastOutcome(null);
  };

  return (
    <section className="dashboard-card psi-warrior-master-card animate-fadeIn">
      {/* 1. Header & Dice Counter */}
      <div className="card-header">
        <div className="card-title-group">
          <Sparkles size={20} className="text-purple" />
          <div>
            <h2 className="card-title">Псіонічна механіка настрою Крисарія</h2>
            <p className="card-subtitle">Цикл емоцій та унікальні псі-кубики (d6)</p>
          </div>
        </div>

        <div className="psi-dice-badge-group">
          <span className="psi-dice-title">Псі-дайси (d6):</span>
          <span className="psi-dice-val">{psiState.diceCurrent} / {psiState.diceMax}</span>
        </div>
      </div>

      {/* 2. Interactive Mood Compass / Wheel */}
      <div className="mood-wheel-container">
        <div className="mood-nodes-box">
          {/* Top Row: Blue 1 & Black */}
          <div className="mood-row top">
            <button 
              className={`mood-node-btn blue ${psiState.currentMood === 'blue_1' ? 'active' : ''}`}
              onClick={() => handleManualMoodSelect('blue_1')}
            >
              <Star size={18} className="star-icon blue-star" />
              <span className="mood-node-label">Синій (Нейтралітет)</span>
            </button>

            <div className="mood-arrow-horizontal">➔</div>

            <button 
              className={`mood-node-btn black ${psiState.currentMood === 'black' ? 'active' : ''}`}
              onClick={() => handleManualMoodSelect('black')}
            >
              <Star size={18} className="star-icon black-star" />
              <span className="mood-node-label">Чорний (Напруга)</span>
            </button>
          </div>

          {/* Vertical Arrows */}
          <div className="mood-row middle-arrows">
            <div className="mood-arrow-vertical up">▲</div>
            <div className="mood-arrow-vertical down">▼</div>
          </div>

          {/* Bottom Row: Yellow & Blue 2 */}
          <div className="mood-row bottom">
            <button 
              className={`mood-node-btn yellow ${psiState.currentMood === 'yellow' ? 'active' : ''}`}
              onClick={() => handleManualMoodSelect('yellow')}
            >
              <Star size={18} className="star-icon yellow-star" />
              <span className="mood-node-label">Жовтий (Спокій/Радість)</span>
            </button>

            <div className="mood-arrow-horizontal left">➔</div>

            <button 
              className={`mood-node-btn blue ${psiState.currentMood === 'blue_2' ? 'active' : ''}`}
              onClick={() => handleManualMoodSelect('blue_2')}
            >
              <Star size={18} className="star-icon blue-star" />
              <span className="mood-node-label">Синій (Нейтралітет)</span>
            </button>
          </div>
        </div>

        {/* Current Active Mood Banner */}
        <div className={`active-mood-status-banner ${effectiveMoodColor}`}>
          <div className="mood-status-main">
            <span className="mood-status-badge">
              {effectiveMoodColor === 'yellow' && '💛 ПОТОЧНИЙ НАСТРІЙ: ЖОВТИЙ (Спокій & Радість)'}
              {effectiveMoodColor === 'blue' && '💙 ПОТОЧНИЙ НАСТРІЙ: СИНІЙ (Нейтралітет)'}
              {effectiveMoodColor === 'black' && '🖤 ПОТОЧНИЙ НАСТРІЙ: ЧОРНИЙ (Напружений стан)'}
            </span>
            {psiState.blackPillActive && (
              <span className="panic-alert-pill">⚠️ ПРИСТУП ПАНІКИ АКТИВНИЙ! (Всі ефекти Чорні)</span>
            )}
          </div>
          <p className="mood-status-subtext">
            Кидайте кубики прямо в додатку або вводьте результат реальних кубиків з рук!
          </p>
        </div>
      </div>

      {/* 3. Consumables: Black Pill & White Pill */}
      <div className="psi-pills-bar">
        <button 
          className={`pill-btn black-pill ${psiState.blackPillActive ? 'active' : ''}`}
          onClick={handleBlackPill}
          title="Чорна пігулка: 1 хв приступ паніки (всі ефекти чорні, 1 раз на довгий відпочинок)"
        >
          <Pill size={16} />
          <div className="pill-btn-content">
            <span className="pill-name">Чорна пігулка</span>
            <span className="pill-state">
              {psiState.blackPillActive ? 'Активна (Паніка)' : psiState.blackPillUsedToday ? 'Використано' : '1 дія (Паніка)'}
            </span>
          </div>
        </button>

        <button 
          className="pill-btn white-pill"
          onClick={handleWhitePill}
          title="Біла пігулка: Пропустити 1 фазу настрою"
        >
          <Pill size={16} />
          <div className="pill-btn-content">
            <span className="pill-name">Біла пігулка (x{psiState.whitePillsUsedToday})</span>
            <span className="pill-state">Пропустити фазу</span>
          </div>
        </button>

        <button 
          className="psi-reset-btn"
          onClick={handleResetPsiDay}
          title="Відновити псі-дайси та скинути пігулки (Довгий відпочинок)"
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Pill Side-Effects Warning */}
      {psiState.whitePillsUsedToday > 2 && (
        <div className="pill-warning-box animate-pulse">
          <AlertTriangle size={15} />
          <div>
            <strong>Побічний ефект білих пігулок ({psiState.whitePillsUsedToday} шт):</strong>
            {psiState.whitePillsUsedToday >= 4 ? (
              <span> Всі кидки d20 робляться з ПЕРЕШКОДОЮ до кінця дня!</span>
            ) : (
              <span> Всі спас-кидки робляться з ПЕРЕШКОДОЮ до кінця дня!</span>
            )}
          </div>
        </div>
      )}

      {/* 4. 3 Psi Skills Interactive Execution Buttons */}
      <div className="psi-skills-action-grid">
        {/* Skill 1: Protective Field */}
        <div className="psi-skill-action-card">
          <div className="psi-skill-card-top">
            <div className="skill-icon-name">
              <Shield size={18} className="text-emerald" />
              <div>
                <span className="skill-card-title">Захисне поле (Protective Field)</span>
                <span className="skill-action-cost">Реакція • 30 фт</span>
              </div>
            </div>
          </div>
          <p className="psi-skill-quick-desc">
            {effectiveMoodColor === 'yellow' && '💛 d6: +d6 до щита/хіла цілі та хіл собі (d6=6 дає ще реакцію).'}
            {effectiveMoodColor === 'blue' && '💙 d6 + d20: захист цілі з ризиком втрати HP або оверхілом на 20.'}
            {effectiveMoodColor === 'black' && '🖤 d6 + d20: небезпечні темні енергії з можливістю повного блоку на 20.'}
          </p>
          <div className="skill-action-buttons-dual">
            <button 
              className="btn-trigger-psi-skill protective"
              onClick={() => handleAutoUseSkill('protective_field')}
              title="Автоматичний кидок у додатку"
            >
              <Dices size={15} /> Авто-кидок
            </button>
            <button 
              className="btn-trigger-psi-skill manual"
              onClick={() => handleOpenManualModal('protective_field')}
              title="Ввести результат свого кидка кубика руками"
            >
              <Hand size={15} /> Ввести кубики
            </button>
          </div>
        </div>

        {/* Skill 2: Psionic Strike */}
        <div className="psi-skill-action-card">
          <div className="psi-skill-card-top">
            <div className="skill-icon-name">
              <Zap size={18} className="text-purple" />
              <div>
                <span className="skill-card-title">Псіонічний удар (Psionic Strike)</span>
                <span className="skill-action-cost">1 раз за хід при влучанні</span>
              </div>
            </div>
          </div>
          <p className="psi-skill-quick-desc">
            {effectiveMoodColor === 'yellow' && '💛 d6: +1 / d6+INT / (6 * INT) форс шкоди.'}
            {effectiveMoodColor === 'blue' && '💙 d6 + d20: силова шкода, жертва 6 HP або вибір наступної фази на 20.'}
            {effectiveMoodColor === 'black' && '🖤 d6 + d20: подвійна шкода, самопошкодження та екстра атака на 20.'}
          </p>
          <div className="skill-action-buttons-dual">
            <button 
              className="btn-trigger-psi-skill strike"
              onClick={() => handleAutoUseSkill('psionic_strike')}
              title="Автоматичний кидок у додатку"
            >
              <Dices size={15} /> Авто-кидок
            </button>
            <button 
              className="btn-trigger-psi-skill manual"
              onClick={() => handleOpenManualModal('psionic_strike')}
              title="Ввести результат свого кидка кубика руками"
            >
              <Hand size={15} /> Ввести кубики
            </button>
          </div>
        </div>

        {/* Skill 3: Telekinetic Movement */}
        <div className="psi-skill-action-card">
          <div className="psi-skill-card-top">
            <div className="skill-icon-name">
              <Move size={18} className="text-cyan" />
              <div>
                <span className="skill-card-title">Телекінетичний рух (Telekinetic Movement)</span>
                <span className="skill-action-cost">Дія (або Free action) • 30 фт</span>
              </div>
            </div>
          </div>
          <p className="psi-skill-quick-desc">
            {effectiveMoodColor === 'yellow' && '💛 d6: переміщення предмета/істоти (на 5-6 безкоштовна дія).'}
            {effectiveMoodColor === 'blue' && '💙 d6: ризик провалу на 1, безкоштовна дія на 6.'}
            {effectiveMoodColor === 'black' && '🖤 d6: примусове переміщення ворога на 6 (DC 15)!'}
          </p>
          <div className="skill-action-buttons-dual">
            <button 
              className="btn-trigger-psi-skill move"
              onClick={() => handleAutoUseSkill('telekinetic_movement')}
              title="Автоматичний кидок у додатку"
            >
              <Dices size={15} /> Авто-кидок
            </button>
            <button 
              className="btn-trigger-psi-skill manual"
              onClick={() => handleOpenManualModal('telekinetic_movement')}
              title="Ввести результат свого кидка кубика руками"
            >
              <Hand size={15} /> Ввести кубики
            </button>
          </div>
        </div>
      </div>

      {/* 5. Last Outcome Live Breakdown Card */}
      {lastOutcome && (
        <div className={`psi-outcome-display-card ${lastOutcome.moodUsed} animate-scaleUp`}>
          <div className="outcome-top-bar">
            <span className="outcome-skill-name">🎲 Результат: {lastOutcome.skillName}</span>
            <span className={`outcome-mood-pill ${lastOutcome.moodUsed}`}>
              {lastOutcome.moodUsed === 'yellow' ? 'Жовтий' : lastOutcome.moodUsed === 'blue' ? 'Синій' : 'Чорний'}
            </span>
          </div>

          <div className="outcome-dice-row">
            <span className="dice-chip d6">d6: <strong>{lastOutcome.d6Roll}</strong></span>
            {lastOutcome.d20Roll !== undefined && (
              <span className={`dice-chip d20 ${lastOutcome.d20Roll === 20 ? 'crit' : ''} ${lastOutcome.d20Roll === 1 ? 'fumble' : ''}`}>
                d20: <strong>{lastOutcome.d20Roll}</strong>
              </span>
            )}
            {lastOutcome.damage !== undefined && (
              <span className="dice-chip dmg">Шкода: <strong>+{lastOutcome.damage}</strong></span>
            )}
            {lastOutcome.healing !== undefined && (
              <span className="dice-chip heal">Хіл: <strong>+{lastOutcome.healing} HP</strong></span>
            )}
            {lastOutcome.selfDamage !== undefined && (
              <span className="dice-chip self-dmg">Шкода кастеру: <strong>-{lastOutcome.selfDamage} HP</strong></span>
            )}
          </div>

          <div className="outcome-effect-box">
            <h4 className="outcome-title">{lastOutcome.effectTitle}</h4>
            <p className="outcome-desc">{lastOutcome.effectDescription}</p>
          </div>

          <div className="outcome-footer">
            <span>Наступна фаза циклу: <strong>{lastOutcome.nextMood === 'yellow' ? 'Жовтий 💛' : lastOutcome.nextMood === 'black' ? 'Чорний 🖤' : 'Синій 💙'}</strong></span>
            <span>Псі-дайс: {lastOutcome.psiDieExpended ? 'Витрачено (-1)' : 'Збережено (0)'}</span>
          </div>
        </div>
      )}

      {/* 6. ELEGANT MANUAL DICE INPUT MODAL */}
      {manualModalSkill && (
        <div className="modal-backdrop" onClick={() => setManualModalSkill(null)}>
          <div className="modal-content manual-dice-modal animate-scaleUp" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <Hand size={20} className="text-gold" />
                <h3 className="modal-title">
                  Ручний ввід: {manualModalSkill === 'protective_field' ? 'Захисне поле' : manualModalSkill === 'psionic_strike' ? 'Псі-Удар' : 'Телекінез'}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setManualModalSkill(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="manual-dice-body">
              <div className="manual-mood-reminder">
                <span>Поточний настрій:</span>
                <strong className={`color-tag ${effectiveMoodColor}`}>
                  {effectiveMoodColor === 'yellow' ? 'Жовтий 💛 (потрібен d6)' : effectiveMoodColor === 'blue' ? 'Синій 💙 (потрібні d6 та d20)' : 'Чорний 🖤 (потрібні d6 та d20)'}
                </strong>
              </div>

              {/* D6 Physical Dice Selector */}
              <div className="manual-die-group">
                <label className="manual-die-label">Значення вашого кубика <strong>d6</strong> (1-6):</label>
                <div className="d6-picker-chips">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`d6-chip-btn ${manualD6 === num ? 'selected' : ''}`}
                      onClick={() => setManualD6(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* D20 Physical Dice Selector (for Blue and Black mood) */}
              {(effectiveMoodColor === 'blue' || effectiveMoodColor === 'black') && manualModalSkill !== 'telekinetic_movement' && (
                <div className="manual-die-group">
                  <label className="manual-die-label">Значення вашого кубика <strong>d20</strong> (1-20):</label>
                  
                  <div className="d20-quick-presets">
                    <button 
                      type="button" 
                      className={`d20-preset-btn fumble ${manualD20 === 1 ? 'active' : ''}`}
                      onClick={() => setManualD20(1)}
                    >
                      1 (Провал)
                    </button>
                    <button 
                      type="button" 
                      className={`d20-preset-btn ${manualD20 === 10 ? 'active' : ''}`}
                      onClick={() => setManualD20(10)}
                    >
                      10
                    </button>
                    <button 
                      type="button" 
                      className={`d20-preset-btn ${manualD20 === 15 ? 'active' : ''}`}
                      onClick={() => setManualD20(15)}
                    >
                      15
                    </button>
                    <button 
                      type="button" 
                      className={`d20-preset-btn crit ${manualD20 === 20 ? 'active' : ''}`}
                      onClick={() => setManualD20(20)}
                    >
                      20 (Крит!)
                    </button>
                  </div>

                  <div className="d20-stepper-box">
                    <button 
                      type="button"
                      className="d20-step-btn" 
                      onClick={() => setManualD20(Math.max(1, manualD20 - 1))}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max="20"
                      value={manualD20}
                      onChange={e => setManualD20(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                      className="manual-d20-input"
                    />
                    <button 
                      type="button"
                      className="d20-step-btn" 
                      onClick={() => setManualD20(Math.min(20, manualD20 + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setManualModalSkill(null)}>
                  Скасувати
                </button>
                <button type="button" className="btn-save btn-apply-manual-roll" onClick={handleConfirmManualRoll}>
                  <Check size={16} /> Розрахувати ефект
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
