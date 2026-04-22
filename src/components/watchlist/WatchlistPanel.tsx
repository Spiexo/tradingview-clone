import React from 'react';
import type { Asset } from '../../types';
import { WatchlistItem } from './WatchlistItem';
import { Search, Plus } from 'lucide-react';

interface WatchlistPanelProps {
  assets: Asset[];
  activeSymbol?: string;
  onAssetSelect?: (asset: Asset) => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  assets,
  activeSymbol,
  onAssetSelect,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
          Watchlist
        </h2>
        <div className="flex gap-2 text-gray-400">
          <button className="hover:text-white cursor-pointer transition-colors">
            <Plus size={18} />
          </button>
          <button className="hover:text-white cursor-pointer transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex justify-between px-4 py-2 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <span>Symbol</span>
        <div className="flex gap-8">
          <span>Last</span>
          <span className="w-12 text-right">Chg%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {assets.map((asset) => (
          <WatchlistItem
            key={asset.symbol}
            asset={asset}
            isActive={asset.symbol === activeSymbol}
            onSelect={onAssetSelect}
          />
        ))}
      </div>
    </div>
  );
};
