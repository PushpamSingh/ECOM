import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi, categoryApi } from '@/apiservice/catalog.api.js';
import ImageUploader from '@/components/admin/ImageUploader.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';

const blank = {
  name: '',
  shortDescription: '',
  description: '',
  price: '',
  discountType: 'none',
  discountValue: 0,
  sku: '',
  stock: 0,
  category: '',
  brand: '',
  tags: '',
  images: [],
  status: 'active',
  featured: false,
  shipping: { weight: 0, cost: 0, width: 0, height: 0 },
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryApi.list({ all: 'true' }).then((r) => r.data),
  });

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => productApi.adminGet(id).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        ...blank,
        ...existing,
        category: existing.category?._id || existing.category || '',
        tags: (existing.tags || []).join(', '),
        shipping: existing.shipping || blank.shipping,
      });
    }
  }, [existing]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setShip = (key, value) => setForm((f) => ({ ...f, shipping: { ...f.shipping, [key]: value } }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      discountValue: Number(form.discountValue),
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      thumbnail: form.images[0] || form.thumbnail || '',
    };
    try {
      if (isEdit) await productApi.update(id, payload);
      else await productApi.create(payload);
      toast.success(isEdit ? 'Product updated' : 'Product created');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    } catch {
      /* handled */
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/products')} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-ink">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="General">
            <Field label="Product Name" required>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
            <Field label="Short Description">
              <input className="input" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea
                rows={5}
                className="input"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Supports basic HTML"
              />
            </Field>
          </Section>

          <Section title="Pricing & Inventory">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Base Price (₹)" required>
                <input type="number" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} required />
              </Field>
              <Field label="SKU">
                <input className="input" value={form.sku} onChange={(e) => set('sku', e.target.value)} />
              </Field>
              <Field label="Stock Quantity">
                <input type="number" className="input" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
              </Field>
              <Field label="Discount Type">
                <select className="input" value={form.discountType} onChange={(e) => set('discountType', e.target.value)}>
                  <option value="none">No Discount</option>
                  <option value="fixed">Fixed (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
              </Field>
              {form.discountType !== 'none' && (
                <Field label={form.discountType === 'percent' ? 'Discount %' : 'Discount ₹'}>
                  <input type="number" className="input" value={form.discountValue} onChange={(e) => set('discountValue', e.target.value)} />
                </Field>
              )}
            </div>
          </Section>

          <Section title="Shipping">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Weight (kg)">
                <input type="number" step="0.01" className="input" value={form.shipping.weight} onChange={(e) => setShip('weight', Number(e.target.value))} />
              </Field>
              <Field label="Shipping Cost (₹)">
                <input type="number" className="input" value={form.shipping.cost} onChange={(e) => setShip('cost', Number(e.target.value))} />
              </Field>
              <Field label="Brand">
                <input className="input" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
              </Field>
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Image">
            <ImageUploader multiple value={form.images} onChange={(v) => set('images', v)} />
          </Section>

          <Section title="Organization">
            <Field label="Category" required>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Tags (comma separated)">
              <input className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="rose, premium" />
            </Field>
            <Field label="Status">
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </Field>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-primary-600" />
              Featured product
            </label>
          </Section>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">Cancel</button>
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Update Product' : 'Publish Product'}</button>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-bold text-ink">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
