import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import { seedDatabase } from './seed.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import educationRoutes from './routes/education.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isVercel = Boolean(process.env.VERCEL);

// Ensure uploads directory exists safely
const uploadsDir = isVercel
  ? path.join(os.tmpdir(), 'uploads', 'resumes')
  : path.join(__dirname, 'uploads', 'resumes');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Storage Notice] uploadsDir:', err.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-imgbb-key'],
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploaded assets
const staticUploadsDir = isVercel
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(staticUploadsDir));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Shahreyar Tonmoy Portfolio API',
    database: getDBStatus() ? 'connected' : 'cached_mode',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Auto-connect database for serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Start Server & Connect Database (Standard Node environment)
const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎛️ Admin API: http://localhost:${PORT}/api/auth`);
    console.log(`🖼️ ImgBB Upload API: http://localhost:${PORT}/api/upload`);
    console.log(`===============================================`);
  });
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
