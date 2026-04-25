import React from 'react';
import { Button } from '../ui/Button';
import type { Asset, User } from '../../types';

interface TopbarProps {
  asset: Asset;
  user: User | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  asset,
  user,
  onOpenAuth,
  onSignOut
}) => {
  const isPositive = asset.change >= 0;

  return (
    <header className="h-[48px] flex items-center px-2 md:px-4 bg-gray-900 border-b border-gray-800 justify-between shrink-0">
      {/* Left: Asset symbol + name */}
      <div className="flex items-center gap-2 min-w-0 md:min-w-[200px]">
        <span className="text-white font-bold text-sm md:text-base">{asset.symbol}</span>
        <span className="text-gray-400 text-sm truncate hidden sm:block">{asset.name}</span>
      </div>

      {/* Center: Price + Change */}
      <div className="flex items-center gap-2 md:gap-3">
        <span className={`font-semibold text-sm md:text-base ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`text-[10px] md:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Right: User info / Auth */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs hidden sm:block">
              {user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAuth}
            className="cursor-pointer"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};
