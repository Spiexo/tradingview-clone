import React, { useState } from 'react';
import { useScreener } from '../../hooks/useScreener';
import { WatchlistItem } from '../watchlist/WatchlistItem';
import { Skeleton } from '../ui/Skeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import type { Asset } from '../../types';

interface AssetScreenerProps {
  onAssetSelect: (asset: Asset) => void;
  activeSymbol?: string;
}

/**
 * AssetScreener component allows users to browse and select crypto or stock assets.
 * It uses the useScreener hook to fetch live market data from Binance and Polygon.
 */
export const AssetScreener: React.FC<AssetScreenerProps> = ({
  onAssetSelect,
  activeSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'stock'>('crypto');
  const { cryptoAssets, stockAssets, loading, error, refresh } = useScreener();

  const assets = activeTab === 'crypto' ? cryptoAssets : stockAssets;

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
          Market Screener
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-900/50">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'crypto'
              ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-800/30'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/10'
          }`}
        >
          Crypto
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'stock'
              ? 'text-blue-500 border-b-2 border-blue-500 bg-gray-800/30'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/10'
          }`}
        >
          Stocks
        </button>
      </div>

      {/* Column Headers */}
      <div className="flex justify-between px-4 py-2 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900/30">
        <span>Symbol</span>
        <div className="flex gap-8">
          <span>Last</span>
          <span className="w-12 text-right">Chg%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {error ? (
          <div className="p-4">
            <ErrorMessage message={error} onRetry={refresh} />
          </div>
        ) : loading ? (
          <div className="p-2 space-y-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b border-gray-800/50">
                <div className="flex flex-col gap-2">
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
          <div className="flex flex-col">
            {assets.map((asset) => (
              <WatchlistItem
                key={asset.symbol}
                asset={asset}
                isActive={asset.symbol === activeSymbol}
                onSelect={onAssetSelect}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-sm">No assets found for {activeTab}.</p>
          </div>
        )}
      </div>
    </div>
  );
};
