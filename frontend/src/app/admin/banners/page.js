'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
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
      if (link) fd.append('link', link);
      fd.append('desktopImage', desktopImage);
      fd.append('mobileImage', mobileImage);
      await api.post('/promo-banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Banner added successfully!');
      setTitle(''); setLink(''); setDesktopImage(null); setMobileImage(null);
      setShowForm(false);
      fetch();
    } catch { toast.error('Failed to add banner'); }
    setSaving(false);
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/promo-banners/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'Banner deactivated' : 'Banner activated');
      fetch();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/promo-banners/${id}`);
      toast.success('Banner deleted');
      fetch();
    } catch {}
  };

  const ImagePreview = ({ file, label, onClear, onChange }) => (
    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center bg-[#0a0a10] hover:bg-white/5 transition-colors group h-40">
      {file ? (
        <>
          <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain rounded-lg" />
          <button type="button" onClick={onClear} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10">
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <ImageIcon size={32} className="text-purple-500/50 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-gray-400 font-medium">{label}</span>
          <span className="text-xs text-gray-500 mt-1">Click to upload</span>
          <input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>Promo Banners</h1>
          <p className="text-gray-400 text-sm">Manage promotional banners for the website homepage.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-white mb-6">Create New Banner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="input-label">Banner Title (Optional)</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field bg-[#0a0a10]" placeholder="e.g., Summer Sale 2024" />
              </div>
              <div>
                <label className="input-label">Destination Link (Optional)</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={link} onChange={(e) => setLink(e.target.value)} className="input-field bg-[#0a0a10] pl-11" placeholder="e.g., /catalog?brand=Toyota" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label mb-2 block">Desktop Image *</label>
                <ImagePreview file={desktopImage} label="Desktop (16:9)" onClear={() => setDesktopImage(null)} onChange={setDesktopImage} />
              </div>
              <div>
                <label className="input-label mb-2 block">Mobile Image *</label>
                <ImagePreview file={mobileImage} label="Mobile (4:5 or 1:1)" onClear={() => setMobileImage(null)} onChange={setMobileImage} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary min-w-[150px]">
              {saving ? 'Uploading...' : 'Upload Banner'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)
        ) : banners.length > 0 ? (
          banners.map((b) => (
            <div key={b._id} className="glass-card flex flex-col overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
              
              {/* Image Previews */}
              <div className="flex w-full h-40 bg-[#0a0a10] relative">
                {/* Desktop View (takes up 2/3) */}
                <div className="w-2/3 h-full relative border-r border-white/10">
                  <img src={b.desktopImageUrl} alt={b.title || 'Desktop'} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-[10px] uppercase font-bold px-2 py-1 rounded text-white tracking-wider z-10">Desktop</div>
                </div>
                {/* Mobile View (takes up 1/3) */}
                <div className="w-1/3 h-full relative bg-[#1a1a24]">
                  <img src={b.mobileImageUrl} alt={b.title || 'Mobile'} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-[10px] uppercase font-bold px-2 py-1 rounded text-white tracking-wider z-10">Mobile</div>
                </div>

                {/* Status Overlay Badge */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span className={`badge shadow-lg backdrop-blur-md border border-white/10 ${b.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Banner Details & Actions */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-lg line-clamp-1">{b.title || 'Untitled Banner'}</h3>
                  {b.link && (
                    <div className="flex items-center gap-1.5 text-purple-400 text-sm mt-1">
                      <LinkIcon size={14} />
                      <span className="truncate">{b.link}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center justify-between mt-2 pt-4 border-t border-white/5">
                  <button onClick={() => toggleActive(b._id, b.isActive)} className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors ${b.isActive ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/40'}`}>
                    {b.isActive ? 'Deactivate' : 'Activate Banner'}
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 bg-[#12121f] rounded-2xl border border-white/5 border-dashed">
            <ImageIcon size={48} className="mb-4 text-gray-600 opacity-50" />
            <p className="text-lg font-medium">No banners uploaded yet</p>
            <p className="text-sm mt-1">Upload banners to showcase offers on the homepage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
