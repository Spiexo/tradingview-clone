import React, { useState, useMemo } from 'react';
import type { Asset } from '../../types';
import { WatchlistItem } from './WatchlistItem';
import { Search, Plus, Filter } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

interface WatchlistPanelProps {
  assets: Asset[];
  activeSymbol?: string;
  isLoading?: boolean;
  onAssetSelect?: (asset: Asset) => void;
  onToggleFavorite?: (asset: Asset) => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  assets,
  activeSymbol,
  isLoading = false,
  onAssetSelect,
  onToggleFavorite,
}) => {
  const [sortByFavorite, setSortByFavorite] = useState(false);

  const sortedAssets = useMemo(() => {
    if (!sortByFavorite) return assets;
    return [...assets].sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return 0;
      return a.isFavorite ? -1 : 1;
    });
  }, [assets, sortByFavorite]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
          Watchlist
        </h2>
        <div className="flex gap-2 text-gray-400">
          <button
            onClick={() => setSortByFavorite(!sortByFavorite)}
            className={`cursor-pointer transition-colors ${
              sortByFavorite ? 'text-blue-500' : 'hover:text-white'
            }`}
            title="Sort by favorites"
          >
            <Filter size={18} />
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

      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : sortedAssets.length > 0 ? (
          sortedAssets.map((asset) => (
            <WatchlistItem
              key={asset.symbol}
              asset={asset}
              isActive={asset.symbol === activeSymbol}
              onSelect={onAssetSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            Watchlist is empty.
          </div>
        )}
      </div>
    </div>
  );
};
