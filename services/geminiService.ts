
import { GoogleGenAI } from "@google/genai";
import type { AnyDocument } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFinancialInsights = async (documents: AnyDocument[]): Promise<string> => {
  if (!API_KEY) {
    return "La clave API de Gemini no está configurada. No se pueden generar insights.";
  }
  
  const salesData = documents
    .filter(doc => doc.type === 'Factura Electrónica' || doc.type === 'Boleta de Venta Electrónica')
    .map(doc => ({
      date: doc.issueDate,
      total: doc.total,
      items: doc.items.length
    }));

  if (salesData.length === 0) {
    return "No hay suficientes datos de ventas para generar un análisis.";
  }

  const prompt = `
    Eres un asesor financiero experto para pequeñas y medianas empresas en Perú.
    Analiza los siguientes datos de ventas (en formato JSON) y proporciona un resumen conciso con insights y recomendaciones clave.
    Enfócate en:
    1.  Rendimiento general de ventas.
    2.  Posibles tendencias (ej. aumento/disminución de ventas).
    3.  Recomendaciones prácticas y accionables para mejorar el negocio.
    Sé breve, claro y directo. El análisis debe ser fácil de entender para alguien sin conocimientos financieros profundos.

    Datos de Ventas:
    ${JSON.stringify(salesData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating financial insights:", error);
    return "Hubo un error al contactar al servicio de IA. Por favor, inténtelo de nuevo más tarde.";
  }
};
