// Format price in INR (₹)
export function formatPrice(price) {
  if (!price && price !== 0) return 'Price on Request';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// Format large numbers (e.g., 45000 → "45,000 km")
export function formatKms(kms) {
  if (!kms && kms !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN').format(kms) + ' km';
}

// Generate WhatsApp link
export function getWhatsAppLink(phone, message = '') {
  const cleanPhone = phone?.replace(/[^0-9]/g, '') || '919876543210';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

// Generate WhatsApp inquiry for a car
export function getCarInquiryLink(car, phone) {
  const message = `Hi! I'm interested in the ${car.title || `${car.year} ${car.make} ${car.model}`}${car.price ? ` priced at ${formatPrice(car.price)}` : ''}. Please share more details.`;
  return getWhatsAppLink(phone, message);
}

// Get Cloudinary optimized URL
export function getOptimizedImage(url, width = 800) {
  if (!url) return '/placeholder-car.svg';
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  return url;
}

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Slugify
export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
