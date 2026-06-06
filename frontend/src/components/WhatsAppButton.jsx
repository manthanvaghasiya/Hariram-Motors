'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { IconBrandWhatsapp, IconChevronUp } from '@tabler/icons-react';

export default function FloatingUtilities() {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(147,51,234,0.39)] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <IconChevronUp size={24} />
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919373482016"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25d366] text-white rounded-full hover:scale-110 transition-transform duration-300 z-50 group"
        style={{ animation: 'pulse-ring 2s infinite' }}
        aria-label="Chat on WhatsApp"
      >
        <IconBrandWhatsapp size={32} />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#25d366] text-white text-xs font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Need help? Chat with us!
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-[#25d366]" />
        </span>
      </a>
      
    </div>
  );
}
