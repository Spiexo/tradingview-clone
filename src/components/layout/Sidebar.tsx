import React from 'react';
import { BarChart2, Star, Bell, Settings } from 'lucide-react';

export type RightPanelType = 'watchlist' | 'alerts' | null;

interface SidebarProps {
  activePanel: RightPanelType;
  onPanelChange: (panel: RightPanelType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePanel, onPanelChange }) => {
  return (
    <aside className="w-full md:w-[56px] flex md:flex-col items-center p-2 md:py-4 bg-gray-900 border-t md:border-t-0 md:border-r border-gray-800 h-14 md:h-full shrink-0 z-50">
      <div className="hidden md:block mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">TV</span>
        </div>
      </div>

      <nav className="flex flex-1 md:flex-initial md:flex-col justify-around md:justify-start gap-0 md:gap-6">
        <button className="text-blue-500 cursor-pointer p-2">
          <BarChart2 size={20} />
        </button>
        <button
          onClick={() => onPanelChange(activePanel === 'watchlist' ? null : 'watchlist')}
          className={`cursor-pointer transition-colors p-2 ${
            activePanel === 'watchlist' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Star size={20} />
        </button>
        <button
          onClick={() => onPanelChange(activePanel === 'alerts' ? null : 'alerts')}
          className={`cursor-pointer transition-colors p-2 ${
            activePanel === 'alerts' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell size={20} />
        </button>
      </nav>

      <div className="md:mt-auto">
        <button className="text-gray-400 hover:text-white cursor-pointer transition-colors p-2">
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
};
