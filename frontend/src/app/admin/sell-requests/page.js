'use client';

import { useEffect, useState } from 'react';
import { Trash2, Phone, Mail, Eye } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminSellRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/sell-requests?limit=50');
      setRequests(res.data.requests || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/sell-requests/${id}`, { status });
      toast.success('Status updated');
      fetchRequests();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await api.delete(`/sell-requests/${id}`);
      toast.success('Deleted');
      fetchRequests();
      if (selectedReq?._id === id) setSelectedReq(null);
    } catch {}
  };

  const statusColors = {
    pending: 'badge-featured',
    reviewed: 'bg-[rgba(96,165,250,0.15)] text-[var(--color-accent-blue)]',
    contacted: 'badge-available',
    closed: 'badge-sold',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Sell Requests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
          ) : requests.length > 0 ? (
            requests.map((req) => (
              <div key={req._id} className={`glass-card p-4 hover:!transform-none cursor-pointer transition-all ${selectedReq?._id === req._id ? 'border-[var(--color-primary)]' : ''}`} onClick={() => setSelectedReq(req)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{req.carBrand} {req.carModel} ({req.year || 'N/A'})</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{req.ownerName} · {req.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusColors[req.status]}`}>{req.status}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(req._id); }} className="p-1 hover:text-[var(--color-accent-red)] transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-[var(--color-text-muted)]">No sell requests yet</p>
          )}
        </div>

        {/* Detail Panel */}
        <div>
          {selectedReq ? (
            <div className="glass-card p-5 hover:!transform-none sticky top-4">
              <h3 className="font-bold mb-4">{selectedReq.carBrand} {selectedReq.carModel}</h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-[var(--color-text-muted)]">Owner:</span> {selectedReq.ownerName}</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-[var(--color-primary)]" /> {selectedReq.phone}</p>
                {selectedReq.email && <p className="flex items-center gap-2"><Mail size={14} className="text-[var(--color-primary)]" /> {selectedReq.email}</p>}
                <p><span className="text-[var(--color-text-muted)]">Year:</span> {selectedReq.year || 'N/A'}</p>
                <p><span className="text-[var(--color-text-muted)]">KM:</span> {selectedReq.kmDriven ? `${selectedReq.kmDriven.toLocaleString()} km` : 'N/A'}</p>
                <p><span className="text-[var(--color-text-muted)]">Fuel:</span> {selectedReq.fuelType || 'N/A'}</p>
                <p><span className="text-[var(--color-text-muted)]">Expected:</span> {selectedReq.expectedPrice ? formatPrice(selectedReq.expectedPrice) : 'N/A'}</p>
                {selectedReq.notes && <p><span className="text-[var(--color-text-muted)]">Notes:</span> {selectedReq.notes}</p>}

                {selectedReq.photos?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedReq.photos.map((p, i) => (
                      <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={p.url} alt="" fill className="object-cover" />
                      </a>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-[var(--color-border)]">
                  <label className="input-label">Update Status</label>
                  <select value={selectedReq.status} onChange={(e) => updateStatus(selectedReq._id, e.target.value)} className="input-field !text-sm">
                    {['pending', 'reviewed', 'contacted', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center hover:!transform-none">
              <Eye size={32} className="mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
