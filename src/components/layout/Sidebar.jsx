import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Users, ArrowLeftRight, X, LogOut, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import Avatar from '../ui/Avatar';
import { toast } from 'react-hot-toast';

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/accounts',     icon: CreditCard,       label: 'Accounts'     },
  { to: '/friends',      icon: Users,            label: 'Friends'      },
  { to: '/transactions', icon: ArrowLeftRight,   label: 'Transactions' },
];

export default function Sidebar({ mobile, onClose }) {
  const { currentUser, logOut } = useAuth();
  const { theme, toggleTheme }  = useAppStore();
  const location = useLocation();

  const handleLogout = async () => {
    try { await logOut(); } catch { toast.error('Logout failed'); }
  };

  return (
    <aside className={clsx(
      'flex flex-col h-full bg-white dark:bg-surface-800 border-r border-slate-200 dark:border-surface-700',
      mobile ? 'w-72' : 'hidden lg:flex w-64 shrink-0',
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-surface-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-lg">₹</div>
          <span className="font-bold text-slate-800 dark:text-white text-base">SplitLedger</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-500">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} onClick={mobile ? onClose : undefined}
              className={clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-700 hover:text-slate-800 dark:hover:text-white',
              )}>
              <Icon size={18} className={active ? 'text-brand-500' : ''} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-surface-700 space-y-2">
        <button onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-900">
          <Avatar name={currentUser?.displayName || currentUser?.email} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{currentUser?.displayName || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-400 hover:text-danger transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
