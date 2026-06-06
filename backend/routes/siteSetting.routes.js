import express from 'express';
import SiteSetting from '../models/SiteSetting.js';
import Car from '../models/Car.js';
import HappyCustomer from '../models/HappyCustomer.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Default settings
const defaultSettings = {
  yearsInBusiness: 10,
  carsSold: 500,
  happyCustomers: 450,
  dealershipName: 'Hariram Motors',
  tagline: 'Your Trusted Car Partner in Surat',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  email: 'info@harimotors.com',
  address: 'Ring Road, Surat, Gujarat 395002',
  googleMapsUrl: '',
  aboutText: 'Hariram Motors has been serving customers in Surat with the best selection of pre-owned cars. We believe in transparency, quality, and customer satisfaction.',
  missionText: 'To provide the finest quality pre-owned vehicles at the most competitive prices, with complete transparency and exceptional after-sales service.',
};

// ── GET /api/site-settings — Public ──
router.get('/', async (_req, res) => {
  try {
    const settings = await SiteSetting.find();
    const result = { ...defaultSettings };

    settings.forEach(s => {
      result[s.key] = s.value;
    });

    // Add dynamic stats
    const [totalCars, totalCustomers] = await Promise.all([
      Car.countDocuments({ status: 'available' }),
      HappyCustomer.countDocuments({ isActive: true }),
    ]);
    result.availableCars = totalCars;
    result.activeTestimonials = totalCustomers;

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/site-settings — Update (admin) ──
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await SiteSetting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
