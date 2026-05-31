import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '@/apiservice/misc.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';

const PAYMENT_LABELS = {
  cod: 'Cash on Delivery',
  razorpay: 'Razorpay (Online)',
  bank_transfer: 'Bank Transfer',
  check: 'Cheque',
};

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => settingsApi.get().then((r) => r.data),
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (payload) => settingsApi.update(payload),
    onSuccess: () => {
      toast.success('Settings saved');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'public'] });
    },
  });

  if (isLoading || !form) return <PageLoader />;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setPayment = (k, v) => setForm((f) => ({ ...f, paymentMethods: { ...f.paymentMethods, [k]: v } }));
  const setSocial = (k, v) => setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }));

  const submit = (e) => {
    e.preventDefault();
    save.mutate(form);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Site Settings</h1>
        <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save Changes'}</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Store Information">
          <Field label="Site Name"><input className="input" value={form.siteName} onChange={(e) => set('siteName', e.target.value)} /></Field>
          <Field label="Support Email"><input className="input" value={form.adminEmail} onChange={(e) => set('adminEmail', e.target.value)} /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          <Field label="Address"><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
          <Field label="Post Code"><input className="input" value={form.postCode} onChange={(e) => set('postCode', e.target.value)} /></Field>
        </Section>

        <Section title="Commerce">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Currency"><input className="input" value={form.currency} onChange={(e) => set('currency', e.target.value)} /></Field>
            <Field label="Currency Symbol"><input className="input" value={form.currencySymbol} onChange={(e) => set('currencySymbol', e.target.value)} /></Field>
            <Field label="Tax Rate (%)"><input type="number" className="input" value={form.taxRate} onChange={(e) => set('taxRate', Number(e.target.value))} /></Field>
            <Field label="Shipping Fee (₹)"><input type="number" className="input" value={form.shippingFee} onChange={(e) => set('shippingFee', Number(e.target.value))} /></Field>
            <Field label="Free Shipping Above (₹)"><input type="number" className="input" value={form.freeShippingThreshold} onChange={(e) => set('freeShippingThreshold', Number(e.target.value))} /></Field>
          </div>
        </Section>

        <Section title="Payment Methods">
          <div className="space-y-2">
            {Object.keys(PAYMENT_LABELS).map((k) => (
              <label key={k} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">{PAYMENT_LABELS[k]}</span>
                <input
                  type="checkbox"
                  checked={!!form.paymentMethods?.[k]}
                  onChange={(e) => setPayment(k, e.target.checked)}
                  className="h-5 w-5 accent-primary-600"
                />
              </label>
            ))}
          </div>
        </Section>

        <Section title="Social Links">
          {['facebook', 'instagram', 'twitter', 'linkedin'].map((s) => (
            <Field key={s} label={s[0].toUpperCase() + s.slice(1)}>
              <input className="input" value={form.socials?.[s] || ''} onChange={(e) => setSocial(s, e.target.value)} />
            </Field>
          ))}
        </Section>
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

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
