// ═══════════════════════════════════════════════════════
//  Seed Script — Create initial admin user & settings
// ═══════════════════════════════════════════════════════
//  Usage: cd backend && node seed.js
// ═══════════════════════════════════════════════════════

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import SiteSetting from './models/SiteSetting.js';
import connectDB from './config/db.js';

const seed = async () => {
  await connectDB();

  // Create admin user
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@harimotors.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@harimotors.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Seed default settings
  const defaults = {
    yearsInBusiness: 10,
    carsSold: 500,
    happyCustomers: 450,
    dealershipName: 'Hariram Motors',
    tagline: 'Your Trusted Car Partner in Surat',
    phone: '+91 93734 82016',
    whatsapp: '+919373482016',
    email: 'info@harimotors.com',
    address: 'Simada to, Canal, BRTS Rd, near Setubandh Hills, Surat, Gujarat 395006',
  };

  for (const [key, value] of Object.entries(defaults)) {
    await SiteSetting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true }
    );
  }
  console.log('✅ Default settings seeded');

  await mongoose.disconnect();
  console.log('🏁 Seed complete');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
