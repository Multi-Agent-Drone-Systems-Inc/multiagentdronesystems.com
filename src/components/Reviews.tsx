import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useReviews } from '../hooks/useSupabaseData';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import AuthModal from './AuthModal';

interface Review {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number;
  email: string;
  submitted_at: string;
}

const REVIEWS_PER_PAGE = 5;

const Reviews: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const { user } = useAuth();
  const { data: reviews, isLoading, error, refetch, count } = useReviews(currentPage, REVIEWS_PER_PAGE);

  const totalPages = Math.ceil((count || 0) / REVIEWS_PER_PAGE);

  useEffect(() => {
    if (isOpen || isModalOpen || showAuthModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, isModalOpen, showAuthModal]);

  useEffect(() => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      setAverageRating(Math.round(avg * 10) / 10);
    }
  }, [reviews]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedRating) errors.rating = 'This section is required';
    if (!reviewTitle.trim()) errors.title = 'This section is required';
    if (!reviewBody.trim()) errors.body = 'This section is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWriteReviewClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('reviews').insert([{
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        title: reviewTitle,
        body: reviewBody,
        rating: selectedRating,
        email: user.email,
        submitted_at: new Date().toISOString()
      }]);

      if (error) throw error;

      setSelectedRating(0);
      setReviewTitle('');
      setReviewBody('');
      setFormErrors({});
      setIsModalOpen(false);

      await refetch();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === page
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderRatingStars = (interactive = false) => {
    const ratingLabels = ['Very Poor', 'Poor', 'Average', 'Good', 'Great'];
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => interactive && setSelectedRating(rating)}
              onMouseEnter={() => interactive && setSelectedRating(rating)}
              className={`${interactive ? 'cursor-pointer' : ''}`}
            >
              <Star
                className={`w-6 h-6 ${
                  rating <= (interactive ? selectedRating : Math.floor(averageRating))
                    ? 'text-[#FFD700] fill-[#FFD700]'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {interactive && selectedRating > 0 && (
          <span className="text-sm text-gray-600">{ratingLabels[selectedRating - 1]}</span>
        )}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Only show reviews tab on homepage sections (not on other pages)
  const homepageSections = ['home', 'technology', 'products', 'faq', 'careers'];
  if (!homepageSections.includes(activeSection)) return null;

  // Hide reviews tab on home (hero) section and footer
  if (activeSection === 'home' || activeSection === 'footer') return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-0 top-1/2 -translate-y-3/4 bg-orange-500 text-white w-6 sm:w-8 py-6 sm:py-8 z-[9999] transform transition-transform duration-300 hover:bg-orange-600 ${
          isOpen ? 'translate-x-[50vw]' : 'translate-x-0 hover:translate-x-1'
        }`}
      >
        <div className="flex items-center justify-center transform rotate-90 whitespace-nowrap">
          <Star className="w-4 h-4 mr-2 -rotate-90 fill-white" />
          <span className="text-sm font-medium">Reviews</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-full md:w-1/2 bg-white z-[9999] overflow-y-auto"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden absolute top-2 left-2 sm:top-4 sm:left-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-8 mt-8 md:mt-0">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{averageRating}</span>
                        <div className="flex">{renderStars(Math.floor(averageRating))}</div>
                      </div>
                      <span className="text-sm text-gray-500">
                        Based on {count || 0} reviews
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="!px-4 sm:!px-6 !py-3 text-base"
                    onClick={handleWriteReviewClick}
                  >
                    Write a Review
                  </Button>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <div>Loading reviews...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button 
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-600">No reviews yet. Be the first to write one!</div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {reviews.map((review: Review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium">
                              {getInitials(review.name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900">{review.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(review.submitted_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <h4 className="font-medium text-gray-900 mt-2">{review.title}</h4>
                              <p className="text-gray-600 mt-2">{review.body}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {renderPagination()}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997]"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-0 -translate-x-1/2 -translate-y-0 w-full max-w-lg bg-white rounded-lg shadow-xl z-[9998] p-6 mx-4 sm:mx-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">SHARE YOUR THOUGHTS</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate your experience*
                  </label>
                  {renderRatingStars(true)}
                  {formErrors.rating && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write a review*
                  </label>
                  <textarea
                    value={reviewBody}
                    onChange={(e) => {
                      if (e.target.value.length <= 250) {
                        setReviewBody(e.target.value);
                      }
                    }}
                    placeholder="Tell us what you like or dislike"
                    className="w-full h-24 sm:h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFD700] text-gray-900"
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.body && (
                      <p className="text-sm text-red-600">{formErrors.body}</p>
                    )}
                    <p className={`text-sm ${reviewBody.length >= 250 ? 'text-red-600' : 'text-gray-500'}`}>
                      {reviewBody.length}/250 characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a title*
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FFD700] text-gray-900"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <Button
                  variant="primary"
                  className="w-full !bg-gray-900 !text-white hover:!bg-gray-800 !py-4 !text-lg"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </>
  );
};

export default Reviews;