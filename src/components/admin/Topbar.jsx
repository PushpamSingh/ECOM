import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, ExternalLink, ChevronDown, LayoutDashboard, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.jsx';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/account', label: 'My Account', icon: User },
];

export default function Topbar({ onMenu }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-5">
      <button onClick={onMenu} className="lg:hidden">
        <Menu />
      </button>
      <div className="ml-auto flex items-center gap-3">
        <a href="/" target="_blank" rel="noreferrer" className="btn-outline hidden px-3 py-1.5 text-xs sm:flex">
          <ExternalLink size={14} /> View Store
        </a>
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-100 font-bold text-primary-700">
              {user?.name?.charAt(0) || 'A'}
            </span>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <ChevronDown size={15} className="text-gray-400" />
          </button>
          {open && (
            <div role="menu" className="absolute right-0 z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
              {MENU.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <item.icon size={15} /> {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await logout();
                  navigate('/admin/login');
                }}
                className="flex w-full items-center gap-2 border-t px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                role="menuitem"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
