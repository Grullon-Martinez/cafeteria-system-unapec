import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Usuario } from '../types';
import { mockUsuarios, mockTiposUsuario } from '../data/mockData';

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    tipoUsuarioId: 0,
    limiteCredito: 0,
    fechaRegistro: '',
    estado: true
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { 
      key: 'tipoUsuarioId', 
      label: 'Tipo Usuario',
      render: (value: number) => {
        const tipo = mockTiposUsuario.find(t => t.id === value);
        return tipo ? tipo.descripcion : 'N/A';
      }
    },
    { 
      key: 'limiteCredito', 
      label: 'Límite Crédito',
      render: (value: number) => `RD$ ${value.toLocaleString()}`
    },
    { 
      key: 'fechaRegistro', 
      label: 'Fecha Registro',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: boolean) => <StatusBadge active={value} />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setUsuarios(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: Usuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        ...formData
      };
      setUsuarios(prev => [...prev, newItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      nombre: '',
      cedula: '',
      tipoUsuarioId: 0,
      limiteCredito: 0,
      fechaRegistro: '',
      estado: true
    });
  };

  const handleEdit = (item: Usuario) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      cedula: item.cedula,
      tipoUsuarioId: item.tipoUsuarioId,
      limiteCredito: item.limiteCredito,
      fechaRegistro: item.fechaRegistro,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Usuario) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      setUsuarios(prev => prev.filter(u => u.id !== item.id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      cedula: '',
      tipoUsuarioId: 0,
      limiteCredito: 0,
      fechaRegistro: '',
      estado: true
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Table
        columns={columns}
        data={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cédula
              </label>
              <input
                type="text"
                value={formData.cedula}
                onChange={(e) => setFormData(prev => ({ ...prev, cedula: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <select
                value={formData.tipoUsuarioId}
                onChange={(e) => setFormData(prev => ({ ...prev, tipoUsuarioId: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Tipo</option>
                {mockTiposUsuario.filter(t => t.estado).map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Límite de Crédito
              </label>
              <input
                type="number"
                value={formData.limiteCredito}
                onChange={(e) => setFormData(prev => ({ ...prev, limiteCredito: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Registro
            </label>
            <input
              type="date"
              value={formData.fechaRegistro}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaRegistro: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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