import React, { useState, useMemo } from 'react';
import { invoiceExceptions, invoiceStats } from '../data/invoiceData';
import type { InvoiceException, InvoiceStatus } from '../data/types';
import { AlertTriangle, CheckCircle, ChevronRight, FileText, X, Download, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

const mismatchColors: Record<string, string> = {
  'Price Variance':        'bg-red-100 text-red-800 border-red-200',
  'Quantity Mismatch':     'bg-orange-100 text-orange-800 border-orange-200',
  'Duplicate Invoice':     'bg-purple-100 text-purple-800 border-purple-200',
  'Missing Goods Receipt': 'bg-amber-100 text-amber-800 border-amber-200',
  'Contract Terms Mismatch': 'bg-blue-100 text-blue-800 border-blue-200',
};

const statusBadge: Record<InvoiceStatus, string> = {
  'Auto-Matched': 'bg-green-100 text-green-700 border-green-200',
  'Under Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'Escalated':    'bg-red-100 text-red-700 border-red-200',
  'Resolved':     'bg-gray-100 text-gray-600 border-gray-200',
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);

const InvoiceMatching: React.FC = () => {
  const { invoiceStatuses, updateInvoiceStatus, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'All Invoices' | 'Exceptions Only' | 'Resolved'>('Exceptions Only');
  const [selectedException, setSelectedException] = useState<InvoiceException | null>(null);
  const [filterReason, setFilterReason] = useState('All');
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const getStatus = (inv: InvoiceException): InvoiceStatus =>
    invoiceStatuses[inv.id] ?? inv.status;

  const reasons = ['All', ...Array.from(new Set(invoiceExceptions.map(e => e.mismatchReason)))];

  const exceptions = useMemo(() => {
    return invoiceExceptions.filter(inv => {
      const status = getStatus(inv);
      if (activeTab === 'Exceptions Only' && status !== 'Under Review' && status !== 'Escalated') return false;
      if (activeTab === 'Resolved' && status !== 'Resolved') return false;
      if (filterReason !== 'All' && inv.mismatchReason !== filterReason) return false;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filterReason, invoiceStatuses]);

  // Dynamic stats (reflect any in-session status changes)
  const liveStats = useMemo(() => {
    const allStatuses = invoiceExceptions.map(inv => getStatus(inv));
    return {
      total: invoiceStats.totalInvoicesThisPeriod,
      autoMatched: invoiceStats.autoMatched,
      underReview: allStatuses.filter(s => s === 'Under Review').length,
      escalated:   allStatuses.filter(s => s === 'Escalated').length,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceStatuses]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleReject = () => {
    if (!selectedException) return;
    updateInvoiceStatus(selectedException.id, 'Resolved');
    addToast({ type: 'error', message: `Invoice ${selectedException.invoiceNumber} rejected`, detail: 'Supplier will be notified. A rejection notice has been queued.' });
    setShowRejectConfirm(false);
    setSelectedException(null);
  };

  const handleRouteToManager = () => {
    if (!selectedException) return;
    updateInvoiceStatus(selectedException.id, 'Escalated');
    addToast({ type: 'warning', message: 'Routed to Category Manager', detail: `${selectedException.invoiceNumber} escalated to the procurement manager for review.` });
    setSelectedException(null);
  };

  const handleRequestCreditNote = () => {
    if (!selectedException) return;
    updateInvoiceStatus(selectedException.id, 'Resolved');
    addToast({ type: 'success', message: 'Credit note requested', detail: `Credit note request sent to ${selectedException.supplierName} for ${formatCurrency(selectedException.varianceAmount)}.` });
    setSelectedException(null);
  };

  const handleMarkResolved = () => {
    if (!selectedException) return;
    updateInvoiceStatus(selectedException.id, 'Resolved');
    addToast({ type: 'success', message: `Invoice ${selectedException.invoiceNumber} resolved`, detail: 'Marked as resolved and cleared from the exceptions queue.' });
    setSelectedException(null);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['Invoice Number', 'Supplier', 'PO Reference', 'Invoiced Amount', 'PO Amount', 'Variance', 'Mismatch Reason', 'Status', 'Date Flagged'];
    const rows = exceptions.map(inv => [
      inv.invoiceNumber, inv.supplierName, inv.poReference,
      inv.invoicedAmount.toFixed(2), inv.poAmount.toFixed(2),
      inv.varianceAmount.toFixed(2), inv.mismatchReason,
      getStatus(inv), inv.dateFlagged,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'invoice_exceptions.csv'; a.click();
    addToast({ type: 'success', message: 'Export complete', detail: `${exceptions.length} invoice records exported.` });
  };

  const currentExcStatus = selectedException ? getStatus(selectedException) : null;

  return (
    <div className="relative animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col gap-4">

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E6EA] flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#1A1A2E]">{liveStats.total.toLocaleString()}</span>
          <span className="text-xs font-semibold text-[#5A6478] mt-1 text-center uppercase tracking-wide">Total Invoices<br/>This Period</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 bg-green-50/30 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-green-600">{liveStats.autoMatched.toLocaleString()}</span>
          <span className="text-xs font-semibold text-green-700 mt-1 text-center uppercase tracking-wide">Auto-Matched</span>
          <span className="text-xs text-green-600 mt-0.5">{((liveStats.autoMatched / liveStats.total) * 100).toFixed(1)}% rate</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 bg-amber-50/30 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-amber-600">{liveStats.underReview}</span>
          <span className="text-xs font-semibold text-amber-700 mt-1 text-center uppercase tracking-wide">Under Review</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 bg-red-50/30 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-red-600">{liveStats.escalated}</span>
          <span className="text-xs font-semibold text-red-700 mt-1 text-center uppercase tracking-wide">Escalated</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E6EA] flex-1 flex flex-col overflow-hidden">

        {/* Tabs + Filter row */}
        <div className="flex items-center border-b border-[#E2E6EA] px-4 pt-2 gap-2">
          <div className="flex flex-1">
            {(['All Invoices', 'Exceptions Only', 'Resolved'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#0069B4] text-[#0069B4]'
                    : 'border-transparent text-[#5A6478] hover:text-[#1A1A2E] hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Reason filter */}
          <div className="flex items-center gap-2 pb-2">
            <Filter size={14} className="text-[#5A6478]" />
            <select
              value={filterReason}
              onChange={e => setFilterReason(e.target.value)}
              className="text-xs border border-[#E2E6EA] rounded-lg px-2 py-1.5 text-[#1A1A2E] bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#0069B4]"
            >
              {reasons.map(r => <option key={r} value={r}>{r === 'All' ? 'All Reasons' : r}</option>)}
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0069B4] border border-[#0069B4] rounded-lg hover:bg-[#0069B4] hover:text-white transition-smooth"
            >
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-[#5A6478] sticky top-0 z-10 border-b border-[#E2E6EA]">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice Number</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">PO Reference</th>
                <th className="px-6 py-4 font-medium text-right">Inv. Amount</th>
                <th className="px-6 py-4 font-medium text-right">Variance</th>
                <th className="px-6 py-4 font-medium">Mismatch Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6EA]">
              {exceptions.map(exc => {
                const status = getStatus(exc);
                return (
                  <tr
                    key={exc.id}
                    className={`hover:bg-blue-50 transition-colors ${selectedException?.id === exc.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-xs text-[#1A1A2E]">
                      <div className="flex items-center gap-2">
                        <FileText size={15} className="text-[#5A6478]" />
                        {exc.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5A6478] max-w-[180px] truncate">{exc.supplierName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-[#0069B4]">{exc.poReference}</td>
                    <td className="px-6 py-4 text-right font-semibold text-[#1A1A2E]">{formatCurrency(exc.invoicedAmount)}</td>
                    <td className="px-6 py-4 text-right">
                      {exc.varianceAmount > 0 ? (
                        <span className="text-red-600 font-semibold">+{formatCurrency(exc.varianceAmount)} ({exc.variancePercentage}%)</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${mismatchColors[exc.mismatchReason] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {exc.mismatchReason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[status]}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedException(exc)}
                        disabled={status === 'Resolved'}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E2E6EA] text-[#0069B4] hover:bg-[#003B7A] hover:text-white hover:border-[#003B7A] rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {status === 'Resolved' ? 'Resolved' : 'Resolve'} <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {exceptions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-[#5A6478]">
                    <CheckCircle className="mx-auto mb-3 text-green-400 opacity-50" size={28} />
                    <p className="font-medium">No invoices for this criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Resolution Panel ─────────────────────────────────────────────── */}
      <div className={`fixed top-0 right-0 h-full w-[820px] bg-white shadow-2xl border-l border-[#E2E6EA] z-50 transform transition-transform duration-300 ${selectedException ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedException && (
          <div className="h-full flex flex-col">

            {/* Header */}
            <div className="px-6 py-5 border-b border-[#E2E6EA] flex justify-between items-center bg-[#F8F9FB]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#1A1A2E]">Exception Resolution</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge[currentExcStatus!]}`}>
                    {currentExcStatus}
                  </span>
                </div>
                <p className="text-sm text-[#5A6478] mt-1 font-mono">
                  {selectedException.invoiceNumber} · {selectedException.supplierName}
                </p>
              </div>
              <button onClick={() => setSelectedException(null)} className="p-2 text-gray-400 hover:text-[#1A1A2E] hover:bg-gray-100 rounded-full transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Variance Highlight */}
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-600 shrink-0" size={22} />
                  <div>
                    <h3 className="text-red-800 font-bold">{selectedException.mismatchReason}</h3>
                    <p className="text-red-700 text-sm font-mono">Ref: {selectedException.poReference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-800 font-bold text-xl">
                    {selectedException.varianceAmount > 0
                      ? `+${formatCurrency(selectedException.varianceAmount)} Variance`
                      : 'Terms / Qty Conflict'}
                  </p>
                  <p className="text-red-700 text-sm">Flagged on {selectedException.dateFlagged}</p>
                </div>
              </div>

              {/* 3-Way Match */}
              <section>
                <h3 className="text-xs font-bold text-[#5A6478] uppercase tracking-widest mb-4">3-Way Match Comparison</h3>
                <div className="grid grid-cols-2 gap-4">

                  {/* PO Side */}
                  <div className="border border-[#E2E6EA] rounded-xl overflow-hidden">
                    <div className="bg-[#F8F9FB] px-4 py-3 border-b border-[#E2E6EA] flex justify-between items-center">
                      <span className="font-bold text-[#1A1A2E] text-sm">Approved PO</span>
                      <button
                        onClick={() => addToast({ type: 'info', message: 'Opening original PO…', detail: 'The PO document would open in Ariba.' })}
                        className="text-[#0069B4] text-xs font-semibold hover:underline"
                      >
                        View Original ↗
                      </button>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-[#5A6478]">
                        <tr>
                          <th className="px-4 py-2 font-medium">Item</th>
                          <th className="px-2 py-2 font-medium text-right">Qty</th>
                          <th className="px-4 py-2 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E6EA]">
                        {selectedException.poLineItems.map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-[#1A1A2E] text-xs truncate max-w-[140px]">{item.description}</td>
                            <td className="px-2 py-3 text-[#5A6478] text-right">{item.quantity.toLocaleString()}</td>
                            <td className="px-4 py-3 text-[#1A1A2E] font-semibold text-right">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t border-[#E2E6EA]">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-right font-bold text-xs text-[#5A6478]">PO Total:</td>
                          <td className="px-4 py-3 text-right font-bold text-[#1A1A2E]">{formatCurrency(selectedException.poAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Invoice Side */}
                  <div className="border border-red-200 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.08)]">
                    <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex justify-between items-center">
                      <span className="font-bold text-red-800 text-sm">Submitted Invoice</span>
                      <button
                        onClick={() => addToast({ type: 'info', message: 'Loading invoice PDF…', detail: 'The scanned invoice PDF would open in a viewer.' })}
                        className="text-red-600 text-xs font-semibold hover:underline"
                      >
                        View PDF ↗
                      </button>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white text-[#5A6478]">
                        <tr>
                          <th className="px-4 py-2 font-medium">Item</th>
                          <th className="px-2 py-2 font-medium text-right">Qty</th>
                          <th className="px-4 py-2 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-100">
                        {selectedException.invoiceLineItems.map((item, idx) => {
                          const po = selectedException.poLineItems[idx];
                          const hasPriceVar = po && item.unitPrice !== po.unitPrice;
                          const hasQtyVar   = po && item.quantity   !== po.quantity;
                          return (
                            <tr key={item.id} className={(hasPriceVar || hasQtyVar) ? 'bg-red-50/50' : ''}>
                              <td className="px-4 py-3 text-[#1A1A2E] text-xs truncate max-w-[140px]">{item.description}</td>
                              <td className={`px-2 py-3 text-right text-sm ${hasQtyVar ? 'text-red-600 font-bold' : 'text-[#5A6478]'}`}>
                                {item.quantity.toLocaleString()}
                                {hasQtyVar && po && <span className="block text-[10px] text-red-400">PO: {po.quantity.toLocaleString()}</span>}
                              </td>
                              <td className={`px-4 py-3 text-right font-semibold ${hasPriceVar || hasQtyVar ? 'text-red-600' : 'text-[#1A1A2E]'}`}>
                                {formatCurrency(item.total)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-red-50 border-t border-red-200">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-right font-bold text-xs text-red-700">Invoice Total:</td>
                          <td className="px-4 py-3 text-right font-bold text-red-700">{formatCurrency(selectedException.invoicedAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </section>

              {/* Suggested Resolution */}
              <section>
                <div className="bg-[#003B7A] rounded-xl overflow-hidden shadow-md">
                  <div className="px-5 py-3 bg-[#002f62] flex items-center gap-2 border-b border-[#001f42]">
                    <CheckCircle className="text-blue-300" size={17} />
                    <h3 className="font-bold text-white text-sm">Suggested Resolution</h3>
                  </div>
                  <div className="p-5 text-blue-50 leading-relaxed text-sm">
                    {selectedException.recommendedResolution}
                  </div>
                </div>
              </section>

            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-[#E2E6EA] bg-white flex gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => setShowRejectConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Reject Invoice
              </button>
              <button
                onClick={handleRouteToManager}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] bg-white border border-[#E2E6EA] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Route to Category Manager
              </button>
              {selectedException.varianceAmount > 0 && (
                <button
                  onClick={handleRequestCreditNote}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0069B4] rounded-lg hover:bg-[#005a9c] transition-colors shadow-sm"
                >
                  Request Credit Note
                </button>
              )}
              {selectedException.varianceAmount === 0 && (
                <button
                  onClick={handleMarkResolved}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {selectedException && (
        <div
          className="fixed inset-0 bg-[#1A1A2E]/20 z-40 backdrop-blur-[1px]"
          onClick={() => setSelectedException(null)}
        />
      )}

      {/* Reject Confirm Modal */}
      {showRejectConfirm && selectedException && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1A2E]/50 backdrop-blur-sm" onClick={() => setShowRejectConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Reject Invoice?</h3>
            <p className="text-sm text-[#5A6478] mb-6">
              This will reject <strong>{selectedException.invoiceNumber}</strong> from <strong>{selectedException.supplierName}</strong> and notify them of the rejection reason. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-[#5A6478] border border-[#E2E6EA] rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceMatching;
