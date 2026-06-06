import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://harirammotors.com'),
  title: {
    default: 'Hariram Motors | Premium Pre-Owned & New Cars in Surat',
    template: '%s | Hariram Motors',
  },
  description: 'Hariram Motors — Your trusted partner for premium pre-owned and new cars in Surat, Gujarat. Browse our curated collection of certified vehicles at the best prices.',
  keywords: ['used cars surat', 'new cars surat', 'second hand cars surat', 'pre-owned cars', 'hariram motors', 'buy car surat', 'sell car surat'],
  openGraph: {
    title: 'Hariram Motors | Premium Cars in Surat',
    description: 'Your trusted partner for premium cars in Surat, Gujarat. Shop our wide selection of vehicles.',
    url: '/',
    siteName: 'Hariram Motors',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Hariram Motors Showcase',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <link href="https://fonts.googleapis.com" rel="preconnect"/>
          <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
          <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              },
            }}
          />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
