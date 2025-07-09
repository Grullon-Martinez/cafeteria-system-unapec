import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { FacturaArticulo } from '../types';
import { mockFacturaArticulos, mockFacturas, mockArticulos } from '../data/mockData';

export const FacturaArticulos: React.FC = () => {
  const [facturaArticulos, setFacturaArticulos] = useState<FacturaArticulo[]>(mockFacturaArticulos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacturaArticulo | null>(null);
  const [formData, setFormData] = useState({
    facturaId: 0,
    articuloId: 0,
    monto: 0,
    unidadesVendidas: 0
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'facturaId', 
      label: 'Factura ID',
      render: (value: number) => `#${value}`
    },
    { 
      key: 'articuloId', 
      label: 'Artículo',
      render: (value: number) => {
        const articulo = mockArticulos.find(a => a.id === value);
        return articulo ? articulo.descripcion : 'N/A';
      }
    },
    { 
      key: 'monto', 
      label: 'Monto',
      render: (value: number) => `RD$ ${value.toFixed(2)}`
    },
    { key: 'unidadesVendidas', label: 'Unidades' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setFacturaArticulos(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: FacturaArticulo = {
        id: Math.max(...facturaArticulos.map(fa => fa.id)) + 1,
        ...formData
      };
      setFacturaArticulos(prev => [...prev, newItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      facturaId: 0,
      articuloId: 0,
      monto: 0,
      unidadesVendidas: 0
    });
  };

  const handleEdit = (item: FacturaArticulo) => {
    setEditingItem(item);
    setFormData({
      facturaId: item.facturaId,
      articuloId: item.articuloId,
      monto: item.monto,
      unidadesVendidas: item.unidadesVendidas
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: FacturaArticulo) => {
    if (confirm('¿Está seguro de que desea eliminar este detalle de factura?')) {
      setFacturaArticulos(prev => prev.filter(fa => fa.id !== item.id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      facturaId: 0,
      articuloId: 0,
      monto: 0,
      unidadesVendidas: 0
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalle de Facturas</h1>
          <p className="text-gray-600">Gestiona los artículos por factura</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Detalle
        </Button>
      </div>

      <Table
        columns={columns}
        data={facturaArticulos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Detalle de Factura' : 'Nuevo Detalle de Factura'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factura
              </label>
              <select
                value={formData.facturaId}
                onChange={(e) => setFormData(prev => ({ ...prev, facturaId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Factura</option>
                {mockFacturas.filter(f => f.estado).map(factura => (
                  <option key={factura.id} value={factura.id}>
                    Factura #{factura.id} - {factura.fechaVenta}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artículo
              </label>
              <select
                value={formData.articuloId}
                onChange={(e) => setFormData(prev => ({ ...prev, articuloId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Artículo</option>
                {mockArticulos.filter(a => a.estado).map(articulo => (
                  <option key={articulo.id} value={articulo.id}>
                    {articulo.descripcion} - RD$ {articulo.costo.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto (RD$)
              </label>
              <input
                type="number"
                value={formData.monto}
                onChange={(e) => setFormData(prev => ({ ...prev, monto: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidades Vendidas
              </label>
              <input
                type="number"
                value={formData.unidadesVendidas}
                onChange={(e) => setFormData(prev => ({ ...prev, unidadesVendidas: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
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