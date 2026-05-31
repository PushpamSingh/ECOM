import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '@/apiservice/catalog.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import Pagination from '@/components/common/Pagination.jsx';
import Rating from '@/components/common/Rating.jsx';
import { formatINR } from '@/utils/format.js';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', q, status, page],
    queryFn: () => productApi.adminList({ q, status, page, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const del = useMutation({
    mutationFn: (id) => productApi.remove(id),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by product name"
              className="input pl-9"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[180px]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">SKU</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3">Rating</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.thumbnail} alt="" className="h-12 w-12 rounded-lg border object-cover" />
                        <span className="line-clamp-1 font-medium text-ink">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500">{p.sku || '—'}</td>
                    <td className="px-3 py-3 text-right">{p.stock}</td>
                    <td className="px-3 py-3 text-right font-medium">{formatINR(p.finalPrice ?? p.price)}</td>
                    <td className="px-3 py-3"><Rating value={p.rating} size={12} /></td>
                    <td className="px-3 py-3"><Badge status={p.status} /></td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${p._id}`} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100">
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => window.confirm(`Delete "${p.name}"?`) && del.mutate(p._id)}
                          className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">No products found.</td>
                  </tr>
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
