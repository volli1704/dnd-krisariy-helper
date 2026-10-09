import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Dices, X, History } from 'lucide-react';
import { formatModifier } from '../utils/dndUtils';

export const DiceDrawer: React.FC = () => {
  const { 
    isDiceDrawerOpen, 
    setIsDiceDrawerOpen, 
    lastRoll, 
    rollHistory, 
    triggerRoll, 
    clearRollHistory 
  } = useCharacter();

  const [customModifier, setCustomModifier] = useState<number>(0);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [advantageMode, setAdvantageMode] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');

  if (!isDiceDrawerOpen) return null;

  const diceTypes = [
    { sides: 4, label: 'd4', color: '#38bdf8' },
    { sides: 6, label: 'd6', color: '#34d399' },
    { sides: 8, label: 'd8', color: '#fbbf24' },
    { sides: 10, label: 'd10', color: '#f87171' },
    { sides: 12, label: 'd12', color: '#c084fc' },
    { sides: 20, label: 'd20', color: '#e5a93b' },
    { sides: 100, label: 'd100', color: '#ec4899' }
  ];

  const handleRoll = (sides: number) => {
    const adv = sides === 20 ? advantageMode : 'normal';
    triggerRoll(diceCount, sides, customModifier, `Кидок ${diceCount}d${sides}`, adv);
  };

  return (
    <div className="dice-drawer-backdrop" onClick={() => setIsDiceDrawerOpen(false)}>
      <div className="dice-drawer-container animate-slideUp" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="dice-drawer-header">
          <div className="drawer-title-group">
            <Dices size={20} className="text-gold" />
            <h3 className="drawer-title">Таця для кубиків (Dice Tray)</h3>
          </div>
          <button className="icon-close-btn" onClick={() => setIsDiceDrawerOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Big Roll Result Display */}
        {lastRoll && (
          <div className={`last-roll-banner ${lastRoll.isCrit ? 'crit' : ''} ${lastRoll.isFumble ? 'fumble' : ''} animate-scaleUp`}>
            <div className="last-roll-top">
              <span className="last-roll-label">{lastRoll.label}</span>
              <span className="last-roll-time">{lastRoll.timestamp}</span>
            </div>

            <div className="last-roll-center">
              <span className="last-roll-total">{lastRoll.total}</span>
              {lastRoll.isCrit && <span className="badge-crit">🌟 НАТУРАЛЬНА 20! КРИТИЧНИЙ УСПІХ!</span>}
              {lastRoll.isFumble && <span className="badge-fumble">💀 НАТУРАЛЬНА 1! ПРОВАЛ!</span>}
            </div>

            <div className="last-roll-details">
              <span>Формула: <strong>{lastRoll.formula}</strong></span>
              <span> | Кидки: [{lastRoll.rolls.join(', ')}]</span>
              {lastRoll.modifier !== 0 && (
                <span> | Модифікатор: {formatModifier(lastRoll.modifier)}</span>
              )}
            </div>
          </div>
        )}

        {/* Advantage / Disadvantage controls for d20 */}
        <div className="dice-settings-bar">
          <div className="adv-toggle-group">
            <button
              className={`adv-btn ${advantageMode === 'advantage' ? 'active advantage' : ''}`}
              onClick={() => setAdvantageMode(advantageMode === 'advantage' ? 'normal' : 'advantage')}
            >
              Перевага (ADV)
            </button>
            <button
              className={`adv-btn ${advantageMode === 'normal' ? 'active' : ''}`}
              onClick={() => setAdvantageMode('normal')}
            >
              Звичайний
            </button>
            <button
              className={`adv-btn ${advantageMode === 'disadvantage' ? 'active disadvantage' : ''}`}
              onClick={() => setAdvantageMode(advantageMode === 'disadvantage' ? 'normal' : 'disadvantage')}
            >
              Перешкода (DIS)
            </button>
          </div>

          <div className="dice-controls-inline">
            <div className="ctrl-input-group">
              <label>К-сть:</label>
              <input 
                type="number" 
                min="1" 
                max="20"
                value={diceCount}
                onChange={e => setDiceCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="dice-mini-input"
              />
            </div>

            <div className="ctrl-input-group">
              <label>Мод:</label>
              <input 
                type="number" 
                value={customModifier}
                onChange={e => setCustomModifier(parseInt(e.target.value, 10) || 0)}
                className="dice-mini-input"
              />
            </div>
          </div>
        </div>

        {/* Dice buttons grid */}
        <div className="dice-buttons-grid">
          {diceTypes.map(d => (
            <button
              key={d.sides}
              className={`dice-roll-btn die-${d.sides}`}
              onClick={() => handleRoll(d.sides)}
              style={{ borderColor: d.color }}
            >
              <span className="die-shape-icon" style={{ color: d.color }}>🎲</span>
              <span className="die-label">{d.label}</span>
            </button>
          ))}
        </div>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <div className="roll-history-section">
            <div className="history-header">
              <div className="history-title-group">
                <History size={14} />
                <span>Історія останніх кидків</span>
              </div>
              <button className="btn-clear-history" onClick={clearRollHistory}>
                Очистити
              </button>
            </div>

            <div className="history-list-scroll">
              {rollHistory.slice(0, 10).map(r => (
                <div key={r.id} className="history-item">
                  <div className="hist-left">
                    <span className="hist-label">{r.label}</span>
                    <span className="hist-formula">{r.formula}</span>
                  </div>
                  <div className="hist-right">
                    <span className={`hist-total ${r.isCrit ? 'crit' : ''} ${r.isFumble ? 'fumble' : ''}`}>
                      {r.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
