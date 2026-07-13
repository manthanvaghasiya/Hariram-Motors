import express from 'express';
import Car from '../models/Car.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const router = express.Router();
// Trigger nodemon restart

// ── GET /api/cars — Public listing with filters ──
router.get('/', async (req, res) => {
  try {
    const {
      search, make, fuelType, minPrice, maxPrice, minYear, maxYear,
      transmission, bodyType, status, sort, page = 1, limit = 12,
      featured, condition,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }
    if (make) filter.make = { $regex: `^${make}$`, $options: 'i' };
    if (condition) filter.condition = condition;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (bodyType) filter.bodyType = bodyType;
    if (status) filter.status = status;
    else filter.status = { $ne: 'sold' }; // Default: hide sold cars
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = Number(minYear);
      if (maxYear) filter.year.$lte = Number(maxYear);
    }

    const sortOption = sort === 'price_asc' ? { price: 1 }
      : sort === 'price_desc' ? { price: -1 }
      : sort === 'year_desc' ? { year: -1 }
      : sort === 'year_asc' ? { year: 1 }
      : { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [cars, total] = await Promise.all([
      Car.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Car.countDocuments(filter),
    ]);

    res.json({
      cars,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/cars/filters — Get makes and brand-model map ──
router.get('/filters', async (_req, res) => {
  try {
    const activeFilter = { status: { $ne: 'sold' } };
    const makes = await Car.distinct('make', activeFilter);
    const fuelTypes = await Car.distinct('fuelType', activeFilter);
    const bodyTypes = await Car.distinct('bodyType', activeFilter);
    
    // Aggregate to get unique models per make
    const brandModelMap = await Car.aggregate([
      { $match: activeFilter },
      { $group: { _id: '$make', models: { $addToSet: '$model' } } }
    ]);
    
    res.json({
      data: {
        makes: makes.filter(Boolean).sort(),
        fuelTypes: fuelTypes.filter(Boolean).sort(),
        bodyTypes: bodyTypes.filter(Boolean).sort(),
        brandModelMap
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/cars/brands — List unique brands ──
router.get('/brands', async (_req, res) => {
  try {
    const brands = await Car.distinct('make');
    res.json(brands.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/cars/:slug — Single car by slug or ID ──
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let car;
    
    if (/^[0-9a-fA-F]{24}$/.test(slug)) {
      car = await Car.findById(slug);
    }
    
    if (!car) {
      car = await Car.findOne({ slug });
    }
    
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/cars — Create car (admin) ──
router.post('/', protect, adminOnly, upload.array('images', 20), async (req, res) => {
  try {
    const carData = { ...req.body };

    // Parse features and badges if sent as JSON string
    if (typeof carData.features === 'string') {
      try { carData.features = JSON.parse(carData.features); } catch { /* keep as is */ }
    }
    if (typeof carData.badges === 'string') {
      try { carData.badges = JSON.parse(carData.badges); } catch { /* keep as is */ }
    }

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, 'hariram-motors/cars')
      );
      const results = await Promise.all(uploadPromises);
      carData.images = results.map(r => ({ url: r.secure_url, publicId: r.public_id }));
    }

    const car = await Car.create(carData);

    // Generate slug with ID
    car.slug = `${car.year}-${car.make}-${car.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${car._id.toString().slice(-6)}`;
    await car.save();

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/cars/:id — Update car (admin) ──
router.put('/:id', protect, adminOnly, upload.array('images', 20), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const updateData = { ...req.body };

    if (typeof updateData.features === 'string') {
      try { updateData.features = JSON.parse(updateData.features); } catch { /* keep as is */ }
    }
    if (typeof updateData.badges === 'string') {
      try { updateData.badges = JSON.parse(updateData.badges); } catch { /* keep as is */ }
    }

    // Handle existing images (kept)
    if (typeof updateData.existingImages === 'string') {
      try { updateData.images = JSON.parse(updateData.existingImages); } catch { /* keep as is */ }
      delete updateData.existingImages;
    }

    // Upload new images
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, 'hariram-motors/cars')
      );
      const results = await Promise.all(uploadPromises);
      const newImages = results.map(r => ({ url: r.secure_url, publicId: r.public_id }));
      updateData.images = [...(updateData.images || []), ...newImages];
    }

    // Handle deleted images
    if (updateData.deletedImages) {
      const deleted = typeof updateData.deletedImages === 'string'
        ? JSON.parse(updateData.deletedImages) : updateData.deletedImages;
      for (const publicId of deleted) {
        await deleteFromCloudinary(publicId);
      }
      delete updateData.deletedImages;
    }

    Object.assign(car, updateData);
    await car.save();

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/cars/:id — Delete car (admin) ──
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    // Delete images from Cloudinary
    for (const img of car.images) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
