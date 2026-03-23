import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Users, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFriends, useTransactions } from '../../hooks/useRealtimeData';
import { deleteFriend } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import { buildFriendSummaries, fmt } from '../../utils/calculations';
import FriendModal    from './FriendModal';
import ConfirmDialog  from '../ui/ConfirmDialog';
import EmptyState     from '../ui/EmptyState';
import Avatar         from '../ui/Avatar';
import Spinner        from '../ui/Spinner';

export default function FriendsPage() {
  const { currentUser }              = useAuth();
  const { data: friends, loading: fL } = useFriends();
  const { data: txns,    loading: tL } = useTransactions();
  const openModal  = useAppStore(s => s.openModal);
  const modal      = useAppStore(s => s.modal);
  const closeModal = useAppStore(s => s.closeModal);
  const [delTarget, setDelTarget]     = useState(null);
  const [delLoading, setDelLoading]   = useState(false);

  const summaries = useMemo(() => buildFriendSummaries(txns, friends), [txns, friends]);

  const handleDelete = async () => {
    try {
      setDelLoading(true);
      await deleteFriend(currentUser.uid, delTarget.id);
      toast.success(`"${delTarget.name}" removed`);
      setDelTarget(null);
    } catch { toast.error('Delete failed'); }
    finally { setDelLoading(false); }
  };

  if (fL || tL) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Friends</h2>
          <p className="text-xs text-slate-400 mt-0.5">{friends.length} friend{friends.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => openModal('friend')} className="btn-primary">
          <Plus size={15} /> Add Friend
        </button>
      </div>

      {friends.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No friends added"
          description="Add your friends to start tracking shared expenses"
          action={<button onClick={() => openModal('friend')} className="btn-primary text-xs">Add first friend</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {friends.map(f => {
            const s = summaries.get(f.id) || { spent: 0, received: 0, net: 0 };
            return (
              <div key={f.id} className="card p-4 flex items-center gap-4 group animate-fade-in">
                <Avatar name={f.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{f.name}</p>
                      {f.phone && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone size={11} /> {f.phone}
                        </p>
                      )}
                      {f.email && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <Mail size={11} /> {f.email}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => openModal('friend', f)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-400 hover:text-brand-500">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDelTarget(f)} className="p-1.5 rounded-lg hover:bg-danger/10 text-slate-400 hover:text-danger">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-100 dark:border-surface-700">
                    <div className="text-xs">
                      <span className="text-slate-400">Lent </span>
                      <span className="font-bold font-mono text-danger">{fmt(s.spent)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400">Rcvd </span>
                      <span className="font-bold font-mono text-success">{fmt(s.received)}</span>
                    </div>
                    {s.net !== 0 && (
                      <div className="ml-auto">
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                          s.net > 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                        }`}>
                          {s.net > 0 ? `Owes ${fmt(s.net)}` : `You owe ${fmt(Math.abs(s.net))}`}
                        </span>
                      </div>
                    )}
                    {s.net === 0 && s.spent > 0 && (
                      <span className="ml-auto text-xs text-success font-semibold">✓ Settled</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal?.type === 'friend' && (
        <FriendModal isOpen onClose={closeModal} editData={modal.data} />
      )}
      <ConfirmDialog
        isOpen={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="Remove Friend"
        message={`Remove "${delTarget?.name}"? Their transaction history will be kept.`}
      />
    </div>
  );
}
