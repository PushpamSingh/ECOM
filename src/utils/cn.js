// Minimal className combiner.
export const cn = (...classes) => classes.filter(Boolean).join(' ');
