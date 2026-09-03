'use client';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, X, Upload, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';

const STATUS_OPTIONS = [
  { value: 'foundation', label: 'فونداسیون' },
  { value: 'skeleton', label: 'اسکلت' },
  { value: 'finishing', label: 'نازک‌کاری' },
  { value: 'delivered', label: 'تحویل شده' },
];

const TYPE_OPTIONS = [
  { value: 'residential', label: 'مسکونی' },
  { value: 'commercial', label: 'تجاری' },
  { value: 'industrial', label: 'صنعتی' },
];

export default function EditProjectPage() {
  const router = useRouter();
  const locale = useLocale();
  const { lang, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    title: '', slug: '', location: '', status: 'foundation', type: 'residential',
    summary: '', description: '', metaTitle: '', metaDescription: '',
    featuredImage: '', published: false, phases: []
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API}/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const p = data.data || data;
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          location: p.location || '',
          status: p.status || 'foundation',
          type: p.type || 'residential',
          summary: p.summary || '',
          description: p.description || '',
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          featuredImage: p.featuredImage || '',
          published: p.published || false,
          phases: p.phases?.map(ph => ({
            title: ph.title || '',
            description: ph.description || '',
            date: ph.date ? new Date(ph.date).toISOString().split('T')[0] : '',
            images: ph.images || [],
            order: ph.order || 0
          })) || []
        });
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  if (notFound) return <AdminLayout><div className="p-6 text-center dark:text-white">پروژه یافت نشد</div></AdminLayout>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e, phaseIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/upload/image`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: data
      });
      const result = await res.json();
      if (res.ok) {
        if (phaseIndex !== null) {
          const newPhases = [...form.phases];
          newPhases[phaseIndex].images.push({ url: result.thumbnail?.url || result.url, alt: '' });
          setForm(prev => ({ ...prev, phases: newPhases }));
        } else {
          setForm(prev => ({ ...prev, featuredImage: result.thumbnail?.url || result.url }));
        }
      }
    } catch { alert('خطا در آپلود تصویر'); }
    setUploading(false);
  };

  const addPhase = () => {
    setForm(prev => ({
      ...prev,
      phases: [...prev.phases, { title: '', description: '', date: '', images: [], order: prev.phases.length }]
    }));
  };

  const removePhase = (index) => {
    setForm(prev => ({ ...prev, phases: prev.phases.filter((_, i) => i !== index) }));
  };

  const updatePhase = (index, field, value) => {
    const newPhases = [...form.phases];
    newPhases[index][field] = value;
    setForm(prev => ({ ...prev, phases: newPhases }));
  };

  const removePhaseImage = (phaseIndex, imgIndex) => {
    const newPhases = [...form.phases];
    newPhases[phaseIndex].images = newPhases[phaseIndex].images.filter((_, i) => i !== imgIndex);
    setForm(prev => ({ ...prev, phases: newPhases }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push(`/${locale}/admin/projects`);
      } else {
        const err = await res.json();
        alert(err.message || 'خطا در بروزرسانی');
      }
    } catch { alert('خطا در اتصال'); }
    setSaving(false);
  };

  if (loading) return <AdminLayout><div className="p-6 text-center dark:text-white">در حال بارگذاری...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">ویرایش پروژه</h1>
          <Link href={`/${locale}/admin/projects`} className="text-sm text-gray-500 hover:text-primary">بازگشت</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-bold dark:text-white border-b dark:border-gray-700 pb-2">اطلاعات اصلی</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">عنوان *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Slug *</label>
                <input name="slug" value={form.slug} onChange={handleChange} required
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ltr" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">موقعیت</label>
                <input name="location" value={form.location} onChange={handleChange}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">وضعیت</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">نوع</label>
                <select name="type" value={form.type} onChange={handleChange}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">خلاصه</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} rows={2}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">توضیحات</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-bold dark:text-white border-b dark:border-gray-700 pb-2">SEO</h2>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Meta Title</label>
              <input name="metaTitle" value={form.metaTitle} onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Meta Description
                <span className={`text-xs mr-2 ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {form.metaDescription.length}/160
                </span>
              </label>
              <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} maxLength={180}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-bold dark:text-white border-b dark:border-gray-700 pb-2">تصویر شاخص</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-blue-800 transition">
                <Upload size={18} />
                <span>{uploading ? 'آپلود...' : 'تغییر تصویر'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {form.featuredImage && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img src={form.featuredImage} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm(p => ({ ...p, featuredImage: '' }))}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"><X size={14} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
              <h2 className="text-lg font-bold dark:text-white">مراحل ساخت</h2>
              <button type="button" onClick={addPhase} className="flex items-center gap-1 text-sm text-primary hover:text-blue-800">
                <Plus size={16} /> افزودن مرحله
              </button>
            </div>
            {form.phases.map((phase, idx) => (
              <div key={idx} className="border dark:border-gray-700 rounded-lg p-4 space-y-3 relative">
                <button type="button" onClick={() => removePhase(idx)} className="absolute top-2 left-2 text-red-500"><X size={18} /></button>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">عنوان</label>
                    <input value={phase.title} onChange={e => updatePhase(idx, 'title', e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">تاریخ</label>
                    <input type="date" value={phase.date} onChange={e => updatePhase(idx, 'date', e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">توضیحات</label>
                  <textarea value={phase.description} onChange={e => updatePhase(idx, 'description', e.target.value)} rows={2}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm rounded cursor-pointer w-fit">
                    <ImageIcon size={14} /> افزودن تصویر
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, idx)} disabled={uploading} />
                  </label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {phase.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded overflow-hidden">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePhaseImage(idx, i)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-5 h-5 text-primary rounded" />
              <span className="dark:text-white">انتشار</span>
            </label>
            <button type="submit" disabled={saving}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={18} className="animate-spin" />}
              بروزرسانی پروژه
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}