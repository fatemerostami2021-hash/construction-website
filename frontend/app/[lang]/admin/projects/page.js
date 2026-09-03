'use client';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, Building2, Loader2 } from 'lucide-react';

const STATUS_LABELS = {
  foundation: 'فونداسیون',
  skeleton: 'اسکلت',
  finishing: 'نازک‌کاری',
  delivered: 'تحویل شده'
};

const PROPERTY_LABELS = {
  villa: 'ویلا',
  apartment: 'آپارتمان'
};

export default function AdminProjectsPage() {
  const locale = useLocale();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API}/api/projects?limit=100`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.projects || []);
        setProjects(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این پروژه اطمینان دارید؟')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
      } else {
        alert('خطا در حذف');
      }
    } catch {
      alert('خطا در اتصال');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">مدیریت پروژه‌ها</h1>
          <Link href={`/${locale}/admin/projects/new`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
            <Plus size={18} /> پروژه جدید
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 size={32} className="animate-spin mx-auto text-primary" /></div>
        ) : !Array.isArray(projects) || projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>هیچ پروژه‌ای ثبت نشده</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">عنوان</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">نوع ملک</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">وضعیت ساخت</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">موقعیت</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">انتشار</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {projects.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.featuredImage || '/images/project-placeholder.svg'}
                            alt=""
                            className="w-10 h-10 rounded object-cover bg-gray-100"
                          />
                          <span className="font-medium dark:text-white">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${p.propertyType === 'villa' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-secondary/10 text-secondary'}`}>
                          {PROPERTY_LABELS[p.propertyType] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {STATUS_LABELS[p.status] || p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{p.location || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {p.published ? 'منتشر شده' : 'پیش‌نویس'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/${locale}/project/${p.slug}`} target="_blank"
                            className="p-1.5 text-gray-500 hover:text-primary transition"><Eye size={16} /></Link>
                          <Link href={`/${locale}/admin/projects/${p._id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 transition"><Pencil size={16} /></Link>
                          <button onClick={() => handleDelete(p._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 transition"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
