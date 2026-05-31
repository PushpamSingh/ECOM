import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlayCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

const PAYOUT_STYLE = {
  PROCESSING: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function AdminPayouts() {
  const queryClient = useQueryClient();
  const { data: eligible = [], isLoading } = useQuery({ queryKey: ['payouts-eligible'], queryFn: () => marketplaceAdminApi.eligiblePayouts().then((r) => r.data) });
  const { data: payouts = [] } = useQuery({ queryKey: ['payouts-all'], queryFn: () => marketplaceAdminApi.payouts().then((r) => r.data) });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['payouts-eligible'] });
    queryClient.invalidateQueries({ queryKey: ['payouts-all'] });
  };

  const runSettlement = useMutation({
    mutationFn: () => marketplaceAdminApi.runSettlement(),
    onSuccess: (res) => { toast.success(res.message); invalidate(); },
  });
  const createPayout = useMutation({
    mutationFn: ({ sellerId, amount }) => marketplaceAdminApi.createPayout({ sellerId, amount }),
    onSuccess: () => { toast.success('Payout started'); invalidate(); },
  });
  const markPaid = useMutation({
    mutationFn: (id) => marketplaceAdminApi.payoutPaid(id),
    onSuccess: () => { toast.success('Marked paid'); invalidate(); },
  });
  const markFailed = useMutation({
    mutationFn: (id) => marketplaceAdminApi.payoutFailed(id, { reason: 'Manual fail' }),
    onSuccess: () => { toast.success('Marked failed'); invalidate(); },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Payouts & Settlements</h1>
        <button onClick={() => runSettlement.mutate()} className="btn-primary" disabled={runSettlement.isPending}>
          <PlayCircle size={16} /> {runSettlement.isPending ? 'Running…' : 'Run Settlement'}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="border-b px-5 py-3 font-bold text-ink">Eligible for Payout (available balance)</h3>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-3">Seller</th><th className="px-4 py-3 text-right">Available</th><th className="px-4 py-3 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y">
            {eligible.map((w) => (
              <tr key={w._id}>
                <td className="px-4 py-3 font-medium text-ink">{w.seller?.storeName}</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{formatINR(w.availableAmount)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => createPayout.mutate({ sellerId: w.seller._id, amount: w.availableAmount })}
                    className="btn-primary px-3 py-1.5 text-xs"
                    disabled={createPayout.isPending}
                  >
                    Pay {formatINR(w.availableAmount)}
                  </button>
                </td>
              </tr>
            ))}
            {eligible.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-gray-400">No sellers with available balance.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="border-b px-5 py-3 font-bold text-ink">All Payouts</h3>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="px-4 py-3">Seller</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y">
            {payouts.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3 text-gray-600">{p.seller?.storeName}</td>
                <td className="px-4 py-3 text-right font-medium">{formatINR(p.amount)}</td>
                <td className="px-4 py-3"><span className={`badge ${PAYOUT_STYLE[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3">
                  {p.status === 'PROCESSING' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => markPaid.mutate(p._id)} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100" title="Mark paid"><Check size={15} /></button>
                      <button onClick={() => markFailed.mutate(p._id)} className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100" title="Mark failed"><X size={15} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">No payouts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
