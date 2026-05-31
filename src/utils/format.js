export const formatINR = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

export const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

// Discount percentage between MRP and selling price (for the "x% off" badge).
export const discountPercent = (price, finalPrice) => {
  if (!price || finalPrice >= price) return 0;
  return Math.round(((price - finalPrice) / price) * 100);
};

// Inline SVG placeholder shown when a product image is missing or fails to load.
export const IMG_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>";

// Use as: onError={onImgError}
export const onImgError = (e) => {
  if (e.currentTarget.src !== IMG_FALLBACK) e.currentTarget.src = IMG_FALLBACK;
};
