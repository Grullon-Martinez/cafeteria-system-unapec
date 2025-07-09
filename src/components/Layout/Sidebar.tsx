import React from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  MapPin, 
  Building2, 
  Coffee, 
  Package, 
  ShoppingCart, 
  Receipt, 
  FileText,
  Tag,
  Truck
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'tipos-usuario', label: 'Tipos de Usuario', icon: UserCheck },
  { key: 'marcas', label: 'Marcas', icon: Tag },
  { key: 'campus', label: 'Campus', icon: MapPin },
  { key: 'proveedores', label: 'Proveedores', icon: Truck },
  { key: 'cafeterias', label: 'Cafeterías', icon: Coffee },
  { key: 'usuarios', label: 'Usuarios', icon: Users },
  { key: 'empleados', label: 'Empleados', icon: Building2 },
  { key: 'articulos', label: 'Artículos', icon: Package },
  { key: 'facturas', label: 'Facturas', icon: Receipt },
  { key: 'factura-articulos', label: 'Detalle Facturas', icon: FileText }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-blue-400">UNAPEC</h1>
              <p className="text-sm text-slate-400">Cafetería Admin</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            
            return (
              <li key={item.key}>
                <button
                  onClick={() => setActiveView(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            © 2024 UNAPEC<br />
            Sistema de Cafetería
          </div>
        </div>
      )}
    </div>
  );
};