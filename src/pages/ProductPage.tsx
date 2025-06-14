import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useDroneById, useSimilarDrones } from '../hooks/useSupabaseData';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

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

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: droneData, isLoading, error } = useDroneById(id || '');
  const { data: similarProducts, isLoading: similarLoading } = useSimilarDrones(id || '', 3);

  const drone = droneData[0] as DroneSpec | undefined;

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleBuyNow = () => {
    if (!drone?.in_stock) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    console.log('Buy now:', drone?.id, 'Quantity:', quantity);
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (drone?.in_stock) {
      console.log('Add to cart:', drone?.id, 'Quantity:', quantity);
    } else {
      console.log('Add to wishlist:', drone?.id);
    }
  };

  const handleSimilarProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleBackToProducts = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-900 text-xl">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !drone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Product not found'}</div>
          <button
            onClick={handleBackToProducts}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={handleBackToProducts}
          className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
      </div>

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Details Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={drone.image_url}
                  alt={drone.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {drone.name}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {drone.description}
              </p>

              {/* Specifications */}
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium text-gray-900">{drone.range}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Time:</span>
                    <span className="font-medium text-gray-900">{drone.flight_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Speed:</span>
                    <span className="font-medium text-gray-900">{drone.max_speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payload:</span>
                    <span className="font-medium text-gray-900">{drone.payload}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              {drone.price && drone.price !== 'N/A' && (
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  USD ${drone.price.toLocaleString()}
                </div>
              )}
              
              {(!drone.price || drone.price === 'N/A') && (
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  Price Not Available
                </div>
              )}

              {/* Quantity Selector */}
              {drone.in_stock && (
                <div className="flex items-center mb-8">
                <span className="text-gray-700 mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors text-gray-900"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors text-gray-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                </div>
              )}

              {!drone.in_stock && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">This item is currently out of stock</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBuyNow}
                  disabled={!drone.in_stock}
                  className={`flex-1 py-5 px-10 rounded-lg font-bold text-lg transition-all duration-300 transform shadow-lg ${
                    !drone.in_stock 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105'
                  }`}
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-gray-900 text-gray-900 py-5 px-10 rounded-lg font-medium text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {drone.in_stock ? 'Add to Cart' : 'Add to Wishlist'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Similar Products Section */}
          {!similarLoading && similarProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Similar Products
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {similarProducts.map((product: DroneSpec) => (
                  <div
                    key={product.id}
                    onClick={() => handleSimilarProductClick(product.id)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      {product.price && (
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {product.price !== 'N/A' ? `USD $${product.price.toLocaleString()}` : 'Price Not Available'}
                        </div>
                      )}
                      {(!product.price || product.price === 'N/A') && (
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          Price Not Available
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Range: {product.range}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  );
};

export default ProductPage;