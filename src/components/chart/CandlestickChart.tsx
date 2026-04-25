import React, { useState, useMemo } from 'react';
import type { OHLCVData, Drawing, DrawingTool } from '../../types';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  CartesianGrid
} from 'recharts';

interface CandlestickChartProps {
  data: OHLCVData[];
  activeTool?: DrawingTool;
  drawings?: Drawing[];
  onDraw?: (drawing: Omit<Drawing, 'id' | 'user_id' | 'symbol' | 'timeframe'>) => void;
}

interface ChartMouseEvent {
  activeLabel?: string | number;
  chartY?: number;
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: OHLCVData;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-800 p-3 text-xs text-gray-300 shadow-2xl rounded-md">
        <p className="font-bold border-b border-gray-800 mb-2 pb-1 text-gray-100">{data.time}</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <p>Open: <span className="text-gray-100 font-mono font-medium">{data.open.toFixed(2)}</span></p>
          <p>High: <span className="text-gray-100 font-mono font-medium">{data.high.toFixed(2)}</span></p>
          <p>Low: <span className="text-gray-100 font-mono font-medium">{data.low.toFixed(2)}</span></p>
          <p>Close: <span className="text-gray-100 font-mono font-medium">{data.close.toFixed(2)}</span></p>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between">
          <span>Volume:</span>
          <span className="text-gray-100 font-mono font-medium">{data.volume.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

interface CandlestickProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: OHLCVData;
}

const Candlestick: React.FC<CandlestickProps> = (props) => {
  const { x = 0, y = 0, width = 0, height = 0, fill, payload } = props;
  if (!payload) return null;

  const { open, close, high, low } = payload;

  // Calculate wick positions relative to body
  // Recharts provides y as the top of the bar and height as the bar length
  const bodyMin = Math.min(open, close);
  const bodyMax = Math.max(open, close);

  // Avoid division by zero for Doji candles
  const bodyHeight = Math.abs(open - close) || 0.1;
  const ratio = height / bodyHeight;

  const wickTop = y - (high - bodyMax) * ratio;
  const wickBottom = y + height + (bodyMin - low) * ratio;
  const centerX = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line
        x1={centerX}
        y1={wickTop}
        x2={centerX}
        y2={wickBottom}
        stroke={fill}
        strokeWidth={1.5}
      />
      {/* Body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={Math.max(height, 1)} // Ensure body is visible even if open == close
        fill={fill}
      />
    </g>
  );
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  activeTool = 'cursor',
  drawings = [],
  onDraw,
}) => {
  const [drawingStart, setDrawingStart] = useState<{ x: string; y: number } | null>(null);
  const [drawingEnd, setDrawingEnd] = useState<{ x: string; y: number } | null>(null);

  const formattedData = useMemo(() => data.map((d) => ({
    ...d,
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    isPositive: d.close >= d.open,
  })), [data]);

  const { domain, minPrice, maxPrice } = useMemo(() => {
    const allValues = data.flatMap((d) => [d.high, d.low]);
    const min = data.length > 0 ? Math.min(...allValues) : 0;
    const max = data.length > 0 ? Math.max(...allValues) : 100;
    const range = max - min || 1;
    const d = [min - range * 0.05, max + range * 0.05];
    return { domain: d, minPrice: d[0], maxPrice: d[1] };
  }, [data]);

  const GREEN = '#4ade80';
  const RED = '#f87171';

  const mapChartYToPrice = (y: number, height: number) => {
    const marginTop = 20;
    const marginBottom = 20;
    const chartHeight = height - marginTop - marginBottom;
    const relativeY = y - marginTop;
    const priceRange = maxPrice - minPrice;
    return maxPrice - (relativeY / chartHeight) * priceRange;
  };

  return (
    <div className="w-full h-full p-2 bg-gray-950 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 60, left: 0, bottom: 20 }}
          onMouseDown={(e: ChartMouseEvent) => {
            if (activeTool !== 'trendline' || !e || !e.activeLabel || e.chartY === undefined || e.height === undefined) return;
            const label = e.activeLabel.toString();
            const price = mapChartYToPrice(e.chartY, e.height);
            setDrawingStart({ x: label, y: price });
            setDrawingEnd({ x: label, y: price });
          }}
          onMouseMove={(e: ChartMouseEvent) => {
            if (!drawingStart || !e || !e.activeLabel || e.chartY === undefined || e.height === undefined) return;
            const label = e.activeLabel.toString();
            const price = mapChartYToPrice(e.chartY, e.height);
            setDrawingEnd({ x: label, y: price });
          }}
          onMouseUp={() => {
            if (drawingStart && drawingEnd && onDraw) {
              if (drawingStart.x !== drawingEnd.x || drawingStart.y !== drawingEnd.y) {
                onDraw({
                  type: 'trendline',
                  data: {
                    startX: drawingStart.x,
                    startY: drawingStart.y,
                    endX: drawingEnd.x,
                    endY: drawingEnd.y,
                  },
                });
              }
            }
            setDrawingStart(null);
            setDrawingEnd(null);
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#1f2937" // gray-800
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }} // gray-500
            minTickGap={30}
          />
          <YAxis
            orientation="right"
            domain={domain}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }} // gray-500
            tickFormatter={(value: number) =>
              value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '5 5' }}
          />

          <Bar
            dataKey="body"
            shape={<Candlestick />}
            barSize={10}
            isAnimationActive={false}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPositive ? GREEN : RED}
              />
            ))}
          </Bar>

          <DrawingLayer
            drawings={drawings}
            minPrice={minPrice}
            maxPrice={maxPrice}
            data={data}
            currentDrawing={drawingStart && drawingEnd ? {
              type: 'trendline',
              data: {
                startX: drawingStart.x,
                startY: drawingStart.y,
                endX: drawingEnd.x,
                endY: drawingEnd.y
              }
            } : null}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

interface DrawingLayerProps {
  drawings: Drawing[];
  minPrice: number;
  maxPrice: number;
  data: OHLCVData[];
  currentDrawing: {
    type: DrawingTool;
    data: {
      startX: string;
      startY: number;
      endX: string;
      endY: number;
    };
  } | null;
  // Recharts injected props
  viewBox?: { x: number; y: number; width: number; height: number };
  xAxisMap?: Record<number, { scale: (v: number | string) => number; bandwidth?: number }>;
  yAxisMap?: Record<number, { scale: (v: number | string) => number }>;
}

const DrawingLayer: React.FC<DrawingLayerProps> = ({
  drawings,
  data,
  currentDrawing,
  viewBox,
  xAxisMap,
  yAxisMap,
}) => {
  if (!viewBox || !xAxisMap || !yAxisMap) return null;

  const xAxis = xAxisMap[0];
  const yAxis = yAxisMap[0];

  const getX = (time: string) => {
    const index = data.findIndex((d) => d.time === time);
    if (index === -1) return 0;
    return xAxis.scale(index) + (xAxis.bandwidth || 0) / 2;
  };

  const getY = (price: number) => {
    return yAxis.scale(price);
  };

  const renderDrawing = (drawing: Drawing | Exclude<DrawingLayerProps['currentDrawing'], null>, key: string, isPreview = false) => {
    const x1 = getX(drawing.data.startX);
    const y1 = getY(drawing.data.startY);
    const x2 = getX(drawing.data.endX);
    const y2 = getY(drawing.data.endY);

    return (
      <line
        key={key}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isPreview ? '#3b82f6' : '#60a5fa'}
        strokeWidth={isPreview ? 1.5 : 2}
        strokeDasharray={isPreview ? '5,5' : 'none'}
        className="pointer-events-none"
      />
    );
  };

  return (
    <g>
      {drawings.map((d) => renderDrawing(d, d.id))}
      {currentDrawing && renderDrawing(currentDrawing, 'preview', true)}
    </g>
  );
};
