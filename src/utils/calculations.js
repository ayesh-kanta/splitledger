/**
 * utils/calculations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure functions for deriving financial summaries from raw transactions.
 * All functions are side-effect free and easily unit-testable.
 */

/**
 * Build a per-friend summary from all transactions.
 * Returns a Map<friendId, { spent, received, net, transactions[] }>
 */
export function buildFriendSummaries(transactions, friends) {
  const map = new Map();

  // Pre-populate with all friends (even those with no transactions)
  friends.forEach((f) => {
    map.set(f.id, { friendId: f.id, name: f.name, avatar: f.avatar, spent: 0, received: 0, net: 0, transactions: [] });
  });

  transactions.forEach((tx) => {
    if (!map.has(tx.friendId)) return;
    const entry = map.get(tx.friendId);
    entry.transactions.push(tx);

    if (tx.type === 'expense') {
      entry.spent += tx.amount;
    } else if (tx.type === 'received') {
      entry.received += tx.amount;
    }
  });

  // Compute net: positive = they owe you, negative = you owe them
  map.forEach((entry) => { entry.net = entry.spent - entry.received; });

  return map;
}

/**
 * Build a per-account spending breakdown.
 * Returns a Map<accountId, { spent, received, net }>
 */
export function buildAccountSummaries(transactions, accounts) {
  const map = new Map();

  accounts.forEach((a) => {
    map.set(a.id, { accountId: a.id, name: a.name, type: a.type, spent: 0, received: 0, net: 0 });
  });

  transactions.forEach((tx) => {
    if (!tx.accountId || !map.has(tx.accountId)) return;
    const entry = map.get(tx.accountId);
    if (tx.type === 'expense')  entry.spent    += tx.amount;
    if (tx.type === 'received') entry.received += tx.amount;
  });

  map.forEach((entry) => { entry.net = entry.spent - entry.received; });

  return map;
}

/**
 * Compute global dashboard totals.
 */
export function buildDashboardTotals(transactions) {
  let totalLent     = 0;
  let totalReceived = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense')  totalLent     += tx.amount;
    if (tx.type === 'received') totalReceived += tx.amount;
  });

  return {
    totalLent,
    totalReceived,
    netPending: totalLent - totalReceived,
  };
}

/**
 * Filter transactions by multiple optional criteria.
 */
export function filterTransactions(transactions, { friendId, accountId, startDate, endDate, type } = {}) {
  return transactions.filter((tx) => {
    if (friendId  && tx.friendId  !== friendId)  return false;
    if (accountId && tx.accountId !== accountId) return false;
    if (type      && tx.type      !== type)       return false;
    if (startDate) {
      const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
      if (txDate < new Date(startDate)) return false;
    }
    if (endDate) {
      const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
      if (txDate > new Date(endDate))   return false;
    }
    return true;
  });
}

/**
 * Prepare monthly aggregated data for charts.
 * Returns last N months with { month, lent, received } per entry.
 */
export function buildMonthlyChartData(transactions, monthsBack = 6) {
  const now    = new Date();
  const result = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d    = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key  = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    result.push({ key, label, lent: 0, received: 0 });
  }

  transactions.forEach((tx) => {
    const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
    const key    = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
    const bucket = result.find((r) => r.key === key);
    if (!bucket) return;
    if (tx.type === 'expense')  bucket.lent     += tx.amount;
    if (tx.type === 'received') bucket.received += tx.amount;
  });

  return result;
}

/** Format currency with Indian locale (₹) by default */
export const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

/** Initials avatar from name */
export const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
