import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { X, Download, Upload, RotateCcw, Save, Check } from 'lucide-react';

interface CharacterEditModalProps {
  onClose: () => void;
}

export const CharacterEditModal: React.FC<CharacterEditModalProps> = ({ onClose }) => {
  const { character, updateCharacter, exportCharacterJson, importCharacterJson, resetToDefault } = useCharacter();

  const [name, setName] = useState(character.name);
  const [charClass, setCharClass] = useState(character.class);
  const [subclass, setSubclass] = useState(character.subclass);
  const [level, setLevel] = useState(character.level);
  const [race, setRace] = useState(character.race);
  const [maxHp, setMaxHp] = useState(character.hp.max);
  const [ac, setAc] = useState(character.armorClass);
  const [speed, setSpeed] = useState(character.speed);

  // Ability scores
  const [str, setStr] = useState(character.abilities.STR.score);
  const [dex, setDex] = useState(character.abilities.DEX.score);
  const [con, setCon] = useState(character.abilities.CON.score);
  const [intScore, setIntScore] = useState(character.abilities.INT.score);
  const [wis, setWis] = useState(character.abilities.WIS.score);
  const [cha, setCha] = useState(character.abilities.CHA.score);

  const [jsonInput, setJsonInput] = useState('');
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCharacter(prev => ({
      ...prev,
      name,
      class: charClass,
      subclass,
      level,
      race,
      hp: {
        ...prev.hp,
        max: maxHp,
        current: Math.min(maxHp, prev.hp.current)
      },
      armorClass: ac,
      speed,
      abilities: {
        ...prev.abilities,
        STR: { ...prev.abilities.STR, score: str },
        DEX: { ...prev.abilities.DEX, score: dex },
        CON: { ...prev.abilities.CON, score: con },
        INT: { ...prev.abilities.INT, score: intScore },
        WIS: { ...prev.abilities.WIS, score: wis },
        CHA: { ...prev.abilities.CHA, score: cha }
      }
    }));
    onClose();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportCharacterJson());
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleApplyImport = () => {
    if (!jsonInput.trim()) return;
    const ok = importCharacterJson(jsonInput);
    if (ok) {
      alert('Персонажа успішно імпортовано!');
      onClose();
    } else {
      alert('Помилка імпорту! Перевірте валідність JSON структури.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content char-edit-modal animate-scaleUp" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Налаштування персонажа та Резервна копія</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-tab-toggle-row">
          <button 
            type="button" 
            className={`sub-tab-btn ${!showJsonPanel ? 'active' : ''}`}
            onClick={() => setShowJsonPanel(false)}
          >
            Основні параметри
          </button>
          <button 
            type="button" 
            className={`sub-tab-btn ${showJsonPanel ? 'active' : ''}`}
            onClick={() => setShowJsonPanel(true)}
          >
            Експорт / Імпорт JSON
          </button>
        </div>

        {!showJsonPanel ? (
          <form onSubmit={handleSave} className="modal-form">
            <div className="form-group">
              <label>Ім’я персонажа</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="modal-input"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Клас</label>
                <input
                  type="text"
                  value={charClass}
                  onChange={e => setCharClass(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>Підклас (Archetype)</label>
                <input
                  type="text"
                  value={subclass}
                  onChange={e => setSubclass(e.target.value)}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Рівень (Lvl)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={level}
                  onChange={e => setLevel(parseInt(e.target.value, 10) || 1)}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>Макс. HP</label>
                <input
                  type="number"
                  min="1"
                  value={maxHp}
                  onChange={e => setMaxHp(parseInt(e.target.value, 10) || 1)}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>КД (AC)</label>
                <input
                  type="number"
                  min="1"
                  value={ac}
                  onChange={e => setAc(parseInt(e.target.value, 10) || 10)}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Раса та Походження</label>
                <input
                  type="text"
                  value={race}
                  onChange={e => setRace(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>Швидкість руху (Speed, фт)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={speed}
                  onChange={e => setSpeed(parseInt(e.target.value, 10) || 30)}
                  className="modal-input"
                />
              </div>
            </div>

            <h4 className="form-section-heading">Базові характеристики (Scores):</h4>
            <div className="ability-scores-edit-grid">
              <div className="ability-edit-cell">
                <label>STR</label>
                <input type="number" min="1" max="30" value={str} onChange={e => setStr(parseInt(e.target.value, 10) || 10)} />
              </div>
              <div className="ability-edit-cell">
                <label>DEX</label>
                <input type="number" min="1" max="30" value={dex} onChange={e => setDex(parseInt(e.target.value, 10) || 10)} />
              </div>
              <div className="ability-edit-cell">
                <label>CON</label>
                <input type="number" min="1" max="30" value={con} onChange={e => setCon(parseInt(e.target.value, 10) || 10)} />
              </div>
              <div className="ability-edit-cell">
                <label>INT</label>
                <input type="number" min="1" max="30" value={intScore} onChange={e => setIntScore(parseInt(e.target.value, 10) || 10)} />
              </div>
              <div className="ability-edit-cell">
                <label>WIS</label>
                <input type="number" min="1" max="30" value={wis} onChange={e => setWis(parseInt(e.target.value, 10) || 10)} />
              </div>
              <div className="ability-edit-cell">
                <label>CHA</label>
                <input type="number" min="1" max="30" value={cha} onChange={e => setCha(parseInt(e.target.value, 10) || 10)} />
              </div>
            </div>

            <div className="modal-actions-row">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Скасувати
              </button>
              <button type="submit" className="btn-save">
                <Save size={16} /> Зберегти зміни
              </button>
            </div>
          </form>
        ) : (
          <div className="backup-json-flow">
            <div className="json-export-block">
              <h4>Експорт поточного стану:</h4>
              <p className="json-hint">Скопіюйте цей JSON або збережіть як файл, щоб не втратити дані персонажа.</p>
              <button className="btn-export-copy" onClick={handleCopyJson}>
                {copiedNotification ? <Check size={16} className="text-emerald" /> : <Download size={16} />}
                <span>{copiedNotification ? 'Скопійовано в буфер!' : 'Скопіювати JSON персонажа'}</span>
              </button>
            </div>

            <div className="json-import-block">
              <h4>Імпорт з JSON:</h4>
              <textarea
                rows={4}
                placeholder="Вставте сюди JSON код персонажа..."
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                className="modal-textarea"
              />
              <button className="btn-import-apply" onClick={handleApplyImport}>
                <Upload size={16} /> Застосувати імпорт
              </button>
            </div>

            <div className="json-reset-block">
              <button 
                className="btn-danger-reset"
                onClick={() => {
                  if (confirm('Скинути всі дані персонажа до базового шаблону? Усі зміни будуть замінені.')) {
                    resetToDefault();
                    onClose();
                  }
                }}
              >
                <RotateCcw size={14} /> Скинути до початкового шаблону
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
