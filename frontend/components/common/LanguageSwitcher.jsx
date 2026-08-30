'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'fa', label: 'فارسی', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'tr', label: 'Türkçe', dir: 'ltr' }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const changeLang = (code) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${code}`);
    router.push(newPath);
    setOpen(false);
  };

  const current = languages.find(l => l.code === currentLocale) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
        <Globe size={16} />
        <span>{current.label}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[140px] z-50">
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => changeLang(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentLocale === lang.code ? 'text-primary font-medium bg-gray-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'}`}>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
