import type { OHLCVData } from '../types';

const BASE_URL = 'https://api.polygon.io/v2';
const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

interface PolygonAggregate {
  v: number;  // Volume
  vw: number; // Volume weighted average price
  o: number;  // Open
  c: number;  // Close
  h: number;  // High
  l: number;  // Low
  t: number;  // Timestamp (ms)
  n: number;  // Number of transactions
}

interface PolygonResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results?: PolygonAggregate[];
  status: string;
  request_id: string;
  count: number;
  error?: string;
  message?: string;
}

/**
 * Fetches OHLCV data from Polygon.io REST API.
 * @param ticker The stock ticker (e.g., 'AAPL')
 * @param multiplier The size of the timespan multiplier (e.g., 1, 5, 15)
 * @param timespan The size of the time window (e.g., 'day', 'hour', 'minute')
 * @param from The start date (YYYY-MM-DD)
 * @param to The end date (YYYY-MM-DD)
 * @returns A promise that resolves to an array of OHLCVData
 */
export const fetchStockOHLCV = async (
  ticker: string,
  multiplier: number,
  timespan: string,
  from: string,
  to: string
): Promise<OHLCVData[]> => {
  if (!API_KEY || API_KEY === 'placeholder') {
    throw new Error('VITE_POLYGON_API_KEY is not configured. Please add your API key to .env file.');
  }

  const url = `${BASE_URL}/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json() as PolygonResponse;
      throw new Error(errorData.error || errorData.message || `Failed to fetch stock data for ${ticker}`);
    }

    const data: PolygonResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.error || data.message || `Polygon API returned status: ${data.status}`);
    }

    if (!data.results) {
      return [];
    }

    return data.results.map((item) => ({
      // item.t is timestamp in milliseconds
      time: Math.floor(item.t / 1000).toString(),
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v,
    }));
  } catch (error) {
    console.error('Error fetching Polygon stock data:', error);
    throw error;
  }
};
