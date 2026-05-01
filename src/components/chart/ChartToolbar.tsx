import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Camera, Settings2, BarChart3, Check } from 'lucide-react';
import type { Timeframe, IndicatorsState } from '../../types';

interface ChartToolbarProps {
  activeTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  isLoading?: boolean;
  indicators: IndicatorsState;
  onToggleIndicator: (key: keyof IndicatorsState) => void;
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

const INDICATOR_LABELS: Record<keyof IndicatorsState, string> = {
  ma20: 'Moving Average 20',
  ma50: 'Moving Average 50',
  rsi: 'Relative Strength Index (RSI)',
  macd: 'MACD',
  bb: 'Bollinger Bands',
};

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  activeTimeframe,
  onTimeframeChange,
  isLoading = false,
  indicators,
  onToggleIndicator,
}) => {
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsIndicatorsOpen(false);
      }
    };

    if (isIndicatorsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isIndicatorsOpen]);

  return (
    <div className="h-10 flex items-center px-2 md:px-4 bg-gray-900 border-b border-gray-800 justify-between">
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex bg-gray-800 rounded p-0.5">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                activeTimeframe === tf
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 disabled:hover:text-gray-400'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-800 mx-1"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsIndicatorsOpen(!isIndicatorsOpen)}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors ${
              isIndicatorsOpen ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <BarChart3 size={14} />
            <span>Indicators</span>
          </button>

          {isIndicatorsOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-gray-900 border border-gray-800 rounded shadow-xl z-50 py-1">
              {(Object.keys(INDICATOR_LABELS) as (keyof IndicatorsState)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => onToggleIndicator(key)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <span>{INDICATOR_LABELS[key]}</span>
                  {indicators[key] && <Check size={14} className="text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-800 mx-1"></div>

        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
          <Settings2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
          <Camera size={18} />
        </button>
        <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};
