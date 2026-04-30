import { useState, useEffect, useCallback } from 'react';
import type { OHLCVData, Timeframe } from '../types';
import { fetchKlines } from '../services/binance';
import { fetchStockOHLCV } from '../services/polygon';

interface UseOHLCVResult {
  data: OHLCVData[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const TIMEFRAME_TO_POLYGON: Record<Timeframe, { multiplier: number; timespan: string; daysBack: number }> = {
  '1m': { multiplier: 1, timespan: 'minute', daysBack: 1 },
  '5m': { multiplier: 5, timespan: 'minute', daysBack: 2 },
  '15m': { multiplier: 15, timespan: 'minute', daysBack: 5 },
  '1h': { multiplier: 1, timespan: 'hour', daysBack: 7 },
  '4h': { multiplier: 4, timespan: 'hour', daysBack: 14 },
  '1D': { multiplier: 1, timespan: 'day', daysBack: 90 },
  '1W': { multiplier: 1, timespan: 'week', daysBack: 365 },
};

/**
 * Hook to fetch OHLCV data from Binance (crypto) or Polygon (stocks)
 * @param symbol Asset symbol (e.g., BTC or AAPL)
 * @param type Asset type ('crypto' or 'stock')
 * @param timeframe Selected timeframe
 */
export const useOHLCV = (
  symbol: string,
  type: 'crypto' | 'stock',
  timeframe: Timeframe
): UseOHLCVResult => {
  const [data, setData] = useState<OHLCVData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      let fetchedData: OHLCVData[] = [];

      if (type === 'crypto') {
        fetchedData = await fetchKlines(symbol, timeframe, 500, signal);
      } else {
        const config = TIMEFRAME_TO_POLYGON[timeframe];
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - config.daysBack);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        fetchedData = await fetchStockOHLCV(
          symbol,
          config.multiplier,
          config.timespan,
          formatDate(from),
          formatDate(to),
          signal
        );
      }

      setData(fetchedData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [symbol, type, timeframe]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return { data, loading, error, refresh: () => fetchData() };
};
