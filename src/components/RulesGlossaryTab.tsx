import React, { useState } from 'react';
import { RULES_DATABASE } from '../data/rulesData';
import { Search, BookOpen, ShieldAlert, Swords, Moon, Sparkles, BookMarked } from 'lucide-react';

export const RulesGlossaryTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const filteredRules = RULES_DATABASE.filter(rule => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      rule.name.toLowerCase().includes(q) || 
      rule.nameUk.toLowerCase().includes(q) ||
      rule.shortSummary.toLowerCase().includes(q) ||
      rule.shortSummaryUk.toLowerCase().includes(q) ||
      rule.tags.some(t => t.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Всі правила', icon: <BookOpen size={14} /> },
    { id: 'condition', label: 'Стани (Conditions)', icon: <ShieldAlert size={14} /> },
    { id: 'action', label: 'Дії в бою (Actions)', icon: <Swords size={14} /> },
    { id: 'resting', label: 'Відпочинок (Rests)', icon: <Moon size={14} /> },
    { id: 'magic', label: 'Магія (Magic Rules)', icon: <Sparkles size={14} /> },
    { id: 'glossary', label: 'Глосарій (Glossary)', icon: <BookMarked size={14} /> }
  ];

  return (
    <div className="tab-content rules-tab animate-fadeIn">
      {/* Header & Search */}
      <section className="dashboard-card rules-header-card">
        <div className="card-header">
          <div className="card-title-group">
            <BookOpen size={20} className="text-gold" />
            <div>
              <h2 className="card-title">Довідник правил 5e & Глосарій</h2>
              <p className="card-subtitle">Швидка та точна база знань з 5e.tools</p>
            </div>
          </div>
          <span className="card-badge">Записів: {filteredRules.length}</span>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Пошук правила, стану, дії (напр. Blinded, Dodge, Concentration...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="styled-search-input"
          />
        </div>

        {/* Categories Bar */}
        <div className="rules-cat-chips-scroll">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`rule-cat-chip ${categoryFilter === cat.id ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Rules list */}
      <div className="rules-accordion-list">
        {filteredRules.length === 0 ? (
          <div className="empty-state-box">
            <p>Нічого не знайдено за запитом "{searchQuery}"</p>
          </div>
        ) : (
          filteredRules.map(rule => {
            const isExpanded = expandedRuleId === rule.id;

            return (
              <div 
                key={rule.id} 
                className={`rule-entry-card ${isExpanded ? 'expanded' : ''}`}
              >
                <div 
                  className="rule-entry-header"
                  onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                >
                  <div className="rule-titles">
                    <span className="rule-title-uk">{rule.nameUk}</span>
                    <span className="rule-title-en">{rule.name}</span>
                  </div>

                  <span className={`rule-category-badge ${rule.category}`}>
                    {rule.category}
                  </span>
                </div>

                <p className="rule-summary-text">{rule.shortSummaryUk}</p>

                {isExpanded && (
                  <div className="rule-expanded-content animate-fadeIn">
                    <div className="rule-bullets-section">
                      <h4 className="bullets-title">Деталі механіки (UA):</h4>
                      <ul className="rule-bullets-list">
                        {rule.bulletsUk.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rule-bullets-section en-reference">
                      <h4 className="bullets-title">Оригінальне правило 5e.tools (EN):</h4>
                      <ul className="rule-bullets-list">
                        {rule.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rule-footer-meta">
                      <div className="rule-tags-wrap">
                        {rule.tags.map(t => (
                          <span key={t} className="rule-tag-pill">#{t}</span>
                        ))}
                      </div>
                      {rule.source && <span className="rule-source-label">{rule.source}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
