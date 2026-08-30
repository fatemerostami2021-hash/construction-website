'use client';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, FileText, Loader2 } from 'lucide-react';

export default function AdminArticlesPage() {
  const locale = useLocale();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:5000/api/articles?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setArticles(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این مقاله اطمینان دارید؟')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setArticles(prev => prev.filter(a => a._id !== id));
      else alert('خطا در حذف');
    } catch { alert('خطا در اتصال'); }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">مدیریت مقالات</h1>
          <Link href={`/${locale}/admin/articles/new`} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition"><Plus size={18} /> مقاله جدید</Link>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 size={32} className="animate-spin mx-auto text-primary" /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400"><FileText size={48} className="mx-auto mb-4 opacity-50" /><p>هیچ مقاله‌ای ثبت نشده</p></div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">عنوان</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">دسته‌بندی</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">نویسنده</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">بازدید</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">وضعیت</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {articles.map(a => (
                    <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {a.featuredImage && <img src={a.featuredImage} alt="" className="w-10 h-10 rounded object-cover" />}
                          <span className="font-medium dark:text-white">{a.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{a.category || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{a.author || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{a.views || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${a.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{a.published ? 'منتشر شده' : 'پیش‌نویس'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/${locale}/blog/${a.slug}`} target="_blank" className="p-1.5 text-gray-500 hover:text-primary transition"><Eye size={16} /></Link>
                          <Link href={`/${locale}/admin/articles/${a._id}/edit`} className="p-1.5 text-gray-500 hover:text-blue-600 transition"><Pencil size={16} /></Link>
                          <button onClick={() => handleDelete(a._id)} className="p-1.5 text-gray-500 hover:text-red-600 transition"><Trash2 size={16} /></button>
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
