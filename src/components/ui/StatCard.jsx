import { clsx } from 'clsx';

export default function StatCard({ label, value, icon: Icon, color = 'brand', sub, trend }) {
  const colorMap = {
    brand:   'bg-brand-500/10 text-brand-500',
    success: 'bg-success/10 text-success',
    danger:  'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
  };
  return (
    <div className="card p-5 flex items-start gap-4 animate-fade-in">
      <div className={clsx('p-2.5 rounded-xl shrink-0', colorMap[color])}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide truncate">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5 font-mono">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
