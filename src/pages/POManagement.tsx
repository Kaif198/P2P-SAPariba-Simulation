import React, { useState, useMemo, useCallback } from 'react';
import { poData } from '../data/poData';
import type { PurchaseOrder, POStatus } from '../data/types';
import { Filter, X, CheckCircle2, AlertCircle, Download, ArrowUpDown, ArrowUp, ArrowDown, Send, PhoneCall, ThumbsUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusColors: Record<POStatus, string> = {
  'Pending Approval': 'bg-amber-100 text-amber-800 border-amber-200',
  'Approved':         'bg-blue-100 text-blue-800 border-blue-200',
  'Sent to Supplier': 'bg-purple-100 text-purple-800 border-purple-200',
  'Goods Received':   'bg-teal-100 text-teal-800 border-teal-200',
  'Invoiced':         'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Closed':           'bg-gray-100 text-gray-800 border-gray-200',
};

const processSteps = [
  'Requisition Created',
  'Approved',
  'PO Issued',
  'Goods Received',
  'Invoice Received',
  'Payment Processed',
];

type SortKey = 'poNumber' | 'supplierName' | 'totalValue' | 'status' | 'creationDate' | 'daysOpen';
type SortDir = 'asc' | 'desc';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);

const POManagement: React.FC = () => {
  const { poStatuses, updatePOStatus, addToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus]   = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const getStatus = (po: PurchaseOrder): POStatus => poStatuses[po.id] ?? po.status;

  const categories = ['All', ...Array.from(new Set(poData.map(po => po.category)))];
  const statuses   = ['All', 'Pending Approval', 'Approved', 'Sent to Supplier', 'Goods Received', 'Invoiced', 'Closed'];
  const suppliers  = ['All', ...Array.from(new Set(poData.map(po => po.supplierName)))];

  const filteredData = useMemo(() => {
    let data = poData.filter(po => {
      const status = getStatus(po);
      if (selectedCategory !== 'All' && po.category !== selectedCategory) return false;
      if (selectedStatus   !== 'All' && status !== selectedStatus) return false;
      if (selectedSupplier !== 'All' && po.supplierName !== selectedSupplier) return false;
      return true;
    });

    data = [...data].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'poNumber':     cmp = a.poNumber.localeCompare(b.poNumber); break;
        case 'supplierName': cmp = a.supplierName.localeCompare(b.supplierName); break;
        case 'totalValue':   cmp = a.totalValue - b.totalValue; break;
        case 'status':       cmp = getStatus(a).localeCompare(getStatus(b)); break;
        case 'creationDate': cmp = a.creationDate.localeCompare(b.creationDate); break;
        case 'daysOpen':     cmp = a.daysOpen - b.daysOpen; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedStatus, selectedSupplier, sortKey, sortDir, poStatuses]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return <ArrowUpDown size={13} className="opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp size={13} className="text-[#0069B4]" /> : <ArrowDown size={13} className="text-[#0069B4]" />;
  };

  // Summary totals
  const totalSpend     = filteredData.reduce((s, po) => s + po.totalValue, 0);
  const pendingCount   = filteredData.filter(po => getStatus(po) === 'Pending Approval').length;
  const actionRequired = filteredData.filter(po => po.actionRequired).length;

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleApprove = useCallback((po: PurchaseOrder) => {
    updatePOStatus(po.id, 'Approved');
    if (selectedPO?.id === po.id) {
      setSelectedPO({ ...po, status: 'Approved' });
    }
    addToast({ type: 'success', message: `PO ${po.poNumber} approved`, detail: `${po.supplierName} has been notified and the PO dispatched.` });
  }, [updatePOStatus, addToast, selectedPO]);

  const handleSendToSupplier = useCallback((po: PurchaseOrder) => {
    updatePOStatus(po.id, 'Sent to Supplier');
    addToast({ type: 'info', message: `PO ${po.poNumber} sent to ${po.supplierName}`, detail: 'Transmitted via Ariba Supplier Network.' });
  }, [updatePOStatus, addToast]);

  const handleSendContact = useCallback(() => {
    if (!selectedPO || !contactMessage.trim()) return;
    addToast({ type: 'success', message: `Message sent to ${selectedPO.supplierName}`, detail: contactMessage.trim() });
    setContactMessage('');
    setShowContactModal(false);
  }, [selectedPO, contactMessage, addToast]);

  // ── Export CSV ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['PO Number', 'Supplier', 'Category', 'Total Value (EUR)', 'Status', 'Creation Date', 'Expected Delivery', 'Days Open'];
    const rows = filteredData.map(po => [
      po.poNumber, po.supplierName, po.category,
      po.totalValue.toFixed(2), getStatus(po),
      po.creationDate, po.expectedDelivery, po.daysOpen,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'po_export.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: 'Export complete', detail: `${filteredData.length} purchase orders exported to CSV.` });
  };

  const currentStatus = selectedPO ? getStatus(selectedPO) : null;

  return (
    <div className="relative animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col gap-4">

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
        <div className="bg-white rounded-xl border border-[#E2E6EA] px-5 py-3 flex items-center justify-between shadow-sm">
          <span className="text-sm text-[#5A6478] font-medium">Total Spend (filtered)</span>
          <span className="text-lg font-bold text-[#1A1A2E]">{formatCurrency(totalSpend)}</span>
        </div>
        <div className={`bg-white rounded-xl border px-5 py-3 flex items-center justify-between shadow-sm ${pendingCount > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-[#E2E6EA]'}`}>
          <span className="text-sm text-[#5A6478] font-medium">Pending Approval</span>
          <span className={`text-lg font-bold ${pendingCount > 0 ? 'text-amber-600' : 'text-[#1A1A2E]'}`}>{pendingCount}</span>
        </div>
        <div className={`bg-white rounded-xl border px-5 py-3 flex items-center justify-between shadow-sm ${actionRequired > 0 ? 'border-red-200 bg-red-50/30' : 'border-[#E2E6EA]'}`}>
          <span className="text-sm text-[#5A6478] font-medium">Action Required</span>
          <span className={`text-lg font-bold ${actionRequired > 0 ? 'text-red-600' : 'text-[#1A1A2E]'}`}>{actionRequired}</span>
        </div>
      </div>

      {/* Filters + Export */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E6EA] flex gap-3 items-center shrink-0 flex-wrap">
        <div className="flex items-center text-[#5A6478] mr-1">
          <Filter size={18} className="mr-2" />
          <span className="font-medium text-sm">Filters:</span>
        </div>

        <select
          className="bg-gray-50 border border-[#E2E6EA] text-sm rounded-lg px-3 py-2 text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#0069B4] cursor-pointer"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>

        <select
          className="bg-gray-50 border border-[#E2E6EA] text-sm rounded-lg px-3 py-2 text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#0069B4] cursor-pointer"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
        </select>

        <select
          className="bg-gray-50 border border-[#E2E6EA] text-sm rounded-lg px-3 py-2 text-[#1A1A2E] focus:outline-none focus:ring-1 focus:ring-[#0069B4] cursor-pointer max-w-xs"
          value={selectedSupplier}
          onChange={e => setSelectedSupplier(e.target.value)}
        >
          {suppliers.map(s => <option key={s} value={s}>{s === 'All' ? 'All Suppliers' : s}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-[#5A6478]">
            Showing <span className="font-semibold text-[#1A1A2E]">{filteredData.length}</span> of {poData.length} orders
          </span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0069B4] border border-[#0069B4] rounded-lg hover:bg-[#0069B4] hover:text-white transition-smooth"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E6EA] overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-[#5A6478] sticky top-0 z-10 border-b border-[#E2E6EA]">
              <tr>
                {(
                  [
                    ['poNumber',     'PO Number'],
                    ['supplierName', 'Supplier Name'],
                    [null,           'Category'],
                    ['totalValue',   'Total Value'],
                    ['status',       'Status'],
                    ['creationDate', 'Created'],
                    [null,           'Delivery'],
                    ['daysOpen',     'Days Open'],
                  ] as [SortKey | null, string][]
                ).map(([key, label]) => (
                  <th
                    key={label}
                    className={`px-6 py-4 font-medium border-b border-[#E2E6EA] ${key ? 'cursor-pointer select-none hover:text-[#1A1A2E]' : ''} ${label === 'Total Value' ? 'text-right' : ''} ${label === 'Days Open' ? 'text-center' : ''}`}
                    onClick={() => key && handleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {label}
                      {key && <SortIcon col={key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6EA]">
              {filteredData.map(po => {
                const status = getStatus(po);
                return (
                  <tr
                    key={po.id}
                    onClick={() => setSelectedPO(po)}
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedPO?.id === po.id ? 'bg-blue-50 border-l-4 border-l-[#0069B4]' : 'border-l-4 border-l-transparent'}`}
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-[#1A1A2E] text-xs">{po.poNumber}</td>
                    <td className="px-6 py-4 text-[#5A6478] max-w-[200px] truncate">{po.supplierName}</td>
                    <td className="px-6 py-4 text-[#5A6478]">{po.category}</td>
                    <td className="px-6 py-4 text-right font-semibold text-[#1A1A2E]">{formatCurrency(po.totalValue)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#5A6478]">{po.creationDate}</td>
                    <td className="px-6 py-4 text-[#5A6478]">{po.expectedDelivery}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${po.daysOpen > 30 ? 'bg-red-100 text-red-700' : po.daysOpen > 14 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-[#5A6478]'}`}>
                        {po.daysOpen}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#5A6478]">
                    No purchase orders found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Panel ────────────────────────────────────────────────────── */}
      <div className={`fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl border-l border-[#E2E6EA] z-50 transform transition-transform duration-300 ease-in-out ${selectedPO ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedPO && (
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-[#E2E6EA] flex justify-between items-center bg-[#F8F9FB]">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A2E] font-mono">{selectedPO.poNumber}</h2>
                <p className="text-sm text-[#5A6478] mt-1">{selectedPO.supplierName} · {selectedPO.category}</p>
              </div>
              <button
                onClick={() => setSelectedPO(null)}
                className="p-2 text-gray-400 hover:text-[#1A1A2E] hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* P2P Lifecycle */}
              <section>
                <h3 className="text-xs font-bold text-[#5A6478] uppercase tracking-widest mb-4">P2P Lifecycle Status</h3>
                <div className="relative">
                  <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200" />
                  <div
                    className="absolute top-3 left-3 h-0.5 bg-[#0069B4] transition-all duration-700"
                    style={{ width: `${(selectedPO.currentStepIndex / (processSteps.length - 1)) * 100}%` }}
                  />
                  <div className="flex justify-between">
                    {processSteps.map((step, idx) => {
                      const done = idx < selectedPO.currentStepIndex;
                      const cur  = idx === selectedPO.currentStepIndex;
                      return (
                        <div key={step} className="flex flex-col items-center w-20">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 mb-2 ${
                            done ? 'bg-[#0069B4] border-[#0069B4] text-white' :
                            cur  ? 'bg-white border-[#0069B4] text-[#0069B4] ring-4 ring-blue-100 animate-pulse' :
                                   'bg-white border-gray-300'
                          }`}>
                            {done && <CheckCircle2 size={14} />}
                            {cur  && <span className="w-2 h-2 rounded-full bg-[#0069B4]" />}
                          </div>
                          <span className={`text-[10px] text-center font-medium leading-tight ${
                            cur  ? 'text-[#0069B4]' :
                            done ? 'text-[#1A1A2E]' : 'text-gray-400'
                          }`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Action Required */}
              {selectedPO.actionRequired && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Action Required</h4>
                    <p className="text-sm text-amber-700 mt-1">{selectedPO.actionRequired}</p>
                  </div>
                </div>
              )}

              {/* Key Details */}
              <section>
                <h3 className="text-xs font-bold text-[#5A6478] uppercase tracking-widest mb-3">Order Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Creation Date', selectedPO.creationDate],
                    ['Expected Delivery', selectedPO.expectedDelivery],
                    ['Days Open', `${selectedPO.daysOpen} days`],
                    ['Current Status', currentStatus ?? selectedPO.status],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-gray-50 rounded-lg px-4 py-3 border border-[#E2E6EA]">
                      <p className="text-[10px] font-bold uppercase text-[#5A6478] tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-[#1A1A2E] mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Line Items */}
              <section>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-xs font-bold text-[#5A6478] uppercase tracking-widest">Line Items</h3>
                  <span className="text-base font-bold text-[#1A1A2E]">{formatCurrency(selectedPO.totalValue)}</span>
                </div>
                <div className="border border-[#E2E6EA] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-[#E2E6EA]">
                      <tr>
                        <th className="px-4 py-2.5 font-medium text-[#5A6478]">Description</th>
                        <th className="px-4 py-2.5 font-medium text-[#5A6478] text-right">Qty</th>
                        <th className="px-4 py-2.5 font-medium text-[#5A6478] text-right">Unit Price</th>
                        <th className="px-4 py-2.5 font-medium text-[#5A6478] text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E6EA]">
                      {selectedPO.lineItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-[#1A1A2E]">{item.description}</td>
                          <td className="px-4 py-3 text-[#5A6478] text-right">{item.quantity.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[#5A6478] text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-3 text-[#1A1A2E] font-semibold text-right">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Supplier Notes */}
              {selectedPO.supplierNotes && (
                <section>
                  <h3 className="text-xs font-bold text-[#5A6478] uppercase tracking-widest mb-2">Supplier Notes</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-[#5A6478] leading-relaxed">
                    {selectedPO.supplierNotes}
                  </div>
                </section>
              )}
            </div>

            {/* Panel Footer Actions */}
            <div className="p-4 border-t border-[#E2E6EA] bg-gray-50 flex gap-3 shrink-0 flex-wrap">
              {currentStatus === 'Pending Approval' && (
                <button
                  onClick={() => handleApprove(selectedPO)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <ThumbsUp size={16} /> Approve PO
                </button>
              )}
              {currentStatus === 'Approved' && (
                <button
                  onClick={() => handleSendToSupplier(selectedPO)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0069B4] rounded-lg hover:bg-[#005a9c] transition-colors shadow-sm"
                >
                  <Send size={16} /> Send to Supplier
                </button>
              )}
              <button
                onClick={() => setShowContactModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1A1A2E] bg-white border border-[#E2E6EA] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PhoneCall size={16} /> Contact Supplier
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#5A6478] bg-white border border-[#E2E6EA] rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                onClick={() => addToast({ type: 'info', message: 'Opening in Ariba…', detail: 'Ariba Procurement would open in a new tab.' })}
              >
                View in Ariba ↗
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {selectedPO && (
        <div
          className="fixed inset-0 bg-[#1A1A2E]/20 z-40 backdrop-blur-[1px]"
          onClick={() => setSelectedPO(null)}
        />
      )}

      {/* Contact Supplier Modal */}
      {showContactModal && selectedPO && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E6EA] w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Contact Supplier</h3>
            <p className="text-sm text-[#5A6478] mb-4">Send a message to <strong>{selectedPO.supplierName}</strong> regarding <strong>{selectedPO.poNumber}</strong>.</p>
            <textarea
              className="w-full border border-[#E2E6EA] rounded-lg p-3 text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0069B4] resize-none"
              rows={4}
              placeholder="Type your message here…"
              value={contactMessage}
              onChange={e => setContactMessage(e.target.value)}
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A6478] border border-[#E2E6EA] rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSendContact}
                disabled={!contactMessage.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#0069B4] rounded-lg hover:bg-[#005a9c] transition-colors disabled:opacity-40"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POManagement;
