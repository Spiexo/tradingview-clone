import React from 'react';
import { Sidebar, type RightPanelType } from './Sidebar';
import { Topbar } from './Topbar';
import type { Asset, User } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  activePanel: RightPanelType;
  onPanelChange: (panel: RightPanelType) => void;
  asset: Asset;
  user: User | null;
  isLoading?: boolean;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  rightPanel,
  activePanel,
  onPanelChange,
  asset,
  user,
  isLoading = false,
  onOpenAuth,
  onSignOut,
}) => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-full bg-gray-950 text-gray-300 overflow-hidden">
      <Sidebar activePanel={activePanel} onPanelChange={onPanelChange} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          asset={asset}
          user={user}
          isLoading={isLoading}
          onOpenAuth={onOpenAuth}
          onSignOut={onSignOut}
        />
        <div className="flex-1 flex overflow-hidden relative">
          <main className="flex-1 min-w-0 relative flex flex-col">
            {children}
          </main>
          {rightPanel && (
            <aside className={`
              ${activePanel ? 'flex' : 'hidden'}
              fixed inset-0 z-40 bg-gray-900 md:relative md:flex md:w-80 md:border-l md:border-gray-800
            `}>
              <div className="flex flex-col w-full h-full">
                <div className="flex justify-end p-2 md:hidden">
                  <button
                    onClick={() => onPanelChange(null)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {rightPanel}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
