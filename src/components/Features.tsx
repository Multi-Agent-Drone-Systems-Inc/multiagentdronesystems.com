import React, { useEffect, useRef, useState } from 'react';
import { Network, Brain, Radio, Target, Zap, Shield, Activity, Cpu, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDrones } from '../hooks/useSupabaseData';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center p-6 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-black/5">
    <div className="p-4 rounded-full bg-[#E8A87C]/20 shadow-lg mb-4">
      <Icon className="w-8 h-8 text-[#E8A87C]" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-100">{title}</h3>
    <p className="text-gray-300 text-center text-sm">{description}</p>
  </div>
);

// Animated background drone component with better visibility
const BackgroundDrone = ({ delay, path, size = 'w-4 h-4' }: { delay: number, path: string, size?: string }) => (
  <div 
    className={`absolute ${size} text-[#FFD700]/30`}
    style={{
      animation: `${path} 20s linear infinite`,
      animationDelay: `${delay}s`,
      filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))'
    }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
      <circle cx="6" cy="6" r="1.5" />
      <circle cx="18" cy="6" r="1.5" />
      <circle cx="6" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </svg>
  </div>
);

const Features: React.FC = () => {
  const droneRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Toggle for features display visibility - set to false to hide, true to show
  const SHOW_FEATURES_DISPLAY = false;
  
  // Use a simple counter to force re-renders
  const [rotationCounter, setRotationCounter] = useState(0);
  
  const { data: droneList, isLoading } = useDrones();

  // Filter only produced drones for the dashboard display
  const availableDrones = droneList.filter(drone => drone.produced && drone.show);
  
  // Calculate current drone based on counter
  const currentDroneIndex = availableDrones.length > 0 ? rotationCounter % availableDrones.length : 0;
  const currentDrone = availableDrones[currentDroneIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'scale-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'scale-95', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Set up rotation interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only start rotation if we have multiple drones
    if (availableDrones.length > 1) {
      console.log(`Starting drone rotation with ${availableDrones.length} drones`);
      
      intervalRef.current = setInterval(() => {
        setRotationCounter(prev => {
          const newCounter = prev + 1;
          const newIndex = newCounter % availableDrones.length;
          const newDrone = availableDrones[newIndex];
          console.log(`Rotating to drone ${newIndex + 1}/${availableDrones.length}: ${newDrone?.name}`);
          return newCounter;
        });
      }, 4000); // 4 seconds
    } else {
      console.log(`Not starting rotation: only ${availableDrones.length} drone(s) available`);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [availableDrones.length]); // Re-run when number of drones changes

  // Debug logging
  useEffect(() => {
    console.log('Current rotation state:', {
      rotationCounter,
      currentDroneIndex,
      currentDroneName: currentDrone?.name,
      totalDrones: availableDrones.length,
      isLoading
    });
  }, [rotationCounter, currentDroneIndex, currentDrone?.name, availableDrones.length, isLoading]);

  return (
    <section id="technology" className="relative z-20 overflow-hidden min-h-screen">
      {/* Animated Background Drones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Define keyframes in a style tag */}
        <style>
          {`
            @keyframes flyLeft {
              0% { transform: translateX(100vw) translateY(20vh) rotate(0deg); }
              100% { transform: translateX(-10vw) translateY(80vh) rotate(360deg); }
            }
            @keyframes flyRight {
              0% { transform: translateX(-10vw) translateY(60vh) rotate(0deg); }
              100% { transform: translateX(100vw) translateY(10vh) rotate(-360deg); }
            }
            @keyframes flyDiagonal {
              0% { transform: translateX(-10vw) translateY(90vh) rotate(0deg); }
              50% { transform: translateX(50vw) translateY(10vh) rotate(180deg); }
              100% { transform: translateX(110vw) translateY(80vh) rotate(360deg); }
            }
            @keyframes flyLoop {
              0% { transform: translateX(20vw) translateY(30vh) rotate(0deg); }
              25% { transform: translateX(80vw) translateY(20vh) rotate(90deg); }
              50% { transform: translateX(70vw) translateY(70vh) rotate(180deg); }
              75% { transform: translateX(10vw) translateY(80vh) rotate(270deg); }
              100% { transform: translateX(20vw) translateY(30vh) rotate(360deg); }
            }
            @keyframes flyZigzag {
              0% { transform: translateX(0vw) translateY(40vh) rotate(0deg); }
              20% { transform: translateX(20vw) translateY(20vh) rotate(72deg); }
              40% { transform: translateX(40vw) translateY(60vh) rotate(144deg); }
              60% { transform: translateX(60vw) translateY(30vh) rotate(216deg); }
              80% { transform: translateX(80vw) translateY(70vh) rotate(288deg); }
              100% { transform: translateX(100vw) translateY(50vh) rotate(360deg); }
            }
            @keyframes flySpiral {
              0% { transform: translateX(50vw) translateY(50vh) rotate(0deg) scale(0.5); }
              25% { transform: translateX(70vw) translateY(30vh) rotate(90deg) scale(0.8); }
              50% { transform: translateX(30vw) translateY(20vh) rotate(180deg) scale(1.2); }
              75% { transform: translateX(20vw) translateY(70vh) rotate(270deg) scale(0.8); }
              100% { transform: translateX(50vw) translateY(50vh) rotate(360deg) scale(0.5); }
            }
          `}
        </style>

        {/* Background Drones with golden color and glow effect */}
        <BackgroundDrone delay={0} path="flyLeft" size="w-3 h-3" />
        <BackgroundDrone delay={2} path="flyRight" size="w-4 h-4" />
        <BackgroundDrone delay={4} path="flyDiagonal" size="w-2 h-2" />
        <BackgroundDrone delay={6} path="flyLoop" size="w-5 h-5" />
        <BackgroundDrone delay={8} path="flyZigzag" size="w-3 h-3" />
        <BackgroundDrone delay={10} path="flySpiral" size="w-4 h-4" />
        <BackgroundDrone delay={12} path="flyLeft" size="w-2 h-2" />
        <BackgroundDrone delay={14} path="flyRight" size="w-3 h-3" />
        <BackgroundDrone delay={16} path="flyDiagonal" size="w-4 h-4" />
        <BackgroundDrone delay={18} path="flyLoop" size="w-2 h-2" />
        
        {/* Additional smaller drones for more density */}
        <BackgroundDrone delay={1} path="flyRight" size="w-2 h-2" />
        <BackgroundDrone delay={3} path="flyLeft" size="w-3 h-3" />
        <BackgroundDrone delay={5} path="flySpiral" size="w-2 h-2" />
        <BackgroundDrone delay={7} path="flyZigzag" size="w-3 h-3" />
        <BackgroundDrone delay={9} path="flyDiagonal" size="w-2 h-2" />
        <BackgroundDrone delay={11} path="flyLoop" size="w-4 h-4" />
        <BackgroundDrone delay={13} path="flyRight" size="w-2 h-2" />
        <BackgroundDrone delay={15} path="flyLeft" size="w-3 h-3" />
        <BackgroundDrone delay={17} path="flySpiral" size="w-2 h-2" />
        <BackgroundDrone delay={19} path="flyZigzag" size="w-3 h-3" />
        
        {/* Even more drones for a busy sky effect */}
        <BackgroundDrone delay={0.5} path="flyDiagonal" size="w-2 h-2" />
        <BackgroundDrone delay={2.5} path="flyLoop" size="w-3 h-3" />
        <BackgroundDrone delay={4.5} path="flyRight" size="w-2 h-2" />
        <BackgroundDrone delay={6.5} path="flySpiral" size="w-4 h-4" />
        <BackgroundDrone delay={8.5} path="flyLeft" size="w-2 h-2" />
        <BackgroundDrone delay={10.5} path="flyZigzag" size="w-3 h-3" />
        <BackgroundDrone delay={12.5} path="flyDiagonal" size="w-2 h-2" />
        <BackgroundDrone delay={14.5} path="flyLoop" size="w-3 h-3" />
        <BackgroundDrone delay={16.5} path="flyRight" size="w-2 h-2" />
        <BackgroundDrone delay={18.5} path="flySpiral" size="w-4 h-4" />
      </div>

      <div className="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 z-20">
        <div className="text-center mb-16">
          <p className="text-[#E8A87C] text-sm font-semibold tracking-wider mb-3">OUR TECHNOLOGY</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-bold">Advanced Multi-Agent Technology</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-start">
          {/* Left Features */}
          <div className="space-y-8 order-2 lg:order-1">
            <FeatureCard
              icon={Network}
              title="Swarm Coordination"
              description="Drones operate in autonomously coordinated formations, adapting in real-time to mission goals and environmental conditions"
            />
            <FeatureCard
              icon={Brain}
              title="Adaptive AI Processing"
              description="Vast streams of sensor data are processed to make intelligent flight, targeting, and routing decisions instantly" 
            />
            <FeatureCard
              icon={Zap}
              title="Rapid Decision Making"
              description="Advanced algorithms enable split-second tactical decisions for optimal mission execution and threat avoidance"
            />
          </div>

          {/* Center Column - Always Present */}
          <div className="flex justify-center items-start p-4 order-1 lg:order-2">
            {SHOW_FEATURES_DISPLAY && (
            <motion.div 
              ref={dashboardRef}
              className="w-full min-h-[400px] h-auto lg:h-[730px] bg-[#0A0A0A]/95 rounded-xl p-6 backdrop-blur-md shadow-2xl border border-gray-700/30 relative
                      transform"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.8
                }
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Dashboard Header */}
              <div className="bg-transparent rounded-lg p-4 mb-4">
                <h3 className="text-white text-lg text-center tracking-[0.2em] uppercase font-orbitron">System Dashboard</h3>
                <p className="text-gray-400 text-sm text-center mt-1 tracking-[0.15em] uppercase font-bold font-orbitron">
                  {currentDrone?.name || 'Loading...'}
                </p>
              </div>
              
              {/* Drone Image Display */}
              <div ref={droneRef} className="relative h-[200px] lg:h-[350px] flex items-center justify-center perspective-1000 mx-auto mb-6">
                {!isLoading && currentDrone && (
                  <motion.div
                    key={`rotation-${rotationCounter}`} // Force new component on each rotation
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="w-full h-full relative"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg overflow-hidden border border-gray-700/30 backdrop-blur-sm">
                      <img
                        src={currentDrone.image_url}
                        alt={currentDrone.name}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      {/* Overlay with drone name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-sm font-medium text-center">
                          {currentDrone.name}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Fallback if no drones available or loading */}
                {(isLoading || !currentDrone) && (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700/30">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-[#FFD700]" />
                      </div>
                      <p className="text-gray-400 text-sm">
                        {isLoading ? 'Loading Drone Data...' : 'No Drones Available'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/60 rounded-lg p-3 backdrop-blur-sm border border-gray-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[10px] text-gray-500">LATENCY</span>
                  </div>
                  <div className="text-md font-bold text-[#FFD700]">8ms</div>
                  <div className="text-[10px] text-gray-400">Inter-drone</div>
                </div>
                
                <div className="bg-gray-900/60 rounded-lg p-3 backdrop-blur-sm border border-gray-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <Cpu className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[10px] text-gray-500">AI POWER</span>
                  </div>
                  <div className="text-md font-bold text-[#FFD700]">12 TOPS</div>
                  <div className="text-[10px] text-gray-400">Computing</div>
                </div>
                
                <div className="bg-gray-900/60 rounded-lg p-3 backdrop-blur-sm border border-gray-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <Wifi className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[10px] text-gray-500">BANDWIDTH</span>
                  </div>
                  <div className="text-md font-bold text-[#FFD700]">1.2 Gbps</div>
                  <div className="text-[10px] text-gray-400">Mesh Network</div>
                </div>
              </div>
              
              {/* Console Window */}
              <div className="bg-black rounded-lg p-4 font-mono text-sm relative z-10 mt-4 h-24 lg:h-32">
                <div className="space-y-1">
                  <div className="flex">
                    <span className="text-green-500 mr-2">●</span>
                    <span className="text-gray-400">System:</span>
                    <span className="text-white ml-2">Active</span>
                  </div>
                  <div className="flex">
                    <span className="text-blue-500 mr-2">●</span>
                    <span className="text-gray-400">Units:</span>
                    <span className="text-white ml-2">{availableDrones.length} Connected</span>
                  </div>
                  <div className="flex">
                    <span className="text-yellow-500 mr-2">●</span>
                    <span className="text-gray-400">Mission:</span>
                    <span className="text-white ml-2">Surveillance</span>
                  </div>
                  <div className="flex">
                    <span className="text-purple-500 mr-2">●</span>
                    <span className="text-gray-400">Battery:</span>
                    <span className="text-white ml-2">87%</span>
                  </div>
                </div>
              </div>
              
              {/* Grid Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none rounded-xl"
                style={{
                  backgroundImage: `linear-gradient(to right, #0066cc 1px, transparent 1px),
                                  linear-gradient(to bottom, #0066cc 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              ></div>
            </motion.div>
            )}
          </div>

          {/* Right Features */}
          <div className="space-y-8 order-3">
            <FeatureCard
              icon={Radio}
              title="Real-time Communication"
              description="Constant, encrypted communication with nearby units for synchronized operations with zero delay"
            />
            <FeatureCard
              icon={Target}
              title="Versatile Applications"
              description="Interchangeable payloads and customizable control layers for peak adaptability to surveillance, mapping, or delivery missions" 
            />
            <FeatureCard
              icon={Shield}
              title="Durable Materials"
              description="Composite materials for resilience in extreme conditions while maintaining optimal weight-to-strength ratio"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;