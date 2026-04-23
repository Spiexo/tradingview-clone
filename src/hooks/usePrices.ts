import { useState, useEffect } from 'react';
import { SYMBOL_TO_ID } from './useCoinGecko';

interface PriceData {
  price: number;
  change24h: number;
}

export const usePrices = (symbols: string[]) => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) {
      setPrices({});
      return;
    }

    let isMounted = true;

    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        const ids = symbols
          .map((s) => SYMBOL_TO_ID[s.toUpperCase()])
          .filter(Boolean)
          .join(',');

        if (!ids) {
          setLoading(false);
          return;
        }

        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }

        const data = await response.json();

        if (isMounted) {
          const newPrices: Record<string, PriceData> = {};
          symbols.forEach((symbol) => {
            const id = SYMBOL_TO_ID[symbol.toUpperCase()];
            if (id && data[id]) {
              newPrices[symbol] = {
                price: data[id].usd,
                change24h: data[id].usd_24h_change,
              };
            }
          });
          setPrices(newPrices);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbols.join(',')]); // Use stringified symbols to avoid effect re-runs if array reference changes

  return { prices, loading, error };
};
