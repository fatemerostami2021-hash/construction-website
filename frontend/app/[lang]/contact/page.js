'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const TRANSLATIONS = {
  fa: {
    title: 'تماس با ما',
    subtitle: 'برای هرگونه سوال یا درخواست همکاری با ما در تماس باشید',
    phone: 'تلفن',
    email: 'ایمیل',
    address: 'آدرس',
    addressValue: 'تهران، خیابان آزادی، برج میلاد',
    formTitle: 'فرم تماس',
    fullName: 'نام و نام خانوادگی',
    subject: 'موضوع',
    message: 'پیام',
    send: 'ارسال پیام',
    successMessage: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
    errorMessage: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
    required: 'اجباری'
  },
  en: {
    title: 'Contact Us',
    subtitle: 'Get in touch for any questions or collaboration requests',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    addressValue: 'Tehran, Azadi St, Milad Tower',
    formTitle: 'Contact Form',
    fullName: 'Full Name',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    successMessage: 'Your message has been sent successfully.',
    errorMessage: 'Error sending message. Please try again.',
    required: 'Required'
  },
  ar: {
    title: 'اتصل بنا',
    subtitle: 'تواصل معنا لأي استفسار أو طلب تعاون',
    phone: 'هاتف',
    email: 'بريد إلكتروني',
    address: 'عنوان',
    addressValue: 'طهران، شارع آزادي، برج ميلاد',
    formTitle: 'نموذج الاتصال',
    fullName: 'الاسم الكامل',
    subject: 'الموضوع',
    message: 'الرسالة',
    send: 'إرسال الرسالة',
    successMessage: 'تم إرسال رسالتك بنجاح.',
    errorMessage: 'خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    required: 'مطلوب'
  },
  tr: {
    title: 'Bize Ulaşın',
    subtitle: 'Sorularınız veya işbirliği talepleriniz için bize ulaşın',
    phone: 'Telefon',
    email: 'E-posta',
    address: 'Adres',
    addressValue: 'Tahran, Azadi Cd, Milad Kulesi',
    formTitle: 'İletişim Formu',
    fullName: 'Ad Soyad',
    subject: 'Konu',
    message: 'Mesaj',
    send: 'Mesaj Gönder',
    successMessage: 'Mesajınız başarıyla gönderildi.',
    errorMessage: 'Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.',
    required: 'Gerekli'
  }
};

export default function ContactPage() {
  const { lang } = useParams();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fa;
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 dark:text-white">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Phone size={22} /></div>
                <div><h3 className="font-bold dark:text-white mb-1">{t.phone}</h3><p className="text-gray-600 dark:text-gray-400 text-sm ltr">+98 21 1234 5678</p></div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Mail size={22} /></div>
                <div><h3 className="font-bold dark:text-white mb-1">{t.email}</h3><p className="text-gray-600 dark:text-gray-400 text-sm ltr">info@company.com</p></div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><MapPin size={22} /></div>
                <div><h3 className="font-bold dark:text-white mb-1">{t.address}</h3><p className="text-gray-600 dark:text-gray-400 text-sm">{t.addressValue}</p></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold mb-6 dark:text-white">{t.formTitle}</h2>
              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2"><CheckCircle size={20} /><span>{t.successMessage}</span></div>
              )}
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2"><AlertCircle size={20} /><span>{t.errorMessage}</span></div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.fullName} *</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ltr focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.phone}</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ltr focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.subject}</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">{t.message} *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}{t.send}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
