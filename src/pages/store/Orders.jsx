import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Eye } from 'lucide-react';
import { orderApi } from '@/apiservice/commerce.api.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import Badge from '@/components/common/Badge.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, formatDate } from '@/utils/format.js';

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderApi.myOrders().then((r) => r.data),
    enabled: isAuthenticated,
  });

  return (
    <>
      <Breadcrumb title="My Orders" items={[{ label: 'Orders' }]} />
      <div className="container-page py-10">
        {!isAuthenticated ? (
          <EmptyState
            icon={Package}
            title="Please sign in"
            message="Sign in to view your order history."
            action={<Link to="/account" className="btn-primary mt-2">Sign In</Link>}
          />
        ) : isLoading ? (
          <PageLoader />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            message="When you place an order it will appear here."
            action={<Link to="/shop" className="btn-primary mt-2">Start Shopping</Link>}
          />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-ink">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-500">{o.items.length}</td>
                    <td className="px-4 py-3 font-medium">{formatINR(o.total)}</td>
                    <td className="px-4 py-3">
                      <Badge status={o.orderStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/orders/${o._id}`} className="btn-outline px-3 py-1.5 text-xs">
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
