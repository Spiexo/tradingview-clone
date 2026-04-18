import React from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { Topbar } from './components/layout/Topbar';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { mockOHLCVData, mockWatchlist } from './data/mockData';

const App: React.FC = () => {
  // Use the first asset as the active one
  const activeAsset = mockWatchlist[0];

  return (
    <MainLayout>
      <Topbar asset={activeAsset} />
      <div className="flex flex-1 overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChartToolbar />
          <div className="flex-1 bg-[#131722] relative">
            <CandlestickChart data={mockOHLCVData} />
          </div>
        </div>

        {/* Watchlist Sidebar */}
        <WatchlistPanel assets={mockWatchlist} />
      </div>
    </MainLayout>
  );
};

export default App;
