import express from 'express';
import Message from '../models/Message.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── POST /api/messages — Public form submission ──
router.post('/', async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/messages — Admin list ──
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total, unreadCount] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
    ]);

    res.json({ messages, total, unreadCount, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/messages/:id/read — Toggle read ──
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    message.isRead = !message.isRead;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/messages/:id ──
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
