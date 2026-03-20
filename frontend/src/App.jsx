import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Lessons from './components/Lessons';
import Exercises from './components/Exercises';
import Calendar from './components/Calendar';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Progress from './components/Progress';
import Profile from './components/Profile';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="progress" element={<Progress />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
