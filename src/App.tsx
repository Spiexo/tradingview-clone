import React, { useState } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { AuthModal } from './components/auth/AuthModal';
import { Spinner } from './components/ui/Spinner';
import { Button } from './components/ui/Button';
import { useAuth } from './hooks/useAuth';
import { mockBTCOHLCV } from './data/mockOHLCV';
import { mockOHLCVData } from './data/mockData';
import { mockAssets } from './data/mockWatchlist';
import type { Timeframe, Asset } from './types';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');
  const [activeAsset, setActiveAsset] = useState<Asset>(mockAssets[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const chartData = activeAsset.symbol === 'BTC' ? mockBTCOHLCV : mockOHLCVData;

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-white p-4">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">TV</span>
            </div>
            <h1 className="text-4xl font-bold">Welcome to TradingView Clone</h1>
            <p className="text-gray-400">
              Professional charts and analysis tools for everyone. Sign in to access the dashboard and your personal watchlist.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Get Started
            </Button>
          </div>
        </div>
      ) : (
        <MainLayout
          asset={activeAsset}
          onOpenAuth={() => setIsAuthModalOpen(true)}
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
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default App;
