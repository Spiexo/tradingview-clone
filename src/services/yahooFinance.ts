import type { Asset } from '../types';

const YAHOO_BASE_URL = 'https://query2.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=most_actives&count=25&formatted=false';
const PROXY_URL = 'https://corsproxy.io/?url=';

interface YahooQuote {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
}

interface YahooResponse {
  finance: {
    result: Array<{
      quotes: YahooQuote[];
    }>;
    error: {
      description?: string;
    } | null;
  };
}

/**
 * Fetches the most active stocks from Yahoo Finance.
 * Uses a CORS proxy fallback if the direct request fails.
 */
export const fetchStockScreener = async (): Promise<Asset[]> => {
  const fetchFromUrl = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.statusText}`);
    }
    const data: YahooResponse = await response.json();

    if (data.finance.error) {
      throw new Error(data.finance.error.description || 'Yahoo Finance API returned an error');
    }

    const quotes = data.finance.result[0]?.quotes || [];

    return quotes.map((quote) => ({
      symbol: quote.symbol,
      name: quote.shortName || quote.symbol,
      type: 'stock' as const,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
    }));
  };

  try {
    // Try direct fetch first
    return await fetchFromUrl(YAHOO_BASE_URL);
  } catch (error) {
    console.warn('Direct Yahoo Finance fetch failed, trying CORS proxy...', error);
    try {
      // Try with proxy fallback
      return await fetchFromUrl(`${PROXY_URL}${encodeURIComponent(YAHOO_BASE_URL)}`);
    } catch (proxyError) {
      console.error('Yahoo Finance fetch failed even with proxy:', proxyError);
      throw proxyError;
    }
  }
};
