import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TasksWidget from './components/TasksWidget';
import NotesWidget from './components/NotesWidget';
import CalendarWidget from './components/CalendarWidget';
import WeatherWidget from './components/WeatherWidget';
import NotificationPanel from './components/NotificationPanel';
import './App.css';

const DEFAULT_TASKS = [
  { id: 1, title: 'Finish Capstone MVP', category: 'Project', completed: false, priority: 'high', createdAt: Date.now() },
  { id: 2, title: 'Review PR for Dashboard API', category: 'Work', completed: false, priority: 'medium', createdAt: Date.now() },
  { id: 3, title: 'Design system updates', category: 'Design', completed: true, priority: 'low', createdAt: Date.now() },
  { id: 4, title: 'Prepare slides for demo', category: 'Project', completed: false, priority: 'high', createdAt: Date.now() }
];

const DEFAULT_NOTES = [
  { id: 1, title: 'Capstone Ideas', content: 'Focus on UI/UX with smooth animations. Use dark mode by default. Add some mock AI suggestions to fulfill the requirement.', color: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.4)', updatedAt: Date.now() },
  { id: 2, title: 'Meeting Notes: Sarah', content: 'Discussed API integration. Need to fix the CORS issue on the backend. Next sync is on Thursday.', color: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', updatedAt: Date.now() },
  { id: 3, title: 'Shopping List', content: 'Coffee beans, oat milk, sparkling water, snacks for the coding session.', color: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', updatedAt: Date.now() }
];

const DEFAULT_EVENTS = [
  { id: 1, title: 'Capstone Demo', time: '10:00', type: 'meeting', duration: '1h', date: new Date().toISOString().split('T')[0] },
  { id: 2, title: 'Sync with Mentor', time: '14:30', type: 'video', duration: '30m', date: new Date().toISOString().split('T')[0] },
  { id: 3, title: 'Design Review', time: '16:00', type: 'meeting', duration: '45m', date: new Date().toISOString().split('T')[0] }
];

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

function App() {
  const [greeting, setGreeting] = useState('Good morning');
  const [activeView, setActiveView] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState(() => loadFromStorage('aura_tasks', DEFAULT_TASKS));
  const [notes, setNotes] = useState(() => loadFromStorage('aura_notes', DEFAULT_NOTES));
  const [events, setEvents] = useState(() => loadFromStorage('aura_events', DEFAULT_EVENTS));
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome back! You have 3 tasks due today.', time: 'Just now', read: false },
    { id: 2, text: 'AI suggestion: Draft outline for Capstone Presentation.', time: '5m ago', read: false },
    { id: 3, text: 'Reminder: Sync with Mentor at 2:30 PM.', time: '1h ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => { localStorage.setItem('aura_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('aura_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('aura_events', JSON.stringify(events)); }, [events]);

  const addNotification = useCallback((text) => {
    setNotifications(prev => [{ id: Date.now(), text, time: 'Just now', read: false }, ...prev]);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  const renderView = () => {
    switch (activeView) {
      case 'Tasks':
        return (
          <div className="full-view">
            <TasksWidget tasks={tasks} setTasks={setTasks} addNotification={addNotification} fullView />
          </div>
        );
      case 'Notes':
        return (
          <div className="full-view">
            <NotesWidget notes={notes} setNotes={setNotes} addNotification={addNotification} fullView />
          </div>
        );
      case 'Calendar':
        return (
          <div className="full-view">
            <CalendarWidget events={events} setEvents={setEvents} addNotification={addNotification} fullView />
          </div>
        );
      default:
        return (
          <div className="dashboard-grid">
            <div>
              <WeatherWidget />
            </div>
            <div className="grid-col-span-2">
              <TasksWidget tasks={tasks} setTasks={setTasks} addNotification={addNotification} searchQuery={searchQuery} />
            </div>
            <div className="grid-col-span-1">
              <CalendarWidget events={events} setEvents={setEvents} addNotification={addNotification} />
            </div>
            <div className="grid-col-span-3">
              <NotesWidget notes={notes} setNotes={setNotes} addNotification={addNotification} searchQuery={searchQuery} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="main-content">
        <Header
          greeting={greeting}
          userName="Alex"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        {showNotifications && (
          <NotificationPanel
            notifications={notifications}
            markAllRead={markAllRead}
            onClose={() => setShowNotifications(false)}
          />
        )}

        {renderView()}
      </main>

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 32px 40px;
          position: relative;
        }

        .main-content::-webkit-scrollbar { width: 8px; }
        .main-content::-webkit-scrollbar-track { background: transparent; }
        .main-content::-webkit-scrollbar-thumb { background: var(--bg-hover); border-radius: var(--radius-lg); }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 24px;
          padding-bottom: 40px;
        }

        .grid-col-span-2 { grid-column: span 2; }
        .grid-col-span-3 { grid-column: span 3; }

        .full-view {
          flex: 1;
          margin-top: 24px;
          padding-bottom: 40px;
        }

        @media (max-width: 1200px) {
          .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
          .grid-col-span-3 { grid-column: span 2; }
        }

        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .grid-col-span-2, .grid-col-span-3 { grid-column: span 1; }
          .app-container { flex-direction: column; }
          .main-content { padding: 20px; }
        }
      `}</style>
    </div>
  );
}

export default App;
