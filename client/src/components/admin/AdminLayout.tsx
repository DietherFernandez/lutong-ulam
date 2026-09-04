import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, Tag, Image, Settings, Clock,
  Home as HomeIcon, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings } from '../../types';

const navItems = [
  { path: '/admin',        icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { path: '/admin/dishes',  icon: UtensilsCrossed, label: 'Dishes' },
  { path: '/admin/categories', icon: Tag,         label: 'Categories' },
  { path: '/admin/images',   icon: Image,         label: 'Media Library' },
  { path: '/admin/settings', icon: Settings,      label: 'Settings' },
  { path: '/admin/hours',    icon: Clock,         label: 'Opening Hours' },
  { path: '/admin/homepage', icon: HomeIcon,       label: 'Homepage' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(),
    []
  );

  const logoUrl = settingsData?.settings?.logo_url || '';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-9 h-9 rounded-full object-contain bg-white p-0.5" />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <UtensilsCrossed size={18} />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">Admin Panel</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'admin'}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <HomeIcon size={16} />
            View Website
            <ChevronRight size={14} className="ml-auto" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <Link to="/" target="_blank" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
            View Website →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
