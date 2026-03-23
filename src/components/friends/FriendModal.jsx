import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { addFriend, updateFriend } from '../../services/firestore';
import Modal   from '../ui/Modal';
import Spinner from '../ui/Spinner';

const DEFAULTS = { name: '', phone: '', email: '', notes: '' };

export default function FriendModal({ isOpen, onClose, editData }) {
  const { currentUser }     = useAuth();
  const [form, setForm]     = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  useEffect(() => {
    setForm(editData
      ? { name: editData.name || '', phone: editData.phone || '', email: editData.email || '', notes: editData.notes || '' }
      : DEFAULTS
    );
  }, [editData, isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    const payload = { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), notes: form.notes.trim() };
    try {
      setLoading(true);
      isEdit
        ? await updateFriend(currentUser.uid, editData.id, payload)
        : await addFriend(currentUser.uid, payload);
      toast.success(isEdit ? 'Friend updated' : `${form.name} added!`);
      onClose();
    } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Friend' : 'Add Friend'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rahul Gupta" className="input" />
        </div>
        <div>
          <label className="label">Phone</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" className="input" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="rahul@example.com" className="input" />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Any notes about this friend…"
            rows={2} className="input resize-none" />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Saving…' : isEdit ? 'Update' : 'Add Friend'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
