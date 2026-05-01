import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { Clock, Video, Plus, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const CalendarWidget = ({ events, setEvents, addNotification, fullView = false }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newType, setNewType] = useState('meeting');
  const [newDuration, setNewDuration] = useState('1h');

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const eventsForDate = useMemo(() => {
    return events.filter(e => e.date === selectedDateStr).sort((a, b) => a.time.localeCompare(b.time));
  }, [events, selectedDateStr]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const eventDates = useMemo(() => new Set(events.map(e => e.date)), [events]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: newTitle.trim(),
      time: newTime,
      type: newType,
      duration: newDuration,
      date: selectedDateStr
    };
    setEvents([...events, newEvent]);
    addNotification(`📅 Event "${newEvent.title}" added for ${format(selectedDate, 'MMM d')}.`);
    setNewTitle('');
    setShowAddForm(false);
  };

  const deleteEvent = (id) => {
    const ev = events.find(e => e.id === id);
    setEvents(events.filter(e => e.id !== id));
    addNotification(`🗑️ Event "${ev?.title}" removed.`);
  };

  const formatTime12 = (time24) => {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className={`calendar-widget glass-panel ${fullView ? 'full-view-calendar' : ''}`}>
      <div className="cal-header">
        <div className="date-display">
          <div className="date-number">{format(today, 'd')}</div>
          <div className="date-details">
            <span className="date-month">{format(today, 'MMMM')}</span>
            <span className="date-day">{format(today, 'EEEE')}</span>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {fullView && (
        <div className="mini-calendar">
          <div className="mini-cal-nav">
            <button className="mini-cal-btn" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
              <ChevronLeft size={16} />
            </button>
            <span className="mini-cal-month">{format(currentMonth, 'MMMM yyyy')}</span>
            <button className="mini-cal-btn" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="mini-cal-days-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="mini-cal-day-label">{d}</div>
            ))}
          </div>
          <div className="mini-cal-grid">
            {calendarDays.map((day, i) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const hasEvent = eventDates.has(dayStr);
              return (
                <button
                  key={i}
                  className={`mini-cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'faded' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  {format(day, 'd')}
                  {hasEvent && <span className="mini-cal-event-dot" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showAddForm && (
        <form className="cal-add-form" onSubmit={addEvent}>
          <input type="text" className="input" placeholder="Event title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
          <div className="cal-form-row">
            <input type="time" className="input cal-time-input" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            <select className="input cal-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
              <option value="meeting">In Person</option>
              <option value="video">Zoom</option>
            </select>
            <select className="input cal-select" value={newDuration} onChange={(e) => setNewDuration(e.target.value)}>
              <option value="15m">15m</option>
              <option value="30m">30m</option>
              <option value="45m">45m</option>
              <option value="1h">1h</option>
              <option value="2h">2h</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Event</button>
        </form>
      )}

      <div className="events-list">
        <h4 className="events-title">
          {isSameDay(selectedDate, today) ? 'Upcoming Today' : `Events on ${format(selectedDate, 'MMM d')}`}
        </h4>

        {eventsForDate.length === 0 && (
          <p className="cal-empty">No events scheduled.</p>
        )}

        {eventsForDate.map(event => (
          <div key={event.id} className="event-item">
            <div className="event-time-col">
              <span className="event-time">{formatTime12(event.time)}</span>
              <span className="event-duration">{event.duration}</span>
            </div>
            <div className="event-details">
              <div className="event-title">{event.title}</div>
              <div className="event-meta">
                {event.type === 'video' ? <Video size={12} /> : <Clock size={12} />}
                <span>{event.type === 'video' ? 'Zoom Meeting' : 'In Person'}</span>
              </div>
            </div>
            <button className="event-delete" onClick={() => deleteEvent(event.id)} title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .calendar-widget { padding: 24px; height: 100%; display: flex; flex-direction: column; }
        .full-view-calendar { min-height: 60vh; }
        .cal-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);
        }
        .date-display { display: flex; align-items: center; gap: 12px; }
        .date-number {
          font-size: 48px; font-weight: 700; line-height: 1;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .date-details { display: flex; flex-direction: column; }
        .date-month { font-size: 16px; font-weight: 600; color: var(--text-primary); text-transform: uppercase; letter-spacing: 1px; }
        .date-day { font-size: 14px; color: var(--text-muted); }
        .btn-sm { padding: 6px 14px; font-size: 13px; border-radius: 8px; }
        .mini-calendar { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
        .mini-cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .mini-cal-month { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .mini-cal-btn {
          background: transparent; border: 1px solid var(--border-color); color: var(--text-muted);
          padding: 4px 8px; border-radius: 6px; cursor: pointer; display: flex;
        }
        .mini-cal-btn:hover { color: var(--text-primary); border-color: var(--border-hover); }
        .mini-cal-days-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
        .mini-cal-day-label { text-align: center; font-size: 11px; font-weight: 600; color: var(--text-muted); padding: 4px; text-transform: uppercase; }
        .mini-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .mini-cal-day {
          position: relative; text-align: center; padding: 6px; font-size: 13px;
          background: transparent; border: none; color: var(--text-primary); border-radius: 8px;
          cursor: pointer; font-family: inherit;
        }
        .mini-cal-day:hover { background: var(--bg-hover); }
        .mini-cal-day.faded { color: var(--text-muted); opacity: 0.5; }
        .mini-cal-day.today { background: var(--bg-tertiary); font-weight: 700; color: var(--accent-primary); }
        .mini-cal-day.selected { background: var(--accent-primary); color: white; }
        .mini-cal-event-dot {
          position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; background: var(--accent-secondary); border-radius: 50%;
        }
        .cal-add-form {
          display: flex; flex-direction: column; gap: 10px;
          background: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md);
          margin-bottom: 16px; border: 1px solid var(--border-color);
        }
        .cal-form-row { display: flex; gap: 8px; }
        .cal-time-input { width: 110px; }
        .cal-select { width: auto; font-size: 13px; cursor: pointer; }
        .events-list { display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto; }
        .events-title { font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .cal-empty { color: var(--text-muted); font-size: 14px; text-align: center; padding: 20px 0; }
        .event-item {
          display: flex; gap: 16px; padding: 12px; background: var(--bg-tertiary);
          border-radius: var(--radius-md); border-left: 3px solid var(--accent-primary);
          align-items: center;
        }
        .event-item:hover { background: var(--bg-hover); }
        .event-time-col { display: flex; flex-direction: column; min-width: 75px; gap: 4px; }
        .event-time { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .event-duration { font-size: 12px; color: var(--text-muted); }
        .event-details { display: flex; flex-direction: column; gap: 4px; border-left: 1px solid var(--border-color); padding-left: 16px; flex: 1; }
        .event-title { font-size: 15px; font-weight: 500; color: var(--text-primary); }
        .event-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
        .event-delete {
          background: transparent; border: none; color: var(--text-muted);
          cursor: pointer; padding: 6px; border-radius: 6px; opacity: 0;
        }
        .event-item:hover .event-delete { opacity: 1; }
        .event-delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
      `}</style>
    </div>
  );
};

export default CalendarWidget;
