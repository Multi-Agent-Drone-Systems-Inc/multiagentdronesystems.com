import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePositions } from '../hooks/useSupabaseData';
import Button from './Button';

const Careers: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: positions, isLoading } = usePositions();

  // Check if there are any open positions
  const hasOpenPositions = positions.some(position => position.open);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleJoinTeamClick = () => {
    if (hasOpenPositions) {
      navigate('/careers');
    }
  };

  return (
    <section id="careers" className="relative z-50 bg-[#F5F5F5] -mt-20 pt-20">
      <div className="relative min-h-screen flex">
        {/* Content Section - Left Side */}
        <div 
          ref={sectionRef}
          className="w-full md:w-2/5 px-6 py-12 lg:py-0 lg:px-16 flex items-center transform transition-all duration-700 opacity-0 translate-y-10"
        >
          <div className="max-w-xl w-full">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Join Our Team
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              We're building the future of autonomous flight — together.
            </p>
            <Button 
              variant="primary" 
              onClick={handleJoinTeamClick}
              className={!hasOpenPositions ? 'no-click' : ''}
            >
              {hasOpenPositions ? 'See Available Positions' : 'No Open Positions'}
            </Button>
          </div>
        </div>

        {/* Image Section - Right Side (Extended) */}
        <div className="hidden md:block md:w-3/5 h-screen relative overflow-hidden">
          <img
            src="/images/careers.png"
            alt="Join Our Team"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F5]/20 via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Careers;