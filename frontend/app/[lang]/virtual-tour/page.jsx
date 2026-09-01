import { virtualTours } from '@/lib/data/media';
import { FolderOpen } from 'lucide-react';

export default function VirtualTourPage({ params: { lang } }) {
  return (
    <div className="section-padding">
      <h1 className="text-2xl lg:text-3xl font-bold text-brown-700 dark:text-gold-300 mb-2">
        {lang === 'fa' ? 'تور مجازی ۳۶۰' : '360° Virtual Tour'}
      </h1>
      <p className="text-brown-400 dark:text-silver-500 mb-10">
        {lang === 'fa' ? 'پروژه‌ها را پیش از بازدید حضوری تجربه کنید' : 'Experience our projects before visiting in person'}
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {virtualTours.map((v, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-4">
              <FolderOpen size={22} className="text-gold-400" />
              <p className="font-bold text-brown-700 dark:text-gold-300">{v.title}</p>
            </div>
            <div className="aspect-video bg-cream-200 dark:bg-navy-light rounded-lg flex items-center justify-center text-brown-400 dark:text-silver-500 text-sm">
              {v.tourUrl ? (
                <iframe src={v.tourUrl} className="w-full h-full rounded-lg" allowFullScreen />
              ) : (
                lang === 'fa' ? 'تور مجازی به‌زودی اضافه می‌شود' : 'Virtual tour coming soon'
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}