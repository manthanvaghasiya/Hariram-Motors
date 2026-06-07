'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  IconArrowLeft, IconMaximize, IconCalendarMonth, IconDashboard, 
  IconGasStation, IconManualGearbox, IconUser, IconMapPin, 
  IconShieldCheck, IconBrandWhatsapp, IconPhoneCall, IconInfoCircle,
  IconArrowRight
} from '@tabler/icons-react';
import api from '@/lib/api';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink } from '@/lib/utils';
import CarCard from '@/components/CarCard';

export default function CarDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Smart Sticky State
  const rightColumnRef = useRef(null);
  const [stickyTop, setStickyTop] = useState('120px');

  useEffect(() => {
    const handleResize = () => {
      if (!rightColumnRef.current) return;
      const elementHeight = rightColumnRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      if (elementHeight > windowHeight - 144) {
        // Taller than screen -> Stick to the bottom (negative top)
        const top = windowHeight - elementHeight - 24;
        setStickyTop(`${top}px`);
      } else {
        // Shorter than screen -> Stick to top
        setStickyTop('120px');
      }
    };

    // Delay slighty to ensure fonts/images are rendered
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    
    let observer;
    if (window.ResizeObserver && rightColumnRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(rightColumnRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [car]);

  useEffect(() => {
    const fetchCarAndSimilar = async () => {
      try {
        const res = await api.get(`/cars/${slug}`);
        const fetchedCar = res.data;
        setCar(fetchedCar);
        
        // Fetch similar cars
        const similarRes = await api.get(`/cars?make=${fetchedCar.make}&status=available&limit=4`);
        if (similarRes.data?.cars) {
          // Filter out the current car and limit to 3
          setSimilarCars(similarRes.data.cars.filter(c => c._id !== fetchedCar._id).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch car details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCarAndSimilar();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Car Not Found</h1>
        <p className="text-gray-400 mb-8">The vehicle you are looking for may have been sold or removed.</p>
        <Link href="/catalog" className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold">
          Back to Catalog
        </Link>
      </main>
    );
  }

  const displayYear = car.registerYear || car.year;
  const yearText = displayYear ? `(${displayYear})` : '';
  const title = `${car.make} ${car.model} ${yearText}`.trim();
  const images = car.images || [];

  const hasBadges = car.badges && car.badges.length > 0;
  const isSold = car.status === 'sold';

  // Extract special badges from features/badges to show on photo and EMI section
  const specialBadgeNames = ['Certified', 'Peti-pack', 'Valid Vimo'];
  const photoBadges = [];
  const regularFeatures = [];
  let isLoanAvailable = car.loanAvailable;

  const hasExplicitBadges = Array.isArray(car.badges) && car.badges.length > 0;
  if (hasExplicitBadges) {
    photoBadges.push(...car.badges.filter(b => specialBadgeNames.includes(b)));
  }

  const allFeatures = [...(car.badges || []), ...(car.features || [])];
  allFeatures.forEach(feat => {
    const isSpecialBadge = specialBadgeNames.some(b => feat.toLowerCase().includes(b.toLowerCase()));
    if (isSpecialBadge) {
      if (!hasExplicitBadges && !photoBadges.includes(feat)) photoBadges.push(feat);
    } else if (feat.toLowerCase().includes('loan available')) {
      isLoanAvailable = true;
    } else {
      if (!regularFeatures.includes(feat)) regularFeatures.push(feat);
    }
  });

  return (
    <main className="flex-grow pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-400">
        <button onClick={() => router.back()} className="hover:text-purple-400 transition-colors flex items-center gap-1 group">
          <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>
      </nav>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ════ LEFT COLUMN: Gallery & Description ════ */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#12121f] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
              {images.length > 0 ? (
                <Image 
                  src={getOptimizedImage(images[activeImageIdx]?.url, 1200)} 
                  alt={title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">No Image Available</div>
              )}
              


              {isSold && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] pointer-events-none z-10">
                  <div className="border-4 border-red-500 text-red-500 font-bold text-5xl md:text-7xl tracking-widest px-8 py-2 rounded-lg bg-[#0a0a12]/60 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                    SOLD
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 snap-x">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIdx(idx)}
                    className={`shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start relative ${activeImageIdx === idx ? 'border-purple-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={getOptimizedImage(img.url, 300)} alt={`${title} ${idx+1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl p-6 md:p-8 mt-4">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>About this Car</h2>
            <div className="text-gray-300 mb-8 leading-relaxed whitespace-pre-wrap">
              {car.description || `Experience the pinnacle of automotive engineering with this meticulously maintained ${title}. This vehicle blends everyday usability with unparalleled performance.`}
            </div>

            {regularFeatures.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Key Features & Highlights</h3>
                <div className="flex flex-wrap gap-3">
                  {regularFeatures.map((feat, i) => (
                    <span key={`feat-${i}`} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                      {feat}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ════ RIGHT COLUMN: Info ════ */}
        <div className="lg:col-span-5 relative">
          <div 
            ref={rightColumnRef}
            className="lg:sticky flex flex-col gap-6"
            style={{ top: stickyTop }}
          >
            
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-white/10">
                  Pre-Owned
                </span>
                {(car.registration || car.registrationState) && (
                  <span className="text-gray-400 text-xs font-medium uppercase">
                    RTO: {car.registration || car.registrationState}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-[40px] text-white font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                {title}
              </h1>
              <p className="text-3xl font-bold text-purple-400 mb-5">
                {formatPrice(car.price)}
              </p>
              
              {/* Badges & Loan Info */}
              {(photoBadges.length > 0 || isLoanAvailable) && (
                <div className="flex flex-wrap gap-3">
                  {photoBadges.map((badge, i) => (
                    <div key={`special-badge-${i}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-xl py-2 px-4 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                      <IconShieldCheck className="text-purple-400" size={18} />
                      <span className="text-sm font-bold text-white uppercase tracking-wide">
                        {badge}
                      </span>
                    </div>
                  ))}

                  {isLoanAvailable && (
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl py-2 px-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <IconShieldCheck className="text-emerald-400" size={18} />
                      <span className="text-sm font-bold text-emerald-400 uppercase tracking-wide">
                        Loan Available
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Specs Card (Bento Grid) */}
            <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.05)]">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-400">
                    <IconCalendarMonth size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Mfg. Year</p>
                    <p className="text-base text-white font-semibold">{car.year || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-400">
                    <IconDashboard size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Kilometers</p>
                    <p className="text-base text-white font-semibold">{car.kms ? formatKms(car.kms) : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-400">
                    <IconGasStation size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Fuel Type</p>
                    <p className="text-base text-white font-semibold">{car.fuelType || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-400">
                    <IconManualGearbox size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Transmission</p>
                    <p className="text-base text-white font-semibold">{car.transmission || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-400">
                    <IconUser size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Owners</p>
                    <p className="text-base text-white font-semibold">{car.owners || '1st Owner'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-400">
                    <IconShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Insurance</p>
                    <p className="text-base text-white font-semibold">{car.insurance || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-4 bg-[#12121f] border border-purple-500/30 rounded-xl p-5 mt-2 shadow-lg">
              <IconShieldCheck size={32} className="text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Hariram Certified Pre-Owned</p>
                <p className="text-sm text-gray-400 mt-0.5">150-Point Inspection Completed</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 mt-2">
              <a 
                href={getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919898558222')}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-[0.98] ${
                  isSold 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                  : 'bg-[#25D366] text-black hover:bg-[#20bd5a] shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]'
                }`}
                onClick={(e) => isSold && e.preventDefault()}
              >
                <IconBrandWhatsapp size={22} />
                {isSold ? 'Vehicle Sold' : 'Chat on WhatsApp'}
              </a>
              
              <a 
                href="tel:+919373482016"
                className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md transform active:scale-[0.98]"
              >
                <IconPhoneCall size={22} />
                Call Us Now
              </a>
            </div>
            
          </div>
        </div>
      </div>

      {/* ════ Similar Cars Section ════ */}
      {similarCars.length > 0 && (
        <section className="mt-32 border-t border-white/10 pt-16">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Similar Vehicles</h2>
            <Link href={`/catalog?make=${car.make}`} className="text-purple-400 font-bold hover:underline flex items-center gap-1 group">
              View All {car.make} <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((similarCar, i) => (
              <CarCard key={similarCar._id} car={similarCar} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
