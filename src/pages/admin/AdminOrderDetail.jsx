import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '@/apiservice/commerce.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import Badge from '@/components/common/Badge.jsx';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/constants';
import { formatINR, formatDateTime } from '@/utils/format.js';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => orderApi.adminGet(id).then((r) => r.data),
  });

  const update = useMutation({
    mutationFn: (payload) => orderApi.adminUpdate(id, payload),
    onSuccess: () => {
      toast.success('Order updated');
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="py-20 text-center">Order not found.</div>;

  const addr = order.shippingAddress;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/orders')} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ink">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="card p-6">
          <h3 className="mb-4 font-bold text-ink">Items</h3>
          <div className="divide-y">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <img src={item.image} alt="" className="h-14 w-14 rounded-lg border object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatINR(item.price)} × {item.quantity}</p>
                </div>
                <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <Row label="Subtotal" value={formatINR(order.subtotal)} />
            {order.discount > 0 && <Row label="Discount" value={`- ${formatINR(order.discount)}`} />}
            <Row label="Shipping" value={order.shippingCost ? formatINR(order.shippingCost) : 'Free'} />
            <Row label="Tax" value={formatINR(order.tax)} />
            <Row label="Total" value={formatINR(order.total)} bold />
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="mb-3 font-bold text-ink">Status</h3>
            <div className="mb-3 flex gap-2">
              <Badge status={order.orderStatus} />
              <Badge status={order.paymentStatus} />
            </div>
            <label className="label">Order Status</label>
            <select
              className="input mb-3 capitalize"
              value={order.orderStatus}
              onChange={(e) => update.mutate({ orderStatus: e.target.value })}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <label className="label">Payment Status</label>
            <select
              className="input capitalize"
              value={order.paymentStatus}
              onChange={(e) => update.mutate({ paymentStatus: e.target.value })}
            >
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <p className="mt-3 text-sm text-gray-500">
              Method: <span className="font-medium uppercase">{order.paymentMethod.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="card p-6">
            <h3 className="mb-3 font-bold text-ink">Customer</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-semibold text-ink">{addr.fullName}</p>
              <p>{addr.email}</p>
              <p>{addr.phone}</p>
              <p>{addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
              <p>{addr.city}, {addr.state} {addr.postCode}</p>
              {addr.notes && <p className="mt-2 italic">Note: {addr.notes}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between py-1 ${bold ? 'text-lg font-bold' : 'text-sm text-gray-600'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-primary-600' : 'font-medium text-ink'}>{value}</span>
    </div>
  );
}
