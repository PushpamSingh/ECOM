import { useQuery } from '@tanstack/react-query';
import { sellerApi, notificationApi } from '@/apiservice/marketplace.api.js';
import { useAuth } from './useAuth.jsx';

// Loads the seller context for the logged-in user. Resolves to null if they
// aren't a seller (the /seller/me probe 403/404s silently).
export function useSeller() {
  const { isAuthenticated } = useAuth();
  const query = useQuery({
    queryKey: ['seller', 'me'],
    queryFn: () => sellerApi.me().then((r) => r.data),
    enabled: isAuthenticated,
    retry: false,
  });

  const data = query.data || null;
  return {
    ...query,
    seller: data?.seller || null,
    verification: data?.verification || null,
    bank: data?.bank || null,
    wallet: data?.wallet || null,
    isSeller: !!data?.seller,
    isApproved: data?.seller?.status === 'active',
  };
}

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    enabled: isAuthenticated,
    refetchInterval: 60 * 1000,
  });
}
