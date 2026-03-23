import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { useAccounts, useFriends, useTransactions } from '../../hooks/useRealtimeData';
import {
  buildDashboardTotals, buildFriendSummaries, buildMonthlyChartData, fmt,
} from '../../utils/calculations';
import StatCard    from '../ui/StatCard';
import Spinner     from '../ui/Spinner';
import MonthlyChart from './MonthlyChart';
import FriendBalanceList from './FriendBalanceList';
import AccountBreakdown  from './AccountBreakdown';

export default function DashboardPage() {
  const { data: accounts,     loading: aL } = useAccounts();
  const { data: friends,      loading: fL } = useFriends();
  const { data: transactions, loading: tL } = useTransactions();

  const totals         = useMemo(() => buildDashboardTotals(transactions), [transactions]);
  const friendSummaries = useMemo(() => buildFriendSummaries(transactions, friends), [transactions, friends]);
  const chartData      = useMemo(() => buildMonthlyChartData(transactions, 6), [transactions]);

  const pendingFriends = useMemo(
    () => [...friendSummaries.values()].filter(f => f.net !== 0).length,
    [friendSummaries],
  );

  if (aL || fL || tL) {
    return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Lent"    value={fmt(totals.totalLent)}     icon={TrendingUp}   color="danger"  />
        <StatCard label="Total Received" value={fmt(totals.totalReceived)} icon={TrendingDown} color="success" />
        <StatCard label="Net Pending"   value={fmt(totals.netPending)}    icon={Clock}        color="warning" sub="awaiting repayment" />
        <StatCard label="Active Friends" value={`${pendingFriends} / ${friends.length}`} icon={Users} color="brand" sub="with pending balances" />
      </div>

      {/* Chart + Friend list */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <MonthlyChart data={chartData} />
        </div>
        <div className="lg:col-span-2">
          <FriendBalanceList summaries={[...friendSummaries.values()]} />
        </div>
      </div>

      {/* Account breakdown */}
      <AccountBreakdown accounts={accounts} transactions={transactions} />
    </div>
  );
}
