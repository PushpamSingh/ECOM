import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { marketplaceAdminApi } from '@/apiservice/marketplace.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Modal from '@/components/common/Modal.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import { formatINR } from '@/utils/format.js';
import { onImgError } from '@/utils/format.js';

const ACTIONS = [
  { value: 'approve', label: 'Approve & Publish' },
  { value: 'request_changes', label: 'Request Changes' },
  { value: 'reject', label: 'Reject' },
  { value: 'block', label: 'Block' },
];

export default function AdminProductReview() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [active, setActive] = useState(null); // product being reviewed
  const [action, setAction] = useState('approve');
  const [notes, setNotes] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['review-queue', status],
    queryFn: () => marketplaceAdminApi.reviewQueue({ status }).then((r) => r.data),
  });

  const review = useMutation({
    mutationFn: ({ id, payload }) => marketplaceAdminApi.reviewProduct(id, payload),
    onSuccess: () => {
      toast.success('Review submitted');
      queryClient.invalidateQueries({ queryKey: ['review-queue'] });
      setActive(null);
      setNotes('');
    },
  });

  const open = (p) => { setActive(p); setAction('approve'); setNotes(''); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Seller Product Review</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input max-w-[200px]">
          <option value="">Queue (submitted)</option>
          {['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CHANGES', 'PUBLISHED', 'REJECTED', 'BLOCKED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? <PageLoader /> : products.length === 0 ? (
        <EmptyState title="Nothing to review" message="There are no products in this queue." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p._id} className="card overflow-hidden">
              <img src={p.mainImage} alt="" onError={onImgError} className="aspect-video w-full object-cover" />
              <div className="space-y-1 p-4">
                <p className="font-semibold text-ink line-clamp-1">{p.name}</p>
                <p className="text-xs text-gray-500">{p.seller?.storeName} • {p.category?.name}</p>
                <p className="text-sm font-medium">{formatINR(p.sellingPrice)} <span className="text-xs text-gray-400">• {p.condition}</span></p>
                <p className="text-xs"><span className="badge bg-blue-100 text-blue-700">{p.status.replace('_', ' ')}</span></p>
                <button onClick={() => open(p)} className="btn-primary mt-2 w-full py-2 text-sm">Review</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? `Review: ${active.name}` : ''}
        footer={
          <>
            <button onClick={() => setActive(null)} className="btn-outline">Cancel</button>
            <button
              className="btn-primary"
              disabled={review.isPending || !notes.trim()}
              onClick={() => review.mutate({ id: active._id, payload: { action, notes } })}
            >
              Submit
            </button>
          </>
        }
      >
        {active && (
          <div className="space-y-4">
            <img src={active.mainImage} alt="" onError={onImgError} className="h-40 w-full rounded-lg object-cover" />
            <p className="text-sm text-gray-600">{active.description || 'No description provided.'}</p>
            <div>
              <label className="label">Action</label>
              <select value={action} onChange={(e) => setAction(e.target.value)} className="input">
                {ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Admin Notes <span className="text-red-500">*</span></label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input" placeholder="Required — explains the decision to the seller" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
