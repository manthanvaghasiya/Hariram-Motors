'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IconShieldCheck, IconReceipt, IconFileText, IconCar, IconCurrencyRupee, IconArrowsExchange, IconCheck } from '@tabler/icons-react';

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  return <span>{count}<span className="text-purple-400">{suffix}</span></span>;
}

export default function AboutPage() {
  return (
    <div className="bg-bg-primary min-h-screen pt-20 pb-0">

      {/* HERO — STORY INTRO */}
      <section className="relative w-full py-24 overflow-hidden">
        {/* Subtle purple radial glow */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-48 w-96 h-96 bg-purple-600/[0.08] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
              About Us
            </div>
            <h1 className="font-['Outfit'] font-bold text-[56px] text-text-primary leading-[1.1] mb-6">
              Surat&apos;s Most<br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Trusted Name</span>
            </h1>
            <p className="font-['Inter'] text-[18px] text-text-secondary leading-8 max-w-xl">
              Since 2013, Hariram Motors has been helping Surat families find their perfect car. Not with pressure. Not with gimmicks. Just honest deals, genuine cars, and people who care.
            </p>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="w-full py-16 bg-bg-secondary border-y border-border-main">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0 text-center divide-x-0 md:divide-x divide-white/[0.08]">
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Outfit'] text-[52px] font-bold text-text-primary leading-none mb-2">
                <AnimatedCounter value={500} suffix="+" />
              </span>
              <span className="font-['Inter'] text-[14px] text-text-muted uppercase tracking-wider font-medium">Happy Customers</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Outfit'] text-[52px] font-bold text-text-primary leading-none mb-2">
                <AnimatedCounter value={150} suffix="+" />
              </span>
              <span className="font-['Inter'] text-[14px] text-text-muted uppercase tracking-wider font-medium">Cars in Stock</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Outfit'] text-[52px] font-bold text-text-primary leading-none mb-2">
                <AnimatedCounter value={10} suffix="+" />
              </span>
              <span className="font-['Inter'] text-[14px] text-text-muted uppercase tracking-wider font-medium">Years of Trust</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-['Outfit'] text-[52px] font-bold text-text-primary leading-none mb-2">
                <AnimatedCounter value={100} suffix="%" />
              </span>
              <span className="font-['Inter'] text-[14px] text-text-muted uppercase tracking-wider font-medium">Transparent Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY — 2 COLUMN */}
      <section className="py-20 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-12">

            {/* Left (48%) */}
            <div className="lg:w-[48%] flex flex-col justify-center">
              <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
                Our Story
              </div>
              <h2 className="font-['Outfit'] font-bold text-[38px] text-text-primary leading-[1.2] mb-8">
                A Decade of<br />Honest Deals
              </h2>

              <div className="space-y-6 mb-12">
                <p className="font-['Inter'] text-[16px] text-text-secondary leading-8">
                  What started in 2013 as a small lot with big dreams has evolved into Surat&apos;s most trusted pre-owned car dealership. Our foundation was simple: treat every customer like family.
                </p>
                <p className="font-['Inter'] text-[16px] text-text-secondary leading-8">
                  Through sheer trust and word of mouth, we&apos;ve grown exponentially. We&apos;ve proudly served over 500 families, ensuring each one drives away with a smile and total peace of mind.
                </p>
                <p className="font-['Inter'] text-[16px] text-text-secondary leading-8">
                  Today, with a constantly refreshed inventory of over 150 meticulously inspected cars, full documentation support, and a commitment to transparency, we are Surat&apos;s go-to automotive destination.
                </p>
              </div>


            </div>

            {/* Right (52%) */}
            <div className="lg:w-[52%]">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop"
                  alt="Hariram Motors Showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="inline-flex items-center gap-2 border border-border-main rounded-lg px-4 py-2 text-[14px] text-text-secondary">
                  <span className="text-purple-400 font-bold">✓</span> 100-Point Inspection
                </div>
                <div className="inline-flex items-center gap-2 border border-border-main rounded-lg px-4 py-2 text-[14px] text-text-secondary">
                  <span className="text-purple-400 font-bold">✓</span> RC Transfer Support
                </div>
              </div>

              {/* Horizontal Timeline */}
              <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-purple-600/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <div>
                    <span className="font-bold text-text-primary mr-2">2013</span>
                    <span className="text-text-secondary">Founded</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <div>
                    <span className="font-bold text-text-primary mr-2">2018</span>
                    <span className="text-text-secondary">500 Cars Sold</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <div>
                    <span className="font-bold text-text-primary mr-2">2024</span>
                    <span className="text-text-secondary">#1 in Surat</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MISSION & VISION — 2 CARDS */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
              What Drives Us
            </div>
            <h2 className="font-['Outfit'] font-bold text-[38px] text-text-primary">
              Built on Two Promises
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-tertiary rounded-2xl p-8 border border-border-main">
              <div className="text-purple-400 text-sm uppercase tracking-wider mb-3 font-bold">
                Mission
              </div>
              <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary mb-4">
                Give every customer the best deal
              </h3>
              <p className="font-['Inter'] text-[15px] text-text-secondary leading-7">
                We are dedicated to providing the finest quality pre-owned vehicles at the most competitive prices in the market. We ensure complete transparency and zero hidden costs so that our customers always win.
              </p>
            </div>

            <div className="bg-bg-tertiary rounded-2xl p-8 border border-border-main">
              <div className="text-purple-400 text-sm uppercase tracking-wider mb-3 font-bold">
                Vision
              </div>
              <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary mb-4">
                Be Gujarat&apos;s most trusted car brand
              </h3>
              <p className="font-['Inter'] text-[15px] text-text-secondary leading-7">
                To expand our footprint across Gujarat while maintaining the intimacy and trust of a family business. We aim to set the gold standard in the pre-owned automobile industry through uncompromised integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION (Glowing SaaS Style) */}
      <section className="py-24 w-full bg-bg-primary relative overflow-hidden">
        {/* Top title glow like the image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-blue-600/20 blur-[80px]"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] font-bold text-[32px] md:text-[42px] text-text-primary tracking-wide">
              Every Automotive Service in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">One Place</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1: BUY */}
            <div className="bg-bg-secondary rounded-2xl p-8 border border-blue-500/20 flex flex-col group hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-9 h-9 rounded-full border-2 border-blue-400 text-blue-400 flex items-center justify-center font-['Outfit'] font-bold text-lg flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all">
                  1
                </div>
                <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary leading-tight mt-1">
                  Buy Premium <br /> Pre-owned Cars
                </h3>
              </div>

              <p className="font-['Inter'] text-[14px] text-text-muted leading-relaxed mb-4">
                Drive home a pristine vehicle. Every car undergoes a strict 100-point inspection, ensuring total peace of mind and non-accidental guarantees. We offer the best competitive prices in Surat.
              </p>

              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> 100-Point Quality Inspection
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Non-Accidental Guarantee
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Easy & Fast Financing
                </li>
              </ul>

              {/* Graphic 1: List with glowing cursor */}
              <div className="h-40 w-full mt-auto relative rounded-xl border border-border-subtle bg-bg-primary p-4 flex flex-col justify-end overflow-hidden group-hover:border-blue-500/20 transition-colors">
                <div className="w-full h-4 bg-white/5 rounded mb-3 flex items-center px-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  <div className="w-16 h-1.5 bg-white/10 rounded"></div>
                </div>
                <div className="w-full h-4 bg-white/5 rounded mb-3 flex items-center px-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  <div className="w-24 h-1.5 bg-white/10 rounded"></div>
                </div>
                <div className="w-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  <div className="flex-grow h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded relative shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    {/* Fake Cursor */}
                    <svg className="absolute -bottom-4 -right-2 w-8 h-8 text-text-primary drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 4.8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: SELL */}
            <div className="bg-bg-secondary rounded-2xl p-8 border border-blue-500/20 flex flex-col group hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-9 h-9 rounded-full border-2 border-blue-400 text-blue-400 flex items-center justify-center font-['Outfit'] font-bold text-lg flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all">
                  2
                </div>
                <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary leading-tight mt-1">
                  Sell Your Car <br /> Instantly
                </h3>
              </div>

              <p className="font-['Inter'] text-[14px] text-text-muted leading-relaxed mb-4">
                Get the best market value in 24 hours. Enjoy free doorstep evaluation and 100% free RC transfer without the traditional dealership hassle.
              </p>

              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Instant Payment in 24 Hrs
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Free Doorstep Evaluation
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> 100% Free RC Transfer
                </li>
              </ul>

              {/* Graphic 2: Forms and Tooltip */}
              <div className="h-40 w-full mt-auto relative rounded-xl border border-border-subtle bg-bg-primary p-4 flex flex-col justify-end gap-3 overflow-hidden group-hover:border-blue-500/20 transition-colors">
                <div className="w-3/4 h-6 border border-blue-500/40 rounded flex items-center px-2 relative">
                  <div className="w-12 h-1.5 bg-blue-500/40 rounded"></div>
                  {/* Tooltip */}
                  <div className="absolute -top-6 right-0 w-6 h-6 border border-cyan-400 rounded-md flex items-center justify-center text-cyan-400 text-[10px] font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)] bg-bg-secondary">
                    ?
                  </div>
                </div>
                <div className="w-full h-8 border border-blue-400 rounded flex items-center px-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></div>
                  <div className="w-32 h-1.5 bg-blue-400/30 rounded ml-2"></div>
                </div>
                <div className="w-2/3 h-6 border border-blue-500/40 rounded flex items-center px-2 relative">
                  <div className="w-8 h-1.5 bg-blue-500/40 rounded"></div>
                  <svg className="absolute -bottom-3 -right-3 w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 4.8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CARD 3: EXCHANGE */}
            <div className="bg-bg-secondary rounded-2xl p-8 border border-blue-500/20 flex flex-col group hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-9 h-9 rounded-full border-2 border-blue-400 text-blue-400 flex items-center justify-center font-['Outfit'] font-bold text-lg flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all">
                  3
                </div>
                <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary leading-tight mt-1">
                  Seamless Vehicle <br /> Exchange
                </h3>
              </div>

              <p className="font-['Inter'] text-[14px] text-text-muted leading-relaxed mb-4">
                Upgrade your lifestyle seamlessly by trading in your old vehicle for a new premium ride. We provide the most lucrative exchange offers in the market.
              </p>

              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Highest Market Value
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Seamless Vehicle Upgrades
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Zero Paperwork Hassle
                </li>
              </ul>

              {/* Graphic 3: Dashboard Speedometer and Button */}
              <div className="h-40 w-full mt-auto relative rounded-xl border border-border-subtle bg-bg-primary p-4 flex flex-col justify-end overflow-hidden group-hover:border-blue-500/20 transition-colors">
                <div className="w-1/2 h-1.5 bg-white/10 rounded mb-2"></div>
                <div className="w-3/4 h-1.5 bg-white/10 rounded mb-4"></div>

                {/* Fake Speedometer */}
                <div className="absolute bottom-10 right-4 w-16 h-16 border-[3px] border-cyan-400 rounded-full border-b-transparent border-l-transparent -rotate-45 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-white origin-bottom -translate-x-1/2 -translate-y-full rotate-[60deg] rounded-full drop-shadow-[0_0_3px_#fff]"></div>
                </div>

                <a href="/catalog" className="inline-flex items-center gap-2 mt-auto w-max px-4 py-1.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-[12px] font-bold rounded shadow-[0_0_15px_rgba(59,130,246,0.6)] relative z-10">
                  Explore Options &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY TRUST US — 3 ITEMS */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-purple-400 text-[11px] uppercase tracking-[0.15em] mb-4 font-bold">
              Our Promise
            </div>
            <h2 className="font-['Outfit'] font-bold text-[38px] text-text-primary">
              Why Customers Return
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-[48px] h-[48px] rounded-full bg-purple-600/[0.15] text-purple-400 flex items-center justify-center mb-4">
                <IconShieldCheck size={24} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[17px] text-text-primary mb-2">Verified Stock</h3>
              <p className="font-['Inter'] text-[14px] text-text-secondary max-w-xs leading-6">
                Every car is rigorously inspected on mechanical and cosmetic parameters before listing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-[48px] h-[48px] rounded-full bg-purple-600/[0.15] text-purple-400 flex items-center justify-center mb-4">
                <IconReceipt size={24} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[17px] text-text-primary mb-2">Honest Pricing</h3>
              <p className="font-['Inter'] text-[14px] text-text-secondary max-w-xs leading-6">
                No hidden charges, no surprises. What you see is what you pay.
              </p>
            </div>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-[48px] h-[48px] rounded-full bg-purple-600/[0.15] text-purple-400 flex items-center justify-center mb-4">
                <IconFileText size={24} />
              </div>
              <h3 className="font-['Outfit'] font-bold text-[17px] text-text-primary mb-2">Full Paperwork</h3>
              <p className="font-['Inter'] text-[14px] text-text-secondary max-w-xs leading-6">
                We handle the RC transfer, NOC, and insurance so you can focus on driving.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
