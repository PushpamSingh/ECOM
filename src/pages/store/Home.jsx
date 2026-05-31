import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useCatalog.js';
import ProductCard from '@/components/product/ProductCard.jsx';
import FeatureStrip from '@/components/store/FeatureStrip.jsx';
import BannerCarousel from '@/components/store/BannerCarousel.jsx';
import { Spinner } from '@/components/common/Loader.jsx';

export default function Home() {
  const { data: featured, isLoading } = useProducts({ featured: true, limit: 8 });
  const { data: latest } = useProducts({ sort: 'newest', limit: 8 });
  const { data: categories = [] } = useCategories();
  const parents = categories.filter((c) => !c.parent);

  return (
    <div>
      {/* Dynamic hero banners (managed in Admin → Content → Banners) */}
      <BannerCarousel />

      <FeatureStrip />

      {/* Categories */}
      {parents.length > 0 && (
        <section className="container-page py-6">
          <SectionHeader title="Shop by Category" to="/shop" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {parents.map((c) => (
              <Link
                key={c._id}
                to={`/shop?category=${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 text-center shadow-card transition hover:border-primary-300"
              >
                <img src={c.image} alt={c.name} className="h-16 w-16 rounded-full object-cover" />
                <span className="text-sm font-semibold text-ink group-hover:text-primary-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {(isLoading || featured?.data?.length > 0) && (
        <section className="container-page py-8">
          <SectionHeader title="Featured Products" to="/shop?featured=true" />
          {isLoading ? (
            <div className="grid place-items-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.data.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Promo banner */}
      <section className="container-page py-4">
        <div className="overflow-hidden rounded-2xl bg-ink">
          <div className="flex flex-col items-center justify-between gap-6 p-8 text-center sm:flex-row sm:text-left lg:p-12">
            <div>
              <h3 className="text-2xl font-bold text-white lg:text-3xl">Festive Gift Sets are here</h3>
              <p className="mt-2 text-gray-300">Curated incense hampers, up to 25% off this season.</p>
            </div>
            <Link to="/shop?category=gift-sets" className="btn-primary shrink-0">
              Explore Gifts <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest */}
      {latest?.data?.length > 0 && (
        <section className="container-page py-8">
          <SectionHeader title="New Arrivals" to="/shop?sort=newest" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {latest.data.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ title, to }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <Link to={to} className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline">
        View All <ArrowRight size={15} />
      </Link>
    </div>
  );
}
