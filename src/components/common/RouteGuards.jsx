import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useSeller } from '@/hooks/useSeller.js';
import { PageLoader } from './Loader.jsx';

// Requires any logged-in user; otherwise redirects to the storefront account page.
export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/account" state={{ from: location.pathname }} replace />;
  return children;
}

// Requires the logged-in user to be a registered seller; otherwise sends them to onboarding.
export function RequireSeller({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { isSeller, isLoading } = useSeller();
  const location = useLocation();
  if (loading || (isAuthenticated && isLoading)) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/account" state={{ from: location.pathname }} replace />;
  if (!isSeller) return <Navigate to="/become-seller" replace />;
  return children;
}

// Requires an admin user; otherwise redirects to the admin login.
export function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
