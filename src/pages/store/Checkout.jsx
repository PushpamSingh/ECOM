import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useSettings } from '@/hooks/useCatalog.js';
import { orderApi, couponApi, paymentApi } from '@/apiservice/commerce.api.js';
import { useQueryClient } from '@tanstack/react-query';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import { formatINR } from '@/utils/format.js';
import { loadRazorpay } from '@/utils/razorpay.js';
import { PAYMENT_METHODS } from '@/constants';
import { cn } from '@/utils/cn.js';

const emptyAddress = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  postCode: '',
  country: 'India',
  notes: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { cart } = useCart();
  const { data: settings } = useSettings();

  const [address, setAddress] = useState({ ...emptyAddress, fullName: user?.name || '', email: user?.email || '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [placing, setPlacing] = useState(false);

  const enabledMethods = PAYMENT_METHODS.filter((m) => settings?.paymentMethods?.[m.value]);
  const total = Math.max(0, cart.total - discount);

  // Select the first enabled payment method once settings load (and if the current
  // selection becomes unavailable).
  useEffect(() => {
    if (enabledMethods.length && !enabledMethods.some((m) => m.value === paymentMethod)) {
      setPaymentMethod(enabledMethods[0].value);
    }
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await couponApi.apply(couponCode.trim());
      setDiscount(res.data.discount);
      setAppliedCode(res.data.code);
      toast.success(`Coupon ${res.data.code} applied`);
    } catch {
      setDiscount(0);
      setAppliedCode('');
    }
  };

  const finishOrder = (order) => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    navigate(`/order-success/${order._id}`);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const res = await orderApi.create({
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCode || undefined,
      });
      const { order, razorpay } = res.data;

      if (paymentMethod === 'razorpay' && razorpay) {
        const ok = await loadRazorpay();
        if (!ok) return toast.error('Could not load payment gateway');

        const rzp = new window.Razorpay({
          key: razorpay.keyId,
          amount: razorpay.amount,
          currency: 'INR',
          name: 'AgarbattiKart',
          description: `Order ${order.orderNumber}`,
          order_id: razorpay.orderId,
          prefill: { name: address.fullName, email: address.email, contact: address.phone },
          theme: { color: '#ea580c' },
          handler: async (response) => {
            try {
              await paymentApi.verify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              toast.success('Payment successful');
              finishOrder(order);
            } catch {
              toast.error('Payment verification failed');
            }
          },
        });
        rzp.open();
      } else {
        toast.success('Order placed successfully');
        finishOrder(order);
      }
    } catch {
      /* handled by interceptor */
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <>
        <Breadcrumb title="Checkout" items={[{ label: 'Checkout' }]} />
        <div className="container-page py-12">
          <EmptyState
            title="Your cart is empty"
            message="Add some products before checking out."
            action={<Link to="/shop" className="btn-primary mt-2">Go to Shop</Link>}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Checkout" items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <form onSubmit={placeOrder} className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
        {/* Billing */}
        <div className="card p-6">
          <h3 className="mb-5 text-lg font-bold">Shipping Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="fullName" value={address.fullName} onChange={setField} required />
            <Field label="Email" name="email" type="email" value={address.email} onChange={setField} required />
            <Field label="Phone" name="phone" value={address.phone} onChange={setField} required />
            <Field label="Post Code" name="postCode" value={address.postCode} onChange={setField} required />
            <div className="sm:col-span-2">
              <Field label="Street Address" name="street" value={address.street} onChange={setField} required />
            </div>
            <div className="sm:col-span-2">
              <Field label="Apartment, suite (optional)" name="apartment" value={address.apartment} onChange={setField} />
            </div>
            <Field label="City" name="city" value={address.city} onChange={setField} required />
            <Field label="State" name="state" value={address.state} onChange={setField} required />
            <div className="sm:col-span-2">
              <label className="label">Order Notes (optional)</label>
              <textarea name="notes" value={address.notes} onChange={setField} rows={3} className="input" />
            </div>
          </div>
        </div>

        {/* Summary + payment */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-4 text-lg font-bold">Your Order</h3>
            <div className="max-h-56 space-y-3 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="line-clamp-1 text-gray-600">
                    {item.product.name} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">{formatINR(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="input pl-9"
                />
              </div>
              <button type="button" onClick={applyCoupon} className="btn-outline">
                Apply
              </button>
            </div>

            <div className="mt-4 border-t pt-4">
              <Row label="Subtotal" value={formatINR(cart.subtotal)} />
              {discount > 0 && <Row label={`Discount (${appliedCode})`} value={`- ${formatINR(discount)}`} green />}
              <Row label="Shipping" value={cart.shippingCost ? formatINR(cart.shippingCost) : 'Free'} />
              <Row label="Tax" value={formatINR(cart.tax)} />
              <div className="my-2 border-t" />
              <Row label="Total" value={formatINR(total)} bold />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 text-lg font-bold">Payment Method</h3>
            <div className="space-y-2">
              {enabledMethods.map((m) => (
                <label
                  key={m.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition',
                    paymentMethod === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)}
                    className="mt-1 accent-primary-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <button className="btn-primary mt-5 w-full" disabled={placing || !paymentMethod}>
              <Check size={16} /> {placing ? 'Placing Order…' : `Place Order • ${formatINR(total)}`}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...props} />
    </div>
  );
}

function Row({ label, value, bold, green }) {
  return (
    <div className={cn('flex justify-between py-1', bold ? 'text-lg font-bold' : 'text-sm text-gray-600')}>
      <span>{label}</span>
      <span className={cn(bold && 'text-primary-600', green && 'text-green-600', !bold && !green && 'font-medium text-ink')}>
        {value}
      </span>
    </div>
  );
}
