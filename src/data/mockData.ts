import {
  TipoUsuario,
  Marca,
  Campus,
  Proveedor,
  Cafeteria,
  Usuario,
  Empleado,
  Articulo,
  Factura,
  FacturaArticulo
} from '../types';

export const mockTiposUsuario: TipoUsuario[] = [
  { id: 1, descripcion: 'Estudiante', estado: true },
  { id: 2, descripcion: 'Profesor', estado: true },
  { id: 3, descripcion: 'Administrativo', estado: true },
  { id: 4, descripcion: 'Visitante', estado: false }
];

export const mockMarcas: Marca[] = [
  { id: 1, descripcion: 'Coca-Cola', estado: true },
  { id: 2, descripcion: 'Pepsi', estado: true },
  { id: 3, descripcion: 'Nestlé', estado: true },
  { id: 4, descripcion: 'Bimbo', estado: true },
  { id: 5, descripcion: 'Lays', estado: false }
];

export const mockCampus: Campus[] = [
  { id: 1, descripcion: 'Campus Santiago', estado: true },
  { id: 2, descripcion: 'Campus Santo Domingo', estado: true },
  { id: 3, descripcion: 'Campus Cibao Oriental', estado: true },
  { id: 4, descripcion: 'Campus La Vega', estado: false }
];

export const mockProveedores: Proveedor[] = [
  { id: 1, nombreComercial: 'Distribuidora Central', rnc: '130123456', fechaRegistro: '2023-01-15', estado: true },
  { id: 2, nombreComercial: 'Alimentos del Caribe', rnc: '130234567', fechaRegistro: '2023-02-20', estado: true },
  { id: 3, nombreComercial: 'Bebidas Premium SRL', rnc: '130345678', fechaRegistro: '2023-03-10', estado: true },
  { id: 4, nombreComercial: 'Snacks y Más', rnc: '130456789', fechaRegistro: '2023-04-25', estado: false }
];

export const mockCafeterias: Cafeteria[] = [
  { id: 1, descripcion: 'Cafetería Principal - Santiago', campusId: 1, encargado: 'María González', estado: true },
  { id: 2, descripcion: 'Cafetería Biblioteca - Santiago', campusId: 1, encargado: 'Juan Pérez', estado: true },
  { id: 3, descripcion: 'Cafetería Central - Santo Domingo', campusId: 2, encargado: 'Ana Martínez', estado: true },
  { id: 4, descripcion: 'Cafetería Anexo - Cibao Oriental', campusId: 3, encargado: 'Carlos López', estado: false }
];

export const mockUsuarios: Usuario[] = [
  { id: 1, nombre: 'Pedro Rodríguez', cedula: '40112345678', tipoUsuarioId: 1, limiteCredito: 5000, fechaRegistro: '2023-09-01', estado: true },
  { id: 2, nombre: 'Lucía Fernández', cedula: '40223456789', tipoUsuarioId: 2, limiteCredito: 10000, fechaRegistro: '2023-08-15', estado: true },
  { id: 3, nombre: 'Roberto Silva', cedula: '40334567890', tipoUsuarioId: 3, limiteCredito: 7500, fechaRegistro: '2023-07-20', estado: true },
  { id: 4, nombre: 'Carmen Jiménez', cedula: '40445678901', tipoUsuarioId: 1, limiteCredito: 3000, fechaRegistro: '2023-10-05', estado: false }
];

export const mockEmpleados: Empleado[] = [
  { id: 1, nombre: 'Miguel Santos', cedula: '40156789012', tandaLabor: 'Matutina', porcientoComision: 5.5, fechaIngreso: '2023-01-10', estado: true },
  { id: 2, nombre: 'Rosa Valdez', cedula: '40267890123', tandaLabor: 'Vespertina', porcientoComision: 6.0, fechaIngreso: '2023-02-15', estado: true },
  { id: 3, nombre: 'José Herrera', cedula: '40378901234', tandaLabor: 'Nocturna', porcientoComision: 5.0, fechaIngreso: '2023-03-20', estado: true },
  { id: 4, nombre: 'Elena Castro', cedula: '40489012345', tandaLabor: 'Matutina', porcientoComision: 4.5, fechaIngreso: '2023-04-25', estado: false }
];

export const mockArticulos: Articulo[] = [
  { id: 1, descripcion: 'Coca-Cola 12oz', marcaId: 1, costo: 45.00, proveedorId: 1, existencia: 150, estado: true },
  { id: 2, descripcion: 'Sándwich de Jamón', marcaId: 4, costo: 85.00, proveedorId: 2, existencia: 25, estado: true },
  { id: 3, descripcion: 'Papas Fritas Grandes', marcaId: 5, costo: 65.00, proveedorId: 3, existencia: 80, estado: true },
  { id: 4, descripcion: 'Café Americano', marcaId: 3, costo: 35.00, proveedorId: 2, existencia: 200, estado: true },
  { id: 5, descripcion: 'Jugo Natural Naranja', marcaId: 2, costo: 55.00, proveedorId: 1, existencia: 45, estado: false }
];

export const mockFacturas: Factura[] = [
  { id: 1, empleadoId: 1, usuarioId: 1, fechaVenta: '2024-01-15', comentario: 'Venta regular', estado: true },
  { id: 2, empleadoId: 2, usuarioId: 2, fechaVenta: '2024-01-16', comentario: 'Cliente frecuente', estado: true },
  { id: 3, empleadoId: 3, usuarioId: 3, fechaVenta: '2024-01-17', comentario: 'Descuento aplicado', estado: true },
  { id: 4, empleadoId: 1, usuarioId: 4, fechaVenta: '2024-01-18', comentario: 'Venta cancelada', estado: false }
];

export const mockFacturaArticulos: FacturaArticulo[] = [
  { id: 1, facturaId: 1, articuloId: 1, monto: 90.00, unidadesVendidas: 2 },
  { id: 2, facturaId: 1, articuloId: 4, monto: 35.00, unidadesVendidas: 1 },
  { id: 3, facturaId: 2, articuloId: 2, monto: 170.00, unidadesVendidas: 2 },
  { id: 4, facturaId: 2, articuloId: 3, monto: 65.00, unidadesVendidas: 1 },
  { id: 5, facturaId: 3, articuloId: 1, monto: 45.00, unidadesVendidas: 1 }
];