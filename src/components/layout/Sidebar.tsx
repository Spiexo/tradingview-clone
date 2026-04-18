import React from 'react';
import { BarChart2, Star, Bell, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[56px] flex flex-col items-center py-4 bg-gray-900 border-r border-gray-800 h-full">
      <div className="mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">TV</span>
        </div>
      </div>

      <nav className="flex flex-col gap-6">
        <button className="text-blue-500 cursor-pointer">
          <BarChart2 size={20} />
        </button>
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors">
          <Star size={20} />
        </button>
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors">
          <Bell size={20} />
        </button>
      </nav>

      <div className="mt-auto">
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
};
