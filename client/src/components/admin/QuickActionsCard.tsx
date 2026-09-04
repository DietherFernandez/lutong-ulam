import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function QuickActionsCard({ restaurantName }: { restaurantName?: string }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-2">Quick Actions</h3>
        <div className="space-y-1">
          <Link to="/admin/dishes" className="block px-3 py-2 text-sm bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg">+ Add new dish</Link>
          <Link to="/admin/categories" className="block px-3 py-2 text-sm bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg">+ Add new category</Link>
          <Link to="/admin/images" className="block px-3 py-2 text-sm bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg">+ Upload image</Link>
          <Link to="/admin/settings" className="block px-3 py-2 text-sm bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg">⚙ Edit settings</Link>
        </div>
      </div>
      {restaurantName && (
        <div className="bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold mb-1 flex items-center gap-2"><ExternalLink size={16} /> Live Site</h3>
          <p className="text-sm text-white/80 mb-2">{restaurantName}</p>
          <Link to="/" target="_blank" className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-semibold">View <ArrowRight size={12} /></Link>
        </div>
      )}
    </div>
  );
}