'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { href: '/', label: 'Home' },
      { href: '/catalog', label: 'Browse Cars' },
      { href: '/sell-your-car', label: 'Sell Your Car' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Car Types',
    links: [
      { href: '/catalog?fuelType=Petrol', label: 'Petrol Cars' },
      { href: '/catalog?fuelType=Diesel', label: 'Diesel Cars' },
      { href: '/catalog?fuelType=CNG', label: 'CNG Cars' },
      { href: '/catalog?bodyType=SUV', label: 'SUVs' },
      { href: '/catalog?bodyType=Sedan', label: 'Sedans' },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '+919373482016';
  const address = process.env.NEXT_PUBLIC_ADDRESS || 'Simada to, Canal, BRTS Rd, near Setubandh Hills, Surat, Gujarat 395006';

  return (
    <footer className="bg-[var(--color-bg-card)] border-t border-[var(--color-border)]">
      {/* WhatsApp CTA Strip */}
      <div className="gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <Phone size={20} />
              <span className="font-semibold text-lg">Looking for your dream car? Let&apos;s talk!</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${phone}`}
                className="px-5 py-2.5 bg-white text-[var(--color-primary-dark)] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Call Now
              </a>
              <a
                href={getWhatsAppLink(phone, 'Hi! I\'m interested in buying a car from Hariram Motors.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp !py-2.5 !px-5 !text-sm"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white">
                <Image src="/logo.jpeg" alt="Hariram Motors Logo" fill className="object-cover" />
              </div>
              <div>
                <span className="text-lg font-bold">Hariram</span>
                <span className="text-lg font-bold gradient-text ml-1">Motors</span>
              </div>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
              Your trusted partner for premium pre-owned and new cars in Surat. Quality vehicles at the best prices with complete transparency.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Clock size={14} />
              <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)] mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
                <span>{address}</span>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  <Phone size={16} className="flex-shrink-0 text-[var(--color-primary)]" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@harimotors.com" className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  <Mail size={16} className="flex-shrink-0 text-[var(--color-primary)]" />
                  <span>info@harimotors.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
            <span>© {new Date().getFullYear()} Hariram Motors. All rights reserved.</span>
            <span>Designed by <a href="#" className="text-[var(--color-primary)] hover:underline">Webiox Digital Solutions</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
