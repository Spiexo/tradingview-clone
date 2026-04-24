import React from 'react';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Alert } from '../../types';

interface AlertItemProps {
  alert: Alert;
  onRemove: (id: string) => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded ${
          alert.condition === 'above' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
        }`}>
          {alert.condition === 'above' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-200">{alert.symbol}</span>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              {alert.condition}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-300">
            ${alert.target_price.toLocaleString()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onRemove(alert.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded transition-all"
        title="Remove alert"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
