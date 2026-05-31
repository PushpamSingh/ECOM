import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/apiservice/auth.api.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';

export default function AccountDashboard() {
  const { user, setUser, logout } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile(profile);
      setUser(res.data.user);
      toast.success('Profile updated');
    } catch {
      /* handled by interceptor */
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await authApi.changePassword(passwords);
      toast.success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch {
      /* handled by interceptor */
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <Breadcrumb title="My Account" items={[{ label: 'Account' }]} />
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[280px_1fr]">
        {/* Summary + nav */}
        <aside className="card h-fit p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
              {user?.name?.charAt(0) || <User size={20} />}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{user?.name}</p>
              <p className="truncate text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <nav className="mt-5 space-y-1">
            <Link to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
              <Package size={16} /> My Orders
            </Link>
            <Link to="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
              <Heart size={16} /> Wishlist
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        {/* Forms */}
        <div className="space-y-6">
          <form onSubmit={saveProfile} className="card p-6">
            <h3 className="mb-4 text-lg font-bold">Profile Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Email</label>
                <input className="input bg-gray-50" value={user?.email || ''} disabled />
              </div>
            </div>
            <button className="btn-primary mt-4" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </button>
          </form>

          <form onSubmit={changePassword} className="card p-6">
            <h3 className="mb-4 text-lg font-bold">Change Password</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input"
                  minLength={6}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            <button className="btn-primary mt-4" disabled={savingPassword}>
              {savingPassword ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
