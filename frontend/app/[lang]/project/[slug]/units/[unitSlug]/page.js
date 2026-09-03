const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Maximize, DollarSign, Building } from 'lucide-react';

async function getUnit(slug) {
  try {
    const res = await fetch(`${API}/api/units/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params: { unitSlug } }) {
  const unit = await getUnit(unitSlug);
  return {
    title: unit?.title || 'واحد',
    description: unit?.description,
  };
}

export default async function UnitDetailPage({ params: { lang, slug, unitSlug } }) {
  const unit = await getUnit(unitSlug);
  if (!unit) notFound();

  return (
    <article className="section-padding" itemScope itemType="https://schema.org/RealEstateListing">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${lang}`} className="hover:text-primary">صفحه اصلی</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/projects`} className="hover:text-primary">پروژه‌ها</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/project/${slug}`} className="hover:text-primary">{unit.project?.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{unit.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          {unit.images?.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {unit.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src={img.url} alt={img.alt || unit.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 flex items-center justify-center">
              <Building size={64} className="text-gray-400" />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4 dark:text-white" itemProp="name">{unit.title}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="card flex items-center gap-3 dark:bg-gray-800">
              <Maximize className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">متراژ</p>
                <p className="font-bold dark:text-white">{unit.area} م²</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 dark:bg-gray-800">
              <Bed className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">اتاق</p>
                <p className="font-bold dark:text-white">{unit.rooms}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 dark:bg-gray-800">
              <DollarSign className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">قیمت</p>
                <p className="font-bold dark:text-white">{unit.price?.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 dark:bg-gray-800">
              <Building className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">طبقه</p>
                <p className="font-bold dark:text-white">{unit.floor}</p>
              </div>
            </div>
          </div>

          <div className="card dark:bg-gray-800 mb-8">
            <h2 className="text-xl font-bold mb-4 dark:text-white">توضیحات</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" itemProp="description">{unit.description}</p>
          </div>

          {unit.features?.length > 0 && (
            <div className="card dark:bg-gray-800">
              <h2 className="text-xl font-bold mb-4 dark:text-white">امکانات</h2>
              <ul className="grid grid-cols-2 gap-2">
                {unit.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
