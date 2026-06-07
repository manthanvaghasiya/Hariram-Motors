'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  IconCar, IconUsers, IconCalendarEvent, IconShieldCheck, IconArrowRight, 
  IconCurrencyRupee, IconCertificate, IconHeadset, IconStarFilled, IconChevronLeft, IconChevronRight, IconArrowsExchange, IconMessageCircle
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
  const [bannerRef, bannerApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [testiRef, testiApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 3500, stopOnInteraction: false })]);

  // Carousel Controls
  const scrollTestiPrev = useCallback(() => testiApi && testiApi.scrollPrev(), [testiApi]);
  const scrollTestiNext = useCallback(() => testiApi && testiApi.scrollNext(), [testiApi]);
  
  const scrollBannerPrev = useCallback(() => bannerApi && bannerApi.scrollPrev(), [bannerApi]);
  const scrollBannerNext = useCallback(() => bannerApi && bannerApi.scrollNext(), [bannerApi]);

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
      <section className="pt-12 md:pt-32 pb-20 bg-[#0a0a12] relative z-10 overflow-hidden">
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

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 relative">
              
              {/* CARD 1 (01) - Top Left */}
              <div className="bg-[#1a0e2e] border border-white/10 rounded-[2rem] p-8 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-shadow group">
                {/* Outward Right Arrow */}
                <div className="hidden sm:block absolute top-1/2 -right-[16px] w-8 h-8 bg-[#1a0e2e] rotate-45 transform -translate-y-1/2 z-10 border-t border-r border-white/10 rounded-[4px]"></div>
                
                <h3 className="font-['Outfit'] font-extrabold text-4xl text-white mb-3">01</h3>
                <h4 className="font-['Outfit'] font-bold text-xl text-white mb-4">Verified Cars</h4>
                <div className="w-12 border-b-2 border-dashed border-white/20 mb-5"></div>
                <p className="text-sm text-gray-400 leading-relaxed font-['Inter']">Every car undergoes a 100-point inspection before listing.</p>
              </div>

              {/* CARD 2 (02) - Top Right */}
              <div className="bg-[#1a0e2e] border border-white/10 rounded-[2rem] p-8 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-shadow group">
                {/* Inward Left Cutout */}
                <div className="hidden sm:block absolute top-1/2 -left-[17px] w-[34px] h-[34px] bg-[#0f0f1e] rotate-45 transform -translate-y-1/2 z-20 border-t border-r border-white/10 rounded-[4px]"></div>
                {/* Outward Bottom Arrow */}
                <div className="hidden sm:block absolute -bottom-[16px] left-1/2 w-8 h-8 bg-[#1a0e2e] rotate-45 transform -translate-x-1/2 z-10 border-r border-b border-white/10 rounded-[4px]"></div>

                <h3 className="font-['Outfit'] font-extrabold text-4xl text-white mb-3">02</h3>
                <h4 className="font-['Outfit'] font-bold text-xl text-white mb-4">Transparent Pricing</h4>
                <div className="w-12 border-b-2 border-dashed border-white/20 mb-5"></div>
                <p className="text-sm text-gray-400 leading-relaxed font-['Inter']">No hidden charges. Price you see is price you pay.</p>
              </div>

              {/* CARD 4 (04) - Bottom Left */}
              <div className="bg-[#1a0e2e] border border-white/10 rounded-[2rem] p-8 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-shadow group order-4 sm:order-3">
                {/* Inward Right Cutout */}
                <div className="hidden sm:block absolute top-1/2 -right-[17px] w-[34px] h-[34px] bg-[#0f0f1e] rotate-45 transform -translate-y-1/2 z-20 border-b border-l border-white/10 rounded-[4px]"></div>

                <h3 className="font-['Outfit'] font-extrabold text-4xl text-white mb-3">04</h3>
                <h4 className="font-['Outfit'] font-bold text-xl text-white mb-4">After-Sale Support</h4>
                <div className="w-12 border-b-2 border-dashed border-white/20 mb-5"></div>
                <p className="text-sm text-gray-400 leading-relaxed font-['Inter']">We're here even after the deal is done. 3 months support.</p>
              </div>

              {/* CARD 3 (03) - Bottom Right */}
              <div className="bg-[#1a0e2e] border border-white/10 rounded-[2rem] p-8 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-shadow group order-3 sm:order-4">
                {/* Inward Top Cutout */}
                <div className="hidden sm:block absolute -top-[17px] left-1/2 w-[34px] h-[34px] bg-[#0f0f1e] rotate-45 transform -translate-x-1/2 z-20 border-r border-b border-white/10 rounded-[4px]"></div>
                {/* Outward Left Arrow */}
                <div className="hidden sm:block absolute top-1/2 -left-[16px] w-8 h-8 bg-[#1a0e2e] rotate-45 transform -translate-y-1/2 z-10 border-b border-l border-white/10 rounded-[4px]"></div>

                <h3 className="font-['Outfit'] font-extrabold text-4xl text-white mb-3">03</h3>
                <h4 className="font-['Outfit'] font-bold text-xl text-white mb-4">Full Documentation</h4>
                <div className="w-12 border-b-2 border-dashed border-white/20 mb-5"></div>
                <p className="text-sm text-gray-400 leading-relaxed font-['Inter']">RC transfer, insurance, NOC — we handle everything.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ════ SECTION 6: ADVERTISEMENT BANNERS ════ */}
      {banners.length > 0 && (
        <section className="py-10 md:py-14 lg:py-20 bg-[#0a0a12]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 text-center">OFFERS & PROMOTIONS</p>
            <h2 className="text-3xl md:text-[36px] text-white font-bold leading-tight mb-10 text-center" style={{ fontFamily: 'var(--font-outfit)' }}>
              Latest Deals
            </h2>

            {banners.length === 1 ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full group">
                {banners[0].link ? (
                  <a href={banners[0].link} className="block w-full h-full">
                    <img src={banners[0].desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block transition-transform duration-700 group-hover:scale-105" />
                    <img src={banners[0].mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden transition-transform duration-700 group-hover:scale-105" />
                  </a>
                ) : (
                  <>
                    <img src={banners[0].desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block" />
                    <img src={banners[0].mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden" />
                  </>
                )}
              </div>
            ) : banners.length === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((b) => (
                  <div key={b._id} className="relative rounded-2xl overflow-hidden shadow-xl w-full group">
                     {b.link ? (
                       <a href={b.link} className="block w-full h-full">
                         <img src={b.desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block transition-transform duration-700 group-hover:scale-[1.02]" />
                         <img src={b.mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden transition-transform duration-700 group-hover:scale-[1.02]" />
                       </a>
                     ) : (
                       <>
                         <img src={b.desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block" />
                         <img src={b.mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden" />
                       </>
                     )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative group/carousel">
                <div className="overflow-hidden rounded-2xl" ref={bannerRef}>
                  <div className="flex">
                    {banners.map((b) => (
                      <div key={b._id} className="flex-[0_0_100%] min-w-0 relative w-full group">
                        {b.link ? (
                          <a href={b.link} className="block w-full h-full">
                            <img src={b.desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block transition-transform duration-700 group-hover:scale-[1.02]" />
                            <img src={b.mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden transition-transform duration-700 group-hover:scale-[1.02]" />
                          </a>
                        ) : (
                          <>
                            <img src={b.desktopImageUrl} alt="Promo" className="w-full h-auto hidden sm:block" />
                            <img src={b.mobileImageUrl} alt="Promo" className="w-full h-auto sm:hidden" />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Navigation Arrows */}
                <button onClick={scrollBannerPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80">
                  <IconChevronLeft size={20} />
                </button>
                <button onClick={scrollBannerNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/80">
                  <IconChevronRight size={20} />
                </button>
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
                <button onClick={scrollTestiPrev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <IconChevronLeft size={20} />
                </button>
                <button onClick={scrollTestiNext} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <IconChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-visible w-full pt-4" ref={testiRef}>
              <div className="flex gap-4 sm:gap-6 -ml-4 pl-4 pr-4 sm:pr-0">
                {/* Duplicate items to ensure Embla can loop seamlessly even with very few testimonials */}
                {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, index) => (
                  <div key={`${t._id}-${index}`} className="relative w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] shrink-0 rounded-2xl overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 cursor-grab active:cursor-grabbing border border-white/5 bg-[#12121f]">
                    
                    {/* Full Card Photo */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      {t.photo?.url ? (
                        <Image src={t.photo.url} alt={t.customerName} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-500/30">No Photo</div>
                      )}
                    </div>
                    
                    {/* Protective Dark Gradient Overlay */}
                    {/* Smooth permanent gradient so the button is always perfectly readable over any photo */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pointer-events-none z-10 transition-all duration-500 group-hover:h-[60%]"></div>
                    
                    {/* Hover Content Section (Review Text) */}
                    <div className="absolute inset-x-0 bottom-[60px] px-6 pb-2 pt-10 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 pointer-events-none">
                      <p className="text-white text-[14px] leading-relaxed font-medium line-clamp-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        "{t.review || t.description || "Had a fantastic experience purchasing my dream car. Highly recommended!"}"
                      </p>
                    </div>

                    {/* Customer Name Area (Matches Reference Image) */}
                    <div className="absolute bottom-5 left-6 right-6 z-30 pointer-events-auto flex flex-col items-start">
                      <span className="text-white font-black text-[14px] sm:text-[16px] tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {t.customerName}
                      </span>
                      {/* Small decorative underline from reference image */}
                      <div className="w-8 h-[3px] bg-gradient-to-r from-purple-600 to-red-600 rounded-full mt-1"></div>
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
