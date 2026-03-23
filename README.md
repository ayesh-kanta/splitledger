# 💰 SplitLedger — Real-Time Expense & Lending Tracker

A production-ready, PWA-enabled React application for tracking shared expenses across multiple devices in real-time. Built with Firebase, Zustand, Tailwind CSS, and Recharts.

---

## ✨ Features

- 🔐 **Authentication** — Email/password + Google OAuth via Firebase Auth
- ⚡ **Real-Time Sync** — Firestore `onSnapshot` listeners push changes to all devices instantly
- 💳 **Account Management** — Track credit cards (with limits) and bank accounts
- 👥 **Friend Management** — Full contact profiles with spending summaries
- 📊 **Smart Calculations** — Auto-computed balances per friend and per account
- 📈 **Dashboard** — Charts, stat cards, and visual breakdowns
- 🔍 **Filters** — Filter by friend, account, type, and date range
- 📤 **Export** — Download data as CSV or PDF
- 🌙 **Dark/Light Mode** — Persisted theme preference
- 📱 **PWA** — Installable on phone, offline-capable via service worker
- 📶 **Offline Support** — Firestore IndexedDB persistence keeps data available

---

## 🗂 Project Structure

```
expense-tracker/
├── public/
│   └── icons/                  # PWA icons (192x192, 512x512)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── layout/
│   │   │   ├── AppShell.jsx    # Main layout wrapper
│   │   │   ├── Sidebar.jsx     # Desktop sidebar navigation
│   │   │   ├── BottomNav.jsx   # Mobile bottom navigation
│   │   │   └── TopBar.jsx      # Header with context actions
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MonthlyChart.jsx
│   │   │   ├── FriendBalanceList.jsx
│   │   │   └── AccountBreakdown.jsx
│   │   ├── accounts/
│   │   │   ├── AccountsPage.jsx
│   │   │   └── AccountModal.jsx
│   │   ├── friends/
│   │   │   ├── FriendsPage.jsx
│   │   │   └── FriendModal.jsx
│   │   ├── transactions/
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── TransactionCard.jsx
│   │   │   ├── TransactionModal.jsx
│   │   │   └── FilterPanel.jsx
│   │   └── ui/                 # Reusable primitives
│   │       ├── Avatar.jsx
│   │       ├── ConfirmDialog.jsx
│   │       ├── EmptyState.jsx
│   │       ├── Modal.jsx
│   │       ├── Spinner.jsx
│   │       └── StatCard.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx     # Firebase Auth state + actions
│   ├── hooks/
│   │   └── useRealtimeData.js  # onSnapshot hooks per collection
│   ├── services/
│   │   └── firestore.js        # All Firestore CRUD operations
│   ├── store/
│   │   └── useAppStore.js      # Zustand: UI state, theme, filters
│   ├── utils/
│   │   ├── calculations.js     # Pure financial computation functions
│   │   └── export.js           # CSV + PDF export helpers
│   ├── firebase.js             # Firebase app init
│   ├── App.jsx                 # Routes + auth guards
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind base + component classes
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Setup Guide

### 1. Clone and Install

```bash
git clone https://github.com/yourname/splitledger.git
cd splitledger
npm install
```

### 2. Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"**, give it a name (e.g. `splitledger`)
3. Disable Google Analytics (optional), create project

### 3. Enable Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. **Sign-in method** tab → Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (requires OAuth consent screen in Google Cloud Console)

### 4. Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in production mode"**
3. Select your nearest region (e.g. `asia-south1` for India)
4. Deploy these security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Firebase Config

1. Firebase Console → Project Settings (⚙️) → **General** tab
2. Scroll to **"Your apps"** → Click **Web** icon (`</>`)
3. Register app (e.g. `splitledger-web`), copy the config object

### 6. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=splitledger-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=splitledger-xxxx
VITE_FIREBASE_STORAGE_BUCKET=splitledger-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 7. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

When prompted:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Add environment variables in Vercel dashboard → Project → Settings → Environment Variables.

### Deploy to Netlify

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

Or connect your GitHub repo and set:
- Build command: `npm run build`
- Publish directory: `dist`

Add environment variables in Netlify dashboard → Site settings → Environment.

### Firebase Hosting (Alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📱 PWA Installation

On mobile Chrome or Safari:
- Visit your deployed URL
- Tap **"Add to Home Screen"** banner or use browser menu
- The app installs as a native-like app with offline support

---

## 🔒 Security Notes

- All Firestore rules are scoped to `request.auth.uid == userId` — users can never access each other's data
- API keys in `.env` are safe to expose in client bundles (Firebase uses domain allowlisting)
- Never commit your `.env` file — it's in `.gitignore`
- For production, add your domain to Firebase Auth → Authorized domains

---

## 🔧 Firestore Indexes

Firestore will prompt you to create composite indexes the first time certain queries run. The required indexes are:

| Collection       | Fields                        | Order      |
|-----------------|-------------------------------|------------|
| `transactions`  | `date` Descending             | Auto       |
| `accounts`      | `createdAt` Ascending         | Auto       |
| `friends`       | `name` Ascending              | Auto       |

Click the link in your browser console error to auto-create them, or add via Firebase Console → Firestore → Indexes.

---

## 🛠 Tech Stack

| Layer          | Technology                    |
|---------------|-------------------------------|
| Frontend       | React 18, Vite                |
| Routing        | React Router v6               |
| Auth           | Firebase Authentication       |
| Database       | Firebase Firestore (realtime) |
| State (UI)     | Zustand (persisted)           |
| Styling        | Tailwind CSS v3               |
| Charts         | Recharts                      |
| Export         | jsPDF + Papaparse             |
| Notifications  | react-hot-toast               |
| Icons          | Lucide React                  |
| PWA            | vite-plugin-pwa (Workbox)     |

---

## 📄 License

MIT — free to use, modify, and deploy.
