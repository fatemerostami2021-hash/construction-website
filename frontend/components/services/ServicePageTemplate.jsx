import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function ServicePageTemplate({ data, lang, phone = '021-88776655' }) {
  const { title, subtitle, intro, steps, whyUs } = data;

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-metallic-dark py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-3xl relative">
          <p className="text-gold-400 text-sm font-medium mb-3">{subtitle}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-snug mb-5">
            {title}
          </h1>
          <p className="text-silver-300 text-base sm:text-lg leading-relaxed mb-9 max-w-xl">
            {intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${lang}/contact`} className="btn-primary">
              {lang === 'fa' ? 'درخواست مشاوره' : 'Request Consultation'}
            </Link>
            <Link href={`/${lang}/projects`}
              className="px-7 py-3 rounded-lg border border-silver-400/30 text-cream-50 text-sm font-medium hover:bg-white/5 transition">
              {lang === 'fa' ? 'نمونه پروژه‌ها' : 'View Projects'}
            </Link>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-cream-100 dark:bg-navy-light">
        <h2 className="text-xl sm:text-2xl font-bold text-brown-700 dark:text-gold-300 mb-2">
          {lang === 'fa' ? 'مراحل انجام کار' : 'How We Work'}
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="border-t-2 border-gold-500 pt-4">
              <span className="text-xs font-bold text-gold-600 dark:text-gold-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-bold text-brown-700 dark:text-cream-100 mt-2 mb-1.5">
                {s.title}
              </h3>
              <p className="text-sm text-brown-500 dark:text-silver-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-white dark:bg-navy">
        <h2 className="text-xl sm:text-2xl font-bold text-brown-700 dark:text-gold-300 mb-6">
          {lang === 'fa' ? 'چرا ما را انتخاب کنید' : 'Why Choose Us'}
        </h2>
        <div className="max-w-2xl divide-y divide-gold-400/15">
          {whyUs.map(w => (
            <div key={w} className="flex gap-3 py-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
              <p className="text-sm sm:text-base text-brown-600 dark:text-silver-300 leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy px-4 sm:px-8 lg:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <h3 className="text-cream-50 text-lg font-bold mb-1">
            {lang === 'fa' ? 'برای پروژه بعدی خود مشاوره بگیرید' : 'Get a consultation for your next project'}
          </h3>
          <p className="text-silver-400 text-sm">
            {lang === 'fa' ? 'برآورد اولیه زمان و هزینه در اولین جلسه' : 'Initial time & cost estimate in your first session'}
          </p>
        </div>
        <a href={`tel:${phone.replace(/-/g, '')}`}
          className="flex items-center gap-2 bg-gold-gradient text-navy px-7 py-3 rounded-lg font-bold text-sm shadow-gold-glow shrink-0">
          <Phone size={16} /> {phone}
        </a>
      </section>
    </div>
  );
}