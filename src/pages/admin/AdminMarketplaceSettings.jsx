import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';

export default function AdminMarketplaceSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['mp-settings'], queryFn: () => marketplaceAdminApi.getSettings().then((r) => r.data) });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: (payload) => marketplaceAdminApi.updateSettings(payload),
    onSuccess: () => { toast.success('Settings saved'); queryClient.invalidateQueries({ queryKey: ['mp-settings'] }); },
  });

  if (isLoading || !form) return <PageLoader />;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Marketplace Settings</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate({
          commissionValue: Number(form.commissionValue), returnWindowDays: Number(form.returnWindowDays),
          payoutMinAmount: Number(form.payoutMinAmount), requireAadhaar: form.requireAadhaar, requirePan: form.requirePan,
        }); }}
        className="card max-w-xl space-y-4 p-6"
      >
        <div>
          <label className="label">Commission (%)</label>
          <input type="number" className="input" value={form.commissionValue} onChange={(e) => set('commissionValue', e.target.value)} min={0} max={100} />
          <p className="mt-1 text-xs text-gray-400">Applied to future sales only. Existing orders keep their snapshotted rate.</p>
        </div>
        <div>
          <label className="label">Return / Settlement Window (days)</label>
          <input type="number" className="input" value={form.returnWindowDays} onChange={(e) => set('returnWindowDays', e.target.value)} min={0} />
          <p className="mt-1 text-xs text-gray-400">Seller funds mature this many days after an order is delivered.</p>
        </div>
        <div>
          <label className="label">Minimum Payout (₹)</label>
          <input type="number" className="input" value={form.payoutMinAmount} onChange={(e) => set('payoutMinAmount', e.target.value)} min={0} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.requireAadhaar} onChange={(e) => set('requireAadhaar', e.target.checked)} className="accent-primary-600" /> Require Aadhaar for verification
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.requirePan} onChange={(e) => set('requirePan', e.target.checked)} className="accent-primary-600" /> Require PAN for verification
        </label>
        <button className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
