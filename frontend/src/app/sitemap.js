export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://harirammotors.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Static routes
  const routes = [
    '',
    '/about',
    '/catalog',
    '/contact',
    '/sell-your-car',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic car routes
    // Limit to 1000 latest cars for the sitemap to prevent huge payloads
    const res = await fetch(`${apiUrl}/cars?limit=1000`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const carRoutes = (data.cars || []).map((car) => ({
        url: `${baseUrl}/catalog/${car.slug}`,
        lastModified: new Date(car.updatedAt || car.createdAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
      return [...routes, ...carRoutes];
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
