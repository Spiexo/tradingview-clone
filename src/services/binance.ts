import type { Asset, OHLCVData, Timeframe } from '../types';

const BASE_URL = 'https://api.binance.com/api/v3';

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
}

/**
 * Mapping of common Binance symbols to their full names.
 */
const SYMBOL_NAMES: Record<string, string> = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  BNBUSDT: 'Binance Coin',
  SOLUSDT: 'Solana',
  ADAUSDT: 'Cardano',
  XRPUSDT: 'Ripple',
  DOTUSDT: 'Polkadot',
  DOGEUSDT: 'Dogecoin',
  MATICUSDT: 'Polygon',
  LINKUSDT: 'Chainlink',
};

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
  limit: number = 500,
  signal?: AbortSignal
): Promise<OHLCVData[]> => {
  const binanceSymbol = formatSymbol(symbol);
  const binanceInterval = TIMEFRAME_MAP[interval];

  if (!binanceInterval) {
    throw new Error(`Interval ${interval} is not supported by Binance`);
  }

  const url = `${BASE_URL}/klines?symbol=${binanceSymbol}&interval=${binanceInterval}&limit=${limit}`;

  try {
    const response = await fetch(url, { signal });

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

/**
 * Fetches 24h ticker price change statistics for all symbols.
 * @returns A promise that resolves to an array of Asset objects
 */
export const fetch24hTickers = async (): Promise<Asset[]> => {
  const url = `${BASE_URL}/ticker/24hr`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch 24h tickers: ${response.statusText}`);
    }

    const data: BinanceTicker[] = await response.json();

    return data
      .filter((item) => item.symbol.endsWith('USDT'))
      .map((item) => {
        const symbol = item.symbol.replace('USDT', '');
        return {
          symbol,
          name: SYMBOL_NAMES[item.symbol] || symbol,
          type: 'crypto' as const,
          price: parseFloat(item.lastPrice),
          change: parseFloat(item.priceChange),
          changePercent: parseFloat(item.priceChangePercent),
        };
      });
  } catch (error) {
    console.error('Error fetching Binance 24h tickers:', error);
    throw error;
  }
};
