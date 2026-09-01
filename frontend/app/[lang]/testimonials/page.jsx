import { testimonialsData } from '@/lib/data/media';
import { Quote } from 'lucide-react';

export default function TestimonialsPage({ params: { lang } }) {
  return (
    <div className="section-padding">
      <h1 className="text-2xl lg:text-3xl font-bold text-brown-700 dark:text-gold-300 mb-2">
        {lang === 'fa' ? 'رضایت کارفرمایان' : 'Client Testimonials'}
      </h1>
      <p className="text-brown-400 dark:text-silver-500 mb-10">
        {lang === 'fa' ? 'تجربه واقعی کارفرمایانی که با ما پروژه ساختند' : 'Real experiences from clients who built with us'}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialsData.map((t, i) => (
          <div key={i} className="card">
            <Quote size={28} className="text-gold-400 mb-4" />
            <p className="text-brown-600 dark:text-silver-300 text-sm leading-relaxed mb-5">{t.quote}</p>
            <div>
              <p className="font-bold text-brown-700 dark:text-gold-300 text-sm">{t.name}</p>
              <p className="text-xs text-brown-400 dark:text-silver-500">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}