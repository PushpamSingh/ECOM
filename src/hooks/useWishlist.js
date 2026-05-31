import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/apiservice/commerce.api.js';
import { useAuth } from './useAuth.jsx';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.get().then((r) => r.data),
    enabled: isAuthenticated,
  });
  return { wishlist: data || [], isLoading };
}

export function useWishlistToggle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistApi.toggle(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });
}
