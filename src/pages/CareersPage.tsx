import React, { useState } from 'react';
import { ArrowUpRight, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
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
  open: boolean;
}

const CareersPage: React.FC = () => {
  const { data: positions, isLoading, error } = usePositions();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  const handleApply = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedPosition(position);
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
              We're looking for passionate people to join us on our mission. We value flat hierarchies, 
              clear communication, and full ownership and responsibility.
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
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {position.description}
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
                        onClick={() => handleApply(position.id)}
                        className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Apply
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-16 pt-16 border-t border-gray-200/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't see a role that fits?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. 
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
              Get in touch
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </div>

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