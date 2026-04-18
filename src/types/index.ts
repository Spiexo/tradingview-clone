export interface OHLCV {
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
  price: number;
  change: number;
  changePercent: number;
}
