import React, { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
<<<<<<< HEAD
import { mockBTCOHLCV } from './data/mockOHLCV';
import { mockAssets } from './data/mockWatchlist';
=======
import { mockOHLCVData, mockWatchlist } from './data/mockData';
import type { Timeframe } from './types';
>>>>>>> 652d2ef933e6d675c95611d6329bcb1417222fcb

const App: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');

  // Use the first asset as the active one
  const activeAsset = mockAssets[0];

  return (
<<<<<<< HEAD
    <MainLayout>
      <Topbar asset={activeAsset} />
      <div className="flex flex-1 overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChartToolbar />
          <div className="flex-1 bg-[#131722] relative">
            <CandlestickChart data={mockBTCOHLCV} />
          </div>
        </div>

        {/* Watchlist Sidebar */}
        <WatchlistPanel assets={mockAssets} />
=======
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
>>>>>>> 652d2ef933e6d675c95611d6329bcb1417222fcb
      </div>
    </MainLayout>
  );
};

export default App;
