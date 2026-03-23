import { useState, useMemo } from 'react';
import { Plus, Download, FileText, Filter, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTransactions, useFriends, useAccounts } from '../../hooks/useRealtimeData';
import { filterTransactions, fmt } from '../../utils/calculations';
import { exportCSV, exportPDF } from '../../utils/export';
import { useAppStore } from '../../store/useAppStore';
import { buildDashboardTotals } from '../../utils/calculations';
import TransactionModal from './TransactionModal';
import TransactionCard  from './TransactionCard';
import FilterPanel      from './FilterPanel';
import EmptyState       from '../ui/EmptyState';
import Spinner          from '../ui/Spinner';
import { ArrowLeftRight } from 'lucide-react';

export default function TransactionsPage() {
  const { data: txns,     loading: tL } = useTransactions();
  const { data: friends,  loading: fL } = useFriends();
  const { data: accounts, loading: aL } = useAccounts();
  const openModal  = useAppStore(s => s.openModal);
  const modal      = useAppStore(s => s.modal);
  const closeModal = useAppStore(s => s.closeModal);
  const filters    = useAppStore(s => s.filters);
  const [showFilters, setShowFilters] = useState(false);

  // Build lookup maps for display names
  const friendMap  = useMemo(() => Object.fromEntries(friends.map(f  => [f.id,  f.name])), [friends]);
  const accountMap = useMemo(() => Object.fromEntries(accounts.map(a => [a.id, a.name])), [accounts]);

  const filtered = useMemo(() => filterTransactions(txns, filters), [txns, filters]);
  const totals   = useMemo(() => buildDashboardTotals(filtered), [filtered]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleExportCSV = () => {
    if (!filtered.length) return toast.error('No transactions to export');
    exportCSV(filtered, friendMap, accountMap);
    toast.success('CSV exported');
  };
  const handleExportPDF = () => {
    if (!filtered.length) return toast.error('No transactions to export');
    exportPDF(filtered, friendMap, accountMap, totals);
    toast.success('PDF exported');
  };

  if (tL || fL || aL) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Transactions</h2>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {txns.length} shown</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowFilters(v => !v)}
            className={`btn-secondary text-xs py-2 px-3 relative ${activeFiltersCount ? 'border-brand-500/40 text-brand-500' : ''}`}>
            <Filter size={14} /> Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button onClick={handleExportCSV} className="btn-secondary text-xs py-2 px-3">
            <Download size={14} /> CSV
          </button>
          <button onClick={handleExportPDF} className="btn-secondary text-xs py-2 px-3">
            <FileText size={14} /> PDF
          </button>
          <button onClick={() => openModal('transaction')} className="btn-primary text-xs py-2 px-3">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel friends={friends} accounts={accounts} onClose={() => setShowFilters(false)} />
      )}

      {/* Summary strip */}
      {filtered.length > 0 && (
        <div className="flex gap-3 mb-4 text-xs">
          <div className="card px-3 py-2 flex-1 text-center">
            <p className="text-slate-400">Lent</p>
            <p className="font-bold font-mono text-danger">{fmt(totals.totalLent)}</p>
          </div>
          <div className="card px-3 py-2 flex-1 text-center">
            <p className="text-slate-400">Received</p>
            <p className="font-bold font-mono text-success">{fmt(totals.totalReceived)}</p>
          </div>
          <div className="card px-3 py-2 flex-1 text-center">
            <p className="text-slate-400">Net</p>
            <p className={`font-bold font-mono ${totals.netPending >= 0 ? 'text-danger' : 'text-success'}`}>
              {fmt(Math.abs(totals.netPending))}
            </p>
          </div>
        </div>
      )}

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No transactions found"
          description={activeFiltersCount ? 'Try clearing your filters' : 'Record your first shared expense'}
          action={
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <button onClick={() => useAppStore.getState().clearFilters()} className="btn-secondary text-xs">
                  <X size={13} /> Clear Filters
                </button>
              )}
              <button onClick={() => openModal('transaction')} className="btn-primary text-xs">Add Transaction</button>
            </div>
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(tx => (
            <TransactionCard
              key={tx.id}
              tx={tx}
              friendName={friendMap[tx.friendId] || 'Unknown'}
              accountName={accountMap[tx.accountId] || 'Unknown'}
              onEdit={() => openModal('transaction', tx)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'transaction' && (
        <TransactionModal isOpen onClose={closeModal} editData={modal.data} friends={friends} accounts={accounts} />
      )}
    </div>
  );
}
