import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { supplierData } from '../data/supplierData';
import type { SupplierPerformance as SupplierType } from '../data/types';
import {
  ArrowLeft, AlertTriangle, ShieldCheck, ShieldAlert,
  CheckCircle2, XCircle, AlertCircle, Flag, MessageSquare, Download, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const ScoreCell = ({ value, inverse = false }: { value: number; inverse?: boolean }) => {
  let color = 'text-[#1A1A2E]';
  if (!inverse) {
    if (value >= 95) color = 'text-green-600';
    else if (value >= 90) color = 'text-amber-600';
    else color = 'text-red-600';
  } else {
    if (value <= 5) color = 'text-green-600';
    else if (value <= 15) color = 'text-amber-600';
    else color = 'text-red-600';
  }
  return <span className={`font-bold ${color}`}>{value}{inverse ? 'd' : '%'}</span>;
};

const SupplierPerformance: React.FC = () => {
  const { addToast } = useApp();
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | null>(null);
  const [filterRisk, setFilterRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactNote, setContactNote] = useState('');
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  const filteredSuppliers = supplierData.filter(s =>
    filterRisk === 'All' ? true : s.riskRating === filterRisk
  );

  const handleFlag = (supplier: SupplierType) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(supplier.id)) {
        next.delete(supplier.id);
        addToast({ type: 'info', message: `${supplier.supplierName} unflagged` });
      } else {
        next.add(supplier.id);
        addToast({ type: 'warning', message: `${supplier.supplierName} flagged for review`, detail: 'A review action has been added to the procurement manager queue.' });
      }
      return next;
    });
  };

  const handleSendNote = () => {
    if (!selectedSupplier || !contactNote.trim()) return;
    addToast({ type: 'success', message: `Message sent to ${selectedSupplier.supplierName}`, detail: contactNote.trim() });
    setContactNote('');
    setShowContactModal(false);
  };

  const exportCSV = () => {
    const headers = ['Supplier', 'Category', 'Overall Score', 'On-Time Delivery', 'Invoice Accuracy', 'Avg Lead Time', 'Contract Compliance', 'Risk Rating'];
    const rows = filteredSuppliers.map(s => [
      s.supplierName, s.category, s.overallScore, s.onTimeDeliveryRate,
      s.invoiceAccuracyRate, s.averageLeadTimeDays, s.contractComplianceScore, s.riskRating,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'supplier_scorecard.csv'; a.click();
    addToast({ type: 'success', message: 'Scorecard exported', detail: `${filteredSuppliers.length} suppliers exported to CSV.` });
  };

  // ── Detail View ──────────────────────────────────────────────────────────
  if (selectedSupplier) {
    const isFlagged = flaggedIds.has(selectedSupplier.id);
    return (
      <div className="animate-in fade-in duration-500 pb-12">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedSupplier(null)}
            className="flex items-center gap-2 text-sm font-medium text-[#5A6478] hover:text-[#0069B4] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Scorecard
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleFlag(selectedSupplier)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                isFlagged
                  ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
                  : 'bg-white text-[#5A6478] border-[#E2E6EA] hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
              }`}
            >
              <Flag size={15} /> {isFlagged ? 'Flagged for Review' : 'Flag for Review'}
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0069B4] rounded-lg hover:bg-[#005a9c] transition-colors"
            >
              <MessageSquare size={15} /> Send Message
            </button>
          </div>
        </div>

        {/* Risk Header */}
        <div className={`p-6 rounded-xl border mb-6 flex items-start gap-4 ${
          selectedSupplier.riskRating === 'Low'    ? 'bg-green-50 border-green-200' :
          selectedSupplier.riskRating === 'Medium' ? 'bg-amber-50 border-amber-200' :
                                                     'bg-red-50 border-red-200'
        }`}>
          {selectedSupplier.riskRating === 'Low'    && <ShieldCheck className="text-green-600 shrink-0 mt-1" size={28} />}
          {selectedSupplier.riskRating === 'Medium' && <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={28} />}
          {selectedSupplier.riskRating === 'High'   && <ShieldAlert className="text-red-600 shrink-0 mt-1" size={28} />}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{selectedSupplier.supplierName}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedSupplier.riskRating === 'Low'    ? 'bg-green-200 text-green-800' :
                selectedSupplier.riskRating === 'Medium' ? 'bg-amber-200 text-amber-800' :
                                                           'bg-red-200 text-red-800'
              }`}>
                {selectedSupplier.riskRating} Risk
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#003B7A] text-white">
                Score: {selectedSupplier.overallScore}%
              </span>
              {isFlagged && (
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  <Flag size={11} /> Flagged
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${
              selectedSupplier.riskRating === 'Low'    ? 'text-green-800' :
              selectedSupplier.riskRating === 'Medium' ? 'text-amber-800' :
                                                         'text-red-800'
            }`}>
              {selectedSupplier.riskExplanation}
            </p>
          </div>
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'On-Time Delivery', value: `${selectedSupplier.onTimeDeliveryRate}%`, good: selectedSupplier.onTimeDeliveryRate >= 95 },
            { label: 'Invoice Accuracy', value: `${selectedSupplier.invoiceAccuracyRate}%`, good: selectedSupplier.invoiceAccuracyRate >= 90 },
            { label: 'Avg Lead Time', value: `${selectedSupplier.averageLeadTimeDays}d`, good: selectedSupplier.averageLeadTimeDays <= 10 },
            { label: 'Contract Compliance', value: `${selectedSupplier.contractComplianceScore}%`, good: selectedSupplier.contractComplianceScore >= 95 },
          ].map(kpi => (
            <div key={kpi.label} className={`bg-white rounded-xl p-4 border shadow-sm text-center ${kpi.good ? 'border-green-200' : 'border-amber-200'}`}>
              <p className={`text-2xl font-bold ${kpi.good ? 'text-green-600' : 'text-amber-600'}`}>{kpi.value}</p>
              <p className="text-xs text-[#5A6478] font-medium mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Trend Charts */}
        <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider mb-4">6-Month Performance Trend</h3>
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { title: 'On-Time Delivery (%)', key: 'onTimeDelivery', refLine: 95, color: '#003B7A', narrative: selectedSupplier.trendNarratives.delivery },
            { title: 'Invoice Accuracy (%)', key: 'invoiceAccuracy', refLine: 90, color: '#0069B4', narrative: selectedSupplier.trendNarratives.accuracy },
            { title: 'Average Lead Time (Days)', key: 'leadTime', refLine: undefined, color: '#94A3B8', narrative: selectedSupplier.trendNarratives.leadTime },
          ].map(chart => (
            <div key={chart.title} className="bg-white p-5 rounded-xl shadow-sm border border-[#E2E6EA] flex flex-col">
              <h4 className="font-semibold text-[#1A1A2E] text-sm mb-4">{chart.title}</h4>
              <div className="h-36 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedSupplier.performanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EA" />
                    <XAxis dataKey="month" tick={{ fill: '#5A6478', fontSize: 11 }} axisLine={false} tickLine={false} dy={5} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    {chart.refLine && <ReferenceLine y={chart.refLine} stroke="#10B981" strokeDasharray="3 3" />}
                    <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2.5} dot={{ r: 3.5, fill: chart.color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-[#5A6478] leading-relaxed mt-auto">{chart.narrative}</p>
            </div>
          ))}
        </div>

        {/* Contract + Issues */}
        <div className="grid grid-cols-2 gap-5">
          <section className="bg-white rounded-xl shadow-sm border border-[#E2E6EA] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E6EA] bg-gray-50/60">
              <h3 className="font-bold text-sm text-[#1A1A2E]">Contract Compliance Status</h3>
            </div>
            <ul className="divide-y divide-[#E2E6EA]">
              {selectedSupplier.contractTerms.map((term, i) => (
                <li key={i} className="px-5 py-4 flex items-center justify-between">
                  <span className="text-sm text-[#1A1A2E] font-medium">{term.term}</span>
                  {term.isMeeting ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 size={13} /> Met
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                      <XCircle size={13} /> Breached
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-[#E2E6EA] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#E2E6EA] bg-gray-50/60">
              <h3 className="font-bold text-sm text-[#1A1A2E]">Open Issues & Disputes</h3>
            </div>
            {selectedSupplier.openIssues.length > 0 ? (
              <ul className="divide-y divide-[#E2E6EA]">
                {selectedSupplier.openIssues.map(issue => (
                  <li key={issue.id} className="p-5">
                    <div className="flex items-start justify-between mb-1.5">
                      <h4 className="text-sm font-semibold text-[#1A1A2E] pr-4">{issue.description}</h4>
                      <span className="shrink-0 text-xs font-semibold text-[#5A6478] bg-gray-100 px-2.5 py-1 rounded-full">{issue.status}</span>
                    </div>
                    <p className="text-xs text-[#5A6478] flex items-center gap-1">
                      <AlertCircle size={11} /> Opened {issue.dateOpened}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#5A6478]">
                <CheckCircle2 size={28} className="text-green-500 mb-3 opacity-40" />
                <p className="text-sm text-center">No open issues or disputes.</p>
              </div>
            )}
          </section>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E6EA] w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Message Supplier</h3>
              <p className="text-sm text-[#5A6478] mb-4">Send a message to <strong>{selectedSupplier.supplierName}</strong>.</p>
              <textarea
                className="w-full border border-[#E2E6EA] rounded-lg p-3 text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0069B4] resize-none"
                rows={4}
                placeholder="Type your message here…"
                value={contactNote}
                onChange={e => setContactNote(e.target.value)}
              />
              <div className="flex gap-3 mt-4 justify-end">
                <button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A6478] border border-[#E2E6EA] rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleSendNote}
                  disabled={!contactNote.trim()}
                  className="px-4 py-2 text-sm font-bold text-white bg-[#0069B4] rounded-lg hover:bg-[#005a9c] transition-colors disabled:opacity-40"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Scorecard Table ───────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-4">

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Risk Suppliers',   value: supplierData.filter(s => s.riskRating === 'High').length,   color: 'text-red-600',   border: 'border-red-200 bg-red-50/30' },
          { label: 'Medium Risk Suppliers', value: supplierData.filter(s => s.riskRating === 'Medium').length, color: 'text-amber-600', border: 'border-amber-200 bg-amber-50/30' },
          { label: 'Low Risk Suppliers',    value: supplierData.filter(s => s.riskRating === 'Low').length,    color: 'text-green-600', border: 'border-green-200 bg-green-50/30' },
        ].map(item => (
          <div key={item.label} className={`bg-white rounded-xl border px-5 py-3 flex items-center justify-between shadow-sm ${item.border}`}>
            <span className="text-sm text-[#5A6478] font-medium">{item.label}</span>
            <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Filters + Export */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E6EA] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E6EA] bg-gray-50/60 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1A1A2E]">Supplier Performance Scorecard</h2>
            <p className="text-xs text-[#5A6478] mt-0.5">Click any row to view full performance profile.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#5A6478]" />
              {(['All', 'Low', 'Medium', 'High'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                    filterRisk === r
                      ? r === 'High'   ? 'bg-red-600 text-white border-red-600' :
                        r === 'Medium' ? 'bg-amber-500 text-white border-amber-500' :
                        r === 'Low'    ? 'bg-green-600 text-white border-green-600' :
                                        'bg-[#003B7A] text-white border-[#003B7A]'
                      : 'bg-white text-[#5A6478] border-[#E2E6EA] hover:bg-gray-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0069B4] border border-[#0069B4] rounded-lg hover:bg-[#0069B4] hover:text-white transition-smooth"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-[#5A6478] border-b border-[#E2E6EA]">
              <tr>
                <th className="px-5 py-4 font-medium">Supplier Name</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium text-center">Overall Score</th>
                <th className="px-5 py-4 font-medium text-center">On-Time Delivery</th>
                <th className="px-5 py-4 font-medium text-center">Invoice Accuracy</th>
                <th className="px-5 py-4 font-medium text-center">Avg Lead Time</th>
                <th className="px-5 py-4 font-medium text-center">Contract Compliance</th>
                <th className="px-5 py-4 font-medium text-center">Risk</th>
                <th className="px-5 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6EA]">
              {filteredSuppliers.map(supplier => (
                <tr
                  key={supplier.id}
                  className="hover:bg-blue-50 transition-colors group"
                >
                  <td
                    className="px-5 py-4 font-semibold text-[#0069B4] cursor-pointer hover:underline"
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    {supplier.supplierName}
                    {flaggedIds.has(supplier.id) && <Flag size={12} className="inline ml-1.5 text-amber-500" />}
                  </td>
                  <td className="px-5 py-4 text-[#5A6478]" onClick={() => setSelectedSupplier(supplier)}>{supplier.category}</td>
                  <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                    <ScoreCell value={supplier.overallScore} />
                  </td>
                  <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                    <ScoreCell value={supplier.onTimeDeliveryRate} />
                  </td>
                  <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                    <ScoreCell value={supplier.invoiceAccuracyRate} />
                  </td>
                  <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                    <span className="font-bold text-[#1A1A2E]">{supplier.averageLeadTimeDays}d</span>
                  </td>
                  <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                    <ScoreCell value={supplier.contractComplianceScore} />
                  </td>
                  <td className="px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      supplier.riskRating === 'Low'    ? 'bg-green-100 text-green-700' :
                      supplier.riskRating === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                         'bg-red-100 text-red-700'
                    }`}>
                      {supplier.riskRating}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleFlag(supplier)}
                      title={flaggedIds.has(supplier.id) ? 'Unflag supplier' : 'Flag for review'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        flaggedIds.has(supplier.id)
                          ? 'text-amber-600 bg-amber-100'
                          : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      <Flag size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierPerformance;
