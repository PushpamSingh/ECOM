import { STATUS_STYLES } from '@/constants';
import { cn } from '@/utils/cn.js';

export default function Badge({ status, children, className }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return <span className={cn('badge capitalize', style, className)}>{children || status}</span>;
}
