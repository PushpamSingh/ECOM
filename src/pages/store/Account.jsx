import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth.jsx';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import AccountDashboard from './AccountDashboard.jsx';

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  const redirect = location.state?.from || '/';

  // Signed-in users get the account dashboard instead of the login/register forms.
  if (isAuthenticated) return <AccountDashboard />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(loginForm);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : redirect);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerForm);
      toast.success('Account created!');
      navigate(redirect);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="My Account" items={[{ label: 'Account' }]} />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-2">
        {/* Login */}
        <div className="card p-7">
          <h2 className="mb-5 text-xl font-bold">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-10"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? 'Please wait…' : 'Log In'}
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500">
            Demo customer: customer@agarbattikart.com / Customer@123
          </p>
        </div>

        {/* Register */}
        <div className="card p-7">
          <h2 className="mb-5 text-xl font-bold">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                minLength={6}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Your personal data will be used to process your orders and support your experience across this
              website.
            </p>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? 'Please wait…' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
