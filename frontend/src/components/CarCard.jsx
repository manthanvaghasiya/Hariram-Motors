'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconCalendarEvent, IconGasStation, IconManualGearbox, IconMapPin, IconHeart } from '@tabler/icons-react';
import { formatPrice, formatKms, getOptimizedImage } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function CarCard({ car, index = 0 }) {
  const imageUrl = car.images?.[0]?.url
    ? getOptimizedImage(car.images[0].url, 600)
    : '/placeholder-car.svg';

  // Calculate EMI hint (rough calculation: 10% interest over 5 years on 80% loan amount)
  const calculateEMI = (price) => {
    const loanAmount = price * 0.8;
    const rate = 0.10 / 12; // Monthly rate
    const months = 60;
    const emi = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return emi > 0 ? formatPrice(emi).replace('.00', '') : '9,800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group block"
    >
      <div className="bg-[#12121f] rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(147,51,234,0.3)] flex flex-col h-full relative">
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-red-500 hover:bg-black/60 transition-colors">
          <IconHeart size={18} />
        </button>

        {/* Image Area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0f0f1a]">
          <Image
            src={imageUrl}
            alt={car.title || `${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {car.condition === 'new' && (
              <span className="bg-green-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">New</span>
            )}
            {car.condition === 'used' && (
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">Used</span>
            )}
            {car.status === 'sold' && (
              <span className="bg-red-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">Sold</span>
            )}
            {car.isFeatured && car.status !== 'sold' && (
              <span className="bg-yellow-500/90 backdrop-blur-md text-black text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">Featured</span>
            )}
          </div>

          {/* Bottom Gradient Overlay (Fuel & KMS) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#12121f] to-transparent pt-12 pb-3 px-4 flex justify-between items-end z-10">
            <span className="flex items-center gap-1.5 text-white text-xs font-medium">
              <IconGasStation size={14} className="text-purple-400" /> {car.fuelType || 'Petrol'}
            </span>
            <span className="flex items-center gap-1.5 text-white text-xs font-medium">
              <IconMapPin size={14} className="text-purple-400" /> {formatKms(car.kms)} km
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-3 truncate group-hover:text-purple-400 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
            {car.title || `${car.year} ${car.make} ${car.model}`}
          </h3>

          {/* Specs Row */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pb-4 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <IconCalendarEvent size={16} className="text-gray-500" /> {car.year}
            </span>
            <span className="flex items-center gap-1.5">
              <IconManualGearbox size={16} className="text-gray-500" /> {car.transmission || 'Auto'}
            </span>
            <span className="flex items-center gap-1.5">
              <IconMapPin size={16} className="text-gray-500" /> {car.city || 'Surat'}
            </span>
          </div>

          {/* Price & EMI */}
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Price</p>
              <p className="text-xl font-bold text-white">{formatPrice(car.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded">
                EMI from ₹{calculateEMI(car.price)}/mo
              </p>
            </div>
          </div>

          {/* Button */}
          <Link href={`/catalog/${car.slug}`} className="mt-auto w-full bg-purple-500/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 hover:border-purple-600 py-3 rounded-xl font-semibold text-sm flex items-center justify-center transition-all duration-300">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
