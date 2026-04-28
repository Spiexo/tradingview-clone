/**
 * @deprecated This hook is deprecated. Use useOHLCV instead for fetching market data.
 * CoinGecko has strict rate limits and lacks granular candle data for lower timeframes.
 */
import { useState, useEffect, useCallback } from 'react';
import type { OHLCVData, Timeframe } from '../types';

export const SYMBOL_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  DOT: 'polkadot',
  DOGE: 'dogecoin',
  LINK: 'chainlink',
  MATIC: 'polygon',
  XRP: 'ripple',
};

const TIMEFRAME_TO_DAYS: Record<Timeframe, string> = {
  '1m': '1',
  '5m': '1',
  '15m': '1',
  '1h': '7',
  '4h': '7',
  '1D': '30',
  '1W': '365',
};

interface UseCoinGeckoResult {
  data: OHLCVData[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
}

interface UseCoinGeckoMarketsResult {
  data: Record<string, MarketData>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch OHLC data from CoinGecko
 * @param symbol Asset symbol (e.g., BTC)
 * @param timeframe Selected timeframe
 */
export const useCoinGecko = (symbol: string, timeframe: Timeframe): UseCoinGeckoResult => {
  const [data, setData] = useState<OHLCVData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOHLC = useCallback(async () => {
    const coinId = SYMBOL_TO_ID[symbol.toUpperCase()];

    if (!coinId) {
      setError(`Symbol ${symbol} not supported by CoinGecko`);
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const days = TIMEFRAME_TO_DAYS[timeframe] || '1';
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('CoinGecko API rate limit reached. Please try again later.');
        }
        throw new Error('Failed to fetch data from CoinGecko');
      }

      const rawData = await response.json();

      // CoinGecko OHLC format: [ [time, open, high, low, close], ... ]
      const formattedData: OHLCVData[] = rawData.map((item: [number, number, number, number, number]) => {
        // Use unix timestamp (seconds) for lightweight-charts
        const timestamp = Math.floor(item[0] / 1000);

        return {
          time: timestamp.toString(), // We store it as string in our OHLCVData type for now
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
          volume: 0,
        };
      });

      setData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchOHLC();
  }, [fetchOHLC]);

  return { data, loading, error, refresh: fetchOHLC };
};

/**
 * Hook to fetch real-time market data for a list of coin IDs
 * @param ids Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 */
export const useCoinGeckoMarkets = (ids: string[]): UseCoinGeckoMarketsResult => {
  const [data, setData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const idsString = ids.join(',');

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsString}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('CoinGecko API rate limit reached. Please try again later.');
        }
        throw new Error('Failed to fetch market data from CoinGecko');
      }

      const rawData = await response.json();

      const formattedData: Record<string, MarketData> = {};
      rawData.forEach((item: MarketData) => {
        formattedData[item.id] = {
          id: item.id,
          symbol: item.symbol.toUpperCase(),
          name: item.name,
          current_price: item.current_price,
          price_change_24h: item.price_change_24h,
          price_change_percentage_24h: item.price_change_percentage_24h,
        };
      });

      setData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [idsString]);

  useEffect(() => {
    if (ids.length === 0) return;

    fetchMarkets();

    // Set up polling every 60 seconds
    const interval = setInterval(fetchMarkets, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [ids.length, fetchMarkets]);

  return { data, loading, error, refresh: fetchMarkets };
};
