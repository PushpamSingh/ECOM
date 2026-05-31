import { useQuery } from '@tanstack/react-query';
import { bannerApi } from '@/apiservice/banner.api.js';

// Public: live banners for the storefront carousel.
export function useBanners(type) {
  return useQuery({
    queryKey: ['banners', 'live', type || 'all'],
    queryFn: () => bannerApi.listLive(type ? { type } : undefined).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

// Admin: all banners (with search/filter).
export function useAdminBanners(params) {
  return useQuery({
    queryKey: ['banners', 'admin', params],
    queryFn: () => bannerApi.listAdmin(params).then((r) => r.data),
    placeholderData: (prev) => prev,
  });
}
