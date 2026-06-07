'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconUpload, IconX, IconCheck } from '@tabler/icons-react';
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
  const [status, setStatus] = useState('idle'); // idle, loading, success

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
    setStatus('loading');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      photos.forEach(photo => formData.append('photos', photo));

      await api.post('/sell-requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('success');
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setForm({ ownerName: '', phone: '', email: '', carBrand: '', carModel: '', year: '', kmDriven: '', fuelType: '', expectedPrice: '', notes: '' });
    setPhotos([]);
    setPreviews([]);
  };

  if (status === 'success') {
    return (
      <div className="bg-bg-primary min-h-screen pt-[120px] pb-20 flex items-center justify-center">
        <div className="text-center py-20 px-6 w-full">
          <div className="w-20 h-20 border-2 border-green-500 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <IconCheck size={40} className="text-green-500" />
          </div>
          <h2 className="font-['Outfit'] font-bold text-[32px] text-text-primary mb-3">
            Request Received!
          </h2>
          <p className="font-['Inter'] text-[18px] text-text-secondary max-w-md mx-auto leading-relaxed mb-8">
            Our team will call you within 24 hours with your car&apos;s valuation.
          </p>
          <button 
            onClick={resetForm}
            className="border border-purple-500/50 text-purple-400 hover:bg-purple-600/10 rounded-xl px-6 py-3 font-['Outfit'] font-bold transition-colors"
          >
            Submit Another Car →
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress roughly based on filled fields
  const requiredFields = ['ownerName', 'phone', 'carBrand', 'carModel'];
  const filledRequired = requiredFields.filter(f => form[f]).length;
  const progressPercent = (filledRequired / requiredFields.length) * 100;

  return (
    <div className="bg-bg-primary min-h-screen pt-20 pb-0">
      
      {/* HERO */}
      <section className="relative w-full py-20 overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 -right-48 w-96 h-96 bg-purple-600/[0.08] rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
              Sell Your Car
            </div>
            <h1 className="font-['Outfit'] font-bold text-[56px] text-text-primary leading-[1.1] mb-6">
              Get the Best Price<br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Guaranteed</span>
            </h1>
            <p className="font-['Inter'] text-[18px] text-text-secondary leading-8 mb-8">
              Free inspection. Instant quote. Payment within 24 hours. We handle all the paperwork. You just hand over the keys.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="border border-border-main rounded-full px-5 py-2 text-[14px] text-text-secondary">⚡ Instant Quote</span>
              <span className="border border-border-main rounded-full px-5 py-2 text-[14px] text-text-secondary">💰 Best Price</span>
              <span className="border border-border-main rounded-full px-5 py-2 text-[14px] text-text-secondary">📄 Zero Paperwork</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-16 bg-bg-secondary border-y border-border-main overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">The Process</div>
            <h2 className="font-['Outfit'] font-bold text-[32px] text-text-primary">Simple 3-Step Process</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between relative max-w-4xl mx-auto">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px border-t border-dashed border-purple-500/30 -z-0"></div>
            
            {/* Steps */}
            {[
              { num: 1, title: 'Fill the Form', desc: 'Tell us about your car online' },
              { num: 2, title: 'Free Inspection', desc: 'We inspect or you bring it in' },
              { num: 3, title: 'Get Paid', desc: 'Same-day payment, docs handled' }
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 mb-10 md:mb-0">
                <div className="w-[52px] h-[52px] rounded-full border-2 border-purple-500/50 bg-bg-secondary flex items-center justify-center font-['Outfit'] font-bold text-[22px] text-purple-400 mb-5">
                  {step.num}
                </div>
                <h3 className="font-['Outfit'] font-bold text-[17px] text-text-primary mb-2">{step.title}</h3>
                <p className="font-['Inter'] text-[14px] text-text-muted max-w-[180px] leading-6">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELL FORM */}
      <section className="w-full py-20 pb-32">
        <div className="max-w-2xl mx-auto px-6">
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full mb-12 overflow-hidden">
            <div 
              className="h-full bg-purple-600 transition-all duration-500 ease-out" 
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* PART A */}
            <div className="mb-10">
              <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-6 font-bold">01 / Contact Info</div>
              <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary mb-8">Who are we talking to?</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" required />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Phone Number <span className="text-purple-400">*</span>
                  </label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" required />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Email <span className="text-text-muted normal-case tracking-normal">(optional)</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" />
                </div>
              </div>
            </div>

            <div className="w-full border-b border-border-main mb-10"></div>

            {/* PART B */}
            <div className="mb-10">
              <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-6 font-bold">02 / Car Details</div>
              <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary mb-8">Tell us about your car</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Car Brand <span className="text-purple-400">*</span>
                  </label>
                  <input type="text" name="carBrand" value={form.carBrand} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" required />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Car Model <span className="text-purple-400">*</span>
                  </label>
                  <input type="text" name="carModel" value={form.carModel} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" required />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Year
                  </label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" />
                </div>
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    KM Driven
                  </label>
                  <input type="number" name="kmDriven" value={form.kmDriven} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                  Fuel Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({...form, fuelType: type})}
                      className={`px-4 md:px-5 py-3 md:py-2.5 min-h-[44px] rounded-xl text-sm font-bold font-['Inter'] transition-colors border ${
                        form.fuelType === type 
                          ? 'bg-purple-600 border-purple-600 text-white' 
                          : 'bg-bg-secondary border-white/12 text-text-secondary hover:border-purple-500/50 hover:text-text-primary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                  Expected Price
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">₹</span>
                  <input type="number" name="expectedPrice" value={form.expectedPrice} onChange={handleChange} className="w-full bg-bg-secondary border border-border-main rounded-xl pl-10 pr-4 md:pr-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]" />
                </div>
              </div>
            </div>

            <div className="w-full border-b border-border-main mb-10"></div>

            {/* PART C */}
            <div className="mb-10">
              <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-6 font-bold">03 / Photos & Notes</div>
              <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary mb-8">Show us the car</h3>
              
              <div 
                className="w-full rounded-2xl border-2 border-dashed border-white/12 bg-white/[0.02] py-14 text-center hover:border-purple-500/40 hover:bg-purple-600/[0.04] transition-colors cursor-pointer group"
                onClick={() => document.getElementById('photo-upload').click()}
              >
                <div className="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                  <IconUpload size={20} />
                </div>
                <div className="font-['Outfit'] font-bold text-[17px] text-text-primary">Drop photos here</div>
                <div className="text-purple-400 underline text-sm mt-1">or click to browse</div>
                <div className="font-['Inter'] text-[12px] text-text-muted mt-3">Up to 10 photos · JPG PNG · Max 5MB each</div>
                <input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
                  {previews.map((src, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden relative group border border-border-main">
                      <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 md:w-5 md:h-5 rounded-full bg-red-500 flex items-center justify-center text-text-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                  Additional Notes
                </label>
                <textarea 
                  name="notes" 
                  value={form.notes} 
                  onChange={handleChange} 
                  placeholder="Modifications, damage, service history, reason for selling..." 
                  rows={4} 
                  className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80] resize-y" 
                />
              </div>
            </div>

            {/* Mobile sticky container for submit button (it will just be a normal button on desktop, but we can make it fixed on mobile if we wrap it, but the spec says "sticky fixed bottom bar on mobile", let's use a standard wrapper) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary/95 backdrop-blur-xl border-t border-border-main md:relative md:bg-transparent md:border-0 md:p-0 md:mt-10 z-50">
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-['Outfit'] font-bold text-[16px] transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {status === 'loading' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {status === 'loading' ? 'Submitting...' : 'Submit Request →'}
              </button>
            </div>

          </form>
        </div>
      </section>

    </div>
  );
}
