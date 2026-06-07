'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeProvider } from './ThemeProvider';

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : "min-h-screen"}>{children}</main>
      {!isAdmin && <Footer />}
    </ThemeProvider>
  );
}
