import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Ticket,
  Users,
  Star,
  Receipt,
  Settings,
  Store,
  BadgeCheck,
  ClipboardCheck,
  Wallet,
  AlertTriangle,
  SlidersHorizontal,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn.js';
import { adminApi } from '@/apiservice/admin.api.js';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, badgeKey: 'orders' },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const MARKETPLACE_LINKS = [
  { to: '/admin/marketplace', label: 'Analytics', icon: Store, end: true },
  { to: '/admin/sellers', label: 'Sellers', icon: BadgeCheck, badgeKey: 'sellers' },
  { to: '/admin/product-review', label: 'Product Review', icon: ClipboardCheck, badgeKey: 'productReviews' },
  { to: '/admin/payouts', label: 'Payouts', icon: Wallet, badgeKey: 'payouts' },
  { to: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
  { to: '/admin/marketplace-settings', label: 'Marketplace Settings', icon: SlidersHorizontal },
];

const CONTENT_LINKS = [{ to: '/admin/banners', label: 'Banners', icon: ImageIcon }];

// Badge component with proper sizing and animation
function SidebarBadge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
}

// Sidebar link component with optional badge
function SidebarNavLink({ link, badge, onClose }) {
  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
          isActive ? 'bg-primary-600 text-white' : 'hover:bg-white/10'
        )
      }
    >
      <link.icon size={18} />
      <span className="flex-1">{link.label}</span>
      {link.badgeKey && <SidebarBadge count={badge?.[link.badgeKey]} />}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  // Fetch notification counts with polling
  const { data: badgeCounts = {}, isLoading: countsLoading } = useQuery({
    queryKey: ['admin-notification-counts'],
    queryFn: () => adminApi.getNotificationCounts(),
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 1, // Retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
    // Handle errors gracefully - return empty counts
    meta: {
      onError: () => ({
        orders: 0,
        sellers: 0,
        productReviews: 0,
        payouts: 0,
      }),
    },
  });

  // Fallback to empty counts if loading or error
  const counts = badgeCounts || {
    orders: 0,
    sellers: 0,
    productReviews: 0,
    payouts: 0,
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col w-64 transform bg-ink text-gray-300 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <span className="flex items-center gap-2 text-lg font-extrabold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600">अ</span>
            AgarbattiKart
          </span>
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {LINKS.map((l) => (
            <SidebarNavLink key={l.to} link={l} badge={counts} onClose={onClose} />
          ))}

          <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Marketplace</p>
          {MARKETPLACE_LINKS.map((l) => (
            <SidebarNavLink key={l.to} link={l} badge={counts} onClose={onClose} />
          ))}

          <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Content Management</p>
          {CONTENT_LINKS.map((l) => (
            <SidebarNavLink key={l.to} link={l} badge={counts} onClose={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}
