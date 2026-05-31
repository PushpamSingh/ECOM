import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumb({ title, items = [] }) {
  return (
    <div className="border-b bg-white">
      <div className="container-page flex flex-col gap-1 py-5">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link to="/" className="flex items-center gap-1 hover:text-primary-600">
            <Home size={14} /> Home
          </Link>
          {items.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <ChevronRight size={14} />
              {item.to ? (
                <Link to={item.to} className="hover:text-primary-600">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary-600">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
