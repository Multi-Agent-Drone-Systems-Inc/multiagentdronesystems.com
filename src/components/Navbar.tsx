import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthButton from './AuthButton';

const navItems = [
  { name: 'Home', href: '#', id: 'home' },
  { name: 'Technology', href: '#technology', id: 'technology' },
  { name: 'Products', href: '#products', id: 'products' },
  { name: 'FAQ', href: '#faq', id: 'faq' },
  { name: 'Careers', href: '#careers', id: 'careers' },
  { name: 'Contact', href: '/contact', id: 'contact' }
];

interface Section {
  id: string;
  top: number;
  bottom: number;
}

interface NavbarProps {
  onSectionChange: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Get section boundaries
      const techSection = document.getElementById('technology');
      const productsSection = document.getElementById('products');
      const faqSection = document.getElementById('faq');
      const careersSection = document.getElementById('careers');
      
      const sections: Section[] = [];
      
      if (techSection) {
        const rect = techSection.getBoundingClientRect();
        sections.push({
          id: 'technology',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        });
      }
      
      if (productsSection) {
        const rect = productsSection.getBoundingClientRect();
        sections.push({
          id: 'products',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        });
      }
      
      if (faqSection) {
        const rect = faqSection.getBoundingClientRect();
        sections.push({
          id: 'faq',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        });
      }
      
      if (careersSection) {
        const rect = careersSection.getBoundingClientRect();
        sections.push({
          id: 'careers',
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        });
      }
      
      // Find the current section
      const currentSection = sections.find(section => 
        scrollPosition >= section.top && scrollPosition < section.bottom
      );
      
      setActiveSection(currentSection?.id || 'home');
      onSectionChange(currentSection?.id || 'home');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onSectionChange]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemName: string) => {
    e.preventDefault();
    
    if (itemName === 'Contact') {
      // Store current scroll position before navigating
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      navigate('/contact');
      return;
    }
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else if (href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav 
      id="navbar"
      className={`fixed w-full z-40 transition-colors duration-300 ${
        activeSection === 'home' ? 'bg-transparent' : 'bg-gray-800'
      }`}
    >
      {/* Logo */}
      <div className="absolute top-4 left-4 z-50">
        <img
          src="/images/icon.png"
          alt="MADS Logo"
          className="w-8 h-8"
        />
      </div>

      {/* Auth Button - Desktop Only */}
      <div className="absolute top-4 right-4 z-50 hidden lg:block">
        <AuthButton />
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center items-center space-x-8 py-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.name)}
              className={`text-sm font-medium transition-all duration-300 relative hover:scale-105 ${
                item.name === 'Contact'
                  ? 'px-3 py-1 -mt-1 border border-[#DAA520] text-gray-900 bg-white rounded hover:bg-[#FFD700] hover:border-[#FFD700]'
                  : activeSection === item.id ? 'text-white glow' : 'text-white/60 hover:text-white'
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile menu button - Only visible on mobile */}
        <div className="absolute top-2 right-4 lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-yellow-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Only visible on mobile */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'
        } ${activeSection === 'home' ? 'bg-black/80' : 'bg-gray-900'} backdrop-blur-sm`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.name)}
              className={`block px-3 py-4 text-base font-medium border-b border-gray-800/50 transition-all duration-300 ${
                activeSection === item.id ? 'text-white glow' : 'text-white/60 hover:text-white'
              }`}
            >
              {item.name}
            </a>
          ))}
          
          {/* Mobile Auth Button */}
          <div className="px-3 py-4 border-t border-gray-800/50">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;