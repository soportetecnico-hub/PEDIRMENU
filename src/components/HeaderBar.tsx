import React from 'react';
import { ArrowLeft, X, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface HeaderBarProps {
  currentView: AppView;
  onNavigateHome: () => void;
  onLogout?: () => void;
  title?: string;
  timeString?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentView,
  onNavigateHome,
  onLogout,
  title,
  timeString = '10:14'
}) => {
  return (
    <header className="w-full max-w-md mx-auto flex items-center justify-between py-3 px-4 text-sm select-none">
      {currentView === 'home' && (
        <>
          <div />

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-[#2a1315] border border-red-900/40 text-red-300 text-xs font-medium">
              Planta Nova
            </div>
            {onLogout && (
              <button
                id="btn-header-logout"
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}

      {currentView === 'order' && (
        <>
          <div />

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-medium text-gray-400">{timeString}</span>
            <button
              id="btn-header-close-order"
              onClick={onNavigateHome}
              title="Cerrar y volver"
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {currentView === 'ticket' && (
        <>
          <button
            id="btn-header-back-home"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-white hover:text-red-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold text-sm">Resumen del Pedido</span>
          </button>

          <div className="px-2.5 py-1 rounded-full bg-[#2a1315] border border-red-900/40 text-red-300 text-xs font-medium">
            Planta Nova
          </div>
        </>
      )}
    </header>
  );
};
