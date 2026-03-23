import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { addAccount, updateAccount } from '../../services/firestore';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

const DEFAULTS = { name: '', type: 'credit', limit: '', balance: '' };

export default function AccountModal({ isOpen, onClose, editData }) {
  const { currentUser }     = useAuth();
  const [form, setForm]     = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        name:    editData.name    || '',
        type:    editData.type    || 'credit',
        limit:   editData.limit   || '',
        balance: editData.balance || '',
      });
    } else {
      setForm(DEFAULTS);
    }
  }, [editData, isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Account name is required');
    const payload = {
      name: form.name.trim(),
      type: form.type,
      ...(form.type === 'credit' && form.limit   ? { limit:   parseFloat(form.limit)   } : {}),
      ...(form.type === 'bank'   && form.balance ? { balance: parseFloat(form.balance) } : {}),
    };
    try {
      setLoading(true);
      isEdit
        ? await updateAccount(currentUser.uid, editData.id, payload)
        : await addAccount(currentUser.uid, payload);
      toast.success(isEdit ? 'Account updated' : 'Account added');
      onClose();
    } catch { toast.error('Failed to save account'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Account' : 'Add Account'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Account Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. HDFC Regalia, SBI Savings" className="input" />
        </div>

        <div>
          <label className="label">Type *</label>
          <div className="grid grid-cols-2 gap-2">
            {[['credit', 'Credit Card'], ['bank', 'Bank Account']].map(([val, label]) => (
              <button key={val} type="button" onClick={() => set('type', val)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  form.type === val
                    ? 'bg-brand-500/10 border-brand-500/40 text-brand-500'
                    : 'border-slate-200 dark:border-surface-700 text-slate-600 dark:text-slate-400 hover:border-brand-500/30'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {form.type === 'credit' && (
          <div>
            <label className="label">Credit Limit (₹)</label>
            <input type="number" value={form.limit} onChange={e => set('limit', e.target.value)}
              placeholder="e.g. 150000" className="input" />
          </div>
        )}
        {form.type === 'bank' && (
          <div>
            <label className="label">Current Balance (₹)</label>
            <input type="number" value={form.balance} onChange={e => set('balance', e.target.value)}
              placeholder="e.g. 50000" className="input" />
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Saving…' : isEdit ? 'Update' : 'Add Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
