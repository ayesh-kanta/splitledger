import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { fmt } from '../../utils/calculations';
import EmptyState from '../ui/EmptyState';
import { Users } from 'lucide-react';

export default function FriendBalanceList({ summaries }) {
  const navigate = useNavigate();
  const sorted = [...summaries].sort((a, b) => Math.abs(b.net) - Math.abs(a.net)).slice(0, 6);

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-white">Friend Balances</h2>
        <button onClick={() => navigate('/friends')} className="text-xs text-brand-500 hover:text-brand-400">View all</button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Users} title="No balances yet" description="Add friends and record transactions" />
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto">
          {sorted.map(s => (
            <div key={s.friendId} className="flex items-center gap-3 py-1">
              <Avatar name={s.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{s.name}</p>
                <p className="text-xs text-slate-400">
                  {s.net === 0 ? 'Settled' : s.net > 0 ? 'Owes you' : 'You owe'}
                </p>
              </div>
              <span className={`text-xs font-bold font-mono ${s.net > 0 ? 'text-danger' : s.net < 0 ? 'text-success' : 'text-slate-400'}`}>
                {s.net === 0 ? '—' : fmt(Math.abs(s.net))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
