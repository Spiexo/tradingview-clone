import type { OHLCVData, Timeframe } from '../types';

const BASE_URL = 'https://api.binance.com/api/v3';

/**
 * Maps our application Timeframe type to Binance API interval strings.
 */
const TIMEFRAME_MAP: Record<Timeframe, string> = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1D': '1d',
  '1W': '1w',
};

/**
 * Formats a symbol for Binance (e.g., BTC -> BTCUSDT).
 * If the symbol already ends with USDT, it returns it as is.
 */
const formatSymbol = (symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  if (upperSymbol.endsWith('USDT')) {
    return upperSymbol;
  }
  return `${upperSymbol}USDT`;
};

/**
 * Fetches OHLCV data from Binance REST API.
 * @param symbol The asset symbol (e.g., 'BTC' or 'BTCUSDT')
 * @param interval The timeframe interval
 * @param limit Number of candles to fetch (max 1000)
 * @returns A promise that resolves to an array of OHLCVData
 */
export const fetchKlines = async (
  symbol: string,
  interval: Timeframe,
  limit: number = 500
): Promise<OHLCVData[]> => {
  const binanceSymbol = formatSymbol(symbol);
  const binanceInterval = TIMEFRAME_MAP[interval];

  if (!binanceInterval) {
    throw new Error(`Interval ${interval} is not supported by Binance`);
  }

  const url = `${BASE_URL}/klines?symbol=${binanceSymbol}&interval=${binanceInterval}&limit=${limit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || `Failed to fetch klines for ${binanceSymbol}`);
    }

    const data: (string | number)[][] = await response.json();

    return data.map((item) => ({
      // item[0] is open time in milliseconds
      time: Math.floor((item[0] as number) / 1000).toString(),
      open: parseFloat(item[1] as string),
      high: parseFloat(item[2] as string),
      low: parseFloat(item[3] as string),
      close: parseFloat(item[4] as string),
      volume: parseFloat(item[5] as string),
    }));
  } catch (error) {
    console.error('Error fetching Binance klines:', error);
    throw error;
  }
};
