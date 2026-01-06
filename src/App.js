import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AvailabilityByDays from './components/AvailabilityByDays';
import SectionNavigation from './components/SectionNavigation';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import FAQSection from './components/FAQSection';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';
import ProductsPage from './components/ProductsPage';
import ProductsPageSharefox from './components/ProductsPageSharefox';
import ProductDetailPage from './components/ProductDetailPage';
import LandingProductsSharefox from './components/LandingProductsSharefox';
import SearchPage from './components/SearchPage';
import PackagesPage from './components/PackagesPage';
import ContactUsPage from './components/ContactUsPage';
import CustomProductDetailPage from './components/CustomProductDetailPage';

// One-time auto-refresh per route to ensure live embeds/data fetch correctly
const RouteRefresher = () => {
  const location = useLocation();
  useEffect(() => {
    try {
      const path = location.pathname || '/';
      const storageKey = `kr_refreshed_${path}`;
      const hasRefreshed = sessionStorage.getItem(storageKey);
      if (!hasRefreshed) {
        sessionStorage.setItem(storageKey, 'true');
        window.location.reload();
      }
    } catch (e) {
      // Fail-safe: do nothing on storage errors
    }
  }, [location.pathname]);
  return null;
};

// Home page component
const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <LandingProductsSharefox />
      <SectionNavigation />
      <HowItWorks />
      <Benefits />
      <FAQSection />
      <DownloadSection />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <RouteRefresher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products-sharefox" element={<ProductsPageSharefox />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/products/custom/:productId" element={<CustomProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
