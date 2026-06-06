import { getOptimizedImage } from '@/lib/utils';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  try {
    const res = await fetch(`${baseUrl}/cars/${slug}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      return { title: 'Car Not Found' };
    }

    const car = await res.json();
    const title = `${car.year} ${car.make} ${car.model} | Hariram Motors`;
    const description = car.description || `Buy this ${car.year} ${car.make} ${car.model} for ${car.price} at Hariram Motors in Surat.`;
    const ogImage = car.images?.[0]?.url ? getOptimizedImage(car.images[0].url, 1200) : '/logo.jpeg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/catalog/${slug}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${car.make} ${car.model}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (err) {
    return { title: 'Car | Hariram Motors' };
  }
}

export default function CarDetailLayout({ children }) {
  return children;
}
