import React, { useState } from 'react';
import { Bell, Plus, X } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertItem } from './AlertItem';
import { Skeleton } from '../ui/Skeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Button } from '../ui/Button';
import type { Asset } from '../../types';

interface AlertPanelProps {
  activeAsset: Asset;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ activeAsset }) => {
  const { alerts, loading, error, addAlert, removeAlert, refreshAlerts } = useAlerts();
  const [isAdding, setIsAdding] = useState(false);
  const [targetPrice, setTargetPrice] = useState(activeAsset.price.toString());
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (isNaN(price)) return;

    try {
      await addAlert({
        symbol: activeAsset.symbol,
        target_price: price,
        condition,
      });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-gray-200 uppercase text-xs tracking-wider flex items-center gap-2">
          <Bell size={14} className="text-blue-500" />
          Price Alerts
        </h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setTargetPrice(activeAsset.price.toString());
          }}
          className={`p-1 rounded transition-colors ${
            isAdding ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
          }`}
          title="Create new alert"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddAlert} className="p-4 border-b border-gray-800 bg-gray-800/30 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Target Price ({activeAsset.symbol})
            </label>
            <input
              type="number"
              step="any"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Condition
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                  condition === 'above'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-gray-950 text-gray-500 border border-gray-700 hover:border-gray-600'
                }`}
              >
                Price Above
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                  condition === 'below'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-gray-950 text-gray-500 border border-gray-700 hover:border-gray-600'
                }`}
              >
                Price Below
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-2">
            Create Alert
          </Button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {error ? (
          <ErrorMessage
            message={error}
            onRetry={refreshAlerts}
            className="mt-8"
          />
        ) : loading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 bg-gray-800/20 rounded border border-gray-800/50">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="flex flex-col">
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onRemove={removeAlert}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            <Bell size={24} className="mx-auto mb-2 opacity-20" />
            <p>No alerts set yet.</p>
            <p className="text-xs mt-1">Get notified when prices hit your targets.</p>
          </div>
        )}
      </div>
    </div>
  );
};
