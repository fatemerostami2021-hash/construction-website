import { ArrowUp, ArrowDown } from 'lucide-react';

const COLOR_MAP = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  green: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
};

export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'primary' }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-white">{value}</div>
      {trend != null && (
        <div className={`flex items-center gap-1 text-xs mt-2 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
