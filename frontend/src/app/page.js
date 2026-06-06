'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  IconCar, IconUsers, IconCalendarEvent, IconShieldCheck, IconArrowRight, 
  IconCurrencyRupee, IconCertificate, IconHeadset, IconStarFilled, IconChevronLeft, IconChevronRight,
  IconChevronDown, IconCheck, IconSearch
} from '@tabler/icons-react';

import CarCard from '@/components/CarCard';
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
  const router = useRouter();

  // State
  const [cars, setCars] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Search Bar State
  const [searchTab, setSearchTab] = useState('buy'); // buy, sell, new
  const [searchParams, setSearchParams] = useState({ brand: '', model: '', budget: '', fuel: '' });
  
  // API Filter Data
  const [availableBrands, setAvailableBrands] = useState([]);
  const [brandModelMap, setBrandModelMap] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  // Embla Carousels
  const [bannerRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [testiRef, testiApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  // Testimonial Controls
  const scrollPrev = useCallback(() => testiApi && testiApi.scrollPrev(), [testiApi]);
  const scrollNext = useCallback(() => testiApi && testiApi.scrollNext(), [testiApi]);

  // Fetch Data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [carsRes, testRes, bannerRes, filtersRes] = await Promise.allSettled([
          api.get('/cars?limit=8&status=available'),
          api.get('/happy-customers?limit=6'),
          api.get('/promo-banners?active=true'),
          api.get('/cars/filters')
        ]);
        
        if (carsRes.status === 'fulfilled') setCars(carsRes.value.data.cars || []);
        if (testRes.status === 'fulfilled') setTestimonials(testRes.value.data || []);
        if (bannerRes.status === 'fulfilled') setBanners(bannerRes.value.data || []);
        
        if (filtersRes.status === 'fulfilled' && filtersRes.value.data?.data) {
          const makes = filtersRes.value.data.data.makes || [];
          const map = filtersRes.value.data.data.brandModelMap || [];
          setAvailableBrands(makes);
          setBrandModelMap(map);
          setAvailableModels([...new Set(map.flatMap(m => m.models))].filter(Boolean).sort());
        }
      } catch (error) {
        console.error('Error fetching home data');
      } finally {
        setLoadingCars(false);
        setLoadingBanners(false);
        setLoadingTestimonials(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSearchParams(prev => ({ ...prev, brand: newBrand, model: '' }));

    if (newBrand) {
      const match = brandModelMap.find(m => m._id === newBrand);
      setAvailableModels(match && match.models ? match.models.filter(Boolean).sort() : []);
    } else {
      const allModels = [...new Set(brandModelMap.flatMap(item => item.models))].filter(Boolean).sort();
      setAvailableModels(allModels);
    }
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (searchParams.brand) query.append('make', searchParams.brand);
    if (searchParams.model) query.append('model', searchParams.model);
    if (searchParams.fuel) query.append('fuelType', searchParams.fuel);
    if (searchTab === 'new') query.append('condition', 'new');
    
    if (searchParams.budget) {
      const [minPrice, maxPrice] = searchParams.budget.split('-');
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice && maxPrice !== '99999999') query.append('maxPrice', maxPrice);
    }
    
    router.push(`/catalog?${query.toString()}`);
  };

  return (
    <>
      {/* ════ SECTION 1: HERO (2-col layout) ════ */}
      <section className="relative min-h-[100vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop"
            alt="Luxury Car Showroom"
            fill
            priority={true}
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12] via-[#0a0a12]/80 to-transparent sm:via-[#0a0a12]/90 sm:to-[#0a0a12]/30" />
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col (Text) */}
            <div className="lg:col-span-7 pb-16 lg:pb-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-purple-900/20">
                  <span className="text-yellow-300">⭐</span> Premium Car Dealership
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl text-white font-bold leading-[1.1] tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Find Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Perfect Car</span> <br />
                In Surat
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[16px] md:text-[18px] text-gray-300 max-w-md mb-8 leading-relaxed font-sans"
              >
                Surat&apos;s premier destination for curated luxury and certified pre-owned vehicles. Built on trust, driven by quality.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/catalog" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-900/30">
                  Browse Cars <IconArrowRight size={20} />
                </Link>
                <Link href="/sell-your-car" className="border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-full font-medium transition-all duration-300">
                  Sell Your Car
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-x-6 gap-y-3 mt-10 text-sm text-gray-400 font-medium"
              >
                <span className="flex items-center gap-2"><IconCheck size={18} className="text-purple-500" /> 150+ Cars</span>
                <span className="flex items-center gap-2"><IconCheck size={18} className="text-purple-500" /> Transparent Pricing</span>
                <span className="flex items-center gap-2"><IconCheck size={18} className="text-purple-500" /> 500+ Happy Customers</span>
              </motion.div>
            </div>

            {/* Right Col (Floating Card) */}
            <div className="lg:col-span-5 hidden lg:flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }}
                className="animate-float"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-[320px]">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">Featured of the Week</span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <Image src="https://images.unsplash.com/photo-1605515298946-d062f2e9da53?w=800&q=80" alt="Featured Car" fill className="object-cover" />
                  </div>
                  <div className="px-1">
                    <h4 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-outfit)' }}>Mercedes-Benz C-Class</h4>
                    <p className="text-purple-400 font-bold text-xl mt-1">₹45.50 Lakh</p>
                    <Link href="/catalog" className="mt-4 w-full bg-white/10 hover:bg-purple-600 text-white text-sm py-2.5 rounded-xl font-semibold flex items-center justify-center transition-colors border border-white/10 hover:border-purple-500">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce hidden md:block opacity-70">
          <IconChevronDown size={32} className="text-purple-400" />
        </div>
      </section>

      {/* ════ SECTION 2: QUICK SEARCH BAR ════ */}
      <div className="relative z-30 container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 mb-12">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 sm:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5),0_16px_32px_-8px_rgba(147,51,234,0.15)]">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-white/10 mb-6 px-2">
            {['buy', 'new', 'sell'].map((tab) => (
              <button
                key={tab}
                onClick={() => tab === 'sell' ? router.push('/sell-your-car') : setSearchTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${searchTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tab === 'buy' ? 'Buy a Car' : tab === 'new' ? 'New Cars' : 'Sell Your Car'}
                {searchTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 rounded-t-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
                )}
              </button>
            ))}
          </div>

          {/* 4 Dropdowns Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <select 
              value={searchParams.brand} onChange={handleBrandChange}
              className="md:col-span-1 appearance-none w-full bg-[#12121f]/80 border-2 border-white/5 text-white font-semibold rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:bg-[#12121f] transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
            >
              <option value="">Any Brand</option>
              {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <select 
              value={searchParams.model} onChange={(e) => setSearchParams({...searchParams, model: e.target.value})}
              disabled={availableModels.length === 0}
              className="md:col-span-1 appearance-none w-full bg-[#12121f]/80 border-2 border-white/5 text-white font-semibold rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:bg-[#12121f] transition-all cursor-pointer disabled:opacity-50"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
            >
              <option value="">Any Model</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <select 
              value={searchParams.budget} onChange={(e) => setSearchParams({...searchParams, budget: e.target.value})}
              className="md:col-span-1 appearance-none w-full bg-[#12121f]/80 border-2 border-white/5 text-white font-semibold rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:bg-[#12121f] transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
            >
              <option value="">Any Budget</option>
              <option value="0-500000">Under ₹5 Lakh</option>
              <option value="500000-1000000">₹5 Lakh - ₹10 Lakh</option>
              <option value="1000000-2000000">₹10 Lakh - ₹20 Lakh</option>
              <option value="2000000-99999999">Above ₹20 Lakh</option>
            </select>

            <select 
              value={searchParams.fuel} onChange={(e) => setSearchParams({...searchParams, fuel: e.target.value})}
              className="md:col-span-1 appearance-none w-full bg-[#12121f]/80 border-2 border-white/5 text-white font-semibold rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:bg-[#12121f] transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
            >
              <option value="">Any Fuel</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>

            <button 
              onClick={handleSearch}
              className="md:col-span-1 w-full bg-gradient-to-br from-purple-600 to-[#7e22ce] hover:from-[#7e22ce] hover:to-purple-600 text-white rounded-2xl px-6 py-4 font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-[0_12px_24px_-8px_rgba(147,51,234,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(147,51,234,0.5)] active:scale-95"
            >
              <IconSearch size={20} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* ════ SECTION 3: STATS STRIP ════ */}
      <section className="bg-purple-900/40 border-y border-purple-500/10 py-12 relative z-20">
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
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 4: FEATURED CARS ════ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">OUR INVENTORY</p>
              <h2 className="text-[32px] md:text-[40px] text-white font-bold leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                Featured Cars
              </h2>
            </div>
            <Link href="/catalog" className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-1 group transition-colors uppercase tracking-wide">
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
             <div className="text-center py-12 text-red-400 bg-red-900/10 rounded-2xl border border-red-500/20 font-medium">
               Failed to load cars or inventory is empty.
             </div>
          )}
        </div>
      </section>

      {/* ════ SECTION 5: AD BANNERS ════ */}
      {banners.length > 0 && (
        <section className="py-14 md:py-20 bg-[#0f0f1e]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 text-center">OFFERS & PROMOTIONS</p>
            <h2 className="text-[32px] md:text-[40px] text-white font-bold leading-tight mb-10 text-center" style={{ fontFamily: 'var(--font-outfit)' }}>
              Latest Deals
            </h2>

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
          </div>
        </section>
      )}

      {/* ════ SECTION 6: WHY CHOOSE US (40/60 split) ════ */}
      <section className="py-14 md:py-20 bg-[#0a0a12]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">WHY HARIRAM MOTORS</p>
              <h2 className="text-[32px] md:text-[40px] text-white font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
                Why Thousands <br /> Trust Us
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                We've been serving Surat for over 10 years with honest pricing, genuine cars, and a no-pressure buying experience. Our commitment is to quality and customer satisfaction.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 border-2 border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white rounded-full px-8 py-3.5 transition-colors font-bold uppercase tracking-wide text-sm">
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
                <div key={i} className="bg-[#12121f] border border-white/5 rounded-2xl p-6 hover:border-purple-500/40 transition-colors shadow-lg">
                  <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center mb-5 text-purple-400">
                    <feat.icon size={28} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════ SECTION 7: TESTIMONIALS ════ */}
      <section className="py-14 md:py-20 overflow-hidden bg-[#0f0f1e]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">TESTIMONIALS</p>
              <h2 className="text-[32px] md:text-[40px] text-white font-bold leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                What Our Customers Say
              </h2>
            </div>
            <div className="hidden md:flex gap-3">
              <button onClick={scrollPrev} className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-white hover:bg-purple-600 hover:border-purple-600 transition-colors">
                <IconChevronLeft size={24} />
              </button>
              <button onClick={scrollNext} className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-white hover:bg-purple-600 hover:border-purple-600 transition-colors">
                <IconChevronRight size={24} />
              </button>
            </div>
          </div>

          {loadingTestimonials ? (
             <div className="flex gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-1 bg-[#12121f] rounded-2xl h-64 animate-pulse" />
                ))}
             </div>
          ) : testimonials.length > 0 ? (
            <div className="overflow-visible" ref={testiRef}>
              <div className="flex gap-6 -ml-4 pl-4 pr-4 sm:pr-0">
                {testimonials.map((t) => (
                  <div key={t._id} className="flex-[0_0_90%] sm:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-0 bg-[#12121f] border border-white/5 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex gap-1 mb-5 text-yellow-400">
                        {[...Array(t.rating || 5)].map((_, j) => <IconStarFilled key={j} size={18} />)}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed mb-6 italic font-medium">
                        "{t.review}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t border-white/5 pt-5">
                      {t.photo?.url ? (
                        <Image src={t.photo.url} alt={t.customerName} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-lg">
                          {t.customerName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold">{t.customerName}</p>
                        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Bought: {t.carModel || 'Car'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ════ SECTION 8: SELL YOUR CAR CTA ════ */}
      <section className="bg-gradient-to-r from-[#4c1d95] to-[#2e1065] py-16 md:py-20 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-[32px] md:text-[44px] text-white font-bold mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                Want to Sell Your Car?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed font-medium">
                Get the best price for your used car in Surat. Free inspection. Instant payment. Zero hassle.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <Link href="/sell-your-car" className="bg-white text-purple-900 font-bold px-10 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-2">
                Get Free Valuation <IconArrowRight size={20} />
              </Link>
              <p className="text-white/60 text-sm font-medium">or call us at +91 93734 82016</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
