
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AnyDocument, DocumentType } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from './Icons';
import Modal from './Modal';
// DocumentForm and DocumentViewer would be complex components. For this scope, we'll mock their usage.

interface DocumentManagerProps {
  documentType: DocumentType;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ documentType }) => {
  const [documents, setDocuments] = useLocalStorage<AnyDocument[]>('documents', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AnyDocument | null>(null);

  const filteredDocuments = documents.filter(doc => doc.type === documentType);

  const handleCreate = () => {
    // In a real app, this would open a detailed form
    alert(`Funcionalidad para crear nueva ${documentType} no implementada en este demo.`);
    // setSelectedDocument(null);
    // setIsFormOpen(true);
  };
  
  const handleEdit = (doc: AnyDocument) => {
    alert(`Funcionalidad para editar ${documentType} no implementada en este demo.`);
    // setSelectedDocument(doc);
    // setIsFormOpen(true);
  };

  const handleView = (doc: AnyDocument) => {
    alert(`Visualizando ${documentType} ${doc.number}\n\nCliente: ${doc.clientName}\nTotal: ${doc.total.toFixed(2)}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea anular este documento?')) {
      setDocuments(docs => docs.map(d => d.id === id ? {...d, status: 'anulado'} : d));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{documentType}s</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <PlusIcon />
          <span className="ml-2">Crear Nuevo</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Número</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Fecha Emisión</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map(doc => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{doc.number}</td>
                <td className="p-3">{doc.clientName}</td>
                <td className="p-3">{new Date(doc.issueDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    doc.status === 'emitido' ? 'bg-green-100 text-green-800' :
                    doc.status === 'anulado' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="p-3 text-right font-semibold">{doc.total.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleView(doc)} className="text-blue-600 hover:text-blue-800 p-1"><EyeIcon /></button>
                  <button onClick={() => handleEdit(doc)} className="text-yellow-600 hover:text-yellow-800 p-1 mx-2"><PencilIcon /></button>
                  <button onClick={() => handleDelete(doc.id)} className="text-danger hover:text-red-700 p-1"><TrashIcon /></button>
                </td>
              </tr>
            ))}
            {filteredDocuments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">No hay documentos de este tipo.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <Modal title={selectedDocument ? `Editar ${documentType}` : `Crear ${documentType}`} onClose={() => setIsFormOpen(false)}>
            {/* The actual DocumentForm component would go here */}
            <p>El formulario para {documentType} iría aquí.</p>
        </Modal>
      )}
    </div>
  );
};

export default DocumentManager;
