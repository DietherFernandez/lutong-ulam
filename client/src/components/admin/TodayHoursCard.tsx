import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function TodayHoursCard({ hours }: { hours: any[] }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayH = hours.find((x: any) => x.day === today);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
        <Clock size={18} className="text-primary-600" /> Today's Hours
      </h3>
      <div className="bg-primary-50 rounded-lg p-3">
        <p className="text-xs uppercase text-primary-700 font-semibold mb-1">{today}</p>
        {todayH ? (
          todayH.is_closed
            ? <p className="text-red-600 font-bold">Closed</p>
            : <p className="text-gray-900 font-bold">{todayH.opening_time} – {todayH.closing_time}</p>
        ) : (
          <p className="text-gray-500 text-sm">No hours set</p>
        )}
      </div>
      <Link to="/admin/hours" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
        Manage →
      </Link>
    </div>
  );
}