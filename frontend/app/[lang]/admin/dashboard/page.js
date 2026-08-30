'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/ui/StatCard';
import { Building2, FileText, MessageSquare, Eye, Home, LandPlot, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const STATUS_LABELS = { foundation: 'فونداسیون', skeleton: 'اسکلت', finishing: 'نازک‌کاری', delivered: 'تحویل شده' };
const STATUS_COLORS = { foundation: '#f59e0b', skeleton: '#3b82f6', finishing: '#8b5cf6', delivered: '#10b981' };

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, articles: 0, messages: 0, views: 0, villas: 0, apartments: 0 });
  const [statusData, setStatusData] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:5000/api/projects?limit=100', { headers }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:5000/api/articles?limit=1', { headers }).then(r => r.json()).catch(() => ({ totalPages: 0 })),
      fetch('http://localhost:5000/api/contacts', { headers }).then(r => r.json()).catch(() => []),
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
      projectsList.forEach(p => { statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });
      setStatusData(
        Object.entries(statusCounts).map(([key, value]) => ({
          name: STATUS_LABELS[key] || key,
          value,
          color: STATUS_COLORS[key] || '#94a3b8'
        }))
      );

      setRecentProjects(
        [...projectsList]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5)
      );

      setLoading(false);
    });
  }, []);

  const propertyChartData = [
    { name: 'ویلا', value: stats.villas },
    { name: 'آپارتمان', value: stats.apartments },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">داشبورد</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="کل پروژه‌ها" value={stats.projects} icon={Building2} color="primary" />
        <StatCard title="ویلا" value={stats.villas} icon={Home} color="green" />
        <StatCard title="آپارتمان" value={stats.apartments} icon={LandPlot} color="secondary" />
        <StatCard title="مقالات" value={stats.articles} icon={FileText} color="orange" />
        <StatCard title="پیام‌های تماس" value={stats.messages} icon={MessageSquare} color="orange" />
        <StatCard title="بازدید کل" value={stats.views} icon={Eye} color="primary" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">وضعیت ساخت پروژه‌ها</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-400 py-16 text-sm">داده‌ای موجود نیست</p>}
        </div>

        {/* Property Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">نوع ملک</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={propertyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">آخرین پروژه‌ها</h3>
          <div className="space-y-3">
            {recentProjects.length === 0 && <p className="text-center text-gray-400 py-16 text-sm">پروژه‌ای موجود نیست</p>}
            {recentProjects.map(p => (
              <div key={p._id} className="flex items-center gap-3">
                <img
                  src={p.featuredImage || '/images/project-placeholder.svg'}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{STATUS_LABELS[p.status] || p.status}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.published ? 'منتشر شده' : 'پیش‌نویس'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
