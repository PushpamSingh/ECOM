import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null;
  const width = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative my-10 w-full ${width} rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
