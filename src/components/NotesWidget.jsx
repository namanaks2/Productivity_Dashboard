import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const COLOR_OPTIONS = [
  { color: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.4)', label: 'Indigo' },
  { color: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', label: 'Green' },
  { color: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', label: 'Amber' },
  { color: 'rgba(236, 72, 153, 0.15)', borderColor: 'rgba(236, 72, 153, 0.4)', label: 'Pink' },
  { color: 'rgba(14, 165, 233, 0.15)', borderColor: 'rgba(14, 165, 233, 0.4)', label: 'Sky' },
];

const NotesWidget = ({ notes, setNotes, addNotification, searchQuery = '', fullView = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formColorIdx, setFormColorIdx] = useState(0);

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notes, searchQuery]);

  const openNewForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormContent('');
    setFormColorIdx(0);
    setShowForm(true);
  };

  const openEditForm = (note) => {
    setEditingId(note.id);
    setFormTitle(note.title);
    setFormContent(note.content);
    const idx = COLOR_OPTIONS.findIndex(c => c.color === note.color);
    setFormColorIdx(idx >= 0 ? idx : 0);
    setShowForm(true);
  };

  const saveNote = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    const colorOpt = COLOR_OPTIONS[formColorIdx];
    if (editingId) {
      setNotes(notes.map(n => n.id === editingId ? { ...n, title: formTitle.trim(), content: formContent.trim(), color: colorOpt.color, borderColor: colorOpt.borderColor, updatedAt: Date.now() } : n));
      addNotification(`📝 Note "${formTitle.trim()}" updated.`);
    } else {
      const newNote = {
        id: Date.now(),
        title: formTitle.trim(),
        content: formContent.trim(),
        color: colorOpt.color,
        borderColor: colorOpt.borderColor,
        updatedAt: Date.now()
      };
      setNotes([newNote, ...notes]);
      addNotification(`📝 Note "${newNote.title}" created.`);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const deleteNote = (id) => {
    const note = notes.find(n => n.id === id);
    setNotes(notes.filter(n => n.id !== id));
    addNotification(`🗑️ Note "${note?.title}" deleted.`);
  };

  return (
    <div className={`notes-widget glass-panel ${fullView ? 'full-view-notes' : ''}`}>
      <div className="nw-header">
        <h3>Quick Notes</h3>
        <button className="btn btn-primary btn-sm" onClick={openNewForm}>
          <Plus size={16} /> New Note
        </button>
      </div>

      {showForm && (
        <div className="nw-form-overlay" onClick={() => setShowForm(false)}>
          <form className="nw-form glass-panel" onClick={(e) => e.stopPropagation()} onSubmit={saveNote}>
            <div className="nw-form-header">
              <h4>{editingId ? 'Edit Note' : 'New Note'}</h4>
              <button type="button" className="nw-form-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <input
              type="text"
              className="input"
              placeholder="Note title..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="input nw-textarea"
              placeholder="Write your note..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={5}
            />
            <div className="nw-color-picker">
              <span className="nw-color-label">Color:</span>
              {COLOR_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={`nw-color-swatch ${formColorIdx === i ? 'selected' : ''}`}
                  style={{ backgroundColor: opt.borderColor }}
                  onClick={() => setFormColorIdx(i)}
                  title={opt.label}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary nw-save-btn">
              <Save size={16} /> {editingId ? 'Update' : 'Save'}
            </button>
          </form>
        </div>
      )}

      <div className="notes-grid">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="note-card"
            style={{ backgroundColor: note.color, borderColor: note.borderColor }}
          >
            <div className="note-header">
              <h4 className="note-title">{note.title}</h4>
              <div className="note-actions">
                <button className="note-action-btn" onClick={() => openEditForm(note)} title="Edit">
                  <Edit2 size={14} />
                </button>
                <button className="note-action-btn" onClick={() => deleteNote(note.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="note-content">{note.content}</p>
          </div>
        ))}

        <div className="note-card add-note-card" onClick={openNewForm}>
          <div className="add-note-content">
            <Plus size={24} color="var(--text-muted)" />
            <span>Click to add note</span>
          </div>
        </div>
      </div>

      <style>{`
        .notes-widget { padding: 24px; height: 100%; }
        .full-view-notes { min-height: 60vh; }
        .nw-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .nw-header h3 { font-size: 18px; font-weight: 600; }
        .btn-sm { padding: 6px 14px; font-size: 13px; border-radius: 8px; }
        .nw-form-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 200;
        }
        .nw-form {
          width: 440px; max-width: 90vw; padding: 24px;
          display: flex; flex-direction: column; gap: 14px;
          border: 1px solid var(--border-hover);
        }
        .nw-form-header { display: flex; justify-content: space-between; align-items: center; }
        .nw-form-header h4 { font-size: 18px; font-weight: 600; }
        .nw-form-close {
          background: transparent; border: none; color: var(--text-muted);
          cursor: pointer; padding: 4px; border-radius: 4px;
        }
        .nw-form-close:hover { color: var(--text-primary); background: var(--bg-hover); }
        .nw-textarea { resize: vertical; min-height: 100px; font-family: inherit; line-height: 1.5; }
        .nw-color-picker { display: flex; align-items: center; gap: 8px; }
        .nw-color-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .nw-color-swatch {
          width: 24px; height: 24px; border-radius: 50%; border: 2px solid transparent;
          cursor: pointer;
        }
        .nw-color-swatch.selected { border-color: var(--text-primary); transform: scale(1.2); }
        .nw-save-btn { align-self: flex-end; }
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
        .note-card {
          border-radius: var(--radius-md); padding: 16px; border: 1px solid;
          min-height: 140px; display: flex; flex-direction: column;
        }
        .note-card:hover { box-shadow: var(--shadow-md); }
        .note-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .note-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .note-actions { display: flex; gap: 4px; opacity: 0; }
        .note-card:hover .note-actions { opacity: 1; }
        .note-action-btn {
          background: var(--bg-hover); border: none; color: var(--text-secondary);
          width: 24px; height: 24px; border-radius: 4px; display: flex;
          align-items: center; justify-content: center; cursor: pointer;
        }
        .note-action-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .note-content {
          font-size: 14px; color: var(--text-primary); line-height: 1.5; opacity: 0.9;
          display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
        }
        .add-note-card {
          background: transparent; border: 1px dashed var(--border-color);
          cursor: pointer; justify-content: center; align-items: center;
        }
        .add-note-card:hover { background: var(--bg-tertiary); border-color: var(--accent-primary); }
        .add-note-content {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--text-muted); font-size: 14px; font-weight: 500;
        }
        .add-note-card:hover .add-note-content { color: var(--accent-primary); }
        @media (max-width: 768px) { .notes-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default NotesWidget;
