'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, FileText, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'داشبورد', icon: LayoutDashboard, path: `/${locale}/admin/dashboard` },
    { name: 'پروژه‌ها', icon: Building2, path: `/${locale}/admin/projects` },
    { name: 'مقالات', icon: FileText, path: `/${locale}/admin/articles` },
    { name: 'تنظیمات', icon: Settings, path: `/${locale}/admin/settings` },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push(`/${locale}/admin/login`);
  };

  const currentItem = menuItems.find(i => i.path === pathname);

  return (
    <div className="min-h-screen bg-accent dark:bg-gray-900 flex" dir="rtl">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-dark text-white flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-bold text-sm">
              پ
            </div>
            <h2 className="text-lg font-bold">پنل مدیریت</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-l from-primary to-secondary text-white shadow-lg shadow-primary/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">مدیر سایت</p>
              <p className="text-xs text-gray-400 truncate">fatemeh</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu size={24} className="dark:text-white" />
          </button>
          <h1 className="font-bold text-gray-800 dark:text-white hidden lg:block">
            {currentItem?.name || 'پنل مدیریت'}
          </h1>
          <div className="w-8 h-8 rounded-full bg-accent dark:bg-gray-700 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
