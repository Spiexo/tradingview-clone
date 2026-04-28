import { useState, useEffect } from 'react';
import type { OrderbookData } from '../types';
import { binanceWebsocketService } from '../services/websocket';

interface UseOrderbookResult {
  orderbook: OrderbookData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to stream real-time orderbook data from Binance.
 * @param symbol Asset symbol (e.g., BTC or BTCUSDT)
 * @param assetType Type of asset ('crypto' or 'stock')
 */
export const useOrderbook = (
  symbol: string,
  assetType: 'crypto' | 'stock'
): UseOrderbookResult => {
  const [orderbook, setOrderbook] = useState<OrderbookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when symbol or assetType changes
    setOrderbook(null);
    setError(null);

    if (assetType !== 'crypto') {
      setLoading(false);
      setError('Orderbook is currently only supported for crypto assets');
      return;
    }

    setLoading(true);

    const handleData = (data: OrderbookData) => {
      setOrderbook(data);
      setLoading(false);
    };

    try {
      binanceWebsocketService.subscribe(symbol, handleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to orderbook');
      setLoading(false);
    }

    return () => {
      binanceWebsocketService.unsubscribe(symbol, handleData);
    };
  }, [symbol, assetType]);

  return { orderbook, loading, error };
};
