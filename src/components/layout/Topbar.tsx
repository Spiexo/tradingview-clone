import React from 'react';
import type { Asset } from '../../types';
import { Badge } from '../ui/Badge';

interface TopbarProps {
  asset: Asset;
}

export const Topbar: React.FC<TopbarProps> = ({ asset }) => {
  const isPositive = asset.change >= 0;

  return (
    <header className="h-14 flex items-center px-4 bg-[#1e222d] border-b border-[#2a2e39] justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-gray-100">{asset.symbol}</h1>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-gray-100">${asset.price.toLocaleString()}</span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{asset.change.toFixed(2)} ({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={isPositive ? 'success' : 'danger'}>
          {isPositive ? 'Strong Buy' : 'Strong Sell'}
        </Badge>
        <div className="w-px h-6 bg-[#2a2e39]"></div>
        <div className="text-xs text-gray-400">
          Market Open
        </div>
      </div>
    </header>
  );
};
