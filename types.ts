export enum DocumentType {
  FACTURA = 'Factura Electrónica',
  BOLETA = 'Boleta de Venta Electrónica',
  NOTA_CREDITO = 'Nota de Crédito Electrónica',
  NOTA_DEBITO = 'Nota de Débito Electrónica',
  GUIA_REMISION = 'Guía de Remisión Electrónica',
}

export interface Client {
  id: string;
  name: string;
  docType: 'RUC' | 'DNI';
  docNumber: string;
  address: string;
  email: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
  unitOfMeasure: string;
  stock: number;
}

export interface DocumentItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BaseDocument {
  id: string;
  type: DocumentType;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate?: string;
  currency: 'PEN' | 'USD';
  items: DocumentItem[];
  subtotal: number;
  igv: number;
  total: number;
  status: 'borrador' | 'emitido' | 'anulado';
}

export interface Invoice extends BaseDocument {
  type: DocumentType.FACTURA;
}

export interface Receipt extends BaseDocument {
  type: DocumentType.BOLETA;
}

export interface CreditNote extends BaseDocument {
  type: DocumentType.NOTA_CREDITO;
  modifiedDocumentId: string;
  reason: string;
}

export interface DebitNote extends BaseDocument {
  type: DocumentType.NOTA_DEBITO;
  modifiedDocumentId: string;
  reason: string;
}

export interface DispatchGuide extends BaseDocument {
    type: DocumentType.GUIA_REMISION;
    startPoint: string;
    endPoint: string;
    transportDate: string;
    carrierRuc: string;
    carrierName: string;
    vehiclePlate: string;
    driverLicense: string;
    transferReason: string;
    totalWeight: number; // in kg
}


export type AnyDocument = Invoice | Receipt | CreditNote | DebitNote | DispatchGuide;

export type ViewType = 'dashboard' | 'invoices' | 'receipts' | 'credit_notes' | 'debit_notes' | 'dispatch_guides' | 'clients' | 'products' | 'accounting' | 'sustainability' | 'cash_flow';

export interface SustainabilityData {
  id: string;
  month: string; // YYYY-MM
  energyConsumption: number; // kWh
  paperUsage: number; // reams
  wasteGenerated: number; // kg
}
