import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Articulo,
  Factura,
  FacturaArticulo,
  Empleado,
  Usuario,
  Marca,
  Proveedor,
  TipoUsuario,
  Campus,
  Cafeteria
} from '../types';
import {
  mockArticulos,
  mockFacturas,
  mockFacturaArticulos,
  mockEmpleados,
  mockUsuarios,
  mockMarcas,
  mockProveedores,
  mockTiposUsuario,
  mockCampus,
  mockCafeterias
} from '../data/mockData';

const STORAGE_KEYS = {
  articulos: 'cafeteria_articulos',
  facturas: 'cafeteria_facturas',
  facturaArticulos: 'cafeteria_factura_articulos',
  empleados: 'cafeteria_empleados',
  usuarios: 'cafeteria_usuarios',
  marcas: 'cafeteria_marcas',
  proveedores: 'cafeteria_proveedores',
  tiposUsuario: 'cafeteria_tipos_usuario',
  campus: 'cafeteria_campus',
  cafeterias: 'cafeteria_cafeterias'
};

const loadFromStorage = <T,>(key: string, defaultValue: T[]): T[] => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

interface DataContextType {
  articulos: Articulo[];
  facturas: Factura[];
  facturaArticulos: FacturaArticulo[];
  empleados: Empleado[];
  usuarios: Usuario[];
  marcas: Marca[];
  proveedores: Proveedor[];
  tiposUsuario: TipoUsuario[];
  campus: Campus[];
  cafeterias: Cafeteria[];
  updateArticulo: (id: number, updates: Partial<Articulo>) => void;
  addArticulo: (articulo: Omit<Articulo, 'id'>) => number;
  updateFactura: (id: number, updates: Partial<Factura>) => void;
  addFactura: (factura: Omit<Factura, 'id'>) => number;
  deleteFactura: (id: number) => void;
  addFacturaArticulo: (facturaArticulo: Omit<FacturaArticulo, 'id'>) => number;
  updateFacturaArticulo: (id: number, updates: Partial<FacturaArticulo>) => void;
  deleteFacturaArticulo: (id: number) => void;
  updateEmpleado: (id: number, updates: Partial<Empleado>) => void;
  addEmpleado: (empleado: Omit<Empleado, 'id'>) => number;
  deleteEmpleado: (id: number) => void;
  updateUsuario: (id: number, updates: Partial<Usuario>) => void;
  addUsuario: (usuario: Omit<Usuario, 'id'>) => number;
  deleteUsuario: (id: number) => void;
  updateMarca: (id: number, updates: Partial<Marca>) => void;
  addMarca: (marca: Omit<Marca, 'id'>) => number;
  deleteMarca: (id: number) => void;
  updateProveedor: (id: number, updates: Partial<Proveedor>) => void;
  addProveedor: (proveedor: Omit<Proveedor, 'id'>) => number;
  deleteProveedor: (id: number) => void;
  updateTipoUsuario: (id: number, updates: Partial<TipoUsuario>) => void;
  addTipoUsuario: (tipoUsuario: Omit<TipoUsuario, 'id'>) => number;
  deleteTipoUsuario: (id: number) => void;
  updateCampus: (id: number, updates: Partial<Campus>) => void;
  addCampus: (campus: Omit<Campus, 'id'>) => number;
  deleteCampus: (id: number) => void;
  updateCafeteria: (id: number, updates: Partial<Cafeteria>) => void;
  addCafeteria: (cafeteria: Omit<Cafeteria, 'id'>) => number;
  deleteCafeteria: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articulos, setArticulos] = useState<Articulo[]>(() => 
    loadFromStorage(STORAGE_KEYS.articulos, mockArticulos)
  );
  const [facturas, setFacturas] = useState<Factura[]>(() => 
    loadFromStorage(STORAGE_KEYS.facturas, mockFacturas)
  );
  const [facturaArticulos, setFacturaArticulos] = useState<FacturaArticulo[]>(() => 
    loadFromStorage(STORAGE_KEYS.facturaArticulos, mockFacturaArticulos)
  );
  const [empleados, setEmpleados] = useState<Empleado[]>(() => 
    loadFromStorage(STORAGE_KEYS.empleados, mockEmpleados)
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => 
    loadFromStorage(STORAGE_KEYS.usuarios, mockUsuarios)
  );
  const [marcas, setMarcas] = useState<Marca[]>(() => 
    loadFromStorage(STORAGE_KEYS.marcas, mockMarcas)
  );
  const [proveedores, setProveedores] = useState<Proveedor[]>(() => 
    loadFromStorage(STORAGE_KEYS.proveedores, mockProveedores)
  );
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>(() => 
    loadFromStorage(STORAGE_KEYS.tiposUsuario, mockTiposUsuario)
  );
  const [campus, setCampus] = useState<Campus[]>(() => 
    loadFromStorage(STORAGE_KEYS.campus, mockCampus)
  );
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>(() => 
    loadFromStorage(STORAGE_KEYS.cafeterias, mockCafeterias)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.articulos, articulos);
  }, [articulos]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.facturas, facturas);
  }, [facturas]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.facturaArticulos, facturaArticulos);
  }, [facturaArticulos]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.empleados, empleados);
  }, [empleados]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.usuarios, usuarios);
  }, [usuarios]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.marcas, marcas);
  }, [marcas]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.proveedores, proveedores);
  }, [proveedores]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.tiposUsuario, tiposUsuario);
  }, [tiposUsuario]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.campus, campus);
  }, [campus]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.cafeterias, cafeterias);
  }, [cafeterias]);

  const updateArticulo = (id: number, updates: Partial<Articulo>) => {
    setArticulos(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      return updated;
    });
  };

  const addArticulo = (articulo: Omit<Articulo, 'id'>): number => {
    const newId = articulos.length > 0 ? Math.max(...articulos.map(a => a.id)) + 1 : 1;
    const newArticulo: Articulo = { id: newId, ...articulo };
    setArticulos(prev => [...prev, newArticulo]);
    return newId;
  };

  const addFactura = (factura: Omit<Factura, 'id'>): number => {
    const newId = facturas.length > 0 ? Math.max(...facturas.map(f => f.id)) + 1 : 1;
    const newFactura: Factura = { id: newId, ...factura };
    setFacturas(prev => [...prev, newFactura]);
    return newId;
  };

  const updateFactura = (id: number, updates: Partial<Factura>) => {
    setFacturas(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteFactura = (id: number) => {
    setFacturas(prev => prev.filter(f => f.id !== id));
    setFacturaArticulos(prev => prev.filter(fa => fa.facturaId !== id));
  };

  const addFacturaArticulo = (facturaArticulo: Omit<FacturaArticulo, 'id'>): number => {
    const newId = facturaArticulos.length > 0
      ? Math.max(...facturaArticulos.map(fa => fa.id)) + 1
      : 1;
    const newFacturaArticulo: FacturaArticulo = { id: newId, ...facturaArticulo };
    
    setFacturaArticulos(prev => [...prev, newFacturaArticulo]);
    
    const articulo = articulos.find(a => a.id === facturaArticulo.articuloId);
    if (articulo && articulo.existencia >= facturaArticulo.unidadesVendidas) {
      updateArticulo(articulo.id, {
        existencia: articulo.existencia - facturaArticulo.unidadesVendidas
      });
    }
    
    return newId;
  };

  const updateFacturaArticulo = (id: number, updates: Partial<FacturaArticulo>) => {
    const currentItem = facturaArticulos.find(fa => fa.id === id);
    if (!currentItem) return;

    const oldUnidades = currentItem.unidadesVendidas;
    const newUnidades = updates.unidadesVendidas ?? oldUnidades;
    const oldArticuloId = currentItem.articuloId;
    const newArticuloId = updates.articuloId ?? oldArticuloId;
    
    setFacturaArticulos(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));

    // Si cambió el artículo, restaurar inventario del artículo anterior
    if (oldArticuloId !== newArticuloId) {
      const oldArticulo = articulos.find(a => a.id === oldArticuloId);
      if (oldArticulo) {
        updateArticulo(oldArticulo.id, {
          existencia: oldArticulo.existencia + oldUnidades
        });
      }
      // Restar del nuevo artículo
      const newArticulo = articulos.find(a => a.id === newArticuloId);
      if (newArticulo) {
        updateArticulo(newArticulo.id, {
          existencia: Math.max(0, newArticulo.existencia - newUnidades)
        });
      }
    } else if (oldUnidades !== newUnidades) {
      // Si solo cambió la cantidad, ajustar la diferencia
      const articulo = articulos.find(a => a.id === newArticuloId);
      if (articulo) {
        const diferencia = oldUnidades - newUnidades;
        updateArticulo(articulo.id, {
          existencia: Math.max(0, articulo.existencia + diferencia)
        });
      }
    }
  };

  const deleteFacturaArticulo = (id: number) => {
    const item = facturaArticulos.find(fa => fa.id === id);
    if (item) {
      const articulo = articulos.find(a => a.id === item.articuloId);
      if (articulo) {
        updateArticulo(articulo.id, {
          existencia: articulo.existencia + item.unidadesVendidas
        });
      }
      setFacturaArticulos(prev => prev.filter(fa => fa.id !== id));
    }
  };

  const updateEmpleado = (id: number, updates: Partial<Empleado>) => {
    setEmpleados(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addEmpleado = (empleado: Omit<Empleado, 'id'>): number => {
    const newId = empleados.length > 0 ? Math.max(...empleados.map(e => e.id)) + 1 : 1;
    const newEmpleado: Empleado = { id: newId, ...empleado };
    setEmpleados(prev => [...prev, newEmpleado]);
    return newId;
  };

  const deleteEmpleado = (id: number) => {
    setEmpleados(prev => prev.filter(e => e.id !== id));
  };

  const updateUsuario = (id: number, updates: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addUsuario = (usuario: Omit<Usuario, 'id'>): number => {
    const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    const newUsuario: Usuario = { id: newId, ...usuario };
    setUsuarios(prev => [...prev, newUsuario]);
    return newId;
  };

  const deleteUsuario = (id: number) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const updateMarca = (id: number, updates: Partial<Marca>) => {
    setMarcas(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addMarca = (marca: Omit<Marca, 'id'>): number => {
    const newId = marcas.length > 0 ? Math.max(...marcas.map(m => m.id)) + 1 : 1;
    const newMarca: Marca = { id: newId, ...marca };
    setMarcas(prev => [...prev, newMarca]);
    return newId;
  };

  const deleteMarca = (id: number) => {
    setMarcas(prev => prev.filter(m => m.id !== id));
  };

  const updateProveedor = (id: number, updates: Partial<Proveedor>) => {
    setProveedores(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addProveedor = (proveedor: Omit<Proveedor, 'id'>): number => {
    const newId = proveedores.length > 0 ? Math.max(...proveedores.map(p => p.id)) + 1 : 1;
    const newProveedor: Proveedor = { id: newId, ...proveedor };
    setProveedores(prev => [...prev, newProveedor]);
    return newId;
  };

  const deleteProveedor = (id: number) => {
    setProveedores(prev => prev.filter(p => p.id !== id));
  };

  const updateTipoUsuario = (id: number, updates: Partial<TipoUsuario>) => {
    setTiposUsuario(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addTipoUsuario = (tipoUsuario: Omit<TipoUsuario, 'id'>): number => {
    const newId = tiposUsuario.length > 0 ? Math.max(...tiposUsuario.map(t => t.id)) + 1 : 1;
    const newTipoUsuario: TipoUsuario = { id: newId, ...tipoUsuario };
    setTiposUsuario(prev => [...prev, newTipoUsuario]);
    return newId;
  };

  const deleteTipoUsuario = (id: number) => {
    setTiposUsuario(prev => prev.filter(t => t.id !== id));
  };

  const updateCampus = (id: number, updates: Partial<Campus>) => {
    setCampus(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addCampus = (campusData: Omit<Campus, 'id'>): number => {
    const newId = campus.length > 0 ? Math.max(...campus.map(c => c.id)) + 1 : 1;
    const newCampus: Campus = { id: newId, ...campusData };
    setCampus(prev => [...prev, newCampus]);
    return newId;
  };

  const deleteCampus = (id: number) => {
    setCampus(prev => prev.filter(c => c.id !== id));
  };

  const updateCafeteria = (id: number, updates: Partial<Cafeteria>) => {
    setCafeterias(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addCafeteria = (cafeteria: Omit<Cafeteria, 'id'>): number => {
    const newId = cafeterias.length > 0 ? Math.max(...cafeterias.map(c => c.id)) + 1 : 1;
    const newCafeteria: Cafeteria = { id: newId, ...cafeteria };
    setCafeterias(prev => [...prev, newCafeteria]);
    return newId;
  };

  const deleteCafeteria = (id: number) => {
    setCafeterias(prev => prev.filter(c => c.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        articulos,
        facturas,
        facturaArticulos,
        empleados,
        usuarios,
        marcas,
        proveedores,
        tiposUsuario,
        campus,
        cafeterias,
        updateArticulo,
        addArticulo,
        addFactura,
        updateFactura,
        deleteFactura,
        addFacturaArticulo,
        updateFacturaArticulo,
        deleteFacturaArticulo,
        updateEmpleado,
        addEmpleado,
        deleteEmpleado,
        updateUsuario,
        addUsuario,
        deleteUsuario,
        updateMarca,
        addMarca,
        deleteMarca,
        updateProveedor,
        addProveedor,
        deleteProveedor,
        updateTipoUsuario,
        addTipoUsuario,
        deleteTipoUsuario,
        updateCampus,
        addCampus,
        deleteCampus,
        updateCafeteria,
        addCafeteria,
        deleteCafeteria
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

