import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useCatalog.js';
import ProductCard from '@/components/product/ProductCard.jsx';
import Breadcrumb from '@/components/common/Breadcrumb.jsx';
import Pagination from '@/components/common/Pagination.jsx';
import { PageLoader } from '@/components/common/Loader.jsx';
import EmptyState from '@/components/common/EmptyState.jsx';
import Rating from '@/components/common/Rating.jsx';
import { SORT_OPTIONS } from '@/constants';
import { cn } from '@/utils/cn.js';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const params = Object.fromEntries(searchParams.entries());
  const page = Number(params.page) || 1;

  const { data, isLoading, isFetching } = useProducts({ ...params, page, limit: 12 });
  const { data: categories = [] } = useCategories();
  const parents = categories.filter((c) => !c.parent);

  const [priceMax, setPriceMax] = useState(params.maxPrice || '');
  useEffect(() => setPriceMax(params.maxPrice || ''), [params.maxPrice]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === null) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams(params.q ? { q: params.q } : {});
  const activeCategory = params.category;
  const activeRating = params.rating;

  const products = data?.data || [];
  const meta = data?.meta;

  const FilterPanel = (
    <div className="space-y-6">
      <FilterBlock title="Categories">
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => setParam('category', '')}
              className={cn('text-sm hover:text-primary-600', !activeCategory && 'font-semibold text-primary-600')}
            >
              All Categories
            </button>
          </li>
          {parents.map((c) => (
            <li key={c._id}>
              <button
                onClick={() => setParam('category', c.slug)}
                className={cn(
                  'text-sm hover:text-primary-600',
                  activeCategory === c.slug && 'font-semibold text-primary-600'
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterBlock>

      <FilterBlock title="Max Price">
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={priceMax || 1000}
          onChange={(e) => setPriceMax(e.target.value)}
          onMouseUp={(e) => setParam('maxPrice', e.target.value)}
          onTouchEnd={(e) => setParam('maxPrice', e.target.value)}
          className="w-full accent-primary-600"
        />
        <p className="mt-1 text-sm text-gray-600">Up to ₹{priceMax || 1000}</p>
      </FilterBlock>

      <FilterBlock title="Rating">
        <ul className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <li key={r}>
              <button
                onClick={() => setParam('rating', String(r))}
                className={cn(
                  'flex items-center gap-2 hover:opacity-80',
                  activeRating === String(r) && 'font-semibold'
                )}
              >
                <Rating value={r} size={14} /> <span className="text-xs text-gray-500">& up</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterBlock>

      <button onClick={clearFilters} className="btn-outline w-full">
        Clear Filters
      </button>
    </div>
  );

  return (
    <div>
      <Breadcrumb title="Shop" items={[{ label: 'Shop' }]} />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="card sticky top-28 p-5">{FilterPanel}</div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <button onClick={() => setShowFilters(true)} className="btn-outline lg:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <p className="hidden text-sm text-gray-500 sm:block">
              {meta?.total || 0} product{meta?.total === 1 ? '' : 's'} found
            </p>
            <select
              value={params.sort || 'newest'}
              onChange={(e) => setParam('sort', e.target.value)}
              className="input max-w-[200px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <EmptyState title="No products found" message="Try adjusting your filters or search." />
          ) : (
            <>
              <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4', isFetching && 'opacity-60')}>
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination page={page} pages={meta?.pages} onChange={(p) => setParam('page', String(p))} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold">Filters</span>
              <button onClick={() => setShowFilters(false)}>
                <X />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBlock({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}
