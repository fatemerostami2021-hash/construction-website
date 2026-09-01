import { notFound } from 'next/navigation';
import { servicesData, serviceSlugs } from '@/lib/data/services';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';

export function generateStaticParams() {
  return serviceSlugs.map(slug => ({ slug }));
}

export default function ServicePage({ params: { lang, slug } }) {
  const service = servicesData[slug];
  if (!service) return notFound();

  const data = service[lang] || service.fa;

  return <ServicePageTemplate data={data} lang={lang} />;
}