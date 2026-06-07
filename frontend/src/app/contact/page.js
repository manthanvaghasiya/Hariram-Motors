'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconPhone, IconMail, IconMapPin, IconBrandWhatsapp, IconCheck } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success

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
      }, 3000);
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen pt-20 pb-0">

      {/* HERO */}
      <section className="w-full py-20 bg-bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
              Contact
            </div>
            <h1 className="font-['Outfit'] font-bold text-4xl md:text-[52px] text-text-primary leading-tight mb-4">
              Let&apos;s Talk
            </h1>
            <p className="font-['Inter'] text-[18px] text-text-secondary leading-relaxed mb-8">
              Got a question? Looking for a specific car? We&apos;re one message away.
            </p>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT — CLEAN 2-COL (60/40) */}
      <section className="w-full pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

            {/* Left col (60%) — MESSAGE FORM */}
            <div className="lg:w-[60%]">
              <h2 className="font-['Outfit'] font-bold text-[24px] text-text-primary mb-8">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Phone Number <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91"
                    className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Email <span className="text-text-muted normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80]"
                  />
                </div>

                <div>
                  <label className="block font-['Inter'] text-[12px] text-text-secondary uppercase tracking-wider mb-2 font-medium">
                    Message <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you need..."
                    rows={5}
                    className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-text-primary text-base md:text-sm font-['Inter'] outline-none focus:border-purple-500 focus:ring-[3px] focus:ring-purple-600/[0.12] transition-all placeholder-[#6b6b80] resize-y"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className={`mt-6 w-full py-4 rounded-xl font-['Outfit'] font-bold text-[16px] flex items-center justify-center gap-2 transition-all duration-300 ${status === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-70'
                    }`}
                >
                  {status === 'loading' && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {status === 'loading' && 'Sending...'}

                  {status === 'success' && <IconCheck size={20} />}
                  {status === 'success' && 'Sent! We\'ll reply shortly.'}

                  {status === 'idle' && 'Send Message'}
                </button>
              </form>
            </div>

            {/* Right col (40%) — INFO STACK */}
            <div className="lg:w-[40%] flex flex-col pt-12 lg:pt-0">

              <div className="pb-8 mb-8 border-b border-border-main">
                <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-2 font-medium">Phone</div>
                <div className="font-['Outfit'] font-bold text-[20px] text-text-primary leading-none mb-1">+91 98985 58222</div>
                <a href="tel:+919898558222" className="text-purple-400 text-[12px] underline hover:text-purple-300 transition-colors">Tap to call</a>
              </div>

              <div className="pb-8 mb-8 border-b border-border-main">
                <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-2 font-medium">Email</div>
                <div className="font-['Inter'] text-[18px] text-text-primary">info@harimotors.com</div>
              </div>

              <div className="pb-8 mb-8 border-b border-border-main">
                <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-2 font-medium">Showroom</div>
                <div className="font-['Inter'] text-[16px] text-text-primary leading-7">
                  Simada Canal, BRTS Rd,<br />
                  near Setubandh Hills, Surat 395006
                </div>
              </div>

              <div className="mb-10">
                <div className="text-purple-400 text-[12px] uppercase tracking-wider mb-2 font-medium">Working Hours</div>
                <div className="font-['Inter'] text-[16px] text-text-primary mb-1">Mon – Sat: 9:00 AM – 8:00 PM</div>
                <div className="font-['Inter'] text-[14px] text-text-muted">Sunday: By appointment</div>
              </div>

              {/* WhatsApp block */}
              <div className="bg-bg-secondary rounded-2xl p-6 border border-border-main flex flex-col sm:flex-row items-center gap-5 w-full mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#25d366]/10 text-[#25d366] flex items-center justify-center flex-shrink-0">
                  <IconBrandWhatsapp size={24} />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <div className="font-['Outfit'] font-bold text-text-primary mb-1">Chat on WhatsApp</div>
                  <div className="font-['Inter'] text-[12px] text-text-muted">Usually replies under 5 mins</div>
                </div>
                <a
                  href={getWhatsAppLink('+919898558222', 'Hi! I have a question about your cars.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25d366] hover:bg-[#20ba59] text-text-primary rounded-xl px-5 py-2.5 text-[14px] font-bold transition-colors w-full sm:w-auto text-center"
                >
                  Open Chat →
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-20 w-full bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
              Find Us
            </div>
            <h2 className="font-['Outfit'] font-bold text-3xl md:text-[38px] text-text-primary">
              Visit the Showroom
            </h2>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-border-subtle">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.089452033878!2d72.88098191493541!3d21.228229885890886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4b23838501%3A0xc3fce6c50ec33575!2sHariram%20Motors!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
