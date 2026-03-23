/**
 * store/useAppStore.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Zustand store for UI state (theme, active sidebar section, open modals,
 * filter state). Firestore data lives in real-time hooks, not here.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // ── Theme ──────────────────────────────────────────────────────────────
      theme: 'dark',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),

      // ── Sidebar / navigation ───────────────────────────────────────────────
      activeSection: 'dashboard',
      setActiveSection: (activeSection) => set({ activeSection }),

      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // ── Modals ─────────────────────────────────────────────────────────────
      modal: null, // { type: 'account'|'friend'|'transaction', data?: {...} }
      openModal:  (type, data = null) => set({ modal: { type, data } }),
      closeModal: ()                  => set({ modal: null }),

      // ── Filters (transaction list) ─────────────────────────────────────────
      filters: { friendId: '', accountId: '', startDate: '', endDate: '', type: '' },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      clearFilters: () =>
        set({ filters: { friendId: '', accountId: '', startDate: '', endDate: '', type: '' } }),
    }),
    {
      name: 'splitledger-ui',
      partialize: (s) => ({ theme: s.theme }), // Only persist theme
    },
  ),
);
