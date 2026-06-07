'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await api.get('/promo-banners/all');
      setBanners(res.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desktopImage || !mobileImage) return toast.error('Both images required');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('desktopImage', desktopImage);
      fd.append('mobileImage', mobileImage);
      await api.post('/promo-banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Banner added!');
      setTitle(''); setDesktopImage(null); setMobileImage(null);
      setShowForm(false);
      fetch();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/promo-banners/${id}`, { isActive: !isActive });
      fetch();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await api.delete(`/promo-banners/${id}`);
      toast.success('Deleted');
      fetch();
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Promo Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !py-2.5 !px-5 !text-sm"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 mb-6 hover:!transform-none space-y-4">
          <div><label className="input-label">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Banner title (optional)" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="input-label">Desktop Image *</label><input type="file" accept="image/*" onChange={(e) => setDesktopImage(e.target.files[0])} className="input-field" required /></div>
            <div><label className="input-label">Mobile Image *</label><input type="file" accept="image/*" onChange={(e) => setMobileImage(e.target.files[0])} className="input-field" required /></div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5">{saving ? 'Uploading...' : 'Upload Banner'}</button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          [...Array(2)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)
        ) : banners.length > 0 ? (
          banners.map((b) => (
            <div key={b._id} className="glass-card overflow-hidden hover:!transform-none">
              <div className="relative w-full">
                <img src={b.desktopImageUrl} alt={b.title || 'Banner'} className="w-full h-auto" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{b.title || 'Untitled Banner'}</p>
                  <span className={`badge ${b.isActive ? 'badge-available' : 'badge-sold'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(b._id, b.isActive)} className="text-xs btn-outline !py-1.5 !px-3">
                    {b.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="p-2 hover:text-[var(--color-accent-red)] transition"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-12 text-[var(--color-text-muted)]">No banners yet</p>
        )}
      </div>
    </div>
  );
}
