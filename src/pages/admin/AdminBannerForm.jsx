import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { bannerApi } from '@/apiservice/banner.api.js';
import ImageUploader from '@/components/admin/ImageUploader.jsx';
import BannerCard from '@/components/store/BannerCard.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';

const blank = {
  title: '', subtitle: '', description: '', desktopImage: '', mobileImage: '',
  buttonText: '', buttonLink: '', bannerType: 'hero', displayOrder: 0, isActive: true,
  startDate: '', endDate: '', textPosition: 'left', textColor: '#ffffff', buttonColor: '#ea580c',
};

const DESKTOP_RATIO = 1920 / 700; // ~2.74
const MOBILE_RATIO = 800 / 1000; // 0.8
const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

// Loads an image and warns if its aspect ratio is far from the recommended one.
function checkRatio(url, expected, label, setWarn) {
  if (!url) return setWarn((w) => ({ ...w, [label]: '' }));
  const img = new Image();
  img.onload = () => {
    const ratio = img.naturalWidth / img.naturalHeight;
    const off = Math.abs(ratio - expected) / expected > 0.12;
    setWarn((w) => ({
      ...w,
      [label]: off
        ? `Recommended ratio is ~${expected.toFixed(2)}:1 (${label === 'desktop' ? '1920×700' : '800×1000'}). Uploaded image is ${img.naturalWidth}×${img.naturalHeight} (${ratio.toFixed(2)}:1).`
        : '',
    }));
  };
  img.onerror = () => setWarn((w) => ({ ...w, [label]: '' }));
  img.src = url;
}

export default function AdminBannerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(blank);
  const [warn, setWarn] = useState({ desktop: '', mobile: '' });
  const [saving, setSaving] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin-banner', id],
    queryFn: () => bannerApi.get(id).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setForm({ ...blank, ...existing, startDate: toInput(existing.startDate), endDate: toInput(existing.endDate) });
      checkRatio(existing.desktopImage, DESKTOP_RATIO, 'desktop', setWarn);
      if (existing.mobileImage) checkRatio(existing.mobileImage, MOBILE_RATIO, 'mobile', setWarn);
    }
  }, [existing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setDesktop = (v) => { set('desktopImage', v); checkRatio(v, DESKTOP_RATIO, 'desktop', setWarn); };
  const setMobile = (v) => { set('mobileImage', v); checkRatio(v, MOBILE_RATIO, 'mobile', setWarn); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.desktopImage) return toast.error('Desktop image is required');
    setSaving(true);
    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder) || 0,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };
    try {
      if (isEdit) await bannerApi.update(id, payload);
      else await bannerApi.create(payload);
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success(isEdit ? 'Banner updated' : 'Banner created');
      navigate('/admin/banners');
    } catch { /* handled */ } finally { setSaving(false); }
  };

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/banners')} className="btn-ghost p-2"><ArrowLeft size={18} /></button>
        <h1 className="text-2xl font-bold text-ink">{isEdit ? 'Edit Banner' : 'Add Banner'}</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Content">
            <Field label="Title" required><input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required /></Field>
            <Field label="Subtitle"><input className="input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
            <Field label="Description"><textarea rows={2} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button Text"><input className="input" value={form.buttonText} onChange={(e) => set('buttonText', e.target.value)} /></Field>
              <Field label="Button Link"><input className="input" value={form.buttonLink} onChange={(e) => set('buttonLink', e.target.value)} placeholder="/shop or https://…" /></Field>
            </div>
          </Section>

          <Section title="Images">
            <Field label="Desktop Image (recommended 1920×700)" required>
              <ImageUploader value={form.desktopImage} onChange={setDesktop} />
              {warn.desktop && <Warn text={warn.desktop} />}
            </Field>
            <Field label="Mobile Image (recommended 800×1000, optional)">
              <ImageUploader value={form.mobileImage} onChange={setMobile} />
              {warn.mobile && <Warn text={warn.mobile} />}
              <p className="mt-1 text-xs text-gray-400">If omitted, the desktop image is used on mobile.</p>
            </Field>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Settings">
            <Field label="Banner Type">
              <select className="input capitalize" value={form.bannerType} onChange={(e) => set('bannerType', e.target.value)}>
                {['hero', 'offer', 'category', 'promo'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Display Order"><input type="number" className="input" value={form.displayOrder} onChange={(e) => set('displayOrder', e.target.value)} /></Field>
              <Field label="Text Position">
                <select className="input" value={form.textPosition} onChange={(e) => set('textPosition', e.target.value)}>
                  {['left', 'center', 'right'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Start Date"><input type="date" className="input" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} /></Field>
              <Field label="End Date"><input type="date" className="input" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} /></Field>
              <Field label="Text Color"><input type="color" className="input h-10 p-1" value={form.textColor} onChange={(e) => set('textColor', e.target.value)} /></Field>
              <Field label="Button Color"><input type="color" className="input h-10 p-1" value={form.buttonColor} onChange={(e) => set('buttonColor', e.target.value)} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="accent-primary-600" /> Active
            </label>
          </Section>
        </div>
      </div>

      {form.desktopImage && (
        <Section title="Live Preview">
          <BannerCard banner={form} eager />
        </Section>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => navigate('/admin/banners')} className="btn-outline">Cancel</button>
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Update Banner' : 'Create Banner'}</button>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return <div className="card p-5"><h3 className="mb-4 font-bold text-ink">{title}</h3><div className="space-y-4">{children}</div></div>;
}
function Field({ label, required, children }) {
  return <div><label className="label">{label} {required && <span className="text-red-500">*</span>}</label>{children}</div>;
}
function Warn({ text }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 p-2 text-xs text-amber-700">
      <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {text}
    </p>
  );
}
