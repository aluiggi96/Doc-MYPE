import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AnyDocument } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CashIcon } from './Icons';

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

const CashFlowView: React.FC = () => {
  const [documents] = useLocalStorage<AnyDocument[]>('documents', []);

  // Group documents by month (YYYY-MM)
  const monthlyData = documents.reduce((acc, doc) => {
    if (doc.type === 'Factura Electrónica' || doc.type === 'Boleta de Venta Electrónica') {
      const month = doc.issueDate.slice(0, 7);
      if (!acc[month]) {
        acc[month] = { month, inflows: 0, outflows: 0 };
      }
      acc[month].inflows += doc.total;
    }
    return acc;
  }, {} as Record<string, { month: string; inflows: number; outflows: number }>);

  // Add mock outflows for demonstration
  Object.values(monthlyData).forEach(data => {
    data.outflows = data.inflows * (Math.random() * 0.2 + 0.6); // Mock outflows as 60-80% of inflows
  });

  const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  const totalInflows = chartData.reduce((sum, data) => sum + data.inflows, 0);
  const totalOutflows = chartData.reduce((sum, data) => sum + data.outflows, 0);
  const netCashFlow = totalInflows - totalOutflows;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Flujo de Caja</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Ingresos" value={`S/ ${totalInflows.toFixed(2)}`} icon={<CashIcon className="text-green-500" />} color="border-green-500" />
        <StatCard title="Total Egresos (Estimado)" value={`S/ ${totalOutflows.toFixed(2)}`} icon={<CashIcon className="text-red-500" />} color="border-red-500" />
        <StatCard title="Flujo de Caja Neto" value={`S/ ${netCashFlow.toFixed(2)}`} icon={<CashIcon className={netCashFlow >= 0 ? 'text-blue-500' : 'text-orange-500'} />} color={netCashFlow >= 0 ? 'border-blue-500' : 'border-orange-500'} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Flujo de Caja Mensual</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `S/ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="inflows" name="Ingresos" fill="#16a34a" />
              <Bar dataKey="outflows" name="Egresos" fill="#d32f2f" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <p className="text-gray-500">No hay suficientes datos de ventas para mostrar el flujo de caja.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashFlowView;
