import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.js');

const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
