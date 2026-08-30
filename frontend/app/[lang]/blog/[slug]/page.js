import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Eye } from 'lucide-react';

async function getArticle(slug) {
  try {
    const res = await fetch(`http://localhost:5000/api/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params: { slug } }) {
  const article = await getArticle(slug);
  return {
    title: article?.metaTitle || article?.title,
    description: article?.metaDescription || article?.excerpt,
  };
}

export default async function ArticleDetailPage({ params: { lang, slug } }) {
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="section-padding max-w-4xl mx-auto" itemScope itemType="https://schema.org/Article">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${lang}`} className="hover:text-primary">صفحه اصلی</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/blog`} className="hover:text-primary">مقالات</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{article.title}</span>
      </nav>

      {article.featuredImage && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image src={article.featuredImage} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(article.createdAt).toLocaleDateString('fa-IR')}</span>
        <span className="flex items-center gap-1"><User size={16} /> {article.author}</span>
        <span className="flex items-center gap-1"><Eye size={16} /> {article.views} بازدید</span>
      </div>

      <h1 className="text-3xl font-bold mb-6 dark:text-white" itemProp="headline">{article.title}</h1>
      
      <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />

      {article.tags?.length > 0 && (
        <div className="mt-8 pt-8 border-t dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.featuredImage,
        "datePublished": article.createdAt,
        "dateModified": article.updatedAt,
        "author": { "@type": "Person", "name": article.author }
      })}} />
    </article>
  );
}
