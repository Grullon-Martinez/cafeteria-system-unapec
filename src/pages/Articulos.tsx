import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Articulo } from '../types';
import { mockArticulos, mockMarcas, mockProveedores } from '../data/mockData';

export const Articulos: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>(mockArticulos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Articulo | null>(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    marcaId: 0,
    costo: 0,
    proveedorId: 0,
    existencia: 0,
    estado: true
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'descripcion', label: 'Descripción' },
    { 
      key: 'marcaId', 
      label: 'Marca',
      render: (value: number) => {
        const marca = mockMarcas.find(m => m.id === value);
        return marca ? marca.descripcion : 'N/A';
      }
    },
    { 
      key: 'costo', 
      label: 'Costo',
      render: (value: number) => `RD$ ${value.toFixed(2)}`
    },
    { 
      key: 'proveedorId', 
      label: 'Proveedor',
      render: (value: number) => {
        const proveedor = mockProveedores.find(p => p.id === value);
        return proveedor ? proveedor.nombreComercial : 'N/A';
      }
    },
    { key: 'existencia', label: 'Existencia' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: boolean) => <StatusBadge active={value} />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setArticulos(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: Articulo = {
        id: Math.max(...articulos.map(a => a.id)) + 1,
        ...formData
      };
      setArticulos(prev => [...prev, newItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      descripcion: '',
      marcaId: 0,
      costo: 0,
      proveedorId: 0,
      existencia: 0,
      estado: true
    });
  };

  const handleEdit = (item: Articulo) => {
    setEditingItem(item);
    setFormData({
      descripcion: item.descripcion,
      marcaId: item.marcaId,
      costo: item.costo,
      proveedorId: item.proveedorId,
      existencia: item.existencia,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Articulo) => {
    if (confirm('¿Está seguro de que desea eliminar este artículo?')) {
      setArticulos(prev => prev.filter(a => a.id !== item.id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      descripcion: '',
      marcaId: 0,
      costo: 0,
      proveedorId: 0,
      existencia: 0,
      estado: true
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artículos</h1>
          <p className="text-gray-600">Gestiona el inventario de productos</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      <Table
        columns={columns}
        data={articulos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Artículo' : 'Nuevo Artículo'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <select
                value={formData.marcaId}
                onChange={(e) => setFormData(prev => ({ ...prev, marcaId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Marca</option>
                {mockMarcas.filter(m => m.estado).map(marca => (
                  <option key={marca.id} value={marca.id}>
                    {marca.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor
              </label>
              <select
                value={formData.proveedorId}
                onChange={(e) => setFormData(prev => ({ ...prev, proveedorId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Proveedor</option>
                {mockProveedores.filter(p => p.estado).map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombreComercial}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo (RD$)
              </label>
              <input
                type="number"
                value={formData.costo}
                onChange={(e) => setFormData(prev => ({ ...prev, costo: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existencia
              </label>
              <input
                type="number"
                value={formData.existencia}
                onChange={(e) => setFormData(prev => ({ ...prev, existencia: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.checked }))}
                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingItem ? 'Actualizar' : 'Crear'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};