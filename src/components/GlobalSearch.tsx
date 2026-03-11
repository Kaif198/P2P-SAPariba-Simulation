import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, FileText, Users, BookOpen, X, ArrowRight } from 'lucide-react';
import { poData } from '../data/poData';
import { invoiceExceptions } from '../data/invoiceData';
import { supplierData } from '../data/supplierData';
import { documentHub } from '../data/documentData';

interface SearchResult {
  id: string;
  category: 'Purchase Orders' | 'Invoices' | 'Suppliers' | 'Documents';
  title: string;
  subtitle: string;
  badge?: string;
  route: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  'Purchase Orders': ShoppingCart,
  'Invoices': FileText,
  'Suppliers': Users,
  'Documents': BookOpen,
};

const categoryRoutes: Record<string, string> = {
  'Purchase Orders': '/requisitions-orders',
  'Invoices': '/invoice-matching',
  'Suppliers': '/supplier-performance',
  'Documents': '/documentation',
};

interface GlobalSearchProps {
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const results = useMemo((): SearchResult[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: SearchResult[] = [];

    // POs
    poData.forEach(po => {
      if (
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.category.toLowerCase().includes(q) ||
        po.status.toLowerCase().includes(q)
      ) {
        out.push({
          id: po.id,
          category: 'Purchase Orders',
          title: po.poNumber,
          subtitle: `${po.supplierName} · ${po.category}`,
          badge: po.status,
          route: '/requisitions-orders',
        });
      }
    });

    // Invoices
    invoiceExceptions.forEach(inv => {
      if (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.supplierName.toLowerCase().includes(q) ||
        inv.poReference.toLowerCase().includes(q) ||
        inv.mismatchReason.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q)
      ) {
        out.push({
          id: inv.id,
          category: 'Invoices',
          title: inv.invoiceNumber,
          subtitle: `${inv.supplierName} · ${inv.mismatchReason}`,
          badge: inv.status,
          route: '/invoice-matching',
        });
      }
    });

    // Suppliers
    supplierData.forEach(sup => {
      if (
        sup.supplierName.toLowerCase().includes(q) ||
        sup.category.toLowerCase().includes(q) ||
        sup.riskRating.toLowerCase().includes(q)
      ) {
        out.push({
          id: sup.id,
          category: 'Suppliers',
          title: sup.supplierName,
          subtitle: `${sup.category} · ${sup.riskRating} Risk · Score ${sup.overallScore}%`,
          badge: `${sup.riskRating} Risk`,
          route: '/supplier-performance',
        });
      }
    });

    // Documents
    documentHub.forEach(doc => {
      if (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some(t => t.toLowerCase().includes(q)) ||
        doc.category.toLowerCase().includes(q)
      ) {
        out.push({
          id: doc.id,
          category: 'Documents',
          title: doc.title,
          subtitle: `${doc.category} · v${doc.version}`,
          route: '/documentation',
        });
      }
    });

    return out.slice(0, 20);
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      navigateTo(results[activeIndex].route);
    }
  };

  const navigateTo = (route: string) => {
    navigate(route);
    onClose();
  };

  // Group results by category
  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach(r => {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    });
    return map;
  }, [results]);

  const allResults = Object.values(grouped).flat();

  const badgeColor = (badge?: string) => {
    if (!badge) return 'bg-gray-100 text-gray-600';
    const b = badge.toLowerCase();
    if (b.includes('escalated') || b.includes('high')) return 'bg-red-100 text-red-700';
    if (b.includes('pending') || b.includes('medium') || b.includes('review')) return 'bg-amber-100 text-amber-700';
    if (b.includes('approved') || b.includes('low') || b.includes('matched') || b.includes('resolved')) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E6EA] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E6EA]">
          <Search size={20} className="text-[#0069B4] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search POs, invoices, suppliers, documents..."
            className="flex-1 text-base text-[#1A1A2E] placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded font-mono"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[420px] overflow-y-auto">
          {query === '' && (
            <div className="flex flex-col items-center justify-center py-12 text-[#5A6478]">
              <Search size={28} className="mb-3 opacity-25" />
              <p className="text-sm font-medium">Search across your P2P data</p>
              <p className="text-xs text-gray-400 mt-1">POs · Invoices · Suppliers · Documents</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 font-mono">↑↓</kbd> navigate
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 font-mono">↵</kbd> open
                <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 font-mono">Esc</kbd> close
              </div>
            </div>
          )}

          {query !== '' && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-[#5A6478]">
              <Search size={28} className="mb-3 opacity-25" />
              <p className="text-sm font-medium">No results for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching by PO number, supplier name, or document title</p>
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => {
            const Icon = categoryIcons[category];
            return (
              <div key={category}>
                <div className="flex items-center gap-2 px-5 py-2 bg-gray-50/80 border-b border-[#E2E6EA]">
                  <Icon size={13} className="text-[#5A6478]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478]">
                    {category}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">({items.length})</span>
                </div>
                {items.map(result => {
                  const globalIdx = allResults.findIndex(r => r.id === result.id && r.category === result.category);
                  const isActive = globalIdx === activeIndex;
                  return (
                    <button
                      key={result.id}
                      className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors border-b border-[#E2E6EA]/60 last:border-0 ${
                        isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => navigateTo(result.route)}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A2E] truncate">{result.title}</p>
                        <p className="text-xs text-[#5A6478] truncate mt-0.5">{result.subtitle}</p>
                      </div>
                      {result.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeColor(result.badge)}`}>
                          {result.badge}
                        </span>
                      )}
                      {isActive && <ArrowRight size={14} className="text-[#0069B4] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-5 py-2.5 border-t border-[#E2E6EA] bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => navigateTo(categoryRoutes[results[activeIndex]?.category] || '/overview')}
              className="flex items-center gap-1 text-xs font-medium text-[#0069B4] hover:underline"
            >
              Go to page <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
