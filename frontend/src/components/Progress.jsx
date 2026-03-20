import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Progress() {
  const { user } = useContext(AuthContext);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    if (user && user.profile_id && user.role === 'student') {
      api.get(`/grades/student/${user.profile_id}`)
        .then((res) => setGrades(res.data))
        .catch(() => {});
    }
  }, [user]);

  const barValues = grades.length > 0
    ? grades.slice(0, 5).map((g) => Number(g.grade_value) || 0)
    : [50, 70, 90, 80, 30];

  return (
    <>
      <div className="page-header">
        <div className="page-header-icon">PR</div>
        <h1>PROGRESS</h1>
      </div>

      <div className="prg-card">
        <div className="prg-title">OVERVIEW</div>

        <div className="prg-stats">
          <div className="prg-stat">
            <div className="prg-stat-label">COMPLETED</div>
            <div className="prg-stat-val">{grades.length || '80'}/20</div>
          </div>
          <div className="prg-stat">
            <div className="prg-stat-label">OVERALL GRADE</div>
            <div className="prg-stat-val">92%</div>
          </div>
          <div className="prg-stat">
            <div className="prg-stat-label">STREAK</div>
            <div className="prg-stat-val">6 DAYS</div>
          </div>
        </div>

        <div className="prg-charts">
          <div className="prg-chart-card">
            <div className="prg-chart-title">SUBJECT SCORES</div>
            <div className="prg-bar-chart">
              {barValues.map((v, i) => (
                <div key={i} className="prg-bar-group">
                  <div className="prg-bar-label">{v}%</div>
                  <div className={`prg-bar ${v < 40 ? 'low' : ''}`} style={{ height: v }} />
                </div>
              ))}
            </div>
          </div>

          <div className="prg-chart-card">
            <div className="prg-chart-title">COURSE COMPLETED</div>
            <div className="prg-donut-wrap">
              <svg width="110" height="110" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#d0ead0" strokeWidth="14" />
                <circle
                  cx="60" cy="60" r="48" fill="none" stroke="#f0b800" strokeWidth="14"
                  strokeDasharray="113 302" strokeDashoffset="0"
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                />
                <circle
                  cx="60" cy="60" r="48" fill="none" stroke="var(--dark-green)" strokeWidth="14"
                  strokeDasharray="189 302" strokeDashoffset="-113"
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="prg-donut-label">37%</div>
            </div>
          </div>
        </div>

        <div className="prg-timeline">
          <div className="prg-timeline-title">ACTIVITY TIMELINE</div>
          <div className="prg-timeline-list">
            <div className="prg-timeline-item">
              <div className="prg-tl-icon">OK</div>
              <span>QUIZ COMPLETED</span>
            </div>
            <div className="prg-timeline-item">
              <div className="prg-tl-icon">AW</div>
              <span>EARN AWARD</span>
            </div>
            <div className="prg-timeline-item">
              <div className="prg-tl-icon">SB</div>
              <span>SUBMITTED ASSIGNMENT</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
