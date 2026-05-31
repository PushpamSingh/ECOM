import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, ArrowUp, ArrowDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { bannerApi } from '@/apiservice/banner.api.js';
import { useAdminBanners } from '@/hooks/useBanners.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import Modal from '@/components/common/Modal.jsx';
import BannerCard from '@/components/store/BannerCard.jsx';
import { onImgError } from '@/utils/format.js';
import { formatDate } from '@/utils/format.js';

const TYPES = ['hero', 'offer', 'category', 'promo'];

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState(null);

  const { data: banners = [], isLoading } = useAdminBanners({ q, type, status });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['banners'] });

  const del = useMutation({ mutationFn: (id) => bannerApi.remove(id), onSuccess: () => { toast.success('Banner deleted'); invalidate(); } });
  const toggle = useMutation({ mutationFn: ({ id, isActive }) => bannerApi.setStatus(id, isActive), onSuccess: () => { toast.success('Status updated'); invalidate(); } });
  const reorder = useMutation({ mutationFn: (order) => bannerApi.reorder(order), onSuccess: invalidate });

  // Swap displayOrder with the adjacent banner.
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= banners.length) return;
    const a = banners[i];
    const b = banners[j];
    reorder.mutate([
      { id: a._id, displayOrder: b.displayOrder },
      { id: b._id, displayOrder: a.displayOrder },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Content Management</p>
          <h1 className="text-2xl font-bold text-ink">Banners</h1>
        </div>
        <Link to="/admin/banners/new" className="btn-primary"><Plus size={16} /> Add Banner</Link>
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" className="input pl-9" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input max-w-[160px] capitalize">
            <option value="">All Types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[150px]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {isLoading ? <PageLoader /> : banners.length === 0 ? (
          <EmptyState title="No banners" message="Create your first banner to show on the home page." action={<Link to="/admin/banners/new" className="btn-primary mt-2">Add Banner</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-gray-500">
                <tr><th className="px-3 py-3">Order</th><th className="px-3 py-3">Banner</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Window</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {banners.map((b, i) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-5 text-gray-500">{b.displayOrder}</span>
                        <div className="flex flex-col">
                          <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-primary-600 disabled:opacity-30"><ArrowUp size={13} /></button>
                          <button onClick={() => move(i, 1)} disabled={i === banners.length - 1} className="text-gray-400 hover:text-primary-600 disabled:opacity-30"><ArrowDown size={13} /></button>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={b.thumbnail || b.desktopImage} alt="" onError={onImgError} className="h-12 w-24 rounded border object-cover" />
                        <div><p className="font-medium text-ink line-clamp-1">{b.title}</p><p className="text-xs text-gray-400 line-clamp-1">{b.subtitle}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-3 capitalize text-gray-500">{b.bannerType}</td>
                    <td className="px-3 py-3 text-xs text-gray-500">{b.startDate ? formatDate(b.startDate) : '—'} → {b.endDate ? formatDate(b.endDate) : '∞'}</td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => toggle.mutate({ id: b._id, isActive: !b.isActive })}
                        className={`badge ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {b.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setPreview(b)} className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-gray-100" title="Preview"><Eye size={15} /></button>
                        <Link to={`/admin/banners/${b._id}`} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100" title="Edit"><Pencil size={15} /></Link>
                        <button onClick={() => window.confirm(`Delete "${b.title}"?`) && del.mutate(b._id)} className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Banner Preview" size="lg">
        {preview && <BannerCard banner={preview} eager />}
      </Modal>
    </div>
  );
}
