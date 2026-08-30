'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, Upload, Save, ArrowRight, Calendar, Image as ImageIcon } from 'lucide-react';

const API = 'http://localhost:5000';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-\-+/g, '-');
}

const EMPTY_FORM = {
  title: '', slug: '', summary: '', description: '',
  location: '', status: 'foundation', type: 'residential',
  propertyType: 'apartment',
  featuredImage: '', metaTitle: '', metaDescription: '',
  published: false, phases: []
};

const EMPTY_PHASE = { title: '', description: '', date: '', images: [] };

export default function ProjectForm({ projectId }) {
  const router = useRouter();
  const locale = useLocale();
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);

  const isEdit = !!projectId;

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    setNotFound(false);
    fetch(`${API}/api/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.message || `خطا ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        const p = data.data || data;
        if (!p || !p._id) { setNotFound(true); return; }
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          summary: p.summary || '',
          description: p.description || '',
          location: p.location || '',
          status: p.status || 'foundation',
          type: p.type || 'residential',
          propertyType: p.propertyType || 'apartment',
          featuredImage: p.featuredImage || '',
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          published: p.published || false,
          phases: p.phases || []
        });
      })
      .catch((err) => { setError(err.message || 'خطا در بارگذاری پروژه'); setNotFound(true); })
      .finally(() => setLoading(false));
  }, [projectId]);

  const set = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    set('title', title);
    if (!isEdit) set('slug', slugify(title));
  };

  const uploadMainImage = async (file) => {
    setUploadingMain(true);
    setError('');
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'خطا در آپلود');
      const result = json.data;
      const url = result?.medium?.url || result?.thumbnail?.url;
      set('featuredImage', url ? `${API}${url}` : '');
    } catch (err) { setError(err.message || 'خطا در آپلود تصویر'); }
    setUploadingMain(false);
  };

  const addPhase = () => setForm(p => ({ ...p, phases: [...p.phases, { ...EMPTY_PHASE }] }));
  const removePhase = (i) => setForm(p => ({ ...p, phases: p.phases.filter((_, idx) => idx !== i) }));
  const setPhase = (i, key, value) => setForm(p => {
    const phases = [...p.phases];
    phases[i] = { ...phases[i], [key]: value };
    return { ...p, phases };
  });

  const uploadPhaseImage = async (phaseIndex, file) => {
    setError('');
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'خطا در آپلود');
      const result = json.data;
      const rawUrl = result?.medium?.url || result?.thumbnail?.url;
      const newImg = {
        url: rawUrl ? `${API}${rawUrl}` : '',
        alt: file.name,
        width: result?.medium?.width,
        height: result?.medium?.height
      };
      setForm(p => {
        const phases = [...p.phases];
        phases[phaseIndex] = { ...phases[phaseIndex], images: [...(phases[phaseIndex].images || []), newImg] };
        return { ...p, phases };
      });
    } catch (err) { setError(err.message || 'خطا در آپلود تصویر مرحله'); }
  };

  const removePhaseImage = (phaseIndex, imgIndex) => {
    setForm(p => {
      const phases = [...p.phases];
      phases[phaseIndex] = { ...phases[phaseIndex], images: phases[phaseIndex].images.filter((_, i) => i !== imgIndex) };
      return { ...p, phases };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `${API}/api/projects/${projectId}` : `${API}/api/projects`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'خطا در ذخیره');
      }
      router.push(`/${locale}/admin/projects`);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  if (loading) return <AdminLayout><div className="text-center py-20 text-gray-400">در حال بارگذاری...</div></AdminLayout>;

  if (notFound) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-gray-500 mb-2">پروژه یافت نشد</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={() => router.push(`/${locale}/admin/projects`)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
            بازگشت به لیست پروژه‌ها
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <ArrowRight size={20} className="dark:text-white" />
            </button>
            <h1 className="text-2xl font-bold dark:text-white">{isEdit ? 'ویرایش پروژه' : 'پروژه جدید'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-gray-600 dark:text-gray-400">انتشار</span>
              <div
                onClick={() => set('published', !form.published)}
                className={`w-12 h-6 rounded-full transition-colors ${form.published ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'right-1' : 'left-1'}`} />
              </div>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
              <h2 className="font-bold text-lg dark:text-white border-b dark:border-gray-700 pb-3">اطلاعات اصلی</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان پروژه *</label>
                <input
                  type="text" value={form.title} onChange={handleTitleChange} required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ویلا لواسان"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                <input
                  type="text" value={form.slug} onChange={e => set('slug', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  placeholder="villa-lavasan"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع ملک</label>
                  <select value={form.propertyType} onChange={e => set('propertyType', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="villa">ویلا</option>
                    <option value="apartment">آپارتمان</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وضعیت ساخت</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="foundation">فونداسیون</option>
                    <option value="skeleton">اسکلت</option>
                    <option value="finishing">نازک‌کاری</option>
                    <option value="delivered">تحویل شده</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">موقعیت</label>
                <input
                  type="text" value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="تهران، الهیه"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">خلاصه</label>
                <textarea rows={2} value={form.summary} onChange={e => set('summary', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="خلاصه کوتاه پروژه..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">توضیحات کامل</label>
                <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="توضیحات کامل پروژه..." />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between border-b dark:border-gray-700 pb-3 mb-6">
                <h2 className="font-bold text-lg dark:text-white">مراحل ساخت</h2>
                <button type="button" onClick={addPhase}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition">
                  <Plus size={16} /> افزودن مرحله
                </button>
              </div>

              {form.phases.length === 0 && (
                <p className="text-center text-gray-400 py-8">هنوز مرحله‌ای اضافه نشده</p>
              )}

              <div className="space-y-6">
                {form.phases.map((phase, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium dark:text-white">مرحله {i + 1}</span>
                      <button type="button" onClick={() => removePhase(i)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input type="text" value={phase.title} onChange={e => setPhase(i, 'title', e.target.value)}
                        placeholder="عنوان مرحله (مثلاً: فونداسیون)"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />

                      <textarea rows={2} value={phase.description} onChange={e => setPhase(i, 'description', e.target.value)}
                        placeholder="توضیحات این مرحله..."
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none" />

                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <input type="date" value={phase.date?.slice(0, 10) || ''} onChange={e => setPhase(i, 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-3 mb-2">
                          {phase.images?.map((img, imgIdx) => (
                            <div key={imgIdx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removePhaseImage(i, imgIdx)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <Trash2 size={14} className="text-white" />
                              </button>
                            </div>
                          ))}
                          <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                            <ImageIcon size={18} className="text-gray-400" />
                            <span className="text-xs text-gray-400 mt-1">آپلود</span>
                            <input type="file" accept="image/*" className="hidden"
                              onChange={e => e.target.files[0] && uploadPhaseImage(i, e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="font-bold text-lg dark:text-white border-b dark:border-gray-700 pb-3 mb-4">تصویر شاخص</h2>
              {form.featuredImage ? (
                <div className="relative rounded-xl overflow-hidden mb-3">
                  <img src={form.featuredImage} alt="تصویر شاخص" className="w-full h-40 object-cover" />
                  <button type="button" onClick={() => set('featuredImage', '')}
                    className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary transition mb-3 bg-cover bg-center" style={{ backgroundImage: "url('/images/project-placeholder.svg')" }}>
                  {uploadingMain ? (
                    <span className="text-gray-500 text-sm bg-white/80 px-3 py-1 rounded">در حال آپلود...</span>
                  ) : (
                    <span className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded flex items-center gap-2">
                      <Upload size={16} /> کلیک برای آپلود
                    </span>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && uploadMainImage(e.target.files[0])} />
                </label>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
              <h2 className="font-bold text-lg dark:text-white border-b dark:border-gray-700 pb-3">سئو</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Title</label>
                <input type="text" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="عنوان برای گوگل" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Description
                  <span className={`mr-2 text-xs ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.metaDescription.length}/160
                  </span>
                </label>
                <textarea rows={3} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                  placeholder="توضیح کوتاه برای گوگل (حداکثر ۱۶۰ کاراکتر)" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
