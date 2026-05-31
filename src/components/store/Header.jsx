import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  ChevronDown,
  LogOut,
  Package,
  LayoutDashboard,
  Store,
  Users,
  Settings,
  Wallet,
  Receipt,
} from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import { formatINR } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useCart } from '@/hooks/useCart.js';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useCategories, useSettings } from '@/hooks/useCatalog.js';
import { useSeller } from '@/hooks/useSeller.js';

// Role-aware profile menu. Each item is a real route; selecting one closes the menu.
function buildAccountMenu({ isAdmin, isSeller }) {
  if (isAdmin) {
    return [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/customers', label: 'Users', icon: Users },
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/account', label: 'My Account', icon: User },
    ];
  }
  if (isSeller) {
    return [
      { to: '/seller', label: 'Seller Dashboard', icon: Store },
      { to: '/seller/wallet', label: 'Wallet', icon: Wallet },
      { to: '/seller/settlements', label: 'Settlements', icon: Receipt },
      { to: '/seller/profile', label: 'Seller Profile', icon: Store },
      { to: '/orders', label: 'My Orders', icon: Package },
      { to: '/account', label: 'My Account', icon: User },
    ];
  }
  return [
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/account', label: 'My Account', icon: User },
    { to: '/seller', label: 'Sell on AgarbattiKart', icon: Store },
  ];
}

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isSeller } = useSeller();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const accountRef = useRef(null);

  // Close the account menu on any click/tap outside it — robust on desktop AND touch
  // (the previous onBlur+setTimeout pattern dropped taps on mobile/tablet).
  useEffect(() => {
    if (!accountOpen) return undefined;
    const onOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, [accountOpen]);

  const parents = categories.filter((c) => !c.parent);
  const accountMenu = buildAccountMenu({ isAdmin, isSeller });

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top bar */}
      <div className="hidden bg-ink text-gray-300 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <Phone size={13} /> {settings?.phone || '+91 98765 43210'}
          </span>
          <div className="flex items-center gap-4">
            <span>Free shipping over {formatINR(settings?.freeShippingThreshold || 499)}</span>
            <Link to="/orders" className="hover:text-white">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="border-b">
        <div className="container-page flex h-16 items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu />
          </button>

          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-600 text-white">अ</span>
            <span className="hidden sm:block">
              Agarbatti<span className="text-primary-600">Kart</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="relative ml-2 hidden flex-1 md:block">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for incense, dhoop, camphor…"
              className="input pr-12"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-primary-600 p-2 text-white">
              <Search size={16} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <Link to="/wishlist" className="relative rounded-md p-2 hover:bg-gray-100" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <Counter value={wishlist.length} />}
            </Link>

            <Link to="/cart" className="relative flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
              <span className="relative">
                <ShoppingCart size={20} />
                {cart.count > 0 && <Counter value={cart.count} />}
              </span>
              {/* <span className="hidden text-sm font-semibold lg:block">{formatINR(cart.total)}</span> */}
            </Link>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <User size={20} />
                <span className="hidden text-sm font-medium lg:block">
                  {isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : 'Account'}
                </span>
              </button>
              {accountOpen && (
                <div role="menu" className="absolute right-0 z-50 mt-1 w-52 rounded-lg border bg-white py-1 shadow-lg">
                  {isAuthenticated ? (
                    <>
                      {accountMenu.map((item) => (
                        <DropItem key={item.label} to={item.to} icon={item.icon} onSelect={() => setAccountOpen(false)}>
                          {item.label}
                        </DropItem>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 border-t px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        role="menuitem"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </>
                  ) : (
                    <DropItem to="/account" icon={User} onSelect={() => setAccountOpen(false)}>
                      Login / Register
                    </DropItem>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <div className="hidden border-b lg:block">
        <div className="container-page flex h-12 items-center gap-6">
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex h-12 items-center gap-2 bg-primary-600 px-4 text-sm font-semibold text-white">
              <Menu size={16} /> All Categories <ChevronDown size={14} />
            </button>
            {catOpen && parents.length > 0 && (
              <div className="absolute left-0 top-12 z-50 w-64 rounded-b-lg border bg-white py-2 shadow-lg">
                {parents.map((c) => (
                  <Link
                    key={c._id}
                    to={`/shop?category=${c.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary-600"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn('py-1 hover:text-primary-600', isActive && 'text-primary-600')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={submitSearch} className="relative mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="input pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </form>
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="border-b py-3 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mb-2 mt-5 text-xs font-semibold uppercase text-gray-400">Categories</p>
            <div className="flex flex-col">
              {parents.map((c) => (
                <Link
                  key={c._id}
                  to={`/shop?category=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm text-gray-600"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Counter({ value }) {
  return (
    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
      {value}
    </span>
  );
}

function DropItem({ to, icon: Icon, children, onSelect }) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onSelect}
      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
    >
      <Icon size={15} /> {children}
    </Link>
  );
}
