import { useState, useEffect, useCallback } from 'react';
import type { Asset } from '../types';
import { fetch24hTickers } from '../services/binance';
import { fetchStockScreener } from '../services/yahooFinance';

interface UseScreenerResult {
  cryptoAssets: Asset[];
  stockAssets: Asset[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch market data for crypto and stocks for the screener.
 */
export const useScreener = (): UseScreenerResult => {
  const [cryptoAssets, setCryptoAssets] = useState<Asset[]>([]);
  const [stockAssets, setStockAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [cryptoData, stockData] = await Promise.allSettled([
        fetch24hTickers(),
        fetchStockScreener(),
      ]);

      if (cryptoData.status === 'fulfilled') {
        setCryptoAssets(cryptoData.value);
      } else {
        console.error('Error fetching crypto screener data:', cryptoData.reason);
      }

      if (stockData.status === 'fulfilled') {
        setStockAssets(stockData.value);
      } else {
        console.error('Error fetching stock screener data:', stockData.reason);
        // Only set global error if both fail or if it's a critical error
        // For now, we'll just log stock errors (e.g. missing API key)
      }

      if (cryptoData.status === 'rejected' && stockData.status === 'rejected') {
        setError('Failed to fetch market data from all providers.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchAllData, 300000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  return {
    cryptoAssets,
    stockAssets,
    loading,
    error,
    refresh: fetchAllData,
  };
};
