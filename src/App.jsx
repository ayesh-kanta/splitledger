import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Spinner from './components/ui/Spinner';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
  return (
    <Routes>
      <Route path="/*" element={<AppShell />} />
    </Routes>
  );
}
