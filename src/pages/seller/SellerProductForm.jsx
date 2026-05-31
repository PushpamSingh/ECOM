import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerApi } from '@/apiservice/marketplace.api.js';
import { categoryApi } from '@/apiservice/catalog.api.js';
import { useSeller } from '@/hooks/useSeller.js';
import ImageUploader from '@/components/admin/ImageUploader.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';

const blank = {
  name: '', description: '', category: '', subCategory: '', brand: '', condition: 'new',
  sellingPrice: '', mrp: '', quantity: 0, stock: 0,
  mainImage: '', gallery: [], weight: 0, length: 0, width: 0, height: 0,
  warranty: '', returnPolicy: '',
};

export default function SellerProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isApproved } = useSeller();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryApi.list({ all: 'true' }).then((r) => r.data),
  });
  const { data: existing, isLoading } = useQuery({
    queryKey: ['seller-product', id],
    queryFn: () => sellerApi.getProduct(id).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        ...blank,
        ...existing,
        category: existing.category?._id || existing.category || '',
        subCategory: existing.subCategory || '',
        gallery: existing.gallery || [],
      });
    }
  }, [existing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (submitAfter) => {
    setSaving(true);
    const payload = {
      name: form.name, description: form.description, category: form.category,
      subCategory: form.subCategory || null, brand: form.brand, condition: form.condition,
      sellingPrice: Number(form.sellingPrice), mrp: Number(form.mrp), quantity: Number(form.quantity),
      stock: Number(form.stock), mainImage: form.mainImage, gallery: form.gallery,
      weight: Number(form.weight), length: Number(form.length), width: Number(form.width),
      height: Number(form.height), warranty: form.warranty, returnPolicy: form.returnPolicy,
    };
    try {
      let productId = id;
      if (isEdit) await sellerApi.updateProduct(id, payload);
      else {
        const res = await sellerApi.createProduct(payload);
        productId = res.data._id;
      }
      if (submitAfter) await sellerApi.submitProduct(productId);
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success(submitAfter ? 'Submitted for review' : 'Saved');
      navigate('/seller');
    } catch {
      /* handled */
    } finally {
      setSaving(false);
    }
  };

  if (!isApproved) {
    return <div className="card p-8 text-center text-gray-500">Your seller account must be verified before you can list products.</div>;
  }
  if (isEdit && isLoading) return <PageLoader />;

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(false); }} className="space-y-5">
      <h2 className="text-xl font-bold text-ink">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <div className="card space-y-4 p-5">
        <h3 className="font-bold text-ink">Product Information</h3>
        <Field label="Product Name" required><input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required /></Field>
        <Field label="Description"><textarea rows={4} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category" required>
            <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)} required>
              <option value="">Select</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Brand"><input className="input" value={form.brand} onChange={(e) => set('brand', e.target.value)} /></Field>
          <Field label="Condition">
            <select className="input" value={form.condition} onChange={(e) => set('condition', e.target.value)}>
              <option value="new">New</option>
              <option value="refurbished">Refurbished</option>
              <option value="used">Used</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="font-bold text-ink">Pricing & Inventory</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Selling Price (₹)" required><input type="number" className="input" value={form.sellingPrice} onChange={(e) => set('sellingPrice', e.target.value)} required /></Field>
          <Field label="MRP (₹)"><input type="number" className="input" value={form.mrp} onChange={(e) => set('mrp', e.target.value)} /></Field>
          <Field label="Stock"><input type="number" className="input" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></Field>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="font-bold text-ink">Media</h3>
        <div>
          <label className="label">Main Image</label>
          <ImageUploader value={form.mainImage} onChange={(v) => set('mainImage', v)} />
        </div>
        <div>
          <label className="label">Gallery Images</label>
          <ImageUploader multiple value={form.gallery} onChange={(v) => set('gallery', v)} />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="font-bold text-ink">Shipping & Policies</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Weight (kg)"><input type="number" className="input" value={form.weight} onChange={(e) => set('weight', e.target.value)} /></Field>
          <Field label="Length (cm)"><input type="number" className="input" value={form.length} onChange={(e) => set('length', e.target.value)} /></Field>
          <Field label="Width (cm)"><input type="number" className="input" value={form.width} onChange={(e) => set('width', e.target.value)} /></Field>
          <Field label="Height (cm)"><input type="number" className="input" value={form.height} onChange={(e) => set('height', e.target.value)} /></Field>
        </div>
        <Field label="Warranty Information"><input className="input" value={form.warranty} onChange={(e) => set('warranty', e.target.value)} /></Field>
        <Field label="Return Policy"><input className="input" value={form.returnPolicy} onChange={(e) => set('returnPolicy', e.target.value)} /></Field>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => navigate('/seller')} className="btn-outline">Cancel</button>
        <button type="submit" className="btn-outline" disabled={saving}>Save Draft</button>
        <button type="button" onClick={() => save(true)} className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Submit for Review'}</button>
      </div>
    </form>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="label">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
