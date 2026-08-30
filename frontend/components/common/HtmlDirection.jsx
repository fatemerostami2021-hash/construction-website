'use client';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function HtmlDirection() {
  const locale = useLocale();
  
  useEffect(() => {
    const dir = locale === 'en' || locale === 'tr' ? 'ltr' : 'rtl';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);
  
  return null;
}
