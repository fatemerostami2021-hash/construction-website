const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Building2, Filter } from 'lucide-react';

async function getProjects(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.status) params.set('status', searchParams.status);
  if (searchParams.type) params.set('type', searchParams.type);
  if (searchParams.page) params.set('page', searchParams.page);
  params.set('published', 'true');
  
  try {
    const res = await fetch(`${API}/api/projects?${params.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [], totalPages: 0 };
    return res.json();
  } catch {
    return { data: [], totalPages: 0 };
  }
}

const STATUS_LABELS = {
  foundation: 'فونداسیون',
  skeleton: 'اسکلت',
  finishing: 'نازک‌کاری',
  delivered: 'تحویل شده'
};

const STATUS_COLORS = {
  foundation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  skeleton: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  finishing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
};

export default async function ProjectsPage({ params: { lang }, searchParams }) {
  const data = await getProjects(searchParams);
  const projects = data.data || [];
  const totalPages = data.totalPages || 1;
  const currentPage = Number(searchParams.page) || 1;

  const buildFilterUrl = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    return `/${lang}/projects?${p.toString()}`;
  };

  return (
    <div className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 dark:text-white">پروژه‌ها</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">نمونه کارهای شرکت ساختمانی ما را مشاهده کنید</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-8">
          <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
            <Filter size={18} /><span className="font-medium">فیلترها</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              <Link href={buildFilterUrl('status', '')} className={`px-4 py-2 rounded-lg text-sm transition ${!searchParams.status ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>همه</Link>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <Link key={key} href={buildFilterUrl('status', key)} className={`px-4 py-2 rounded-lg text-sm transition ${searchParams.status === key ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>{label}</Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mr-auto">
              <Link href={buildFilterUrl('type', '')} className={`px-4 py-2 rounded-lg text-sm transition ${!searchParams.type ? 'bg-secondary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>همه انواع</Link>
              {['residential', 'commercial', 'industrial'].map(t => (
                <Link key={t} href={buildFilterUrl('type', t)} className={`px-4 py-2 rounded-lg text-sm transition ${searchParams.type === t ? 'bg-secondary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                  {t === 'residential' ? 'مسکونی' : t === 'commercial' ? 'تجاری' : 'صنعتی'}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-50" /><p>پروژه‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Link key={project._id} href={`/${lang}/project/${project.slug}`} className="card group overflow-hidden">
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                  {project.featuredImage ? (
                    <Image src={project.featuredImage} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><Building2 size={40} className="text-gray-400" /></div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status] || 'bg-gray-100'}`}>{STATUS_LABELS[project.status] || project.status}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-primary transition">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{project.summary}</p>
                {project.location && <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><MapPin size={14} /> {project.location}</span>}
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link key={page} href={buildFilterUrl('page', page.toString())}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition ${currentPage === page ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{page}</Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
