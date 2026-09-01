'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { Menu, X, Phone, Moon, Sun, PlayCircle, Sparkles, MessageCircle, FolderOpen, ChevronDown, UserPlus, Globe } from 'lucide-react';

const LANGS = [
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const closeTimer = useRef(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setDark(!dark);
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
  const switchLocaleHref = (code) => `/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  const services = [
    { key: 'servicesDesign', href: `/${locale}/services/design` },
    { key: 'servicesConstruction', href: `/${locale}/services/construction` },
    { key: 'servicesResidential', href: `/${locale}/services/residential` },
    { key: 'servicesCommercial', href: `/${locale}/services/commercial` },
    { key: 'servicesRenovation', href: `/${locale}/services/renovation` },
    { key: 'servicesSupervision', href: `/${locale}/services/supervision` },
    { key: 'servicesInterior', href: `/${locale}/services/interior` },
    { key: 'servicesLandscape', href: `/${locale}/services/landscape` },
  ];

  const openServices = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-50/95 dark:bg-navy/95 backdrop-blur border-b border-gold-400/30 dark:border-gold-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-1 sm:gap-2">
            {/* لوگو + نام برند */}
            <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-gold-gradient/10 ring-1 ring-gold-400/30">
                <Image src="/uploads/logo.png" alt={t('brandName')} fill className="object-contain p-1" priority />
              </div>
              <div className="flex flex-col leading-tight min-w-0 max-w-[120px] sm:max-w-[180px] md:max-w-[250px]">
                <span className="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-brown-700 dark:text-gold-400 truncate">
                  {t('brandName')}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] text-brown-400 dark:text-silver-400 truncate hidden xs:block">
                  {t('slogan')}
                </span>
              </div>
            </Link>

            {/* منوی دسکتاپ */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-wrap">
              <Link href={`/${locale}`}
                className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition whitespace-nowrap ${isActive(`/${locale}`) && pathname === `/${locale}` ? 'text-gold-600 dark:text-gold-400 bg-gold-400/10' : 'text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400'}`}>
                {t('home')}
              </Link>

              {/* مگامنو خدمات */}
              <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleClose}>
                <button className="flex items-center gap-0.5 xl:gap-1 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400 transition whitespace-nowrap">
                  {t('services')} <ChevronDown size={12} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[480px] xl:w-[520px] bg-white dark:bg-navy border border-gold-400/20 dark:border-gold-500/25 rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-1 z-50">
                    {services.map(s => (
                      <Link key={s.key} href={s.href}
                        className="px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-xs xl:text-sm text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400 transition whitespace-nowrap">
                        {t(s.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href={`/${locale}/projects`}
                className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition whitespace-nowrap ${isActive(`/${locale}/projects`) ? 'text-gold-600 dark:text-gold-400 bg-gold-400/10' : 'text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400'}`}>
                {t('projects')}
              </Link>
              <Link href={`/${locale}/blog`}
                className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition whitespace-nowrap ${isActive(`/${locale}/blog`) ? 'text-gold-600 dark:text-gold-400 bg-gold-400/10' : 'text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400'}`}>
                {t('blog')}
              </Link>

              <span className="w-px h-4 xl:h-5 bg-gold-400/30 mx-0.5 xl:mx-1" />
              
              <Link href={`/${locale}/about`}
                className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition whitespace-nowrap ${isActive(`/${locale}/about`) ? 'text-gold-600 dark:text-gold-400 bg-gold-400/10' : 'text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400'}`}>
                {t('about')}
              </Link>
              <Link href={`/${locale}/contact`}
                className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition whitespace-nowrap ${isActive(`/${locale}/contact`) ? 'text-gold-600 dark:text-gold-400 bg-gold-400/10' : 'text-brown-600 dark:text-silver-300 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-400'}`}>
                {t('contact')}
              </Link>
            </nav>

            {/* سمت راست */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
              <a href="tel:02188776655" className="hidden xl:flex items-center gap-1 text-xs xl:text-sm text-gold-600 dark:text-gold-400 font-medium whitespace-nowrap">
                <Phone size={14} /> ۰۲۱-۸۸۷۷۶۶۵۵
              </a>

              <button onClick={toggleTheme} className="p-1.5 sm:p-2 rounded-lg hover:bg-gold-400/10 text-brown-600 dark:text-silver-300">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* لنگوییج سوییچر */}
              <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 p-1.5 sm:p-2 rounded-lg hover:bg-gold-400/10 text-brown-600 dark:text-silver-300">
                  <Globe size={16} />
                </button>
                {langOpen && (
                  <div className="absolute top-full left-0 mt-2 w-40 sm:w-44 bg-white dark:bg-navy border border-gold-400/20 dark:border-gold-500/25 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGS.map(l => (
                      <Link key={l.code} href={switchLocaleHref(l.code)} onClick={() => setLangOpen(false)}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition ${
                          l.code === locale ? 'bg-gold-400/10 text-gold-600 dark:text-gold-400 font-medium' : 'text-brown-600 dark:text-silver-300 hover:bg-gold-400/10'
                        }`}>
                        <span className="text-base sm:text-lg">{l.flag}</span> {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href={`/${locale}/register`}
                className="hidden md:flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm bg-gold-gradient text-navy rounded-lg font-medium shadow-gold-glow hover:brightness-110 transition whitespace-nowrap">
                <UserPlus size={13} /> {t('register')}
              </Link>

              <Link href={`/${locale}/admin/login`}
                className="hidden md:block px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm border border-gold-500 text-gold-600 dark:text-gold-400 dark:border-gold-400 rounded-lg hover:bg-gold-gradient hover:text-navy transition whitespace-nowrap">
                {t('admin')}
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 sm:p-2 text-brown-700 dark:text-gold-400">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* موبایل منو */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gold-400/20 bg-cream-50 dark:bg-navy max-h-[80vh] overflow-y-auto">
            <nav className="px-3 sm:px-4 py-2 sm:py-3 space-y-0.5">
              <Link href={`/${locale}`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-600 dark:text-silver-300">{t('home')}</Link>

              <button onClick={() => setServicesOpen(!servicesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-brown-600 dark:text-silver-300">
                {t('services')} <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="pr-3 sm:pr-4 space-y-0.5">
                  {services.map(s => (
                    <Link key={s.key} href={s.href} onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-brown-500 dark:text-silver-400 break-words">
                      {t(s.key)}
                    </Link>
                  ))}
                </div>
              )}

              <Link href={`/${locale}/projects`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-600 dark:text-silver-300">{t('projects')}</Link>
              <Link href={`/${locale}/blog`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-600 dark:text-silver-300">{t('blog')}</Link>
              <Link href={`/${locale}/about`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-600 dark:text-silver-300">{t('about')}</Link>
              <Link href={`/${locale}/contact`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brown-600 dark:text-silver-300">{t('contact')}</Link>

              <div className="pt-2 mt-2 border-t border-gold-400/15 flex flex-wrap items-center gap-2">
                <a href="tel:02188776655" className="flex items-center gap-1 text-sm text-gold-600 dark:text-gold-400 font-medium px-3 py-2">
                  <Phone size={16} /> ۰۲۱-۸۸۷۷۶۶۵۵
                </a>
              </div>

              <Link href={`/${locale}/register`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gold-600 dark:text-gold-400">{t('register')}</Link>
              <Link href={`/${locale}/admin/login`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gold-600 dark:text-gold-400">{t('admin')}</Link>
            </nav>
          </div>
        )}
      </header>

      {/* نوار دکمه‌های رسانه‌ای با لینک */}
      <div className="bg-metallic-dark border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            <MediaButton href={`/${locale}/testimonials`} icon={<MessageCircle size={16} />} label={t('testimonials')} />
            <MediaButton href={`/${locale}/videos`} icon={<PlayCircle size={16} />} label={t('projectVideos')} />
            <MediaButton href={`/${locale}/virtual-tour`} icon={<FolderOpen size={16} />} label={t('virtualTour')} />
            <MediaButton href={`/${locale}/animations`} icon={<Sparkles size={16} />} label={t('animations')} />
          </div>
        </div>
      </div>

      {/* دکمه‌های شناور پایین صفحه */}
      <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center gap-2 sm:gap-3 px-3 sm:px-4 pointer-events-none">
        <Link href={`/${locale}/projects`}
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-navy/95 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-medium shadow-lg hover:shadow-gold-glow transition whitespace-nowrap">
          <FolderOpen size={14} /> {t('floatingProjects')}
        </Link>
        <Link href={`/${locale}/contact`}
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gold-gradient text-navy text-xs sm:text-sm font-bold shadow-gold-glow hover:brightness-110 transition whitespace-nowrap">
          <Phone size={14} /> {t('floatingConsultation')}
        </Link>
      </div>
    </>
  );
}

function MediaButton({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg border border-gold-500/30 bg-navy/40 text-silver-300 hover:border-gold-400 hover:bg-gold-400/5 transition min-h-[40px] sm:min-h-[48px]">
      <span className="text-gold-400 flex-shrink-0">{icon}</span>
      <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gold-300 animate-blink-glow whitespace-nowrap">{label}</span>
    </Link>
  );
}