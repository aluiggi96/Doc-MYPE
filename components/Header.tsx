import React from 'react';
import { MenuIcon } from './Icons';
import type { ViewType } from '../types';

interface HeaderProps {
    view: ViewType;
    toggleSidebar: () => void;
}

const viewTitles: Record<ViewType, string> = {
    dashboard: 'Dashboard',
    invoices: 'Facturas Electrónicas',
    receipts: 'Boletas de Venta',
    credit_notes: 'Notas de Crédito',
    debit_notes: 'Notas de Débito',
    dispatch_guides: 'Guías de Remisión',
    clients: 'Gestión de Clientes',
    products: 'Gestión de Productos',
    accounting: 'Contabilidad y Finanzas',
    sustainability: 'Reportes de Sostenibilidad',
    cash_flow: 'Flujo de Caja',
};

const Header: React.FC<HeaderProps> = ({ view, toggleSidebar }) => {
    return (
        <header className="bg-white shadow-md p-4 flex items-center sticky top-0 z-10">
            <button onClick={toggleSidebar} className="text-gray-600 hover:text-primary mr-4">
                <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{viewTitles[view] || 'Gestión Documentaria'}</h1>
        </header>
    );
};

export default Header;
