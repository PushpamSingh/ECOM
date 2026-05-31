import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { orderApi } from '@/apiservice/commerce.api.js';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR } from '@/utils/format.js';

export default function OrderSuccess() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOne(id).then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="container-page py-20 text-center">Order not found.</div>;

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-3xl font-bold text-ink">Thank you for your order!</h1>
      <p className="mt-2 text-gray-600">
        Your order <span className="font-semibold">{order.orderNumber}</span> has been placed successfully.
      </p>
      {order && (
        <div className="card mt-6 w-full max-w-sm p-5 text-left text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Order Total</span>
            <span className="font-bold text-ink">{formatINR(order.total)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium uppercase">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Status</span>
            <span className="font-medium capitalize">{order.orderStatus}</span>
          </div>
        </div>
      )}
      <div className="mt-7 flex gap-3">
        <Link to={`/orders/${id}`} className="btn-outline">
          View Order
        </Link>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
