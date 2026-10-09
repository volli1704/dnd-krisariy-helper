import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { calculateModifier, formatModifier, calculateSkillModifier, calculateSaveModifier } from '../utils/dndUtils';
import type { AbilityName, Skill } from '../types/character';
import { Shield, Eye, Search, Dices, Star, Check } from 'lucide-react';

export const StatsTab: React.FC = () => {
  const { character, updateCharacter, triggerRoll } = useCharacter();
  const [skillSearch, setSkillSearch] = useState('');

  const abilitiesList: AbilityName[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  const filteredSkills = character.skills.filter(sk => {
    if (!skillSearch) return true;
    const q = skillSearch.toLowerCase();
    return sk.name.toLowerCase().includes(q) || sk.nameUk.toLowerCase().includes(q) || sk.ability.toLowerCase().includes(q);
  });

  const handleAbilityRoll = (ability: AbilityName) => {
    const score = character.abilities[ability].score;
    const mod = calculateModifier(score);
    triggerRoll(1, 20, mod, `Перевірка: ${character.abilities[ability].fullNameUk} (${ability})`);
  };

  const handleSaveRoll = (ability: AbilityName) => {
    const mod = calculateSaveModifier(character, ability);
    triggerRoll(1, 20, mod, `Рятівний кидок: ${character.abilities[ability].fullNameUk} (${ability} Save)`);
  };

  const handleToggleSaveProficiency = (e: React.MouseEvent, ability: AbilityName) => {
    e.stopPropagation();
    updateCharacter(prev => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: {
          ...prev.abilities[ability],
          proficientSave: !prev.abilities[ability].proficientSave
        }
      }
    }));
  };

  const handleSkillRoll = (skill: Skill) => {
    const mod = calculateSkillModifier(character, skill.ability, skill.proficiencyLevel, skill.customBonus);
    triggerRoll(1, 20, mod, `Навичка: ${skill.nameUk} (${skill.name})`);
  };

  const handleCycleSkillProficiency = (e: React.MouseEvent, skillId: string) => {
    e.stopPropagation();
    updateCharacter(prev => ({
      ...prev,
      skills: prev.skills.map(sk => {
        if (sk.id === skillId) {
          let nextLevel: Skill['proficiencyLevel'] = 'none';
          if (sk.proficiencyLevel === 'none') nextLevel = 'proficient';
          else if (sk.proficiencyLevel === 'proficient') nextLevel = 'expertise';
          else if (sk.proficiencyLevel === 'expertise') nextLevel = 'none';
          return { ...sk, proficiencyLevel: nextLevel };
        }
        return sk;
      })
    }));
  };

  return (
    <div className="tab-content stats-tab animate-fadeIn">
      {/* 1. 6 Ability Scores Grid */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <Shield size={18} className="text-gold" />
            <h2 className="card-title">Характеристики (Ability Scores)</h2>
          </div>
          <span className="card-hint-text">Натисніть на картку для кидка</span>
        </div>

        <div className="abilities-hex-grid">
          {abilitiesList.map(abKey => {
            const ab = character.abilities[abKey];
            const mod = calculateModifier(ab.score);
            const saveMod = calculateSaveModifier(character, abKey);

            return (
              <div 
                key={abKey} 
                className="ability-score-card"
                onClick={() => handleAbilityRoll(abKey)}
              >
                <div className="ability-card-top">
                  <span className="ability-code">{abKey}</span>
                  <span className="ability-full-name">{ab.fullNameUk}</span>
                </div>

                <div className="ability-mod-badge">
                  <span className="ability-mod-text">{formatModifier(mod)}</span>
                </div>

                <div className="ability-score-footer">
                  <span className="ability-base-score">Стат: {ab.score}</span>
                  <button 
                    className={`ability-save-badge ${ab.proficientSave ? 'proficient' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveRoll(abKey);
                    }}
                    title={`Рятівний кидок: ${formatModifier(saveMod)}. Натисніть галочку праворуч для зміни володіння.`}
                  >
                    <span>Спас: {formatModifier(saveMod)}</span>
                    <span 
                      className="save-prof-dot" 
                      onClick={(e) => handleToggleSaveProficiency(e, abKey)}
                      title={ab.proficientSave ? "Володіння спасом активне. Натисніть, щоб вимкнути" : "Натисніть, щоб увімкнути володіння спасом"}
                    >
                      {ab.proficientSave ? <Check size={11} /> : '○'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Skills with Search & Instant Roll */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <Dices size={18} className="text-purple" />
            <div>
              <h2 className="card-title">Навички (Skills)</h2>
              <p className="card-subtitle">Натисніть на значок зліва для зміни володіння: ⚪ Немає ➔ 🟢 Володіння ➔ ⭐ Експертиза</p>
            </div>
          </div>
          <span className="card-badge">Всього: 18</span>
        </div>

        {/* Skill Search bar */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Пошук навички (Атлетика, Спритність, Stealth...)"
            value={skillSearch}
            onChange={e => setSkillSearch(e.target.value)}
            className="styled-search-input"
          />
        </div>

        <div className="skills-interactive-list">
          {filteredSkills.map(skill => {
            const mod = calculateSkillModifier(character, skill.ability, skill.proficiencyLevel, skill.customBonus);
            const isExpert = skill.proficiencyLevel === 'expertise';
            const isProf = skill.proficiencyLevel === 'proficient';

            return (
              <div 
                key={skill.id}
                className="skill-row-item"
                onClick={() => handleSkillRoll(skill)}
              >
                <div className="skill-left">
                  <button
                    type="button"
                    className="skill-prof-indicator-btn"
                    onClick={(e) => handleCycleSkillProficiency(e, skill.id)}
                    title={
                      isExpert 
                        ? "Експертиза (+2xPB). Натисніть, щоб скинути."
                        : isProf 
                        ? "Володіння (+PB). Натисніть для Експертизи."
                        : "Немає володіння. Натисніть, щоб додати володіння."
                    }
                  >
                    {isExpert && <Star size={15} className="icon-star-gold" />}
                    {isProf && <div className="prof-bullet-filled" />}
                    {!isProf && !isExpert && <div className="prof-bullet-empty" />}
                  </button>

                  <div className="skill-names-group">
                    <span className="skill-name-uk">{skill.nameUk}</span>
                    <span className="skill-name-en">({skill.name})</span>
                  </div>
                </div>

                <div className="skill-right">
                  <span className="skill-ability-tag">{skill.ability}</span>
                  <div className="skill-mod-button" title="Кинути перевірку навички">
                    <span>{formatModifier(mod)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Senses & Proficiencies */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <Eye size={18} className="text-emerald" />
            <h2 className="card-title">Чуття та Володіння (Senses & Proficiencies)</h2>
          </div>
        </div>

        <div className="senses-chips-grid">
          <div className="sense-item">
            <span className="sense-label">Пасивна уважність:</span>
            <span className="sense-value">{character.senses.passivePerception}</span>
          </div>
          <div className="sense-item">
            <span className="sense-label">Пасивне розслідування:</span>
            <span className="sense-value">{character.senses.passiveInvestigation}</span>
          </div>
          <div className="sense-item">
            <span className="sense-label">Пасивна проникливість:</span>
            <span className="sense-value">{character.senses.passiveInsight}</span>
          </div>
          <div className="sense-item">
            <span className="sense-label">Нічний зір (Darkvision):</span>
            <span className="sense-value">{character.senses.darkvision || 0} фт</span>
          </div>
        </div>

        {character.senses.special && (
          <div className="special-sense-banner">
            ✨ <strong>Спеціальне чуття:</strong> {character.senses.special}
          </div>
        )}

        <div className="proficiencies-details-block">
          <div className="prof-section">
            <h4 className="prof-section-title">🛡️ Обладунки:</h4>
            <p className="prof-section-content">{character.proficiencies.armor.join(', ') || 'Немає'}</p>
          </div>
          <div className="prof-section">
            <h4 className="prof-section-title">⚔️ Зброя:</h4>
            <p className="prof-section-content">{character.proficiencies.weapons.join(', ') || 'Немає'}</p>
          </div>
          <div className="prof-section">
            <h4 className="prof-section-title">🛠️ Інструменти:</h4>
            <p className="prof-section-content">{character.proficiencies.tools.join(', ') || 'Немає'}</p>
          </div>
          <div className="prof-section">
            <h4 className="prof-section-title">🗣️ Мови:</h4>
            <p className="prof-section-content">{character.languages.join(', ') || 'Common'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
