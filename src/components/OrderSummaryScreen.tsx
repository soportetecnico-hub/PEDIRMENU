import React, { useState } from 'react';
import { 
  Flame, 
  User, 
  Calendar, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Share2,
  Lock,
  Clock
} from 'lucide-react';
import { Order, UserProfile } from '../types';

interface OrderSummaryScreenProps {
  order: Order;
  user: UserProfile;
  onModifyOrder: () => void;
  onCancelOrder: (orderId: string) => Promise<void>;
  onConfirmOrder: () => void;
  onReturnToHome: () => void;
  showSuccessToast?: boolean;
}

export const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({
  order,
  user,
  onModifyOrder,
  onCancelOrder,
  onConfirmOrder,
  onReturnToHome,
  showSuccessToast = true,
}) => {
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = order.status === 'confirmed';

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleModalAcknowledge = () => {
    setShowConfirmModal(false);
    onConfirmOrder();
  };

  const handleModifyClick = () => {
    if (isConfirmed) {
      alert('Este pedido se encuentra en estado "CONFIRMAR PEDIDO" y está bloqueado. Las modificaciones deben gestionarse directamente con Recursos Humanos (RRHH).');
      return;
    }
    onModifyOrder();
  };

  const handleCancelClick = async () => {
    setIsDeleting(true);
    try {
      await onCancelOrder(order.id);
    } finally {
      setIsDeleting(false);
      setShowCancelConfirmModal(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-12 space-y-4">
      {/* Toast Notification Banner */}
      {showSuccessToast && (
        <div 
          id="toast-order-success"
          className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#1e2027] border border-[#323643] text-gray-200 text-xs shadow-lg transition-all animate-fade-in"
        >
          <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-medium text-gray-200">
            {isConfirmed 
              ? `¡Pedido confirmado de ${order.elections.length} elecciones! Quedó bloqueado en el sistema.`
              : `¡Pedido enviado de ${order.elections.length} elecciones! Revisa los detalles y haz clic en 'CONFIRMAR PEDIDO' o 'Modificar'.`}
          </span>
        </div>
      )}

      {/* Main Ticket Card (with Red Accent Border) */}
      <div 
        id="card-order-ticket"
        className="rounded-2xl border border-red-600/70 bg-[#14161b] p-5 shadow-2xl relative overflow-hidden"
      >
        {/* Header of Ticket */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232631]">
          <div className="flex items-center gap-2.5">
            <div className="text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500/40" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Fogón Gastronómico
              </h3>
              <p className="text-[11px] text-gray-400">Ticket de Pedido</p>
            </div>
          </div>

          {isConfirmed ? (
            <div className="px-2.5 py-1 rounded-full bg-[#0d281e] border border-emerald-700/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CONFIRMAR PEDIDO (Bloqueado)</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-[#2d210e] border border-amber-700/60 text-amber-400 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>ENVIAR PEDIDO (Pendiente)</span>
            </div>
          )}
        </div>

        {/* Section: Employee Data */}
        <div className="py-4 border-b border-[#232631] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase tracking-wide">
            <User className="w-3.5 h-3.5" />
            <span>Datos del Empleado</span>
          </div>

          <h4 className="text-sm font-bold text-white">
            {order.userName || user.name}
          </h4>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>DNI/C.E.: {order.userDni || user.dni}</span>
            <span>•</span>
            <span>{order.userDepartment || user.department}</span>
          </div>
        </div>

        {/* Section: Election Summary */}
        <div className="py-4 border-b border-[#232631] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              <span>Resumen de Elecciones:</span>
            </div>

            <div className="px-2 py-0.5 rounded-full bg-[#0e271f] border border-emerald-800/50 text-emerald-400 text-[11px] font-semibold">
              {order.elections.length} {order.elections.length === 1 ? 'elección' : 'elecciones'}
            </div>
          </div>

          {/* List of day election cards */}
          <div className="space-y-3">
            {order.elections.map((election, index) => {
              const electionStatus = election.status || order.status || 'pending';
              const isElectionConfirmed = electionStatus === 'confirmed';

              return (
                <div 
                  key={`${election.date}-${index}`}
                  className={`rounded-xl p-3.5 space-y-2 transition-all border ${
                    isElectionConfirmed
                      ? 'bg-[#121a15] border-emerald-800/60 shadow-sm'
                      : 'bg-[#1a1714] border-amber-800/50 shadow-sm'
                  }`}
                >
                  {/* Top row with Date & Status Identifier Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                        {election.dayName}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {election.displayDate}
                      </span>
                    </div>

                    {/* Prominent Status Identifier: "ENVIAR PEDIDO" vs "CONFIRMAR PEDIDO" */}
                    {isElectionConfirmed ? (
                      <span 
                        id={`badge-election-status-${election.date}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-600/70 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase shadow-xs"
                      >
                        <Lock className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        <span>CONFIRMAR PEDIDO</span>
                      </span>
                    ) : (
                      <span 
                        id={`badge-election-status-${election.date}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/90 border border-amber-600/70 text-amber-400 text-[10px] font-extrabold tracking-wider uppercase shadow-xs"
                      >
                        <Clock className="w-3 h-3 text-amber-400 stroke-[2.5]" />
                        <span>ENVIAR PEDIDO</span>
                      </span>
                    )}
                  </div>

                  {/* Status subtitle indicating whether it's locked or editable */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    {isElectionConfirmed ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5] text-emerald-400" />
                        <span>Pedido del {election.displayDate} confirmado (Bloqueado)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-amber-400" />
                        <span>Pedido del {election.displayDate} enviado (Editable)</span>
                      </div>
                    )}

                    {election.category && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2a1417] text-red-300 border border-red-900/30">
                        {election.category}
                      </span>
                    )}
                  </div>

                  {/* Dish name & details */}
                  <div className="pt-1 border-t border-white/5">
                    <h5 className="text-xs font-bold text-white leading-snug">
                      {election.optionTitle}
                    </h5>

                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                      {election.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Footer Info */}
        <div className="pt-3 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <div>
            <span>Código: </span>
            <span className="text-gray-200 font-bold">{order.orderCode}</span>
          </div>
          <div>
            <span>{order.timeFormatted || '02:37 AM'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="space-y-2.5 pt-2">
        {/* Main Green Confirm Button (Only if pending) */}
        {!isConfirmed ? (
          <button
            type="button"
            id="btn-confirmar-pedido-ticket"
            onClick={handleConfirmClick}
            className="w-full bg-[#00a86b] hover:bg-[#00925c] active:scale-[0.99] text-black font-extrabold text-xs tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>CONFIRMAR PEDIDO</span>
          </button>
        ) : (
          <div className="w-full bg-[#14261e] border border-emerald-800/60 text-emerald-400 text-xs font-bold py-3 px-4 rounded-xl text-center">
            Pedido confirmado y bloqueado (Gestión RRHH)
          </div>
        )}

        {/* Modify and Cancel Buttons Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id="btn-modificar-pedido"
            onClick={handleModifyClick}
            className={`text-xs font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isConfirmed
                ? 'bg-[#2a1d1e] text-gray-400 border border-red-900/40 hover:bg-[#352224]'
                : 'bg-[#d93829] hover:bg-[#c2281c] text-white active:scale-[0.98] shadow-red-950/30'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isConfirmed ? 'Modificar (Bloqueado)' : 'Modificar'}</span>
          </button>

          <button
            type="button"
            id="btn-cancelar-pedido-trigger"
            onClick={() => setShowCancelConfirmModal(true)}
            className="bg-[#181a20] hover:bg-[#20232c] active:scale-[0.98] text-gray-300 hover:text-red-400 border border-[#2b2e38] text-xs font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Cancelar</span>
          </button>
        </div>

        {/* Return to Home link */}
        <div className="pt-2 text-center">
          <button
            type="button"
            id="btn-volver-menu-principal"
            onClick={onReturnToHome}
            className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            Volver al Menú Principal
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Order Submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#16181e] border border-[#2a2d37] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">¡Pedido Confirmado Exitosamente!</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Registrado en Firestore correctamente.
                </p>
              </div>
            </div>

            <div className="bg-[#1f222a] border border-[#2e3340] rounded-xl p-3.5 text-xs text-gray-300 leading-relaxed space-y-2">
              <p className="font-semibold text-white">
                Nota importante de RRHH:
              </p>
              <p className="text-gray-300">
                Cualquier modificación posterior a este pedido deberá ser gestionada directamente con el área de <span className="text-red-400 font-bold">Recursos Humanos (RRHH)</span>.
              </p>
              <p className="text-gray-400 text-[11px]">
                Los días seleccionados han quedado bloqueados en el sistema para evitar duplicados.
              </p>
            </div>

            <button
              type="button"
              id="btn-modal-entendido"
              onClick={handleModalAcknowledge}
              className="w-full py-3 bg-[#00a86b] hover:bg-[#00925c] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              Entendido, ir al inicio
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Cancel Order */}
      {showCancelConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#16181e] border border-[#2a2d37] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">¿Cancelar este pedido?</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  El pedido {order.orderCode} será eliminado de Firestore.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirmModal(false)}
                className="py-2.5 px-3 bg-[#20232b] hover:bg-[#282c37] text-xs font-semibold text-gray-300 rounded-xl transition-colors cursor-pointer"
              >
                No, mantener
              </button>

              <button
                type="button"
                id="btn-confirm-delete-order"
                onClick={handleCancelClick}
                disabled={isDeleting}
                className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, cancelar pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
