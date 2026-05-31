import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '@/apiservice/catalog.api.js';
import { settingsApi } from '@/apiservice/misc.api.js';

export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productApi.reviews(productId).then((r) => r.data),
    enabled: !!productId,
  });
}

export function useCategories(params) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryApi.list(params).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings', 'public'],
    queryFn: () => settingsApi.public().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
}
