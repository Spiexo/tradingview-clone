import React, { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { mockBTCOHLCV } from './data/mockOHLCV';
import { mockOHLCVData } from './data/mockData';
import { mockAssets } from './data/mockWatchlist';
import type { Timeframe, Asset } from './types';

const App: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');
  const [activeAsset, setActiveAsset] = useState<Asset>(mockAssets[0]);

  const chartData = activeAsset.symbol === 'BTC' ? mockBTCOHLCV : mockOHLCVData;

  return (
    <MainLayout
      asset={activeAsset}
      rightPanel={
        <WatchlistPanel
          assets={mockAssets}
          activeSymbol={activeAsset.symbol}
          onAssetSelect={setActiveAsset}
        />
      }
    >
      <ChartToolbar
        activeTimeframe={activeTimeframe}
        onTimeframeChange={setActiveTimeframe}
      />
      <div className="flex-1 bg-gray-950 relative">
        <CandlestickChart data={chartData} />
      </div>
    </MainLayout>
  );
};

export default App;
