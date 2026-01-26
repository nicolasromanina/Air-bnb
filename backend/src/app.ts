import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import paymentRoutes from './routes/payment.routes';
import reservationRoutes from './routes/reservation.routes';
import authRoutes from './routes/auth.routes';
import optionsRoutes from './routes/options.routes';
import adminRoutes from './routes/admin.routes';
import home from './routes/home.routes';
import serviceRoutes from './routes/service.routes';
import apartmentRoutes from './routes/apartment.routes';
import apartmentDetailRoutes from './routes/apartmentDetail.routes';
import roomDetailRoutes from './routes/roomDetail.routes';
import contactRoutes from './routes/contact.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import path from 'path';

dotenv.config();

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  });
  app.use('/api/', limiter);

  // CORS configuration
  // Allow common dev origins (Vite/CRA) or use FRONTEND_URL (comma-separated)
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'];
  const envOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : [];
  const allowedOrigins = [...envOrigins, ...defaultOrigins];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests like curl/postman
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      logger.warn(`CORS request blocked from origin: ${origin}`);
      return callback(new Error('CORS not allowed from this origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-client-info'],
    maxAge: 86400, // 24 hours
  }));

  // Increase body size limits to allow larger page payloads (e.g., base64 images)
  app.use(express.json({ limit: process.env.REQUEST_LIMIT || '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '10mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      origin: req.get('origin'),
      cors: req.get('access-control-request-method') ? 'PREFLIGHT' : 'NORMAL',
    });
    next();
  });

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-app')
    .then(() => logger.info('Connected to MongoDB successfully'))
    .catch((err) => {
      logger.error('MongoDB connection error:', err);
    });

  // Routes
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/options', optionsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/home', home);
  app.use('/api/services', serviceRoutes);
  app.use('/api/apartment', apartmentRoutes);
  app.use('/api/apartment-details', apartmentDetailRoutes);
  app.use('/api/room-details', roomDetailRoutes);
  app.use('/api/contact', contactRoutes);
  // Serve uploaded files from backend/public/uploads (one level above src)
  // Serve uploaded files and allow cross-origin embedding from the frontend
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  }, express.static(path.resolve(__dirname, '..', 'public', 'uploads')));

  app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  app.use('*', (req, res) => res.status(404).json({ error: 'Route not found', path: req.originalUrl }));
  app.use(errorHandler);

  return app;
};

export default createApp;
