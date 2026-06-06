'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  IconCar, IconUsers, IconCalendarEvent, IconShieldCheck, IconArrowRight, 
  IconCurrencyRupee, IconCertificate, IconHeadset, IconStarFilled, IconChevronLeft, IconChevronRight
} from '@tabler/icons-react';

import CarCard from '@/components/CarCard';
import HeroSection from '@/components/HeroSection';
import api from '@/lib/api';

// --- Helper Components --- //

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return <>{count}</>;
}

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
          api.get('/cars?limit=8&status=available'),
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

      {/* ════ SECTION 4: STATS COUNTER STRIP ════ */}
      <section className="bg-purple-900/40 border-y border-purple-500/10 mt-12 py-12 relative z-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {[
              { icon: IconUsers, count: 500, suffix: '+', label: 'Happy Customers' },
              { icon: IconCar, count: 150, suffix: '+', label: 'Cars in Stock' },
              { icon: IconCalendarEvent, count: 10, suffix: '+', label: 'Years of Trust' },
              { icon: IconShieldCheck, count: 100, suffix: '%', label: 'Transparent Pricing' },
            ].map((stat, i) => (
              <div key={i} className={`text-center ${i !== 3 && i !== 1 ? 'border-r border-white/10' : ''} md:border-r ${i === 3 ? 'md:border-none' : ''}`}>
                <stat.icon size={28} className="text-purple-400 mx-auto mb-3" />
                <h3 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                  <AnimatedCounter end={stat.count} />{stat.suffix}
                </h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 5: FEATURED CARS ════ */}
      <section className="py-20 desktop:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">OUR INVENTORY</p>
              <h2 className="text-[40px] text-white font-bold leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
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

      {/* ════ SECTION 6: ADVERTISEMENT BANNERS ════ */}
      {banners.length > 0 && (
        <section className="py-14 md:py-20 bg-[#0f0f1e]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 text-center">OFFERS & PROMOTIONS</p>
            <h2 className="text-[36px] text-white font-bold leading-tight mb-10 text-center" style={{ fontFamily: 'var(--font-outfit)' }}>
              Latest Deals
            </h2>

            {banners.length === 1 ? (
              <div className="relative rounded-2xl overflow-hidden h-[320px] shadow-2xl">
                <Image src={banners[0].desktopImageUrl} alt="Promo" fill className="object-cover hidden sm:block" />
                <Image src={banners[0].mobileImageUrl} alt="Promo" fill className="object-cover sm:hidden" />
              </div>
            ) : banners.length === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((b) => (
                  <div key={b._id} className="relative rounded-2xl overflow-hidden h-[280px] shadow-xl">
                     <Image src={b.desktopImageUrl} alt="Promo" fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl" ref={bannerRef}>
                <div className="flex">
                  {banners.map((b) => (
                    <div key={b._id} className="flex-[0_0_100%] min-w-0 relative h-[320px] sm:h-[400px]">
                      <Image src={b.desktopImageUrl} alt="Promo" fill className="object-cover hidden sm:block" />
                      <Image src={b.mobileImageUrl} alt="Promo" fill className="object-cover sm:hidden" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════ SECTION 7: WHY CHOOSE US ════ */}
      <section className="py-20 md:py-24 bg-[#0f0f1e]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">WHY HARIRAM MOTORS</p>
              <h2 className="text-[40px] text-white font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
                Why Thousands <br /> Trust Us
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We&apos;ve been serving Surat for over 10 years with honest pricing, genuine cars, and a no-pressure buying experience. Our commitment is to quality and customer satisfaction.
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

      {/* ════ SECTION 8: TESTIMONIALS ════ */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-24 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">TESTIMONIALS</p>
                <h2 className="text-[40px] text-white font-bold leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                  What Our Customers Say
                </h2>
                <p className="text-gray-400 mt-2 flex items-center gap-1 text-sm">
                  <IconStarFilled size={14} className="text-yellow-400" />
                  <IconStarFilled size={14} className="text-yellow-400" />
                  <IconStarFilled size={14} className="text-yellow-400" />
                  <IconStarFilled size={14} className="text-yellow-400" />
                  <IconStarFilled size={14} className="text-yellow-400" />
                  <span className="ml-2">4.9/5 from 500+ reviews</span>
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
              <div className="flex gap-6 -ml-4 pl-4 pr-4 sm:pr-0">
                {testimonials.map((t) => (
                  <div key={t._id} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-[320px] bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {t.photo?.url ? (
                          <Image src={t.photo.url} alt={t.customerName} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-lg">
                            {t.customerName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-semibold">{t.customerName}</p>
                          <p className="text-purple-400 text-sm">Bought: {t.carModel || 'Pre-owned Car'}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mt-3 text-yellow-400">
                        {[...Array(t.rating || 5)].map((_, j) => <IconStarFilled key={j} size={16} />)}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mt-4 italic">
                        "{t.review}"
                      </p>
                    </div>
                    <p className="text-gray-600 text-xs mt-6">
                      {new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════ SECTION 9: SELL YOUR CAR CTA ════ */}
      <section>
        <div className="bg-gradient-to-r from-[#4c1d95] to-[#2e1065] py-16 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
            <svg width="400" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white w-96 h-96">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H8.4c-.35 0-.68.18-.87.48L5 11.2V16h1M9 16v-2a2 2 0 114 0v2m5 0v-2a2 2 0 114 0v2" />
            </svg>
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-lg">
                <h2 className="text-[32px] md:text-[40px] text-white font-bold mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Want to Sell Your Car?
                </h2>
                <p className="text-white/80 text-base leading-relaxed">
                  Get the best price for your used car in Surat. Free inspection. Instant payment. Zero hassle.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Link href="/sell-your-car" className="bg-white text-purple-900 font-bold px-10 py-4 rounded-full text-lg hover:bg-purple-50 transition-colors shadow-xl">
                  Get Free Valuation <IconArrowRight size={20} className="inline ml-1" />
                </Link>
                <p className="text-white/60 text-sm">or call us at +91 93734 82016</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
