import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Proveedor } from '../types';
import { mockProveedores } from '../data/mockData';

export const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>(mockProveedores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Proveedor | null>(null);
  const [formData, setFormData] = useState({
    nombreComercial: '',
    rnc: '',
    fechaRegistro: '',
    estado: true
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombreComercial', label: 'Nombre Comercial' },
    { key: 'rnc', label: 'RNC' },
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

  // 🔹 Agrega esta función al inicio del archivo o justo antes del handleSubmit
function validarRNC(rnc: string): boolean {
  const soloNumeros = rnc.replace(/-/g, '');
  if (!/^\d{9}$/.test(soloNumeros)) return false; // El RNC debe tener 9 dígitos

  const pesos = [7, 9, 8, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 8; i++) {
    suma += parseInt(soloNumeros[i]) * pesos[i];
  }

  const resto = suma % 11;
  let digitoVerificador = 0;

  if (resto === 0) digitoVerificador = 2;
  else if (resto === 1) digitoVerificador = 1;
  else digitoVerificador = 11 - resto;

  return digitoVerificador === parseInt(soloNumeros[8]);
}

// 🔹 Ahora, modifica tu handleSubmit así:
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Validación del RNC antes de guardar
  if (!validarRNC(formData.rnc)) {
    alert("❌ El RNC ingresado no es válido.");
    return; // Detiene el envío si el RNC no pasa la validación
  }

  if (editingItem) {
    setProveedores(prev =>
      prev.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      )
    );
  } else {
    const newItem: Proveedor = {
      id: Math.max(...proveedores.map(p => p.id)) + 1,
      ...formData
    };
    setProveedores(prev => [...prev, newItem]);
  }

  // Limpiar y cerrar
  setIsModalOpen(false);
  setEditingItem(null);
  setFormData({
    nombre: '',
    rnc: '',
    telefono: '',
    direccion: '',
    estado: true
  });
};


  const handleDelete = (item: Proveedor) => {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      setProveedores(prev => prev.filter(p => p.id !== item.id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ nombreComercial: '', rnc: '', fechaRegistro: '', estado: true });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-600">Gestiona los proveedores de productos</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      <Table
        columns={columns}
        data={proveedores}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={formData.nombreComercial}
                onChange={(e) => setFormData(prev => ({ ...prev, nombreComercial: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RNC
              </label>
              <input
                type="text"
                value={formData.rnc}
                onChange={(e) => setFormData(prev => ({ ...prev, rnc: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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