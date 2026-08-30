'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Instagram, Send, Linkedin } from 'lucide-react';

export default function Footer({ lang }) {
  const locale = useLocale();
  const t = useTranslations('Footer');
  const n = useTranslations('Nav');

  return (
    <footer className="bg-navy text-silver-300 border-t border-gold-500/20">
      {/* بخش اصلی فوتر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* معرفی برند */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-11 h-11 shrink-0">
                <Image src="/uploads/logo.png" alt={n('brandName')} fill className="object-contain" />
              </div>
              <span className="text-white font-bold text-base leading-tight">{n('brandName')}</span>
            </div>
            <p className="text-sm leading-relaxed text-silver-400">
              {t('companyDescription')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <SocialIcon icon={<Instagram size={16} />} href="#" />
              <SocialIcon icon={<Send size={16} />} href="#" />
              <SocialIcon icon={<Linkedin size={16} />} href="#" />
            </div>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h3 className="text-gold-400 font-bold text-sm mb-5 tracking-wide">{t('quickLinks')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}`} className="hover:text-gold-400 transition-colors">{n('home')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-gold-400 transition-colors">{n('about')}</Link></li>
              <li><Link href={`/${locale}/projects`} className="hover:text-gold-400 transition-colors">{n('projects')}</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-gold-400 transition-colors">{n('blog')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-gold-400 transition-colors">{n('contact')}</Link></li>
            </ul>
          </div>

          {/* خدمات */}
          <div>
            <h3 className="text-gold-400 font-bold text-sm mb-5 tracking-wide">{n('services')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}/services/design`} className="hover:text-gold-400 transition-colors">{n('servicesDesign')}</Link></li>
              <li><Link href={`/${locale}/services/construction`} className="hover:text-gold-400 transition-colors">{n('servicesConstruction')}</Link></li>
              <li><Link href={`/${locale}/services/renovation`} className="hover:text-gold-400 transition-colors">{n('servicesRenovation')}</Link></li>
              <li><Link href={`/${locale}/services/interior`} className="hover:text-gold-400 transition-colors">{n('servicesInterior')}</Link></li>
              <li><Link href={`/${locale}/services/landscape`} className="hover:text-gold-400 transition-colors">{n('servicesLandscape')}</Link></li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h3 className="text-gold-400 font-bold text-sm mb-5 tracking-wide">{t('contactUs')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span dir="ltr" className="text-left">{t('phone')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span>{t('email')}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span>{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* نوار پایینی */}
      <div className="border-t border-gold-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-silver-500">
          <p>© {new Date().getFullYear()} {n('brandName')} — {t('rights')}</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-gold-400 transition-colors">{t('privacy')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-gold-400 transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="w-9 h-9 rounded-full border border-gold-500/30 flex items-center justify-center text-silver-400 hover:text-gold-400 hover:border-gold-400 hover:bg-gold-400/10 transition-all">
      {icon}
    </a>
  );
}