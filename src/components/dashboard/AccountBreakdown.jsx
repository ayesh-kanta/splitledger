import { useMemo } from 'react';
import { CreditCard, Landmark } from 'lucide-react';
import { buildAccountSummaries, fmt } from '../../utils/calculations';

export default function AccountBreakdown({ accounts, transactions }) {
  const summaries = useMemo(
    () => buildAccountSummaries(transactions, accounts),
    [transactions, accounts],
  );

  if (accounts.length === 0) return null;

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-white mb-4">Account-wise Spending</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map(acc => {
          const s = summaries.get(acc.id) || { spent: 0, received: 0 };
          const Icon = acc.type === 'credit' ? CreditCard : Landmark;
          const pct = acc.limit ? Math.min(100, Math.round((s.spent / acc.limit) * 100)) : null;
          return (
            <div key={acc.id} className="bg-slate-50 dark:bg-surface-900 rounded-xl p-4 border border-slate-200 dark:border-surface-700">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg bg-brand-500/10">
                  <Icon size={15} className="text-brand-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{acc.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{acc.type === 'credit' ? 'Credit Card' : 'Bank Account'}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Spent</span>
                  <span className="font-bold font-mono text-danger">{fmt(s.spent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Received</span>
                  <span className="font-bold font-mono text-success">{fmt(s.received)}</span>
                </div>
                {acc.limit && (
                  <>
                    <div className="flex justify-between text-slate-400 mt-1">
                      <span>Limit used</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-danger' : pct > 50 ? 'bg-warning' : 'bg-brand-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
