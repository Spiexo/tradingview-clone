import React from 'react';
import { LayoutDashboard, List, Bell, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-16 flex flex-col items-center py-4 bg-[#1e222d] border-r border-[#2a2e39]">
      <div className="mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">TV</span>
        </div>
      </div>

      <nav className="flex flex-col gap-6">
        <button className="text-blue-500 cursor-pointer">
          <LayoutDashboard size={24} />
        </button>
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors">
          <List size={24} />
        </button>
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors">
          <Bell size={24} />
        </button>
      </nav>

      <div className="mt-auto">
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors">
          <Settings size={24} />
        </button>
      </div>
    </aside>
  );
};
