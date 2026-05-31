import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners.js';
import BannerCard from './BannerCard.jsx';
import BannerSkeleton from './BannerSkeleton.jsx';
import { cn } from '@/utils/cn.js';

const AUTOPLAY_MS = 5000;

// Static fallback shown if there are no banners / the API fails — keeps the hero
// area from collapsing and avoids a broken first impression.
function FallbackHero() {
  return (
    <div className="container-page py-4">
      <div className="flex h-[440px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 via-amber-50 to-white text-center lg:h-[480px]">
        <h2 className="text-3xl font-extrabold text-ink lg:text-4xl">Elevate Every Ritual with <span className="text-primary-600">AgarbattiKart</span></h2>
        <p className="mt-3 max-w-md text-gray-600">Hand-rolled incense, dhoop and pooja essentials delivered across India.</p>
        <a href="/shop" className="btn-primary mt-6">Shop Now</a>
      </div>
    </div>
  );
}

export default function BannerCarousel() {
  const { data: banners = [], isLoading, isError } = useBanners('hero');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const count = banners.length;
  const go = useCallback((i) => setIndex((prev) => (count ? (i + count) % count : 0)), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Keep index in range if banners change.
  useEffect(() => { if (index >= count && count > 0) setIndex(0); }, [count, index]);

  // Autoplay (paused on hover / when only one slide).
  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  if (isLoading) return <BannerSkeleton />;
  if (isError || count === 0) return <FallbackHero />;

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX.current = null;
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  return (
    <section className="container-page py-4">
      <div
        className="group relative outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="Promotional banners"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides — only the active is in flow; fixed height prevents CLS. */}
        <div className="relative">
          {banners.map((b, i) => (
            <div key={b._id} className={cn(i === index ? 'block' : 'hidden')} aria-hidden={i !== index}>
              <BannerCard banner={b} eager={i === 0} />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-ink shadow transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-ink shadow transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((b, i) => (
                <button
                  key={b._id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
