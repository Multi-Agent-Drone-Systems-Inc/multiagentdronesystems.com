import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, X, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useDroneById, useSimilarDrones } from '../hooks/useSupabaseData';
import { useAuth } from '../contexts/AuthContext';
import { addToCart, addToWishlist, isDroneInCart, isDroneInWishlist } from '../lib/cartWishlistUtils';
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
  produced: boolean;
  quantity: number;
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

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quantityError, setQuantityError] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  const { data: droneData, isLoading, error } = useDroneById(id || '');
  const { data: similarProducts, isLoading: similarLoading } = useSimilarDrones(id || '', 3);

  const drone = droneData[0] as DroneSpec | undefined;

  // Check if drone is in cart or wishlist
  useEffect(() => {
    const checkCartAndWishlistStatus = async () => {
      if (!user || !drone?.id) return;

      try {
        const [cartResult, wishlistResult] = await Promise.all([
          isDroneInCart(drone.id),
          isDroneInWishlist(drone.id)
        ]);

        setIsAddedToCart(cartResult.inCart);
        setIsAddedToWishlist(wishlistResult.inWishlist);
      } catch (error) {
        console.error('Error checking cart/wishlist status:', error);
      }
    };

    checkCartAndWishlistStatus();
  }, [user, drone?.id]);

  // Define button text based on state
  const cartButtonText = isAddedToCart ? 'Added to Cart' : 'Add to Cart';
  const wishlistButtonText = isAddedToWishlist ? 'Added to Wishlist' : 'Add to Wishlist';

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    
    if (newQuantity < 1) {
      return; // Don't allow quantity below 1
    }
    
    if (drone && newQuantity > drone.quantity) {
      setQuantityError('You have reached max quantity for this item');
      return;
    }
    
    setQuantity(newQuantity);
    setQuantityError(''); // Clear error when valid quantity is selected
  };

  const handleBuyNow = () => {
    if (drone?.quote) {
      setShowQuoteModal(true);
      return;
    }
    if (!drone?.in_stock) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    console.log('Buy now:', drone?.id, 'Quantity:', quantity);
  };

  const handleAddToCart = () => {
    if (drone?.quote) {
      setShowQuoteModal(true);
      return;
    }
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (drone?.in_stock) {
      // Add to cart
      addToCart(drone.id, quantity).then(result => {
        if (result.success) {
          console.log('Successfully added to cart');
          setIsAddedToCart(true);
          // You can add a toast notification here
        } else {
          console.error('Failed to add to cart:', result.error);
          // You can add error handling here
        }
      });
    } else {
      // Add to wishlist
      addToWishlist(drone.id).then(result => {
        if (result.success) {
          console.log('Successfully added to wishlist');
          setIsAddedToWishlist(true);
          // You can add a toast notification here
        } else {
          console.error('Failed to add to wishlist:', result.error);
          // You can add error handling here
        }
      });
    }
  };

  const handleSimilarProductClick = (productId: string) => {
    const product = similarProducts.find(p => p.id === productId);
    
    if (product?.quote) {
      setShowQuoteModal(true);
      return;
    }
    
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
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-700 mr-4">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                      {quantity > 1 && (
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="p-2 hover:bg-gray-100 transition-colors text-gray-900"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                      <span className={`px-4 py-2 font-medium text-gray-900 ${quantity === 1 ? 'pl-6' : ''}`}>
                        {quantity}
                      </span>
                      {quantity < drone.quantity && (
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="p-2 hover:bg-gray-100 transition-colors text-gray-900"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 ml-3">
                      {drone.quantity} available
                    </span>
                  </div>
                  {quantityError && (
                    <p className="text-sm text-red-600 mt-1">{quantityError}</p>
                  )}
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
                  disabled={!drone.in_stock && !drone.quote}
                  className={`flex-1 py-5 px-10 rounded-lg font-bold text-lg transition-all duration-300 transform shadow-lg ${
                    drone.quote
                      ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                      : !drone.in_stock 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105'
                  }`}
                >
                  {drone.quote ? 'Request Quote' : 'Buy Now'}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={drone.in_stock ? isAddedToCart : isAddedToWishlist}
                  className={`flex-1 border-2 py-5 px-10 rounded-lg font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    drone.quote
                      ? 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                      : drone.in_stock
                        ? isAddedToCart
                          ? 'border-green-300 text-green-800 bg-green-100 cursor-not-allowed'
                          : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                        : isAddedToWishlist
                          ? 'border-green-300 text-green-800 bg-green-100 cursor-not-allowed'
                          : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {drone.quote 
                    ? 'Get Quote' 
                    : drone.in_stock 
                      ? cartButtonText 
                      : wishlistButtonText
                  }
                </button>
              </div>
            </motion.div>
          </div>

          {/* Similar Products Section */}
          {!similarLoading && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Similar Products
              </h2>
              
              {similarProducts.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {similarProducts.map((product: DroneSpec) => (
                    <div
                      key={product.id}
                      onClick={() => handleSimilarProductClick(product.id)}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300 max-w-xs mx-auto ${
                        product.quote ? 'ring-2 ring-orange-200' : ''
                      }`}
                    >
                      <div className="aspect-square overflow-hidden h-48">
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
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {product.name}
                        </h3>
                        <div className={`text-base font-bold ${product.quote ? 'text-orange-600' : 'text-gray-900'}`}>
                          {product.quote 
                            ? 'Quote Required'
                            : product.price && product.price !== 'N/A' 
                              ? `USD $${product.price.toLocaleString()}` 
                              : 'Price Not Available'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">
                    No similar products available at the moment
                  </div>
                  <p className="text-gray-400 text-sm">
                    Check back soon for more drone options in our fleet
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
      
      {/* Quote Modal */}
      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        droneName={drone?.name || ''}
      />
    </div>
  );
};

export default ProductPage;