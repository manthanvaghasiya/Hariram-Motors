'use client';

import { useEffect, useState } from 'react';
import { Trash2, Phone, Mail, Eye, Calendar, Fuel, MapPin, Search, ExternalLink, CheckCircle2, Clock, XCircle, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSellRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRequests = async () => {
    try {
      const res = await api.get('/sell-requests?limit=100');
      setRequests(res.data.requests || []);
    } catch {
      toast.error('Failed to load sell requests');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/sell-requests/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, status } : r));
      if (selectedReq && selectedReq._id === id) {
        setSelectedReq({ ...selectedReq, status });
      }
    } catch { 
      toast.error('Failed to update status'); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await api.delete(`/sell-requests/${id}`);
      toast.success('Request deleted successfully');
      setRequests(reqs => reqs.filter(r => r._id !== id));
      if (selectedReq?._id === id) setSelectedReq(null);
    } catch {
      toast.error('Failed to delete request');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = `${req.ownerName} ${req.carBrand} ${req.carModel} ${req.phone}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending': return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
      case 'reviewed': return { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
      case 'contacted': return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' };
      case 'closed': return { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
      default: return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Sell Requests</h1>
          <p className="text-gray-400 mt-1">Manage user valuations and car selling requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* LEFT PANE: List */}
        <div className="lg:col-span-5 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden bg-[#12121f]/80 backdrop-blur-xl relative">
          
          {/* Header & Filters */}
          <div className="p-4 border-b border-white/10 bg-white/[0.02]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, car, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {['all', 'pending', 'reviewed', 'contacted', 'closed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    filterStatus === status 
                      ? 'bg-purple-600 border-purple-500 text-white' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 relative">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-xl h-24 m-2" />
              ))
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const conf = getStatusConfig(req.status);
                const isSelected = selectedReq?._id === req._id;
                return (
                  <div 
                    key={req._id} 
                    onClick={() => setSelectedReq(req)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.1)]' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-base ${isSelected ? 'text-white' : 'text-gray-200'} line-clamp-1 font-['Outfit']`}>
                        {req.carBrand} {req.carModel} <span className="text-gray-400 font-normal">({req.year || 'N/A'})</span>
                      </h3>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${conf.bg} ${conf.border} ${conf.color}`}>
                        <conf.icon size={10} />
                        {req.status}
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-300">{req.ownerName}</span>
                        <span className="text-xs text-gray-500 font-mono">{req.phone}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block mb-0.5">Expected</span>
                        <span className="text-sm font-bold text-purple-400">{req.expectedPrice ? formatPrice(req.expectedPrice) : 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600">
                  <Search size={24} />
                </div>
                <p className="text-gray-400 font-medium">No requests found</p>
                <p className="text-sm text-gray-600 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Details */}
        <div className="lg:col-span-7 h-full">
          {selectedReq ? (
            <div className="glass-panel rounded-2xl border border-white/10 h-full flex flex-col bg-[#12121f]/80 backdrop-blur-xl overflow-hidden relative">
              
              {/* Header Actions */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={() => handleDelete(selectedReq._id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors" title="Delete Request">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                
                <div className="mb-8 pr-12">
                  <h2 className="text-3xl font-extrabold text-white font-['Outfit'] mb-2">{selectedReq.carBrand} {selectedReq.carModel}</h2>
                  <p className="text-purple-400 font-bold text-xl">{selectedReq.expectedPrice ? formatPrice(selectedReq.expectedPrice) : 'Price Not Specified'}</p>
                </div>

                {/* Status Updater */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Status</h4>
                  <div className="flex flex-wrap gap-3">
                    {['pending', 'reviewed', 'contacted', 'closed'].map(status => {
                      const isActive = selectedReq.status === status;
                      const conf = getStatusConfig(status);
                      return (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedReq._id, status)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all border ${
                            isActive 
                              ? `${conf.bg} ${conf.border} ${conf.color} shadow-lg ring-1 ring-inset ${conf.color.replace('text-', 'ring-')}`
                              : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5 hover:text-gray-300'
                          }`}
                        >
                          <conf.icon size={16} />
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  
                  {/* Contact Block */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Contact Info</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                        <p className="font-medium text-white">{selectedReq.ownerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                        <p className="font-medium text-white font-mono">{selectedReq.phone}</p>
                      </div>
                      {selectedReq.email && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="font-medium text-white">{selectedReq.email}</p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex gap-3 pt-2">
                        <a 
                          href={`https://wa.me/${selectedReq.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                        >
                          <MessageCircle size={18} />
                          WhatsApp
                        </a>
                        <a 
                          href={`tel:${selectedReq.phone}`} 
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                        >
                          <Phone size={18} />
                          Call
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Block */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Vehicle Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12} /> Year</p>
                        <p className="font-medium text-white">{selectedReq.year || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin size={12} /> Kilometers</p>
                        <p className="font-medium text-white">{selectedReq.kmDriven ? `${selectedReq.kmDriven.toLocaleString()} km` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Fuel size={12} /> Fuel Type</p>
                        <p className="font-medium text-white">{selectedReq.fuelType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={12} /> Submitted</p>
                        <p className="font-medium text-white">{new Date(selectedReq.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {selectedReq.notes && (
                      <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Notes from Owner</p>
                        <p className="text-sm text-gray-300 italic">"{selectedReq.notes}"</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Photos Gallery */}
                {selectedReq.photos?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                      Uploaded Photos 
                      <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px]">{selectedReq.photos.length}</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedReq.photos.map((p, i) => (
                        <a 
                          key={i} 
                          href={p.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-white/10"
                        >
                          <Image src={p.url} alt={`Photo ${i+1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <ExternalLink className="text-white drop-shadow-md" size={24} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-white/10 h-full flex flex-col items-center justify-center text-center p-8 bg-[#12121f]/40">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-600">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="opacity-20 grayscale" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">No Request Selected</h3>
              <p className="text-gray-400 max-w-sm">Select a valuation request from the list to view its complete details, contact the owner, or update its status.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
