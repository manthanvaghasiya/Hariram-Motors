'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconUpload, IconX, IconCheck, IconCar, IconCurrencyRupee, IconUser, IconPhone, IconMail, IconCalendar, IconDashboard } from '@tabler/icons-react';
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

  // Smart Sticky State for Left Column
  const leftColumnRef = useRef(null);
  const [stickyTop, setStickyTop] = useState('128px'); // default stick top

  useEffect(() => {
    const handleResize = () => {
      if (!leftColumnRef.current) return;
      const elementHeight = leftColumnRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // If element is taller than available window space
      if (elementHeight > windowHeight - 128) {
        // Stick to the bottom (negative top offset)
        const top = windowHeight - elementHeight - 24;
        setStickyTop(`${top}px`);
      } else {
        // Shorter than screen -> Stick to top
        setStickyTop('128px');
      }
    };

    // Delay slightly to ensure fonts/images are fully rendered
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    
    let observer;
    if (window.ResizeObserver && leftColumnRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(leftColumnRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Success State View
  if (status === 'success') {
    return (
      <div className="bg-[#0a0a12] min-h-screen pt-[120px] pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center py-20 px-6 w-full max-w-2xl relative z-10 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 border-4 border-green-500 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
          >
            <IconCheck size={48} className="text-green-400" />
          </motion.div>
          <h2 className="font-['Outfit'] font-bold text-4xl text-white mb-4">
            Request Received Successfully!
          </h2>
          <p className="font-['Inter'] text-lg text-gray-300 max-w-md mx-auto leading-relaxed mb-10">
            Thank you for choosing Hariram Motors. Our experts are evaluating your car's details and will contact you within <strong className="text-white">24 hours</strong> with the best possible valuation.
          </p>
          <button 
            onClick={resetForm}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50 rounded-xl px-8 py-4 font-['Outfit'] font-bold text-lg transition-all transform hover:-translate-y-1"
          >
            Submit Another Car →
          </button>
        </motion.div>
      </div>
    );
  }

  const requiredFields = ['ownerName', 'phone', 'carBrand', 'carModel'];
  const filledRequired = requiredFields.filter(f => form[f]).length;
  const progressPercent = (filledRequired / requiredFields.length) * 100;

  // Input Class Abstraction
  const inputClassName = "w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-[13px] text-white font-['Inter'] outline-none focus:border-purple-500 focus:bg-white/10 focus:ring-4 focus:ring-purple-600/20 transition-all placeholder-gray-500 hover:border-white/20";

  return (
    <div className="bg-[#0a0a12] min-h-screen pt-28 pb-10 selection:bg-purple-500/30 relative overflow-clip">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Sticky Hero & Progress */}
          <div className="lg:col-span-5 relative">
            <div 
              ref={leftColumnRef}
              className="lg:sticky flex flex-col pt-4"
              style={{ top: stickyTop }}
            >
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block border border-purple-500/30 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6 font-bold backdrop-blur-md">
                  Sell Your Car
                </div>
                
                <h1 className="font-['Outfit'] font-extrabold text-[36px] md:text-[48px] text-white leading-[1.1] mb-6 tracking-tight">
                  Get the Best Price<br />
                  <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Guaranteed.</span>
                </h1>
                
                <p className="font-['Inter'] text-lg text-gray-400 leading-relaxed mb-10 max-w-md">
                  Free inspection. Instant quote. Payment within 24 hours. We handle all the paperwork. You just hand over the keys and get paid.
                </p>

                {/* Features List */}
                <div className="flex flex-col gap-4 mb-10">
                  {[
                    { icon: <IconCurrencyRupee size={24} className="text-purple-400" />, title: 'Instant Quote', desc: 'Get an estimated value instantly based on current market trends.' },
                    { icon: <IconDashboard size={24} className="text-blue-400" />, title: 'Best Market Price', desc: 'We guarantee to match or beat market valuations for your car.' },
                    { icon: <IconCheck size={24} className="text-green-400" />, title: 'Zero Paperwork', desc: 'We handle RTO, title transfers, and all legal documentation completely.' }
                  ].map((feat, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                      className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                        {feat.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold font-['Outfit'] text-lg mb-1">{feat.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar (Desktop) */}
                <div className="hidden lg:block bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-12 shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-4 relative z-10">
                    <span>Form Completion</span>
                    <span className="text-purple-400 text-sm">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5 relative z-10">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.max(5, progressPercent)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Trust Badge / Info Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden mb-12 lg:mb-0 shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a2e] bg-gray-800 overflow-hidden relative">
                          <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-yellow-400 mb-1">
                        {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                      </div>
                      <p className="text-sm text-gray-300 font-medium">Trusted by <span className="text-white font-bold">500+</span> verified sellers</p>
                    </div>
                  </div>
                </motion.div>
                
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-7 pb-32 lg:pb-16">
            
            {/* Progress Bar (Mobile) */}
            <div className="lg:hidden sticky top-20 z-40 bg-[#0a0a12]/80 backdrop-blur-xl py-4 mb-5 -mx-6 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                <span>Progress</span>
                <span className="text-purple-400">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-purple-500" 
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.max(5, progressPercent)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              
              {/* PART 1: Contact Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors"></div>
                
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <span className="font-['Outfit'] font-bold text-lg">01</span>
                  </div>
                  <div>
                    <h3 className="font-['Outfit'] font-bold text-lg text-white">Contact Info</h3>
                    <p className="text-gray-400 text-sm">Where can we reach you?</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">
                      Full Name <span className="text-purple-400">*</span>
                    </label>
                    <IconUser className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} className={inputClassName} placeholder="John Doe" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">
                      Phone Number <span className="text-purple-400">*</span>
                    </label>
                    <IconPhone className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClassName} placeholder="+91 98765 43210" required />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">
                      Email Address <span className="text-gray-600 normal-case tracking-normal">(optional)</span>
                    </label>
                    <IconMail className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClassName} placeholder="john@example.com" />
                  </div>
                </div>
              </motion.div>

              {/* PART 2: Car Details */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
                
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <span className="font-['Outfit'] font-bold text-lg">02</span>
                  </div>
                  <div>
                    <h3 className="font-['Outfit'] font-bold text-lg text-white">Car Details</h3>
                    <p className="text-gray-400 text-sm">Tell us what you're selling</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">Car Brand <span className="text-purple-400">*</span></label>
                    <IconCar className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="text" name="carBrand" value={form.carBrand} onChange={handleChange} className={inputClassName} placeholder="e.g. Hyundai" required />
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">Car Model <span className="text-purple-400">*</span></label>
                    <IconCar className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="text" name="carModel" value={form.carModel} onChange={handleChange} className={inputClassName} placeholder="e.g. i20 Asta" required />
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">Reg. Year</label>
                    <IconCalendar className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="number" name="year" value={form.year} onChange={handleChange} className={inputClassName} placeholder="e.g. 2021" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">KM Driven</label>
                    <IconDashboard className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                    <input type="number" name="kmDriven" value={form.kmDriven} onChange={handleChange} className={inputClassName} placeholder="e.g. 45000" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold pl-1">Fuel Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({...form, fuelType: type})}
                        className={`px-6 py-3 rounded-xl text-sm font-bold font-['Inter'] transition-all border ${
                          form.fuelType === type 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/50 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">Expected Price (₹)</label>
                  <IconCurrencyRupee className="absolute left-4 top-[31px] text-gray-500 z-10" size={16} />
                  <input type="number" name="expectedPrice" value={form.expectedPrice} onChange={handleChange} className={inputClassName} placeholder="e.g. 550000" />
                </div>
              </motion.div>

              {/* PART 3: Photos & Notes */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500/50 group-hover:bg-green-500 transition-colors"></div>
                
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <span className="font-['Outfit'] font-bold text-lg">03</span>
                  </div>
                  <div>
                    <h3 className="font-['Outfit'] font-bold text-lg text-white">Photos & Notes</h3>
                    <p className="text-gray-400 text-sm">A picture is worth a thousand bucks</p>
                  </div>
                </div>
                
                <div 
                  className="w-full rounded-2xl border-2 border-dashed border-white/20 bg-white/5 py-6 text-center hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer group mb-6"
                  onClick={() => document.getElementById('photo-upload').click()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4 text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)]">
                    <IconUpload size={28} />
                  </div>
                  <div className="font-['Outfit'] font-bold text-lg text-white mb-2">Upload Car Photos</div>
                  <div className="text-gray-400 text-sm">Drag and drop or <span className="text-purple-400 underline decoration-purple-400/30 underline-offset-4">browse files</span></div>
                  <div className="font-['Inter'] text-xs text-gray-500 mt-4">Up to 10 photos · JPG/PNG · Max 5MB each</div>
                  <input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
                    <AnimatePresence>
                      {previews.map((src, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={src} 
                          className="aspect-square rounded-xl overflow-hidden relative group border border-white/10"
                        >
                          <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                              className="w-10 h-10 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <IconX size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold pl-1">Additional Notes</label>
                  <textarea 
                    name="notes" 
                    value={form.notes} 
                    onChange={handleChange} 
                    placeholder="Modifications, damage, service history, reason for selling..." 
                    rows={4} 
                    className={`${inputClassName} !px-5 !py-4 resize-y`}
                  />
                </div>
              </motion.div>

              {/* SUBMIT BUTTON */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a12]/90 backdrop-blur-2xl border-t border-white/10 md:relative md:bg-transparent md:border-0 md:p-0 md:mt-4 z-50">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-2xl font-['Outfit'] font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] disabled:opacity-70 disabled:hover:shadow-none flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0 disabled:transform-none"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Submit Valuation Request →</span>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
