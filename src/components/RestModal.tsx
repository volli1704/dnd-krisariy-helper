import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { calculateModifier } from '../utils/dndUtils';
import { Moon, Sun, X, Check } from 'lucide-react';

interface RestModalProps {
  mode: 'short' | 'long';
  onClose: () => void;
}

export const RestModal: React.FC<RestModalProps> = ({ mode, onClose }) => {
  const { character, performShortRest, performLongRest } = useCharacter();
  const [diceCount, setDiceCount] = useState<number>(1);

  const conMod = calculateModifier(character.abilities.CON.score);
  const maxAvailableDice = character.hitDice.current;

  const handleConfirmShortRest = () => {
    performShortRest(diceCount, conMod);
    onClose();
  };

  const handleConfirmLongRest = () => {
    performLongRest();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content rest-modal-card animate-scaleUp" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            {mode === 'short' ? (
              <>
                <Moon size={22} className="text-amber" />
                <h3 className="modal-title">Короткий відпочинок (Short Rest)</h3>
              </>
            ) : (
              <>
                <Sun size={22} className="text-gold" />
                <h3 className="modal-title">Довгий відпочинок (Long Rest)</h3>
              </>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {mode === 'short' ? (
            <div className="rest-content-flow">
              <p className="rest-info-paragraph">
                Триває 1 годину. Ви можете витратити Кістки Здоров’я ({character.hitDice.dieType}), щоб відновити хіти. До кожного кидка додається ваш модифікатор Тілобудови (+{conMod}).
              </p>

              <div className="hit-dice-picker-box">
                <div className="dice-picker-top">
                  <span>Витратити Кісток Здоров’я:</span>
                  <span className="avail-badge">Доступно: {maxAvailableDice} / {character.hitDice.total}</span>
                </div>

                <div className="dice-counter-controls">
                  <button 
                    className="dice-counter-btn"
                    disabled={diceCount <= 0}
                    onClick={() => setDiceCount(Math.max(0, diceCount - 1))}
                  >
                    -
                  </button>
                  <span className="dice-counter-val">{diceCount} {character.hitDice.dieType}</span>
                  <button 
                    className="dice-counter-btn"
                    disabled={diceCount >= maxAvailableDice}
                    onClick={() => setDiceCount(Math.min(maxAvailableDice, diceCount + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="rest-benefits-preview">
                <h4 className="benefits-title">✦ Автоматично відновляться:</h4>
                <ul className="benefits-list">
                  <li>Всі чарунки Чаклуна (Warlock Pact Slots)</li>
                  <li>Особливості Short Rest (Hexblade's Curse, Action Surge, Second Wind)</li>
                  <li>Кістки переваги (Superiority Dice)</li>
                </ul>
              </div>

              <div className="modal-actions-row">
                <button className="btn-cancel" onClick={onClose}>
                  Скасувати
                </button>
                <button className="btn-save btn-confirm-rest" onClick={handleConfirmShortRest}>
                  <Check size={16} /> Закінчити відпочинок
                </button>
              </div>
            </div>
          ) : (
            <div className="rest-content-flow">
              <p className="rest-info-paragraph">
                Триває 8 годин (не менше 6 годин сну). Повний відпочинок повертає сили до максимуму.
              </p>

              <div className="rest-benefits-preview long-rest">
                <h4 className="benefits-title">✦ Результати довгого відпочинку:</h4>
                <ul className="benefits-list">
                  <li><strong>HP:</strong> Повне відновлення до максимуму ({character.hp.max} HP).</li>
                  <li><strong>Hit Dice:</strong> Відновлення {Math.max(1, Math.floor(character.hitDice.total / 2))} {character.hitDice.dieType}.</li>
                  <li><strong>Слоти:</strong> Повне відновлення всіх чарунок заклинань.</li>
                  <li><strong>Ресурси:</strong> Скидання всіх лічильників здібностей.</li>
                  <li><strong>Стани:</strong> Очищення тимчасових станів та Death Saves.</li>
                </ul>
              </div>

              <div className="modal-actions-row">
                <button className="btn-cancel" onClick={onClose}>
                  Скасувати
                </button>
                <button className="btn-save btn-confirm-rest long" onClick={handleConfirmLongRest}>
                  <Sun size={16} /> Провести Довгий Відпочинок
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
