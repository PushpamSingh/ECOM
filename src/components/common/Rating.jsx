import { Star } from 'lucide-react';
import { cn } from '@/utils/cn.js';

export default function Rating({ value = 0, count, size = 14, className }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500">
          {Number(value).toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
