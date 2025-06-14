import React, { useEffect, useRef } from 'react';
import { Network, Brain, Radio, Target, Zap, Shield, Activity, Cpu, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center p-6 transition-all duration-300 rounded-xl backdrop-blur-sm hover:bg-black/5">
    <div className="p-4 rounded-full bg-[#E8A87C]/20 shadow-lg mb-4">
      <Icon className="w-8 h-8 text-[#E8A87C]" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-100">{title}</h3>
    <p className="text-gray-300 text-center text-sm">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const droneRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="technology" className="relative z-20 bg-gray-800 -mt-0">
      <div className="relative max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <p className="text-[#E8A87C] text-sm font-semibold tracking-wider mb-3">OUR TECHNOLOGY</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 font-bold">Advanced Multi-Agent Technology</h2>
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

          {/* Center Image */}
          <div className="flex justify-center items-start p-4 order-1 lg:order-2">
            <motion.div 
              ref={dashboardRef}
              className="w-full min-h-[400px] h-auto lg:h-[730px] bg-[#0A0A0A]/90 rounded-xl p-6 backdrop-blur-md shadow-2xl border border-gray-800/30 relative
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
                <p className="text-gray-400 text-sm text-center mt-1 tracking-[0.15em] uppercase font-bold font-orbitron" >Falcon Drone</p>
              </div>
              
              <div ref={droneRef} className="relative h-[200px] lg:h-[350px] flex items-center justify-center perspective-1000 mx-auto">
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-3 backdrop-blur-sm border border-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[10px] text-gray-500">LATENCY</span>
                  </div>
                  <div className="text-md font-bold text-[#FFD700]">8ms</div>
                  <div className="text-[10px] text-gray-400">Inter-drone</div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-3 backdrop-blur-sm border border-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <Cpu className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-[10px] text-gray-500">AI POWER</span>
                  </div>
                  <div className="text-md font-bold text-[#FFD700]">12 TOPS</div>
                  <div className="text-[10px] text-gray-400">Computing</div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-3 backdrop-blur-sm border border-gray-800/30">
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
                    <span className="text-white ml-2">6 Connected</span>
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