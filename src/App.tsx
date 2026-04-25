import React, { useState, useMemo } from 'react';
import './index.css';
import { MainLayout } from './components/layout/MainLayout';
import { WatchlistPanel } from './components/watchlist/WatchlistPanel';
import { AlertPanel } from './components/alerts/AlertPanel';
import { CandlestickChart } from './components/chart/CandlestickChart';
import { ChartToolbar } from './components/chart/ChartToolbar';
import { DrawingToolbar } from './components/chart/DrawingToolbar';
import { AuthModal } from './components/auth/AuthModal';
import { Spinner } from './components/ui/Spinner';
import { Skeleton } from './components/ui/Skeleton';
import { Button } from './components/ui/Button';
import { ErrorMessage } from './components/ui/ErrorMessage';
import { useAuth } from './hooks/useAuth';
import { useWatchlist } from './hooks/useWatchlist';
import { useDrawings } from './hooks/useDrawings';
import { useCoinGecko, useCoinGeckoMarkets, SYMBOL_TO_ID } from './hooks/useCoinGecko';
import type { RightPanelType } from './components/layout/Sidebar';
import { mockAssets } from './data/mockWatchlist';
import type { Timeframe, Asset, DrawingTool } from './types';

const App: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    watchlist: dbWatchlist,
    loading: watchlistLoading,
    error: watchlistError,
    addToWatchlist,
    removeFromWatchlist,
    refreshWatchlist
  } = useWatchlist();

  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');
  const [activeAsset, setActiveAsset] = useState<Asset>(mockAssets[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<DrawingTool>('cursor');
  const [activePanel, setActivePanel] = useState<RightPanelType>('watchlist');

  const {
    drawings,
    addDrawing,
    clearDrawings
  } = useDrawings(activeAsset.symbol, activeTimeframe);

  const {
    data: chartData,
    loading: chartLoading,
    error: chartError,
    refresh: refreshChart
  } = useCoinGecko(activeAsset.symbol, activeTimeframe);

  const coinIds = useMemo(() => {
    const ids = new Set<string>();
    dbWatchlist.forEach((item) => {
      const id = SYMBOL_TO_ID[item.symbol.toUpperCase()];
      if (id) ids.add(id);
    });
    const activeId = SYMBOL_TO_ID[activeAsset.symbol.toUpperCase()];
    if (activeId) ids.add(activeId);
    return Array.from(ids);
  }, [dbWatchlist, activeAsset.symbol]);

  const {
    data: marketData,
    loading: marketLoading,
    error: marketError,
    refresh: refreshMarkets
  } = useCoinGeckoMarkets(coinIds);

  const watchlistAssets = useMemo(() => {
    // Merge database watchlist with real-time data or mockAssets
    return dbWatchlist.map((item) => {
      const coinId = SYMBOL_TO_ID[item.symbol.toUpperCase()];
      const liveData = coinId ? marketData[coinId] : null;

      if (liveData) {
        return {
          symbol: item.symbol,
          name: item.name,
          type: item.type,
          price: liveData.current_price,
          change: liveData.price_change_24h,
          changePercent: liveData.price_change_percentage_24h,
        } as Asset;
      }

      const mockAsset = mockAssets.find((a) => a.symbol === item.symbol);
      if (mockAsset) return mockAsset;

      // Fallback for assets not in mockAssets
      return {
        symbol: item.symbol,
        name: item.name,
        type: item.type,
        price: 0,
        change: 0,
        changePercent: 0,
      } as Asset;
    });
  }, [dbWatchlist, marketData]);

  const displayActiveAsset = useMemo(() => {
    const coinId = SYMBOL_TO_ID[activeAsset.symbol.toUpperCase()];
    const liveData = coinId ? marketData[coinId] : null;

    if (liveData) {
      return {
        ...activeAsset,
        price: liveData.current_price,
        change: liveData.price_change_24h,
        changePercent: liveData.price_change_percentage_24h,
      };
    }
    return activeAsset;
  }, [activeAsset, marketData]);

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

  const handleAddDrawing = async (drawing: Parameters<typeof addDrawing>[0]) => {
    await addDrawing(drawing);
  };

  const handleClearDrawings = async () => {
    await clearDrawings();
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
          asset={displayActiveAsset}
          user={user}
          isLoading={marketLoading}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={signOut}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          rightPanel={
            activePanel === 'watchlist' ? (
              <WatchlistPanel
                assets={watchlistAssets}
                activeSymbol={activeAsset.symbol}
                isLoading={watchlistLoading || marketLoading}
                onAssetSelect={setActiveAsset}
                onAdd={handleAddToWatchlist}
                onRemove={handleRemoveFromWatchlist}
                error={watchlistError || marketError}
                onRetry={() => {
                  refreshWatchlist();
                  refreshMarkets();
                }}
              />
            ) : activePanel === 'alerts' ? (
              <AlertPanel activeAsset={displayActiveAsset} />
            ) : null
          }
        >
          <ChartToolbar
            activeTimeframe={activeTimeframe}
            onTimeframeChange={setActiveTimeframe}
          />
          <div className="flex-1 flex overflow-hidden">
            <DrawingToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              onClearAll={handleClearDrawings}
            />
            <div className="flex-1 bg-gray-950 relative">
              {chartLoading && (
                <div className="absolute inset-0 z-10 p-4">
                  <Skeleton className="w-full h-full rounded-none" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                </div>
              )}
              {chartError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-20">
                  <ErrorMessage
                    message={chartError}
                    onRetry={refreshChart}
                  />
                </div>
              ) : (
                <CandlestickChart
                  data={chartData}
                  activeTool={activeTool}
                  drawings={drawings}
                  onDraw={handleAddDrawing}
                />
              )}
            </div>
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
