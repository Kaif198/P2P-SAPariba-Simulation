import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, UserCircle, RefreshCw, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationPanel } from './NotificationPanel';
import { GlobalSearch } from './GlobalSearch';

const routeNames: Record<string, string> = {
  '/overview': 'Executive Overview',
  '/requisitions-orders': 'Requisition & PO Management',
  '/invoice-matching': 'Invoice Matching & Exceptions',
  '/supplier-performance': 'Supplier Performance Scorecard',
  '/process-improvements': 'Process Improvement Tracker',
  '/documentation': 'Process Documentation Hub',
};

const TopBar: React.FC = () => {
  const location = useLocation();
  const title = routeNames[location.pathname] || 'P2P Process Intelligence';
  const { unreadCount } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lastRefreshed] = useState(new Date());
  const bellRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Ctrl+K / Cmd+K opens global search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fmt = (d: Date) =>
    `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E2E6EA] flex items-center justify-between px-8 sticky top-0 z-40 transition-smooth">
        {/* Left: Title + refresh */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[#1A1A2E]">{title}</h2>
          <span className="flex items-center gap-1.5 text-xs text-[#5A6478] bg-gray-100 px-3 py-1 rounded-full">
            <RefreshCw size={11} className="opacity-60" />
            {fmt(lastRefreshed)}
          </span>
        </div>

        {/* Right: Search + Bell + User */}
        <div className="flex items-center gap-5">

          {/* Search bar (click or Ctrl+K) */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 pl-3 pr-4 py-2 border border-[#E2E6EA] rounded-full text-sm text-gray-400 bg-gray-50 hover:border-[#0069B4] hover:bg-white transition-smooth w-64 text-left group"
          >
            <Search size={16} className="shrink-0 group-hover:text-[#0069B4]" />
            <span className="flex-1">Search POs, invoices…</span>
            <span className="flex items-center gap-0.5 text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400">
              Ctrl K
            </span>
          </button>

          {/* Notification Bell */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => setShowNotifications(v => !v)}
              className={`relative p-2 rounded-full transition-smooth ${showNotifications ? 'bg-blue-50 text-[#0069B4]' : 'text-gray-500 hover:text-[#1A1A2E] hover:bg-gray-100'}`}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative flex items-center gap-3 border-l border-[#E2E6EA] pl-5">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-[#1A1A2E] leading-tight">Kaif Ahmed</p>
              <p className="text-xs text-[#5A6478]">P2P Process Specialist</p>
            </div>
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-1 text-[#0069B4] hover:opacity-80 transition-opacity"
            >
              <UserCircle size={36} />
              <ChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-52 bg-white rounded-xl shadow-xl border border-[#E2E6EA] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-[#E2E6EA] bg-gray-50">
                  <p className="text-sm font-semibold text-[#1A1A2E]">Kaif Ahmed</p>
                  <p className="text-xs text-[#5A6478]">kaif.ahmed@aldi-sued.de</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A6478] hover:bg-gray-50 hover:text-[#1A1A2E] transition-colors">
                      <User size={16} /> My Profile
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A6478] hover:bg-gray-50 hover:text-[#1A1A2E] transition-colors">
                      <Settings size={16} /> Settings
                    </button>
                  </li>
                  <li className="border-t border-[#E2E6EA] mt-1 pt-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </>
  );
};

export default TopBar;
