import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Sparkles, Zap, Shield, Book, CheckCircle, Circle } from 'lucide-react';

export const MechanicsTab: React.FC = () => {
  const { character, toggleSpecialMechanic, spendSpellSlot } = useCharacter();
  const [spellLevelFilter, setSpellLevelFilter] = useState<number | 'all'>('all');
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);

  const filteredSpells = character.spells.filter(sp => {
    if (spellLevelFilter === 'all') return true;
    return sp.level === spellLevelFilter;
  });

  return (
    <div className="tab-content mechanics-tab animate-fadeIn">
      {/* Special Character Mechanics & Stances */}
      <section className="dashboard-card hero-mechanics-card">
        <div className="card-header">
          <div className="card-title-group">
            <Sparkles size={20} className="text-purple" />
            <div>
              <h2 className="card-title">{character.specialMechanicName}</h2>
              <p className="card-subtitle">{character.specialMechanicDescription}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Mechanics & Stances toggles */}
        <div className="mechanics-features-grid">
          {character.specialMechanics.map(mech => {
            const isStance = mech.type === 'stance';
            const isActive = !!mech.active;

            return (
              <div 
                key={mech.id} 
                className={`mechanic-card ${isStance ? 'stance-card' : ''} ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (isStance || mech.type === 'active') {
                    toggleSpecialMechanic(mech.id);
                  }
                }}
              >
                <div className="mech-header">
                  <div className="mech-title-group">
                    <span className="mech-title">{mech.title}</span>
                    <span className={`mech-badge ${mech.type}`}>
                      {mech.type === 'stance' ? 'Стійка' : mech.type === 'passive' ? 'Пасивка' : 'Активна'}
                    </span>
                  </div>

                  {(isStance || mech.type === 'active') && (
                    <div className="mech-toggle-icon">
                      {isActive ? (
                        <CheckCircle size={18} className="text-emerald" />
                      ) : (
                        <Circle size={18} className="text-muted" />
                      )}
                    </div>
                  )}
                </div>

                <p className="mech-desc">{mech.description}</p>

                {mech.effectSummary && (
                  <div className="mech-effect-pill">
                    <Zap size={12} />
                    <span>{mech.effectSummary}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Class & Racial Traits / Invocations */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <Shield size={18} className="text-gold" />
            <h2 className="card-title">Особливості раси та класу</h2>
          </div>
        </div>

        <div className="traits-list-simple">
          <div className="trait-row">
            <span className="trait-bullet">✦</span>
            <div>
              <strong>Нічний зір (Darkvision):</strong> 60 фт у темряві як у тьмяному світлі.
            </div>
          </div>
          <div className="trait-row">
            <span className="trait-bullet">✦</span>
            <div>
              <strong>Ельфійська спадщина (Fey Ancestry):</strong> Перевага на ряткидки проти зачарування, імунітет до магічного сну.
            </div>
          </div>
          <div className="trait-row">
            <span className="trait-bullet">✦</span>
            <div>
              <strong>Бойовий стиль (Fighting Style - Great Weapon Fighting):</strong> Перекидання 1 та 2 на кістках шкоди дворучної зброї.
            </div>
          </div>
          <div className="trait-row">
            <span className="trait-bullet">✦</span>
            <div>
              <strong>Пактова магія (Pact Magic):</strong> Чарунки відновлюються на короткому відпочинку та мають максимальний рівень!
            </div>
          </div>
        </div>
      </section>

      {/* Full Spellbook */}
      <section className="dashboard-card spellbook-card">
        <div className="card-header">
          <div className="card-title-group">
            <Book size={18} className="text-purple" />
            <h2 className="card-title">Книга Заклинань (Spellbook)</h2>
          </div>
          <span className="card-badge">
            Заклинань: {character.spells.length}
          </span>
        </div>

        {/* Level filter tabs */}
        <div className="spell-filter-bar">
          <button 
            className={`filter-chip ${spellLevelFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSpellLevelFilter('all')}
          >
            Всі
          </button>
          <button 
            className={`filter-chip ${spellLevelFilter === 0 ? 'active' : ''}`}
            onClick={() => setSpellLevelFilter(0)}
          >
            Замовляння (0)
          </button>
          <button 
            className={`filter-chip ${spellLevelFilter === 1 ? 'active' : ''}`}
            onClick={() => setSpellLevelFilter(1)}
          >
            1-й Рівень
          </button>
          <button 
            className={`filter-chip ${spellLevelFilter === 3 ? 'active' : ''}`}
            onClick={() => setSpellLevelFilter(3)}
          >
            3-й Рівень
          </button>
        </div>

        {/* Spell list */}
        <div className="spells-accordion-list">
          {filteredSpells.map(spell => {
            const isExpanded = expandedSpellId === spell.id;

            return (
              <div key={spell.id} className={`spell-card ${isExpanded ? 'expanded' : ''}`}>
                <div 
                  className="spell-header-row"
                  onClick={() => setExpandedSpellId(isExpanded ? null : spell.id)}
                >
                  <div className="spell-title-meta">
                    <span className="spell-level-badge">
                      {spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`}
                    </span>
                    <span className="spell-name">{spell.name}</span>
                  </div>

                  <div className="spell-tags">
                    {spell.concentration && <span className="tag-concentration" title="Концентрація">C</span>}
                    {spell.ritual && <span className="tag-ritual" title="Ритуал">R</span>}
                    <span className="spell-casting-time">{spell.castingTime}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="spell-expanded-body animate-fadeIn">
                    <div className="spell-meta-grid">
                      <div><span className="meta-label">Школа:</span> {spell.school}</div>
                      <div><span className="meta-label">Дистанція:</span> {spell.range}</div>
                      <div><span className="meta-label">Компоненти:</span> {spell.components}</div>
                      <div><span className="meta-label">Тривалість:</span> {spell.duration}</div>
                    </div>

                    <p className="spell-description-text">{spell.description}</p>

                    <div className="spell-actions-footer">
                      {spell.level > 0 && (
                        <button 
                          className="btn-cast-spell"
                          onClick={() => {
                            spendSpellSlot(3);
                            alert(`Заклинання "${spell.name}" накладено! Чарунку витрачено.`);
                          }}
                        >
                          ✨ Накласти заклинання (Витратити слот)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
