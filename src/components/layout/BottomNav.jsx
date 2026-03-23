import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Users, ArrowLeftRight } from 'lucide-react';
import { clsx } from 'clsx';

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Home'         },
  { to: '/accounts',     icon: CreditCard,       label: 'Accounts'    },
  { to: '/friends',      icon: Users,            label: 'Friends'     },
  { to: '/transactions', icon: ArrowLeftRight,   label: 'Transactions'},
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-surface-800 border-t border-slate-200 dark:border-surface-700 flex safe-bottom">
      {NAV.map(({ to, icon: Icon, label }) => {
        const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
        return (
          <Link key={to} to={to} className={clsx(
            'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors',
            active ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400',
          )}>
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
