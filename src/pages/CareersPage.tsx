import React, { useState } from 'react';
import { ArrowUpRight, MapPin, Clock, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePositions } from '../hooks/useSupabaseData';
import { useAuth } from '../contexts/AuthContext';
import ApplicationModal from '../components/ApplicationModal';
import AuthModal from '../components/AuthModal';

interface Position {
  id: string;
  title: string;
  location_type: string;
  employment_type: string;
  description: string;
  image_url?: string;
  open: boolean;
}

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position | null;
  onApply: () => void;
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  position, 
  onApply 
}) => {
  if (!isOpen || !position) return null;

  // Function to format description text
  const formatDescription = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n');
    const formattedLines: JSX.Element[] = [];

    lines.forEach((line, index) => {
      // Check if line starts with dash (bullet point)
      if (line.trim().startsWith('-')) {
        const bulletText = line.trim().substring(1).trim();
        // Process bold text within bullet points
        const processedText = bulletText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        formattedLines.push(
          <li key={index} className="mb-2">
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
          </li>
        );
      } else if (line.trim()) {
        // Regular paragraph - process bold text
        const processedText = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        formattedLines.push(
          <p key={index} className="mb-4">
            <span dangerouslySetInnerHTML={{ __html: processedText }} />
          </p>
        );
      }
    });

    return formattedLines;
  };

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
              <h2 className="text-2xl font-bold text-white">
                {position.title}
              </h2>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center text-white/70 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {position.location_type}
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {position.employment_type}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            {position.image_url && (
              <div className="mb-6">
                <img
                  src={position.image_url}
                  alt={position.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Description */}
            <div className="prose prose-gray max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed">
                {formatDescription(position.description || '').map((element, index) => {
                  // Check if we have consecutive list items to wrap them in ul
                  if (element.type === 'li') {
                    // Find consecutive li elements
                    const listItems = [];
                    let currentIndex = index;
                    
                    while (
                      currentIndex < formatDescription(position.description || '').length &&
                      formatDescription(position.description || '')[currentIndex]?.type === 'li'
                    ) {
                      listItems.push(formatDescription(position.description || '')[currentIndex]);
                      currentIndex++;
                    }
                    
                    // Only render the ul if this is the first li in a sequence
                    if (index === 0 || formatDescription(position.description || '')[index - 1]?.type !== 'li') {
                      return (
                        <ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-2">
                          {listItems}
                        </ul>
                      );
                    }
                    return null; // Skip individual li elements that are part of a list
                  }
                  return element;
                })}
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-center">
              <button
                onClick={onApply}
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apply for this Position
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CareersPage: React.FC = () => {
  const { data: positions, isLoading, error } = usePositions();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const handleBackToHome = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      const careersSection = document.getElementById('careers');
      if (careersSection) {
        careersSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleViewJobDescription = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    setSelectedPosition(position);
    setShowJobDescriptionModal(true);
  };

  const handleApplyFromModal = () => {
    if (!user) {
      setShowJobDescriptionModal(false);
      setShowAuthModal(true);
      return;
    }

    setShowJobDescriptionModal(false);
    setShowApplicationModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-900 text-xl">Loading positions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </div>

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full border border-orange-600 mb-8 shadow-lg">
              <span className="text-lg font-bold">We're hiring</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Be part of our mission
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We're looking for passion and creativity to help us shape the future of autonomous flight.
              At MADS, we value clear communication and full ownership
            </p>
          </motion.div>

          {/* Positions List */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {positions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No open positions at the moment.</p>
              </div>
            ) : (
              positions.map((position: Position, index: number) => (
                <motion.div
                  key={position.id}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                        {position.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                        {position.caption || 'No description available'}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          <MapPin className="w-4 h-4 mr-2" />
                          {position.location_type}
                        </div>
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                          <Clock className="w-4 h-4 mr-2" />
                          {position.employment_type}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleViewJobDescription(position.id)}
                        className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        View Job Description
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Job Description Modal */}
      <JobDescriptionModal
        isOpen={showJobDescriptionModal}
        onClose={() => {
          setShowJobDescriptionModal(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition}
        onApply={handleApplyFromModal}
      />

      {/* Application Modal */}
      {selectedPosition && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedPosition(null);
          }}
          positionId={selectedPosition.id}
          positionTitle={selectedPosition.title}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  );
};

export default CareersPage;