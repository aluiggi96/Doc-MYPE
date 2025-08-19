
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Client } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './Icons';

const ClientManager: React.FC = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client> | null>(null);

  const handleOpenModal = (client?: Client) => {
    setCurrentClient(client || { docType: 'RUC' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentClient(null);
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient || !currentClient.name || !currentClient.docNumber) return;

    if (currentClient.id) {
      setClients(prev => prev.map(c => c.id === currentClient!.id ? currentClient as Client : c));
    } else {
      setClients(prev => [...prev, { ...currentClient, id: Date.now().toString() } as Client]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentClient(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
          <PlusIcon />
          <span className="ml-2">Nuevo Cliente</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nombre / Razón Social</th>
              <th className="p-3">Documento</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{client.name}</td>
                <td className="p-3">{client.docType}: {client.docNumber}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleOpenModal(client)} className="text-yellow-600 hover:text-yellow-800 p-1 mx-2"><PencilIcon /></button>
                  <button onClick={() => handleDelete(client.id)} className="text-danger hover:text-red-700 p-1"><TrashIcon /></button>
                </td>
              </tr>
            ))}
             {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">No hay clientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentClient && (
        <Modal title={currentClient.id ? "Editar Cliente" : "Nuevo Cliente"} onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre / Razón Social</label>
              <input type="text" name="name" value={currentClient.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700">Tipo Documento</label>
                <select name="docType" value={currentClient.docType || 'RUC'} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="RUC">RUC</option>
                    <option value="DNI">DNI</option>
                </select>
               </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">N° Documento</label>
                <input type="text" name="docNumber" value={currentClient.docNumber || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input type="text" name="address" value={currentClient.address || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input type="email" name="email" value={currentClient.email || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300">Cancelar</button>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ClientManager;
