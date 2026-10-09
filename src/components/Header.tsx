import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { 
  Shield, 
  Heart, 
  Zap, 
  Moon, 
  Sun, 
  Dices, 
  Settings, 
  Flame,
  ChevronDown
} from 'lucide-react';
import { RestModal } from './RestModal';
import { CharacterEditModal } from './CharacterEditModal';

export const Header: React.FC = () => {
  const { character, setIsDiceDrawerOpen, isDiceDrawerOpen, theme, toggleTheme } = useCharacter();
  const [restModalMode, setRestModalMode] = useState<'short' | 'long' | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const hpPercent = Math.max(0, Math.min(100, Math.round((character.hp.current / character.hp.max) * 100)));
  
  let hpBarColor = 'var(--emerald-500)';
  if (hpPercent <= 25) hpBarColor = 'var(--crimson-500)';
  else if (hpPercent <= 50) hpBarColor = 'var(--amber-500)';

  return (
    <header className="app-header">
      {/* Top row: Character overview & Quick actions */}
      <div className="header-top-row">
        <div className="char-badge-block" onClick={() => setIsEditModalOpen(true)} title="Натисніть для налаштування персонажа">
          <div className="char-avatar-ring">
            <div className="char-avatar-inner">
              <span className="char-initials">{character.name.charAt(0)}</span>
            </div>
            <span className="char-level-pill">Lvl {character.level}</span>
          </div>
          
          <div className="char-info-meta">
            <div className="char-name-line">
              <h1 className="char-name">{character.name}</h1>
              <ChevronDown size={14} className="edit-icon-hint" />
            </div>
            <p className="char-subtext">
              {character.race} • {character.class}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="header-actions">
          {/* Theme switcher */}
          <button 
            className="action-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Перемкнути на світлу тему' : 'Перемкнути на темну тему'}
            aria-label="Змінити тему"
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber" />
            ) : (
              <Moon size={17} className="text-purple" />
            )}
          </button>

          <button 
            className="action-pill-btn rest-btn short-rest"
            onClick={() => setRestModalMode('short')}
            title="Короткий відпочинок (Short Rest)"
          >
            <Moon size={15} />
            <span className="btn-label">Short</span>
          </button>
          
          <button 
            className="action-pill-btn rest-btn long-rest"
            onClick={() => setRestModalMode('long')}
            title="Довгий відпочинок (Long Rest)"
          >
            <Sun size={15} />
            <span className="btn-label">Long</span>
          </button>

          <button 
            className={`action-pill-btn dice-btn ${isDiceDrawerOpen ? 'active' : ''}`}
            onClick={() => setIsDiceDrawerOpen(!isDiceDrawerOpen)}
            title="Відкрити кубики (Dice Tray)"
          >
            <Dices size={17} />
            <span className="btn-label">Дайси</span>
          </button>

          <button 
            className="action-icon-btn"
            onClick={() => setIsEditModalOpen(true)}
            title="Налаштування та Експорт"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* HP & Key Combat Vitals bar */}
      <div className="header-vitals-row">
        {/* HP Bar */}
        <div className="hp-meter-container">
          <div className="hp-header-info">
            <div className="hp-label-group">
              <Heart size={14} className="hp-heart-icon" />
              <span className="hp-title">Хіти (HP)</span>
            </div>
            <div className="hp-values">
              <span className="hp-current">{character.hp.current}</span>
              <span className="hp-max">/ {character.hp.max}</span>
              {character.hp.temp > 0 && (
                <span className="hp-temp">+{character.hp.temp} Temp</span>
              )}
            </div>
          </div>
          
          <div className="hp-progress-track">
            <div 
              className="hp-progress-fill"
              style={{ 
                width: `${hpPercent}%`,
                backgroundColor: hpBarColor 
              }}
            />
            {character.hp.temp > 0 && (
              <div 
                className="hp-progress-temp-fill"
                style={{ 
                  width: `${Math.min(100, Math.round((character.hp.temp / character.hp.max) * 100))}%` 
                }}
              />
            )}
          </div>
        </div>

        {/* Vital chips: AC, Init, Speed, PB */}
        <div className="vitals-chips-grid">
          <div className="vital-chip ac-chip" title="Armor Class (Клас обладунку)">
            <Shield size={13} className="vital-chip-icon" />
            <span className="vital-chip-label">КД</span>
            <span className="vital-chip-value">{character.armorClass}</span>
          </div>

          <div className="vital-chip init-chip" title="Initiative (Ініціатива)">
            <Zap size={13} className="vital-chip-icon" />
            <span className="vital-chip-label">Ініц</span>
            <span className="vital-chip-value">{character.initiativeBonus >= 0 ? `+${character.initiativeBonus}` : character.initiativeBonus}</span>
          </div>

          <div className="vital-chip speed-chip" title="Speed (Швидкість руху)">
            <Flame size={13} className="vital-chip-icon" />
            <span className="vital-chip-label">Рух</span>
            <span className="vital-chip-value">{character.speed} фт</span>
          </div>

          <div className="vital-chip pb-chip" title="Proficiency Bonus (Бонус майстерності)">
            <span className="vital-chip-label">Майст</span>
            <span className="vital-chip-value">+{character.proficiencyBonus}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {restModalMode && (
        <RestModal mode={restModalMode} onClose={() => setRestModalMode(null)} />
      )}

      {isEditModalOpen && (
        <CharacterEditModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </header>
  );
};
