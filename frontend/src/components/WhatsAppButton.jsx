'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { IconBrandWhatsapp, IconChevronUp } from '@tabler/icons-react';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-purple-600 text-white flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <IconChevronUp size={22} className="md:w-6 md:h-6" />
      </button>

      {/* WhatsApp Button */}
      <div className="fixed bottom-5 md:bottom-6 right-4 md:right-6 z-50">
        <div className="relative">
          {/* Pulse ring sibling div */}
          <div className="absolute inset-0 w-[52px] h-[52px] md:w-14 md:h-14 rounded-full bg-[#25d366] opacity-75 animate-pulse-ring" />
          
          <a
            href="https://wa.me/919373482016"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-[52px] h-[52px] md:w-14 md:h-14 bg-[#25d366] text-text-primary rounded-full z-10"
            aria-label="Chat on WhatsApp"
          >
            <IconBrandWhatsapp size={28} className="md:w-8 md:h-8" />
          </a>
        </div>
      </div>
    </>
  );
}
