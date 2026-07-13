'use client';

import { useEffect, useState } from 'react';
import { Car, MessageSquare, HandCoins, Users, TrendingUp, ArrowRight, ExternalLink, Trash2, Home, Edit, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, messages: 0, unread: 0, sellRequests: 0, customers: 0 });
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredTotal, setFeaturedTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

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

  const handleRemoveFromFeatured = async (id) => {
    try {
      await api.put(`/cars/${id}`, { isFeatured: false });
      setFeaturedCars(prev => prev.filter(car => car._id !== id));
      setFeaturedTotal(prev => prev - 1);
      toast.success('Removed from homescreen');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/cars/${id}`);
      setFeaturedCars(prev => prev.filter(car => car._id !== id));
      setFeaturedTotal(prev => prev - 1);
      setStats(prev => ({ ...prev, cars: prev.cars - 1 }));
      toast.success('Vehicle deleted successfully');
    } catch (err) {
      toast.error('Failed to delete vehicle');
    }
  };

  const cards = [
    { icon: Car, label: 'Total Inventory', value: stats.cars, subtext: 'Active Listings', color: 'text-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' },
    { icon: MessageSquare, label: 'New Messages', value: stats.unread, subtext: `${stats.messages} total received`, color: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]' },
    { icon: HandCoins, label: 'Sell Requests', value: stats.sellRequests, subtext: 'Pending evaluations', color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]' },
    { icon: Users, label: 'Testimonials', value: stats.customers, subtext: 'Happy customers', color: 'text-pink-400', bg: 'bg-pink-500/10', glow: 'shadow-[0_0_30px_rgba(244,114,182,0.15)]' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#1a1a2e] to-[#0d0d16] border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 blur-[60px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
              {greeting}, Admin.
            </h1>
            <p className="text-sm text-gray-400">Here's what's happening at Hariram Motors today.</p>
          </div>
          <a href="/admin/inventory/add" className="btn-primary py-2 px-4 text-sm w-fit group flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all">
            <span>+ Add New Vehicle</span>
          </a>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`relative overflow-hidden bg-[#12121a] border border-white/5 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 ${card.glow}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{loading ? '—' : card.value}</p>
              <h3 className="text-xs font-semibold text-gray-300 mt-1">{card.label}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">{card.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Inventory List */}
      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/[0.02]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-400" />
              Homepage Featured Fleet
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{featuredTotal} premium vehicles showcased on the homepage.</p>
          </div>
          <a href="/admin/inventory" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
            View Complete Inventory <ArrowRight size={14} />
          </a>
        </div>

        <div className="p-0 sm:p-1">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="flex flex-col">
              {featuredCars.map((car) => (
                <div key={car._id} className="group relative flex flex-col sm:flex-row items-center gap-4 p-3 mx-2 my-1 rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                  
                  {/* Thumbnail */}
                  <div className="w-full sm:w-24 h-40 sm:h-14 bg-[#0a0a10] rounded-lg overflow-hidden relative shrink-0">
                    {car.images?.[0]?.url ? (
                      <img src={car.images[0].url} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Car size={18} />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full flex flex-wrap items-center gap-3">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                      {car.make} {car.model} {car.year ? `(${car.year})` : ''}
                    </h3>
                    
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-md">
                      {car.price ? `₹${(car.price / 100000).toFixed(2)} Lakhs` : 'Price N/A'}
                    </span>
                    
                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{car.year || 'N/A'}</span>
                      <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-500"></span> {car.kms?.toLocaleString() || '0'} km</span>
                      <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-500"></span> {car.fuelType || 'Fuel N/A'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full sm:w-auto flex items-center justify-end sm:opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <a 
                      href={`/cars/${car.slug}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 border border-transparent transition-all"
                      title="View Public Page"
                    >
                      <Eye size={14} />
                    </a>
                    <button 
                      onClick={() => handleRemoveFromFeatured(car._id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 border border-transparent transition-all"
                      title="Remove from homescreen"
                    >
                      <Home size={14} />
                    </button>
                    <a 
                      href={`/admin/inventory/edit/${car._id}`} 
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 border border-transparent transition-all"
                      title="Edit Vehicle"
                    >
                      <Edit size={14} />
                    </a>
                    <button 
                      onClick={() => handleDelete(car._id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-transparent transition-all"
                      title="Delete Vehicle"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <Car size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Featured Vehicles</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">You haven't marked any vehicles to be featured on the public homepage yet.</p>
              <a href="/admin/inventory" className="btn-primary">Browse Inventory</a>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
