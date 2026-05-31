// Injects a Cloudinary transformation into a delivery URL for responsive, optimized
// images. Returns the URL unchanged for non-Cloudinary URLs (e.g. seed/placeholder).
export function cld(url, transform) {
  if (!url || typeof url !== 'string' || !url.includes('/upload/')) return url || '';
  return url.replace('/upload/', `/upload/${transform}/`);
}

// Standard responsive variants for banners.
export const bannerDesktop = (url) => cld(url, 'c_fill,w_1920,h_700,f_auto,q_auto');
export const bannerMobile = (url) => cld(url, 'c_fill,w_800,h_1000,f_auto,q_auto');
