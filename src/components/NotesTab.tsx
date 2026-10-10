import React, { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import type { NoteBlock } from '../types/character';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Pin, 
  Copy, 
  Check, 
  X, 
  Sparkles,
  Scroll,
  MapPin,
  Users,
  Compass,
  Coins,
  Bookmark
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Всі', icon: <Bookmark size={14} /> },
  { id: 'general', label: 'Загальне', icon: <Scroll size={14} />, color: 'var(--blue-400)' },
  { id: 'quest', label: 'Квести', icon: <Compass size={14} />, color: 'var(--gold-400)' },
  { id: 'npc', label: 'NPC & Персонажі', icon: <Users size={14} />, color: 'var(--purple-400)' },
  { id: 'location', label: 'Локації', icon: <MapPin size={14} />, color: 'var(--emerald-400)' },
  { id: 'loot', label: 'Лут & Скарби', icon: <Coins size={14} />, color: 'var(--amber-400)' },
];

export const NotesTab: React.FC = () => {
  const { character, addNote, updateNote, deleteNote, togglePinNote } = useCharacter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [formIsPinned, setFormIsPinned] = useState(false);

  // Copy notification state
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Notes list from character
  const notes = character.notesList || [];

  const handleOpenAdd = () => {
    setEditingNoteId(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory(selectedCategory !== 'all' ? selectedCategory : 'general');
    setFormIsPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: NoteBlock) => {
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category || 'general');
    setFormIsPinned(!!note.isPinned);
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) return;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: formTitle.trim() || 'Без назви',
        content: formContent.trim(),
        category: formCategory,
        isPinned: formIsPinned
      });
    } else {
      addNote({
        title: formTitle.trim() || 'Без назви',
        content: formContent.trim(),
        category: formCategory,
        isPinned: formIsPinned
      });
    }

    setIsModalOpen(false);
    setEditingNoteId(null);
  };

  const handleCopyNote = (note: NoteBlock) => {
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNoteId(note.id);
    setTimeout(() => {
      setCopiedNoteId(null);
    }, 2000);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Видалити нотатку "${title}"?`)) {
      deleteNote(id);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      note.title.toLowerCase().includes(q) || 
      note.content.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort: pinned first, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const getCategoryMeta = (categoryId?: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[1];
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="tab-content notes-tab animate-fadeIn">
      {/* Top Header Card */}
      <section className="dashboard-card notes-header-card">
        <div className="card-header">
          <div className="card-title-group">
            <Scroll size={22} className="text-gold" />
            <div>
              <h2 className="card-title">Журнал & Нотатки</h2>
              <p className="card-subtitle">Фіксуйте події гри, таємниці, імена та здобич</p>
            </div>
          </div>
          <button 
            className="action-btn primary-btn add-note-btn"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Нова нотатка</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Пошук нотаток за назвою чи вмістом..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="styled-search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Очистити пошук"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Chips Bar */}
        <div className="notes-cat-chips-scroll">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' 
              ? notes.length 
              : notes.filter(n => n.category === cat.id).length;

            return (
              <button
                key={cat.id}
                className={`note-cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon}
                <span>{cat.label}</span>
                {count > 0 && <span className="cat-count-badge">{count}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Notes Grid / List */}
      <div className="notes-grid">
        {sortedNotes.length === 0 ? (
          <div className="empty-notes-box dashboard-card">
            <div className="empty-notes-icon-wrapper">
              <Scroll size={40} className="text-gold opacity-60" />
            </div>
            <h3>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Нічого не знайдено' 
                : 'Поки що немає нотаток'}
            </h3>
            <p>
              {searchQuery || selectedCategory !== 'all'
                ? 'Спробуйте змінити пошуковий запит або вибрати іншу категорію.'
                : 'Записуйте все важливе під час сесії — діалоги NPC, підказки майстра або плани загону!'}
            </p>
            <button 
              className="action-btn primary-btn"
              onClick={handleOpenAdd}
              style={{ marginTop: '12px' }}
            >
              <Plus size={16} />
              <span>Додати першу нотатку</span>
            </button>
          </div>
        ) : (
          sortedNotes.map(note => {
            const catMeta = getCategoryMeta(note.category);
            const isCopied = copiedNoteId === note.id;

            return (
              <article 
                key={note.id} 
                className={`note-card dashboard-card ${note.isPinned ? 'pinned' : ''}`}
              >
                {/* Note Card Top Header */}
                <div className="note-card-header">
                  <div className="note-meta-left">
                    <span className="note-category-pill" style={{ borderColor: catMeta.color }}>
                      {catMeta.icon}
                      <span>{catMeta.label}</span>
                    </span>
                    {note.createdAt && (
                      <span className="note-date">{formatDate(note.createdAt)}</span>
                    )}
                  </div>

                  <div className="note-actions-top">
                    <button
                      className={`note-action-icon-btn ${note.isPinned ? 'active-pin' : ''}`}
                      onClick={() => togglePinNote(note.id)}
                      title={note.isPinned ? 'Відкріпити нотатку' : 'Закріпити зверху'}
                    >
                      {note.isPinned ? <Pin size={15} className="text-gold" /> : <Pin size={15} />}
                    </button>
                    <button
                      className="note-action-icon-btn"
                      onClick={() => handleCopyNote(note)}
                      title="Копіювати текст"
                    >
                      {isCopied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
                    </button>
                    <button
                      className="note-action-icon-btn"
                      onClick={() => handleOpenEdit(note)}
                      title="Редагувати"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="note-action-icon-btn delete-btn"
                      onClick={() => handleDelete(note.id, note.title)}
                      title="Видалити"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Note Title */}
                <h3 className="note-title">{note.title}</h3>

                {/* Note Content Text */}
                <div className="note-content">
                  {note.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="note-paragraph">
                      {paragraph || '\u00A0'}
                    </p>
                  ))}
                </div>

                {note.isPinned && (
                  <div className="note-pinned-footer-badge">
                    <Sparkles size={12} />
                    <span>Закріплено</span>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="modal-backdrop animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal-container note-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <FileText size={20} className="text-gold" />
                <h3>{editingNoteId ? 'Редагувати нотатку' : 'Нова нотатка'}</h3>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="note-form">
              <div className="form-group">
                <label className="form-label">Заголовок</label>
                <input
                  type="text"
                  className="styled-form-input"
                  placeholder="Наприклад: Розмова з капітаном варти, Загадка на брамі..."
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Категорія</label>
                <div className="category-select-chips">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      className={`cat-chip-select-btn ${formCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setFormCategory(cat.id)}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Вміст нотатки</label>
                <textarea
                  className="styled-form-textarea"
                  placeholder="Запишіть деталі, координати, імена, плани чи здобич..."
                  rows={6}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                />
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label-custom">
                  <input
                    type="checkbox"
                    checked={formIsPinned}
                    onChange={e => setFormIsPinned(e.target.checked)}
                  />
                  <span>Закріпити нотатку нагорі (Pinned)</span>
                </label>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="action-btn secondary-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="action-btn primary-btn"
                >
                  {editingNoteId ? 'Зберегти зміни' : 'Створити нотатку'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
