import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '@/hooks/useCatalog.js';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'Incense Sticks', to: '/shop?category=incense-sticks' },
      { label: 'Dhoop Cones', to: '/shop?category=dhoop-cones' },
      { label: 'Gift Sets', to: '/shop?category=gift-sets' },
    ],
  },
  {
    title: 'My Account',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Order History', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Shopping Cart', to: '/cart' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Contact Us', to: '/contact' },
      // { label: 'Shipping Policy', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & condition', to: '/Terms&condition' },
      { label: 'Returns', to: '/ReturnRefundPolicy' },
    ],
  },
];

export default function Footer() {
  const { data: settings } = useSettings();
  const socials = settings?.socials || {};

  return (
    <footer className="mt-12 bg-ink text-gray-300">
      <div className="container-page grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-600">अ</span>
            Agarbatti<span className="text-primary-500">Kart</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-gray-400">
            Hand-crafted incense, dhoop and pooja essentials delivered across India. Natural fragrances for
            your daily rituals.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={15} /> {settings?.phone || '+91 98765 43210'}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> {settings?.adminEmail || 'support@agarbattikart.com'}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} /> {settings?.address || 'Mysuru, Karnataka, India'}
            </li>
          </ul>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-semibold text-white">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-primary-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-sm text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} AgarbattiKart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socials.facebook && <Social href={socials.facebook} icon={Facebook} />}
            {socials.twitter && <Social href={socials.twitter} icon={Twitter} />}
            {socials.instagram && <Social href={socials.instagram} icon={Instagram} />}
            {socials.linkedin && <Social href={socials.linkedin} icon={Linkedin} />}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary-600"
    >
      <Icon size={16} />
    </a>
  );
}
