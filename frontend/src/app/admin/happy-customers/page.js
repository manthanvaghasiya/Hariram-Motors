'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Star, Upload } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminHappyCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', review: '', rating: '5' });
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await api.get('/happy-customers/all');
      setCustomers(res.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !photo) return toast.error('Name and photo are required');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('customerName', form.customerName);
      fd.append('review', form.review);
      fd.append('rating', form.rating);
      fd.append('photo', photo);
      await api.post('/happy-customers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Added!');
      setForm({ customerName: '', review: '', rating: '5' });
      setPhoto(null);
      setShowForm(false);
      fetch();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await api.delete(`/happy-customers/${id}`);
      toast.success('Deleted');
      fetch();
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Happy Customers</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !py-2.5 !px-5 !text-sm">
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 mb-6 hover:!transform-none space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="input-label">Customer Name *</label><input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input-field" required /></div>
            <div><label className="input-label">Rating</label><select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input-field">{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}</select></div>
          </div>
          <div><label className="input-label">Review</label><textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="input-field" rows={2} /></div>
          <div><label className="input-label">Photo *</label><input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="input-field" required /></div>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)
        ) : customers.map((c) => (
          <div key={c._id} className="glass-card p-4 hover:!transform-none">
            <div className="flex items-center gap-3 mb-3">
              {c.photo?.url ? (
                <Image src={c.photo.url} alt={c.customerName} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-[#0f0f1a] font-bold">{c.customerName?.[0]}</div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{c.customerName}</p>
                <div className="flex gap-0.5">{[...Array(c.rating || 5)].map((_, j) => <Star key={j} size={12} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />)}</div>
              </div>
              <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:text-[var(--color-accent-red)] transition"><Trash2 size={14} /></button>
            </div>
            {c.review && <p className="text-xs text-[var(--color-text-secondary)] italic">&ldquo;{c.review}&rdquo;</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
