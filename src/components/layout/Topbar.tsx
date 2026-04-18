import React from 'react';
import type { Asset, Timeframe } from '../../types';

interface TopbarProps {
  asset: Asset;
  activeTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

export const Topbar: React.FC<TopbarProps> = ({ asset, activeTimeframe, onTimeframeChange }) => {
  const isPositive = asset.change >= 0;

  return (
    <header className="h-[48px] flex items-center px-4 bg-gray-900 border-b border-gray-800 justify-between shrink-0">
      {/* Left: Asset symbol + name */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <span className="text-white font-bold">{asset.symbol}</span>
        <span className="text-gray-400 text-sm truncate">{asset.name}</span>
      </div>

      {/* Center: Price + Change */}
      <div className="flex items-center gap-3">
        <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Right: Timeframe selector */}
      <div className="flex items-center gap-1">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              activeTimeframe === tf
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </header>
  );
};
