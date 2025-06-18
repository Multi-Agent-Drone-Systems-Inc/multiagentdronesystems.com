import React, { useEffect, useRef } from 'react';
import Button from './Button';

const Hero: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPos = window.scrollY;
        const translateY = scrollPos * 0.5;
        const opacity = Math.max(0, 1 - scrollPos / 700);
        
        contentRef.current.style.transform = `translateY(${translateY}px)`;
        contentRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Hero Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-30 flex flex-col items-center px-4 sm:px-6 lg:px-8"
      >
        {/* Title Section - At the top */}
        <div className="text-center pt-12 sm:pt-16 md:pt-20 mb-8">
          <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight drop-shadow-lg leading-none mb-2">
            MULTI-AGENT
          </div>
          {/* Semi-transparent Drone Systems Text - Below Multi-Agent with minimal padding */}
          <div className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white/60 tracking-[0.3em] drop-shadow-lg">
            DRONE SYSTEMS
          </div>
        </div>

        {/* Spacer to push content below drone */}
        <div className="flex-1"></div>

        {/* Caption and Buttons - Below the drone */}
        <div className="text-center max-w-4xl pb-8 sm:pb-12 md:pb-16">
          <h2 className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 leading-relaxed drop-shadow-md">
            Revolutionizing industries through autonomous navigation and collaborative drone technology
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button 
              variant="primary" 
              className="shadow-xl text-xl px-12 py-6"
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Our Drones
            </Button>
            <Button 
              variant="secondary" 
              className="shadow-xl text-xl px-12 py-6"
              onClick={() => {
                document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Our Technology
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;