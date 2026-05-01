import React from 'react';
import { Check, X } from 'lucide-react';

const NotificationPanel = ({ notifications, markAllRead, onClose }) => {
  return (
    <div className="notification-panel glass-panel">
      <div className="notif-header">
        <h4>Notifications</h4>
        <div className="notif-actions">
          <button className="notif-mark-read" onClick={markAllRead}>
            <Check size={14} /> Mark all read
          </button>
          <button className="notif-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 && (
          <p className="notif-empty">No notifications yet.</p>
        )}
        {notifications.map(n => (
          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
            {!n.read && <span className="notif-dot" />}
            <div className="notif-content">
              <p className="notif-text">{n.text}</p>
              <span className="notif-time">{n.time}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .notification-panel {
          position: absolute;
          top: 90px;
          right: 40px;
          width: 380px;
          max-height: 420px;
          padding: 20px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-hover);
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .notif-header h4 { font-size: 16px; font-weight: 600; }

        .notif-actions { display: flex; align-items: center; gap: 10px; }

        .notif-mark-read {
          background: transparent;
          border: none;
          color: var(--accent-primary);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: inherit;
        }
        .notif-mark-read:hover { text-decoration: underline; }

        .notif-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          padding: 4px;
          border-radius: 4px;
        }
        .notif-close:hover { color: var(--text-primary); background: var(--bg-hover); }

        .notif-list {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .notif-list::-webkit-scrollbar { width: 4px; }
        .notif-list::-webkit-scrollbar-thumb { background: var(--bg-hover); border-radius: 4px; }

        .notif-empty { color: var(--text-muted); font-size: 14px; text-align: center; padding: 20px 0; }

        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          border-radius: var(--radius-sm);
        }
        .notif-item:hover { background: var(--bg-tertiary); }
        .notif-item.unread { background: rgba(99, 102, 241, 0.06); }

        .notif-dot {
          width: 8px;
          height: 8px;
          min-width: 8px;
          background: var(--accent-primary);
          border-radius: 50%;
          margin-top: 6px;
        }

        .notif-content { flex: 1; }
        .notif-text { font-size: 14px; color: var(--text-primary); line-height: 1.4; margin-bottom: 4px; }
        .notif-time { font-size: 12px; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
