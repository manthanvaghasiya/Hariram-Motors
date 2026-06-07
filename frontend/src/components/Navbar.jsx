"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPhoneCall, IconBrandWhatsapp, IconMenu2, IconX, IconChevronRight } from '@tabler/icons-react';

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
                src="/without_background_logo.png"
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
              className="flex items-center justify-center gap-2 bg-white/5 border border-border-main text-text-primary px-3 h-[44px] sm:w-[120px] rounded-xl font-['Outfit'] font-bold text-sm hover:bg-white/10 transition-all duration-300"
            >
              <IconBrandWhatsapp size={18} stroke={2} className="text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Call Us Button */}
            <a
              href="tel:+919898558222"
              className="flex items-center justify-center gap-2 bg-white/5 border border-border-main text-text-primary px-3 h-[44px] sm:w-[120px] rounded-xl font-['Outfit'] font-bold text-sm hover:bg-white/10 transition-all duration-300"
            >
              <IconPhoneCall size={18} className="text-blue-400" />
              <span className="hidden sm:inline">Call Us</span>
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050508]/80 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-[#0a0a12] border-l border-white/10 shadow-2xl flex flex-col pt-24 px-6 pb-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-white/70 p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5 border border-white/10"
                aria-label="Close Menu"
              >
                <IconX size={24} />
              </button>

              {/* Navigation Links */}
              <div className="flex flex-col gap-3 mt-4">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      key={link.path}
                    >
                      <Link
                        href={link.path}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isActive 
                          ? "bg-purple-500/10 border-purple-500/30 text-white" 
                          : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="font-['Outfit'] font-bold text-xl tracking-wide">{link.name}</span>
                        <IconChevronRight size={20} className={isActive ? "text-purple-400" : "text-white/30 group-hover:text-white/60"} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto flex flex-col gap-4 pt-8 border-t border-white/10"
              >
                <a
                  href="tel:+919898558222"
                  className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-2 font-['Outfit'] font-bold text-lg text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-lg"
                >
                  <IconPhoneCall size={22} className="text-blue-400" />
                  Call +91 98985 58222
                </a>
                <a
                  href="https://wa.me/919898558222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-2 font-['Outfit'] font-bold text-lg text-white bg-[#25D366] hover:bg-[#20ba59] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                >
                  <IconBrandWhatsapp size={22} />
                  Chat on WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
