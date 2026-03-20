const exercises = [
  { title: 'Grammar Quiz', subject: 'ENG101 - English Grammar', deadline: 'March 5, 2026', progress: 65, color: 'orange' },
  { title: 'Essay Writing Task', subject: 'ENG201 - Writing Skills', deadline: 'March 10, 2026', progress: 30, color: 'purple' },
  { title: 'Reading Comprehension', subject: 'ENG102 - Reading Skills', deadline: 'March 7, 2026', progress: 80, color: 'red' },
  { title: 'Vocabulary Practice', subject: 'ENG103 - Vocabulary Building', deadline: 'March 15, 2026', progress: 15, color: 'dark' },
];

export default function Exercises() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-icon">EX</div>
        <h1>EXERCISES</h1>
      </div>

      <div className="ex-grid">
        {exercises.map((ex, i) => (
          <div key={i} className={`ex-card ${ex.color}`}>
            <div>
              <div className="ex-label">EXERCISE TITLE:</div>
              <div className="ex-value">{ex.title}</div>
              <div className="ex-label">SUBJECT:</div>
              <div className="ex-value">{ex.subject}</div>
              <div className="ex-label">DEADLINE:</div>
              <div className="ex-value">{ex.deadline}</div>
            </div>
            <div className="ex-actions">
              <button className="ex-btn light">View</button>
              <button className="ex-btn accent">Details</button>
            </div>
            <div className="ex-bar">
              <div className="ex-bar-fill" style={{ width: `${ex.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
