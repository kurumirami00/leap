export default function Assignments() {
  return (
    <div className="content-container">
      <h2>Assignments</h2>
      <p>Upload your completed assignment file. Accepted formats: .zip, .pdf, .docx</p>
      <p>📅 Due: November 25, 2025 at 11:59PM</p>
      <p>4 days remaining</p>
      <input type="file" />
      <textarea placeholder="Additional Comments (Optional)" />
      <button>Confirm</button>
    </div>
  );
}