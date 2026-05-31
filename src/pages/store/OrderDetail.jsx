import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/apiservice/commerce.api.js';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import Badge from '@/components/common/Badge.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDateTime } from '@/utils/format.js';

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOne(id).then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="container-page py-20 text-center">Order not found.</div>;

  const addr = order.shippingAddress;

  return (
    <>
      <Breadcrumb title={`Order ${order.orderNumber}`} items={[{ label: 'Orders', to: '/orders' }, { label: order.orderNumber }]} />
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Placed on {formatDateTime(order.createdAt)}</p>
                <p className="text-lg font-bold">{order.orderNumber}</p>
              </div>
              <div className="flex gap-2">
                <Badge status={order.orderStatus} />
                <Badge status={order.paymentStatus} />
              </div>
            </div>
            <div className="divide-y">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg border object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatINR(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-3 font-bold">Order Summary</h3>
            <Row label="Subtotal" value={formatINR(order.subtotal)} />
            {order.discount > 0 && <Row label="Discount" value={`- ${formatINR(order.discount)}`} />}
            <Row label="Shipping" value={order.shippingCost ? formatINR(order.shippingCost) : 'Free'} />
            <Row label="Tax" value={formatINR(order.tax)} />
            <div className="my-2 border-t" />
            <Row label="Total" value={formatINR(order.total)} bold />
            <p className="mt-3 text-sm text-gray-500">
              Payment: <span className="font-medium uppercase">{order.paymentMethod.replace('_', ' ')}</span>
            </p>
          </div>

          <div className="card p-6">
            <h3 className="mb-3 font-bold">Deliver To</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-semibold text-ink">{addr.fullName}</p>
              <p>{addr.phone}</p>
              <p>{addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
              <p>{addr.city}, {addr.state} {addr.postCode}</p>
              <p>{addr.country}</p>
              {addr.notes && <p className="mt-2 italic">Note: {addr.notes}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
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
