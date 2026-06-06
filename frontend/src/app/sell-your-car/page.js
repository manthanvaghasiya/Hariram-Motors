'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Car, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Image from 'next/image';

export default function SellYourCarPage() {
  const [form, setForm] = useState({
    ownerName: '', phone: '', email: '', carBrand: '', carModel: '',
    year: '', kmDriven: '', fuelType: '', expectedPrice: '', notes: '',
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    setPhotos([...photos, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ownerName || !form.phone || !form.carBrand || !form.carModel) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      photos.forEach(photo => formData.append('photos', photo));

      await api.post('/sell-requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      toast.success('Your request has been submitted!');
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-[rgba(74,222,128,0.15)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-[var(--color-accent-green)]" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
            Request Submitted!
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Thank you for choosing Hariram Motors. Our team will review your car details and contact you within 24 hours.
          </p>
          <button onClick={() => { setSuccess(false); setForm({ ownerName: '', phone: '', email: '', carBrand: '', carModel: '', year: '', kmDriven: '', fuelType: '', expectedPrice: '', notes: '' }); setPhotos([]); setPreviews([]); }} className="btn-outline">
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-[var(--color-bg-surface)] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(226,176,74,0.1), transparent 60%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-[rgba(226,176,74,0.1)] border border-[rgba(226,176,74,0.2)] rounded-full text-[var(--color-primary)] text-sm font-medium mb-6">
              <Car size={14} className="inline mr-1" /> Sell Your Car
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
              Sell Your <span className="gradient-text">Car</span> to Us
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-xl">
              Get the best price for your car. Fill in the details below and our team will get in touch with you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Car & Owner Details</h2>

              {/* Owner Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="input-label">Owner Name *</label>
                  <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Your full name" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number" className="input-field" required />
                </div>
                <div className="md:col-span-2">
                  <label className="input-label">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your email (optional)" className="input-field" />
                </div>
              </div>

              <hr className="border-[var(--color-border)] mb-6" />

              {/* Car Info */}
              <h3 className="text-lg font-semibold mb-4">Car Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="input-label">Car Brand *</label>
                  <input type="text" name="carBrand" value={form.carBrand} onChange={handleChange} placeholder="e.g. Maruti Suzuki" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Car Model *</label>
                  <input type="text" name="carModel" value={form.carModel} onChange={handleChange} placeholder="e.g. Swift Dzire" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Year</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2020" className="input-field" min="1990" max={new Date().getFullYear() + 1} />
                </div>
                <div>
                  <label className="input-label">KM Driven</label>
                  <input type="number" name="kmDriven" value={form.kmDriven} onChange={handleChange} placeholder="e.g. 45000" className="input-field" />
                </div>
                <div>
                  <label className="input-label">Fuel Type</label>
                  <select name="fuelType" value={form.fuelType} onChange={handleChange} className="input-field">
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Expected Price (₹)</label>
                  <input type="number" name="expectedPrice" value={form.expectedPrice} onChange={handleChange} placeholder="e.g. 500000" className="input-field" />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mb-6">
                <label className="input-label">Upload Car Photos (up to 10)</label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer" onClick={() => document.getElementById('photo-upload').click()}>
                  <Upload size={32} className="mx-auto text-[var(--color-text-muted)] mb-2" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">JPG, PNG up to 10MB each</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotos}
                    className="hidden"
                  />
                </div>

                {/* Preview */}
                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                        <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="input-label">Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional details about your car..." className="input-field" rows={3} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3.5 !text-base">
                {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
