'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconPhoneCall, IconMail, IconMapPin, IconBrandWhatsapp, 
  IconCheck, IconUser, IconMessageCircle, IconArrowRight
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setStatus('loading');
    try {
      await api.post('/messages', form);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setForm({ name: '', phone: '', email: '', message: '' });
      }, 5000);
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      setStatus('idle');
    }
  };

  const inputClassName = "w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white font-['Inter'] outline-none focus:border-purple-500 focus:bg-white/[0.08] focus:ring-4 focus:ring-purple-600/20 transition-all placeholder-gray-500 hover:border-white/20 shadow-inner";

  return (
    <div className="bg-[#05050A] min-h-screen pt-20 pb-16 selection:bg-purple-500/30 relative overflow-clip">
      
      {/* Deep Atmospheric Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* HERO TYPOGRAPHY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 lg:mb-14 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300">We are online & ready to help</span>
          </div>
          
          <h1 className="font-['Outfit'] font-extrabold text-[40px] sm:text-[50px] md:text-[64px] text-white leading-[1.1] tracking-tight mb-4">
            Your Premium Car<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent inline-block sm:mt-1">
              Journey Starts Here.
            </span>
          </h1>
          
          <p className="font-['Inter'] text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Looking to buy, sell, or need expert automotive advice? Drop by our Surat showroom or send us a message below.
          </p>
        </motion.div>

        {/* THE BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[auto_auto] gap-6">
          
          {/* TILE 1: The Main Hub (Contact Form) - Spans 2 Cols, 2 Rows */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 lg:row-span-2 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group transition-all duration-500 hover:shadow-[0_16px_64px_rgba(168,85,247,0.1)] flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <IconMessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-2xl text-white">Send a Message</h3>
                <p className="text-gray-400 text-sm mt-1">We typically reply within a few hours.</p>
              </div>
            </div>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <IconCheck size={40} className="text-green-500" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2 font-['Outfit']">Message Delivered!</h4>
                <p className="text-gray-400">Our team has received your request and will be in touch shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative group/input">
                      <IconUser className="absolute left-4 top-[17px] text-gray-500 group-focus-within/input:text-purple-400 transition-colors z-10" size={20} />
                      <input 
                        type="text" name="name" 
                        value={form.name} onChange={handleChange} 
                        className={inputClassName} placeholder="Full Name" required 
                      />
                    </div>
                    
                    <div className="relative group/input">
                      <IconPhoneCall className="absolute left-4 top-[17px] text-gray-500 group-focus-within/input:text-purple-400 transition-colors z-10" size={20} />
                      <input 
                        type="tel" name="phone" 
                        value={form.phone} onChange={handleChange} 
                        className={inputClassName} placeholder="Phone Number" required 
                      />
                    </div>
                  </div>
                  
                  <div className="relative group/input">
                    <IconMail className="absolute left-4 top-[17px] text-gray-500 group-focus-within/input:text-purple-400 transition-colors z-10" size={20} />
                    <input 
                      type="email" name="email" 
                      value={form.email} onChange={handleChange} 
                      className={inputClassName} placeholder="Email Address (Optional)" 
                    />
                  </div>

                  <div className="relative group/input flex-1 flex flex-col">
                    <IconMessageCircle className="absolute left-4 top-[17px] text-gray-500 group-focus-within/input:text-purple-400 transition-colors z-10" size={20} />
                    <textarea 
                      name="message" 
                      value={form.message} onChange={handleChange} 
                      placeholder="How can we help you today?" 
                      className={`${inputClassName} !pl-12 !pt-4 min-h-[140px] resize-none flex-1`}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full mt-6 py-4 bg-white hover:bg-gray-100 text-[#05050A] rounded-2xl font-['Outfit'] font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-70 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-3 border-[#05050A]/30 border-t-[#05050A] rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <IconArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* TILE 2: The Instant Connect Cube */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 lg:row-span-1 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 rounded-[2rem] p-8 backdrop-blur-2xl relative overflow-hidden group transition-all duration-500 flex flex-col justify-center"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#25D366]/20 blur-[50px] rounded-full group-hover:bg-[#25D366]/30 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#25D366] text-[#05050A] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,211,102,0.4)] group-hover:scale-110 group-hover:rotate-[10deg] transition-transform duration-500">
                <IconBrandWhatsapp size={32} />
              </div>
              
              <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-2">Fastest Response</h3>
              <p className="text-sm text-[#25D366] font-medium mb-6">Usually replies under 5 minutes.</p>
              
              <a 
                href={getWhatsAppLink('+919898558222', 'Hi! I have a query.')} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full bg-[#25D366] hover:bg-[#20ba59] text-[#05050A] rounded-xl px-6 py-4 font-bold transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <IconArrowRight size={20} />
              </a>
            </div>
          </motion.div>

          {/* TILE 3: The Details Cube (Vertical) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1 lg:row-span-1 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-center gap-8 transition-all duration-500"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
                <IconPhoneCall size={20} />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Direct Line</div>
                <a href="tel:+919898558222" className="font-['Outfit'] font-bold text-lg text-white hover:text-purple-400 transition-colors">
                  +91 98985 58222
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
                <IconMail size={20} />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Email Us</div>
                <a href="mailto:info@harirammotors.com" className="font-['Outfit'] font-bold text-base text-white hover:text-purple-400 transition-colors truncate block">
                  info@harirammotors.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 shrink-0 shadow-inner">
                <IconMapPin size={20} />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Working Hours</div>
                <div className="font-['Outfit'] font-bold text-base text-white">Mon – Sat: 9AM – 8PM</div>
              </div>
            </div>
          </motion.div>

          {/* TILE 4: The Massive Map Cube */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3 lg:row-span-2 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-2 backdrop-blur-2xl overflow-hidden group transition-all duration-500 relative flex flex-col h-[400px] sm:h-[500px]"
          >
            <div className="absolute inset-0 z-10 pointer-events-none border-[6px] border-[#05050A] rounded-[2rem] opacity-50 mix-blend-overlay"></div>
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-purple-900/20 mix-blend-color z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500"></div>
              <iframe
                src="https://maps.google.com/maps?q=Hariram+Motors,+Simada+Canal,+BRTS+Rd,+near+Setubandh+Hills,+Surat,+Gujarat+395006&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[30%] contrast-125 scale-[1.02] group-hover:scale-100 transition-transform duration-700"
              />
              {/* Map Overlay Label */}
              <a 
                href="https://maps.app.goo.gl/x78uQPe6dTPCW4uE6"
                target="_blank" rel="noopener noreferrer"
                className="absolute bottom-6 left-6 bg-[#05050A]/90 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 rounded-2xl p-4 sm:p-5 z-20 flex items-center gap-4 shadow-2xl transition-all group/maplink hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/30 group-hover/maplink:bg-purple-500 group-hover/maplink:text-white transition-colors">
                  <IconMapPin size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-['Outfit'] font-bold text-white text-lg">Hariram Motors</h3>
                    <IconArrowRight size={14} className="text-purple-400 group-hover/maplink:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-sm text-gray-400 font-medium leading-tight max-w-[250px] group-hover/maplink:text-gray-300 transition-colors">
                    Hariram Motors ,Simada to, Canal, BRTS Rd, near Setubandh Hills, Surat, Gujarat 395006
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
