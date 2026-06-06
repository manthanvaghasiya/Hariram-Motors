'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Calendar, Gauge } from 'lucide-react';
import { formatPrice, formatKms, getOptimizedImage } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function CarCard({ car, index = 0 }) {
  const imageUrl = car.images?.[0]?.url
    ? getOptimizedImage(car.images[0].url, 600)
    : '/placeholder-car.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/catalog/${car.slug}`} className="block group">
        <div className="glass-card overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-surface)]">
            <Image
              src={imageUrl}
              alt={car.title || `${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {car.isFeatured && (
                <span className="badge badge-featured">Featured</span>
              )}
              {car.status === 'sold' && (
                <span className="badge badge-sold">Sold</span>
              )}
            </div>
            {/* Price Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
              <p className="text-xl font-bold text-white">{formatPrice(car.price)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2 truncate group-hover:text-[var(--color-primary)] transition-colors">
              {car.title || `${car.year} ${car.make} ${car.model}`}
            </h3>
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[var(--color-primary)]" />
                {car.year}
              </span>
              <span className="flex items-center gap-1.5">
                <Fuel size={13} className="text-[var(--color-primary)]" />
                {car.fuelType || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge size={13} className="text-[var(--color-primary)]" />
                {formatKms(car.kms)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
