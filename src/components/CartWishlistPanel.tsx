import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  getCartItems, 
  getWishlistItems, 
  removeFromCart, 
  removeFromWishlist, 
  updateCartQuantity,
  moveWishlistToCart,
  CartItem,
  WishlistItem 
} from '../lib/cartWishlistUtils';

interface CartWishlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'cart' | 'wishlist';
}

const CartWishlistPanel: React.FC<CartWishlistPanelProps> = ({ isOpen, onClose, type }) => {
  const [items, setItems] = useState<(CartItem | WishlistItem)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isCart = type === 'cart';
  const title = isCart ? 'Shopping Cart' : 'Wishlist';
  const emptyMessage = isCart ? 'Your cart is empty' : 'Your wishlist is empty';
  const emptySubMessage = isCart ? 'Add some drones to get started!' : 'Save items for later!';

  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen, type]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isCart) {
        const { data, error } = await getCartItems();
        if (error) throw new Error(error);
        setItems(data);
      } else {
        const { data, error } = await getWishlistItems();
        if (error) throw new Error(error);
        setItems(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { success, error } = isCart 
        ? await removeFromCart(itemId)
        : await removeFromWishlist(itemId);
      
      if (success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        setError(error || 'Failed to remove item');
      }
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!isCart) return;
    
    try {
      const { success, error } = await updateCartQuantity(itemId, newQuantity);
      
      if (success) {
        if (newQuantity === 0) {
          setItems(prev => prev.filter(item => item.id !== itemId));
        } else {
          setItems(prev => prev.map(item => 
            item.id === itemId 
              ? { ...item, quantity: newQuantity } as CartItem
              : item
          ));
        }
      } else {
        setError(error || 'Failed to update quantity');
      }
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleMoveToCart = async (wishlistItemId: string) => {
    if (isCart) return;
    
    try {
      const { success, error } = await moveWishlistToCart(wishlistItemId);
      
      if (success) {
        setItems(prev => prev.filter(item => item.id !== wishlistItemId));
      } else {
        setError(error || 'Failed to move item to cart');
      }
    } catch (err) {
      setError('Failed to move item to cart');
    }
  };

  const handleViewProduct = (droneId: string) => {
    onClose();
    navigate(`/product/${droneId}`);
  };

  const calculateTotal = () => {
    if (!isCart) return 0;
    return (items as CartItem[]).reduce((total, item) => {
      const price = item.drone?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isCart ? (
                <ShoppingCart className="w-6 h-6 text-white" />
              ) : (
                <Heart className="w-6 h-6 text-white" />
              )}
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchItems}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                {isCart ? (
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                ) : (
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
                <p className="text-gray-500 mb-6">{emptySubMessage}</p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse Drones
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div 
                        className="w-16 h-16 bg-white rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handleViewProduct(item.drone_id)}
                      >
                        <img
                          src={item.drone?.image_url}
                          alt={item.drone?.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="font-semibold text-gray-900 truncate cursor-pointer hover:text-gray-700 transition-colors"
                          onClick={() => handleViewProduct(item.drone_id)}
                        >
                          {item.drone?.name}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-lg font-bold text-gray-900">
                            {item.drone?.price ? formatPrice(item.drone.price) : 'N/A'}
                          </div>
                          
                          {/* Stock Status */}
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            item.drone?.in_stock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.drone?.in_stock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>

                        {/* Cart Quantity Controls */}
                        {isCart && (
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, (item as CartItem).quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                disabled={(item as CartItem).quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {(item as CartItem).quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, (item as CartItem).quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Wishlist Actions */}
                        {!isCart && (
                          <div className="flex items-center justify-between mt-3">
                            {item.drone?.in_stock ? (
                              <button
                                onClick={() => handleMoveToCart(item.id)}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span>Add to Cart</span>
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Out of stock</span>
                            )}
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-white">
              {isCart && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {!isCart && (
                <button
                  onClick={() => {
                    onClose();
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartWishlistPanel;