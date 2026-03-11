import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  ShoppingCart, 
  FileText, 
  Users, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react';

const navItems = [
  { name: 'Executive Overview', path: '/overview', icon: BarChart3 },
  { name: 'PO Management', path: '/requisitions-orders', icon: ShoppingCart },
  { name: 'Invoice Matching', path: '/invoice-matching', icon: FileText },
  { name: 'Supplier Performance', path: '/supplier-performance', icon: Users },
  { name: 'Process Improvements', path: '/process-improvements', icon: TrendingUp },
  { name: 'Documentation Hub', path: '/documentation', icon: BookOpen },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 h-screen bg-[#003B7A] text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">ALDI SÜD</h1>
        <p className="text-sm text-blue-200 mt-1 font-medium">P2P Process Intelligence</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                isActive 
                  ? 'bg-[#0069B4] text-white font-medium shadow-sm' 
                  : 'text-blue-100 hover:bg-[#003B7A]/80 hover:bg-opacity-50 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-[#0069B4]/30 rounded-lg text-xs text-blue-200">
          <p className="font-medium text-white mb-1">System Status: Go</p>
          <p>Ariba Sync: Active</p>
          <p>Last Error: None</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
