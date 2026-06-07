'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Settings2, Wallet, Search, MapPin, ChevronDown, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function HeroSection() {
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const [availableBrands, setAvailableBrands] = useState([]);
  const [brandModelMap, setBrandModelMap] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get('/cars/filters');
        if (res.data && res.data.data) {
          const fetchedMakes = res.data.data.makes || [];
          const fetchedMap = res.data.data.brandModelMap || [];

          setAvailableBrands(fetchedMakes);
          setBrandModelMap(fetchedMap);

          // Populate default all models
          const allModels = [...new Set(fetchedMap.flatMap(item => item.models))].filter(Boolean).sort();
          setAvailableModels(allModels);
        }
      } catch (error) {
        console.error('Failed to fetch car metadata', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);
    setSelectedModel(''); // Reset model match to prevent orphaned queries

    // Filter models downward
    if (newBrand) {
      const match = brandModelMap.find(m => m._id === newBrand);
      setAvailableModels(match && match.models ? match.models.filter(Boolean).sort() : []);
    } else {
      const allModels = [...new Set(brandModelMap.flatMap(item => item.models))].filter(Boolean).sort();
      setAvailableModels(allModels);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('make', selectedBrand);
    if (selectedModel) params.set('search', selectedModel); // using search since /catalog handles model via search or explicit field

    if (selectedBudget && selectedBudget.includes('-')) {
      const [minPrice, maxPrice] = selectedBudget.split('-');
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice && maxPrice !== '99999999') params.set('maxPrice', maxPrice);
    }

    router.push(`/catalog?${params.toString()}`);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const searchBarVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.6
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1.05,
      opacity: 1,
      transition: {
        opacity: { duration: 1.5, ease: "easeOut" },
        scale: { duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }
      }
    }
  };

  return (
    <section className="relative flex flex-col h-[480px] sm:h-[550px] md:h-auto md:min-h-[70vh] md:flex-row md:items-center font-['Inter',sans-serif] bg-[#050508] z-20">

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP BACKGROUND (Hidden on mobile)
      ════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden bg-[#050508]">
        <motion.img
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          src="/images/hero_bg_desktop.png"
          alt="Premium Car"
          className="w-full h-full object-cover object-[center_60%] origin-[center_60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12]/95 via-[#0a0a12]/40 to-transparent"></div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE 100DVH LUXURY POSTER (Hidden on desktop)
      ════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050508]">
        <motion.img
          initial={{ scale: 1.1, opacity: 0, y: -40 }}
          animate={{ scale: 1.05, opacity: 1, y: -40 }}
          transition={{
            opacity: { duration: 1.8, ease: "easeOut" },
            scale: { duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }
          }}
          src="/images/hero_bg_mobile.png"
          alt="Premium Car"
          className="absolute inset-0 w-full h-full object-cover object-bottom z-0 origin-bottom"
        />
        {/* Deep cinematic vignette gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/30 to-[#0a0a12]/70"></div>

        {/* Mobile Content Overlay */}
        <div className="absolute inset-x-0 top-[12%] z-10 px-6 flex flex-col items-start text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-5xl text-white font-medium tracking-wide leading-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">Dream Car,</span> Now Within Reach!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-4 text-white/95 text-sm font-semibold tracking-wide max-w-[320px] drop-shadow-md"
          >
            Surat&apos;s premier destination for curated luxury and certified pre-owned vehicles. Built on trust, driven by quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col items-start gap-3 w-full"
          >
            {/* Mobile Trust Badge with Google Reviews */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-bold text-xs mt-0.5">4.8</span>
              <div className="h-3 w-[1px] bg-white/40 mx-0.5"></div>
              <span className="text-slate-200 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Google Reviews</span>
            </div>

            {/* Mobile Location Badge */}
            <button
              onClick={() => router.push('/contact')}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 active:bg-white/20 transition-colors shadow-lg"
            >
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium text-sm tracking-wide">Varachha, Surat</span>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 inset-x-6 z-20"
        >
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="w-full flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl shadow-2xl active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-lg tracking-wide">Find Your Car</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          GLASSMORPHIC BOTTOM SHEET (Mobile Search)
      ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-50 h-[75dvh] bg-[#0a0a12]/80 backdrop-blur-3xl rounded-t-[2.5rem] border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col"
          >
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="px-6 pb-4 flex items-center justify-between border-b border-white/10">
              <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Search Inventory</h2>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Brand */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest pl-1">Make</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center pointer-events-none">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <select
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    disabled={isLoading}
                    className="w-full h-[52px] pl-14 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50 text-base"
                  >
                    <option value="" className="text-black">{isLoading ? 'Loading...' : 'Any Brand'}</option>
                    {availableBrands.map(brand => (
                      <option key={brand} value={brand} className="text-black">{brand}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest pl-1">Model</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center pointer-events-none">
                    <Settings2 className="w-4 h-4 text-white" />
                  </div>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={isLoading || availableModels.length === 0}
                    className="w-full h-[52px] pl-14 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50 text-base"
                  >
                    <option value="" className="text-black">{isLoading ? 'Loading...' : 'Any Model'}</option>
                    {availableModels.map(model => (
                      <option key={model} value={model} className="text-black">{model}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest pl-1">Max Budget</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center pointer-events-none">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full h-[52px] pl-14 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-base"
                  >
                    <option value="" className="text-black">No Limit</option>
                    <option value="0-500000" className="text-black">Under ₹5 Lakh</option>
                    <option value="500000-1000000" className="text-black">₹5 Lakh - ₹10 Lakh</option>
                    <option value="1000000-2000000" className="text-black">₹10 Lakh - ₹20 Lakh</option>
                    <option value="2000000-99999999" className="text-black">Above ₹20 Lakh</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 pb-48 px-6 border-t border-white/10 bg-black/20">
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  handleSearch();
                }}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(147,51,234,0.4)] active:scale-[0.98] transition-all"
              >
                <Search className="w-5 h-5" />
                <span className="text-lg tracking-wide">Search Inventory</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP CONTENT (Hidden on mobile)
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="hidden md:flex flex-col items-start justify-center relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 -mt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-3xl text-left flex flex-col items-start">
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl text-white font-medium tracking-wide leading-[1.15] drop-shadow-xl" style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">Dream Car,</span> Now Within Your Reach!
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-200 mt-6 max-w-2xl font-medium leading-relaxed drop-shadow-md"
          >
            Surat&apos;s premier destination for curated luxury and certified pre-owned vehicles. Built on trust, driven by quality.
          </motion.p>

          {/* Trust Badges & Details (Desktop) */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-row items-center justify-start gap-6"
          >
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 group hover:bg-black/60 transition-all duration-300 shadow-xl cursor-default">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">4.8 Rating</span>
                <div className="h-4 w-[1px] bg-white/30"></div>
                <span className="text-slate-300 text-xs uppercase tracking-widest font-semibold">Google Reviews</span>
              </div>
            </div>

            <motion.button
              onClick={() => router.push('/contact')}
              whileHover={{ x: 5 }}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-purple-600/20 backdrop-blur-md rounded-full border border-purple-500/30 hover:bg-purple-600/40 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group shadow-xl"
            >
              <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-white font-semibold text-sm tracking-wide group-hover:text-white transition-colors">Varachha, Surat</span>
              <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP SEARCH BAR (Hidden on Mobile)
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={searchBarVariants}
        className="hidden md:block absolute -bottom-[4.5rem] left-0 right-0 px-8 md:px-12 z-40"
      >
        <div className="max-w-6xl mx-auto bg-[#0a0a12]/40 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_32px_rgba(147,51,234,0.15)] rounded-[2rem] p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
            {/* Brand */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                disabled={isLoading}
                className="appearance-none w-full h-16 pl-16 pr-12 rounded-2xl border-2 border-white/10 bg-[#12121f]/80 text-white font-bold focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-[#12121f] outline-none transition-all duration-300 disabled:opacity-50 cursor-pointer text-base"
              >
                <option value="">{isLoading ? 'Loading...' : 'Select Brand'}</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-purple-400 transition-colors" />
            </div>

            {/* Model */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Settings2 className="w-5 h-5" />
                </div>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoading || availableModels.length === 0}
                className="appearance-none w-full h-16 pl-16 pr-12 rounded-2xl border-2 border-white/10 bg-[#12121f]/80 text-white font-bold focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-[#12121f] outline-none transition-all duration-300 disabled:opacity-50 cursor-pointer text-base"
              >
                <option value="">{isLoading ? 'Loading...' : 'Select Model'}</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-purple-400 transition-colors" />
            </div>

            {/* Budget */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="appearance-none w-full h-16 pl-16 pr-12 rounded-2xl border-2 border-white/10 bg-[#12121f]/80 text-white font-bold focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-[#12121f] outline-none transition-all duration-300 cursor-pointer text-base"
              >
                <option value="">Any Budget</option>
                <option value="0-500000">Under ₹5 Lakh</option>
                <option value="500000-1000000">₹5 Lakh - ₹10 Lakh</option>
                <option value="1000000-2000000">₹10 Lakh - ₹20 Lakh</option>
                <option value="2000000-99999999">Above ₹20 Lakh</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-purple-400 transition-colors" />
            </div>

            {/* Search Button */}
            <div className="relative h-16">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="w-full h-full bg-gradient-to-br from-purple-600 to-[#7e22ce] hover:from-[#7e22ce] hover:to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 shadow-[0_12px_24px_-8px_rgba(147,51,234,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(147,51,234,0.5)] active:scale-95 group text-base"
              >
                <Search className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12" />
                <span className="tracking-wide uppercase text-base">Search Inventory</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
