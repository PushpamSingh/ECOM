import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewApi } from '@/apiservice/commerce.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import Rating from '@/components/common/Rating.jsx';
import { formatDate } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews', status],
    queryFn: () => reviewApi.adminList({ status }).then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });

  const moderate = useMutation({
    mutationFn: ({ id, status }) => reviewApi.adminUpdate(id, { status }),
    onSuccess: () => { toast.success('Review updated'); invalidate(); },
  });
  const del = useMutation({
    mutationFn: (id) => reviewApi.adminRemove(id),
    onSuccess: () => { toast.success('Review deleted'); invalidate(); },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Reviews</h1>
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium capitalize',
                status === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200'
              )}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : reviews.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">No reviews found.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <img src={r.product?.thumbnail} alt="" className="h-14 w-14 rounded-lg border object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{r.product?.name}</span>
                  <Badge status={r.status} />
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Rating value={r.rating} size={13} />
                  <span className="text-xs text-gray-500">by {r.name} • {formatDate(r.createdAt)}</span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
              </div>
              <div className="flex gap-2">
                {r.status !== 'approved' && (
                  <button onClick={() => moderate.mutate({ id: r._id, status: 'approved' })} className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100" title="Approve">
                    <Check size={16} />
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => moderate.mutate({ id: r._id, status: 'rejected' })} className="rounded-md bg-amber-50 p-2 text-amber-600 hover:bg-amber-100" title="Reject">
                    <X size={16} />
                  </button>
                )}
                <button onClick={() => window.confirm('Delete this review?') && del.mutate(r._id)} className="rounded-md bg-gray-50 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
