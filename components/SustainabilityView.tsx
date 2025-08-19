
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SustainabilityData } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const SustainabilityView: React.FC = () => {
  const [data, setData] = useLocalStorage<SustainabilityData[]>('sustainabilityData', []);
  const [currentEntry, setCurrentEntry] = useState<Partial<SustainabilityData>>({
    month: new Date().toISOString().slice(0, 7)
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEntry.month) return;

    const entryToSave = {
        ...currentEntry,
        id: currentEntry.month,
        energyConsumption: Number(currentEntry.energyConsumption) || 0,
        paperUsage: Number(currentEntry.paperUsage) || 0,
        wasteGenerated: Number(currentEntry.wasteGenerated) || 0,
    }

    setData(prev => {
        const existing = prev.find(d => d.id === entryToSave.id);
        if (existing) {
            return prev.map(d => d.id === entryToSave.id ? entryToSave as SustainabilityData : d);
        }
        return [...prev, entryToSave as SustainabilityData];
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({...prev, [name]: value}));
  };

  const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reportes de Sostenibilidad</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Datos Ambientales</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mes (YYYY-MM)</label>
              <input type="month" name="month" value={currentEntry.month || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Consumo de Energía (kWh)</label>
              <input type="number" name="energyConsumption" value={currentEntry.energyConsumption || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Uso de Papel (resmas)</label>
              <input type="number" name="paperUsage" value={currentEntry.paperUsage || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Residuos Generados (kg)</label>
              <input type="number" name="wasteGenerated" value={currentEntry.wasteGenerated || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="submit" className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">Guardar Datos</button>
          </form>
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Impacto Ambiental Mensual</h2>
          {sortedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="energyConsumption" name="Energía (kWh)" fill="#3b82f6" />
                <Bar dataKey="paperUsage" name="Papel (resmas)" fill="#16a34a" />
                <Bar dataKey="wasteGenerated" name="Residuos (kg)" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No hay datos de sostenibilidad para mostrar. Registre datos para generar el reporte.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityView;
