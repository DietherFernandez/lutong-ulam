import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, UtensilsCrossed } from 'lucide-react';
import { settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { NavbarSkeleton } from '../common/States';
import type { RestaurantSettings } from '../../types';

const navLinks = [
  { name: 'Home',    path: '/' },
  { name: 'Menu',    path: '/menu' },
  { name: 'About',   path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { data: settings, loading } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(),
    []
  );

  // Show skeleton while settings load to prevent logo/icon flash
  if (loading) return <NavbarSkeleton />;

  const restaurantName = settings?.settings?.restaurant_name || '';
  const logoUrl = settings?.settings?.logo_url || '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt={restaurantName} className="w-10 h-10 logo-round" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                <UtensilsCrossed size={20} />
              </div>
            )}
            {restaurantName && (
              <span className="text-xl md:text-2xl font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {restaurantName}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
