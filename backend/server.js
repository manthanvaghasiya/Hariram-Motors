// ═══════════════════════════════════════════════════════
//  Hariram Motors — Express API Entry Point
// ═══════════════════════════════════════════════════════

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import connectDB from './config/db.js';

// ── Custom Mongo Sanitizer ──
function sanitizeObject(obj) {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
}
function mongoSanitize() {
  return (req, _res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    next();
  };
}

// Route imports
import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import sellRequestRoutes from './routes/sellRequest.routes.js';
import messageRoutes from './routes/message.routes.js';
import happyCustomerRoutes from './routes/happyCustomer.routes.js';
import promoBannerRoutes from './routes/promoBanner.routes.js';
import siteSettingRoutes from './routes/siteSetting.routes.js';

// ── Connect to MongoDB ──
connectDB();

// ── Initialize Express ──
const app = express();

// ── Global Middleware ──
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Hariram Motors API is running' });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/sell-requests', sellRequestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/happy-customers', happyCustomerRoutes);
app.use('/api/promo-banners', promoBannerRoutes);
app.use('/api/site-settings', siteSettingRoutes);

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 Hariram Motors API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
