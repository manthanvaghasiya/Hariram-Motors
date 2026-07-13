'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCars = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (search) params.set('search', search);
      params.set('status', ''); // Show all including sold
      const res = await api.get(`/cars?${params}`);
      setCars(res.data.cars || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(p);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchCars(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this car permanently?')) return;
    try {
      await api.delete(`/cars/${id}`);
      toast.success('Car deleted');
      fetchCars(page);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFeatured = async (car) => {
    try {
      const formData = new FormData();
      formData.append('isFeatured', String(!car.isFeatured));
      await api.put(`/cars/${car._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(car.isFeatured ? 'Removed from Home' : 'Added to Home');
      fetchCars(page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Inventory</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage your car listings</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/inventory/add" className="btn-primary !py-2.5 !px-5 !text-sm">
            <Plus size={16} /> Add Car
          </Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-10 !py-2.5 text-base md:text-sm"
          />
        </div>
      </form>

      {/* Table & Mobile Cards */}
      <div className="glass-card overflow-hidden hover:!transform-none">
        {/* Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                <th className="pb-4 font-medium px-4 pt-4">Vehicle</th>
                <th className="pb-4 font-medium px-4 pt-4">Price</th>
                <th className="pb-4 font-medium px-4 pt-4">Status</th>
                <th className="pb-4 font-medium px-4 pt-4 text-center">Show on Home</th>
                <th className="pb-4 font-medium px-4 pt-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length > 0 ? cars.map((car) => (
                <tr key={car._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-[var(--color-bg-dark)] overflow-hidden relative border border-[var(--color-border)]">
                        {car.images?.[0] ? (
                          <img src={car.images[0].url || car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                            <span className="text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{car.make} {car.model}{car.year ? ` (${car.year})` : ''}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{car.kms?.toLocaleString()} km • {car.fuelType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[var(--color-primary)] font-medium">
                    {car.price ? `₹${(car.price / 100000).toFixed(2)}L` : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`badge ${car.status === 'available' ? 'badge-available' : car.status === 'sold' ? 'badge-sold' : 'badge-featured'}`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={car.isFeatured || false} onChange={() => handleToggleFeatured(car)} />
                      <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/inventory/edit/${car._id}`} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[rgba(226,176,74,0.1)] rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(car._id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] hover:bg-[rgba(248,113,113,0.1)] rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-muted)]">No cars found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card View (Mobile only) */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {cars.map((car) => (
            <div key={car._id} className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col gap-3 relative">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-lg bg-[var(--color-bg-dark)] overflow-hidden relative border border-[var(--color-border)] flex-shrink-0">
                  {car.images?.[0] ? (
                    <img src={car.images[0].url || car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                      <span className="text-[10px]">No img</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm leading-tight">{car.make} {car.model}{car.year ? ` (${car.year})` : ''}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{car.kms?.toLocaleString()} km • {car.fuelType}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-primary)] font-medium text-sm">
                    {car.price ? `₹${(car.price / 100000).toFixed(2)}L` : 'N/A'}
                  </span>
                  <span className={`badge ${car.status === 'available' ? 'badge-available' : car.status === 'sold' ? 'badge-sold' : 'badge-featured'}`}>
                    {car.status}
                  </span>
                  <div className="ml-2 flex items-center gap-1.5">
                    <span className="text-xs text-[var(--color-text-muted)]">Home</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={car.isFeatured || false} onChange={() => handleToggleFeatured(car)} />
                      <div className="w-7 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/inventory/edit/${car._id}`} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[rgba(226,176,74,0.1)] rounded-lg transition-colors">
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => handleDelete(car._id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] hover:bg-[rgba(248,113,113,0.1)] rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => fetchCars(i + 1)} className={`w-9 h-9 rounded-lg text-xs font-medium ${page === i + 1 ? 'gradient-primary text-[#0f0f1a]' : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
