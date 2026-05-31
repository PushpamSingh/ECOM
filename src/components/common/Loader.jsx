import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn.js';

export function Spinner({ className }) {
  return <Loader2 className={cn('animate-spin text-primary-600', className)} />;
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-gray-500">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
