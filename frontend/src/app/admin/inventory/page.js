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
    } catch {}
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Inventory</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage your car listings</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/inventory/add" className="btn-outline !py-2.5 !px-5 !text-sm">
            <Plus size={16} /> Add Used Car
          </Link>
          <Link href="/admin/inventory/add-new" className="btn-primary !py-2.5 !px-5 !text-sm">
            <Plus size={16} /> Add New Car
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
            className="input-field !pl-10 !py-2.5 !text-sm"
          />
        </div>
      </form>

      {/* Table */}
      <div className="glass-card overflow-hidden hover:!transform-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-muted)] bg-[rgba(255,255,255,0.02)]">
                <th className="px-4 py-3 font-medium">Car</th>
                <th className="px-4 py-3 font-medium">Condition</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Fuel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                ))
              ) : cars.length > 0 ? (
                cars.map((car) => (
                  <tr key={car._id} className="border-t border-[var(--color-border)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="px-4 py-3">
                      <p className="font-medium">{car.title || `${car.year} ${car.make} ${car.model}`}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{car.make} · {car.year}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${car.condition === 'new' ? 'bg-[rgba(147,51,234,0.15)] text-[var(--color-primary)]' : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text-secondary)]'}`}>
                        {car.condition === 'new' ? 'New (0km)' : 'Used'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-primary)] font-medium">{formatPrice(car.price)}</td>
                    <td className="px-4 py-3">{car.fuelType || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${car.status === 'available' ? 'badge-available' : car.status === 'sold' ? 'badge-sold' : 'badge-featured'}`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/catalog/${car.slug}`} target="_blank" className="p-1.5 hover:text-[var(--color-primary)] transition-colors" title="View">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/inventory/edit/${car._id}`} className="p-1.5 hover:text-[var(--color-accent-blue)] transition-colors" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(car._id)} className="p-1.5 hover:text-[var(--color-accent-red)] transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">No cars found</td></tr>
              )}
            </tbody>
          </table>
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
