import { NavLink, Outlet } from 'react-router-dom';
import { Package, PlusCircle, Wallet, Receipt, Store, AlertCircle } from 'lucide-react';
import { useSeller } from '@/hooks/useSeller.js';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import { cn } from '@/utils/cn.js';

const LINKS = [
  { to: '/seller', label: 'My Products', icon: Package, end: true },
  { to: '/seller/products/new', label: 'Add Product', icon: PlusCircle },
  { to: '/seller/wallet', label: 'Wallet & Earnings', icon: Wallet },
  { to: '/seller/settlements', label: 'Settlements', icon: Receipt },
  { to: '/seller/profile', label: 'Profile & Bank', icon: Store },
];

export default function SellerLayout() {
  const { seller } = useSeller();

  return (
    <>
      <Breadcrumb title="Seller Dashboard" items={[{ label: 'Seller' }]} />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit">
          <div className="card p-3">
            <p className="px-3 py-2 text-sm font-semibold text-ink">{seller?.storeName}</p>
            <nav className="mt-1 flex flex-col">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                    )
                  }
                >
                  <l.icon size={16} /> {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <div>
          {seller && seller.status !== 'active' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>
                Your seller account is <strong>{seller.status}</strong>. You can manage your profile now;
                product listing unlocks once an admin verifies your account.
              </p>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </>
  );
}
