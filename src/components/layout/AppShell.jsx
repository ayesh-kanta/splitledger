/**
 * AppShell.jsx
 * The main layout: persistent sidebar (desktop) + bottom nav (mobile) + content area.
 */
import { Routes, Route } from 'react-router-dom';
import Sidebar        from './Sidebar';
import BottomNav      from './BottomNav';
import TopBar         from './TopBar';
import DashboardPage  from '../dashboard/DashboardPage';
import AccountsPage   from '../accounts/AccountsPage';
import FriendsPage    from '../friends/FriendsPage';
import TransactionsPage from '../transactions/TransactionsPage';
import { useAppStore } from '../../store/useAppStore';

export default function AppShell() {
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <Routes>
            <Route index           element={<DashboardPage />} />
            <Route path="accounts"     element={<AccountsPage />} />
            <Route path="friends"      element={<FriendsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
