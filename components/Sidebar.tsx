import React from 'react';
import { COMPANY_NAME, SUPPORT_PHONE } from '../constants';
import type { ViewType } from '../types';
import { DocumentIcon, HomeIcon, UsersIcon, CubeIcon, ChartBarIcon, SparklesIcon, PhoneIcon, CashIcon } from './Icons';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, toggleSidebar }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'invoices', label: 'Facturas', icon: <DocumentIcon /> },
    { id: 'receipts', label: 'Boletas', icon: <DocumentIcon /> },
    { id: 'credit_notes', label: 'Notas de Crédito', icon: <DocumentIcon /> },
    { id: 'debit_notes', label: 'Notas de Débito', icon: <DocumentIcon /> },
    { id: 'dispatch_guides', label: 'Guías de Remisión', icon: <DocumentIcon /> },
    { id: 'clients', label: 'Clientes', icon: <UsersIcon /> },
    { id: 'products', label: 'Productos', icon: <CubeIcon /> },
    { id: 'accounting', label: 'Contabilidad', icon: <ChartBarIcon /> },
    { id: 'cash_flow', label: 'Flujo de Caja', icon: <CashIcon /> },
    { id: 'sustainability', label: 'Sostenibilidad', icon: <SparklesIcon /> },
  ];

  const handleLinkClick = (view: ViewType) => {
    setView(view);
    if (isOpen) {
        toggleSidebar();
    }
  }

  const NavLink: React.FC<{item: {id: ViewType, label: string, icon: React.ReactNode}}> = ({ item }) => (
    <li>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleLinkClick(item.id); }}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
          currentView === item.id 
            ? 'bg-secondary text-white' 
            : 'text-gray-200 hover:bg-secondary/80 hover:text-white'
        }`}
      >
        <span className="w-6 h-6 mr-3">{item.icon}</span>
        {item.label}
      </a>
    </li>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-primary text-white flex flex-col p-4 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-2xl font-bold mb-8 text-center border-b border-gray-500 pb-4">
          {COMPANY_NAME}
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {navItems.map(item => <NavLink key={item.id} item={item as {id: ViewType, label: string, icon: React.ReactNode}} />)}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-500">
          <p className="text-sm text-gray-300 text-center">Soporte Técnico 24/7</p>
          <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="flex items-center justify-center p-2 mt-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
            <PhoneIcon />
            <span className="ml-2 font-semibold">{SUPPORT_PHONE}</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
