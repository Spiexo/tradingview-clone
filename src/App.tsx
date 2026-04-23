import React, { useState, useMemo } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { AuthModal } from './components/auth/AuthModal';
import { Spinner } from './components/ui/Spinner';
import { Button } from './components/ui/Button';
import { useAuth } from './hooks/useAuth';
import { useWatchlist } from './hooks/useWatchlist';
import { useCoinGecko } from './hooks/useCoinGecko';
import { usePrices } from './hooks/usePrices';
import { mockAssets } from './data/mockWatchlist';
import type { Timeframe, Asset } from './types';

const App: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    watchlist: dbWatchlist,
    loading: watchlistLoading,
    addToWatchlist,
    removeFromWatchlist
  } = useWatchlist();

  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');
  const [activeAsset, setActiveAsset] = useState<Asset>(mockAssets[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    data: chartData,
    loading: chartLoading,
    error: chartError
  } = useCoinGecko(activeAsset.symbol, activeTimeframe);

  const watchlistSymbols = useMemo(() => dbWatchlist.map((item) => item.symbol), [dbWatchlist]);
  const { prices: realTimePrices, loading: pricesLoading } = usePrices(watchlistSymbols);

  const watchlistAssets = useMemo(() => {
    return dbWatchlist.map((item) => {
      const realTimeData = realTimePrices[item.symbol];
      const mockAsset = mockAssets.find((a) => a.symbol === item.symbol);

      return {
        symbol: item.symbol,
        name: item.name,
        type: item.type,
        price: realTimeData?.price ?? mockAsset?.price ?? 0,
        change: ((realTimeData?.price ?? 0) * (realTimeData?.change24h ?? 0)) / 100 || mockAsset?.change || 0,
        changePercent: realTimeData?.change24h ?? mockAsset?.changePercent ?? 0,
      } as Asset;
    });
  }, [dbWatchlist, realTimePrices]);

  const handleAddToWatchlist = async () => {
    if (!activeAsset) return;

    // Avoid duplicates
    if (dbWatchlist.some((item) => item.symbol === activeAsset.symbol)) {
      return;
    }

    await addToWatchlist({
      symbol: activeAsset.symbol,
      name: activeAsset.name,
      type: activeAsset.type,
    });
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    const item = dbWatchlist.find((i) => i.symbol === symbol);
    if (item) {
      await removeFromWatchlist(item.id);
    }
  };

  if (authLoading) {
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
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={signOut}
          rightPanel={
            <WatchlistPanel
              assets={watchlistAssets}
              activeSymbol={activeAsset.symbol}
              isLoading={watchlistLoading || pricesLoading}
              onAssetSelect={setActiveAsset}
              onAdd={handleAddToWatchlist}
              onRemove={handleRemoveFromWatchlist}
            />
          }
        >
          <ChartToolbar
            activeTimeframe={activeTimeframe}
            onTimeframeChange={setActiveTimeframe}
          />
          <div className="flex-1 bg-gray-950 relative flex flex-col min-h-0">
            {chartError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-6 max-w-sm">
                  <p className="text-red-400 font-medium mb-2">Failed to load chart data</p>
                  <p className="text-gray-400 text-sm">{chartError}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 relative">
                {chartLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950/50 backdrop-blur-sm">
                    <Spinner size="lg" />
                  </div>
                )}
                <CandlestickChart data={chartData} />
              </div>
            )}
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
