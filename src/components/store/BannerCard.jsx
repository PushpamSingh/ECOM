import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { bannerDesktop, bannerMobile } from '@/utils/image.js';
import { IMG_FALLBACK, onImgError } from '@/utils/format.js';
import { cn } from '@/utils/cn.js';

const POSITION = {
  left: 'items-center justify-start text-left',
  center: 'items-center justify-center text-center',
  right: 'items-center justify-end text-right',
};

// One banner slide. Uses <picture> so the browser natively picks the mobile image
// on small screens and the desktop image otherwise (falls back to desktop if no mobile).
export default function BannerCard({ banner, eager = false }) {
  const desktop = bannerDesktop(banner.desktopImage) || IMG_FALLBACK;
  const mobile = bannerMobile(banner.mobileImage || banner.desktopImage) || desktop;
  const isInternal = banner.buttonLink?.startsWith('/');

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl bg-gray-100 lg:h-[480px]">
      <picture>
        <source media="(max-width: 768px)" srcSet={mobile} />
        <img
          src={desktop}
          alt={banner.title || 'Banner'}
          onError={onImgError}
          loading={eager ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

      <div className={cn('absolute inset-0 flex p-6 sm:p-12 lg:p-16', POSITION[banner.textPosition] || POSITION.left)}>
        <div className="max-w-lg" style={{ color: banner.textColor || '#ffffff' }}>
          {banner.subtitle && (
            <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              {banner.subtitle}
            </span>
          )}
          {banner.title && <h2 className="text-3xl font-extrabold leading-tight drop-shadow sm:text-4xl lg:text-5xl">{banner.title}</h2>}
          {banner.description && <p className="mt-3 text-sm opacity-95 sm:text-base">{banner.description}</p>}
          {banner.buttonText && banner.buttonLink && (
            <div className="mt-6">
              {isInternal ? (
                <Link to={banner.buttonLink} className="btn inline-flex text-white" style={{ backgroundColor: banner.buttonColor || '#ea580c' }}>
                  {banner.buttonText} <ArrowRight size={16} />
                </Link>
              ) : (
                <a href={banner.buttonLink} className="btn inline-flex text-white" style={{ backgroundColor: banner.buttonColor || '#ea580c' }}>
                  {banner.buttonText} <ArrowRight size={16} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
