import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const TITLES = {
  '/':             { title: 'Dashboard',    sub: 'Overview of all balances' },
  '/accounts':     { title: 'Accounts',     sub: 'Manage cards & bank accounts' },
  '/friends':      { title: 'Friends',      sub: 'Manage your friends list' },
  '/transactions': { title: 'Transactions', sub: 'All spending & receipts' },
};

const MODAL_MAP = {
  '/accounts':     'account',
  '/friends':      'friend',
  '/transactions': 'transaction',
};

export default function TopBar() {
  const location = useLocation();
  const setSidebarOpen = useAppStore(s => s.setSidebarOpen);
  const openModal      = useAppStore(s => s.openModal);
  const { theme, toggleTheme } = useAppStore();

  const meta   = TITLES[location.pathname] || TITLES['/'];
  const modal  = MODAL_MAP[location.pathname];

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-slate-200 dark:border-surface-700 px-4 py-3 flex items-center gap-3">
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-600 dark:text-slate-400">
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight truncate">{meta.title}</h1>
        <p className="text-xs text-slate-400 hidden sm:block">{meta.sub}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="hidden sm:flex p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-500 transition-colors">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {modal && (
          <button onClick={() => openModal(modal)} className="btn-primary py-2 px-3 text-xs">
            <Plus size={15} />
            <span className="hidden sm:inline">Add {modal.charAt(0).toUpperCase() + modal.slice(1)}</span>
          </button>
        )}
      </div>
    </header>
  );
}
