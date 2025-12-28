import React from 'react';
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

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
