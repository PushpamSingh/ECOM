import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from '@/components/common/Rating.jsx';
import { formatINR, discountPercent, IMG_FALLBACK, onImgError } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useCartMutations } from '@/hooks/useCart.js';
import { useWishlist, useWishlistToggle } from '@/hooks/useWishlist.js';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { add } = useCartMutations();
  const { wishlist } = useWishlist();
  const toggleWishlist = useWishlistToggle();

  const id = product._id || product.id;
  const finalPrice = product.finalPrice ?? product.price;
  const off = discountPercent(product.price, finalPrice);
  const wishlisted = wishlist.some((p) => (p._id || p.id) === id);

  const requireAuth = (fn) => {
    if (!isAuthenticated) {
      toast('Please sign in to continue');
      navigate('/account');
      return;
    }
    fn();
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition hover:shadow-md">
      {off > 0 && (
        <span className="badge absolute left-3 top-3 z-10 bg-primary-600 text-white">{off}% OFF</span>
      )}
      <button
        onClick={() => requireAuth(() => toggleWishlist.mutate(id))}
        className={cn(
          'absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow transition hover:text-primary-600',
          wishlisted ? 'text-primary-600' : 'text-gray-400'
        )}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} className={wishlisted ? 'fill-primary-600' : ''} />
      </button>

      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail || product.images?.[0] || IMG_FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={onImgError}
          className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category?.name && (
          <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
            {product.category.name}
          </span>
        )}
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink hover:text-primary-600"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">{formatINR(finalPrice)}</span>
            {off > 0 && <span className="text-sm text-gray-400 line-through">{formatINR(product.price)}</span>}
          </div>
        </div>
        <button
          className="btn-primary mt-2 w-full"
          disabled={product.stock === 0}
          onClick={() => requireAuth(() => add.mutate({ productId: id, quantity: 1 }))}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
