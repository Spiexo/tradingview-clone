import React from 'react';
import type { Asset } from '../../types';

interface WatchlistItemProps {
  asset: Asset;
}

export const WatchlistItem: React.FC<WatchlistItemProps> = ({ asset }) => {
  const isPositive = asset.change >= 0;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0">
      <div className="flex flex-col">
        <span className="font-bold text-gray-200">{asset.symbol}</span>
        <span className="text-xs text-gray-400 truncate w-24">{asset.name}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-medium text-gray-200">
          ${asset.price.toLocaleString()}
        </span>
        <span
          className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}
        >
          {isPositive ? '+' : ''}
          {asset.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};
