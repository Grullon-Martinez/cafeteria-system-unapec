import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Cafeteria } from '../types';
import { mockCafeterias, mockCampus } from '../data/mockData';

export const Cafeterias: React.FC = () => {
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>(mockCafeterias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cafeteria | null>(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    campusId: 0,
    encargado: '',
    estado: true
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'descripcion', label: 'Descripción' },
    { 
      key: 'campusId', 
      label: 'Campus',
      render: (value: number) => {
        const campus = mockCampus.find(c => c.id === value);
        return campus ? campus.descripcion : 'N/A';
      }
    },
    { key: 'encargado', label: 'Encargado' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: boolean) => <StatusBadge active={value} />
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setCafeterias(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem: Cafeteria = {
        id: Math.max(...cafeterias.map(c => c.id)) + 1,
        ...formData
      };
      setCafeterias(prev => [...prev, newItem]);
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ descripcion: '', campusId: 0, encargado: '', estado: true });
  };

  const handleEdit = (item: Cafeteria) => {
    setEditingItem(item);
    setFormData({
      descripcion: item.descripcion,
      campusId: item.campusId,
      encargado: item.encargado,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Cafeteria) => {
    if (confirm('¿Está seguro de que desea eliminar esta cafetería?')) {
      setCafeterias(prev => prev.filter(c => c.id !== item.id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ descripcion: '', campusId: 0, encargado: '', estado: true });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cafeterías</h1>
          <p className="text-gray-600">Gestiona las cafeterías por campus</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cafetería
        </Button>
      </div>

      <Table
        columns={columns}
        data={cafeterias}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Cafetería' : 'Nueva Cafetería'}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campus
            </label>
            <select
              value={formData.campusId}
              onChange={(e) => setFormData(prev => ({ ...prev, campusId: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar Campus</option>
              {mockCampus.filter(c => c.estado).map(campus => (
                <option key={campus.id} value={campus.id}>
                  {campus.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encargado
            </label>
            <input
              type="text"
              value={formData.encargado}
              onChange={(e) => setFormData(prev => ({ ...prev, encargado: e.target.value }))}
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