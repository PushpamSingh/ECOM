import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn.js';

export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="btn-outline h-9 w-9 p-0"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {nums.map((n, idx) => {
        const prev = nums[idx - 1];
        const gap = prev && n - prev > 1;
        return (
          <span key={n} className="flex items-center gap-2">
            {gap && <span className="text-gray-400">…</span>}
            <button
              onClick={() => onChange(n)}
              className={cn(
                'h-9 w-9 rounded-md text-sm font-semibold transition',
                n === page ? 'bg-primary-600 text-white' : 'border border-gray-300 bg-white hover:border-primary-500'
              )}
            >
              {String(n).padStart(2, '0')}
            </button>
          </span>
        );
      })}
      <button
        className="btn-outline h-9 w-9 p-0"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
