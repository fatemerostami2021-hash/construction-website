'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Upload, X, Loader2, Plus, Save, Eye, EyeOff,
  ArrowRight, CheckCircle, AlertCircle, Hash,
  FileText, Image as ImageIcon, Search, Clock, Trash
} from 'lucide-react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MDPreview = dynamic(() => import('@uiw/react-md-editor').then(m => m.default.Markdown), { ssr: false });

const API = 'http://localhost:5000';

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-\-+/g, '-');
}

function WordCount({ text }) {
  const words = text?.trim().split(/\s+/).filter(Boolean).length || 0;
  const chars = text?.length || 0;
  const readTime = Math.max(1, Math.ceil(words / 200));
  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <span>{words} کلمه</span>
      <span>{chars} کاراکتر</span>
      <span className="flex items-center gap-1"><Clock size={12} /> {readTime} دقیقه مطالعه</span>
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
      ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
}

export default function ArticleFormPage({ isEdit = false }) {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params?.id;
  const dropRef = useRef(null);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    category: '', tags: [], author: 'شرکت ساختمانی',
    featuredImage: '', metaTitle: '', metaDescription: '',
    published: false
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [lastSaved, setLastSaved] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const autoSaveRef = useRef(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  // Load article for edit
  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    fetch(`${API}/api/articles/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const a = data.data || data;
        setForm({
          title: a.title || '', slug: a.slug || '', excerpt: a.excerpt || '',
          content: a.content || '', category: a.category || '',
          tags: a.tags || [], author: a.author || 'شرکت ساختمانی',
          featuredImage: a.featuredImage || '', metaTitle: a.metaTitle || '',
          metaDescription: a.metaDescription || '', published: a.published || false
        });
      })
      .catch(() => showToast('خطا در بارگذاری مقاله', 'error'))
      .finally(() => setLoading(false));
  }, [id, isEdit, token]);

  // Auto-save every 60 seconds
  useEffect(() => {
    if (!isEdit) return;
    autoSaveRef.current = setInterval(() => {
      if (form.title) handleAutoSave();
    }, 60000);
    return () => clearInterval(autoSaveRef.current);
  }, [form, isEdit]);

  const handleAutoSave = async () => {
    if (!id || !form.title) return;
    try {
      await fetch(`${API}/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      setLastSaved(new Date());
      showToast('ذخیره خودکار انجام شد', 'info');
    } catch { }
  };

  const set = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !isEdit ? { slug: slugify(value), metaTitle: value } : {})
    }));
  };

  // Image upload function
  const uploadImage = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویری انتخاب کنید', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم فایل نباید بیشتر از ۵ مگابایت باشد', 'error');
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API}/api/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const result = await res.json();
      if (res.ok) {
        set('featuredImage', result.medium?.url || result.thumbnail?.url || '');
        showToast('تصویر با موفقیت آپلود شد');
      } else throw new Error();
    } catch { showToast('خطا در آپلود تصویر', 'error'); }
    setUploading(false);
  }, [token]);

  // Drag & drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadImage(file);
  }, [uploadImage]);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !form.tags.includes(t)) {
      setForm(p => ({ ...p, tags: [...p.tags, t] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));

  const handleSubmit = async (publish = null) => {
    if (!form.title || !form.content) {
      showToast('عنوان و محتوا الزامی هستند', 'error');
      return;
    }
    setSaving(true);
    const payload = publish !== null ? { ...form, published: publish } : form;
    if (publish !== null) setForm(p => ({ ...p, published: publish }));
    try {
      const url = isEdit ? `${API}/api/articles/${id}` : `${API}/api/articles`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEdit ? 'مقاله بروزرسانی شد' : 'مقاله ذخیره شد');
        setTimeout(() => router.push(`/${locale}/admin/articles`), 1200);
      } else {
        const err = await res.json();
        showToast(err.message || 'خطا در ذخیره', 'error');
      }
    } catch { showToast('خطا در اتصال به سرور', 'error'); }
    setSaving(false);
  };

  const tabs = [
    { id: 'content', label: 'محتوا', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'settings', label: 'تنظیمات', icon: Hash },
  ];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <Toast message={toast.message} type={toast.type} />

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <ArrowRight size={20} className="dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold dark:text-white">{isEdit ? 'ویرایش مقاله' : 'مقاله جدید'}</h1>
            {lastSaved && (
              <p className="text-xs text-gray-400 mt-0.5">
                آخرین ذخیره: {lastSaved.toLocaleTimeString('fa-IR')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(p => !p)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${previewMode ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200'}`}
          >
            {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {previewMode ? 'ویرایش' : 'پیش‌نمایش'}
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-60"
          >
            <Save size={16} />
            پیش‌نویس
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {form.published ? 'بروزرسانی' : 'انتشار'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 max-w-4xl mx-auto">
          {form.featuredImage && (
            <img src={form.featuredImage} alt={form.title} className="w-full h-64 object-cover rounded-xl mb-8" />
          )}
          {form.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4 inline-block">{form.category}</span>
          )}
          <h1 className="text-3xl font-bold mb-4 dark:text-white">{form.title || 'بدون عنوان'}</h1>
          {form.excerpt && <p className="text-lg text-gray-500 mb-6 leading-relaxed">{form.excerpt}</p>}
          <div className="flex flex-wrap gap-2 mb-8">
            {form.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">#{tag}</span>
            ))}
          </div>
          <div data-color-mode="light" className="wmde-markdown-var">
            <MDPreview source={form.content || '*محتوایی وارد نشده*'} />
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="عنوان مقاله را بنویسید..."
                className="w-full text-2xl font-bold bg-transparent border-none outline-none dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
              />
              {form.title && (
                <p className="text-xs text-gray-400 mt-2 font-mono" dir="ltr">/{locale}/blog/{form.slug}</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <div className="flex border-b dark:border-gray-700">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        خلاصه مقاله
                        <span className={`mr-2 text-xs ${form.excerpt.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>{form.excerpt.length}/300</span>
                      </label>
                      <textarea
                        name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} maxLength={300}
                        placeholder="یک خلاصه جذاب از مقاله..."
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">محتوای مقاله *</label>
                        <WordCount text={form.content} />
                      </div>
                      <div data-color-mode="auto" className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                        <MDEditor
                          value={form.content}
                          onChange={val => set('content', val || '')}
                          height={480}
                          preview="edit"
                          textareaProps={{ placeholder: 'محتوای مقاله را اینجا بنویسید... (از Markdown پشتیبانی می‌کند)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                      تنظیمات SEO تأثیر مستقیم روی نمایش مقاله در گوگل دارد.
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Title</label>
                      <input name="metaTitle" value={form.metaTitle} onChange={handleChange}
                        placeholder="عنوان برای نمایش در گوگل (ترجیحاً ۵۰-۶۰ کاراکتر)"
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                      <p className={`text-xs mt-1 ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{form.metaTitle.length}/60</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meta Description
                        <span className={`mr-2 text-xs ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{form.metaDescription.length}/160</span>
                      </label>
                      <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={3} maxLength={180}
                        placeholder="توضیح کوتاه برای گوگل (۱۵۰-۱۶۰ کاراکتر ایده‌آله)"
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                    </div>
                    {(form.metaTitle || form.title) && (
                      <div className="p-4 bg-white border border-gray-200 rounded-xl">
                        <p className="text-xs text-gray-400 mb-2">پیش‌نمایش گوگل:</p>
                        <p className="text-blue-600 text-lg font-medium leading-tight">{form.metaTitle || form.title}</p>
                        <p className="text-green-700 text-xs mt-0.5" dir="ltr">yoursite.com/{locale}/blog/{form.slug}</p>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{form.metaDescription || form.excerpt || 'توضیحی وارد نشده'}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">دسته‌بندی</label>
                        <input name="category" value={form.category} onChange={handleChange}
                          placeholder="مثلاً: آموزش، اخبار"
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نویسنده</label>
                        <input name="author" value={form.author} onChange={handleChange}
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                      <input name="slug" value={form.slug} onChange={handleChange} dir="ltr"
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تگ‌ها</label>
                      <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                        {form.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                            #{tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          placeholder="تگ جدید + Enter"
                          className="flex-1 p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <button type="button" onClick={addTag}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-200 transition">
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <h3 className="font-bold dark:text-white mb-4">وضعیت انتشار</h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm dark:text-gray-300">{form.published ? 'منتشر شده' : 'پیش‌نویس'}</span>
                <div
                  onClick={() => set('published', !form.published)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${form.published ? 'bg-green-500' : 'bg-gray-300'} relative`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <h3 className="font-bold dark:text-white mb-4">تصویر شاخص</h3>

              {form.featuredImage ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={form.featuredImage} alt="تصویر شاخص" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => set('featuredImage', '')}
                    className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ) : (
                <div
                  ref={dropRef}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition cursor-pointer
                    ${dragOver ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={28} className="animate-spin text-primary" />
                      <span className="text-sm text-gray-400">در حال آپلود...</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">drag & drop یا کلیک کنید</span>
                      <span className="text-xs text-gray-400 mt-1">JPG، PNG، WebP — حداکثر ۵MB</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} disabled={uploading} />
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <h3 className="font-bold dark:text-white mb-3">آمار محتوا</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>تعداد کلمات</span>
                  <span className="font-medium dark:text-white">{form.content.trim().split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>زمان مطالعه</span>
                  <span className="font-medium dark:text-white">{Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 200))} دقیقه</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>تگ‌ها</span>
                  <span className="font-medium dark:text-white">{form.tags.length}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>تصویر شاخص</span>
                  <span className={form.featuredImage ? 'text-green-500' : 'text-red-400'}>{form.featuredImage ? '✓' : '✗'}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Meta Description</span>
                  <span className={form.metaDescription ? 'text-green-500' : 'text-red-400'}>{form.metaDescription ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}