import { useEffect, useState } from 'react';
import api from '../api';

const placeholderTopics = [
  { id: 0, name: 'Intro to Software Eng.', modules: 5, mins: 30, status: 'orange' },
  { id: 1, name: 'Requirements Analysis', modules: 4, mins: 25, status: 'orange' },
  { id: 2, name: 'System Design', modules: 6, mins: 40, status: 'green' },
  { id: 3, name: 'Software Architecture', modules: 5, mins: 30, status: 'gray' },
  { id: 4, name: 'Testing and QA', modules: 6, mins: 30, status: 'gray' },
  { id: 5, name: 'Deployment and DevOps', modules: 5, mins: 30, status: 'gray' },
];

const placeholderCards = [
  { lesson: 'LESSON 1', title: 'What is English?', desc: 'Overview of the English language, its history, and importance.', time: '0 Min', done: true },
  { lesson: 'LESSON 2', title: 'Parts of Speech', desc: 'Nouns, verbs, adjectives, adverbs, and more explained.', time: '0 Min', done: true },
  { lesson: 'LESSON 3', title: 'Sentence Structure', desc: 'Learn how to form correct and meaningful sentences.', time: '0 Min', done: true },
  { lesson: 'LESSON 4', title: 'Basic Grammar Rules', desc: 'Understand essential grammar rules for clear communication.', time: '6 Min', done: true },
];

export default function Lessons() {
  const [courses, setCourses] = useState([]);
  const [activeTopic, setActiveTopic] = useState(0);

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data)).catch(() => {});
  }, []);

  const topics = courses.length > 0
    ? courses.map((c, i) => ({ id: i, name: c.course_name, modules: c.lesson_count || 0, mins: '--', status: i < 2 ? 'orange' : i < 3 ? 'green' : 'gray' }))
    : placeholderTopics;

  return (
    <>
      <div className="page-header">
        <div className="page-header-icon">LS</div>
        <h1>LESSONS</h1>
      </div>

      <div className="les-stats">
        <div className="les-stat">
          <span className="les-stat-num">3</span>
          <div>
            <div className="les-stat-label">Lesson Done</div>
            <div className="les-bar"><div className="les-bar-fill" style={{ width: '60%' }} /></div>
          </div>
        </div>
        <div className="les-stat">
          <span className="les-stat-num">1</span>
          <div>
            <div className="les-stat-label">In Progress</div>
            <div className="les-bar"><div className="les-bar-fill orange" style={{ width: '30%' }} /></div>
          </div>
        </div>
        <div className="les-stat">
          <span className="les-stat-num">2</span>
          <div>
            <div className="les-stat-label">Locked</div>
            <div className="les-bar"><div className="les-bar-fill gray" style={{ width: '10%' }} /></div>
          </div>
        </div>
      </div>

      <div className="les-body">
        <div className="les-topics">
          <div className="les-topics-header">
            TOPICS <span className="les-badge">{topics.length} Lessons</span>
          </div>
          {topics.map((t, i) => (
            <div
              key={t.id}
              className={`les-topic-item ${activeTopic === i ? 'active' : ''}`}
              onClick={() => setActiveTopic(i)}
            >
              <span className="les-topic-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="les-topic-name">{t.name}</div>
                <div className="les-topic-meta">{t.modules} modules &middot; {t.mins} mins</div>
              </div>
              <span className={`les-topic-dot ${t.status}`} />
            </div>
          ))}
        </div>

        <div className="les-detail">
          <div className="les-featured">
            <div className="les-featured-meta">LESSON 1 - FUNDAMENTALS</div>
            <div className="les-featured-row">
              <div>
                <h3>Introduction to English Language</h3>
                <p>Learn the basics of English, including grammar, vocabulary, sentence structure, and communication skills.</p>
              </div>
              <div className="les-pct">100%<small>Complete</small></div>
            </div>
          </div>

          <div className="les-grid">
            {placeholderCards.map((card, i) => (
              <div key={i} className={`les-card ${card.done ? 'done' : ''}`}>
                {card.done && <div className="les-card-tag">Done</div>}
                <div className="les-card-lesson">{card.lesson}</div>
                <div className="les-card-title">{card.title}</div>
                <div className="les-card-desc">{card.desc}</div>
                <div className="les-card-footer">
                  <span className="les-card-time">{card.time}</span>
                  <button className="btn-sm">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
