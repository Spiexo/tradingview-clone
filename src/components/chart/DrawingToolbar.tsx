import React from 'react';
import { MousePointer2, PenTool, Trash2 } from 'lucide-react';
import type { DrawingTool } from '../../types';

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClearAll: () => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  onClearAll,
}) => {
  return (
    <div className="w-12 border-r border-gray-800 bg-gray-950 flex flex-col items-center py-4 gap-4">
      <button
        onClick={() => onToolChange('cursor')}
        className={`p-2 rounded transition-colors ${
          activeTool === 'cursor'
            ? 'bg-blue-600/20 text-blue-500'
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`}
        title="Cursor"
      >
        <MousePointer2 size={20} />
      </button>

      <button
        onClick={() => onToolChange('trendline')}
        className={`p-2 rounded transition-colors ${
          activeTool === 'trendline'
            ? 'bg-blue-600/20 text-blue-500'
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`}
        title="Trend Line"
      >
        <PenTool size={20} />
      </button>

      <div className="h-px w-6 bg-gray-800 my-2"></div>

      <button
        onClick={onClearAll}
        className="p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors"
        title="Clear All Drawings"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};
