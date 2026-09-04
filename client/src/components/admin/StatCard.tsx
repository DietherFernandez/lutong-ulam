interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  hint?: string;
  color?: 'primary' | 'accent' | 'green' | 'blue' | 'purple';
}

const colorMap = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
};

export default function StatCard({ icon: Icon, label, value, hint, color = 'primary' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon size={16} className={`sm:hidden ${c.text}`} />
          <Icon size={20} className={`hidden sm:block ${c.text}`} />
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}