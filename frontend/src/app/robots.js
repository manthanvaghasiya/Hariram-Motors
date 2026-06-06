export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harirammotors.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
