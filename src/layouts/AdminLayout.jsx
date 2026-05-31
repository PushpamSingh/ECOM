import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar.jsx';
import Topbar from '@/components/admin/Topbar.jsx';
import ScrollToTop from '@/components/common/ScrollToTop.jsx';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollToTop />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
