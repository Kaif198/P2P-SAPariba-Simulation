import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ToastType } from '../context/AppContext';

const config: Record<ToastType, { icon: React.ElementType; bg: string; border: string; iconColor: string; textColor: string }> = {
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-900' },
  error:   { icon: XCircle,     bg: 'bg-red-50',   border: 'border-red-200',   iconColor: 'text-red-500',   textColor: 'text-red-900'   },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', textColor: 'text-amber-900' },
  info:    { icon: Info,         bg: 'bg-blue-50',  border: 'border-blue-200',  iconColor: 'text-blue-500',  textColor: 'text-blue-900'  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none w-96">
      {toasts.map(toast => {
        const { icon: Icon, bg, border, iconColor, textColor } = config[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl pointer-events-auto ${bg} ${border} animate-in slide-in-from-right-4 duration-300`}
          >
            <Icon size={20} className={`shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${textColor}`}>{toast.message}</p>
              {toast.detail && (
                <p className={`text-xs mt-0.5 leading-relaxed opacity-80 ${textColor}`}>{toast.detail}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
            >
              <X size={16} className={textColor} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
