// Fixed-height skeleton — reserves carousel space to prevent layout shift (CLS).
export default function BannerSkeleton() {
  return (
    <div className="container-page py-4">
      <div className="h-[440px] w-full animate-pulse rounded-2xl bg-gray-200 lg:h-[480px]" />
    </div>
  );
}
