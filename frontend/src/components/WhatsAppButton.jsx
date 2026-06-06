'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getWhatsAppLink } from '@/lib/utils';

export default function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={getWhatsAppLink(process.env.NEXT_PUBLIC_WHATSAPP || '+919876543210', 'Hi! I\'m interested in a car from Hariram Motors.')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 group"
      aria-label="Chat on WhatsApp"
      style={{ animation: 'pulse-glow 2s infinite' }}
    >
      <MessageCircle size={26} className="text-white" />
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
