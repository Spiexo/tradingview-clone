import React from 'react';
import type { OHLCV } from '../../types';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell
} from 'recharts';

interface CandlestickChartProps {
  data: OHLCV[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: OHLCV }[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1e222d] border border-[#2a2e39] p-2 text-xs text-gray-300 shadow-xl">
        <p className="font-bold border-b border-[#2a2e39] mb-1 pb-1">{data.time}</p>
        <p>O: <span className="text-gray-100">{data.open}</span></p>
        <p>H: <span className="text-gray-100">{data.high}</span></p>
        <p>L: <span className="text-gray-100">{data.low}</span></p>
        <p>C: <span className="text-gray-100">{data.close}</span></p>
        <p className="mt-1">V: <span className="text-gray-100">{data.volume}</span></p>
      </div>
    );
  }
  return null;
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  // Recharts doesn't have a built-in Candlestick chart type,
  // so we simulate it using Bar charts for the body and wicks.

  const formattedData = data.map((d) => ({
    ...d,
    // Low and High for the wick
    wick: [d.low, d.high],
    // Open and Close for the body
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    isPositive: d.close >= d.open,
  }));

  return (
    <div className="flex-1 w-full h-full min-h-[400px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4b5563', fontSize: 10 }}
          />
          <YAxis
            orientation="right"
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4b5563', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a2e39' }} />

          {/* Wick */}
          <Bar dataKey="wick" barSize={2} xAxisId={0}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-wick-${index}`} fill={entry.isPositive ? '#26a69a' : '#ef5350'} />
            ))}
          </Bar>

          {/* Body */}
          <Bar dataKey="body" barSize={12} xAxisId={0} style={{ transform: 'translateX(-7px)' }}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-body-${index}`} fill={entry.isPositive ? '#26a69a' : '#ef5350'} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
