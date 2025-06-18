import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrones } from '../hooks/useSupabaseData';

interface DroneSpec {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price: number;
  range: string;
  flight_time: string;
  max_speed: string;
  payload: string;
  in_stock: boolean;
  show: boolean;
  produced: boolean;
  quote: boolean;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  droneName: string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, droneName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 relative rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                Request Quote
              </h2>
              <p className="text-white/70 text-sm mt-1">
                {droneName}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Direct Payment Temporarily Disabled
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Please email us to receive a quote and payment details.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Contact us at:</p>
              <a 
                href="mailto:financial@multiagentdronesystems.com"
                className="text-sm sm:text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors break-all"
              >
                financial@multiagentdronesystems.com
              </a>
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Products: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedDroneName, setSelectedDroneName] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const { data: droneList, isLoading, error } = useDrones();
  const navigate = useNavigate();

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax transform based on scroll position
  const getParallaxTransform = () => {
    const featuresSection = document.getElementById('technology');
    const productsSection = document.getElementById('products');
    
    if (!featuresSection || !productsSection) return 'translateY(0)';
    
    const featuresRect = featuresSection.getBoundingClientRect();
    const productsRect = productsSection.getBoundingClientRect();
    
    // Start the parallax effect when the products section is about to come into view
    const triggerPoint = window.innerHeight * 0.8;
    const parallaxStart = window.innerHeight - triggerPoint;
    
    // Calculate how much the products section should move up
    if (productsRect.top <= triggerPoint) {
      const progress = Math.min(1, (triggerPoint - productsRect.top) / (window.innerHeight * 0.5));
      const translateY = -progress * 100; // Move up by up to 100px
      return `translateY(${translateY}px)`;
    }
    
    return 'translateY(0)';
  };

  // Sort drones by priority: in_stock=true first, then produced=true, then coming soon
  const sortedDroneList = [...droneList].sort((a, b) => {
    // First priority: in_stock (true comes first)
    if (a.in_stock !== b.in_stock) {
      return b.in_stock ? 1 : -1;
    }
    
    // Second priority: produced (true comes first)
    if (a.produced !== b.produced) {
      return b.produced ? 1 : -1;
    }
    
    // If both have same in_stock and produced status, maintain original order
    return 0;
  });

  const handleViewProduct = (droneId: string) => {
    const drone = sortedDroneList.find(d => d.id === droneId);
    
    if (drone?.quote) {
      setSelectedDroneName(drone.name);
      setShowQuoteModal(true);
    } else {
      navigate(`/product/${droneId}`);
    }
  };

  if (isLoading) {
    return (
      <section id="products" className="relative z-30 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-900 text-xl">Loading drones...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="relative z-30 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (sortedDroneList.length === 0) {
    return (
      <section id="products" className="relative z-30 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-900 text-xl">No drones available</div>
        </div>
      </section>
    );
  }

  const nextDrone = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, sortedDroneList.length - 3));
  };

  const prevDrone = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getVisibleDrones = () => {
    const visible = [];
    for (let i = Math.max(0, currentIndex - 1); i < Math.min(sortedDroneList.length, currentIndex + 4); i++) {
      visible.push({ drone: sortedDroneList[i], index: i });
    }
    return visible;
  };

  return (
    <section 
      id="products" 
      className="relative z-30 overflow-hidden -mt-20"
      style={{
        transform: getParallaxTransform(),
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Products section background with rounded top corners and shadow */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl shadow-2xl relative pt-20">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5 rounded-t-3xl"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                            linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[#E8A87C] text-sm font-semibold tracking-wider mb-3 uppercase">Our Products</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Drone Fleet
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our cutting-edge drone fleet: precision-engineered solutions for every mission profile
            </p>
          </div>

          {/* Products Showcase */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevDrone}
              disabled={currentIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${
                currentIndex === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:shadow-xl'
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={nextDrone}
              disabled={currentIndex >= sortedDroneList.length - 3}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${
                currentIndex >= sortedDroneList.length - 3 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 hover:shadow-xl'
              }`}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Cards Container */}
            <div className="flex justify-center items-center gap-6 px-4 md:px-16">
              {getVisibleDrones().map(({ drone, index }) => {
                // On mobile, only show the current drone (center card)
                const isMobile = window.innerWidth < 768;
                const isCenter = isMobile ? index === currentIndex : (index >= currentIndex && index < currentIndex + 3);
                const isEdge = !isMobile && (index === currentIndex - 1 || index === currentIndex + 3);
                
                // Hide edge cards on mobile
                if (isMobile && index !== currentIndex) {
                  return null;
                }
                
                return (
                  <div
                    key={drone.id}
                    className={`relative bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full max-w-sm mx-auto ${
                      isEdge ? 'hidden lg:block opacity-30 scale-80' : ''
                    }`}
                    style={{
                      width: isMobile ? '100%' : (isEdge ? '280px' : '320px'),
                      maxWidth: isMobile ? '400px' : 'none',
                      height: '560px'
                    }}
                  >
                    {/* Product Image */}
                    <div 
                      className={`relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
                        drone.produced ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      onClick={() => drone.produced && handleViewProduct(drone.id)}
                    >
                      <img
                        src={drone.image_url}
                        alt={drone.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          drone.produced 
                            ? 'group-hover:scale-110' 
                            : 'opacity-40 filter grayscale'
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      
                      {/* Coming Soon Banner */}
                      {!drone.produced && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg transform -rotate-12">
                            COMING SOON
                          </div>
                        </div>
                      )}
                      
                      {drone.produced && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 h-72 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                          {drone.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
                          {drone.description}
                        </p>
                      </div>

                      {/* Only show price and button for center cards */}
                      {isCenter && drone.produced && (
                        <div className="space-y-4">
                          {/* Price */}
                          <div className="text-lg font-semibold text-gray-900">
                            {drone.price && drone.price !== 'N/A' ? `From USD $${drone.price.toLocaleString()}` : 'Price Not Available'}
                          </div>

                          {/* View Product Button */}
                          <button 
                            onClick={() => handleViewProduct(drone.id)}
                            className={`w-full py-3 px-6 rounded-full font-medium text-base transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                              drone.quote 
                                ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500' 
                                : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
                            }`}
                          >
                            {drone.quote ? 'Request Quote' : 'View Product'}
                          </button>
                        </div>
                      )}
                      
                      {/* Coming Soon Message for center cards */}
                      {isCenter && !drone.produced && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-500 mb-2">
                              Coming Soon
                            </div>
                            <p className="text-sm text-gray-400">
                              This drone is currently in development
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-8 space-x-2 px-4">
              {/* On mobile, show dots for all drones. On desktop, show dots for drone groups */}
              {Array.from({ 
                length: window.innerWidth < 768 
                  ? sortedDroneList.length 
                  : Math.max(0, sortedDroneList.length - 2) 
              }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // On mobile, set index directly. On desktop, use group logic
                    const targetIndex = window.innerWidth < 768 ? i : i;
                    setCurrentIndex(targetIndex);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex 
                      ? 'bg-gray-900 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quote Modal */}
      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        droneName={selectedDroneName}
      />
    </section>
  );
};

export default Products;