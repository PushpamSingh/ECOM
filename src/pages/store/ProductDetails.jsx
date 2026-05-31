import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { useProduct, useProductReviews } from '@/hooks/useCatalog.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useCartMutations } from '@/hooks/useCart.js';
import { useWishlist, useWishlistToggle } from '@/hooks/useWishlist.js';
import { productApi } from '@/apiservice/catalog.api.js';
import { useQueryClient } from '@tanstack/react-query';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import Rating from '@/components/common/Rating.jsx';
import QuantitySelector from '@/components/common/QuantitySelector.jsx';
import ProductCard from '@/components/product/ProductCard.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';
import { formatINR, discountPercent, formatDate } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProduct(slug);
  const { isAuthenticated } = useAuth();
  const { add } = useCartMutations();
  const { wishlist } = useWishlist();
  const toggleWishlist = useWishlistToggle();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('description');

  if (isLoading) return <PageLoader />;
  if (isError) return <div className="container-page py-20 text-center">Something went wrong. Please retry.</div>;
  if (!data?.product) return <div className="container-page py-20 text-center">Product not found.</div>;

  const { product, related } = data;
  const id = product._id;
  const finalPrice = product.finalPrice ?? product.price;
  const off = discountPercent(product.price, finalPrice);
  const images = product.images?.length ? product.images : [product.thumbnail];
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
    <div>
      <Breadcrumb
        title={product.name}
        items={[{ label: 'Shop', to: '/shop' }, { label: product.category?.name || 'Product' }]}
      />

      <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border bg-white">
            <img src={images[activeImg]} alt={product.name} className="aspect-square w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'h-20 w-20 overflow-hidden rounded-lg border-2',
                    i === activeImg ? 'border-primary-600' : 'border-transparent'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category?.name && (
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 text-3xl font-bold text-ink">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} count={product.numReviews} size={16} />
            <span className={cn('text-sm font-medium', product.inStock ? 'text-green-600' : 'text-red-600')}>
              {product.inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-ink">{formatINR(finalPrice)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatINR(product.price)}</span>
                <span className="badge bg-primary-100 text-primary-700">{off}% OFF</span>
              </>
            )}
          </div>

          {product.shortDescription && <p className="mt-4 text-gray-600">{product.shortDescription}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <QuantitySelector value={qty} onChange={setQty} max={product.stock || 99} />
            <button
              className="btn-primary"
              disabled={!product.inStock}
              onClick={() => requireAuth(() => add.mutate({ productId: id, quantity: qty }))}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={() => requireAuth(() => toggleWishlist.mutate(id))}
              className={cn('btn-outline', wishlisted && 'text-primary-600')}
            >
              <Heart size={18} className={wishlisted ? 'fill-primary-600' : ''} /> Wishlist
            </button>
          </div>

          <div className="mt-7 space-y-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Truck size={16} className="text-primary-600" /> Free shipping on orders above ₹499
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-600" /> 100% natural ingredients
            </p>
            {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-page pb-12">
        <div className="flex gap-6 border-b">
          {['description', 'reviews'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'border-b-2 px-1 pb-3 text-sm font-semibold capitalize',
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
              )}
            >
              {t === 'reviews' ? `Reviews (${product.numReviews})` : 'Description'}
            </button>
          ))}
        </div>
        <div className="py-6">
          {tab === 'description' ? (
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description || product.shortDescription || ''),
              }}
            />
          ) : (
            <ReviewsTab productId={id} canReview={isAuthenticated} onRequireAuth={() => navigate('/account')} />
          )}
        </div>
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <div className="container-page pb-16">
          <h2 className="mb-5 text-2xl font-bold text-ink">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ productId, canReview, onRequireAuth }) {
  const { data: reviews = [] } = useProductReviews(productId);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!canReview) return onRequireAuth();
    setSubmitting(true);
    try {
      await productApi.addReview(productId, { rating, comment });
      toast.success('Review submitted for approval');
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    } catch {
      /* handled by interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>}
        {reviews.map((r) => (
          <div key={r._id} className="card p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">{r.name}</span>
              <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
            </div>
            <Rating value={r.rating} size={14} className="mt-1" />
            {r.title && <p className="mt-2 font-medium">{r.title}</p>}
            <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="card h-fit p-5">
        <h3 className="mb-3 font-semibold text-ink">Write a Review</h3>
        <label className="label">Your Rating</label>
        <div className="mb-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" onClick={() => setRating(i)}>
              <span className={cn('text-2xl', i <= rating ? 'text-amber-400' : 'text-gray-300')}>★</span>
            </button>
          ))}
        </div>
        <label className="label">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="input"
          placeholder="Share your experience…"
          required
        />
        <button className="btn-primary mt-4 w-full" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
        {!canReview && (
          <p className="mt-2 text-center text-xs text-gray-500">
            <Link to="/account" className="text-primary-600">Sign in</Link> to write a review
          </p>
        )}
      </form>
    </div>
  );
}
