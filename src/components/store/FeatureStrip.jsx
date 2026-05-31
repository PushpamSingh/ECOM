import { Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders above ₹499' },
  { icon: ShieldCheck, title: '100% Natural', text: 'Hand-rolled incense' },
  { icon: CreditCard, title: 'Secure Payments', text: 'UPI, cards & COD' },
  { icon: Headphones, title: '24/7 Support', text: 'Dedicated help' },
];

export default function FeatureStrip() {
  return (
    <div className="container-page grid grid-cols-2 gap-4 py-8 lg:grid-cols-4">
      {FEATURES.map((f) => (
        <div key={f.title} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-card">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600">
            <f.icon size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{f.title}</p>
            <p className="text-xs text-gray-500">{f.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
