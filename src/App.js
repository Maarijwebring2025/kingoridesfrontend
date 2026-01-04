import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PopularCategories from './components/PopularCategories';
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

// Home page component
const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <PopularCategories />
      <AvailabilityByDays />
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products-sharefox" element={<ProductsPageSharefox />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
