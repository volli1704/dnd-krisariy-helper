import React, { useState } from 'react';
import './App.css';
import { CharacterProvider } from './context/CharacterContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { TabType } from './components/Navigation';
import { SpellsTab } from './components/SpellsTab';
import { StatsTab } from './components/StatsTab';
import { InventoryTab } from './components/InventoryTab';
import { NotesTab } from './components/NotesTab';
import { RulesGlossaryTab } from './components/RulesGlossaryTab';
import { DiceDrawer } from './components/DiceDrawer';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('spells');

  return (
    <div className="app-layout">
      {/* Top Fixed Header with Vitals */}
      <Header />

      {/* Main Tab View Area */}
      <main className="main-viewport">
        {activeTab === 'spells' && <SpellsTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'rules' && <RulesGlossaryTab />}
      </main>

      {/* Bottom Mobile Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Slide-Up Dice Drawer */}
      <DiceDrawer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  );
};

export default App;
