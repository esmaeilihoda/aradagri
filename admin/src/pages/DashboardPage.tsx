import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useProducts, useContactSubmissions } from '@/hooks';
import { BarChart3, Package, ShoppingCart, MessageSquare } from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: ordersData } = useOrders(1, 5);
  const { data: productsData } = useProducts(1, 5);
  const { data: contactData } = useContactSubmissions(1, 5);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const stats = [
    {
      label: 'Total Products',
      value: productsData?.pagination?.total || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Orders',
      value: ordersData?.pagination?.total || 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      label: 'Contact Messages',
      value: contactData?.pagination?.total || 0,
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    {
      label: 'Revenue',
      value: '$' + (ordersData?.data?.reduce((sum: number, order: any) => sum + order.totalAmount, 0) || 0).toFixed(2),
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/products')}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition"
        >
          <Package size={24} className="mx-auto mb-2 text-blue-500" />
          <p className="font-semibold text-gray-900">Manage Products</p>
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition"
        >
          <BarChart3 size={24} className="mx-auto mb-2 text-green-500" />
          <p className="font-semibold text-gray-900">Categories</p>
        </button>
        <button
          onClick={() => navigate('/orders')}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition"
        >
          <ShoppingCart size={24} className="mx-auto mb-2 text-orange-500" />
          <p className="font-semibold text-gray-900">View Orders</p>
        </button>
        <button
          onClick={() => navigate('/contact')}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition"
        >
          <MessageSquare size={24} className="mx-auto mb-2 text-purple-500" />
          <p className="font-semibold text-gray-900">Messages</p>
        </button>
      </div>
    </div>
  );
}
