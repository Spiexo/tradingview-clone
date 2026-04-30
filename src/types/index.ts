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

export interface User {
  id: string;
  email: string | undefined;
  display_name?: string;
  avatar_url?: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'stock';
}

export type DrawingTool = 'cursor' | 'trendline';

export interface DrawingData {
  startX: string;
  startY: number;
  endX: string;
  endY: number;
}

export interface Drawing {
  id: string;
  user_id: string;
  symbol: string;
  timeframe: string;
  type: DrawingTool;
  data: DrawingData;
}

export interface Alert {
  id: string;
  user_id: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';

export interface OrderbookItem {
  price: number;
  quantity: number;
}

export interface OrderbookData {
  bids: OrderbookItem[];
  asks: OrderbookItem[];
}

export interface IndicatorsState {
  ma20: boolean;
  ma50: boolean;
  rsi: boolean;
  macd: boolean;
  bb: boolean;
}
