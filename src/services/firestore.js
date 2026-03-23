/**
 * services/firestore.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All Firestore CRUD operations, organized by collection.
 * Real-time listeners are handled via onSnapshot in custom hooks.
 *
 * Firestore structure (per user):
 *   users/{uid}/accounts/{accountId}
 *   users/{uid}/friends/{friendId}
 *   users/{uid}/transactions/{transactionId}
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── Collection ref helpers ───────────────────────────────────────────────────
export const accountsRef    = (uid) => collection(db, 'users', uid, 'accounts');
export const friendsRef     = (uid) => collection(db, 'users', uid, 'friends');
export const transactionsRef = (uid) => collection(db, 'users', uid, 'transactions');

export const accountDoc     = (uid, id) => doc(db, 'users', uid, 'accounts', id);
export const friendDoc      = (uid, id) => doc(db, 'users', uid, 'friends', id);
export const transactionDoc = (uid, id) => doc(db, 'users', uid, 'transactions', id);

// ─── Accounts ─────────────────────────────────────────────────────────────────
export const addAccount = (uid, data) =>
  addDoc(accountsRef(uid), { ...data, createdAt: serverTimestamp() });

export const updateAccount = (uid, id, data) =>
  updateDoc(accountDoc(uid, id), { ...data, updatedAt: serverTimestamp() });

export const deleteAccount = (uid, id) =>
  deleteDoc(accountDoc(uid, id));

// ─── Friends ──────────────────────────────────────────────────────────────────
export const addFriend = (uid, data) =>
  addDoc(friendsRef(uid), { ...data, createdAt: serverTimestamp() });

export const updateFriend = (uid, id, data) =>
  updateDoc(friendDoc(uid, id), { ...data, updatedAt: serverTimestamp() });

export const deleteFriend = (uid, id) =>
  deleteDoc(friendDoc(uid, id));

// ─── Transactions ─────────────────────────────────────────────────────────────
export const addTransaction = (uid, data) =>
  addDoc(transactionsRef(uid), { ...data, createdAt: serverTimestamp() });

export const updateTransaction = (uid, id, data) =>
  updateDoc(transactionDoc(uid, id), { ...data, updatedAt: serverTimestamp() });

export const deleteTransaction = (uid, id) =>
  deleteDoc(transactionDoc(uid, id));

/**
 * Batch-delete all transactions for a friend (used when deleting a friend).
 * Pass an array of transaction docs to delete.
 */
export const batchDeleteTransactions = async (uid, transactionIds) => {
  const batch = writeBatch(db);
  transactionIds.forEach((id) => batch.delete(transactionDoc(uid, id)));
  return batch.commit();
};

// ─── Query helpers ────────────────────────────────────────────────────────────
export const transactionsQuery = (uid) =>
  query(transactionsRef(uid), orderBy('date', 'desc'));
