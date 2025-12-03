import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { FacturaArticulo } from '../types';
import { useData } from '../context/DataContext';

export const FacturaArticulos: React.FC = () => {
  const { facturaArticulos, facturas, articulos, addFacturaArticulo, updateFacturaArticulo, deleteFacturaArticulo } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacturaArticulo | null>(null);
  const [formData, setFormData] = useState({
    facturaId: 0,
    articuloId: 0,
    monto: 0,
    unidadesVendidas: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.articuloId > 0 && formData.unidadesVendidas > 0) {
      const articulo = articulos.find(a => a.id === formData.articuloId);
      if (articulo) {
        const montoCalculado = articulo.costo * formData.unidadesVendidas;
        setFormData(prev => ({ ...prev, monto: montoCalculado }));
      }
    }
  }, [formData.articuloId, formData.unidadesVendidas, articulos]);

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
        const articulo = articulos.find(a => a.id === value);
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
    setError('');

    const articulo = articulos.find(a => a.id === formData.articuloId);
    if (!articulo) {
      setError('Artículo no encontrado');
      return;
    }

    if (editingItem) {
      const oldUnidades = editingItem.unidadesVendidas;
      const newUnidades = formData.unidadesVendidas;
      const articuloActual = articulos.find(a => a.id === (formData.articuloId !== editingItem.articuloId ? formData.articuloId : editingItem.articuloId));
      
      if (formData.articuloId !== editingItem.articuloId) {
        if (articuloActual && articuloActual.existencia < newUnidades) {
          setError(`No hay suficiente inventario. Disponible: ${articuloActual.existencia}`);
          return;
        }
      } else {
        const diferencia = newUnidades - oldUnidades;
        if (diferencia > 0 && articuloActual && articuloActual.existencia < diferencia) {
          setError(`No hay suficiente inventario. Disponible: ${articuloActual.existencia}`);
          return;
        }
      }

      updateFacturaArticulo(editingItem.id, formData);
    } else {
      if (articulo.existencia < formData.unidadesVendidas) {
        setError(`No hay suficiente inventario. Disponible: ${articulo.existencia}`);
        return;
      }

      addFacturaArticulo(formData);
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
    if (confirm('¿Está seguro de que desea eliminar este detalle de factura? El inventario se restaurará automáticamente.')) {
      deleteFacturaArticulo(item.id);
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
                {facturas.filter(f => f.estado).map(factura => (
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
                onChange={(e) => {
                  const articuloId = parseInt(e.target.value);
                  setFormData(prev => ({ ...prev, articuloId, monto: 0 }));
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Artículo</option>
                {articulos.filter(a => a.estado).map(articulo => (
                  <option key={articulo.id} value={articulo.id}>
                    {articulo.descripcion} - RD$ {articulo.costo.toFixed(2)} (Disponible: {articulo.existencia})
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
                onChange={(e) => {
                  const unidades = parseInt(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, unidadesVendidas: unidades }));
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max={formData.articuloId > 0 ? articulos.find(a => a.id === formData.articuloId)?.existencia || 0 : undefined}
                required
              />
              {formData.articuloId > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Disponible: {articulos.find(a => a.id === formData.articuloId)?.existencia || 0} unidades
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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