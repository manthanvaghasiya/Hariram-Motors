'use client';

import { useEffect, useState } from 'react';
import { Car, MessageSquare, HandCoins, Users, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, messages: 0, unread: 0, sellRequests: 0, customers: 0 });
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredTotal, setFeaturedTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [carsRes, msgRes, sellRes, custRes, featuredRes] = await Promise.allSettled([
          api.get('/cars?limit=1'), // Just for total count
          api.get('/messages?limit=1'),
          api.get('/sell-requests?limit=1'),
          api.get('/happy-customers/all'),
          api.get('/cars?limit=5&featured=true')
        ]);

        setStats({
          cars: carsRes.status === 'fulfilled' ? carsRes.value.data.total : 0,
          messages: msgRes.status === 'fulfilled' ? msgRes.value.data.total : 0,
          unread: msgRes.status === 'fulfilled' ? msgRes.value.data.unreadCount : 0,
          sellRequests: sellRes.status === 'fulfilled' ? sellRes.value.data.total : 0,
          customers: custRes.status === 'fulfilled' ? custRes.value.data.length : 0,
        });
        if (featuredRes.status === 'fulfilled') {
          setFeaturedCars(featuredRes.value.data.cars || []);
          setFeaturedTotal(featuredRes.value.data.total || 0);
        }
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const cards = [
    { icon: Car, label: 'Total Cars', value: stats.cars, color: 'var(--color-primary)', bg: 'rgba(226,176,74,0.1)' },
    { icon: MessageSquare, label: 'Messages', value: `${stats.unread} unread / ${stats.messages}`, color: 'var(--color-accent-blue)', bg: 'rgba(96,165,250,0.1)' },
    { icon: HandCoins, label: 'Sell Requests', value: `${stats.sellRequests} pending`, color: 'var(--color-accent-green)', bg: 'rgba(74,222,128,0.1)' },
    { icon: Users, label: 'Testimonials', value: stats.customers, color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Welcome back to Hariram Motors admin</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-5 flex items-center gap-4 hover:!transform-none">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: card.bg }}>
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
              <p className="text-xl font-bold">{loading ? '—' : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Home Page Inventory */}
      <div className="glass-card p-6 hover:!transform-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-[var(--color-primary)]" />
              Home Page Inventory
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{featuredTotal} vehicles selected for Home Page</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/inventory" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
              View All
            </a>
            <a href="/admin/inventory/add" className="btn-primary !py-2 !px-4 !text-sm">
              + Add Vehicle
            </a>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}
          </div>
        ) : featuredCars.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                    <th className="pb-3 font-medium">Vehicle</th>
                    <th className="pb-3 font-medium">Year</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">KM Driven</th>
                    <th className="pb-3 font-medium">Fuel</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {featuredCars.map((car) => (
                    <tr key={car._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-4 font-bold">{car.make} {car.model}{car.year ? ` (${car.year})` : ''}</td>
                      <td className="py-4 text-[var(--color-text-muted)]">{car.year}</td>
                      <td className="py-4 text-[var(--color-primary)] font-medium">{car.price ? `₹${(car.price / 100000).toFixed(2)} Lakhs` : 'N/A'}</td>
                      <td className="py-4 text-[var(--color-text-muted)]">{car.kms?.toLocaleString()} KM</td>
                      <td className="py-4 text-[var(--color-text-muted)]">{car.fuelType}</td>
                      <td className="py-4 text-right">
                        <a href={`/admin/inventory/edit/${car._id}`} className="text-[var(--color-primary)] hover:underline text-xs font-semibold">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
              {featuredCars.map((car) => (
                <div key={car._id} className="bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[var(--color-border)] flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm leading-tight">{car.make} {car.model}{car.year ? ` (${car.year})` : ''}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{car.year} • {car.kms?.toLocaleString()} KM • {car.fuelType}</p>
                    </div>
                    <span className="text-[var(--color-primary)] font-medium text-sm whitespace-nowrap ml-2">
                      {car.price ? `₹${(car.price / 100000).toFixed(2)}L` : 'N/A'}
                    </span>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-3 flex justify-end">
                    <a href={`/admin/inventory/edit/${car._id}`} className="text-[var(--color-primary)] hover:underline text-xs font-semibold">
                      Edit Vehicle
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-[var(--color-border)] pt-4 gap-3">
              <span className="text-xs text-[var(--color-text-muted)]">
                Showing 1-{featuredCars.length} of {featuredTotal} vehicles
              </span>
              <a href="/admin/inventory" className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                View Full Inventory →
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-muted)] mb-3">No cars are currently featured on the homepage.</p>
            <a href="/admin/inventory" className="text-[var(--color-primary)] text-sm font-semibold hover:underline">
              Select cars from Inventory
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
