import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { 
  Heart, 
  ShieldAlert, 
  Plus, 
  Minus, 
  Skull, 
  Check, 
  X, 
  RotateCcw, 
  Info, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { RULES_DATABASE } from '../data/rulesData';
import { FIGHTER_CLASS_FEATURES } from '../data/fighterFeatures';
import { PsiMechanicsPanel } from './PsiMechanicsPanel';

export const SpellsTab: React.FC = () => {
  const { 
    character, 
    updateCharacter, 
    applyDamage, 
    applyHeal, 
    setHp, 
    toggleCondition,
    useSpecialResource,
    restoreSpecialResource,
    toggleFavoriteFeature,
    triggerRoll
  } = useCharacter();

  const [hpInputVal, setHpInputVal] = useState<string>('');
  const [tempHpInputVal, setTempHpInputVal] = useState<string>('');
  const [selectedConditionInfo, setSelectedConditionInfo] = useState<string | null>(null);
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);
  const [showAllLevels, setShowAllLevels] = useState<boolean>(false);

  const handleApplyDamage = () => {
    const num = parseInt(hpInputVal, 10);
    if (!isNaN(num) && num > 0) {
      applyDamage(num);
      setHpInputVal('');
    }
  };

  const handleApplyHeal = () => {
    const num = parseInt(hpInputVal, 10);
    if (!isNaN(num) && num > 0) {
      applyHeal(num);
      setHpInputVal('');
    }
  };

  const handleSetTempHp = () => {
    const num = parseInt(tempHpInputVal, 10);
    if (!isNaN(num) && num >= 0) {
      setHp(character.hp.current, num);
      setTempHpInputVal('');
    }
  };

  const toggleDeathSaveSuccess = (index: number) => {
    updateCharacter(prev => {
      const current = prev.deathSaves.successes;
      const next = current === index + 1 ? index : index + 1;
      return {
        ...prev,
        deathSaves: { ...prev.deathSaves, successes: next }
      };
    });
  };

  const toggleDeathSaveFailure = (index: number) => {
    updateCharacter(prev => {
      const current = prev.deathSaves.failures;
      const next = current === index + 1 ? index : index + 1;
      return {
        ...prev,
        deathSaves: { ...prev.deathSaves, failures: next }
      };
    });
  };

  const resetDeathSaves = () => {
    updateCharacter(prev => ({
      ...prev,
      deathSaves: { successes: 0, failures: 0 }
    }));
  };

  const handleAttackRoll = (atk: typeof character.attacks[0]) => {
    triggerRoll(1, 20, atk.toHitBonus, `${atk.name} (Атака To-Hit)`);
  };

  const allConditions = [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 
    'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 
    'Petrified', 'Poisoned', 'Prone', 'Restrained', 
    'Stunned', 'Unconscious', 'Exhaustion'
  ];

  const userFavorites = character.favoriteFeatureIds || ['ft_second_wind', 'ft_action_surge', 'ft_extra_attack_1'];

  const availableFeatures = FIGHTER_CLASS_FEATURES.filter(f => f.level <= character.level);
  const displayedFeatures = showAllLevels 
    ? FIGHTER_CLASS_FEATURES 
    : availableFeatures;

  const favoriteFeatures = FIGHTER_CLASS_FEATURES.filter(f => 
    userFavorites.includes(f.id) && f.level <= character.level
  );

  return (
    <div className="tab-content combat-tab animate-fadeIn">
      {/* 1. HP & Damage Controller */}
      <section className="dashboard-card hp-controller-card">
        <div className="card-header">
          <div className="card-title-group">
            <Heart size={18} className="text-crimson" />
            <h2 className="card-title">Керування Хітами (HP Controller)</h2>
          </div>
          <span className="card-badge">
            Поточні: <strong>{character.hp.current}</strong> / {character.hp.max}
          </span>
        </div>

        {/* Quick Inc/Dec Buttons */}
        <div className="quick-hp-row">
          <button className="hp-quick-btn dmg" onClick={() => applyDamage(1)}>-1</button>
          <button className="hp-quick-btn dmg" onClick={() => applyDamage(5)}>-5</button>
          <button className="hp-quick-btn dmg" onClick={() => applyDamage(10)}>-10</button>
          
          <div className="hp-quick-divider" />

          <button className="hp-quick-btn heal" onClick={() => applyHeal(1)}>+1</button>
          <button className="hp-quick-btn heal" onClick={() => applyHeal(5)}>+5</button>
          <button className="hp-quick-btn heal" onClick={() => applyHeal(10)}>+10</button>
        </div>

        {/* Custom Damage / Heal Input */}
        <div className="custom-hp-inputs-grid">
          <div className="hp-input-action-group">
            <input 
              type="number" 
              inputMode="numeric"
              placeholder="Кількість..."
              value={hpInputVal}
              onChange={e => setHpInputVal(e.target.value)}
              className="styled-num-input"
              onKeyDown={e => {
                if (e.key === 'Enter') handleApplyDamage();
              }}
            />
            <div className="btn-group-dual">
              <button className="btn-action-dmg" onClick={handleApplyDamage}>
                <Minus size={15} /> Шкода (Dmg)
              </button>
              <button className="btn-action-heal" onClick={handleApplyHeal}>
                <Plus size={15} /> Лікування
              </button>
            </div>
          </div>

          <div className="temp-hp-group">
            <input 
              type="number" 
              inputMode="numeric"
              placeholder="Temp HP..."
              value={tempHpInputVal}
              onChange={e => setTempHpInputVal(e.target.value)}
              className="styled-num-input"
            />
            <button className="btn-action-temp" onClick={handleSetTempHp}>
              Встановити Тимчасові HP
            </button>
          </div>
        </div>

        {/* Death Saves (shows if HP === 0) */}
        {character.hp.current === 0 && (
          <div className="death-saves-panel animate-pulse">
            <div className="death-saves-header">
              <div className="title-with-icon text-crimson">
                <Skull size={18} />
                <span className="font-bold">Рятівні кидки від смерті (Death Saves)</span>
              </div>
              <button className="icon-subtle-btn" onClick={resetDeathSaves} title="Скинути ряткидки">
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="death-saves-trackers">
              <div className="save-track-group">
                <span className="save-label text-emerald">Успіхи (Successes):</span>
                <div className="save-pips">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={'succ_' + idx}
                      className={`death-pip success ${character.deathSaves.successes > idx ? 'filled' : ''}`}
                      onClick={() => toggleDeathSaveSuccess(idx)}
                    >
                      {character.deathSaves.successes > idx && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="save-track-group">
                <span className="save-label text-crimson">Провали (Failures):</span>
                <div className="save-pips">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={'fail_' + idx}
                      className={`death-pip failure ${character.deathSaves.failures > idx ? 'filled' : ''}`}
                      onClick={() => toggleDeathSaveFailure(idx)}
                    >
                      {character.deathSaves.failures > idx && <X size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              className="btn-roll-death-save"
              onClick={() => triggerRoll(1, 20, 0, 'Рятівний кидок від смерті (Death Save)')}
            >
              🎲 Кинути 1d20 від смерті
            </button>
          </div>
        )}
      </section>

      {/* 2. Quick Attacks (Battleaxe + Warhammer in 2 hands) */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <span style={{ fontSize: '18px' }}>⚔️</span>
            <h2 className="card-title">Зброя в обох руках (Бойова сокира + Молот)</h2>
          </div>
        </div>

        <div className="attacks-list">
          {character.attacks.map(atk => (
            <div key={atk.id} className="attack-item-card">
              <div className="attack-main-info">
                <div className="attack-title-line">
                  <span className="attack-name">{atk.name}</span>
                  <span className="attack-type-badge">{atk.type}</span>
                </div>
                <div className="attack-meta-line">
                  <span className="attack-dmg-text">
                    Шкода: <strong>{atk.damage}</strong> ({atk.damageType})
                  </span>
                  <span className="attack-range-text">• Дистанція: {atk.range}</span>
                </div>
                {atk.notes && <p className="attack-notes">{atk.notes}</p>}
              </div>

              <div className="attack-actions-block">
                <button 
                  className="btn-roll-attack"
                  onClick={() => handleAttackRoll(atk)}
                >
                  <span className="roll-label">To-Hit</span>
                  <span className="roll-val">+{atk.toHitBonus}</span>
                </button>

                <button 
                  className="btn-roll-damage"
                  onClick={() => {
                    const match = atk.damage.match(/(\d+)d(\d+)\s*([+-]\s*\d+)?/);
                    if (match) {
                      const count = parseInt(match[1], 10);
                      const sides = parseInt(match[2], 10);
                      const mod = match[3] ? parseInt(match[3].replace(/\s+/g, ''), 10) : 0;
                      triggerRoll(count, sides, mod, `${atk.name} (Шкода: ${atk.damageType})`);
                    } else {
                      triggerRoll(1, 8, 4, `${atk.name} (Damage)`);
                    }
                  }}
                >
                  💥 Шкода
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. УНІКАЛЬНА ПСІОНІЧНА МЕХАНІКА (PSI MOOD COMPASS & 3 SKILLS & PILLS) */}
      <PsiMechanicsPanel />

      {/* 4. ШВИДКІ РЕСУРСИ ТА УЛЮБЛЕНІ ЗДІБНОСТІ (ONLY FAVORITES) */}
      <section className="dashboard-card favorite-resources-section">
        <div className="card-header">
          <div className="card-title-group">
            <Star size={18} className="text-gold fill-gold" />
            <h2 className="card-title">Швидкі ресурси та улюблені здібності</h2>
          </div>
          <span className="card-badge">Обраних: {favoriteFeatures.length}</span>
        </div>

        <div className="resources-grid">
          {/* Hit Dice tracker */}
          <div className="resource-counter-card">
            <div className="res-card-top">
              <span className="res-name">Кістки Здоров’я ({character.hitDice.dieType})</span>
              <span className="res-count-badge">{character.hitDice.current} / {character.hitDice.total}</span>
            </div>
            <div className="res-controls">
              <button 
                className="res-ctrl-btn"
                disabled={character.hitDice.current <= 0}
                onClick={() => {
                  if (character.hitDice.current > 0) {
                    updateCharacter(prev => ({
                      ...prev,
                      hitDice: { ...prev.hitDice, current: prev.hitDice.current - 1 }
                    }));
                    const conScore = character.abilities.CON.score;
                    const conMod = Math.floor((conScore - 10) / 2);
                    const dieSides = parseInt(character.hitDice.dieType.replace('d', ''), 10) || 10;
                    triggerRoll(1, dieSides, conMod, `Витрата ${character.hitDice.dieType} (Hit Die + CON)`);
                  }
                }}
              >
                Витратити {character.hitDice.dieType}
              </button>
              <button 
                className="res-ctrl-btn-mini"
                disabled={character.hitDice.current >= character.hitDice.total}
                onClick={() => updateCharacter(prev => ({
                  ...prev,
                  hitDice: { ...prev.hitDice, current: Math.min(prev.hitDice.total, prev.hitDice.current + 1) }
                }))}
              >
                +1
              </button>
            </div>
          </div>

          {/* User Favorite Features with Quick Actions */}
          {favoriteFeatures.map(feat => {
            const res = character.specialResources.find(r => r.name.toLowerCase().includes(feat.name.toLowerCase()) || r.id === feat.id);

            return (
              <div key={feat.id} className="resource-counter-card favorite-feat-card">
                <div className="res-card-top">
                  <div className="feat-title-with-star">
                    <span className="res-name">{feat.nameUk}</span>
                  </div>
                  {res && (
                    <span className="res-count-badge" style={{ borderColor: res.color || 'var(--gold-500)' }}>
                      {res.current} / {res.max}
                    </span>
                  )}
                  {!res && (
                    <span className="feat-action-badge">{feat.actionType}</span>
                  )}
                </div>

                <p className="res-desc">{feat.summaryUk}</p>

                {res && (
                  <div className="res-pips-row">
                    {Array.from({ length: res.max }).map((_, i) => {
                      const isAvailable = i < res.current;
                      return (
                        <div 
                          key={i} 
                          className={`res-pip ${isAvailable ? 'active' : 'spent'}`}
                          style={{ backgroundColor: isAvailable ? (res.color || 'var(--amber-500)') : 'transparent' }}
                          onClick={() => {
                            if (isAvailable) useSpecialResource(res.id, 1);
                            else restoreSpecialResource(res.id, 1);
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                <div className="res-controls">
                  {feat.id === 'ft_second_wind' && (
                    <button 
                      className="res-ctrl-btn"
                      disabled={res ? res.current <= 0 : false}
                      onClick={() => {
                        if (res) useSpecialResource(res.id, 1);
                        triggerRoll(1, 10, character.level, `Другий подих (1d10 + ${character.level} HP)`);
                      }}
                    >
                      🎲 Відновити хіти (1d10+{character.level})
                    </button>
                  )}

                  {feat.id === 'ft_action_surge' && (
                    <button 
                      className="res-ctrl-btn"
                      disabled={res ? res.current <= 0 : false}
                      onClick={() => {
                        if (res) useSpecialResource(res.id, 1);
                        alert('Сплеск дій активовано! Ви маєте 1 додаткову дію (Action) у цей хід.');
                      }}
                    >
                      ⚡ Використати сплеск
                    </button>
                  )}

                  {feat.id !== 'ft_second_wind' && feat.id !== 'ft_action_surge' && res && (
                    <button 
                      className="res-ctrl-btn"
                      disabled={res.current <= 0}
                      onClick={() => useSpecialResource(res.id, 1)}
                    >
                      Використати
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ТАБЛИЦЯ СКІЛІВ ТА ЗДІБНОСТЕЙ КЛАСУ (FIGHTER CLASS FEATURES TABLE) */}
      <section className="dashboard-card class-features-table-card">
        <div className="card-header">
          <div className="card-title-group">
            <Zap size={18} className="text-purple" />
            <div>
              <h2 className="card-title">Таблиця скілів Воїна (Fighter Features)</h2>
              <p className="card-subtitle">
                Доступно на рівні {character.level}: <strong>{availableFeatures.length}</strong> з {FIGHTER_CLASS_FEATURES.length}
              </p>
            </div>
          </div>

          <button 
            className="toggle-all-levels-btn"
            onClick={() => setShowAllLevels(!showAllLevels)}
            title="Показати/приховати майбутні рівні"
          >
            {showAllLevels ? <Unlock size={14} /> : <Lock size={14} />}
            <span>{showAllLevels ? 'Всі рівні (1-20)' : `Тільки мої (Lvl ${character.level})`}</span>
          </button>
        </div>

        <div className="features-table-list">
          {displayedFeatures.map(feat => {
            const isUnlocked = feat.level <= character.level;
            const isFav = userFavorites.includes(feat.id);
            const isExpanded = expandedFeatureId === feat.id;

            return (
              <div 
                key={feat.id} 
                className={`feature-table-row ${isUnlocked ? 'unlocked' : 'locked'} ${isExpanded ? 'expanded' : ''}`}
              >
                <div 
                  className="feature-row-header"
                  onClick={() => setExpandedFeatureId(isExpanded ? null : feat.id)}
                >
                  <div className="feat-row-left">
                    <button 
                      className={`star-fav-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteFeature(feat.id);
                      }}
                      title={isFav ? 'Прибрати з швидких улюблених' : 'Додати в швидкі улюблені'}
                    >
                      <Star size={15} />
                    </button>

                    <span className={`feat-level-badge ${isUnlocked ? 'active' : 'locked'}`}>
                      Lvl {feat.level}
                    </span>

                    <div className="feat-name-block">
                      <span className="feat-name-uk">{feat.nameUk}</span>
                      <span className="feat-name-en">{feat.name}</span>
                    </div>
                  </div>

                  <div className="feat-row-right">
                    <span className={`feat-action-tag ${feat.actionType}`}>
                      {feat.actionType === 'bonus' ? 'Бонусна дія' :
                       feat.actionType === 'action' ? 'Дія' :
                       feat.actionType === 'reaction' ? 'Реакція' :
                       feat.actionType === 'special' ? 'Особлива' : 'Пасивна'}
                    </span>

                    <div className="expand-indicator">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Summary line */}
                <p className="feat-summary-line">{feat.summaryUk}</p>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="feature-expanded-drawer animate-fadeIn">
                    <div className="feat-source-pill">Джерело: {feat.source}</div>
                    
                    <div className="feat-desc-section">
                      <h4 className="feat-section-title">Опис правила (5e.tools UA):</h4>
                      <p className="feat-desc-text">{feat.descriptionUk}</p>
                    </div>

                    <div className="feat-desc-section en-ref">
                      <h4 className="feat-section-title">Original 5e.tools (EN):</h4>
                      <p className="feat-desc-text en">{feat.descriptionEn}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Active Conditions */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <ShieldAlert size={18} className="text-amber" />
            <h2 className="card-title">Стани персонажа (Conditions)</h2>
          </div>
          {character.activeConditions.length > 0 && (
            <span className="card-badge active-cond-count">
              Активних: {character.activeConditions.length}
            </span>
          )}
        </div>

        <p className="section-hint">Натисніть на стан, щоб увімкнути/вимкнути його або переглянути правило:</p>

        <div className="conditions-chips-wrap">
          {allConditions.map(cond => {
            const isActive = character.activeConditions.includes(cond);
            return (
              <div key={cond} className="cond-pill-container">
                <button
                  className={`condition-pill ${isActive ? 'active' : ''}`}
                  onClick={() => toggleCondition(cond)}
                >
                  <span className="cond-dot" />
                  <span className="cond-text">{cond}</span>
                </button>
                <button 
                  className="cond-info-btn"
                  onClick={() => setSelectedConditionInfo(selectedConditionInfo === cond ? null : cond)}
                  title="Правило стану"
                >
                  <Info size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Condition rule preview popup */}
        {selectedConditionInfo && (
          <div className="condition-rule-box animate-fadeIn">
            {(() => {
              const rule = RULES_DATABASE.find(r => r.name.toLowerCase() === selectedConditionInfo.toLowerCase());
              if (!rule) return <p>Правило для {selectedConditionInfo}</p>;
              return (
                <div>
                  <div className="rule-box-header">
                    <strong>{rule.nameUk}</strong>
                    <button className="icon-close-subtle" onClick={() => setSelectedConditionInfo(null)}>
                      <X size={14} />
                    </button>
                  </div>
                  <p className="rule-summary">{rule.shortSummaryUk}</p>
                  <ul className="rule-bullets">
                    {rule.bulletsUk.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        )}
      </section>
    </div>
  );
};
