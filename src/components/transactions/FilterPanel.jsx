import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function FilterPanel({ friends, accounts, onClose }) {
  const filters      = useAppStore(s => s.filters);
  const setFilter    = useAppStore(s => s.setFilter);
  const clearFilters = useAppStore(s => s.clearFilters);

  const handleClear = () => { clearFilters(); };

  return (
    <div className="card p-4 mb-4 border-brand-500/20 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-white uppercase tracking-wide">Filters</h3>
        <div className="flex gap-2">
          <button onClick={handleClear} className="text-xs text-slate-400 hover:text-brand-500 transition-colors">Clear all</button>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-400">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Friend */}
        <div>
          <label className="label">Friend</label>
          <select value={filters.friendId} onChange={e => setFilter('friendId', e.target.value)} className="input text-xs py-2">
            <option value="">All friends</option>
            {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {/* Account */}
        <div>
          <label className="label">Account</label>
          <select value={filters.accountId} onChange={e => setFilter('accountId', e.target.value)} className="input text-xs py-2">
            <option value="">All accounts</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="label">Type</label>
          <select value={filters.type} onChange={e => setFilter('type', e.target.value)} className="input text-xs py-2">
            <option value="">All types</option>
            <option value="expense">Lent</option>
            <option value="received">Received</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="label">From Date</label>
          <input type="date" value={filters.startDate} onChange={e => setFilter('startDate', e.target.value)} className="input text-xs py-2" />
        </div>

        {/* End Date */}
        <div>
          <label className="label">To Date</label>
          <input type="date" value={filters.endDate} onChange={e => setFilter('endDate', e.target.value)} className="input text-xs py-2" />
        </div>
      </div>
    </div>
  );
}
