import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Factura } from '../types';
import { mockFacturas, mockEmpleados, mockUsuarios } from '../data/mockData';

export const Facturas: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>(mockFacturas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Factura | null>(null);
  const [formData, setFormData] = useState({
    empleadoId: 0,
    usuarioId: 0,
    fechaVenta: '',
    comentario: '',
    estado: true
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'empleadoId', 
      label: 'Empleado',
      render: (value: number) => {
        const empleado = mockEmpleados.find(e => e.id === value);
        return empleado ? empleado.nombre : 'N/A';
      }
    },
    { 
      key: 'usuarioId', 
      label: 'Usuario',
      render: (value: number) => {
        const usuario = mockUsuarios.find(u => u.id === value);
        return usuario ? usuario.nombre : 'N/A';
      }
    },
    { 
      key: 'fechaVenta', 
      label: 'Fecha Venta',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { key: 'comentario', label: 'Comentario' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: boolean) => <StatusBadge active={value} />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setFacturas(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: Factura = {
        id: Math.max(...facturas.map(f => f.id)) + 1,
        ...formData
      };
      setFacturas(prev => [...prev, newItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      empleadoId: 0,
      usuarioId: 0,
      fechaVenta: '',
      comentario: '',
      estado: true
    });
  };

  const handleEdit = (item: Factura) => {
    setEditingItem(item);
    setFormData({
      empleadoId: item.empleadoId,
      usuarioId: item.usuarioId,
      fechaVenta: item.fechaVenta,
      comentario: item.comentario,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Factura) => {
    if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
      setFacturas(prev => prev.filter(f => f.id !== item.id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      empleadoId: 0,
      usuarioId: 0,
      fechaVenta: '',
      comentario: '',
      estado: true
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="text-gray-600">Gestiona las facturas de ventas</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      <Table
        columns={columns}
        data={facturas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Factura' : 'Nueva Factura'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empleado
              </label>
              <select
                value={formData.empleadoId}
                onChange={(e) => setFormData(prev => ({ ...prev, empleadoId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Empleado</option>
                {mockEmpleados.filter(e => e.estado).map(empleado => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <select
                value={formData.usuarioId}
                onChange={(e) => setFormData(prev => ({ ...prev, usuarioId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Usuario</option>
                {mockUsuarios.filter(u => u.estado).map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Venta
            </label>
            <input
              type="date"
              value={formData.fechaVenta}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaVenta: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData(prev => ({ ...prev, comentario: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
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