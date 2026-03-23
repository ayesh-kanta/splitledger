/**
 * hooks/useRealtimeData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hooks for real-time Firestore subscriptions.
 * Uses onSnapshot — every change on any device instantly triggers a re-render.
 */

import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import {
  accountsRef,
  friendsRef,
  transactionsRef,
} from '../services/firestore';

// ─── Generic real-time hook ───────────────────────────────────────────────────
function useCollection(refFn, ...queryConstraints) {
  const { currentUser } = useAuth();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!currentUser) { setData([]); setLoading(false); return; }

    const ref = refFn(currentUser.uid);
    const q   = queryConstraints.length
      ? query(ref, ...queryConstraints)
      : ref;

    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { setError(err); setLoading(false); },
    );

    return unsub; // Cleans up listener on unmount / user change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  return { data, loading, error };
}

// ─── Specific hooks ───────────────────────────────────────────────────────────
export const useAccounts = () =>
  useCollection(accountsRef, orderBy('createdAt', 'asc'));

export const useFriends = () =>
  useCollection(friendsRef, orderBy('name', 'asc'));

export const useTransactions = () =>
  useCollection(transactionsRef, orderBy('date', 'desc'));
