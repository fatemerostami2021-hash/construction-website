const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Building2, FileText, Phone, ArrowLeft } from 'lucide-react';

async function getProjects() {
  try {
    const res = await fetch(`${API}/api/projects?limit=3&published=true`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getArticles() {
  try {
    const res = await fetch(`${API}/api/articles?limit=3&published=true`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function HomePage({ params: { lang } }) {
  const t = await getTranslations('Home');
  const n = await getTranslations('Nav');
  const projects = await getProjects();
  const articles = await getArticles();

  const isFa = lang === 'fa';
  const stats = [
    { num: isFa ? '۱۵۰+' : '150+', label: t('statProjects') },
    { num: isFa ? '۲۰+' : '20+', label: t('statYears') },
    { num: isFa ? '۵۰+' : '50+', label: t('statExperts') },
    { num: isFa ? '۱۰۰٪' : '100%', label: t('statSatisfaction') },
  ];

  return (
    <div>
      {/* Hero Section با ویدیوی Full-Width */}
      <section className="relative w-full min-h-[90vh] md:min-h-[85vh] lg:min-h-[80vh] overflow-hidden">
        {/* ویدیوی بک‌گراند */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/uploads/hero-poster.jpg"
        >
          <source src="/uploads/hero-page2.mp4" type="video/mp4" />
          <source src="/uploads/hero-page1.mp4" type="video/mp4" />
        </video>

        {/* اوورلای ملایم - فقط برای خوانایی متن */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* محتوای هیرو */}
        <div className="relative z-10 flex items-center justify-center min-h-[90vh] md:min-h-[85vh] lg:min-h-[80vh] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* برندینگ */}
            <span className="inline-block text-gold-300 text-sm sm:text-base md:text-lg font-bold tracking-widest mb-3 sm:mb-4 uppercase drop-shadow-lg">
              {n('brandName')}
            </span>

            {/* عنوان اصلی */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight drop-shadow-lg">
              {t('heroTitle')}
            </h1>

            {/* زیرنویس */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-95 max-w-3xl mx-auto text-white px-2 drop-shadow-md">
              {t('heroSubtitle')}
            </p>

            {/* دکمه‌ها */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link href={`/${lang}/projects`} 
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gold-gradient text-navy rounded-lg font-bold text-sm sm:text-base shadow-gold-glow hover:brightness-110 transition">
                {t('viewProjects')}
              </Link>
              <Link href={`/${lang}/contact`} 
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white/80 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-white/20 transition backdrop-blur-sm">
                {t('contactUs')}
              </Link>
            </div>

            {/* نشانگر پایین (اسکرول) */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
              <div className="w-6 h-10 sm:w-7 sm:h-11 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
                <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white/60 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-cream-100 dark:bg-navy-light">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-600 dark:text-gold-400 mb-1 sm:mb-2">{s.num}</div>
              <div className="text-sm sm:text-base text-brown-600 dark:text-silver-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Projects */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brown-700 dark:text-gold-300">
              {t('latestProjects')}
            </h2>
            <Link href={`/${lang}/projects`} className="flex items-center gap-1 text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 font-medium text-sm sm:text-base">
              {t('viewAll')} <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-brown-400 dark:text-silver-500 text-center py-8">{t('noProjects')}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map(p => (
                <Link key={p._id} href={`/${lang}/project/${p.slug}`} className="group bg-white dark:bg-navy-light rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    {p.featuredImage ? (
                      <Image src={p.featuredImage} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-cream-200 dark:bg-navy flex items-center justify-center">
                        <Building2 size={40} className="text-brown-300 dark:text-silver-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold mb-1 text-brown-700 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-brown-500 dark:text-silver-400 text-sm line-clamp-2">{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12 sm:py-16 lg:py-20 bg-cream-100 dark:bg-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brown-700 dark:text-gold-300">
              {t('latestArticles')}
            </h2>
            <Link href={`/${lang}/blog`} className="flex items-center gap-1 text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 font-medium text-sm sm:text-base">
              {t('viewAll')} <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Link>
          </div>
          {articles.length === 0 ? (
            <p className="text-brown-400 dark:text-silver-500 text-center py-8">{t('noArticles')}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {articles.map(a => (
                <Link key={a._id} href={`/${lang}/blog/${a.slug}`} className="group bg-white dark:bg-navy-light rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    {a.featuredImage ? (
                      <Image src={a.featuredImage} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-cream-200 dark:bg-navy flex items-center justify-center">
                        <FileText size={40} className="text-brown-300 dark:text-silver-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold mb-1 text-brown-700 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-brown-500 dark:text-silver-400 text-sm line-clamp-2">{a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gold-gradient rounded-2xl p-6 sm:p-8 lg:p-12 text-center text-navy shadow-gold-glow">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{t('ctaTitle')}</h2>
          <p className="mb-6 sm:mb-8 opacity-90 font-medium text-sm sm:text-base">{t('ctaSubtitle')}</p>
          <Link href={`/${lang}/contact`} className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-navy text-gold-300 rounded-lg font-bold hover:bg-navy-light transition text-sm sm:text-base">
            <Phone size={16} className="sm:w-[18px] sm:h-[18px]" /> {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}