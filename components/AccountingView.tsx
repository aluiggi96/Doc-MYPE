import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AnyDocument, ViewType } from '../types';
import { generateFinancialInsights } from '../services/geminiService';
import { SparklesIcon, ArrowRightIcon } from './Icons';

interface AccountingViewProps {
  setView: (view: ViewType) => void;
}

const AccountingView: React.FC<AccountingViewProps> = ({ setView }) => {
  const [documents] = useLocalStorage<AnyDocument[]>('documents', []);
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Simplified calculations for demonstration purposes
  const totalSales = documents
    .filter(doc => doc.type === 'Factura Electrónica' || doc.type === 'Boleta de Venta Electrónica')
    .reduce((sum, doc) => sum + doc.subtotal, 0);

  const totalIGV = documents
    .filter(doc => doc.type === 'Factura Electrónica' || doc.type === 'Boleta de Venta Electrónica')
    .reduce((sum, doc) => sum + doc.igv, 0);

  // Mock data for other financial items
  const costOfGoodsSold = totalSales * 0.6;
  const operatingExpenses = totalSales * 0.2;
  const grossProfit = totalSales - costOfGoodsSold;
  const netIncome = grossProfit - operatingExpenses;
  const totalAssets = 25000 + totalSales * 0.5;
  const totalLiabilities = 10000 + totalSales * 0.1;
  const equity = totalAssets - totalLiabilities;

  const handleGetInsights = async () => {
    setIsLoading(true);
    setInsights('');
    const result = await generateFinancialInsights(documents);
    setInsights(result);
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Contabilidad y Finanzas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de Resultados (Simplificado)</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Ventas Totales</span> <span>{totalSales.toFixed(2)}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Costo de Ventas</span> <span>- {costOfGoodsSold.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold"><span>Utilidad Bruta</span> <span>{grossProfit.toFixed(2)}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Gastos Operativos</span> <span>- {operatingExpenses.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg text-green-600"><span>Utilidad Neta</span> <span>{netIncome.toFixed(2)}</span></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Balance General (Simplificado)</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Activos Totales</span> <span>{totalAssets.toFixed(2)}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Pasivos Totales</span> <span>- {totalLiabilities.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg text-blue-600"><span>Patrimonio Neto</span> <span>{equity.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

       <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Reportes Detallados</h2>
            <button 
                onClick={() => setView('cash_flow')}
                className="flex items-center text-primary font-semibold hover:underline"
            >
                <span>Ver Flujo de Caja</span>
                <ArrowRightIcon className="ml-2" />
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Análisis con IA de Gemini</h2>
           <button 
              onClick={handleGetInsights}
              disabled={isLoading}
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              <SparklesIcon />
              <span className="ml-2">{isLoading ? 'Generando...' : 'Obtener Insights'}</span>
            </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg min-h-[150px]">
          {isLoading && <p className="text-gray-600 animate-pulse">Analizando datos y generando recomendaciones...</p>}
          {insights && !isLoading && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{insights}</div>
          )}
          {!insights && !isLoading && <p className="text-gray-500">Haga clic en "Obtener Insights" para que la IA de Gemini analice sus datos financieros.</p>}
        </div>
      </div>
    </div>
  );
};

export default AccountingView;
