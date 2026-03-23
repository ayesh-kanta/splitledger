import { useState } from 'react';
import { Pencil, Trash2, CreditCard, Landmark, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteTransaction } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { fmt } from '../../utils/calculations';
import ConfirmDialog from '../ui/ConfirmDialog';
import Avatar from '../ui/Avatar';

export default function TransactionCard({ tx, friendName, accountName, onEdit }) {
  const { currentUser }               = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteTransaction(currentUser.uid, tx.id);
      toast.success('Transaction deleted');
    } catch { toast.error('Delete failed'); }
    finally { setLoading(false); }
  };

  const isExpense = tx.type === 'expense';
  const date = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
  const AccountIcon = tx.accountType === 'credit' ? CreditCard : Landmark;

  return (
    <>
      <div className="card px-4 py-3 flex items-center gap-3 group hover:border-brand-500/20 transition-colors animate-fade-in">
        {/* Type indicator */}
        <div className={`p-2 rounded-xl shrink-0 ${isExpense ? 'bg-danger/10' : 'bg-success/10'}`}>
          {isExpense
            ? <TrendingUp size={16} className="text-danger" />
            : <TrendingDown size={16} className="text-success" />
          }
        </div>

        {/* Friend avatar */}
        <Avatar name={friendName} size="sm" className="shrink-0 hidden sm:flex" />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 dark:text-white truncate">{friendName}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${isExpense ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              {isExpense ? 'Lent' : 'Received'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <AccountIcon size={11} /> {accountName}
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
            </span>
            {tx.notes && (
              <>
                <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-400 italic truncate max-w-[140px]">{tx.notes}</span>
              </>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <p className={`text-sm font-bold font-mono ${isExpense ? 'text-danger' : 'text-success'}`}>
            {isExpense ? '-' : '+'}{fmt(tx.amount)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-400 hover:text-brand-500">
            <Pencil size={13} />
          </button>
          <button onClick={() => setShowConfirm(true)} className="p-1.5 rounded-lg hover:bg-danger/10 text-slate-400 hover:text-danger">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Delete Transaction"
        message="This will permanently remove this transaction and affect all balances."
      />
    </>
  );
}
