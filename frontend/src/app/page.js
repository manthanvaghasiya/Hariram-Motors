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
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Search Bar State
  const [searchTab, setSearchTab] = useState('buy'); // buy, sell, new
  const [searchParams, setSearchParams] = useState({ brand: '', model: '', budget: '', fuel: '' });
  
  // API Filter Data
  const [availableBrands, setAvailableBrands] = useState([]);
  const [brandModelMap, setBrandModelMap] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  // Embla Carousels
  const [bannerRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [testiRef, testiApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  const scrollPrev = useCallback(() => testiApi && testiApi.scrollPrev(), [testiApi]);
  const scrollNext = useCallback(() => testiApi && testiApi.scrollNext(), [testiApi]);

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
      {/* ════ SECTION 1: HERO (Premium 2-col layout) ════ */}
      <section className="relative min-h-[100vh] flex items-center pt-24 overflow-hidden">
        {/* Background & Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop"
            alt="Luxury Showroom"
            fill
            priority={true}
            className="object-cover scale-105 transform origin-center animate-[subtle-zoom_20s_ease-out_forwards]"
            quality={100}
          />
          {/* Deep cinematic gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/95 to-[#05050A]/40" />
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col (Typography) */}
            <div className="lg:col-span-7 pb-20 lg:pb-0">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl rounded-full text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Premium Car Dealership
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-[84px] text-white font-bold leading-[1.05] tracking-tighter mb-8"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Find Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500">Perfect Car</span> <br />
                In Surat
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed font-light"
              >
                Experience Surat&apos;s premier destination for curated luxury and certified pre-owned vehicles. Built on trust, driven by quality.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-5"
              >
                <Link href="/catalog" className="bg-white text-[#05050A] hover:bg-slate-200 px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  Explore Inventory <IconArrowRight size={20} />
                </Link>
                <Link href="/sell-your-car" className="text-slate-300 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/[0.03] px-8 py-4 rounded-full font-medium transition-all duration-300">
                  Sell Your Car
                </Link>
              </motion.div>
            </div>

            {/* Right Col (Premium Floating Card) */}
            <div className="lg:col-span-5 hidden lg:flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="animate-float w-[340px]"
              >
                <div className="glass-premium p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-4 px-2 pt-1">
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                      <IconStarFilled size={12} /> Featured Pick
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5">
                    <Image src="https://images.unsplash.com/photo-1605515298946-d062f2e9da53?w=800&q=80" alt="Featured Car" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="px-2 pb-2">
                    <h4 className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Mercedes-Benz C-Class</h4>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-slate-300 font-light">2021 • Automatic</p>
                      <p className="text-white font-bold text-lg">₹45.50 L</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden md:block opacity-40 hover:opacity-100 transition-opacity animate-bounce">
          <IconChevronDown size={32} className="text-white font-light" stroke={1} />
        </div>
      </section>

      {/* ════ SECTION 2: SLEEK DASHBOARD SEARCH ════ */}
      <div className="relative z-30 container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 mb-16">
        <div className="glass-premium p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex gap-8 mb-6 px-2">
            {['buy', 'new', 'sell'].map((tab) => (
              <button
                key={tab}
                onClick={() => tab === 'sell' ? router.push('/sell-your-car') : setSearchTab(tab)}
                className={`pb-3 text-xs font-bold uppercase tracking-[0.15em] transition-all relative ${searchTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab === 'buy' ? 'Buy a Car' : tab === 'new' ? 'New Cars' : 'Sell Your Car'}
                {searchTab === tab && (
                  <motion.div layoutId="searchTabIndicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Unified Form Area */}
          <div className="bg-[#0A0A12] border border-white/[0.04] rounded-2xl flex flex-col md:flex-row shadow-inner">
            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/[0.04]">
              <select 
                value={searchParams.brand} onChange={handleBrandChange}
                className="select-premium w-full h-[60px] px-6 text-sm font-medium"
              >
                <option value="">Any Brand</option>
                {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/[0.04]">
              <select 
                value={searchParams.model} onChange={(e) => setSearchParams({...searchParams, model: e.target.value})}
                disabled={availableModels.length === 0}
                className="select-premium w-full h-[60px] px-6 text-sm font-medium disabled:opacity-40"
              >
                <option value="">Any Model</option>
                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/[0.04]">
              <select 
                value={searchParams.budget} onChange={(e) => setSearchParams({...searchParams, budget: e.target.value})}
                className="select-premium w-full h-[60px] px-6 text-sm font-medium"
              >
                <option value="">Any Budget</option>
                <option value="0-500000">Under ₹5 Lakh</option>
                <option value="500000-1000000">₹5 Lakh - ₹10 Lakh</option>
                <option value="1000000-2000000">₹10 Lakh - ₹20 Lakh</option>
                <option value="2000000-99999999">Above ₹20 Lakh</option>
              </select>
            </div>

            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/[0.04] hidden lg:block">
              <select 
                value={searchParams.fuel} onChange={(e) => setSearchParams({...searchParams, fuel: e.target.value})}
                className="select-premium w-full h-[60px] px-6 text-sm font-medium"
              >
                <option value="">Any Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <button 
              onClick={handleSearch}
              className="md:w-auto px-10 h-[60px] bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-widest uppercase text-xs transition-colors flex items-center justify-center gap-2 rounded-b-2xl md:rounded-none md:rounded-r-2xl"
            >
              <IconSearch size={18} stroke={2} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* ════ SECTION 3: REFINED STATS ════ */}
      <section className="py-16 relative z-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial-gradient opacity-50" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
            {[
              { icon: IconUsers, count: 500, suffix: '+', label: 'Happy Customers' },
              { icon: IconCar, count: 150, suffix: '+', label: 'Cars in Stock' },
              { icon: IconCalendarEvent, count: 10, suffix: '+', label: 'Years of Trust' },
              { icon: IconShieldCheck, count: 100, suffix: '%', label: 'Transparency' },
            ].map((stat, i) => (
              <div key={i} className={`text-center ${i !== 3 && i !== 1 ? 'border-r border-white/[0.03]' : ''} md:border-r md:last:border-none`}>
                <stat.icon size={32} stroke={1.5} className="text-slate-500 mx-auto mb-4" />
                <h3 className="text-[40px] font-bold text-white mb-1 tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                  <AnimatedCounter end={stat.count} />{stat.suffix}
                </h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 4: FEATURED CARS ════ */}
      <section className="py-20 md:py-32 relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">OUR INVENTORY</p>
              <h2 className="text-4xl md:text-5xl text-white font-bold leading-tight tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                Featured Models
              </h2>
            </div>
            <Link href="/catalog" className="text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 group transition-colors pb-2 border-b border-transparent hover:border-white/30">
              View All Cars <IconArrowRight size={16} stroke={2} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          {loadingCars ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-premium overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-white/[0.02]" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-white/[0.03] rounded-md w-3/4" />
                    <div className="h-4 bg-white/[0.03] rounded-md w-full" />
                    <div className="h-10 bg-white/[0.03] rounded-md w-full mt-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {cars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-slate-400 glass-premium font-light">
               No cars currently featured. Browse our catalog for more.
             </div>
          )}
        </div>
      </section>

      {/* ════ SECTION 5: AD BANNERS ════ */}
      {banners.length > 0 && (
        <section className="py-20 md:py-32 bg-[#0A0A12] border-y border-white/[0.02]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-center">OFFERS & PROMOTIONS</p>
            <h2 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-16 text-center tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
              Exclusive Deals
            </h2>

            <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/[0.05]" ref={bannerRef}>
              <div className="flex">
                {banners.map((b) => (
                  <div key={b._id} className="flex-[0_0_100%] min-w-0 relative h-[320px] sm:h-[450px]">
                    <Image src={b.desktopImageUrl} alt="Promo" fill className="object-cover hidden sm:block" />
                    <Image src={b.mobileImageUrl} alt="Promo" fill className="object-cover sm:hidden" />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════ SECTION 6: WHY CHOOSE US ════ */}
      <section className="py-20 md:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5">
              <p className="text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">THE HARIRAM DIFFERENCE</p>
              <h2 className="text-4xl md:text-5xl text-white font-bold leading-tight mb-8 tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                Excellence in <br /> Every Drive.
              </h2>
              <p className="text-slate-400 mb-10 leading-relaxed font-light text-lg">
                For over a decade, we have redefined the pre-owned car buying experience in Surat. No pressure, absolute transparency, and meticulous curation.
              </p>
              <Link href="/about" className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs transition-all group">
                <span className="pb-1 border-b border-purple-500">Discover Our Story</span>
                <IconArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: IconShieldCheck, title: 'Verified Quality', desc: '100-point rigorous mechanical inspection.' },
                { icon: IconCurrencyRupee, title: 'Transparent Value', desc: 'Zero hidden charges. Pure honesty.' },
                { icon: IconCertificate, title: 'Seamless Paperwork', desc: 'RC, insurance, and NOC handled for you.' },
                { icon: IconHeadset, title: 'Dedicated Support', desc: 'Post-purchase assistance you can rely on.' },
              ].map((feat, i) => (
                <div key={i} className="glass-premium p-8 group">
                  <div className="mb-6 text-slate-500 group-hover:text-purple-400 transition-colors duration-500">
                    <feat.icon size={36} stroke={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{feat.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════ SECTION 7: TESTIMONIALS ════ */}
      <section className="py-20 md:py-32 overflow-hidden bg-[#0A0A12] border-t border-white/[0.02]">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">CLIENT STORIES</p>
              <h2 className="text-4xl md:text-5xl text-white font-bold leading-tight tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                Driven by Trust
              </h2>
            </div>
            <div className="hidden md:flex gap-4">
              <button onClick={scrollPrev} className="w-12 h-12 rounded-full glass-premium flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/50 transition-all">
                <IconChevronLeft size={24} stroke={1.5} />
              </button>
              <button onClick={scrollNext} className="w-12 h-12 rounded-full glass-premium flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/50 transition-all">
                <IconChevronRight size={24} stroke={1.5} />
              </button>
            </div>
          </div>

          {loadingTestimonials ? (
             <div className="flex gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-1 glass-premium h-72 animate-pulse" />
                ))}
             </div>
          ) : testimonials.length > 0 ? (
            <div className="overflow-visible" ref={testiRef}>
              <div className="flex gap-8 -ml-4 pl-4 pr-4 sm:pr-0">
                {testimonials.map((t) => (
                  <div key={t._id} className="flex-[0_0_90%] sm:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-0 glass-premium p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 mb-6 text-purple-400 opacity-80">
                        {[...Array(t.rating || 5)].map((_, j) => <IconStarFilled key={j} size={14} />)}
                      </div>
                      <p className="text-slate-300 text-lg leading-relaxed mb-8 font-light italic">
                        "{t.review}"
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      {t.photo?.url ? (
                        <Image src={t.photo.url} alt={t.customerName} width={48} height={48} className="w-12 h-12 rounded-full object-cover grayscale opacity-80" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 font-bold text-lg">
                          {t.customerName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold tracking-tight">{t.customerName}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Bought {t.carModel || 'Car'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ════ SECTION 8: CTA ════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl text-white font-bold mb-6 tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
            Ready for an Upgrade?
          </h2>
          <p className="text-slate-300 text-xl leading-relaxed font-light mb-12 max-w-2xl mx-auto">
            Get the best market valuation for your used car in Surat. Transparent inspection, instant payment, zero hassle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/sell-your-car" className="bg-white text-[#05050A] font-bold px-10 py-5 rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] flex items-center gap-3">
              Get Free Valuation <IconArrowRight size={18} stroke={2} />
            </Link>
            <p className="text-slate-400 text-sm font-medium">Or speak to an expert at <br className="sm:hidden" /><span className="text-white">93734 82016</span></p>
          </div>
        </div>
      </section>

    </>
  );
}
