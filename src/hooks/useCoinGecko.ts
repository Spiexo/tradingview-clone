import { useState, useEffect } from 'react';
import type { OHLCVData, Timeframe } from '../types';

const SYMBOL_TO_ID: Record<string, string> = {
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

  useEffect(() => {
    let isMounted = true;
    const fetchOHLC = async () => {
      const coinId = SYMBOL_TO_ID[symbol.toUpperCase()];

      if (!coinId) {
        if (isMounted) {
          setError(`Symbol ${symbol} not supported by CoinGecko`);
          setData([]);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

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

        if (!isMounted) return;

        // CoinGecko OHLC format: [ [time, open, high, low, close], ... ]
        const formattedData: OHLCVData[] = rawData.map((item: [number, number, number, number, number]) => {
          const date = new Date(item[0]);
          // Use a format that works well for both intraday and daily charts
          const timeStr = days === '1' || days === '7'
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString([], { month: 'short', day: '2-digit' });

          return {
            time: timeStr,
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
            volume: 0, // CoinGecko OHLC endpoint does not provide volume
          };
        });

        setData(formattedData);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOHLC();

    return () => {
      isMounted = false;
    };
  }, [symbol, timeframe]);

  return { data, loading, error };
};
