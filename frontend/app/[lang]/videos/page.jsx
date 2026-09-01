'use client';
import { useState } from 'react';
import { projectVideos } from '@/lib/data/media';
import { PlayCircle, X } from 'lucide-react';

export default function VideosPage({ params: { lang } }) {
  const [active, setActive] = useState(null);

  return (
    <div className="section-padding">
      <h1 className="text-2xl lg:text-3xl font-bold text-brown-700 dark:text-gold-300 mb-2">
        {lang === 'fa' ? 'ویدئو پروژه‌ها' : 'Project Videos'}
      </h1>
      <p className="text-brown-400 dark:text-silver-500 mb-10">
        {lang === 'fa' ? 'مراحل اجرای پروژه‌ها را به‌صورت تصویری ببینید' : 'Watch our construction process on video'}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectVideos.map((v, i) => (
          <button key={i} onClick={() => setActive(v)} className="card p-0 overflow-hidden text-right group">
            <div className="relative h-44 bg-cream-200 dark:bg-navy-light flex items-center justify-center">
              <PlayCircle size={44} className="text-gold-400 group-hover:scale-110 transition" />
            </div>
            <p className="p-4 text-sm font-medium text-brown-700 dark:text-silver-200">{v.title}</p>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-navy rounded-xl max-w-2xl w-full p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <p className="text-cream-50 font-medium text-sm">{active.title}</p>
              <button onClick={() => setActive(null)}><X size={20} className="text-silver-300" /></button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center text-silver-500 text-sm rounded-lg">
              {active.videoUrl ? (
                <video src={active.videoUrl} controls className="w-full h-full rounded-lg" />
              ) : (
                lang === 'fa' ? 'ویدیو به‌زودی اضافه می‌شود' : 'Video coming soon'
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}