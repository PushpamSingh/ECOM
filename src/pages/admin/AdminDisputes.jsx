import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Modal from '@/components/common/Modal.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import Badge from '@/components/common/Badge.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

export default function AdminDisputes() {
  const queryClient = useQueryClient();
  const [active, setActive] = useState(null);
  const [resolution, setResolution] = useState('seller_wins');
  const [refundAmount, setRefundAmount] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: disputes = [], isLoading } = useQuery({ queryKey: ['disputes'], queryFn: () => marketplaceAdminApi.disputes().then((r) => r.data) });

  const resolve = useMutation({
    mutationFn: ({ id, payload }) => marketplaceAdminApi.resolveDispute(id, payload),
    onSuccess: () => { toast.success('Dispute resolved'); queryClient.invalidateQueries({ queryKey: ['disputes'] }); setActive(null); setAdminNotes(''); },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Disputes</h1>
      {disputes.length === 0 ? (
        <EmptyState title="No disputes" message="No buyer disputes have been raised." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Buyer</th><th className="px-4 py-3">Seller</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y">
              {disputes.map((d) => (
                <tr key={d._id}>
                  <td className="px-4 py-3 font-medium text-ink">{d.order?.orderNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{d.buyer?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{d.seller?.storeName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[220px] line-clamp-2">{d.reason}</td>
                  <td className="px-4 py-3"><Badge status={d.status === 'resolved' ? 'approved' : 'pending'}>{d.status}{d.resolution ? ` • ${d.resolution}` : ''}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    {d.status !== 'resolved' && (
                      <button onClick={() => { setActive(d); setResolution('seller_wins'); setRefundAmount(0); setAdminNotes(''); }} className="btn-primary px-3 py-1.5 text-xs">Resolve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? `Resolve dispute • ${active.order?.orderNumber}` : ''}
        footer={
          <>
            <button onClick={() => setActive(null)} className="btn-outline">Cancel</button>
            <button
              className="btn-primary"
              disabled={resolve.isPending || !adminNotes.trim()}
              onClick={() => resolve.mutate({ id: active._id, payload: { resolution, refundAmount: Number(refundAmount), adminNotes } })}
            >
              Resolve
            </button>
          </>
        }
      >
        {active && (
          <div className="space-y-4">
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">Reason: {active.reason}</p>
            <div>
              <label className="label">Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="input">
                <option value="seller_wins">Seller Wins (release settlement)</option>
                <option value="buyer_wins">Buyer Wins (full refund, reverse seller credit)</option>
                <option value="partial">Partial Refund</option>
              </select>
            </div>
            {resolution === 'partial' && (
              <div>
                <label className="label">Refund Amount (₹)</label>
                <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className="input" />
                <p className="mt-1 text-xs text-gray-400">Order total: {formatINR(active.order?.total || 0)}. Seller credit is reduced proportionally.</p>
              </div>
            )}
            <div>
              <label className="label">Admin Notes <span className="text-red-500">*</span></label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} className="input" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
