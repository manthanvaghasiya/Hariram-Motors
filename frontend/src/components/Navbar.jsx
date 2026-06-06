'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/sell-your-car', label: 'Sell Your Car' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-[rgba(15,15,26,0.92)] shadow-lg border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <Image src="/logo.jpeg" alt="Hariram Motors Logo" fill className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight">Hariram</span>
              <span className="text-lg font-bold gradient-text ml-1">Motors</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[var(--color-primary)] bg-[rgba(147,51,234,0.1)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-[rgba(147,51,234,0.1)]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <a
              href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP || '+919373482016'}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Phone size={16} />
              <span>Call Us</span>
            </a>
            <Link href="/catalog" className="btn-primary !py-2.5 !px-5 !text-sm">
              Browse Cars
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-[var(--color-bg-card)] border-t border-[var(--color-border)] shadow-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'text-[var(--color-primary)] bg-[rgba(147,51,234,0.1)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-[var(--color-border)] flex flex-col gap-3">
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP || '+919373482016'}`}
                  className="flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-medium text-[var(--color-text-primary)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]"
                >
                  <Phone size={16} />
                  Call Us
                </a>
                <Link href="/catalog" className="btn-primary w-full justify-center !py-3">
                  Browse Cars
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
