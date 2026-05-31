import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { couponApi } from '@/apiservice/commerce.api.js';
import Modal from '@/components/common/Modal.jsx';
import Badge from '@/components/common/Badge.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const blank = {
  name: '',
  code: '',
  discountType: 'percent',
  discountValue: 10,
  minOrderValue: 0,
  maxDiscount: 0,
  startDate: toInput(new Date()),
  endDate: toInput(new Date(Date.now() + 30 * 864e5)),
  usageLimit: 0,
  isActive: true,
};

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blank);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => couponApi.list().then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (payload) => (editId ? couponApi.update(editId, payload) : couponApi.create(payload)),
    onSuccess: () => {
      toast.success(editId ? 'Coupon updated' : 'Coupon created');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setOpen(false);
    },
  });

  const del = useMutation({
    mutationFn: (id) => couponApi.remove(id),
    onSuccess: () => {
      toast.success('Coupon deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
  });

  const openCreate = () => {
    setEditId(null);
    setForm(blank);
    setOpen(true);
  };
  const openEdit = (c) => {
    setEditId(c._id);
    setForm({ ...c, startDate: toInput(c.startDate), endDate: toInput(c.endDate) });
    setOpen(true);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Coupons</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="card p-4">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Code</th>
                  <th className="px-3 py-3">Discount</th>
                  <th className="px-3 py-3">Validity</th>
                  <th className="px-3 py-3 text-right">Used</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-ink">{c.name}</td>
                    <td className="px-3 py-3">
                      <span className="badge bg-gray-100 font-mono text-gray-700">{c.code}</span>
                    </td>
                    <td className="px-3 py-3">
                      {c.discountType === 'percent' ? `${c.discountValue}%` : formatINR(c.discountValue)}
                    </td>
                    <td className="px-3 py-3 text-gray-500">
                      {formatDate(c.startDate)} – {formatDate(c.endDate)}
                    </td>
                    <td className="px-3 py-3 text-right">{c.usedCount}</td>
                    <td className="px-3 py-3"><Badge status={c.status} /></td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => window.confirm(`Delete coupon "${c.code}"?`) && del.mutate(c._id)}
                          className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">No coupons yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? 'Edit Coupon' : 'Add Coupon'}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={() => save.mutate({ ...form, discountValue: Number(form.discountValue) })} className="btn-primary" disabled={save.isPending}>
              {editId ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Code</label>
            <input className="input uppercase" value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.discountType} onChange={(e) => set('discountType', e.target.value)}>
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </div>
          <div>
            <label className="label">Discount Value</label>
            <input type="number" className="input" value={form.discountValue} onChange={(e) => set('discountValue', e.target.value)} />
          </div>
          <div>
            <label className="label">Min Order (₹)</label>
            <input type="number" className="input" value={form.minOrderValue} onChange={(e) => set('minOrderValue', Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Max Discount (₹, 0 = none)</label>
            <input type="number" className="input" value={form.maxDiscount} onChange={(e) => set('maxDiscount', Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Usage Limit (0 = ∞)</label>
            <input type="number" className="input" value={form.usageLimit} onChange={(e) => set('usageLimit', Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Start Date</label>
            <input type="date" className="input" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="date" className="input" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="accent-primary-600" />
            Active
          </label>
        </div>
      </Modal>
    </div>
  );
}
