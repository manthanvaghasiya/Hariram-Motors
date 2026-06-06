'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, Car, Clock, MapPin, Target, Eye } from 'lucide-react';
import api from '@/lib/api';

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(value) || 0;
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/site-settings').then(res => setSettings(res.data || {})).catch(() => {});
  }, []);

  const stats = [
    { icon: Clock, value: settings.yearsInBusiness || 10, suffix: '+', label: 'Years in Business' },
    { icon: Car, value: settings.carsSold || 500, suffix: '+', label: 'Cars Sold' },
    { icon: Users, value: settings.happyCustomers || 450, suffix: '+', label: 'Happy Customers' },
    { icon: Award, value: 100, suffix: '%', label: 'Customer Satisfaction' },
  ];

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-[var(--color-bg-surface)] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(226,176,74,0.1), transparent 60%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-[rgba(226,176,74,0.1)] border border-[rgba(226,176,74,0.2)] rounded-full text-[var(--color-primary)] text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Driving <span className="gradient-text">Trust</span> Since Day One
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              {settings.aboutText || 'Hariram Motors has been serving customers in Surat with the best selection of pre-owned cars. We believe in transparency, quality, and customer satisfaction.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} className="text-[#0f0f1a]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center mb-5">
                <Target size={22} className="text-[#0f0f1a]" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Our Mission</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {settings.missionText || 'To provide the finest quality pre-owned vehicles at the most competitive prices, with complete transparency and exceptional after-sales service.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center mb-5">
                <Eye size={22} className="text-[#0f0f1a]" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Our Vision</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                To be Surat&apos;s most trusted and preferred destination for pre-owned cars, setting new standards in the industry through integrity and excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team / Owner */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title" style={{ fontFamily: 'var(--font-outfit)' }}>
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="section-subtitle mx-auto">The people behind Hariram Motors</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 max-w-2xl mx-auto text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center mx-auto mb-5 text-3xl font-bold text-[#0f0f1a]">
              HM
            </div>
            <h3 className="text-xl font-bold mb-1">Hariram Motors</h3>
            <p className="text-[var(--color-primary)] text-sm mb-4">Founder & Owner</p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-lg mx-auto">
              With over a decade of experience in the automobile industry, our founder started Hariram Motors with a simple vision — to make buying a pre-owned car as trustworthy and transparent as buying a new one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="section">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title" style={{ fontFamily: 'var(--font-outfit)' }}>
              <MapPin className="inline mr-2 text-[var(--color-primary)]" size={28} />
              Find <span className="gradient-text">Us</span>
            </h2>
            <p className="section-subtitle mx-auto">{settings.address || 'Ring Road, Surat, Gujarat 395002'}</p>
          </div>
          <div className="glass-card overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238132.5888489734!2d72.7132!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
