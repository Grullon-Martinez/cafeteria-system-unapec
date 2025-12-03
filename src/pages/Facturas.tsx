import React, { useState, useMemo } from 'react';
import { Plus, FileDown } from 'lucide-react';
import { Table } from '../components/Common/Table';
import { Modal } from '../components/Common/Modal';
import { Button } from '../components/Common/Button';
import { StatusBadge } from '../components/Common/StatusBadge';
import { Factura } from '../types';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';

export const Facturas: React.FC = () => {
  const { facturas, facturaArticulos, empleados, usuarios, articulos, addFactura, updateFactura, deleteFactura } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Factura | null>(null);
  const [formData, setFormData] = useState({
    empleadoId: 0,
    usuarioId: 0,
    fechaVenta: '',
    comentario: '',
    total: 0,
    estado: true
  });

  const facturasConTotales = useMemo(() => {
    return facturas.map(factura => {
      // Si la factura ya tiene un total, usarlo; si no, calcular desde los artículos
      if (factura.total !== undefined && factura.total > 0) {
        return { ...factura, total: factura.total };
      }
      const items = facturaArticulos.filter(fa => fa.facturaId === factura.id);
      const total = items.reduce((sum, item) => sum + item.monto, 0);
      return { ...factura, total };
    });
  }, [facturas, facturaArticulos]);

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'empleadoId', 
      label: 'Empleado',
      render: (value: number) => {
        const empleado = empleados.find(e => e.id === value);
        return empleado ? empleado.nombre : 'N/A';
      }
    },
    { 
      key: 'usuarioId', 
      label: 'Usuario',
      render: (value: number) => {
        const usuario = usuarios.find(u => u.id === value);
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
      key: 'total', 
      label: 'Total',
      render: (value: number) => `RD$ ${value.toFixed(2)}`
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
      updateFactura(editingItem.id, formData);
    } else {
      addFactura(formData);
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
      total: item.total || 0,
      estado: item.estado
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Factura) => {
    if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
      deleteFactura(item.id);
    }
  };

  const exportToPDF = (factura: Factura & { total: number }) => {
    const doc = new jsPDF();
    const items = facturaArticulos.filter(fa => fa.facturaId === factura.id);
    const empleado = empleados.find(e => e.id === factura.empleadoId);
    const usuario = usuarios.find(u => u.id === factura.usuarioId);

    doc.setFontSize(18);
    doc.text('FACTURA DE VENTA', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Factura #${factura.id}`, 20, 35);
    doc.text(`Fecha: ${new Date(factura.fechaVenta).toLocaleDateString()}`, 20, 42);
    
    doc.text(`Empleado: ${empleado?.nombre || 'N/A'}`, 20, 52);
    doc.text(`Cliente: ${usuario?.nombre || 'N/A'}`, 20, 59);
    
    if (factura.comentario) {
      doc.text(`Comentario: ${factura.comentario}`, 20, 69);
    }

    let yPos = 85;
    doc.setFontSize(10);
    doc.text('Detalle de Artículos', 20, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.text('Artículo', 20, yPos);
    doc.text('Cantidad', 100, yPos);
    doc.text('Monto', 140, yPos);
    yPos += 8;

    items.forEach(item => {
      const articulo = articulos.find(a => a.id === item.articuloId);
      const nombreArticulo = articulo?.descripcion || 'N/A';
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(nombreArticulo, 20, yPos);
      doc.text(item.unidadesVendidas.toString(), 100, yPos);
      doc.text(`RD$ ${item.monto.toFixed(2)}`, 140, yPos);
      yPos += 7;
    });

    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', 100, yPos);
    doc.text(`RD$ ${factura.total.toFixed(2)}`, 140, yPos);

    doc.save(`factura-${factura.id}.pdf`);
  };

  const exportAllToPDF = () => {
    const facturasActivas = facturasConTotales.filter(f => f.estado);
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('REPORTE DE VENTAS', 105, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.text('ID', 20, yPos);
    doc.text('Fecha', 35, yPos);
    doc.text('Cliente', 60, yPos);
    doc.text('Empleado', 100, yPos);
    doc.text('Total', 150, yPos);
    yPos += 8;

    let totalGeneral = 0;
    facturasActivas.forEach(factura => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const usuario = usuarios.find(u => u.id === factura.usuarioId);
      const empleado = empleados.find(e => e.id === factura.empleadoId);

      doc.text(factura.id.toString(), 20, yPos);
      doc.text(new Date(factura.fechaVenta).toLocaleDateString(), 35, yPos);
      doc.text(usuario?.nombre || 'N/A', 60, yPos);
      doc.text(empleado?.nombre || 'N/A', 100, yPos);
      doc.text(`RD$ ${factura.total.toFixed(2)}`, 150, yPos);
      
      totalGeneral += factura.total;
      yPos += 7;
    });

    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL GENERAL:', 100, yPos);
    doc.text(`RD$ ${totalGeneral.toFixed(2)}`, 150, yPos);

    doc.save(`reporte-ventas-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      empleadoId: 0,
      usuarioId: 0,
      fechaVenta: '',
      comentario: '',
      total: 0,
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
        <div className="flex gap-3">
          <Button onClick={exportAllToPDF} variant="secondary">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Resumen de Ventas</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total de Facturas Activas</p>
            <p className="text-2xl font-bold text-blue-600">
              {facturasConTotales.filter(f => f.estado).length}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Ventas</p>
            <p className="text-2xl font-bold text-blue-600">
              RD$ {facturasConTotales.filter(f => f.estado).reduce((sum, f) => sum + f.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Promedio por Factura</p>
            <p className="text-2xl font-bold text-green-600">
              RD$ {facturasConTotales.filter(f => f.estado).length > 0 
                ? (facturasConTotales.filter(f => f.estado).reduce((sum, f) => sum + f.total, 0) / facturasConTotales.filter(f => f.estado).length).toFixed(2)
                : '0.00'}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Artículos Vendidos</p>
            <p className="text-2xl font-bold text-purple-600">
              {facturaArticulos.reduce((sum, fa) => sum + fa.unidadesVendidas, 0)}
            </p>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={facturasConTotales}
        onEdit={handleEdit}
        onDelete={handleDelete}
        customActions={(item: Factura & { total: number }) => (
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
                {empleados.filter(e => e.estado).map(empleado => (
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
                {usuarios.filter(u => u.estado).map(usuario => (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total (RD$)
            </label>
            <input
              type="number"
              value={formData.total}
              onChange={(e) => setFormData(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deje en 0 para calcular automáticamente desde los artículos
            </p>
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