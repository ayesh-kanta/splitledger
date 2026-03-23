import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { addTransaction, updateTransaction } from '../../services/firestore';
import Modal   from '../ui/Modal';
import Spinner from '../ui/Spinner';

const today = () => new Date().toISOString().split('T')[0];
const DEFAULTS = { friendId: '', accountId: '', type: 'expense', amount: '', date: today(), notes: '' };

export default function TransactionModal({ isOpen, onClose, editData, friends, accounts }) {
  const { currentUser }     = useAuth();
  const [form, setForm]     = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      const d = editData.date?.toDate ? editData.date.toDate() : new Date(editData.date);
      setForm({
        friendId:  editData.friendId  || '',
        accountId: editData.accountId || '',
        type:      editData.type      || 'expense',
        amount:    editData.amount    || '',
        date:      d.toISOString().split('T')[0],
        notes:     editData.notes     || '',
      });
    } else {
      setForm(DEFAULTS);
    }
  }, [editData, isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.friendId)          return toast.error('Select a friend');
    if (!form.accountId)         return toast.error('Select an account');
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
                                 return toast.error('Enter a valid amount');
    if (!form.date)              return toast.error('Select a date');

    const selectedAccount = accounts.find(a => a.id === form.accountId);
    const payload = {
      friendId:    form.friendId,
      accountId:   form.accountId,
      accountType: selectedAccount?.type || 'bank',
      type:        form.type,
      amount:      parseFloat(form.amount),
      date:        Timestamp.fromDate(new Date(form.date)),
      notes:       form.notes.trim(),
    };

    try {
      setLoading(true);
      isEdit
        ? await updateTransaction(currentUser.uid, editData.id, payload)
        : await addTransaction(currentUser.uid, payload);
      toast.success(isEdit ? 'Transaction updated' : 'Transaction recorded');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Transaction' : 'New Transaction'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div>
          <label className="label">Type *</label>
          <div className="grid grid-cols-2 gap-2">
            {[['expense', '↑ I Lent Money'], ['received', '↓ I Received Money']].map(([val, label]) => (
              <button key={val} type="button" onClick={() => set('type', val)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  form.type === val
                    ? val === 'expense'
                      ? 'bg-danger/10 border-danger/40 text-danger'
                      : 'bg-success/10 border-success/40 text-success'
                    : 'border-slate-200 dark:border-surface-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-surface-600'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Friend select */}
        <div>
          <label className="label">Friend *</label>
          <select value={form.friendId} onChange={e => set('friendId', e.target.value)} className="input">
            <option value="">Select a friend…</option>
            {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          {friends.length === 0 && (
            <p className="text-xs text-warning mt-1">⚠ Add friends first from the Friends page</p>
          )}
        </div>

        {/* Account select */}
        <div>
          <label className="label">Account Used *</label>
          <select value={form.accountId} onChange={e => set('accountId', e.target.value)} className="input">
            <option value="">Select an account…</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.type === 'credit' ? 'CC' : 'Bank'})</option>
            ))}
          </select>
          {accounts.length === 0 && (
            <p className="text-xs text-warning mt-1">⚠ Add accounts first from the Accounts page</p>
          )}
        </div>

        {/* Amount + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Amount (₹) *</label>
            <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
              placeholder="0" min="0" step="0.01" className="input" />
          </div>
          <div>
            <label className="label">Date *</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="e.g. Dinner at Pizza Hut, shared cab fare…"
            rows={2} className="input resize-none" />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Saving…' : isEdit ? 'Update' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
