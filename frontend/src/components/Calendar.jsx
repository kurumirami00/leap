import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const sampleEvents = {
  '3': [{ type: 'todo', name: 'Data Structures Quiz' }],
  '5': [{ type: 'deadline', name: 'Project Proposal' }],
  '10': [{ type: 'todo', name: 'Lab Report' }, { type: 'progress', name: 'Research Paper' }],
  '20': [{ type: 'deadline', name: 'Final Submission' }],
  '26': [{ type: 'todo', name: 'Data Structures Quiz' }, { type: 'deadline', name: 'Project Proposal Submission' }],
  '28': [{ type: 'progress', name: 'SE Sprint Review' }],
};

const todayTasks = [
  { name: 'Data Structures Quiz', sub: 'Due 11:59 PM - CS101', type: 'todo' },
  { name: 'Research Paper Draft', sub: '60% done - CS101', type: 'progress' },
  { name: 'Project Proposal Submission', sub: 'Deadline today - ST401', type: 'deadline' },
];

const upcoming = [
  { day: '28', month: 'Feb', name: 'SE Project Sprint Review', sub: 'SE401 - Presentation', progress: 70 },
  { day: '03', month: 'Mar', name: 'Database System Exam', sub: 'CS101 - Written / Practical', progress: 40 },
  { day: '07', month: 'Mar', name: 'Mobile App UI Submission', sub: 'IT402 Figma - Report', progress: 20 },
];

export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e${i}`} className="cal-cell empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
    const events = sampleEvents[String(d)] || [];
    cells.push(
      <div key={d} className={`cal-cell ${isToday ? 'today' : ''}`}>
        {d}
        <div>
          {events.map((ev, i) => (
            <span key={i} className={`cal-dot ${ev.type}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cal-header-row">
        <div className="page-header">
          <div className="page-header-icon">CA</div>
          <h1>CALENDAR OF ACTIVITIES</h1>
        </div>
        <div className="cal-month-badge">{MONTHS[month]} {year}</div>
      </div>

      <div className="cal-legend">
        <span className="cal-leg todo">To-Do Tasks</span>
        <span className="cal-leg progress">In-Progress</span>
        <span className="cal-leg deadline">Deadlines</span>
      </div>

      <div className="cal-body">
        <div className="cal-grid-wrap">
          <div className="cal-nav">
            <button onClick={prevMonth}>&lsaquo;</button>
            <span>{MONTHS[month]}</span>
            <button onClick={nextMonth}>&rsaquo;</button>
          </div>
          <div className="cal-grid">
            {DAYS.map((d) => (
              <div key={d} className="cal-day-header">{d}</div>
            ))}
            {cells}
          </div>
        </div>

        <div className="cal-panel">
          <div className="cal-section">
            <div className="cal-section-title">
              TODAY'S TASKS <span className="cal-count-badge">{todayTasks.length}</span>
            </div>
            {todayTasks.map((t, i) => (
              <div key={i} className="cal-task-item">
                <div>
                  <div className="cal-task-name">{t.name}</div>
                  <div className="cal-task-sub">{t.sub}</div>
                </div>
                <span className={`cal-tag ${t.type}`}>
                  {t.type === 'todo' ? 'To-Do' : t.type === 'progress' ? 'In-Progress' : 'Deadline'}
                </span>
              </div>
            ))}
          </div>

          <div className="cal-section">
            <div className="cal-section-title">UPCOMING</div>
            {upcoming.map((u, i) => (
              <div key={i} className="cal-task-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ textAlign: 'center', minWidth: 28 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--forest-green)' }}>{u.day}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--forest-green)' }}>{u.month}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="cal-task-name">{u.name}</div>
                    <div className="cal-task-sub">{u.sub}</div>
                  </div>
                </div>
                <div style={{ background: '#d0ead0', borderRadius: 4, height: 5 }}>
                  <div style={{ background: 'var(--dark-green)', height: '100%', borderRadius: 4, width: `${u.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
