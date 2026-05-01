import React, { useRef, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';

const Header = ({ greeting, userName, searchQuery, setSearchQuery, unreadCount, showNotifications, setShowNotifications }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="header">
      <div className="header-title">
        <h2 className="greeting">{greeting}, <span className="text-accent-gradient">{userName}</span></h2>
        <p className="date-subtitle">{currentDate}</p>
      </div>

      <div className="header-actions">
        <div className="search-container glass-panel">
          <Search size={18} className="search-icon" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tasks, notes..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
          <div className="search-shortcut">⌘K</div>
        </div>

        <button
          className="btn btn-icon notification-btn glass-panel"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        <div className="user-profile">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=eef1f8"
            alt="User avatar"
            className="avatar"
          />
        </div>
      </div>

      <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .greeting {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .date-subtitle {
          color: var(--text-muted);
          font-size: 15px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-container {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 48px;
          width: 320px;
          border-radius: var(--radius-lg);
          background: var(--bg-tertiary);
        }

        .search-container:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .search-icon { color: var(--text-muted); }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          padding: 0 12px;
          font-family: inherit;
          font-size: 15px;
        }

        .search-input:focus { outline: none; }
        .search-input::placeholder { color: var(--text-muted); }

        .search-clear {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 14px;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 8px;
        }
        .search-clear:hover { color: var(--text-primary); background: var(--bg-hover); }

        .search-shortcut {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }

        .notification-btn {
          height: 48px;
          width: 48px;
          border-radius: 50%;
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 8px;
          right: 6px;
          min-width: 18px;
          height: 18px;
          background: var(--accent-tertiary);
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(236, 72, 153, 0.3);
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-profile {
          height: 48px;
          width: 48px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--accent-primary);
          padding: 2px;
          cursor: pointer;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: var(--bg-primary);
        }

        @media (max-width: 768px) {
          .header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .header-actions { width: 100%; justify-content: space-between; }
          .search-container { flex: 1; width: auto; }
        }
      `}</style>
    </header>
  );
};

export default Header;
