import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { Asset, Timeframe } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  asset: Asset;
  activeTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  rightPanel,
  asset,
}) => {
  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-300 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          asset={asset}
        />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 min-w-0 relative">
            {children}
          </main>
          {rightPanel && (
            <aside className="w-80 border-l border-gray-800 bg-gray-900 hidden lg:block">
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
