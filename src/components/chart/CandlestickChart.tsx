import React, { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  LineStyle,
} from 'lightweight-charts';
import type {
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  Time,
  SeriesDataItemTypeMap,
} from 'lightweight-charts';
import type { OHLCVData, Drawing, DrawingTool, IndicatorsState } from '../../types';
import { calculateSMA } from '../../utils/indicators';

interface CandlestickChartProps {
  data: OHLCVData[];
  activeTool?: DrawingTool;
  drawings?: Drawing[];
  indicators?: IndicatorsState;
  onDraw?: (drawing: Omit<Drawing, 'id' | 'user_id' | 'symbol' | 'timeframe'>) => void;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  activeTool = 'cursor',
  drawings = [],
  indicators,
  onDraw,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRefs = useRef<ISeriesApi<'Line'>[]>([]);
  const previewSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const ma20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ma50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  // Track current mouse position in chart space
  const mousePositionRef = useRef<{ time: Time; price: number } | null>(null);
  const isDrawingRef = useRef(false);

  const drawingStartRef = useRef<{ time: Time; price: number } | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#030712' }, // bg-gray-950
        textColor: '#9ca3af', // text-gray-400
      },
      grid: {
        vertLines: { color: '#1f2937' }, // border-gray-800
        horzLines: { color: '#1f2937' },
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1f2937',
      },
      crosshair: {
        mode: 0, // Normal
        vertLine: {
          color: '#374151',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1f2937',
        },
        horzLine: {
          color: '#374151',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#1f2937',
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4ade80', // text-green-400
      downColor: '#f87171', // text-red-400
      borderVisible: false,
      wickUpColor: '#4ade80',
      wickDownColor: '#f87171',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Track mouse move for coordinates
    const handleCrosshairMove = (param: MouseEventParams) => {
      if (!param.time || param.point === undefined || !candlestickSeriesRef.current) {
        mousePositionRef.current = null;
        return;
      }
      const price = candlestickSeriesRef.current.coordinateToPrice(param.point.y);
      if (price !== null) {
        mousePositionRef.current = { time: param.time, price };
      }
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      resizeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
    };
  }, []);

  // Update data
  useEffect(() => {
    if (candlestickSeriesRef.current && data.length > 0) {
      try {
        const formattedData: SeriesDataItemTypeMap['Candlestick'][] = [];
        const seenTimes = new Set<string>();

        data.forEach((d) => {
          // lightweight-charts needs unique, ascending times.
          // d.time is now a timestamp string from useCoinGecko.
          const time = parseInt(d.time, 10);
          if (isNaN(time)) return;

          if (seenTimes.has(time.toString())) return;
          seenTimes.add(time.toString());

          formattedData.push({
            time: time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          });
        });

        // Ensure sorted
        formattedData.sort((a, b) => (a.time as number) - (b.time as number));

        candlestickSeriesRef.current.setData(formattedData);
        chartRef.current?.timeScale().fitContent();
      } catch (e) {
        console.error("Failed to set data to lightweight-charts", e);
      }
    }
  }, [data]);

  // Update Indicators
  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Handle MA20
    if (indicators?.ma20) {
      if (!ma20SeriesRef.current) {
        ma20SeriesRef.current = chartRef.current.addLineSeries({
          color: '#fbbf24', // amber-400
          lineWidth: 1,
          lastValueVisible: false,
          priceLineVisible: false,
          title: 'MA20',
        });
      }
      const ma20Data = calculateSMA(data, 20);
      ma20SeriesRef.current.setData(ma20Data);
    } else if (ma20SeriesRef.current) {
      chartRef.current.removeSeries(ma20SeriesRef.current);
      ma20SeriesRef.current = null;
    }

    // Handle MA50
    if (indicators?.ma50) {
      if (!ma50SeriesRef.current) {
        ma50SeriesRef.current = chartRef.current.addLineSeries({
          color: '#8b5cf6', // violet-500
          lineWidth: 1,
          lastValueVisible: false,
          priceLineVisible: false,
          title: 'MA50',
        });
      }
      const ma50Data = calculateSMA(data, 50);
      ma50SeriesRef.current.setData(ma50Data);
    } else if (ma50SeriesRef.current) {
      chartRef.current.removeSeries(ma50SeriesRef.current);
      ma50SeriesRef.current = null;
    }
  }, [data, indicators]);

  // Update drawings
  useEffect(() => {
    if (!chartRef.current) return;

    // Clear existing line series
    lineSeriesRefs.current.forEach((s) => chartRef.current?.removeSeries(s));
    lineSeriesRefs.current = [];

    // Add new ones
    drawings.forEach((drawing) => {
      const lineSeries = chartRef.current!.addLineSeries({
        color: '#60a5fa', // text-blue-400
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });

      const startTime = parseInt(drawing.data.startX, 10);
      const endTime = parseInt(drawing.data.endX, 10);

      if (!isNaN(startTime) && !isNaN(endTime)) {
        lineSeries.setData([
          { time: startTime as Time, value: drawing.data.startY },
          { time: endTime as Time, value: drawing.data.endY },
        ]);
        lineSeriesRefs.current.push(lineSeries);
      }
    });
  }, [drawings]);

  // Handle User Drawing Interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container || activeTool !== 'trendline') return;

    const handleMouseDown = () => {
      if (!mousePositionRef.current) return;

      isDrawingRef.current = true;
      drawingStartRef.current = { ...mousePositionRef.current };

      if (!previewSeriesRef.current && chartRef.current) {
        previewSeriesRef.current = chartRef.current.addLineSeries({
          color: '#3b82f6',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        });
      }
    };

    const handleMouseMove = () => {
      if (!isDrawingRef.current || !drawingStartRef.current || !mousePositionRef.current || !previewSeriesRef.current) return;

      previewSeriesRef.current.setData([
        { time: drawingStartRef.current.time, value: drawingStartRef.current.price },
        { time: mousePositionRef.current.time, value: mousePositionRef.current.price },
      ]);
    };

    const handleMouseUp = () => {
      if (isDrawingRef.current && drawingStartRef.current && mousePositionRef.current && onDraw) {
        const start = drawingStartRef.current;
        const end = mousePositionRef.current;

        if (start.time !== end.time || start.price !== end.price) {
          onDraw({
            type: 'trendline',
            data: {
              startX: start.time.toString(),
              startY: start.price,
              endX: end.time.toString(),
              endY: end.price,
            },
          });
        }
      }

      isDrawingRef.current = false;
      drawingStartRef.current = null;
      if (previewSeriesRef.current && chartRef.current) {
        chartRef.current.removeSeries(previewSeriesRef.current);
        previewSeriesRef.current = null;
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    // Use window for move and up to ensure continuity
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTool, onDraw]);

  return (
    <div className="w-full h-full p-2 bg-gray-950 select-none">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
