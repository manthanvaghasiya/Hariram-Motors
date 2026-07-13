'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Edit, Upload, Image as ImageIcon, Search, User, Car, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function AdminHappyCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ customerName: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetch = async () => {
    try {
      const res = await api.get('/happy-customers/all');
      setCustomers(res.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({ customerName: '', description: '' });
    setPhoto(null);
    setPreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      customerName: customer.customerName || '',
      description: customer.description || customer.review || ''
    });
    setPhoto(null);
    setPreview(customer.photo?.url || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName) return toast.error('Customer Name is required');
    if (!editingId && !photo) return toast.error('Photo is required for new entries');
    
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('customerName', form.customerName);
      // Map description to review for backend compatibility if needed
      fd.append('description', form.description);
      fd.append('review', form.description);
      
      if (photo) fd.append('photo', photo);

      if (editingId) {
        await api.put(`/happy-customers/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Updated successfully!');
      } else {
        await api.post('/happy-customers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Added successfully!');
      }
      
      resetForm();
      fetch();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/happy-customers/${id}`);
      toast.success('Deleted successfully');
      if (editingId === id) resetForm();
      fetch();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Happy Customers</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your customer delivery photos and testimonials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Fixed Form */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#12121f] border border-white/10 rounded-3xl p-6 md:p-8 sticky top-24 shadow-2xl relative overflow-hidden group/form">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
                {editingId ? <Edit size={18} /> : <Plus size={18} />}
              </div>
              {editingId ? 'Edit Customer' : 'Add New Customer'}
            </h2>

            <div className="space-y-5">
              
              {/* Customer Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 tracking-wide">Customer Name <span className="text-red-500">*</span></label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-purple-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    value={form.customerName} 
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 text-white text-[15px] rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-11 p-3.5 transition-all placeholder:text-gray-600 hover:border-white/20" 
                    placeholder="e.g. Rahul Sharma" 
                    required 
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 tracking-wide">Description (Optional)</label>
                <div className="relative group/input">
                  <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-gray-500 group-focus-within/input:text-purple-400 transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 text-white text-[15px] rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-11 p-3.5 transition-all placeholder:text-gray-600 hover:border-white/20 resize-none min-h-[100px]" 
                    placeholder="Write a short review or note..." 
                  />
                </div>
              </div>

              {/* Delivery Photo */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-gray-400 tracking-wide">Delivery Photo <span className="text-red-500">*</span></label>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 bg-white/5 relative overflow-hidden group/dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  
                  {preview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/dropzone:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                        <Upload size={28} className="text-white mb-2 -translate-y-2 group-hover/dropzone:translate-y-0 transition-transform duration-300" />
                        <span className="text-white text-sm font-bold tracking-wide uppercase">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-purple-400 group-hover/dropzone:scale-110 group-hover/dropzone:bg-purple-500/20 group-hover/dropzone:border-purple-500/30 transition-all duration-500">
                        <Upload size={28} />
                      </div>
                      <p className="text-[15px] font-bold text-white mb-1 group-hover/dropzone:text-purple-400 transition-colors">Click or drag image to upload</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">High-res PNG or JPG (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-5 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex-1 text-sm tracking-wide">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={saving} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl flex-[2] transition-all duration-300 shadow-lg shadow-purple-900/20 disabled:opacity-50 text-sm tracking-wide">
                  {saving ? 'Saving...' : (editingId ? 'Update Customer' : 'Add Customer')}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Customer List */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]/50">
              <h3 className="font-bold">Customer List <span className="ml-2 text-xs py-1 px-2.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">{customers.length}</span></h3>
            </div>
            
            <div className="p-5">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)}
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-16 text-[var(--color-text-muted)]">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No happy customers added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {customers.map((c) => (
                    <div key={c._id} className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-300">
                      <div className="relative aspect-square w-full bg-black/20">
                        {c.photo?.url ? (
                          <Image src={c.photo.url} alt={c.customerName} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]"><ImageIcon size={32} /></div>
                        )}
                        
                        {/* Hover Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                          <button onClick={() => handleEdit(c)} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors shadow-lg" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-lg" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-bold text-[15px] truncate">{c.customerName}</h4>
                        {c.description && <p className="text-xs text-[var(--color-text-secondary)] mt-2 line-clamp-2 leading-relaxed">{c.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
