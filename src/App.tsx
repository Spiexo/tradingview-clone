import React, { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { mockBTCOHLCV } from './data/mockOHLCV';
import { mockAssets } from './data/mockWatchlist';
import type { Timeframe } from './types';

const App: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');

  // Use the first asset as the active one
  const activeAsset = mockAssets[0];

  return (
    <MainLayout
      asset={activeAsset}
      rightPanel={
        <WatchlistPanel
          assets={mockAssets}
          activeSymbol={activeAsset.symbol}
        />
      }
    >
      <ChartToolbar
        activeTimeframe={activeTimeframe}
        onTimeframeChange={setActiveTimeframe}
      />
      <div className="flex-1 bg-gray-950 relative">
        <CandlestickChart data={mockBTCOHLCV} />
      </div>
    </MainLayout>
  );
};

export default App;
