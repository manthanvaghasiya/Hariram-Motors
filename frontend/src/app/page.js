'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  IconCar, IconUsers, IconCalendarEvent, IconShieldCheck, IconArrowRight, 
  IconCurrencyRupee, IconCertificate, IconHeadset, IconStarFilled, IconChevronLeft, IconChevronRight, IconArrowsExchange
} from '@tabler/icons-react';

import CarCard from '@/components/CarCard';
import HeroSection from '@/components/HeroSection';
import GoogleReviews from '@/components/GoogleReviews';
import api from '@/lib/api';

// --- Main Page Component --- //

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Embla Carousels
  const [bannerRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [testiRef, testiApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  // Testimonial Controls
  const scrollPrev = useCallback(() => testiApi && testiApi.scrollPrev(), [testiApi]);
  const scrollNext = useCallback(() => testiApi && testiApi.scrollNext(), [testiApi]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, testRes, bannerRes] = await Promise.allSettled([
          api.get('/cars?limit=8&status=available&featured=true'),
          api.get('/happy-customers?limit=6'),
          api.get('/promo-banners?active=true'),
        ]);
        
        if (carsRes.status === 'fulfilled') setCars(carsRes.value.data.cars || []);
        if (testRes.status === 'fulfilled') setTestimonials(testRes.value.data || []);
        if (bannerRes.status === 'fulfilled') setBanners(bannerRes.value.data || []);
        
      } catch (error) {
        console.error('Error fetching home data');
      } finally {
        setLoadingCars(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <HeroSection />

      {/* ════ SECTION 3: PREMIUM DEALERSHIP SERVICES ════ */}
      <section className="py-20 bg-[#0a0a12] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-purple-600/20 blur-[80px]"></div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-purple-400 text-sm font-bold tracking-widest uppercase mb-3">Premium Dealership Services</p>
            <h2 className="text-3xl md:text-[40px] text-white font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              Surat's Complete Automotive Solution for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Buy, Sell & Exchange</span>
            </h2>
            <p className="text-gray-400 text-[16px] leading-relaxed">
              We are dedicated to elevating your car experience through transparent and reliable services. As Surat's premier automotive destination, our goal is to provide you with the finest facilities built on unwavering trust and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buy Card */}
            <div className="bg-[#12121f] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col group">
              <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <IconCar size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>Buy Certified Cars</h3>
              <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                150+ premium certified cars you can trust. Every car undergoes rigorous inspection for your complete security and peace of mind.
              </p>
              <Link href="/catalog" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                More info <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Sell Card */}
            <div className="bg-[#12121f] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col group">
              <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <IconCurrencyRupee size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>Sell Your Car Instantly</h3>
              <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                Get the best market value for your car through our transparent evaluation process and receive secure, instant payment.
              </p>
              <Link href="/sell-your-car" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                More info <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Exchange Card */}
            <div className="bg-[#12121f] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col group">
              <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <IconArrowsExchange size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>Best Exchange Value</h3>
              <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                Upgrade effortlessly! Get your favorite car with the absolute best exchange value for your old vehicle along with attractive benefits.
              </p>
              <Link href="/sell-your-car?mode=exchange" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                More info <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════ SECTION 4: FEATURED CARS (The Collection) ════ */}
      <section className="py-10 md:py-14 lg:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div>
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">OUR INVENTORY</p>
              <h2 className="text-3xl md:text-[40px] text-white font-bold leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                Featured Cars
              </h2>
              <p className="text-gray-400 mt-2">Handpicked vehicles at unbeatable prices</p>
            </div>
            <Link href="/catalog" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 group transition-colors">
              View All Cars <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingCars ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#12121f] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-10 bg-white/5 rounded w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
          ) : (
             <div className="text-center py-12 text-gray-500 bg-[#12121f] rounded-2xl border border-white/10">
               No cars currently featured. Browse our catalog for more.
             </div>
          )}
        </div>
      </section>

      {/* ════ SECTION 5: WHY CHOOSE US (The Hariram Standard) ════ */}
      <section className="py-10 md:py-14 lg:py-20 bg-[#0f0f1e]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-5">
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">WHY HARIRAM MOTORS</p>
              <h2 className="text-3xl md:text-[40px] text-white font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
                Why Thousands <br /> Trust Us
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We've been serving Surat for over 10 years with honest pricing, genuine cars, and a no-pressure buying experience. Our commitment is to quality and customer satisfaction.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white rounded-full px-6 py-3 transition-colors font-medium">
                Meet Our Team <IconArrowRight size={18} />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: IconShieldCheck, title: 'Verified Cars', desc: 'Every car undergoes a 100-point inspection before listing.' },
                { icon: IconCurrencyRupee, title: 'Transparent Pricing', desc: 'No hidden charges. Price you see is price you pay.' },
                { icon: IconCertificate, title: 'Full Documentation', desc: 'RC transfer, insurance, NOC — we handle everything.' },
                { icon: IconHeadset, title: 'After-Sale Support', desc: 'We\'re here even after the deal is done. 3 months support.' },
              ].map((feat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4 text-purple-400">
                    <feat.icon size={24} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════ SECTION 6: ADVERTISEMENT BANNERS ════ */}
      {banners.length > 0 && (
        <section className="py-10 md:py-14 lg:py-20 bg-[#0a0a12]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 text-center">OFFERS & PROMOTIONS</p>
            <h2 className="text-3xl md:text-[36px] text-white font-bold leading-tight mb-10 text-center" style={{ fontFamily: 'var(--font-outfit)' }}>
              Latest Deals
            </h2>

            {banners.length === 1 ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full">
                <img src={banners[0].desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block" />
                <img src={banners[0].mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden" />
              </div>
            ) : banners.length === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((b) => (
                  <div key={b._id} className="relative rounded-2xl overflow-hidden shadow-xl w-full">
                     <img src={b.desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block" />
                     <img src={b.mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl" ref={bannerRef}>
                <div className="flex">
                  {banners.map((b) => (
                    <div key={b._id} className="flex-[0_0_100%] min-w-0 relative w-full">
                      <img src={b.desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block" />
                      <img src={b.mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════ SECTION 7: GOOGLE REVIEWS ════ */}
      <GoogleReviews />

      {/* ════ SECTION 8: HAPPY CUSTOMERS (Delivery Photos) ════ */}
      {testimonials.length > 0 && (
        <section className="py-10 md:py-14 lg:py-20 overflow-hidden bg-[#0f0f1e]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <div>
                <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">OUR FAMILY</p>
                <h2 className="text-3xl md:text-[40px] text-white font-bold leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Happy Customers
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Seeing our customers drive away with a smile is our greatest reward.
                </p>
              </div>
              <div className="hidden md:flex gap-3">
                <button onClick={scrollPrev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <IconChevronLeft size={20} />
                </button>
                <button onClick={scrollNext} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <IconChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-visible" ref={testiRef}>
              <div className="flex gap-4 sm:gap-6 -ml-4 pl-4 pr-4 sm:pr-0">
                {testimonials.map((t) => (
                  <div key={t._id} className="flex-[0_0_90%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] min-w-[280px] bg-[#12121f] border border-white/10 rounded-3xl overflow-hidden flex flex-col group">
                    {/* Full Photo */}
                    <div className="relative aspect-[4/3] w-full bg-white/5 border-b border-white/10 overflow-hidden">
                      {t.photo?.url ? (
                        <Image src={t.photo.url} alt={t.customerName} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-400/50">
                          No Photo
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-1">{t.customerName}</h3>
                      <p className="text-purple-400 font-medium text-sm mb-4">
                        Took delivery of {t.carModel || 'a vehicle'}
                      </p>
                      {t.review && (
                        <p className="text-gray-300 text-sm leading-relaxed italic mt-auto">
                          "{t.review}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
