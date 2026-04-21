import React from 'react';
import { Maximize2, Camera, Settings2, BarChart3 } from 'lucide-react';
import type { Timeframe } from '../../types';

interface ChartToolbarProps {
  activeTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  activeTimeframe,
  onTimeframeChange,
}) => {
  return (
    <div className="h-10 flex items-center px-4 bg-gray-900 border-b border-gray-800 justify-between">
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-800 rounded p-0.5">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                activeTimeframe === tf
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-800 mx-1"></div>

        <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors">
          <BarChart3 size={14} />
          <span>Indicators</span>
        </button>

        <div className="w-px h-4 bg-gray-800 mx-1"></div>

        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
          <Settings2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
          <Camera size={18} />
        </button>
        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};
