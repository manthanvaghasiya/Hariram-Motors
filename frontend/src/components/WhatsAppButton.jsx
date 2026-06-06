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
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-5">
      
      {/* Premium Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[0.16,1,0.3,1] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <IconChevronUp size={20} stroke={1.5} />
      </button>

      {/* Elegant WhatsApp Button */}
      <a
        href="https://wa.me/919373482016"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#1B9C4A] to-[#25D366] text-white rounded-full transition-transform duration-500 hover:scale-105 z-50 group shadow-[0_8px_32px_rgba(37,211,102,0.3)]"
        style={{ animation: 'pulse-ring 3s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}
        aria-label="Chat on WhatsApp"
      >
        <IconBrandWhatsapp size={28} stroke={1.5} />
        
        {/* Sleek Tooltip */}
        <span className="absolute right-full mr-5 px-4 py-2 bg-[#0A0A12] border border-white/[0.05] backdrop-blur-xl text-slate-300 text-[11px] font-bold uppercase tracking-widest rounded shadow-[0_8px_32px_rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
          Chat with an Expert
          <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#0A0A12] border-t border-r border-white/[0.05] rotate-45" />
        </span>
      </a>
      
    </div>
  );
}
