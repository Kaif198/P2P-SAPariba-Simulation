import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import ExecutiveOverview from './pages/ExecutiveOverview';
import POManagement from './pages/POManagement';
import InvoiceMatching from './pages/InvoiceMatching';
import SupplierPerformance from './pages/SupplierPerformance';
import ProcessImprovement from './pages/ProcessImprovement';
import ProcessDocumentation from './pages/ProcessDocumentation';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<ExecutiveOverview />} />
            <Route path="requisitions-orders" element={<POManagement />} />
            <Route path="invoice-matching" element={<InvoiceMatching />} />
            <Route path="supplier-performance" element={<SupplierPerformance />} />
            <Route path="process-improvements" element={<ProcessImprovement />} />
            <Route path="documentation" element={<ProcessDocumentation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
