import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import ProductCard from '@/components/product/ProductCard.jsx';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading } = useWishlist();

  return (
    <>
      <Breadcrumb title="Wishlist" items={[{ label: 'Wishlist' }]} />
      <div className="container-page py-10">
        {!isAuthenticated ? (
          <EmptyState
            icon={Heart}
            title="Please sign in"
            message="Sign in to save and view your favourite products."
            action={<Link to="/account" className="btn-primary mt-2">Sign In</Link>}
          />
        ) : isLoading ? (
          <PageLoader />
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            message="Tap the heart on any product to save it here."
            action={<Link to="/shop" className="btn-primary mt-2">Browse Products</Link>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
