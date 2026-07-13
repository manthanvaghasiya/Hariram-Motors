'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  IconCalendarEvent,
  IconGasStation,
  IconManualGearbox,
  IconMapPin,
  IconHeart,
  IconDashboard,
  IconBrandWhatsapp
} from '@tabler/icons-react';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink } from '@/lib/utils';

export default function CarCard({ car, index = 0 }) {
  if (!car) return null;

  const title = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ''}`.trim();
  const images = car.images || [];
  const imageUrl = images.length > 0 ? (images[0].url || images[0]) : null;

  const targetBadges = ['Certified', 'Peti-pack', 'Valid Vimo'];
  const photoBadges = [];
  if (car.badges && Array.isArray(car.badges)) {
    photoBadges.push(...car.badges.filter(b => targetBadges.includes(b)));
  } else if (car.features && Array.isArray(car.features)) {
    photoBadges.push(...car.features.filter(f => targetBadges.some(tag => f.toLowerCase().includes(tag.toLowerCase()))));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col w-full h-full bg-[rgba(18,18,31,0.95)] rounded-2xl border border-border-subtle hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 hover:scale-[1.02] transition-all duration-300"
    >
      <Link href={`/catalog/${car.slug}`} className="absolute inset-0 z-10" aria-label={`View details of ${title}`} />

      <div className="flex flex-col h-full relative z-0">
        {/* Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={getOptimizedImage(imageUrl, 600)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Top Left Badge */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {car.status === 'sold' ? (
              <span className="bg-red-600/90 text-text-primary text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                Sold
              </span>
            ) : (
              photoBadges.map((badge, i) => (
                <span key={i} className="bg-purple-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-purple-500/30">
                  {badge}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 md:p-5 flex flex-col flex-grow">
          <h3 className="font-['Outfit'] font-bold text-base md:text-lg text-text-primary truncate mb-3 md:mb-4">
            {title}
          </h3>

          {/* Specs Row */}
          <div className="flex items-center gap-1.5 md:gap-2 text-text-secondary text-xs md:text-sm mt-auto whitespace-nowrap overflow-hidden text-ellipsis font-medium">
            <span>{car.fuelType || 'N/A'}</span>
            <span className="text-gray-600">•</span>
            <span>{car.transmission || 'N/A'}</span>
            <span className="text-gray-600">•</span>
            <span>{car.kms ? formatKms(car.kms) : 'N/A'}</span>
          </div>

          <hr className="border-border-main mt-3 mb-3" />

          {/* Price & Action */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-purple-400 font-bold text-xl md:text-2xl tracking-wide">
                {formatPrice(car.price)}
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 md:gap-3 relative z-20 mt-auto">
            <div className="w-full sm:flex-1 text-center border border-purple-600 text-purple-400 bg-transparent rounded-xl py-3 md:py-2.5 text-sm md:text-base font-bold group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[44px]">
              View Details
            </div>
            {car.status !== 'sold' && (
              <a
                href={getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919898558222')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-text-primary rounded-xl py-3 md:py-2.5 text-sm md:text-base font-bold shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all duration-200 cursor-pointer min-h-[44px]"
                onClick={(e) => e.stopPropagation()}
                title="Chat on WhatsApp"
              >
                <IconBrandWhatsapp size={18} stroke={2} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
