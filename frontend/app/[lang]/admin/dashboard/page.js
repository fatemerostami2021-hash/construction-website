'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Building2, FileText, MessageSquare, Eye, TrendingUp, TrendingDown,
  BarChart3, Loader2, MapPin,
} from 'lucide-react';
import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const STATUS_LABELS = { foundation: 'فونداسیون', skeleton: 'اسکلت', finishing: 'نازک‌کاری', delivered: 'تحویل شده' };
const STATUS_COLORS = { foundation: '#f59e0b', skeleton: '#3b82f6', finishing: '#6366f1', delivered: '#1e40af' };

function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString('fa-IR', { month: 'short' }) });
  }
  return months;
}

function MiniStat({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-white">{value}</div>
      {trend != null && (
        <div className={`flex items-center gap-1 text-xs mt-2 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trend}</span>
          <span className="text-gray-400">نسبت به ماه قبل</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, articles: 0, messages: 0, views: 0, villas: 0, apartments: 0 });
  const [statusData, setStatusData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:5000/api/projects?limit=100', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('http://localhost:5000/api/articles?limit=1', { headers }).then(r => r.ok ? r.json() : { totalPages: 0 }).catch(() => ({ totalPages: 0 })),
      fetch('http://localhost:5000/api/contacts', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([projectsRes, articlesRes, contactsRes]) => {
      const projectsList = Array.isArray(projectsRes) ? projectsRes : (projectsRes.data || projectsRes.projects || []);
      const contactsList = Array.isArray(contactsRes) ? contactsRes : (contactsRes.data || []);

      setStats({
        projects: projectsList.length,
        articles: (articlesRes.totalPages || 0) * 10,
        messages: contactsList.length || 0,
        views: projectsList.reduce((sum, p) => sum + (p.views || 0), 0),
        villas: projectsList.filter(p => p.propertyType === 'villa').length,
        apartments: projectsList.filter(p => p.propertyType === 'apartment').length,
      });

      const statusCounts = {};
      projectsList.forEach(p => { if (p.status) statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });
      setStatusData(Object.entries(statusCounts).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key, value, color: STATUS_COLORS[key] || '#94a3b8'
      })));

      const months = getLast6Months();
      setTrendData(months.map(m => ({
        label: m.label,
        count: projectsList.filter(p => {
          if (!p.createdAt) return false;
          const d = new Date(p.createdAt);
          return d.getFullYear() === m.year && d.getMonth() === m.month;
        }).length,
      })));

      const locCounts = {};
      projectsList.forEach(p => { if (p.location) locCounts[p.location] = (locCounts[p.location] || 0) + 1; });
      setLocationData(
        Object.entries(locCounts).map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value).slice(0, 5)
      );

      setTopProjects([...projectsList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5));

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const maxViews = Math.max(1, ...topProjects.map(p => p.views || 0));

  return (
    <AdminLayout>
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-primary to-secondary rounded-2xl p-6 mb-6 flex items-center justify-between text-white shadow-lg shadow-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold">داشبورد حرفه‌ای</h1>
            <p className="text-white/70 text-xs">نمای کلی پروژه‌های ساختمانی</p>
          </div>
        </div>
        <span className="text-xs bg-white/15 px-3 py-1.5 rounded-lg">
          {new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' })}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <MiniStat title="کل پروژه‌ها" value={stats.projects.toLocaleString('fa-IR')} icon={Building2} trend={`${stats.villas} ویلا / ${stats.apartments} آپارتمان`} trendUp />
        <MiniStat title="بازدید کل" value={stats.views.toLocaleString('fa-IR')} icon={Eye} />
        <MiniStat title="مقالات" value={stats.articles.toLocaleString('fa-IR')} icon={FileText} />
        <MiniStat title="پیام‌های تماس" value={stats.messages.toLocaleString('fa-IR')} icon={MessageSquare} />
      </div>

      {/* Row 1: Trend Line + Donut */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-1">روند ثبت پروژه</h3>
          <p className="text-xs text-gray-400 mb-4">۶ ماه اخیر</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v} پروژه`, 'ثبت‌شده']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Line type="monotone" dataKey="count" stroke="#1e40af" strokeWidth={2.5} dot={{ r: 5, fill: '#1e40af' }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">سهم وضعیت ساخت</h3>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} پروژه`, n]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-gray-600 dark:text-gray-300">{s.name}</span>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-center text-gray-400 py-16 text-sm">داده‌ای موجود نیست</p>}
        </div>
      </div>

      {/* Row 2: Location Bar + Top Projects */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-primary" />
            <h3 className="font-bold text-gray-800 dark:text-white">پروژه‌ها بر اساس موقعیت</h3>
          </div>
          {locationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={locationData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(v) => [`${v} پروژه`, '']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-400 py-16 text-sm">موقعیتی ثبت نشده</p>}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">پربازدیدترین پروژه‌ها</h3>
          {topProjects.length > 0 ? (
            <div className="space-y-4">
              {topProjects.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-gray-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-white truncate">{p.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{(p.views || 0).toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-l from-primary to-secondary rounded-full"
                        style={{ width: `${Math.max(4, ((p.views || 0) / maxViews) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-gray-400 py-16 text-sm">پروژه‌ای موجود نیست</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
