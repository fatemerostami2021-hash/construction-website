'use client';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Phone, Mail, MapPin, Globe, Instagram, Linkedin } from 'lucide-react';

const SETTING_FIELDS = [
  { key: 'company_name', label: 'نام شرکت', icon: Globe, type: 'text' },
  { key: 'phone', label: 'شماره تلفن', icon: Phone, type: 'text' },
  { key: 'email', label: 'ایمیل', icon: Mail, type: 'email' },
  { key: 'address', label: 'آدرس', icon: MapPin, type: 'textarea' },
  { key: 'instagram', label: 'اینستاگرام', icon: Instagram, type: 'text' },
  { key: 'linkedin', label: 'لینکدین', icon: Linkedin, type: 'text' },
  { key: 'about_text', label: 'متن درباره ما', icon: Globe, type: 'textarea' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        if (Array.isArray(data)) {
          data.forEach(s => { map[s.key] = s.value; });
        } else {
          Object.assign(map, data);
        }
        setSettings(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          fetch(`${API}/api/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ key, value })
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('خطا در ذخیره تنظیمات');
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">تنظیمات سایت</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-60"
        >
          <Save size={20} />
          {saving ? 'در حال ذخیره...' : saved ? '✓ ذخیره شد' : 'ذخیره تنظیمات'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
          {SETTING_FIELDS.map(({ key, label, icon: Icon, type }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Icon size={16} className="text-primary" />
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={settings[key] || ''}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              ) : (
                <input
                  type={type}
                  value={settings[key] || ''}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}