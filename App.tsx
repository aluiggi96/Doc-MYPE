import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocumentManager from './components/DocumentManager';
import ClientManager from './components/ClientManager';
import ProductManager from './components/ProductManager';
import AccountingView from './components/AccountingView';
import SustainabilityView from './components/SustainabilityView';
import CashFlowView from './components/CashFlowView';
import { DocumentType } from './types';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={setCurrentView} />;
      case 'invoices':
        return <DocumentManager documentType={DocumentType.FACTURA} />;
      case 'receipts':
        return <DocumentManager documentType={DocumentType.BOLETA} />;
      case 'credit_notes':
        return <DocumentManager documentType={DocumentType.NOTA_CREDITO} />;
      case 'debit_notes':
        return <DocumentManager documentType={DocumentType.NOTA_DEBITO} />;
      case 'dispatch_guides':
        return <DocumentManager documentType={DocumentType.GUIA_REMISION} />;
      case 'clients':
        return <ClientManager />;
      case 'products':
        return <ProductManager />;
      case 'accounting':
        return <AccountingView setView={setCurrentView} />;
      case 'sustainability':
        return <SustainabilityView />;
      case 'cash_flow':
        return <CashFlowView />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans md:flex">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header view={currentView} toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </div>
        <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} EcoConta MYPE. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default App;