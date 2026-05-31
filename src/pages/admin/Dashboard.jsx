import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingBag, IndianRupee, Users, Clock } from 'lucide-react';
import { adminApi } from '@/apiservice/misc.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#7a1f1f'];

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard().then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return <div className="card p-10 text-center text-gray-400">Could not load dashboard. Please retry.</div>;
  }

  const {
    stats = {},
    salesByMonth = [],
    topCategories = [],
    recentOrders = [],
    recentTransactions = [],
  } = data;
  const maxSale = Math.max(...salesByMonth.map((m) => m.total), 1);
  const totalSold = topCategories.reduce((s, c) => s + c.sold, 0) || 1;

  const cards = [
    { label: 'Orders Received', value: stats.ordersReceived, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Revenue', value: formatINR(stats.totalRevenue), icon: IndianRupee, color: 'bg-green-100 text-green-600' },
    { label: 'New Customers', value: stats.newCustomers, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <span className={`grid h-12 w-12 place-items-center rounded-xl ${c.color}`}>
              <c.icon size={22} />
            </span>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-ink">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-5 font-bold text-ink">Sales This Year</h3>
          <div className="flex h-56 items-end gap-2">
            {salesByMonth.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-primary-500 transition-all hover:bg-primary-600"
                    style={{ height: `${(m.total / maxSale) * 100}%` }}
                    title={formatINR(m.total)}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{MONTHS[m.month - 1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top categories */}
        <div className="card p-6">
          <h3 className="mb-5 font-bold text-ink">Top Selling Categories</h3>
          {topCategories.length === 0 ? (
            <p className="text-sm text-gray-400">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topCategories.map((c, i) => (
                <div key={c.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">{c.name}</span>
                    <span className="font-medium">{c.sold}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${(c.sold / totalSold) * 100}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-ink">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm font-semibold text-primary-600">View All</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <Link
                key={o._id}
                to={`/admin/orders/${o._id}`}
                className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{o.user?.name} • {formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatINR(o.total)}</span>
                  <Badge status={o.orderStatus} />
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-gray-400">No orders yet.</p>}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-ink">Recent Transactions</h3>
            <Link to="/admin/transactions" className="text-sm font-semibold text-primary-600">View All</Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <div key={t._id} className="flex items-center justify-between rounded-lg p-2">
                <div>
                  <p className="text-sm font-semibold text-ink">{t.user?.name || 'Customer'}</p>
                  <p className="text-xs text-gray-500 capitalize">{t.method.replace('_', ' ')} • {formatDate(t.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatINR(t.amount)}</span>
                  <Badge status={t.status === 'success' ? 'paid' : t.status} />
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && <p className="text-sm text-gray-400">No transactions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
