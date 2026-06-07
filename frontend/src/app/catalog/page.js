'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IconSearch, IconFilter, IconChevronDown, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import CarCard from '@/components/CarCard';
import api from '@/lib/api';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [makes, setMakes] = useState([]);
  const [fuelTypes, setFuelTypes] = useState(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']);
  const [bodyTypes, setBodyTypes] = useState([]);
  
  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || '');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuelType') || '');
  const [selectedBodyType, setSelectedBodyType] = useState(searchParams.get('bodyType') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortParam, setSortParam] = useState(searchParams.get('sort') || '-createdAt');

  // Data State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch Filters metadata
  useEffect(() => {
    api.get('/cars/filters').then(res => {
      if (res.data?.data) {
        setMakes(res.data.data.makes || []);
        if (res.data.data.fuelTypes?.length > 0) setFuelTypes(res.data.data.fuelTypes);
        setBodyTypes(res.data.data.bodyTypes || []);
      }
    }).catch(console.error);
  }, []);

  // Fetch Cars
  const fetchCars = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 12);
      params.append('status', 'available'); // Only show available cars in catalog
      
      if (selectedMake) params.append('make', selectedMake);
      if (selectedFuel) params.append('fuelType', selectedFuel);
      if (selectedBodyType) params.append('bodyType', selectedBodyType);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (searchQuery) params.append('search', searchQuery);
      if (sortParam) params.append('sort', sortParam);

      // Update URL silently
      router.replace(`/catalog?${params.toString()}`, { scroll: false });

      const res = await api.get(`/cars?${params.toString()}`);
      if (res.data) {
        if (append) {
          setCars(prev => [...prev, ...(res.data.cars || [])]);
        } else {
          setCars(res.data.cars || []);
        }
        setTotal(res.data.total || 0);
        setHasMore(res.data.cars?.length === 12);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    setPage(1);
    fetchCars(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMake, selectedFuel, selectedBodyType, minPrice, maxPrice, searchQuery, sortParam]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCars(nextPage, true);
  };

  const FiltersContent = () => (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="hidden md:block">
        <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>Filters</h3>
      </div>

      {/* Brand Filter */}
      {makes.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <h4 className="font-bold text-white mb-3">Brand</h4>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedMake('')}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedMake === '' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
            >
              All Brands
            </button>
            {makes.map(make => (
              <button 
                key={make}
                onClick={() => setSelectedMake(make)}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedMake === make ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
              >
                {make}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body Type Filter */}
      {bodyTypes.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <h4 className="font-bold text-white mb-3">Body Type</h4>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedBodyType('')}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedBodyType === '' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
            >
              All Types
            </button>
            {bodyTypes.map(type => (
              <button 
                key={type}
                onClick={() => setSelectedBodyType(type)}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedBodyType === type ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fuel Type */}
      <div className="border-t border-white/10 pt-6">
        <h4 className="font-bold text-white mb-3">Fuel Type</h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedFuel('')}
            className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedFuel === '' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            All
          </button>
          {fuelTypes.map(fuel => (
            <button 
              key={fuel}
              onClick={() => setSelectedFuel(fuel)}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedFuel === fuel ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'}`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-white/10 pt-6">
        <h4 className="font-bold text-white mb-4">Price Range</h4>
        <div className="flex flex-col gap-5">
          {/* Min Price Slider */}
          <div>
            <div className="flex justify-between text-xs text-purple-400 font-bold mb-2">
              <span>Min Price:</span>
              <span>{minPrice ? `₹ ${(minPrice/100000).toFixed(2)} L` : '₹ 1.00 L'}</span>
            </div>
            <input 
              type="range" 
              min="100000" 
              max="20000000" 
              step="100000" 
              value={minPrice || 100000}
              onChange={(e) => {
                const val = Number(e.target.value);
                const max = Number(maxPrice || 20000000);
                if (val <= max) {
                  setMinPrice(val === 100000 ? "" : val);
                }
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" 
            />
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-xs text-purple-400 font-bold mb-2">
              <span>Max Price:</span>
              <span>{maxPrice ? `₹ ${(maxPrice/100000).toFixed(2)} L` : 'Any'}</span>
            </div>
            <input 
              type="range" 
              min="100000" 
              max="20000000" 
              step="100000" 
              value={maxPrice || 20000000}
              onChange={(e) => {
                const val = Number(e.target.value);
                const min = Number(minPrice || 100000);
                if (val >= min) {
                  setMaxPrice(val === 20000000 ? "" : val);
                }
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" 
            />
          </div>

          <div className="flex justify-between text-gray-500 text-xs font-bold mt-1">
            <span>₹1 L</span>
            <span>₹2 Cr+</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16 flex flex-col md:flex-row gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 self-start">
        <FiltersContent />
      </aside>

      {/* Mobile Bottom Sheet Filters */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-[#0f0f1e]/95 backdrop-blur-xl rounded-t-3xl border-t border-white/20 shadow-2xl flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 flex items-center justify-between border-b border-white/10">
                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white/70 hover:text-white transition-colors"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FiltersContent />
              </div>

              <div className="p-6 border-t border-white/10 bg-[#0f0f1e] sticky bottom-0">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full h-[52px] bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Catalog Grid Area */}
      <div className="flex-grow flex flex-col space-y-6">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4">
          <div className="w-full flex items-center justify-between lg:w-auto lg:block">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Premium Inventory</h1>
              <p className="text-purple-400 mt-2 font-medium">Showing {total} available vehicles</p>
            </div>
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center w-12 h-12 bg-white/10 border border-white/20 rounded-xl active:bg-white/20 transition-colors"
            >
              <IconFilter className="text-white" size={24} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-[14px] md:py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-base md:text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors" 
                placeholder="Search models..." 
                type="text"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-gray-400 text-sm whitespace-nowrap">Sort by:</span>
              <div className="relative w-full sm:w-48">
                <select 
                  value={sortParam}
                onChange={(e) => setSortParam(e.target.value)}
                className="w-full appearance-none h-[52px] md:h-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer text-base md:text-sm"
              >
                <option value="-createdAt" className="text-black">Recently Added</option>
                <option value="price" className="text-black">Price: Low to High</option>
                <option value="-price" className="text-black">Price: High to Low</option>
                <option value="-year" className="text-black">Year: Newest First</option>
                <option value="kms" className="text-black">Kilometers: Low to High</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
        </div>

        {/* Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#12121f] border border-white/10 rounded-2xl overflow-hidden animate-pulse h-[360px]">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {cars.map((car, i) => (
              <CarCard key={car._id} car={car} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <IconSearch size={48} className="text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
            <p className="text-gray-400 text-center max-w-md">Try adjusting your filters or search criteria to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSelectedMake('');
                setSelectedFuel('');
                setSelectedBodyType('');
                setMinPrice('');
                setMaxPrice('');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {hasMore && cars.length > 0 && (
          <div className="w-full flex justify-center pt-8">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-transparent border border-purple-500 text-purple-400 px-8 py-3 rounded-full hover:bg-purple-600 hover:text-white transition-colors duration-300 font-bold tracking-wide disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Vehicles'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CatalogContent />
    </Suspense>
  );
}
