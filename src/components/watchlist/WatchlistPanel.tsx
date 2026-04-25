import React from 'react';
import type { Asset } from '../../types';
import { WatchlistItem } from './WatchlistItem';
import { Search, Plus } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { ErrorMessage } from '../ui/ErrorMessage';

interface WatchlistPanelProps {
  assets: Asset[];
  activeSymbol?: string;
  isLoading?: boolean;
  onAssetSelect?: (asset: Asset) => void;
  onAdd?: () => void;
  onRemove?: (symbol: string) => void;
  error?: string | null;
  onRetry?: () => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  assets,
  activeSymbol,
  isLoading = false,
  onAssetSelect,
  onAdd,
  onRemove,
  error = null,
  onRetry,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
          Watchlist
        </h2>
        <div className="flex gap-2 text-gray-400">
          <button
            onClick={onAdd}
            className="hover:text-white cursor-pointer transition-colors"
            title="Add current asset to watchlist"
          >
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

      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {error ? (
          <ErrorMessage
            message={error}
            onRetry={onRetry}
            className="mt-8"
          />
        ) : isLoading ? (
          <div className="p-2 space-y-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : assets.length > 0 ? (
          assets.map((asset) => (
            <WatchlistItem
              key={asset.symbol}
              asset={asset}
              isActive={asset.symbol === activeSymbol}
              onSelect={onAssetSelect}
              onRemove={onRemove}
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
