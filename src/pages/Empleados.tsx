import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Empleado } from '../types';
import { useData } from '../context/DataContext';

export const Empleados: React.FC = () => {
  const { empleados, updateEmpleado, addEmpleado, deleteEmpleado } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    tandaLabor: '',
    porcientoComision: 0,
    fechaIngreso: '',
    estado: true
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'tandaLabor', label: 'Tanda Laboral' },
    { 
      key: 'porcientoComision', 
      label: 'Comisión (%)',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'fechaIngreso', 
      label: 'Fecha Ingreso',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value: boolean) => <StatusBadge active={value} />
    }
  ];

  // 🔹 Primero, agrega estas funciones al inicio del archivo (antes del componente o dentro de él)

// Función para validar la cédula dominicana
function validarCedula(cedula: string): boolean {
  const soloNumeros = cedula.replace(/-/g, '');
  if (!/^\d{11}$/.test(soloNumeros)) return false;

  const multiplicadores = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    let producto = parseInt(soloNumeros[i]) * multiplicadores[i];
    if (producto > 9) producto = Math.floor(producto / 10) + (producto % 10);
    suma += producto;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(soloNumeros[10]);
}

// 🔹 Luego, tu handleSubmit modificado:
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Validación de la cédula
  if (!validarCedula(formData.cedula)) {
    alert("❌ La cédula ingresada no es válida.");
    return; // detiene el proceso si la cédula no pasa
  }

  if (editingItem) {
    updateEmpleado(editingItem.id, formData);
  } else {
    addEmpleado(formData);
  }

  setIsModalOpen(false);
  setEditingItem(null);
  setFormData({
    nombre: '',
    cedula: '',
    tandaLabor: '',
    porcientoComision: 0,
    fechaIngreso: '',
    estado: true
  });
};

  const handleEdit = (item: Empleado) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      cedula: item.cedula,
      tandaLabor: item.tandaLabor,
      porcientoComision: item.porcientoComision,
      fechaIngreso: item.fechaIngreso,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Empleado) => {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      deleteEmpleado(item.id);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      cedula: '',
      tandaLabor: '',
      porcientoComision: 0,
      fechaIngreso: '',
      estado: true
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-600">Gestiona el personal de las cafeterías</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      <Table
        columns={columns}
        data={empleados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Empleado' : 'Nuevo Empleado'}
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
                Tanda Laboral
              </label>
              <select
                value={formData.tandaLabor}
                onChange={(e) => setFormData(prev => ({ ...prev, tandaLabor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar Tanda</option>
                <option value="Matutina">Matutina</option>
                <option value="Vespertina">Vespertina</option>
                <option value="Nocturna">Nocturna</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje de Comisión (%)
              </label>
              <input
                type="number"
                value={formData.porcientoComision}
                onChange={(e) => setFormData(prev => ({ ...prev, porcientoComision: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Ingreso
            </label>
            <input
              type="date"
              value={formData.fechaIngreso}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaIngreso: e.target.value }))}
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