import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Products from './components/Products';
import FAQ from './components/FAQ';
import Careers from './components/Careers';
import Footer from './components/Footer';
import Reviews from './components/Reviews';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import ProductPage from './pages/ProductPage';

const HomePage: React.FC<{ onSectionChange: (section: string) => void }> = ({ onSectionChange }) => {
  return (
    <>
      <Navbar onSectionChange={onSectionChange} />
      <Hero />
      <Features />
      <Products />
      <FAQ />
      <Careers />
      <Footer />
    </>
  );
};

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  return (
    <div className="relative">
      {/* Reviews component should be visible on all pages except contact and product pages */}
      {location.pathname !== '/contact' && !location.pathname.startsWith('/product') && (
        <Reviews activeSection={activeSection} />
      )}
      
      <Routes>
        <Route path="/" element={<HomePage onSectionChange={setActiveSection} />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;