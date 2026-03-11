import React, { createContext, useContext, useState, useCallback } from 'react';
import type { POStatus, InvoiceStatus, ImprovementStatus } from '../data/types';

// ─── Toast ───────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  detail?: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  detail: string;
  link?: string;
  linkLabel?: string;
  read: boolean;
  timestamp: string;
}

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    title: 'Invoice Escalated to Management',
    detail: 'INV-2026-0842 (EuroTrans Logistics, €22,000) is escalated — goods receipt confirmation missing in Ariba.',
    link: '/invoice-matching',
    linkLabel: 'Resolve Exception',
    read: false,
    timestamp: '09:14',
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'High-Value PO Awaiting Approval',
    detail: 'PO-2026-9003 from Global Print Media AG (€48,500) requires regional marketing director sign-off.',
    link: '/requisitions-orders',
    linkLabel: 'Open PO',
    read: false,
    timestamp: '08:30',
  },
  {
    id: 'notif-3',
    type: 'warning',
    title: 'Duplicate Invoice Detected',
    detail: 'INV-2026-0888 from Global Print Media AG matches a previously processed invoice. Risk of double payment.',
    link: '/invoice-matching',
    linkLabel: 'Review',
    read: false,
    timestamp: '08:05',
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'Supplier Review Due',
    detail: 'Global Print Media AG is rated High Risk. A quarterly supplier review meeting is overdue.',
    link: '/supplier-performance',
    linkLabel: 'View Scorecard',
    read: false,
    timestamp: '07:00',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppState {
  poStatuses: Record<string, POStatus>;
  invoiceStatuses: Record<string, InvoiceStatus>;
  improvementStatuses: Record<string, ImprovementStatus>;
  notifications: AppNotification[];
  toasts: Toast[];
}

interface AppContextValue extends AppState {
  updatePOStatus: (id: string, status: POStatus) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  updateImprovementStatus: (id: string, status: ImprovementStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  dismissNotification: (id: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [poStatuses, setPoStatuses] = useState<Record<string, POStatus>>({});
  const [invoiceStatuses, setInvoiceStatuses] = useState<Record<string, InvoiceStatus>>({});
  const [improvementStatuses, setImprovementStatuses] = useState<Record<string, ImprovementStatus>>({});
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const updatePOStatus = useCallback((id: string, status: POStatus) => {
    setPoStatuses(prev => ({ ...prev, [id]: status }));
  }, []);

  const updateInvoiceStatus = useCallback((id: string, status: InvoiceStatus) => {
    setInvoiceStatuses(prev => ({ ...prev, [id]: status }));
  }, []);

  const updateImprovementStatus = useCallback((id: string, status: ImprovementStatus) => {
    setImprovementStatuses(prev => ({ ...prev, [id]: status }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      poStatuses, invoiceStatuses, improvementStatuses, notifications, toasts,
      updatePOStatus, updateInvoiceStatus, updateImprovementStatus,
      markNotificationRead, markAllRead, dismissNotification,
      addToast, dismissToast, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
