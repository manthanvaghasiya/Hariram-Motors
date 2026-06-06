import express from 'express';
import PromoBanner from '../models/PromoBanner.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// ── GET /api/promo-banners — Public active banners ──
router.get('/', async (_req, res) => {
  try {
    const banners = await PromoBanner.find({ isActive: true }).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/promo-banners/all — Admin list ──
router.get('/all', protect, adminOnly, async (_req, res) => {
  try {
    const banners = await PromoBanner.find().sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/promo-banners — Create (admin) ──
router.post('/', protect, adminOnly, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files?.desktopImage?.[0]) {
      const result = await uploadToCloudinary(req.files.desktopImage[0].buffer, 'hariram-motors/banners');
      data.desktopImageUrl = result.secure_url;
      data.desktopPublicId = result.public_id;
    }
    if (req.files?.mobileImage?.[0]) {
      const result = await uploadToCloudinary(req.files.mobileImage[0].buffer, 'hariram-motors/banners');
      data.mobileImageUrl = result.secure_url;
      data.mobilePublicId = result.public_id;
    }

    const banner = await PromoBanner.create(data);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/promo-banners/:id — Update (admin) ──
router.put('/:id', protect, adminOnly, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const banner = await PromoBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    if (req.files?.desktopImage?.[0]) {
      if (banner.desktopPublicId) await deleteFromCloudinary(banner.desktopPublicId);
      const result = await uploadToCloudinary(req.files.desktopImage[0].buffer, 'hariram-motors/banners');
      banner.desktopImageUrl = result.secure_url;
      banner.desktopPublicId = result.public_id;
    }
    if (req.files?.mobileImage?.[0]) {
      if (banner.mobilePublicId) await deleteFromCloudinary(banner.mobilePublicId);
      const result = await uploadToCloudinary(req.files.mobileImage[0].buffer, 'hariram-motors/banners');
      banner.mobileImageUrl = result.secure_url;
      banner.mobilePublicId = result.public_id;
    }

    if (req.body.title !== undefined) banner.title = req.body.title;
    if (req.body.link !== undefined) banner.link = req.body.link;
    if (req.body.isActive !== undefined) banner.isActive = req.body.isActive;
    if (req.body.order !== undefined) banner.order = req.body.order;

    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/promo-banners/:id ──
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await PromoBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    if (banner.desktopPublicId) await deleteFromCloudinary(banner.desktopPublicId);
    if (banner.mobilePublicId) await deleteFromCloudinary(banner.mobilePublicId);
    await PromoBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
