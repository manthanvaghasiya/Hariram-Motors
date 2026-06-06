'use client';

import { useEffect, useState } from 'react';
import { Car, MessageSquare, HandCoins, Users, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, messages: 0, unread: 0, sellRequests: 0, customers: 0 });
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [carsRes, msgRes, sellRes, custRes] = await Promise.allSettled([
          api.get('/cars?limit=5&sort=-createdAt&status=available'),
          api.get('/messages?limit=1'),
          api.get('/sell-requests?limit=1'),
          api.get('/happy-customers/all'),
        ]);

        setStats({
          cars: carsRes.status === 'fulfilled' ? carsRes.value.data.total : 0,
          messages: msgRes.status === 'fulfilled' ? msgRes.value.data.total : 0,
          unread: msgRes.status === 'fulfilled' ? msgRes.value.data.unreadCount : 0,
          sellRequests: sellRes.status === 'fulfilled' ? sellRes.value.data.total : 0,
          customers: custRes.status === 'fulfilled' ? custRes.value.data.length : 0,
        });
        if (carsRes.status === 'fulfilled') setRecentCars(carsRes.value.data.cars || []);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const cards = [
    { icon: Car, label: 'Total Cars', value: stats.cars, color: 'var(--color-primary)', bg: 'rgba(226,176,74,0.1)' },
    { icon: MessageSquare, label: 'Messages', value: `${stats.unread} unread / ${stats.messages}`, color: 'var(--color-accent-blue)', bg: 'rgba(96,165,250,0.1)' },
    { icon: HandCoins, label: 'Sell Requests', value: stats.sellRequests, color: 'var(--color-accent-green)', bg: 'rgba(74,222,128,0.1)' },
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

      {/* Recent Cars */}
      <div className="glass-card p-6 hover:!transform-none">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[var(--color-primary)]" />
          Recent Cars
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}
          </div>
        ) : recentCars.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                  <th className="pb-3 font-medium">Car</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCars.map((car) => (
                  <tr key={car._id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-3 font-medium">{car.title || `${car.year} ${car.make} ${car.model}`}</td>
                    <td className="py-3 text-[var(--color-primary)]">{car.price ? `₹${(car.price / 100000).toFixed(1)}L` : 'N/A'}</td>
                    <td className="py-3">
                      <span className={`badge ${car.status === 'available' ? 'badge-available' : car.status === 'sold' ? 'badge-sold' : 'badge-featured'}`}>
                        {car.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[var(--color-text-muted)] text-center py-8">No cars yet. Add your first car!</p>
        )}
      </div>
    </div>
  );
}
