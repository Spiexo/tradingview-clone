import React from 'react';
import { Maximize2, Camera, Settings2 } from 'lucide-react';

export const ChartToolbar: React.FC = () => {
  return (
    <div className="h-10 flex items-center px-4 bg-[#1e222d] border-b border-[#2a2e39] justify-between">
      <div className="flex items-center gap-2">
        <div className="flex bg-[#2a2e39] rounded p-0.5">
          <button className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded shadow-sm">1D</button>
          <button className="px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-200">1W</button>
          <button className="px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-200">1M</button>
        </div>
        <div className="w-px h-4 bg-[#2a2e39] mx-1"></div>
        <button className="text-gray-400 hover:text-white p-1 rounded transition-colors">
          <Settings2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Camera size={18} />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};
