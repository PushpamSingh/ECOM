import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye } from 'lucide-react';
import { orderApi } from '@/apiservice/commerce.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import Pagination from '@/components/common/Pagination.jsx';
import { ORDER_STATUSES } from '@/constants';
import { formatINR, formatDate } from '@/utils/format.js';

export default function AdminOrders() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', q, status, page],
    queryFn: () => orderApi.adminList({ q, status, page, limit: 12 }),
    placeholderData: (prev) => prev,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Orders</h1>
      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by order id"
              className="input pl-9"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input max-w-[180px] capitalize">
            <option value="">All Status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Order ID</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3 text-right">Items</th>
                  <th className="px-3 py-3 text-right">Total</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-semibold text-ink">{o.orderNumber}</td>
                    <td className="px-3 py-3 text-gray-600">{o.user?.name || '—'}</td>
                    <td className="px-3 py-3 text-right">{o.items.length}</td>
                    <td className="px-3 py-3 text-right font-medium">{formatINR(o.total)}</td>
                    <td className="px-3 py-3"><Badge status={o.paymentStatus} /></td>
                    <td className="px-3 py-3"><Badge status={o.orderStatus} /></td>
                    <td className="px-3 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                    <td className="px-3 py-3 text-right">
                      <Link to={`/admin/orders/${o._id}`} className="btn-outline px-3 py-1.5 text-xs">
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-gray-400">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} pages={meta?.pages} onChange={setPage} />
    </div>
  );
}
