import { createBrowserRouter } from 'react-router-dom';
import StoreLayout from '@/layouts/StoreLayout.jsx';
import AdminLayout from '@/layouts/AdminLayout.jsx';
import SellerLayout from '@/layouts/SellerLayout.jsx';
import { RequireAuth, RequireAdmin, RequireSeller } from '@/components/common/RouteGuards.jsx';

// Storefront pages
import Home from '@/pages/store/Home.jsx';
import Shop from '@/pages/store/Shop.jsx';
import ProductDetails from '@/pages/store/ProductDetails.jsx';
import Cart from '@/pages/store/Cart.jsx';
import Checkout from '@/pages/store/Checkout.jsx';
import Wishlist from '@/pages/store/Wishlist.jsx';
import Account from '@/pages/store/Account.jsx';
import Orders from '@/pages/store/Orders.jsx';
import OrderDetail from '@/pages/store/OrderDetail.jsx';
import OrderSuccess from '@/pages/store/OrderSuccess.jsx';
import Contact from '@/pages/store/Contact.jsx';
import PrivacyPolicy from '@/pages/store/PrivacyPolicy.jsx';
import TermsAndConditions from '@/pages/store/TermsAndConditions.jsx';
import ReturnRefundPolicy from '@/pages/store/ReturnRefundPolicy.jsx';
import NotFound from '@/pages/store/NotFound.jsx';


// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin.jsx';
import Dashboard from '@/pages/admin/Dashboard.jsx';
import AdminProducts from '@/pages/admin/AdminProducts.jsx';
import ProductForm from '@/pages/admin/ProductForm.jsx';
import AdminCategories from '@/pages/admin/AdminCategories.jsx';
import AdminOrders from '@/pages/admin/AdminOrders.jsx';
import AdminOrderDetail from '@/pages/admin/AdminOrderDetail.jsx';
import AdminTransactions from '@/pages/admin/AdminTransactions.jsx';
import AdminCoupons from '@/pages/admin/AdminCoupons.jsx';
import AdminCustomers from '@/pages/admin/AdminCustomers.jsx';
import AdminReviews from '@/pages/admin/AdminReviews.jsx';
import AdminSettings from '@/pages/admin/AdminSettings.jsx';

// Seller pages
import BecomeSeller from '@/pages/seller/BecomeSeller.jsx';
import SellerProducts from '@/pages/seller/SellerProducts.jsx';
import SellerProductForm from '@/pages/seller/SellerProductForm.jsx';
import SellerWallet from '@/pages/seller/SellerWallet.jsx';
import SellerSettlements from '@/pages/seller/SellerSettlements.jsx';
import SellerProfile from '@/pages/seller/SellerProfile.jsx';

// Admin marketplace pages
import AdminSellers from '@/pages/admin/AdminSellers.jsx';
import AdminSellerDetail from '@/pages/admin/AdminSellerDetail.jsx';
import AdminProductReview from '@/pages/admin/AdminProductReview.jsx';
import AdminMarketplace from '@/pages/admin/AdminMarketplace.jsx';
import AdminMarketplaceSettings from '@/pages/admin/AdminMarketplaceSettings.jsx';
import AdminPayouts from '@/pages/admin/AdminPayouts.jsx';
import AdminDisputes from '@/pages/admin/AdminDisputes.jsx';
import AdminBanners from '@/pages/admin/AdminBanners.jsx';
import AdminBannerForm from '@/pages/admin/AdminBannerForm.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'product/:slug', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <RequireAuth><Checkout /></RequireAuth> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'account', element: <Account /> },
      { path: 'orders', element: <RequireAuth><Orders /></RequireAuth> },
      { path: 'orders/:id', element: <RequireAuth><OrderDetail /></RequireAuth> },
      { path: 'order-success/:id', element: <RequireAuth><OrderSuccess /></RequireAuth> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'Terms&condition', element: <TermsAndConditions /> },
      { path: 'ReturnRefundPolicy', element: <ReturnRefundPolicy /> },
      { path: 'become-seller', element: <RequireAuth><BecomeSeller /></RequireAuth> },
      {
        path: 'seller',
        element: (
          <RequireSeller>
            <SellerLayout />
          </RequireSeller>
        ),
        children: [
          { index: true, element: <SellerProducts /> },
          { path: 'products/new', element: <SellerProductForm /> },
          { path: 'products/:id', element: <SellerProductForm /> },
          { path: 'wallet', element: <SellerWallet /> },
          { path: 'settlements', element: <SellerSettlements /> },
          { path: 'profile', element: <SellerProfile /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'products/new', element: <ProductForm /> },
      { path: 'products/:id', element: <ProductForm /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'orders/:id', element: <AdminOrderDetail /> },
      { path: 'transactions', element: <AdminTransactions /> },
      { path: 'coupons', element: <AdminCoupons /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'settings', element: <AdminSettings /> },
      // Marketplace
      { path: 'marketplace', element: <AdminMarketplace /> },
      { path: 'sellers', element: <AdminSellers /> },
      { path: 'sellers/:id', element: <AdminSellerDetail /> },
      { path: 'product-review', element: <AdminProductReview /> },
      { path: 'payouts', element: <AdminPayouts /> },
      { path: 'disputes', element: <AdminDisputes /> },
      { path: 'marketplace-settings', element: <AdminMarketplaceSettings /> },
      // Content management
      { path: 'banners', element: <AdminBanners /> },
      { path: 'banners/new', element: <AdminBannerForm /> },
      { path: 'banners/:id', element: <AdminBannerForm /> },
    ],
  },
]);
