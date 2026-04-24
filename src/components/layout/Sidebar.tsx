import React from 'react';
import { BarChart2, Star, Bell, Settings } from 'lucide-react';

export type RightPanelType = 'watchlist' | 'alerts' | null;

interface SidebarProps {
  activePanel: RightPanelType;
  onPanelChange: (panel: RightPanelType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePanel, onPanelChange }) => {
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
        <button
          onClick={() => onPanelChange(activePanel === 'watchlist' ? null : 'watchlist')}
          className={`cursor-pointer transition-colors ${
            activePanel === 'watchlist' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Star size={20} />
        </button>
        <button
          onClick={() => onPanelChange(activePanel === 'alerts' ? null : 'alerts')}
          className={`cursor-pointer transition-colors ${
            activePanel === 'alerts' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
          }`}
        >
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
