'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import CarCard from '@/components/CarCard';
import api from '@/lib/api';

export default function CatalogClient() {
  const searchParams = useSearchParams();

  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [make, setMake] = useState(searchParams.get('make') || '');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || '');
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const fetchCars = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (make) params.set('make', make);
      if (fuelType) params.set('fuelType', fuelType);
      if (bodyType) params.set('bodyType', bodyType);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (sort) params.set('sort', sort);
      params.set('page', pageNum);
      params.set('limit', 12);

      const res = await api.get(`/cars?${params.toString()}`);
      setCars(res.data.cars || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.log('Error fetching cars');
    } finally {
      setLoading(false);
    }
  }, [search, make, fuelType, bodyType, minPrice, maxPrice, sort]);

  useEffect(() => {
    api.get('/cars/brands').then(res => setBrands(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchCars(1);
  }, [fetchCars]);

  const clearFilters = () => {
    setSearch(''); setMake(''); setFuelType(''); setBodyType('');
    setMinPrice(''); setMaxPrice(''); setSort('');
  };

  const hasActiveFilters = search || make || fuelType || bodyType || minPrice || maxPrice;

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Header */}
      <div className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Our <span className="gradient-text">Collection</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {total > 0 ? `${total} cars available` : 'Browse our premium collection'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field !w-auto min-w-[180px]"
          >
            <option value="">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: Newest</option>
            <option value="year_asc">Year: Oldest</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline !py-3 md:hidden"
          >
            <SlidersHorizontal size={16} /> Filters {hasActiveFilters && `(${[make, fuelType, bodyType, minPrice, maxPrice].filter(Boolean).length})`}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className={`${showFilters ? 'fixed inset-0 z-50 bg-[var(--color-bg-dark)] p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:w-64 flex-shrink-0`}>
            {showFilters && (
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X size={24} /></button>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="input-label">Brand</label>
                <select value={make} onChange={(e) => setMake(e.target.value)} className="input-field">
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">Fuel Type</label>
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="input-field">
                  <option value="">All Types</option>
                  {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Body Type</label>
                <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="input-field">
                  <option value="">All Types</option>
                  {['Sedan', 'SUV', 'Hatchback', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Wagon'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Price Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input-field !text-sm" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input-field !text-sm" />
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-[var(--color-accent-red)] hover:underline">
                  Clear All Filters
                </button>
              )}

              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="btn-primary w-full md:hidden">
                  Apply Filters
                </button>
              )}
            </div>
          </div>

          {/* Car Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <div className="skeleton aspect-[4/3]" />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-5 w-3/4 rounded" />
                      <div className="skeleton h-4 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car, i) => (
                    <CarCard key={car._id} car={car} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => fetchCars(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          page === i + 1
                            ? 'gradient-primary text-[#0f0f1a]'
                            : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-[var(--color-text-secondary)] mb-4">No cars match your filters</p>
                <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
