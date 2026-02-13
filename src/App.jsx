import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const Auth = lazy(() => import('./pages/Auth'));
const Account = lazy(() => import('./pages/Account'));
const About = lazy(() => import('./pages/About'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Collections = lazy(() => import('./pages/Collections'));

// Simple loading fallback
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
    <div className="loader">Yükleniyor...</div>
  </div>
);

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </Router>
    </ShopProvider>
  );
}

export default App;
