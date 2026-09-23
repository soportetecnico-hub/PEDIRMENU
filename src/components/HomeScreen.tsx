import React from 'react';
import { 
  User, 
  Flame, 
  UtensilsCrossed, 
  ClipboardList, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { UserProfile, Order } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  orders: Order[];
  onGoToOrder: () => void;
  onGoToViewOrder: () => void;
  isFirestoreConnected?: boolean;
  justConfirmedOrder?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  orders,
  onGoToOrder,
  onGoToViewOrder,
  isFirestoreConnected = true,
  justConfirmedOrder = false,
}) => {
  const activeOrder = orders.find((o) => o.status === 'confirmed') || orders[0];
  const orderCount = orders.filter((o) => o.status !== 'cancelled').length;

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-8 space-y-4">
      {/* Optional Success Banner if just confirmed */}
      {justConfirmedOrder && (
        <div 
          id="banner-pedido-confirmado"
          className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0e291f] border border-emerald-700/60 text-emerald-300 text-xs font-medium shadow-lg transition-all animate-fade-in"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>Pedido Confirmado y sincronizado con Firestore</span>
        </div>
      )}

      {/* Employee Profile Card */}
      <div 
        id="card-user-profile"
        className="relative bg-[#16181e] border border-[#2a2d37] rounded-2xl p-4 shadow-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#2d1417] border border-red-800/40 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {user.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>{user.department}</span>
              <span className="text-gray-600">•</span>
              <span className="text-red-400 font-mono font-medium">DNI/C.E.: {user.dni}</span>
            </p>
          </div>
        </div>

        {/* Active connection dot indicator */}
        <div className="absolute top-4 right-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      {/* Restaurant Location Card */}
      <div 
        id="card-dining-location"
        className="bg-[#16181e] border border-[#2a2d37] rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="text-amber-500 shrink-0">
            <Flame className="w-5 h-5 fill-amber-500/30" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Fogón Gastronómico</h3>
            <p className="text-xs text-gray-400">Comedor Planta Nova • Menú diario</p>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-[#22252e] text-gray-300 text-xs font-medium border border-[#2f333f]">
          Planta Nova
        </div>
      </div>

      {/* Section Title */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Opciones Principales
        </h4>
      </div>

      {/* Main Action Card: HACER PEDIDO */}
      <button
        id="btn-action-hacer-pedido"
        onClick={onGoToOrder}
        className="w-full text-left bg-gradient-to-r from-[#d93829] to-[#c2281c] hover:from-[#e34233] hover:to-[#cd2d20] active:scale-[0.99] text-white rounded-2xl p-5 shadow-xl shadow-red-950/40 flex items-center justify-between transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
            <UtensilsCrossed className="w-7 h-7 text-[#d93829]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold tracking-tight text-white">
                HACER PEDIDO
              </h3>
              <span className="px-2 py-0.5 rounded bg-black/25 text-white/90 text-[10px] font-bold tracking-wider">
                HOY
              </span>
            </div>
            <p className="text-xs text-red-100/90 mt-1 leading-snug">
              Elige tu menú por día (31/08/26 al 30/09/26)
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center shrink-0 group-hover:bg-black/30 group-hover:translate-x-0.5 transition-all">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* Secondary Action Card: VER PEDIDO */}
      <button
        id="btn-action-ver-pedido"
        onClick={onGoToViewOrder}
        className="w-full text-left bg-[#16181e] hover:bg-[#1a1d25] border border-[#2a2d37] hover:border-[#383d4a] active:scale-[0.99] text-white rounded-2xl p-4 shadow-md flex items-center justify-between transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#2a1315] border border-red-900/40 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6 text-red-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                VER PEDIDO
              </h3>
              {orderCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-700/50 text-emerald-400 text-[10px] font-semibold">
                  Activo
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px] font-medium">
                  Sin pedidos
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {orderCount > 0 
                ? `Tienes ${orderCount} pedido registrado en Firestore`
                : 'Consulta tus pedidos registrados o realiza uno nuevo'}
            </p>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </button>

      {/* Recent Order Summary Card */}
      <div 
        id="card-recent-order-status"
        className="bg-[#16181e] border border-[#2a2d37] rounded-2xl p-4 shadow-sm"
      >
        <p className="text-[11px] text-gray-400 font-medium mb-2.5">
          Último Pedido Confirmado
        </p>

        {activeOrder ? (
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-200">
              <span className="font-semibold text-white">
                {activeOrder.elections.length} elecciones de menú durante el periodo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-4 h-4 text-amber-500/70" />
            <span>Aún no tienes pedidos registrados este mes.</span>
          </div>
        )}
      </div>

      {/* Bottom Status & Connectivity Info */}
      <div className="pt-4 flex flex-col items-center gap-3 text-xs text-gray-400 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Rango: 31/08/26 al 30/09/26</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
            <span className={isFirestoreConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isFirestoreConnected ? 'Firestore Conectado' : 'Modo Sincronizado'}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
          <span className="text-red-500">&lt;&gt;</span>
          <span>Desarrollado por Vallumi-System</span>
        </div>
      </div>
    </div>
  );
};
