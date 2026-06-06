'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Fuel, Calendar, Gauge, Users, Palette, Cog, Shield, MapPin, MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink } from '@/lib/utils';
import CarCard from '@/components/CarCard';

export default function CarDetailPage() {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${slug}`);
        setCar(res.data);
        // Fetch related cars by same make
        if (res.data.make) {
          const relRes = await api.get(`/cars?make=${res.data.make}&limit=3`);
          setRelated((relRes.data.cars || []).filter(c => c._id !== res.data._id).slice(0, 3));
        }
      } catch (err) {
        console.log('Car not found');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCar();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-[72px] min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="skeleton h-8 w-48 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton aspect-[4/3] rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/2 rounded" />
              <div className="skeleton h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
          <Link href="/catalog" className="btn-primary">Browse All Cars</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year },
    { icon: Fuel, label: 'Fuel', value: car.fuelType },
    { icon: Gauge, label: 'KM Driven', value: formatKms(car.kms) },
    { icon: Cog, label: 'Transmission', value: car.transmission },
    { icon: Users, label: 'Owners', value: car.owners ? `${car.owners}${car.owners === 1 ? 'st' : car.owners === 2 ? 'nd' : 'rd'} Owner` : null },
    { icon: Palette, label: 'Color', value: car.color },
    { icon: Shield, label: 'Insurance', value: car.insurance },
    { icon: MapPin, label: 'Registration', value: car.registrationState },
  ].filter(s => s.value);

  const whatsappLink = getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919876543210');

  return (
    <div className="pt-[72px] min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Back */}
        <Link href="/catalog" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--color-bg-surface)] cursor-pointer"
              onClick={() => setLightbox(true)}
            >
              {car.images?.length > 0 ? (
                <Image
                  src={getOptimizedImage(car.images[activeImage]?.url, 1200)}
                  alt={car.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                  No Image Available
                </div>
              )}
              {car.status === 'sold' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-3xl font-bold text-red-400 border-4 border-red-400 px-6 py-2 rounded-xl rotate-[-15deg]">SOLD</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {car.images?.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === activeImage ? 'border-[var(--color-primary)]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getOptimizedImage(img.url, 200)}
                      alt={`${car.title} - ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                {car.title || `${car.year} ${car.make} ${car.model}`}
              </h1>
            </div>

            {car.status !== 'sold' && (
              <span className="badge badge-available mb-4">Available</span>
            )}

            {/* Price */}
            <div className="mt-4 mb-6">
              <p className="text-3xl md:text-4xl font-bold gradient-text">{formatPrice(car.price)}</p>
            </div>

            {/* Specs Grid */}
            <div className="glass-card p-5 mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(226,176,74,0.1)] flex items-center justify-center flex-shrink-0">
                      <spec.icon size={16} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">{spec.label}</p>
                      <p className="text-sm font-medium">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Description</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Features */}
            {car.features?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            {car.status !== 'sold' && (
              <div className="flex gap-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center">
                  <MessageCircle size={18} /> Inquire on WhatsApp
                </a>
                <a href="tel:+919876543210" className="btn-outline flex-1 justify-center">
                  Call Us
                </a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Cars */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Similar <span className="gradient-text">Cars</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c, i) => (
                <CarCard key={c._id} car={c} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && car.images?.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightbox(false)}>
            <X size={28} />
          </button>
          <button
            className="absolute left-4 text-white/80 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i - 1 + car.images.length) % car.images.length); }}
          >
            <ChevronLeft size={36} />
          </button>
          <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getOptimizedImage(car.images[activeImage]?.url, 1600)}
              alt={car.title}
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-4 text-white/80 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setActiveImage((i) => (i + 1) % car.images.length); }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}
