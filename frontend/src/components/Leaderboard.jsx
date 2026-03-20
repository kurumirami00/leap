import { useState } from 'react';

const topStudents = [
  { name: 'Clara C.', program: 'BS Computer Science', pts: '12,600', tier: 'gold' },
  { name: 'Emily W.', program: 'BS Computer Science', pts: '11,400', tier: 'silver' },
  { name: 'Maria D.', program: 'BS Computer Science', pts: '10,400', tier: 'bronze' },
  { name: 'Mia K.', program: 'BS Computer Science', pts: '6,600', tier: '' },
  { name: 'Melody M.', program: 'BS Computer Science', pts: '5,600', tier: '' },
];

const barData = [
  { name: 'Mia K.', height: 55, color: '#E07B2A' },
  { name: 'Maria D.', height: 80, color: '#b3c7a0' },
  { name: 'Clara C.', height: 100, color: '#3CB84A', crown: true },
  { name: 'Emily M.', height: 75, color: '#b3c7a0' },
  { name: 'Melody M.', height: 50, color: '#E07B2A' },
];

export default function Leaderboard() {
  const [filter, setFilter] = useState('weekly');

  return (
    <>
      <div className="page-header">
        <div className="page-header-icon">LB</div>
        <h1>LEADERBOARD</h1>
      </div>

      <div className="lb-stats">
        <div className="lb-stat">
          <div className="lb-stat-label">YOUR RANK</div>
          <div className="lb-stat-value">#12</div>
        </div>
        <div className="lb-stat">
          <div className="lb-stat-label">TOTAL POINTS</div>
          <div className="lb-stat-value">4,280</div>
        </div>
        <div className="lb-stat">
          <div className="lb-stat-label">TASK DONE</div>
          <div className="lb-stat-value">32</div>
        </div>
      </div>

      <div className="lb-mid">
        <div className="lb-left">
          <div className="lb-filters">
            {['weekly', 'monthly', 'all time'].map((f) => (
              <button
                key={f}
                className={`lb-filter ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="lb-donut-wrap">
            <svg width="110" height="110" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1a5c24" strokeWidth="14" />
              <circle
                cx="60" cy="60" r="50" fill="none" stroke="#E07B2A" strokeWidth="14"
                strokeDasharray="94 220" strokeDashoffset="0"
                strokeLinecap="round" transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="lb-donut-text">
              <div className="lb-donut-pct">30%</div>
              <div className="lb-donut-sub">12</div>
            </div>
          </div>
          <div className="lb-donut-label">YOUR RANK PROGRESS</div>
        </div>

        <div className="lb-chart-wrap">
          <div className="lb-chart">
            {barData.map((b, i) => (
              <div key={i} className="lb-bar-group">
                {b.crown && <div className="lb-crown">1st</div>}
                <div className="lb-bar-avatar">{b.name[0]}</div>
                <div className="lb-bar" style={{ height: b.height, background: b.color }} />
                <div className="lb-bar-name">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lb-tables">
        <div className="lb-table-card">
          <div className="lb-table-header">
            <span>TOP STUDENTS</span>
            <span className="lb-see-all">See all</span>
          </div>
          {topStudents.map((s, i) => (
            <div key={i} className={`lb-row ${s.tier}`}>
              <span className="lb-rank">{i + 1}</span>
              <span className="lb-info">
                <strong>{s.name}</strong><br />
                <small>{s.program}</small>
              </span>
              <span className="lb-pts">{s.pts} PTS</span>
            </div>
          ))}
        </div>

        <div className="lb-table-card">
          <div className="lb-table-header">
            <span>CLASS RANKING</span>
            <span className="lb-see-all">See all</span>
          </div>
          {topStudents.map((s, i) => (
            <div key={i} className={`lb-row ${s.tier}`}>
              <span className="lb-rank">{i + 1}</span>
              <span className="lb-info">
                <strong>{s.name}</strong><br />
                <small>Rank {[1, 5, 12, 24, 31][i]}%ile</small>
              </span>
              <span className="lb-pts">{s.pts} PTS</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
