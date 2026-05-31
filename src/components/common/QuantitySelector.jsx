import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="inline-flex items-center rounded-md border border-gray-300">
      <button className="px-3 py-2 text-gray-600 hover:text-primary-600" onClick={() => set(value - 1)} aria-label="Decrease">
        <Minus size={14} />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => set(Number(e.target.value) || min)}
        className="w-12 border-x border-gray-300 py-2 text-center text-sm outline-none"
      />
      <button className="px-3 py-2 text-gray-600 hover:text-primary-600" onClick={() => set(value + 1)} aria-label="Increase">
        <Plus size={14} />
      </button>
    </div>
  );
}
