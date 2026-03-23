import { useState } from 'react';
import { Plus, CreditCard, Landmark, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAccounts } from '../../hooks/useRealtimeData';
import { deleteAccount } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import { fmt } from '../../utils/calculations';
import AccountModal   from './AccountModal';
import ConfirmDialog  from '../ui/ConfirmDialog';
import EmptyState     from '../ui/EmptyState';
import Spinner        from '../ui/Spinner';

export default function AccountsPage() {
  const { currentUser }           = useAuth();
  const { data: accounts, loading } = useAccounts();
  const openModal                 = useAppStore(s => s.openModal);
  const modal                     = useAppStore(s => s.modal);
  const closeModal                = useAppStore(s => s.closeModal);
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setDelLoading(true);
      await deleteAccount(currentUser.uid, delTarget.id);
      toast.success(`"${delTarget.name}" deleted`);
      setDelTarget(null);
    } catch { toast.error('Delete failed'); }
    finally { setDelLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Accounts</h2>
          <p className="text-xs text-slate-400 mt-0.5">{accounts.length} account{accounts.length !== 1 ? 's' : ''} linked</p>
        </div>
        <button onClick={() => openModal('account')} className="btn-primary">
          <Plus size={15} /> Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No accounts yet"
          description="Add your credit cards and bank accounts to start tracking"
          action={<button onClick={() => openModal('account')} className="btn-primary text-xs">Add your first account</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(acc => {
            const Icon = acc.type === 'credit' ? CreditCard : Landmark;
            return (
              <div key={acc.id} className="card p-5 group relative animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/15">
                    <Icon size={20} className="text-brand-500" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('account', acc)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-400 hover:text-brand-500">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDelTarget(acc)} className="p-1.5 rounded-lg hover:bg-danger/10 text-slate-400 hover:text-danger">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{acc.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{acc.type === 'credit' ? 'Credit Card' : 'Bank Account'}</p>
                {(acc.limit || acc.balance) && (
                  <p className="text-xs font-mono font-bold text-brand-500 mt-2">
                    {acc.type === 'credit' ? `Limit: ${fmt(acc.limit)}` : `Balance: ${fmt(acc.balance)}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'account' && (
        <AccountModal isOpen onClose={closeModal} editData={modal.data} />
      )}
      <ConfirmDialog
        isOpen={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="Delete Account"
        message={`Are you sure you want to delete "${delTarget?.name}"? This won't delete related transactions.`}
      />
    </div>
  );
}
