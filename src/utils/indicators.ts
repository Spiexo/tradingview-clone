import type { Time, LineData } from 'lightweight-charts';
import type { OHLCVData } from '../types';

/**
 * Calculates Simple Moving Average (SMA)
 */
export function calculateSMA(data: OHLCVData[], period: number): LineData[] {
  const smaData: LineData[] = [];
  if (data.length < period) return smaData;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }

  const firstTime = parseInt(data[period - 1].time, 10);
  if (!isNaN(firstTime)) {
    smaData.push({
      time: firstTime as Time,
      value: sum / period,
    });
  }

  for (let i = period; i < data.length; i++) {
    sum = sum - data[i - period].close + data[i].close;
    const time = parseInt(data[i].time, 10);
    if (!isNaN(time)) {
      smaData.push({
        time: time as Time,
        value: sum / period,
      });
    }
  }

  return smaData;
}

/**
 * Calculates Exponential Moving Average (EMA)
 */
export function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];
  if (data.length === 0) return ema;

  ema[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * k + ema[i - 1] * (1 - k);
  }
  return ema;
}

/**
 * Calculates Relative Strength Index (RSI)
 */
export function calculateRSI(data: OHLCVData[], period: number = 14): LineData[] {
  const rsiData: LineData[] = [];
  if (data.length <= period) return rsiData;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  const firstTime = parseInt(data[period].time, 10);
  if (!isNaN(firstTime)) {
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsiData.push({ time: firstTime as Time, value: 100 - 100 / (1 + rs) });
  }

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const time = parseInt(data[i].time, 10);
    if (!isNaN(time)) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsiData.push({ time: time as Time, value: 100 - 100 / (1 + rs) });
    }
  }

  return rsiData;
}

/**
 * Calculates Moving Average Convergence Divergence (MACD)
 */
export function calculateMACD(data: OHLCVData[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const closes = data.map(d => d.close);
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  const macdLine: LineData[] = [];
  const macdValues: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const val = fastEMA[i] - slowEMA[i];
    macdValues.push(val);
    const time = parseInt(data[i].time, 10);
    if (!isNaN(time) && i >= slowPeriod - 1) {
      macdLine.push({ time: time as Time, value: val });
    }
  }

  const signalLineValues = calculateEMA(macdValues.slice(slowPeriod - 1), signalPeriod);
  const signalLine: LineData[] = [];
  const histogram: { time: Time, value: number, color: string }[] = [];

  for (let i = 0; i < signalLineValues.length; i++) {
    const dataIdx = i + slowPeriod - 1;
    const time = parseInt(data[dataIdx].time, 10);
    if (!isNaN(time)) {
      signalLine.push({ time: time as Time, value: signalLineValues[i] });

      const histValue = macdValues[dataIdx] - signalLineValues[i];
      histogram.push({
        time: time as Time,
        value: histValue,
        color: histValue >= 0 ? '#4ade80' : '#f87171'
      });
    }
  }

  return { macdLine, signalLine, histogram };
}

/**
 * Calculates Bollinger Bands
 */
export function calculateBollingerBands(data: OHLCVData[], period: number = 20, stdDev: number = 2) {
  const upperBand: LineData[] = [];
  const middleBand: LineData[] = [];
  const lowerBand: LineData[] = [];

  if (data.length < period) return { upperBand, middleBand, lowerBand };

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((a, b) => a + b.close, 0);
    const mean = sum / period;

    const squaredDiffs = slice.reduce((a, b) => a + Math.pow(b.close - mean, 2), 0);
    const standardDeviation = Math.sqrt(squaredDiffs / period);

    const time = parseInt(data[i].time, 10);
    if (!isNaN(time)) {
      middleBand.push({ time: time as Time, value: mean });
      upperBand.push({ time: time as Time, value: mean + stdDev * standardDeviation });
      lowerBand.push({ time: time as Time, value: mean - stdDev * standardDeviation });
    }
  }

  return { upperBand, middleBand, lowerBand };
}
