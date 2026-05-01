import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';

const CATEGORIES = ['Project', 'Work', 'Design', 'Personal'];
const PRIORITIES = ['high', 'medium', 'low'];

const TasksWidget = ({ tasks, setTasks, addNotification, searchQuery = '', fullView = false }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Project');
  const [newPriority, setNewPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (filter === 'active') filtered = filtered.filter(t => !t.completed);
    if (filter === 'completed') filtered = filtered.filter(t => t.completed);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return filtered;
  }, [tasks, filter, searchQuery]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed };
        if (updated.completed) addNotification(`✅ Task "${t.title}" completed!`);
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    addNotification(`🗑️ Task "${task?.title}" deleted.`);
    setOpenMenuId(null);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
      priority: newPriority,
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
    addNotification(`📝 New task added: "${newTask.title}"`);
    setNewTitle('');
    setShowAddForm(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const priorityColors = {
    high: 'var(--accent-tertiary)',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <div className={`tasks-widget glass-panel ${fullView ? 'full-view-widget' : ''}`}>
      <div className="tw-header">
        <div className="tw-title-row">
          <h3>Today's Tasks</h3>
          <span className="tw-progress">{completedCount}/{tasks.length} done • {progressPercent}%</span>
        </div>
        <div className="tw-actions-row">
          <div className="tw-filters">
            {['all', 'active', 'completed'].map(f => (
              <button key={f} className={`tw-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>
      </div>

      <div className="tw-progress-bar">
        <div className="tw-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {showAddForm && (
        <form className="tw-add-form" onSubmit={addTask}>
          <input
            type="text"
            className="input tw-add-input"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="tw-form-row">
            <select className="input tw-select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input tw-select" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      )}

      <div className="tasks-list">
        {filteredTasks.length === 0 && (
          <div className="tw-empty">
            <p>{searchQuery ? 'No tasks match your search.' : filter === 'completed' ? 'No completed tasks yet.' : 'All tasks done! 🎉'}</p>
          </div>
        )}
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <button className="task-check" onClick={() => toggleTask(task.id)}>
              {task.completed ? (
                <CheckCircle2 size={20} color="var(--accent-primary)" />
              ) : (
                <Circle size={20} color="var(--text-muted)" />
              )}
            </button>

            <div className="task-content" onClick={() => toggleTask(task.id)}>
              <span className="task-title">{task.title}</span>
              <div className="task-meta">
                <span className="task-category">{task.category}</span>
                {!task.completed && (
                  <span className="task-priority-label" style={{ color: priorityColors[task.priority] }}>
                    {task.priority}
                  </span>
                )}
              </div>
            </div>

            <div className="task-options-wrap">
              <button className="task-options" onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}>
                <MoreHorizontal size={18} />
              </button>
              {openMenuId === task.id && (
                <div className="task-dropdown">
                  <button className="task-dropdown-item delete" onClick={() => deleteTask(task.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .tasks-widget { padding: 24px; height: 100%; display: flex; flex-direction: column; }
        .full-view-widget { min-height: 60vh; }
        .tw-header { margin-bottom: 16px; }
        .tw-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .tw-title-row h3 { font-size: 18px; font-weight: 600; }
        .tw-progress { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .tw-actions-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .tw-filters { display: flex; gap: 6px; }
        .tw-filter-btn {
          background: transparent; border: 1px solid var(--border-color); color: var(--text-muted);
          padding: 5px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit;
        }
        .tw-filter-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .tw-filter-btn.active { background: var(--accent-primary); border-color: var(--accent-primary); color: white; }
        .btn-sm { padding: 6px 14px; font-size: 13px; border-radius: 8px; }
        .tw-progress-bar {
          width: 100%; height: 4px; background: var(--bg-tertiary); border-radius: 4px;
          margin-bottom: 16px; overflow: hidden;
        }
        .tw-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 4px;
        }
        .tw-add-form {
          display: flex; flex-direction: column; gap: 10px;
          background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md);
          margin-bottom: 16px; border: 1px solid var(--border-color);
        }
        .tw-add-input { font-size: 15px; }
        .tw-form-row { display: flex; gap: 10px; }
        .tw-select { width: auto; padding: 8px 12px; font-size: 14px; cursor: pointer; }
        .tasks-list { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; flex: 1; }
        .tasks-list::-webkit-scrollbar { width: 4px; }
        .tasks-list::-webkit-scrollbar-thumb { background: var(--bg-hover); border-radius: 4px; }
        .tw-empty { text-align: center; color: var(--text-muted); padding: 32px 0; font-size: 15px; }
        .task-item {
          display: flex; align-items: center; padding: 14px 16px;
          background: var(--bg-tertiary); border: 1px solid transparent;
          border-radius: var(--radius-md); cursor: pointer;
        }
        .task-item:hover { background: var(--bg-hover); border-color: var(--border-color); }
        .task-check {
          background: transparent; border: none; display: flex; align-items: center;
          justify-content: center; cursor: pointer; margin-right: 14px; flex-shrink: 0;
        }
        .task-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .task-title { font-size: 15px; font-weight: 500; color: var(--text-primary); }
        .task-meta { display: flex; align-items: center; gap: 8px; }
        .task-category { font-size: 12px; color: var(--text-muted); background: var(--bg-secondary); padding: 2px 8px; border-radius: 4px; }
        .task-priority-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .task-item.completed .task-title { color: var(--text-muted); text-decoration: line-through; }
        .task-item.completed .task-category { opacity: 0.6; }
        .task-options-wrap { position: relative; }
        .task-options {
          background: transparent; border: none; color: var(--text-muted);
          cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0;
        }
        .task-item:hover .task-options { opacity: 1; }
        .task-options:hover { background: var(--bg-secondary); color: var(--text-primary); }
        .task-dropdown {
          position: absolute; right: 0; top: 28px; background: var(--bg-secondary);
          border: 1px solid var(--border-hover); border-radius: 8px; padding: 4px;
          z-index: 20; min-width: 120px; box-shadow: var(--shadow-md);
        }
        .task-dropdown-item {
          display: flex; align-items: center; gap: 8px; width: 100%;
          padding: 8px 12px; background: transparent; border: none;
          color: var(--text-secondary); font-size: 13px; font-family: inherit;
          cursor: pointer; border-radius: 6px;
        }
        .task-dropdown-item.delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      `}</style>
    </div>
  );
};

export default TasksWidget;
