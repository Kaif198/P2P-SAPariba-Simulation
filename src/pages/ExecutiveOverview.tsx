import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, AlertCircle, ShoppingCart, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const cycleTimeData = [
  { category: 'IT Hardware', days: 12 },
  { category: 'Facilities', days: 14 },
  { category: 'Marketing', days: 22 },
  { category: 'Logistics', days: 10 },
  { category: 'Professional Services', days: 18 },
  { category: 'Packaging', days: 16 },
];

const invoiceVolumesData = [
  { month: 'Oct', AutoMatched: 3100, ManuallyReviewed: 850, Escalated: 90 },
  { month: 'Nov', AutoMatched: 3250, ManuallyReviewed: 820, Escalated: 95 },
  { month: 'Dec', AutoMatched: 3400, ManuallyReviewed: 900, Escalated: 105 },
  { month: 'Jan', AutoMatched: 3150, ManuallyReviewed: 880, Escalated: 110 },
  { month: 'Feb', AutoMatched: 3500, ManuallyReviewed: 910, Escalated: 115 },
  { month: 'Mar', AutoMatched: 3615, ManuallyReviewed: 965, Escalated: 120 },
];

const KPICard = ({ title, value, unit, description, trend, trendValue, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA] flex flex-col transition-smooth hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-50 rounded-lg text-[#0069B4]">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
        trend === 'up' && title !== 'Invoice Exception Rate' 
          ? 'text-green-700 bg-green-50' 
          : trend === 'down' && title === 'Invoice Exception Rate'
            ? 'text-green-700 bg-green-50'
            : trend === 'down' 
              ? 'text-red-700 bg-red-50'
              : 'text-amber-700 bg-amber-50' // for exception rate going up
      }`}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trendValue}%
      </div>
    </div>
    <h3 className="text-[#5A6478] text-sm font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold text-[#1A1A2E] mb-3">
      {value}<span className="text-lg text-[#5A6478] font-medium ml-1">{unit}</span>
    </div>
    <p className="text-xs text-[#5A6478] leading-relaxed mt-auto">
      {description}
    </p>
  </div>
);

const ExecutiveOverview: React.FC = () => {
  // activePOCount conceptually used in API, but using literal 4,821 to match design spec
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Purchase Orders Active" 
          value="4,821" 
          unit=""
          description="Orders currently in progress across all ALDI SÜD procurement categories."
          trend="up"
          trendValue="2.4"
          icon={ShoppingCart}
        />
        <KPICard 
          title="P2P Cycle Time" 
          value="15.4" 
          unit="days"
          description="How long it currently takes from a purchase request being raised to the invoice being paid. Industry benchmark is 14 days."
          trend="up"
          trendValue="0.8"
          icon={Clock}
        />
        <KPICard 
          title="Invoice Exception Rate" 
          value="22.5" 
          unit="%"
          description="Invoices that did not match automatically and needed a human to investigate. Lower is better."
          trend="up" // Rate went up, which is bad
          trendValue="1.2"
          icon={AlertCircle}
        />
        <KPICard 
          title="On-Time Delivery Rate" 
          value="94.8" 
          unit="%"
          description="How reliably suppliers are meeting their delivery commitments."
          trend="down"
          trendValue="0.5"
          icon={Truck}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Time Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-6">P2P Cycle Time by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EA" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#5A6478', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5A6478', fontSize: 12}} dx={-10} />
                <RechartsTooltip 
                  cursor={{fill: '#F8F9FB'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #E2E6EA', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}
                />
                <ReferenceLine y={14} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: '14d Target', fill: '#EF4444', fontSize: 12 }} />
                <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                  {cycleTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.days > 14 ? '#003B7A' : '#0069B4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-6 text-sm text-[#5A6478] leading-relaxed">
            Categories above the benchmark line are taking longer than expected to complete the full purchase-to-pay cycle. 
            <strong className="text-[#1A1A2E] font-medium"> Marketing and Professional Services </strong> are currently the furthest from target, suggesting approval workflows in these categories may need reviewing.
          </p>
        </div>

        {/* Invoice Volumes Stacked Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-6">Monthly Invoice Volume & Exceptions</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invoiceVolumesData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EA" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#5A6478', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5A6478', fontSize: 12}} dx={-10} />
                <RechartsTooltip 
                  cursor={{fill: '#F8F9FB'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #E2E6EA', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Bar dataKey="AutoMatched" name="Auto-Matched" stackId="a" fill="#0069B4" radius={[0, 0, 4, 4]} />
                <Bar dataKey="ManuallyReviewed" name="Manual Review" stackId="a" fill="#94A3B8" />
                <Bar dataKey="Escalated" name="Escalated" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-6 text-sm text-[#5A6478] leading-relaxed">
            The proportion of invoices requiring manual review has remained stable, but the volume of <strong className="text-[#EF4444] font-medium">escalated invoices</strong> rose slightly in the last two months. This typically indicates supplier data quality issues or contract terms that have not been updated in the system.
          </p>
        </div>
      </div>

      {/* Process Health Summary */}
      <h3 className="text-lg font-semibold text-[#1A1A2E] pt-2">Process Health Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/requisitions-orders" className="block text-left bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA] hover:border-[#0069B4] transition-smooth group cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            <h4 className="font-semibold text-[#1A1A2E] group-hover:text-[#0069B4] transition-colors">Requisition to PO</h4>
          </div>
          <p className="text-sm font-medium text-green-700 mb-2">Running within target</p>
          <p className="text-xs text-[#5A6478] leading-relaxed">
            Approval workflows and automatic PO dispatch are functioning normally and within the 48-hour SLA benchmark.
          </p>
        </Link>

        <Link to="/supplier-performance" className="block text-left bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA] hover:border-[#0069B4] transition-smooth group cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
            <h4 className="font-semibold text-[#1A1A2E] group-hover:text-[#0069B4] transition-colors">PO to Goods Receipt</h4>
          </div>
          <p className="text-sm font-medium text-amber-700 mb-2">Some delivery delays flagged</p>
          <p className="text-xs text-[#5A6478] leading-relaxed">
            On-time delivery rates have slightly softened in Marketing and Logistics, causing matching delays downstream.
          </p>
        </Link>

        <Link to="/invoice-matching" className="block text-left bg-white p-6 rounded-xl shadow-sm border border-[#E2E6EA] hover:border-[#0069B4] transition-smooth group cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
            <h4 className="font-semibold text-[#1A1A2E] group-hover:text-[#0069B4] transition-colors">Invoice to Payment</h4>
          </div>
          <p className="text-sm font-medium text-amber-700 mb-2">Exception rate elevated</p>
          <p className="text-xs text-[#5A6478] leading-relaxed">
            Increase in price variances and contract term mismatches is placing strain on the accounts payable manual review queue.
          </p>
        </Link>

      </div>
    </div>
  );
};

export default ExecutiveOverview;
