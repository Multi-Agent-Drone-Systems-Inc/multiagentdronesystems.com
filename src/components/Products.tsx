import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
}

const Products: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: droneList, isLoading, error } = useDrones();
  const navigate = useNavigate();

  const handleViewProduct = (droneId: string) => {
    navigate(`/product/${droneId}`);
  };

  if (isLoading) {
    return (
      <section id="products" className="relative z-20 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-900 text-xl">Loading drones...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="relative z-20 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
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

  if (droneList.length === 0) {
    return (
      <section id="products" className="relative z-20 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-900 text-xl">No drones available</div>
        </div>
      </section>
    );
  }

  const nextDrone = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, droneList.length - 3));
  };

  const prevDrone = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getVisibleDrones = () => {
    const visible = [];
    for (let i = Math.max(0, currentIndex - 1); i < Math.min(droneList.length, currentIndex + 4); i++) {
      visible.push({ drone: droneList[i], index: i });
    }
    return visible;
  };

  return (
    <section id="products" className="relative z-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                          linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
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
            disabled={currentIndex >= droneList.length - 3}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${
              currentIndex >= droneList.length - 3 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Cards Container */}
          <div className="flex justify-center items-center gap-6 px-16">
            {getVisibleDrones().map(({ drone, index }) => {
              const isCenter = index >= currentIndex && index < currentIndex + 3;
              const isEdge = index === currentIndex - 1 || index === currentIndex + 3;
              
              return (
                <div
                  key={drone.id}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 ${
                    isEdge ? 'hidden lg:block opacity-30 scale-80' : ''
                  }`}
                  style={{
                    width: isEdge ? '280px' : '320px',
                    height: '560px'
                  }}
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={drone.image_url}
                      alt={drone.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    {isCenter && (
                      <div className="space-y-4">
                        {/* Price */}
                        <div className="text-lg font-semibold text-gray-900">
                          {drone.price && drone.price !== 'N/A' ? `From USD $${drone.price.toLocaleString()}` : 'Price Not Available'}
                        </div>

                        {/* View Product Button */}
                        <button 
                          onClick={() => handleViewProduct(drone.id)}
                          className="w-full bg-gray-900 text-white py-4 px-8 rounded-full font-medium text-lg hover:bg-gray-800 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-300"
                        >
                          View Product
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.max(0, droneList.length - 2) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
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
    </section>
  );
};

export default Products;