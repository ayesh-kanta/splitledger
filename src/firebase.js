/**
 * firebase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Initializes Firebase app, Auth, and Firestore.
 * All credentials are read from Vite environment variables so the actual
 * keys are never hard-coded in source files.
 */

import { initializeApp }            from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize core Firebase app
const app = initializeApp(firebaseConfig);

// Auth — export both the instance and the Google provider
export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore — enable offline persistence for PWA / offline support
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open; persistence only enabled in one tab at a time.
    console.warn('Firestore offline persistence unavailable (multiple tabs).');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support all required features.
    console.warn('Firestore offline persistence not supported in this browser.');
  }
});

export default app;
