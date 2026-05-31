import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart, useCartMutations } from '@/hooks/useCart.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import QuantitySelector from '@/components/common/QuantitySelector.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, onImgError } from '@/utils/format.js';

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { cart, isLoading } = useCart();
  const { update, remove } = useCartMutations();

  if (!isAuthenticated) {
    return (
      <>
        <Breadcrumb title="Cart" items={[{ label: 'Cart' }]} />
        <div className="container-page py-12">
          <EmptyState
            icon={ShoppingBag}
            title="Please sign in"
            message="Sign in to view your cart and continue shopping."
            action={<Link to="/account" className="btn-primary mt-2">Sign In</Link>}
          />
        </div>
      </>
    );
  }

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Breadcrumb title="Cart" items={[{ label: 'Cart' }]} />
      <div className="container-page py-10">
        {cart.items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            message="Browse our incense collection and add your favourites."
            action={<Link to="/shop" className="btn-primary mt-2">Continue Shopping</Link>}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="card divide-y">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-4">
                  <Link to={`/product/${item.product.slug}`} className="shrink-0">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      onError={onImgError}
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="line-clamp-2 text-sm font-semibold text-ink hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{formatINR(item.product.finalPrice)} each</p>
                    <div className="mt-2 flex items-center gap-4">
                      <QuantitySelector
                        value={item.quantity}
                        max={item.product.stock}
                        onChange={(q) => update.mutate({ productId: item.product.id, quantity: q })}
                      />
                      <button
                        onClick={() => remove.mutate(item.product.id)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-bold text-ink">{formatINR(item.lineTotal)}</div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card h-fit p-6">
              <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
              <SummaryRow label="Subtotal" value={formatINR(cart.subtotal)} />
              <SummaryRow label="Shipping" value={cart.shippingCost ? formatINR(cart.shippingCost) : 'Free'} />
              <SummaryRow label="Tax" value={formatINR(cart.tax)} />
              <div className="my-3 border-t" />
              <SummaryRow label="Total" value={formatINR(cart.total)} bold />
              <Link to="/checkout" className="btn-primary mt-5 w-full">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link to="/shop" className="btn-ghost mt-2 w-full">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${bold ? 'text-lg font-bold' : 'text-sm text-gray-600'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-primary-600' : 'font-medium text-ink'}>{value}</span>
    </div>
  );
}
