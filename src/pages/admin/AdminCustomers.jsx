import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { adminApi } from '@/apiservice/misc.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

export default function AdminCustomers() {
  const [q, setQ] = useState('');
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers', q],
    queryFn: () => adminApi.customers({ q }).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Customers</h1>
      <div className="card p-4">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers" className="input pl-9" />
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3 text-right">Orders</th>
                  <th className="px-3 py-3 text-right">Total Spent</th>
                  <th className="px-3 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-100 font-bold text-primary-700">
                          {c.name.charAt(0)}
                        </span>
                        <div>
                          <p className="font-medium text-ink">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500">{c.phone || '—'}</td>
                    <td className="px-3 py-3 text-right">{c.totalOrders}</td>
                    <td className="px-3 py-3 text-right font-medium">{formatINR(c.totalSpent)}</td>
                    <td className="px-3 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-400">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
