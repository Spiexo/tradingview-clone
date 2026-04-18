import React, { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { mockOHLCVData, mockWatchlist } from './data/mockData';
import type { Timeframe } from './types';

const App: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');

  // Use the first asset as the active one
  const activeAsset = mockWatchlist[0];

  return (
    <MainLayout
      asset={activeAsset}
      activeTimeframe={activeTimeframe}
      onTimeframeChange={setActiveTimeframe}
      rightPanel={<WatchlistPanel assets={mockWatchlist} />}
    >
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ChartToolbar />
        <div className="flex-1 bg-gray-950 relative">
          <CandlestickChart data={mockOHLCVData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default App;
