import React from 'react';
import type { OHLCVData } from '../../types';
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

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const formattedData = data.map((d) => ({
    ...d,
    // Bar expects a numeric value or an array [min, max]
    // We use [min, max] for the body
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    isPositive: d.close >= d.open,
  }));

  // Colors from AGENTS.md / Tailwind
  const GREEN = '#4ade80'; // green-400
  const RED = '#f87171';   // red-400

  return (
    <div className="w-full h-full p-2 bg-gray-950">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 60, left: 0, bottom: 20 }}
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
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }} // gray-500
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '5 5' }}
          />

          <Bar
            dataKey="body"
            shape={<Candlestick />}
            barSize={10}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPositive ? GREEN : RED}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
