import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import { formatDate } from '@/utils/format.js';

export default function AdminSellers() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ['admin-sellers', q, status],
    queryFn: () => marketplaceAdminApi.sellers({ q, status }).then((r) => r.data),
    placeholderData: (p) => p,
  });

  const setStatusM = useMutation({
    mutationFn: ({ id, status }) => marketplaceAdminApi.setSellerStatus(id, status),
    onSuccess: () => { toast.success('Seller updated'); queryClient.invalidateQueries({ queryKey: ['admin-sellers'] }); },
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Seller Management</h1>
      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search store / name / email" className="input pl-9" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[180px]">
            <option value="">All Status</option>
            {['pending', 'active', 'suspended', 'blocked'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {isLoading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-gray-500">
                <tr><th className="px-3 py-3">Store</th><th className="px-3 py-3">Owner</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {sellers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-ink">{s.storeName}</td>
                    <td className="px-3 py-3 text-gray-500">{s.fullName}<br /><span className="text-xs">{s.email}</span></td>
                    <td className="px-3 py-3"><Badge status={s.status === 'active' ? 'active' : s.status === 'pending' ? 'pending' : 'cancelled'}>{s.status}</Badge></td>
                    <td className="px-3 py-3 text-gray-400">{formatDate(s.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={s.status}
                          onChange={(e) => setStatusM.mutate({ id: s._id, status: e.target.value })}
                          className="input max-w-[130px] py-1.5 text-xs"
                        >
                          {['pending', 'active', 'suspended', 'blocked'].map((st) => <option key={st} value={st}>{st}</option>)}
                        </select>
                        <Link to={`/admin/sellers/${s._id}`} className="btn-outline px-3 py-1.5 text-xs"><Eye size={14} /> View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {sellers.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-400">No sellers found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
