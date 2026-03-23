/**
 * App.jsx
 * Root router — redirects unauthenticated users to /login,
 * authenticated users see the main shell with sidebar + routes.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AppShell    from './components/layout/AppShell';
import LoginPage   from './components/auth/LoginPage';
import SignupPage  from './components/auth/SignupPage';
import Spinner     from './components/ui/Spinner';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  return currentUser ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  return currentUser ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/*"      element={<PrivateRoute><AppShell /></PrivateRoute>} />
    </Routes>
  );
}
