import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { calculateTotalWeight, calculateCarryingCapacity } from '../utils/dndUtils';
import type { InventoryItem } from '../types/character';
import { 
  Backpack, 
  Coins, 
  Plus, 
  Trash2, 
  Search, 
  Shield, 
  Sparkles, 
  X, 
  AlertTriangle,
  Feather
} from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { 
    character, 
    updateCharacter, 
    addItem, 
    updateItem, 
    deleteItem, 
    toggleEquipItem, 
    toggleAttuneItem 
  } = useCharacter();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('adventuring');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemWeight, setNewItemWeight] = useState(1);
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemRarity, setNewItemRarity] = useState<InventoryItem['rarity']>('common');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemReqAttune, setNewItemReqAttune] = useState(false);

  const totalWeight = calculateTotalWeight(character.inventory, character.currency);
  const { carryingCap } = calculateCarryingCapacity(character.abilities.STR.score);
  const weightPercent = Math.min(100, Math.round((totalWeight / carryingCap) * 100));
  const isEncumbered = totalWeight > carryingCap;

  const attunedCount = character.inventory.filter(i => i.attuned).length;

  // Filtered inventory
  const filteredItems = character.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      weight: newItemWeight,
      cost: newItemCost || undefined,
      rarity: newItemRarity,
      requiresAttunement: newItemReqAttune,
      attuned: false,
      equipped: false,
      description: newItemDesc.trim() || 'Без опису'
    });

    // Reset form
    setNewItemName('');
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemWeight(1);
    setNewItemCost('');
    setNewItemReqAttune(false);
    setIsAddModalOpen(false);
  };

  const handleCurrencyChange = (coin: keyof typeof character.currency, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    updateCharacter(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        [coin]: num
      }
    }));
  };

  return (
    <div className="tab-content inventory-tab animate-fadeIn">
      {/* 1. Currency Purse & Weight Status */}
      <section className="dashboard-card currency-card">
        <div className="card-header">
          <div className="card-title-group">
            <Coins size={18} className="text-gold" />
            <h2 className="card-title">Гаманець та Вага (Purse & Weight)</h2>
          </div>
          <span className="card-badge">
            Налаштовано: {attunedCount} / 3
          </span>
        </div>

        {/* Gold Only Purse row */}
        <div className="gold-purse-container">
          <div className="gold-main-display">
            <div className="gold-icon-title">
              <span className="gold-coin-symbol">🪙</span>
              <div className="gold-text-meta">
                <span className="gold-title-label">Золото (GP)</span>
                <span className="gold-subtitle-hint">Основна ігрова валюта</span>
              </div>
            </div>

            <div className="gold-input-box">
              <input
                type="number"
                min="0"
                value={character.currency.gp}
                onChange={e => handleCurrencyChange('gp', e.target.value)}
                className="gold-large-input"
              />
              <span className="gold-unit-tag">GP</span>
            </div>
          </div>

          <div className="gold-quick-actions">
            <button type="button" className="gold-adj-btn minus" onClick={() => handleCurrencyChange('gp', String(Math.max(0, character.currency.gp - 10)))}>-10</button>
            <button type="button" className="gold-adj-btn minus" onClick={() => handleCurrencyChange('gp', String(Math.max(0, character.currency.gp - 5)))}>-5</button>
            <button type="button" className="gold-adj-btn minus" onClick={() => handleCurrencyChange('gp', String(Math.max(0, character.currency.gp - 1)))}>-1</button>
            <button type="button" className="gold-adj-btn plus" onClick={() => handleCurrencyChange('gp', String(character.currency.gp + 1))}>+1</button>
            <button type="button" className="gold-adj-btn plus" onClick={() => handleCurrencyChange('gp', String(character.currency.gp + 5))}>+5</button>
            <button type="button" className="gold-adj-btn plus" onClick={() => handleCurrencyChange('gp', String(character.currency.gp + 10))}>+10</button>
            <button type="button" className="gold-adj-btn plus" onClick={() => handleCurrencyChange('gp', String(character.currency.gp + 50))}>+50</button>
          </div>
        </div>

        {/* Encumbrance bar */}
        <div className="encumbrance-container">
          <div className="encumbrance-header">
            <div className="enc-title-group">
              <Feather size={14} />
              <span>Загальна вага спорядження:</span>
            </div>
            <span className="enc-values">
              <strong>{totalWeight}</strong> / {carryingCap} фунтів (lbs)
            </span>
          </div>

          <div className="enc-progress-track">
            <div 
              className={`enc-progress-fill ${isEncumbered ? 'overload' : ''}`}
              style={{ width: `${weightPercent}%` }}
            />
          </div>

          {isEncumbered && (
            <div className="encumbrance-warning animate-pulse">
              <AlertTriangle size={14} />
              <span>Перевантаження! Швидкість персонажа знижується на 20 фт.</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Inventory Items List */}
      <section className="dashboard-card">
        <div className="card-header">
          <div className="card-title-group">
            <Backpack size={18} className="text-amber" />
            <h2 className="card-title">Рюкзак та Предмети</h2>
          </div>
          <button 
            className="btn-add-item-header"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={15} /> Додати предмет
          </button>
        </div>

        {/* Search and Category filters */}
        <div className="inventory-filters-row">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Пошук предметів..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="styled-search-input"
            />
          </div>

          <div className="category-scroll-chips">
            {['all', 'weapon', 'armor', 'potion', 'magic', 'adventuring'].map(cat => (
              <button
                key={cat}
                className={`cat-chip ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat === 'all' ? 'Всі' :
                 cat === 'weapon' ? 'Зброя' :
                 cat === 'armor' ? 'Обладунки' :
                 cat === 'potion' ? 'Зілля' :
                 cat === 'magic' ? 'Магічні' : 'Спорядження'}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards */}
        <div className="items-list-container">
          {filteredItems.length === 0 ? (
            <div className="empty-state-box">
              <p>Предметів не знайдено</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="inventory-item-row">
                <div className="item-row-main">
                  <div className="item-title-line">
                    <span className="item-name">{item.name}</span>
                    {item.rarity && item.rarity !== 'common' && (
                      <span className={`rarity-badge ${item.rarity}`}>{item.rarity}</span>
                    )}
                    {item.equipped && <span className="tag-equipped">Одягнено</span>}
                    {item.attuned && <span className="tag-attuned">Налаштовано ✦</span>}
                  </div>

                  <p className="item-desc">{item.description}</p>

                  <div className="item-meta-pills">
                    <span className="meta-pill">Вага: {item.weight} lbs</span>
                    {item.cost && <span className="meta-pill">Ціна: {item.cost}</span>}
                    {item.properties && item.properties.length > 0 && (
                      <span className="meta-pill">{item.properties.join(', ')}</span>
                    )}
                  </div>
                </div>

                {/* Right Actions / Controls */}
                <div className="item-row-controls">
                  <div className="qty-counter">
                    <button 
                      className="qty-btn"
                      onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                    >
                      -
                    </button>
                    <span className="qty-number">x{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-button-actions">
                    {(item.category === 'weapon' || item.category === 'armor' || item.category === 'magic') && (
                      <button
                        className={`item-toggle-btn ${item.equipped ? 'active' : ''}`}
                        onClick={() => toggleEquipItem(item.id)}
                        title="Одягти / Зняти"
                      >
                        <Shield size={14} />
                      </button>
                    )}

                    {item.requiresAttunement && (
                      <button
                        className={`item-toggle-btn attune ${item.attuned ? 'active' : ''}`}
                        onClick={() => toggleAttuneItem(item.id)}
                        title="Налаштування на предмет (Attunement)"
                      >
                        <Sparkles size={14} />
                      </button>
                    )}

                    <button
                      className="item-delete-btn"
                      onClick={() => {
                        if (confirm(`Видалити предмет "${item.name}"?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      title="Видалити"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-scaleUp">
            <div className="modal-header">
              <h3 className="modal-title">Додати новий предмет</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="modal-form">
              <div className="form-group">
                <label>Назва предмета *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Кинджал Отрути"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Категорія</label>
                  <select 
                    value={newItemCategory} 
                    onChange={e => setNewItemCategory(e.target.value as any)}
                    className="modal-input"
                  >
                    <option value="adventuring">Спорядження</option>
                    <option value="weapon">Зброя</option>
                    <option value="armor">Обладунок</option>
                    <option value="potion">Зілля</option>
                    <option value="scroll">Сувій</option>
                    <option value="magic">Магічний предмет</option>
                    <option value="quest">Квестовий</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Рідкість</label>
                  <select 
                    value={newItemRarity} 
                    onChange={e => setNewItemRarity(e.target.value as any)}
                    className="modal-input"
                  >
                    <option value="common">Звичайний (Common)</option>
                    <option value="uncommon">Незвичайний (Uncommon)</option>
                    <option value="rare">Рідкісний (Rare)</option>
                    <option value="very-rare">Дуже рідкісний (Very Rare)</option>
                    <option value="legendary">Легендарний (Legendary)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Кількість</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={e => setNewItemQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label>Вага (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newItemWeight}
                    onChange={e => setNewItemWeight(parseFloat(e.target.value) || 0)}
                    className="modal-input"
                  />
                </div>

                <div className="form-group">
                  <label>Ціна</label>
                  <input
                    type="text"
                    placeholder="напр. 50 gp"
                    value={newItemCost}
                    onChange={e => setNewItemCost(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newItemReqAttune}
                    onChange={e => setNewItemReqAttune(e.target.checked)}
                  />
                  <span>Потребує налаштування (Requires Attunement)</span>
                </label>
              </div>

              <div className="form-group">
                <label>Опис та властивості</label>
                <textarea
                  rows={3}
                  placeholder="Опишіть властивості або дію предмета..."
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  className="modal-textarea"
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>
                  Скасувати
                </button>
                <button type="submit" className="btn-save">
                  Зберегти предмет
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
