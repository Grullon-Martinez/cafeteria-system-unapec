import React, { useState, useMemo } from 'react';
import { Plus, FileDown } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Proveedor } from '../types';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';

export const Proveedores: React.FC = () => {
  const { proveedores, updateProveedor, addProveedor, deleteProveedor } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Proveedor | null>(null);
  const [formData, setFormData] = useState({
    nombreComercial: '',
    rnc: '',
    fechaRegistro: '',
    estado: true
  });

  const proveedoresActivos = useMemo(() => {
    return proveedores.filter(p => p.estado);
  }, [proveedores]);

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
    updateProveedor(editingItem.id, formData);
  } else {
    addProveedor(formData);
  }

  setIsModalOpen(false);
  setEditingItem(null);
  setFormData({
    nombreComercial: '',
    rnc: '',
    fechaRegistro: '',
    estado: true
  });
};


  const handleEdit = (item: Proveedor) => {
    setEditingItem(item);
    setFormData({
      nombreComercial: item.nombreComercial,
      rnc: item.rnc,
      fechaRegistro: item.fechaRegistro,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Proveedor) => {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      deleteProveedor(item.id);
    }
  };

  const exportToPDF = (proveedor: Proveedor) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('INFORMACIÓN DE PROVEEDOR', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Proveedor #${proveedor.id}`, 20, 35);
    doc.text(`Nombre Comercial: ${proveedor.nombreComercial}`, 20, 45);
    doc.text(`RNC: ${proveedor.rnc}`, 20, 55);
    doc.text(`Fecha de Registro: ${new Date(proveedor.fechaRegistro).toLocaleDateString()}`, 20, 65);
    doc.text(`Estado: ${proveedor.estado ? 'Activo' : 'Inactivo'}`, 20, 75);
    
    doc.save(`proveedor-${proveedor.id}.pdf`);
  };

  const exportAllToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('REPORTE DE PROVEEDORES', 105, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.text('ID', 20, yPos);
    doc.text('Nombre Comercial', 35, yPos);
    doc.text('RNC', 100, yPos);
    doc.text('Fecha Registro', 130, yPos);
    doc.text('Estado', 170, yPos);
    yPos += 8;

    proveedores.forEach(proveedor => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(proveedor.id.toString(), 20, yPos);
      doc.text(proveedor.nombreComercial, 35, yPos);
      doc.text(proveedor.rnc, 100, yPos);
      doc.text(new Date(proveedor.fechaRegistro).toLocaleDateString(), 130, yPos);
      doc.text(proveedor.estado ? 'Activo' : 'Inactivo', 170, yPos);
      yPos += 7;
    });

    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total de Proveedores: ${proveedores.length}`, 20, yPos);
    doc.text(`Proveedores Activos: ${proveedoresActivos.length}`, 20, yPos + 10);

    doc.save(`reporte-proveedores-${new Date().toISOString().split('T')[0]}.pdf`);
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
        <div className="flex gap-3">
          <Button onClick={exportAllToPDF} variant="secondary">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Resumen de Proveedores</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total de Proveedores</p>
            <p className="text-2xl font-bold text-blue-600">
              {proveedores.length}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Proveedores Activos</p>
            <p className="text-2xl font-bold text-blue-600">
              {proveedoresActivos.length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Proveedores Inactivos</p>
            <p className="text-2xl font-bold text-red-600">
              {proveedores.filter(p => !p.estado).length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Porcentaje Activos</p>
            <p className="text-2xl font-bold text-green-600">
              {proveedores.length > 0 
                ? ((proveedoresActivos.length / proveedores.length) * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={proveedores}
        onEdit={handleEdit}
        onDelete={handleDelete}
        customActions={(item: Proveedor) => (
          <Button
            onClick={() => exportToPDF(item)}
            variant="secondary"
            className="text-xs"
          >
            <FileDown className="w-3 h-3 mr-1" />
            PDF
          </Button>
        )}
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