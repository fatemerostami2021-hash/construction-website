import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const t = await getTranslations({ locale: params.lang, namespace: 'About' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function AboutPage({ params }) {
  const t = await getTranslations({ locale: params.lang, namespace: 'About' });
  
  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{t('subtitle')}</p>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-bold dark:text-white">{t('companyTitle') || 'درباره شرکت'}</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('description') || 'شرکت ساختمانی ما با سال‌ها تجربه در زمینه ساخت و ساز، آماده ارائه خدمات با کیفیت به شماست.'}
          </p>
        </div>
      </div>
    </div>
  );
}
