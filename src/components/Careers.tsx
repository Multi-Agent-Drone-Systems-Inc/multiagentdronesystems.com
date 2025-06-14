import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Careers: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    navigate('/careers');
  };

  return (
    <section id="careers" className="relative z-20 bg-[#F5F5F5]">
      <div className="relative min-h-screen flex">
        {/* Content Section - Left Side */}
        <div 
          ref={sectionRef}
          className="w-2/5 px-6 py-12 lg:py-0 lg:px-16 flex items-center transform transition-all duration-700 opacity-0 translate-y-10"
        >
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Join Our Team
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              We're building the future of autonomous flight — together.
            </p>
            <Button variant="primary" onClick={handleJoinTeamClick}>
              See Available Positions
            </Button>
          </div>
        </div>

        {/* Image Section - Right Side (Extended) */}
        <div className="w-3/5 h-screen relative overflow-hidden">
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