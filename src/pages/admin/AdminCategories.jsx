import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryApi } from '@/apiservice/catalog.api.js';
import ImageUploader from '@/components/admin/ImageUploader.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';

const blank = { name: '', slug: '', description: '', image: '', parent: '', isActive: true };

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.adminList().then((r) => r.data),
  });

  const reset = () => {
    setForm(blank);
    setEditId(null);
  };

  const save = useMutation({
    mutationFn: (payload) => (editId ? categoryApi.update(editId, payload) : categoryApi.create(payload)),
    onSuccess: () => {
      toast.success(editId ? 'Category updated' : 'Category created');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      reset();
    },
  });

  const del = useMutation({
    mutationFn: (id) => categoryApi.remove(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    save.mutate({ ...form, parent: form.parent || null });
  };

  const startEdit = (c) => {
    setEditId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image: c.image || '', parent: c.parent?._id || c.parent || '', isActive: c.isActive });
  };

  const parents = categories.filter((c) => !c.parent);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Categories</h1>
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* Form */}
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <h3 className="font-bold text-ink">{editId ? 'Edit Category' : 'Add Category'}</h3>
          <ImageUploader value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Slug (optional)</label>
            <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
          </div>
          <div>
            <label className="label">Parent Category</label>
            <select className="input" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}>
              <option value="">None (top level)</option>
              {parents.filter((p) => p._id !== editId).map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-primary-600" />
            Active
          </label>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" disabled={save.isPending}>
              {editId ? 'Update' : 'Add Category'}
            </button>
            {editId && (
              <button type="button" onClick={reset} className="btn-outline">Cancel</button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="card p-4">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Slug</th>
                    <th className="px-3 py-3 text-right">Items</th>
                    <th className="px-3 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {c.image && <img src={c.image} alt="" className="h-10 w-10 rounded-lg border object-cover" />}
                          <span className="font-medium text-ink">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500">/{c.slug}</td>
                      <td className="px-3 py-3 text-right">{c.itemCount ?? 0}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(c)} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100">
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => window.confirm(`Delete "${c.name}"?`) && del.mutate(c._id)}
                            className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan={4} className="py-10 text-center text-gray-400">No categories yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
