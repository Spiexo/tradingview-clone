import React from 'react';
import { useOrderbook } from '../../hooks/useOrderbook';
import { Skeleton } from '../ui/Skeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import type { Asset } from '../../types';

interface OrderbookPanelProps {
  asset: Asset;
}

/**
 * OrderbookPanel component displays real-time orderbook data from Binance.
 * It shows asks (sells) in red and bids (buys) in green, with their respective quantities.
 */
export const OrderbookPanel: React.FC<OrderbookPanelProps> = ({ asset }) => {
  const { orderbook, loading, error } = useOrderbook(asset.symbol, asset.type);

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
            Orderbook
          </h2>
        </div>
        <div className="p-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  // Binance depth stream returns asks and bids sorted by price.
  // Asks are typically [lowest_price, ..., highest_price]
  // Bids are typically [highest_price, ..., lowest_price]
  const asks = orderbook?.asks || [];
  const bids = orderbook?.bids || [];
  const isPositive = asset.change >= 0;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider">
          Orderbook
        </h2>
        <div className="text-[10px] text-gray-500 font-medium">
          {asset.symbol} / USDT
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex justify-between px-4 py-2 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <span>Price</span>
        <span>Quantity</span>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Asks (Sells) - Lowest asks at the bottom, closest to market price */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-end">
              {[...asks].reverse().map((ask, i) => (
                <div
                  key={`ask-${i}`}
                  className="flex justify-between px-4 py-0.5 hover:bg-gray-800 text-[11px] transition-colors"
                >
                  <span className="text-red-400 tabular-nums">
                    {ask.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-gray-400 tabular-nums">
                    {ask.quantity.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>

            {/* Current Market Price */}
            <div className="px-4 py-2 bg-gray-800/30 flex justify-center items-center border-y border-gray-800">
              <span className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Bids (Buys) - Highest bids at the top, closest to market price */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {bids.map((bid, i) => (
                <div
                  key={`bid-${i}`}
                  className="flex justify-between px-4 py-0.5 hover:bg-gray-800 text-[11px] transition-colors"
                >
                  <span className="text-green-400 tabular-nums">
                    {bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-gray-400 tabular-nums">
                    {bid.quantity.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
