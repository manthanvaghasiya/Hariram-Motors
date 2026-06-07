"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IconPhoneCall, IconBrandWhatsapp, IconMenu2, IconX } from '@tabler/icons-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Sell Your Car', path: '/sell-your-car' }
  ];

  return (
    <>
      <nav className="bg-bg-primary/95 backdrop-blur-xl w-full top-0 sticky z-40 border-b border-border-subtle shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20">

          {/* Real Logo */}
          <Link className="hover:opacity-90 transition-opacity flex items-center group shrink-0" href="/">
            <div className="relative w-40 h-10 md:w-60 md:h-14 overflow-hidden flex items-center">
              <Image
                src="/logo.jpeg"
                alt="Hariram Motors Logo"
                fill
                className="object-contain mix-blend-lighten"
                sizes="(max-width: 768px) 160px, 240px"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-['Outfit'] text-[15px] h-full flex items-center transition-all duration-300 relative ${isActive
                      ? "text-text-primary font-bold"
                      : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-500 rounded-t-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919898558222"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 px-3 h-[44px] sm:w-[120px] rounded-xl font-['Outfit'] font-bold text-sm transition-all duration-300"
            >
              <IconBrandWhatsapp size={20} stroke={2} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Call Us Button (Visible sm+) */}
            <a
              href="tel:+919898558222"
              className="hidden sm:flex items-center justify-center gap-2 bg-white/5 border border-border-main text-text-primary w-[120px] h-[44px] rounded-xl font-['Outfit'] font-bold text-sm hover:bg-white/10 transition-all duration-300"
            >
              <IconPhoneCall size={18} className="text-blue-400" />
              Call Us
            </a>

            {/* Mobile Menu Toggle (Visible < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-text-primary p-2.5 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Open Menu"
            >
              <IconMenu2 size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* FULL SCREEN MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full h-full flex flex-col pt-20 px-6 pb-8 bg-transparent">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-text-primary p-2.5 hover:bg-white/10 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close Menu"
            >
              <IconX size={28} />
            </button>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`font-['Outfit'] text-[24px] py-4 border-b border-border-subtle transition-colors ${isActive ? "text-purple-400 font-bold" : "text-text-primary"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA Buttons */}
            <div className="mt-auto flex flex-col gap-4">
              <a
                href="tel:+919898558222"
                className="w-full h-[52px] rounded-xl flex items-center justify-center gap-2 font-['Outfit'] font-bold text-[16px] text-text-primary border border-border-main bg-white/5 hover:bg-white/10 transition-colors"
              >
                <IconPhoneCall size={20} className="text-blue-400" />
                Call +91 98985 58222
              </a>
              <a
                href="https://wa.me/919898558222"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[52px] rounded-xl flex items-center justify-center gap-2 font-['Outfit'] font-bold text-[16px] text-white bg-[#25D366] hover:bg-[#20ba59] transition-colors"
              >
                <IconBrandWhatsapp size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
