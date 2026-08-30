import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HtmlDirection from '@/components/common/HtmlDirection';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params: { lang } }) {
  if (!locales.includes(lang)) notFound();
  
  const messages = await getMessages();
  
  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <HtmlDirection />
      <div className="min-h-screen flex flex-col">
        <Header lang={lang} />
        <main className="flex-grow">{children}</main>
        <Footer lang={lang} />
      </div>
    </NextIntlClientProvider>
  );
}
