'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';



export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/messages', form);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: process.env.NEXT_PUBLIC_WHATSAPP || '+919373482016', href: `tel:${process.env.NEXT_PUBLIC_WHATSAPP || '+919373482016'}` },
    { icon: Mail, label: 'Email', value: 'info@harimotors.com', href: 'mailto:info@harimotors.com' },
    { icon: MapPin, label: 'Address', value: process.env.NEXT_PUBLIC_ADDRESS || 'Simada to, Canal, BRTS Rd, near Setubandh Hills, Surat, Gujarat 395006' },
    { icon: Clock, label: 'Hours', value: 'Mon - Sat: 10:00 AM - 8:00 PM' },
  ];

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-[var(--color-bg-surface)] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(226,176,74,0.1), transparent 60%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-[rgba(226,176,74,0.1)] border border-[rgba(226,176,74,0.2)] rounded-full text-[var(--color-primary)] text-sm font-medium mb-6">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-xl">
              Have questions or want to schedule a visit? We&apos;re here to help!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-8">
                <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="input-label">Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Phone *</label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      placeholder="Your email (optional)"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Message *</label>
                    <textarea
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field"
                      rows={4}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3.5">
                    {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info + Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="glass-card p-5">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(226,176,74,0.1)] flex items-center justify-center mb-3">
                      <info.icon size={18} className="text-[var(--color-primary)]" />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">{info.value}</a>
                    ) : (
                      <p className="text-sm font-medium">{info.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink(process.env.NEXT_PUBLIC_WHATSAPP || '+919373482016', 'Hi! I have a question about your cars.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center !py-4 !text-base"
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>

              {/* Map */}
              <div className="glass-card overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238132.5888489734!2d72.7132!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
