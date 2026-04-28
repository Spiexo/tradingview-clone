import type { OrderbookData, OrderbookItem } from '../types';

const BASE_URL = 'wss://stream.binance.com:9443/ws';
const RECONNECT_DELAY = 5000;

type OrderbookCallback = (data: OrderbookData) => void;

/**
 * Singleton service to manage Binance WebSocket connections for real-time data.
 * Supports multiple subscribers per symbol and automatic reconnection.
 */
class BinanceWebsocketService {
  private static instance: BinanceWebsocketService;
  private sockets: Map<string, WebSocket> = new Map();
  private callbacks: Map<string, Set<OrderbookCallback>> = new Map();
  private reconnectTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  private constructor() {}

  /**
   * Returns the singleton instance of the service.
   */
  public static getInstance(): BinanceWebsocketService {
    if (!BinanceWebsocketService.instance) {
      BinanceWebsocketService.instance = new BinanceWebsocketService();
    }
    return BinanceWebsocketService.instance;
  }

  /**
   * Formats a symbol for Binance WebSocket (e.g., BTC -> btcusdt).
   */
  private formatSymbol(symbol: string): string {
    const s = symbol.toLowerCase();
    return s.endsWith('usdt') ? s : `${s}usdt`;
  }

  /**
   * Subscribes to the depth stream for a given symbol.
   * @param symbol The asset symbol (e.g., 'BTC' or 'BTCUSDT')
   * @param callback Function to call when new orderbook data is received
   */
  public subscribe(symbol: string, callback: OrderbookCallback): void {
    const formattedSymbol = this.formatSymbol(symbol);

    if (!this.callbacks.has(formattedSymbol)) {
      this.callbacks.set(formattedSymbol, new Set());
    }

    this.callbacks.get(formattedSymbol)?.add(callback);

    if (this.sockets.has(formattedSymbol)) {
      return;
    }

    this.connect(formattedSymbol);
  }

  /**
   * Unsubscribes from the depth stream for a given symbol.
   * @param symbol The asset symbol
   * @param callback The original callback to remove
   */
  public unsubscribe(symbol: string, callback: OrderbookCallback): void {
    const formattedSymbol = this.formatSymbol(symbol);
    const subscribers = this.callbacks.get(formattedSymbol);

    if (subscribers) {
      subscribers.delete(callback);

      if (subscribers.size === 0) {
        this.callbacks.delete(formattedSymbol);
        this.closeSocket(formattedSymbol);
      }
    }
  }

  /**
   * Disconnects all active WebSocket connections and clears subscribers.
   */
  public disconnect(): void {
    this.reconnectTimers.forEach((timer) => clearTimeout(timer));
    this.reconnectTimers.clear();

    this.sockets.forEach((ws) => {
      ws.onclose = null; // Prevent reconnection
      ws.close();
    });
    this.sockets.clear();
    this.callbacks.clear();
  }

  /**
   * Closes a specific socket and prevents immediate reconnection.
   */
  private closeSocket(symbol: string): void {
    const ws = this.sockets.get(symbol);
    if (ws) {
      ws.onclose = null;
      ws.close();
      this.sockets.delete(symbol);
    }
    const timer = this.reconnectTimers.get(symbol);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(symbol);
    }
  }

  /**
   * Establishes a new WebSocket connection for a symbol.
   */
  private connect(symbol: string): void {
    // Clear any existing reconnection timer
    if (this.reconnectTimers.has(symbol)) {
      clearTimeout(this.reconnectTimers.get(symbol));
      this.reconnectTimers.delete(symbol);
    }

    const url = `${BASE_URL}/${symbol}@depth20@100ms`;
    const ws = new WebSocket(url);

    ws.onmessage = (event: MessageEvent) => {
      try {
        const rawData = JSON.parse(event.data);
        const subscribers = this.callbacks.get(symbol);

        if (subscribers && subscribers.size > 0 && rawData.bids && rawData.asks) {
          const orderbookData: OrderbookData = {
            bids: rawData.bids.map((bid: [string, string]): OrderbookItem => ({
              price: parseFloat(bid[0]),
              quantity: parseFloat(bid[1]),
            })),
            asks: rawData.asks.map((ask: [string, string]): OrderbookItem => ({
              price: parseFloat(ask[0]),
              quantity: parseFloat(ask[1]),
            })),
          };
          subscribers.forEach((callback) => callback(orderbookData));
        }
      } catch (error) {
        console.error(`Error parsing WebSocket message for ${symbol}:`, error);
      }
    };

    ws.onerror = (error: Event) => {
      console.error(`WebSocket error for ${symbol}:`, error);
    };

    ws.onclose = () => {
      this.sockets.delete(symbol);

      // Reconnect if there are still subscribers
      if (this.callbacks.has(symbol)) {
        console.log(`WebSocket closed for ${symbol}, reconnecting in ${RECONNECT_DELAY}ms...`);
        const timer = setTimeout(() => this.connect(symbol), RECONNECT_DELAY);
        this.reconnectTimers.set(symbol, timer);
      }
    };

    this.sockets.set(symbol, ws);
  }
}

export const binanceWebsocketService = BinanceWebsocketService.getInstance();
