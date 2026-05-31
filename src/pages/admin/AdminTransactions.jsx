import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/apiservice/misc.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import { formatINR, formatDateTime } from '@/utils/format.js';

export default function AdminTransactions() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => adminApi.transactions().then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Transactions</h1>
      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">Method</th>
              <th className="px-3 py-3 text-right">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-3 py-3 font-medium text-ink">{t.order?.orderNumber || '—'}</td>
                <td className="px-3 py-3 text-gray-600">{t.user?.name || '—'}</td>
                <td className="px-3 py-3 capitalize text-gray-500">{t.method.replace('_', ' ')}</td>
                <td className="px-3 py-3 text-right font-medium">{formatINR(t.amount)}</td>
                <td className="px-3 py-3"><Badge status={t.status === 'success' ? 'paid' : t.status} /></td>
                <td className="px-3 py-3 text-gray-500">{formatDateTime(t.createdAt)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-400">No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
