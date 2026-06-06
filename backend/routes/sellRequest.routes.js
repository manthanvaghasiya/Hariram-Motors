import express from 'express';
import SellRequest from '../models/SellRequest.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// ── POST /api/sell-requests — Public form submission ──
router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const data = { ...req.body };

    // Upload photos to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, 'hariram-motors/sell-requests')
      );
      const results = await Promise.all(uploadPromises);
      data.photos = results.map(r => ({ url: r.secure_url, publicId: r.public_id }));
    }

    const sellRequest = await SellRequest.create(data);
    res.status(201).json({ message: 'Your request has been submitted successfully!', sellRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/sell-requests — Admin list ──
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total] = await Promise.all([
      SellRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      SellRequest.countDocuments(filter),
    ]);

    res.json({ requests, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/sell-requests/:id — Update status (admin) ──
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const request = await SellRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/sell-requests/:id ──
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const request = await SellRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
