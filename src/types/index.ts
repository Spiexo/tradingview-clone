export interface OHLCVData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  symbol: string;
  name: string;
  type: 'crypto' | 'stock';
  price: number;
  change: number;
  changePercent: number;
}

<<<<<<< HEAD
=======
export interface User {
  id: string;
  email: string | undefined;
}
>>>>>>> 652d2ef933e6d675c95611d6329bcb1417222fcb
export interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'stock';
}

export interface Drawing {
  id: string;
  user_id: string;
  symbol: string;
  timeframe: string;
  data: object;
}

export interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';
