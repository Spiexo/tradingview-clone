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
      activeTimeframe={activeTimeframe}
      onTimeframeChange={setActiveTimeframe}
      rightPanel={<WatchlistPanel assets={mockAssets} />}
    >
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ChartToolbar />
        <div className="flex-1 bg-gray-950 relative">
          <CandlestickChart data={mockBTCOHLCV} />
        </div>
      </div>
    </MainLayout>
  );
};

export default App;
