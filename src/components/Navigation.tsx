import React from 'react';
import { ShieldCheck, Backpack, BookOpen, Wand2 } from 'lucide-react';
import { useCharacter } from '../context/CharacterContext';

export type TabType = 'spells' | 'stats' | 'inventory' | 'rules';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { character } = useCharacter();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'spells',
      label: 'Спели & Псі',
      icon: <Wand2 size={20} />,
      badge: character.activeConditions.length > 0 ? character.activeConditions.length : undefined
    },
    {
      id: 'stats',
      label: 'Стати',
      icon: <ShieldCheck size={20} />
    },
    {
      id: 'inventory',
      label: 'Інвентар',
      icon: <Backpack size={20} />,
      badge: character.inventory.length
    },
    {
      id: 'rules',
      label: '5e Правила',
      icon: <BookOpen size={20} />
    }
  ];

  return (
    <nav className="bottom-navigation-bar">
      <div className="nav-items-container">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon-wrapper">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="nav-tab-label">{item.label}</span>
              {isActive && <div className="nav-active-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
