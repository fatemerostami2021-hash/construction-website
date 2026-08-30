import { ThemeProvider } from '@/components/common/ThemeProvider';
import '@/styles/globals.css';

export const metadata = {
  title: 'شرکت ساختمانی',
  description: 'پروژه‌های ساختمانی با کیفیت از فونداسیون تا تحویل',
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
