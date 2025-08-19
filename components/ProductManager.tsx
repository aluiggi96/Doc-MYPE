
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Product } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './Icons';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  const handleOpenModal = (product?: Product) => {
    setCurrentProduct(product || { unitOfMeasure: 'Unidad', stock: 0, unitPrice: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || !currentProduct.name || !currentProduct.code) return;

    const productToSave = {
        ...currentProduct,
        stock: Number(currentProduct.stock) || 0,
        unitPrice: Number(currentProduct.unitPrice) || 0,
    }

    if (currentProduct.id) {
      setProducts(prev => prev.map(p => p.id === currentProduct!.id ? productToSave as Product : p));
    } else {
      setProducts(prev => [...prev, { ...productToSave, id: Date.now().toString() } as Product]);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
          <PlusIcon />
          <span className="ml-2">Nuevo Producto</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Unidad de Medida</th>
              <th className="p-3 text-right">Precio Unitario</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className={`border-b hover:bg-gray-50 ${product.stock < 10 ? 'bg-red-50' : ''}`}>
                <td className="p-3 font-medium">{product.code}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.unitOfMeasure}</td>
                <td className="p-3 text-right">{product.unitPrice.toFixed(2)}</td>
                <td className={`p-3 text-right font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>{product.stock}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleOpenModal(product)} className="text-yellow-600 hover:text-yellow-800 p-1 mx-2"><PencilIcon /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-danger hover:text-red-700 p-1"><TrashIcon /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentProduct && (
        <Modal title={currentProduct.id ? "Editar Producto" : "Nuevo Producto"} onClose={handleCloseModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Código</label>
                    <input type="text" name="code" value={currentProduct.code || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input type="text" name="name" value={currentProduct.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
                    <input type="number" name="unitPrice" step="0.01" value={currentProduct.unitPrice || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                    <input type="text" name="unitOfMeasure" value={currentProduct.unitOfMeasure || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input type="number" name="stock" value={currentProduct.stock || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
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

export default ProductManager;
