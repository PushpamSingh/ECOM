import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '@/apiservice/commerce.api.js';
import { useAuth } from './useAuth.jsx';

const EMPTY_CART = { items: [], subtotal: 0, tax: 0, shippingCost: 0, total: 0, count: 0 };

export function useCart() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get().then((r) => r.data),
    enabled: isAuthenticated,
  });
  return { cart: data || EMPTY_CART, isLoading };
}

export function useCartMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const add = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.add(productId, quantity),
    onSuccess: (res) => {
      queryClient.setQueryData(['cart'], res.data);
      toast.success('Added to cart');
    },
  });

  const update = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.update(productId, quantity),
    onSuccess: (res) => queryClient.setQueryData(['cart'], res.data),
  });

  const remove = useMutation({
    mutationFn: (productId) => cartApi.remove(productId),
    onSuccess: (res) => queryClient.setQueryData(['cart'], res.data),
  });

  const clear = useMutation({ mutationFn: () => cartApi.clear(), onSuccess: invalidate });

  return { add, update, remove, clear };
}
