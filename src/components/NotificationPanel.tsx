import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, X, BellOff, ExternalLink, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllRead, dismissNotification } = useApp();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleClick = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link) {
      navigate(link);
      onClose();
    }
  };

  const typeIcon = (type: string) => {
    if (type === 'urgent') return <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />;
    if (type === 'warning') return <AlertCircle size={17} className="text-amber-500 shrink-0 mt-0.5" />;
    return <Info size={17} className="text-blue-500 shrink-0 mt-0.5" />;
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-[calc(100%+10px)] w-[420px] bg-white rounded-xl shadow-2xl border border-[#E2E6EA] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E6EA] bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-[#1A1A2E]">Notifications</h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs text-[#0069B4] hover:underline font-medium"
            title="Mark all as read"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-[#5A6478]">
          <BellOff size={28} className="mb-3 opacity-25" />
          <p className="text-sm font-medium">All caught up</p>
          <p className="text-xs text-gray-400 mt-1">No new notifications</p>
        </div>
      ) : (
        <ul className="max-h-[460px] overflow-y-auto divide-y divide-[#E2E6EA]">
          {notifications.map(n => (
            <li
              key={n.id}
              className={`px-5 py-4 transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/40'} hover:bg-gray-50`}
            >
              <div className="flex gap-3">
                {typeIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-tight ${n.read ? 'text-[#5A6478]' : 'text-[#1A1A2E]'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="text-gray-300 hover:text-gray-500 transition-colors"
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#5A6478] mt-1 leading-relaxed">{n.detail}</p>
                  {n.link && (
                    <button
                      onClick={() => handleClick(n.id, n.link)}
                      className="mt-2 text-xs font-semibold text-[#0069B4] hover:underline flex items-center gap-1"
                    >
                      {n.linkLabel ?? 'View'} <ExternalLink size={11} />
                    </button>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1.5">Today, {n.timestamp}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
