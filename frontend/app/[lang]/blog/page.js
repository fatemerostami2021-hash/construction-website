import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, FileText } from 'lucide-react';

async function getArticles(sp) {
  const p = new URLSearchParams();
  if (sp.category) p.set('category', sp.category);
  if (sp.page) p.set('page', sp.page);
  p.set('published', 'true');
  try {
    const r = await fetch(`http://localhost:5000/api/articles?${p.toString()}`, { next: { revalidate: 60 } });
    if (!r.ok) return { data: [], totalPages: 0 };
    return r.json();
  } catch { return { data: [], totalPages: 0 }; }
}

async function getCategories() {
  try {
    const r = await fetch('http://localhost:5000/api/articles?limit=100&published=true', { next: { revalidate: 3600 } });
    const d = await r.json();
    const a = d.data || [];
    return [...new Set(a.map(x => x.category).filter(Boolean))];
  } catch { return []; }
}

function fu(key, val, sp, lang) {
  const q = new URLSearchParams(sp);
  if (val) q.set(key, val); else q.delete(key);
  q.delete('page'); return `/${lang}/blog?${q.toString()}`;
}

export default async function BlogPage({ params: { lang }, searchParams }) {
  const d = await getArticles(searchParams);
  const articles = d.data || [];
  const tp = d.totalPages || 1;
  const cp = Number(searchParams.page) || 1;
  const categories = await getCategories();

  return (
    <div className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 dark:text-white">مقالات</h1>
          <p className="text-gray-600 dark:text-gray-400">آخرین اخبار و مقالات حوزه ساخت و ساز</p>
        </div>

        {categories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-8">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">دسته‌بندی:</span>
              <Link href={fu('category', '', searchParams, lang)} className={`px-4 py-2 rounded-lg text-sm transition ${!searchParams.category ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>همه</Link>
              {categories.map(c => (<Link key={c} href={fu('category', c, searchParams, lang)} className={`px-4 py-2 rounded-lg text-sm transition ${searchParams.category === c ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{c}</Link>))}
            </div>
          </div>
        )}

        {articles.length === 0 ? (<div className="text-center py-16 text-gray-500"><FileText size={48} className="mx-auto mb-4 opacity-50" /><p>مقاله‌ای یافت نشد</p></div>) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(a => (
              <Link key={a._id} href={`/${lang}/blog/${a.slug}`} className="card group overflow-hidden">
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                  {a.featuredImage ? (<Image src={a.featuredImage} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />) : (<div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><FileText size={40} className="text-gray-400" /></div>)}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {a.category && <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">{a.category}</span>}
                  <span className="flex items-center gap-1"><Calendar size={12} />{new Date(a.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-primary transition line-clamp-2">{a.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{a.excerpt}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500"><User size={14} /><span>{a.author || 'نویسنده'}</span></div>
                {a.tags?.length > 0 && (<div className="flex flex-wrap gap-1 mt-3 pt-3 border-t dark:border-gray-700">{a.tags.slice(0, 3).map(t => (<span key={t} className="text-xs text-gray-500 flex items-center gap-0.5"><Tag size={10} />{t}</span>))}</div>)}
              </Link>
            ))}
          </div>
        )}

        {tp > 1 && (<div className="flex justify-center gap-2 mt-12">{Array.from({ length: tp }, (_, i) => i + 1).map(p => (<Link key={p} href={fu('page', String(p), searchParams, lang)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition ${cp === p ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>{p}</Link>))}</div>)}
      </div>
    </div>
  );
}
