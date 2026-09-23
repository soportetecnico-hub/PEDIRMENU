import React, { useState, useMemo } from 'react';
import { 
  User, 
  Calendar as CalendarIcon, 
  Check, 
  Send, 
  Wifi, 
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';
import { UserProfile, DailyMenu, OrderElection, Order } from '../types';
import { 
  generateDateRangeMenus 
} from '../utils/calendarUtils';

interface OrderSelectionScreenProps {
  user: UserProfile;
  menus: DailyMenu[];
  existingOrder?: Order | null;
  orders?: Order[];
  initialDate?: string;
  onSubmitOrder: (elections: OrderElection[], observations: string) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export const OrderSelectionScreen: React.FC<OrderSelectionScreenProps> = ({
  user,
  menus,
  existingOrder,
  orders,
  initialDate,
  onSubmitOrder,
  onCancel,
  isSaving = false,
}) => {
  // Elections dictionary: key is dateStr (YYYY-MM-DD)
  const [selectedElections, setSelectedElections] = useState<Record<string, OrderElection>>(() => {
    const initial: Record<string, OrderElection> = {};
    if (existingOrder && existingOrder.elections) {
      existingOrder.elections.forEach((el) => {
        initial[el.date] = el;
      });
    }
    return initial;
  });

  // Generate complete working days for the configured date range (31-08-2026 to 30-09-2026, excluding weekends & holidays)
  const rangeWorkdayMenus = useMemo(() => {
    const generated = generateDateRangeMenus('2026-08-31', '2026-09-30');
    const menuMap = new Map<string, DailyMenu>();

    generated.forEach((m) => menuMap.set(m.date, m));

    // Override with any menus passed from Firestore
    menus.forEach((m) => {
      if (!m.isHoliday) {
        const [y, mo, d] = m.date.split('-').map(Number);
        const dateObj = new Date(y, mo - 1, d);
        const dow = dateObj.getDay();
        if (dow >= 1 && dow <= 5) {
          menuMap.set(m.date, m);
        }
      }
    });

    const result = Array.from(menuMap.values());
    result.sort((a, b) => a.date.localeCompare(b.date));
    return result;
  }, [menus]);

  // Active selected date in view (default to initialDate or range start)
  const [activeDateStr, setActiveDateStr] = useState<string>(() => {
    if (initialDate && rangeWorkdayMenus.some((m) => m.date === initialDate)) {
      return initialDate;
    }
    const preferredDate = '2026-08-31';
    const exists = rangeWorkdayMenus.some((m) => m.date === preferredDate);
    if (exists) return preferredDate;
    return rangeWorkdayMenus[0]?.date || '2026-08-31';
  });

  // Current active menu object
  const currentMenu = useMemo(() => {
    return rangeWorkdayMenus.find((m) => m.date === activeDateStr) || rangeWorkdayMenus[0];
  }, [rangeWorkdayMenus, activeDateStr]);

  const currentMenuIndex = useMemo(() => {
    return rangeWorkdayMenus.findIndex((m) => m.date === (currentMenu?.date || ''));
  }, [rangeWorkdayMenus, currentMenu]);

  const currentElection = currentMenu ? selectedElections[currentMenu.date] : undefined;

  // Set of dates that are locked (already ordered/confirmed)
  const lockedDateSet = useMemo(() => {
    const set = new Set<string>();
    if (orders) {
      orders.forEach((o) => {
        if (o.status === 'confirmed') {
          o.elections.forEach((el) => set.add(el.date));
        }
      });
    }
    return set;
  }, [orders]);

  const isCurrentDayLocked = currentMenu ? lockedDateSet.has(currentMenu.date) : false;

  // Toggle selection for current day
  const handleToggleOption = (optionId: string, optionTitle: string, fullText: string, category?: string) => {
    if (!currentMenu) return;
    if (isCurrentDayLocked) {
      alert('Este día ya cuenta con un pedido confirmado. Las modificaciones o consultas de este día deben gestionarse directamente con Recursos Humanos (RRHH).');
      return;
    }

    setSelectedElections((prev) => {
      const next = { ...prev };
      if (next[currentMenu.date]?.optionId === optionId) {
        delete next[currentMenu.date];
      } else {
        next[currentMenu.date] = {
          date: currentMenu.date,
          dayName: currentMenu.dayOfWeek,
          displayDate: currentMenu.displayDate,
          optionId,
          optionTitle,
          description: fullText,
          category,
        };
      }
      return next;
    });
  };

  // Deselect current day
  const handleDeselectCurrentDay = () => {
    if (!currentMenu) return;
    if (isCurrentDayLocked) {
      alert('Este día ya cuenta con un pedido confirmado. Las modificaciones o consultas de este día deben gestionarse directamente con Recursos Humanos (RRHH).');
      return;
    }
    setSelectedElections((prev) => {
      const next = { ...prev };
      delete next[currentMenu.date];
      return next;
    });
  };

  // Day steppers
  const handlePrevDay = () => {
    if (currentMenuIndex > 0) {
      const prevDate = rangeWorkdayMenus[currentMenuIndex - 1]?.date;
      if (prevDate) setActiveDateStr(prevDate);
    }
  };

  const handleNextDay = () => {
    if (currentMenuIndex < rangeWorkdayMenus.length - 1) {
      const nextDate = rangeWorkdayMenus[currentMenuIndex + 1]?.date;
      if (nextDate) setActiveDateStr(nextDate);
    }
  };

  // Convert dictionary to array
  const electionsArray = Object.values(selectedElections);
  const totalElectionsCount = electionsArray.length;

  const handleSendOrder = async () => {
    if (totalElectionsCount === 0 || isSaving) return;
    await onSubmitOrder(electionsArray, '');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-16 space-y-4">
      {/* Employee Validation Banner Card */}
      <div 
        id="card-empleado-validado"
        className="bg-[#16181e] border border-[#2a2d37] rounded-2xl p-4 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
            <User className="w-3.5 h-3.5" />
            <span>Empleado (Validado en BD):</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0d281e] border border-emerald-700/50 text-[10px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Firestore BD</span>
          </div>
        </div>

        <div className="bg-[#111317] border border-[#242731] rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#271417] text-red-500 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                DNI: {user.dni} • {user.department}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#1e212b] flex items-center justify-between text-[11px] text-gray-400">
            <span>DNI / C.E. del Empleado:</span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">{user.dni}</span>
          </div>
        </div>
      </div>

      {/* ACTIVE WORKDAY MENU SELECTION & PROMINENT RED NAVIGATION BUTTONS */}
      <div 
        id="card-fecha-activa-menu"
        className="bg-[#16181e] border border-[#2a2d37] rounded-2xl p-4 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#242731]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wide">
            <CalendarIcon className="w-4 h-4 text-red-500" />
            <span>Selección de Menú por Día (31/08/26 al 30/09/26)</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#0d281e] border border-emerald-800/40 text-[10px] font-medium text-emerald-400 font-mono">
            {currentMenuIndex >= 0 ? `Día ${currentMenuIndex + 1} de ${rangeWorkdayMenus.length}` : 'Hábil'}
          </span>
        </div>

        {/* Date Box */}
        <div className="bg-[#111317] border border-[#242731] rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black tracking-wider text-[#ea580c] uppercase">
              {currentMenu?.dayOfWeek || 'LUNES'}
            </span>
            <span className="text-xs font-mono font-bold text-white px-2 py-1 bg-[#1a1d26] rounded-lg border border-[#2e3240]">
              {currentMenu?.displayDate || activeDateStr}
            </span>
          </div>

          {/* 2 Prominent Red Buttons: "Día Anterior" and "Día Siguiente" */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="btn-dia-anterior"
              onClick={handlePrevDay}
              disabled={currentMenuIndex <= 0}
              className="py-3 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-30 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Día Anterior</span>
            </button>

            <button
              type="button"
              id="btn-dia-siguiente"
              onClick={handleNextDay}
              disabled={currentMenuIndex >= rangeWorkdayMenus.length - 1}
              className="py-3 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-30 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 transition-all cursor-pointer"
            >
              <span>Día Siguiente</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Locked Day Notice */}
      {isCurrentDayLocked && (
        <div className="bg-[#291417] border border-red-800/80 rounded-2xl p-4 flex items-start gap-3 shadow-md">
          <div className="w-8 h-8 rounded-full bg-red-900/60 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-200">Día bloqueado por pedido confirmado</h4>
            <p className="text-[11px] text-red-300/80 mt-0.5 leading-relaxed">
              Este día ya fue solicitado. Cualquier modificación o cambio deberá ser gestionado directamente con el área de <strong className="text-white">Recursos Humanos (RRHH)</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Selected Dish Feedback Box */}
      {currentElection ? (
        <div 
          id="banner-menu-elegido-hoy"
          onClick={handleDeselectCurrentDay}
          className="bg-[#0c221a] border border-emerald-700/60 hover:border-emerald-600 rounded-2xl p-3.5 shadow-sm transition-all cursor-pointer group"
          title="Toca para desmarcar este día"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold text-emerald-300 leading-snug">
                Plato elegido: {currentElection.optionTitle}
              </h4>
              <p className="text-[11px] text-emerald-500/80 mt-0.5 group-hover:text-emerald-400 transition-colors">
                Toca aquí si deseas desmarcar o cambiar la opción para el {currentMenu?.displayDate}.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#16181e]/60 border border-dashed border-[#2f333f] rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-400">
            Ningún plato elegido para el <span className="text-white font-medium">{currentMenu?.displayDate}</span>. Elige una de las opciones abajo.
          </p>
        </div>
      )}

      {/* Dish Selection Options */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-wide">
            Opciones gastronómicas para {currentMenu?.dayOfWeek}:
          </h3>
          <span className="text-xs font-bold text-red-500">
            {currentMenu?.options?.length || 3} opciones
          </span>
        </div>

        <div className="space-y-2.5">
          {currentMenu?.options?.map((option) => {
            const isSelected = currentElection?.optionId === option.id;

            return (
              <div
                key={option.id}
                id={`card-dish-${option.id}`}
                onClick={() => handleToggleOption(option.id, option.title, option.fullText, option.category)}
                className={`w-full text-left rounded-2xl p-4 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#221214] border-2 border-red-500 shadow-lg shadow-red-950/40 ring-1 ring-red-500/30'
                    : 'bg-[#16181e] border border-[#2a2d37] hover:border-[#3a3f4e] hover:bg-[#1a1d25]'
                }`}
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[#f87171] leading-snug">
                      {option.title}
                    </h4>
                    {option.category && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2a1417] text-red-300 border border-red-900/30">
                        {option.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {option.fullText}
                  </p>
                </div>

                {/* Custom Checkbox on the Right */}
                <div className="shrink-0 mt-0.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-red-600 border border-red-500 text-white shadow-sm'
                        : 'border-2 border-gray-600 bg-[#1e2129]'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          id="btn-enviar-pedido"
          onClick={handleSendOrder}
          disabled={totalElectionsCount === 0 || isSaving}
          className={`w-full py-4 px-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl transition-all ${
            totalElectionsCount > 0 && !isSaving
              ? 'bg-[#d93829] hover:bg-[#c2281c] active:scale-[0.99] text-white shadow-red-950/50 cursor-pointer'
              : 'bg-[#22252e] text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-black tracking-wider uppercase">
            <Send className="w-4 h-4" />
            <span>
              {isSaving 
                ? 'Sincronizando con Firestore...' 
                : `ENVIAR PEDIDO (${totalElectionsCount} ${totalElectionsCount === 1 ? 'DÍA SELECCIONADO' : 'DÍAS SELECCIONADOS'})`}
            </span>
          </div>
          <span className="text-[11px] text-red-100/80 mt-1 font-normal">
            Persistir pedido en base de datos Firestore (Lunes a Viernes)
          </span>
        </button>
      </div>

      {/* Connection Indicator & Footer */}
      <div className="pt-2 flex flex-col items-center gap-2 text-xs text-gray-400 select-none">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
          <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Sincronizado con Firestore de Nova Maquinarias</span>
        </div>

        <div className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
          <span className="text-red-500">&lt;&gt;</span>
          <span>Desarrollado por Vallumi-System</span>
        </div>
      </div>
    </div>
  );
};
