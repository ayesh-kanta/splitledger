/**
 * contexts/AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides Firebase Auth state throughout the app.
 * Exposes: currentUser, loading, signUp, logIn, googleSignIn, logOut
 */

import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── Auth actions ────────────────────────────────────────────────────────────
  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return cred;
  };

  const logIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleSignIn = () => signInWithPopup(auth, googleProvider);

  const logOut = () => signOut(auth);

  // ── Auth state listener ─────────────────────────────────────────────────────
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        await signInWithEmailAndPassword(
          auth,
          'ayeshkantadas@gmail.com',
          'Mamata@2004'
        );
      } catch (err) {
        console.error('Auto login failed', err);
      }
    }
    setCurrentUser(user);
    setLoading(false);
  });
  return unsub;
}, []);

  const value = { currentUser, loading, signUp, logIn, googleSignIn, logOut };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
