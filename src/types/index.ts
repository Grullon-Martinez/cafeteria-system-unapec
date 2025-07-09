export interface TipoUsuario {
  id: number;
  descripcion: string;
  estado: boolean;
}

export interface Marca {
  id: number;
  descripcion: string;
  estado: boolean;
}

export interface Campus {
  id: number;
  descripcion: string;
  estado: boolean;
}

export interface Proveedor {
  id: number;
  nombreComercial: string;
  rnc: string;
  fechaRegistro: string;
  estado: boolean;
}

export interface Cafeteria {
  id: number;
  descripcion: string;
  campusId: number;
  encargado: string;
  estado: boolean;
}

export interface Usuario {
  id: number;
  nombre: string;
  cedula: string;
  tipoUsuarioId: number;
  limiteCredito: number;
  fechaRegistro: string;
  estado: boolean;
}

export interface Empleado {
  id: number;
  nombre: string;
  cedula: string;
  tandaLabor: string;
  porcientoComision: number;
  fechaIngreso: string;
  estado: boolean;
}

export interface Articulo {
  id: number;
  descripcion: string;
  marcaId: number;
  costo: number;
  proveedorId: number;
  existencia: number;
  estado: boolean;
}

export interface Factura {
  id: number;
  empleadoId: number;
  usuarioId: number;
  fechaVenta: string;
  comentario: string;
  estado: boolean;
}

export interface FacturaArticulo {
  id: number;
  facturaId: number;
  articuloId: number;
  monto: number;
  unidadesVendidas: number;
}