import { Outlet } from 'react-router-dom';
import Header from '@/components/store/Header.jsx';
import Footer from '@/components/store/Footer.jsx';
import ScrollToTop from '@/components/common/ScrollToTop.jsx';

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
