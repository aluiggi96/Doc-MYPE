
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AnyDocument, Product, ViewType } from '../types';
import { DocumentIcon, PlusIcon, UsersIcon, CubeIcon, ExclamationTriangleIcon } from './Icons';

interface DashboardProps {
  setView: (view: ViewType) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-l-4 ${color}`}>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
      {icon}
    </div>
  </div>
);

const QuickActionButton: React.FC<{label: string, icon: React.ReactNode, onClick: () => void}> = ({label, icon, onClick}) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 text-secondary">
    <div className="p-4 bg-blue-100 rounded-full mb-3">
      {icon}
    </div>
    <span className="font-semibold text-center">{label}</span>
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const [documents] = useLocalStorage<AnyDocument[]>('documents', []);
  const [products] = useLocalStorage<Product[]>('products', []);

  const totalSales = documents
    .filter(doc => doc.type === 'Factura Electrónica' || doc.type === 'Boleta de Venta Electrónica')
    .reduce((sum, doc) => sum + doc.total, 0);

  const lowStockItems = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Ventas Totales (PEN)" value={totalSales.toFixed(2)} icon={<DocumentIcon className="text-blue-500" />} color="border-blue-500" />
        <StatCard title="Facturas Emitidas" value={documents.filter(d => d.type === 'Factura Electrónica').length} icon={<UsersIcon className="text-green-500" />} color="border-green-500" />
        <StatCard title="Productos Bajos de Stock" value={lowStockItems} icon={<ExclamationTriangleIcon className="text-red-500" />} color="border-red-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton label="Nueva Factura" icon={<PlusIcon />} onClick={() => setView('invoices')} />
          <QuickActionButton label="Nueva Boleta" icon={<PlusIcon />} onClick={() => setView('receipts')} />
          <QuickActionButton label="Nuevo Cliente" icon={<UsersIcon />} onClick={() => setView('clients')} />
          <QuickActionButton label="Nuevo Producto" icon={<CubeIcon />} onClick={() => setView('products')} />
        </div>
      </div>

       <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Recientes</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">Número</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.slice(0, 5).map(doc => (
                        <tr key={doc.id} className="border-b">
                            <td className="p-3 font-medium">{doc.number}</td>
                            <td className="p-3">{doc.type}</td>
                            <td className="p-3">{doc.clientName}</td>
                            <td className="p-3">{new Date(doc.issueDate).toLocaleDateString()}</td>
                            <td className="p-3 text-right font-semibold">{doc.total.toFixed(2)}</td>
                        </tr>
                    ))}
                    {documents.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center p-6 text-gray-500">No hay documentos recientes.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

    </div>
  );
};

export default Dashboard;
