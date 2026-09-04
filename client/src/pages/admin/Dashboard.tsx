import { UtensilsCrossed, Tag, Image, Star } from 'lucide-react';
import { dishesApi, categoriesApi, imagesApi, openingHoursApi, settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import StatCard from '../../components/admin/StatCard';
import PageHeader from '../../components/admin/PageHeader';
import RecentDishesCard from '../../components/admin/RecentDishesCard';
import QuickActionsCard from '../../components/admin/QuickActionsCard';
import TodayHoursCard from '../../components/admin/TodayHoursCard';
import { LoadingSpinner } from '../../components/common/States';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: d, loading: l1 } = useFetch<any>(() => dishesApi.getAll(), []);
  const { data: c, loading: l2 } = useFetch<any>(() => categoriesApi.getAll(), []);
  const { data: i, loading: l3 } = useFetch<any>(() => imagesApi.getAll(), []);
  const { data: h, loading: l4 } = useFetch<any>(() => openingHoursApi.getAll(), []);
  const { data: s, loading: l5 } = useFetch<any>(() => settingsApi.getAll(), []);

  const dishes = d?.dishes || [];
  const hours = h?.hours || [];
  const settings = s?.settings;
  const featured = dishes.filter((x: any) => x.is_featured).length;
  const avail = dishes.filter((x: any) => x.is_available).length;

  if (l1 || l2 || l3 || l4 || l5) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.username || 'Admin'}! 👋`}
        description="Here's what's happening with your restaurant today."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={UtensilsCrossed} label="Total Dishes" value={dishes.length} hint={`${avail} available`} color="primary" />
        <StatCard icon={Tag} label="Categories" value={c?.categories?.length || 0} color="accent" />
        <StatCard icon={Image} label="Media Files" value={i?.images?.length || 0} color="purple" />
        <StatCard icon={Star} label="Featured" value={featured} hint="On homepage" color="blue" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentDishesCard dishes={dishes} />
        <div className="space-y-5">
          <TodayHoursCard hours={hours} />
          <QuickActionsCard restaurantName={settings?.restaurant_name} />
        </div>
      </div>
    </div>
  );
}