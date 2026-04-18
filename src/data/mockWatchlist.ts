import type { Asset } from '../types';

export const mockAssets: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 42500.50, change: 450.25, changePercent: 1.07 },
  { symbol: 'ETH', name: 'Ethereum', price: 2250.75, change: -12.30, changePercent: -0.54 },
  { symbol: 'SOL', name: 'Solana', price: 95.20, change: 4.45, changePercent: 4.90 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.15, change: 1.60, changePercent: 0.87 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 550.80, change: 15.20, changePercent: 2.84 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 210.40, change: -5.50, changePercent: -2.55 },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 480.25, change: 2.15, changePercent: 0.45 },
  { symbol: 'GOLD', name: 'Gold', price: 2030.50, change: -3.20, changePercent: -0.16 },
];
