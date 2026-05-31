export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TOKEN_KEY = 'ak_token';

// Storefront top navigation.
export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Contact', to: '/contact' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Reviewed' },
];

export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay with cash when your order is delivered.' },
  { value: 'razorpay', label: 'Pay Online (Razorpay)', description: 'Pay securely via UPI, cards, netbanking or wallets.' },
  { value: 'bank_transfer', label: 'Direct Bank Transfer', description: 'Transfer to our bank account; we ship after confirmation.' },
  { value: 'check', label: 'Cheque Payment', description: 'Send a cheque to our office address.' },
];

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

export const STATUS_STYLES = {
  // order/payment/product statuses -> badge classes
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  denied: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  expired: 'bg-red-100 text-red-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  unread: 'bg-amber-100 text-amber-700',
  read: 'bg-gray-100 text-gray-600',
};
