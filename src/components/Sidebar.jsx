import React from 'react';
import { LayoutDashboard, CheckSquare, FileText, Calendar, Settings, LogOut, Sparkles } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <CheckSquare size={20} />, label: 'Tasks' },
    { icon: <FileText size={20} />, label: 'Notes' },
    { icon: <Calendar size={20} />, label: 'Calendar' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Sparkles size={24} color="var(--accent-primary)" />
        </div>
        <h1 className="logo-text text-accent-gradient">Aura</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`nav-item ${activeView === item.label ? 'active' : ''}`}
            onClick={() => setActiveView(item.label)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => alert('Settings coming soon!')}>
          <span className="nav-icon"><Settings size={20} /></span>
          <span className="nav-label">Settings</span>
        </button>
        <button className="nav-item text-muted" onClick={() => { if (window.confirm('Are you sure you want to logout?')) { localStorage.clear(); window.location.reload(); } }}>
          <span className="nav-icon"><LogOut size={20} /></span>
          <span className="nav-label">Logout</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: calc(100vh - 48px);
          margin: 24px 0 24px 24px;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          padding: 24px 16px;
          z-index: 10;
          flex-shrink: 0;
          background: var(--bg-secondary);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px 32px;
        }

        .logo-icon {
          background: rgba(99, 102, 241, 0.1);
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.12);
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 15px;
          font-weight: 500;
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.03) 100%);
          color: var(--accent-primary);
          border-left: 3px solid var(--accent-primary);
        }

        .nav-item.active .nav-icon { color: var(--accent-primary); }
        .nav-icon { display: flex; align-items: center; }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        .text-muted { color: var(--text-muted); }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%; height: auto; margin: 0; border-radius: 0;
            padding: 16px; flex-direction: row; justify-content: space-between; align-items: center;
          }
          .sidebar-header { padding: 0; }
          .sidebar-nav { flex-direction: row; justify-content: center; }
          .nav-label, .sidebar-footer { display: none; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
