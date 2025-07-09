import React from 'react';
import { Users, Package, Receipt, Coffee, TrendingUp, DollarSign } from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: 'positive' | 'negative';
}> = ({ title, value, icon, change, changeType }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-2">
          <TrendingUp className={`w-4 h-4 mr-1 ${
            changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          }`} />
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Usuarios',
      value: '1,247',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Productos Activos',
      value: '156',
      icon: <Package className="w-6 h-6 text-green-600" />,
      change: '+8.2%',
      changeType: 'positive' as const
    },
    {
      title: 'Ventas Hoy',
      value: 'RD$ 45,230',
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      change: '+15.3%',
      changeType: 'positive' as const
    },
    {
      title: 'Facturas Procesadas',
      value: '342',
      icon: <Receipt className="w-6 h-6 text-purple-600" />,
      change: '-2.1%',
      changeType: 'negative' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Sistema UNAPEC!</h1>
            <p className="text-blue-100 text-lg">Gestiona tu cafetería universitaria de manera eficiente</p>
          </div>
          <Coffee className="w-16 h-16 text-blue-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">Registrar Nuevo Usuario</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium">Añadir Producto</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <div className="flex items-center">
                <Receipt className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium">Generar Factura</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nueva factura procesada</p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Usuario registrado exitosamente</p>
                <p className="text-xs text-gray-500">Hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Stock bajo en Coca-Cola</p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};