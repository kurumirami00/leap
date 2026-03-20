import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const defaultTrophies = [
  { name: 'UNLOCK QUIZ', status: 'unlocked' },
  { name: 'QUIZ MASTER', status: 'unlocked' },
  { name: 'PERFECT SCORE', status: 'unlocked' },
  { name: 'EXCEL AWARD', status: 'partial' },
  { name: 'LOCKED', status: 'locked' },
  { name: 'LOCKED', status: 'locked' },
];

export default function Achievements() {
  const { user } = useContext(AuthContext);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (user && user.profile_id && user.role === 'student') {
      api.get(`/badges/student/${user.profile_id}`)
        .then((res) => setBadges(res.data))
        .catch(() => {});
    }
  }, [user]);

  const trophies = badges.length > 0
    ? badges.map((b) => ({ name: b.badge_name, status: 'unlocked' }))
    : defaultTrophies;

  return (
    <>
      <div className="page-header">
        <div className="page-header-icon">AC</div>
        <h1>ACHIEVEMENTS</h1>
      </div>

      <div className="ach-card">
        <div className="ach-body">
          <div className="ach-left">
            <div className="ach-level">LVL: 5 Scholar</div>
            <div className="ach-xp-bar">
              <div className="ach-xp-fill" style={{ width: '70%' }} />
            </div>
            <div className="ach-xp-val">1250 XP</div>
            <div className="ach-xp-next">next level : 240 XP</div>
            <div className="ach-progress-bar">
              <div className="ach-progress-fill" style={{ width: '70%' }} />
            </div>
          </div>

          <div className="ach-donut-wrap">
            <svg width="150" height="150" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="56" fill="none" stroke="#1a5c24" strokeWidth="16" />
              <circle
                cx="70" cy="70" r="56" fill="none" stroke="#E07B2A" strokeWidth="16"
                strokeDasharray="246 352" strokeDashoffset="0"
                strokeLinecap="round" transform="rotate(-90 70 70)"
              />
              <circle
                cx="70" cy="70" r="56" fill="none" stroke="#f0c040" strokeWidth="16"
                strokeDasharray="60 352" strokeDashoffset="-246"
                strokeLinecap="round" transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="ach-donut-label">70% XP</div>
          </div>
        </div>

        <div className="ach-trophy-grid">
          {trophies.map((t, i) => (
            <div key={i} className={`ach-trophy ${t.status}`}>
              <div className={`ach-trophy-icon ${t.status === 'locked' ? 'locked-icon' : ''}`}>
                {t.status === 'locked' ? 'X' : t.status === 'partial' ? '2' : '1'}
              </div>
              <div className="ach-trophy-name">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
