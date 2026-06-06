'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconCalendarEvent, IconGasStation, IconManualGearbox, IconMapPin, IconHeart, IconArrowRight } from '@tabler/icons-react';
import { formatPrice, formatKms, getOptimizedImage } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function CarCard({ car, index = 0 }) {
  const imageUrl = car.images?.[0]?.url
    ? getOptimizedImage(car.images[0].url, 600)
    : '/placeholder-car.svg';

  const calculateEMI = (price) => {
    const loanAmount = price * 0.8;
    const rate = 0.10 / 12; 
    const months = 60;
    const emi = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return emi > 0 ? formatPrice(emi).replace('.00', '') : '9,800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group block h-full"
    >
      <div className="glass-premium overflow-hidden flex flex-col h-full relative cursor-pointer">
        
        {/* Sleek Minimal Wishlist Button */}
        <button className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-red-400 hover:bg-black/40 transition-all duration-300">
          <IconHeart size={18} stroke={1.5} />
        </button>

        {/* Edge-to-Edge Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A12]">
          <Image
            src={imageUrl}
            alt={car.title || `${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Refined Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {car.condition === 'new' && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">New</span>
            )}
            {car.condition === 'used' && (
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/20 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Used</span>
            )}
            {car.status === 'sold' && (
              <span className="bg-red-500/20 text-red-400 border border-red-500/20 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Sold</span>
            )}
            {car.isFeatured && car.status !== 'sold' && (
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/20 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Featured</span>
            )}
          </div>

          {/* Extended Cinematic Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A12] via-[#0A0A12]/40 to-transparent opacity-90 z-10" />

          {/* Floating Specs over Image */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end z-20">
            <span className="flex items-center gap-1.5 text-slate-300 text-xs font-medium tracking-wide">
              <IconGasStation size={16} stroke={1.5} className="text-purple-400" /> {car.fuelType || 'Petrol'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 text-xs font-medium tracking-wide">
              <IconMapPin size={16} stroke={1.5} className="text-purple-400" /> {formatKms(car.kms)} km
            </span>
          </div>
        </div>

        {/* Refined Content Area */}
        <div className="px-5 pb-5 pt-2 flex flex-col flex-grow bg-[#0A0A12]">
          
          <h3 className="text-xl font-bold text-slate-100 mb-4 truncate group-hover:text-purple-400 transition-colors duration-300 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
            {car.title || `${car.year} ${car.make} ${car.model}`}
          </h3>

          <div className="flex items-center gap-5 text-[13px] text-slate-400 mb-6 font-medium">
            <span className="flex items-center gap-1.5">
              <IconCalendarEvent size={18} stroke={1.5} className="text-slate-500" /> {car.year}
            </span>
            <span className="flex items-center gap-1.5">
              <IconManualGearbox size={18} stroke={1.5} className="text-slate-500" /> {car.transmission || 'Auto'}
            </span>
            <span className="flex items-center gap-1.5">
              <IconMapPin size={18} stroke={1.5} className="text-slate-500" /> {car.city || 'Surat'}
            </span>
          </div>

          {/* Elegant Footer: Price + Animated Link */}
          <div className="flex justify-between items-end mt-auto pt-5 border-t border-white/[0.03]">
            <div>
              <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase font-semibold">Price</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white tracking-tight">{formatPrice(car.price)}</p>
                <p className="text-[10px] text-purple-400/80 font-medium tracking-wider hidden sm:block">
                  EMI from ₹{calculateEMI(car.price)}/mo
                </p>
              </div>
            </div>
            
            <Link href={`/catalog/${car.slug}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <IconArrowRight size={20} stroke={2} className="group-hover:-rotate-45 transition-transform duration-500" />
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
