import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { TiposUsuario } from './pages/TiposUsuario';
import { Marcas } from './pages/Marcas';
import { CampusPage } from './pages/Campus';
import { Proveedores } from './pages/Proveedores';
import { Cafeterias } from './pages/Cafeterias';
import { Usuarios } from './pages/Usuarios';
import { Empleados } from './pages/Empleados';
import { Articulos } from './pages/Articulos';
import { Facturas } from './pages/Facturas';
import { FacturaArticulos } from './pages/FacturaArticulos';

const getViewTitle = (view: string) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'dashboard': { title: 'Dashboard', subtitle: 'Resumen general del sistema' },
    'tipos-usuario': { title: 'Tipos de Usuario', subtitle: 'Gestión de tipos de usuario' },
    'marcas': { title: 'Marcas', subtitle: 'Gestión de marcas de productos' },
    'campus': { title: 'Campus', subtitle: 'Gestión de campus universitarios' },
    'proveedores': { title: 'Proveedores', subtitle: 'Gestión de proveedores' },
    'cafeterias': { title: 'Cafeterías', subtitle: 'Gestión de cafeterías' },
    'usuarios': { title: 'Usuarios', subtitle: 'Gestión de usuarios del sistema' },
    'empleados': { title: 'Empleados', subtitle: 'Gestión de empleados' },
    'articulos': { title: 'Artículos', subtitle: 'Gestión de inventario' },
    'facturas': { title: 'Facturas', subtitle: 'Gestión de facturas de venta' },
    'factura-articulos': { title: 'Detalle de Facturas', subtitle: 'Gestión de artículos por factura' }
  };
  
  return titles[view] || { title: 'Dashboard', subtitle: 'Resumen general del sistema' };
};

const renderView = (view: string) => {
  switch (view) {
    case 'tipos-usuario':
      return <TiposUsuario />;
    case 'marcas':
      return <Marcas />;
    case 'campus':
      return <CampusPage />;
    case 'proveedores':
      return <Proveedores />;
    case 'cafeterias':
      return <Cafeterias />;
    case 'usuarios':
      return <Usuarios />;
    case 'empleados':
      return <Empleados />;
    case 'articulos':
      return <Articulos />;
    case 'facturas':
      return <Facturas />;
    case 'factura-articulos':
      return <FacturaArticulos />;
    default:
      return <Dashboard />;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const { title, subtitle } = getViewTitle(activeView);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        
        <main className="flex-1 p-6">
          {renderView(activeView)}
        </main>
      </div>
    </div>
  );
}

export default App;