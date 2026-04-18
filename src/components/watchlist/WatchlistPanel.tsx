import React from 'react';
import type { Asset } from '../../types';
import { WatchlistItem } from './WatchlistItem';
import { Search, Plus } from 'lucide-react';

interface WatchlistPanelProps {
  assets: Asset[];
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ assets }) => {
  return (
    <aside className="w-80 bg-[#1e222d] border-l border-[#2a2e39] flex flex-col">
      <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">Watchlist</h2>
        <div className="flex gap-2 text-gray-400">
          <button className="hover:text-white cursor-pointer"><Plus size={18} /></button>
          <button className="hover:text-white cursor-pointer"><Search size={18} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {assets.map((asset) => (
          <WatchlistItem key={asset.symbol} asset={asset} />
        ))}
      </div>
    </aside>
  );
};
