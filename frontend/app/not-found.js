import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">صفحه مورد نظر یافت نشد</p>
          <Link href="/fa" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </body>
    </html>
  );
}
