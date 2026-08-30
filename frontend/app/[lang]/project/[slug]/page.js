import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ChevronLeft, Building2 } from 'lucide-react';

async function getProject(slug) {
  try {
    const res = await fetch(`http://localhost:5000/api/projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params: { slug } }) {
  const project = await getProject(slug);
  return {
    title: project?.metaTitle || project?.title || 'پروژه',
    description: project?.metaDescription || project?.summary,
  };
}

export default async function ProjectDetailPage({ params: { lang, slug } }) {
  const project = await getProject(slug);
  if (!project) notFound();

  const statusLabels = {
    foundation: 'فونداسیون',
    skeleton: 'اسکلت',
    finishing: 'نازک‌کاری',
    delivered: 'تحویل شده'
  };

  return (
    <article className="section-padding" itemScope itemType="https://schema.org/RealEstateListing">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${lang}`} className="hover:text-primary">صفحه اصلی</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/projects`} className="hover:text-primary">پروژه‌ها</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{project.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{statusLabels[project.status]}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
            <MapPin size={14} /> {project.location}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 dark:text-white" itemProp="name">{project.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed" itemProp="description">{project.description}</p>
      </header>

      {/* Featured Image */}
      {project.featuredImage && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
          <Image src={project.featuredImage} alt={project.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Timeline Phases */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">مراحل ساخت</h2>
        <div className="relative border-r-2 border-blue-200 dark:border-blue-800 pr-8 space-y-8">
          {project.phases?.map((phase, index) => (
            <div key={index} className="relative" itemScope itemType="https://schema.org/CreativeWork">
              <div className="absolute -right-[41px] w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900"></div>
              <div className="card dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={18} className="text-blue-600" />
                  <span className="text-sm text-gray-500">{phase.date ? new Date(phase.date).toLocaleDateString('fa-IR') : ''}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white" itemProp="name">{phase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4" itemProp="description">{phase.description}</p>
                
                {/* Phase Images Gallery */}
                {phase.images?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {phase.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image src={img.url} alt={img.alt || phase.title} fill className="object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Units Link */}
      {project.units?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">واحدها</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.units.map((unit) => (
              <Link key={unit._id} href={`/${lang}/project/${slug}/units/${unit.slug}`} className="card hover:border-primary transition-colors dark:bg-gray-800">
                <h3 className="font-bold mb-2 dark:text-white">{unit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{unit.area} متر مربع</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": project.title,
        "description": project.description,
        "url": `http://localhost:3001/${lang}/project/${slug}`,
        "address": { "@type": "PostalAddress", "addressLocality": project.location },
        "image": project.featuredImage
      })}} />
    </article>
  );
}
