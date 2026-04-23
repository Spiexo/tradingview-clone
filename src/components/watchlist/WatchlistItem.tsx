import React from 'react';
import type { Asset } from '../../types';
import { X } from 'lucide-react';

interface WatchlistItemProps {
  asset: Asset;
  isActive?: boolean;
  onSelect?: (asset: Asset) => void;
  onRemove?: (symbol: string) => void;
}

export const WatchlistItem: React.FC<WatchlistItemProps> = ({
  asset,
  isActive = false,
  onSelect,
  onRemove,
}) => {
  const isPositive = asset.change >= 0;

  return (
    <div
      className={`group flex items-center justify-between p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0 ${
        isActive ? 'bg-gray-800 border-l-2 border-l-blue-500' : ''
      }`}
      onClick={() => onSelect?.(asset)}
    >
      <div className="flex items-center gap-3">
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(asset.symbol);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded text-gray-500 hover:text-red-400 transition-all"
          >
            <X size={14} />
          </button>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-gray-200">{asset.symbol}</span>
          <span className="text-xs text-gray-400 truncate w-24">{asset.name}</span>
        </div>
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
