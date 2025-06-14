import React from 'react';
import { Bone as Drone } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Drone className="w-8 h-8 mr-2 text-yellow-400" />
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-wide text-white">MADS</span>
        <span className="text-xs tracking-widest text-yellow-400">MULTI-AGENT DRONE SYSTEMS</span>
      </div>
    </div>
  );
};

export default Logo;