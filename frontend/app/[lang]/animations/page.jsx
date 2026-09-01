'use client';
import { useState } from 'react';
import { projectAnimations } from '@/lib/data/media';
import { Sparkles, X } from 'lucide-react';

export default function AnimationsPage({ params: { lang } }) {
  const [active, setActive] = useState(null);

  return (
    <div className="section-padding">
      <h1 className="text-2xl lg:text-3xl font-bold text-brown-700 dark:text-gold-300 mb-2">
        {lang === 'fa' ? 'انیمیشن پروژه‌ها' : 'Project Animations'}
      </h1>
      <p className="text-brown-400 dark:text-silver-500 mb-10">
        {lang === 'fa' ? 'نمای نهایی و محوطه پروژه‌ها را به‌صورت انیمیشن ببینید' : 'View the final look and landscape of our projects in animation'}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectAnimations.map((a, i) => (
          <button key={i} onClick={() => setActive(a)} className="card p-0 overflow-hidden text-right group">
            <div className="relative h-44 bg-cream-200 dark:bg-navy-light flex items-center justify-center">
              <Sparkles size={40} className="text-gold-400 group-hover:scale-110 transition" />
            </div>
            <p className="p-4 text-sm font-medium text-brown-700 dark:text-silver-200">{a.title}</p>
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
              {lang === 'fa' ? 'انیمیشن به‌زودی اضافه می‌شود' : 'Animation coming soon'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}