import type { OHLCV, Asset } from '../types';

export const mockOHLCVData: OHLCV[] = [
  { time: '2023-10-01', open: 26000, high: 27000, low: 25500, close: 26500, volume: 1000 },
  { time: '2023-10-02', open: 26500, high: 28000, low: 26000, close: 27500, volume: 1200 },
  { time: '2023-10-03', open: 27500, high: 27800, low: 27000, close: 27200, volume: 800 },
  { time: '2023-10-04', open: 27200, high: 28500, low: 27100, close: 28200, volume: 1500 },
  { time: '2023-10-05', open: 28200, high: 29000, low: 28000, close: 28800, volume: 1100 },
  { time: '2023-10-06', open: 28800, high: 29500, low: 28500, close: 29200, volume: 1300 },
  { time: '2023-10-07', open: 29200, high: 30000, low: 29000, close: 29800, volume: 1600 },
  { time: '2023-10-08', open: 29800, high: 30500, low: 29500, close: 30200, volume: 1400 },
  { time: '2023-10-09', open: 30200, high: 31000, low: 30000, close: 30800, volume: 1800 },
  { time: '2023-10-10', open: 30800, high: 31500, low: 30500, close: 31200, volume: 1200 },
  { time: '2023-10-11', open: 31200, high: 31800, low: 31000, close: 31500, volume: 1100 },
  { time: '2023-10-12', open: 31500, high: 32000, low: 31200, close: 31800, volume: 1500 },
  { time: '2023-10-13', open: 31800, high: 32500, low: 31500, close: 32200, volume: 1700 },
  { time: '2023-10-14', open: 32200, high: 33000, low: 32000, close: 32800, volume: 1900 },
  { time: '2023-10-15', open: 32800, high: 33500, low: 32500, close: 33200, volume: 1300 },
];

export const mockWatchlist: Asset[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 33200.50, change: 450.25, changePercent: 1.38 },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 1850.75, change: -12.30, changePercent: -0.66 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.20, change: 2.45, changePercent: 1.42 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 450.15, change: 15.60, changePercent: 3.59 },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 435.80, change: -1.20, changePercent: -0.27 },
];
